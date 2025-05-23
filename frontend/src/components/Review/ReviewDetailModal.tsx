import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { del, get, patch, post } from "@/services/callApi";

const ReviewDetailModal = ({ open, onClose, review }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const fetchComments = async () => {
    if (review?.id) {
      const res = await get(`review-comment/${review.id}`);
      setComments(res.data);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await post(`/review-comment`, {
        reviewId: review.id,
        parentId:  review.id,
      comment: newComment,
    });
    setNewComment("");
    fetchComments();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xoá bình luận này?")) {
      await del(`/review-comment/${id}`);
      fetchComments();
    }
  };

  const handleEdit = (id: number, current: string) => {
    setEditingId(id);
    setEditingContent(current);
  };

  const handleUpdate = async () => {
    if (!editingContent.trim() || editingId === null) return;
    await patch(`/review-comment/edit/${editingId}`, {
      comment: editingContent,
    });
    setEditingId(null);
    setEditingContent("");
    fetchComments();
  };

  useEffect(() => {
    if (open) fetchComments();
  }, [open, review]);

  if (!review) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", p: 4, borderRadius: 2, width: 600, maxHeight: "90vh", overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Chi tiết đánh giá</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Typography><b>Người đánh giá:</b> {review.user?.email}</Typography>
        <Typography><b>Sản phẩm:</b> {review.product?.name}</Typography>
        <Typography sx={{ mt: 1 }}><b>Nội dung:</b> {review.review}</Typography>
        {review.imageUrl && (
          <Box mt={1}>
            <img src={review.imageUrl} alt="Ảnh đánh giá" style={{ width: "100%", borderRadius: 4 }} />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          Bình luận từ Quản trị viên
        </Typography>

        <List dense>
          {comments.map((c) => (
            <ListItem key={c.id} alignItems="flex-start" secondaryAction={
              <Box>
                <Tooltip title="Sửa">
                  <IconButton onClick={() => handleEdit(c.id, c.comment)}><EditIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Xoá">
                  <IconButton onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton>
                </Tooltip>
              </Box>
            }>
              {editingId === c.id ? (
                <Box width="100%">
                  <TextField
                    fullWidth
                    size="small"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <Button size="small" onClick={handleUpdate} sx={{ mt: 1 }}>Lưu</Button>
                </Box>
              ) : (
                <ListItemText primary={c.user?.email} secondary={c.comment} />
              )}
            </ListItem>
          ))}
        </List>

        <TextField
          fullWidth
          placeholder="Trả lời đánh giá..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mt: 2 }}
          multiline
          rows={2}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
          fullWidth
          onClick={handleSubmit}
        >
          Gửi phản hồi
        </Button>
      </Box>
    </Modal>
  );
};

export default ReviewDetailModal;
