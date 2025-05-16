import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Post } from "@/types/post";

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onUpdated: () => void;
  onSubmit: (id: number, formData: FormData) => Promise<void>;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  open,
  onClose,
  post,
  onUpdated,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setImageFile(null);
      setPreviewUrl(post.imgUrl || null); // Lấy ảnh hiện có từ post
    }
  }, [post]);

  const handleSubmit = async () => {
    if (!post) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    await onSubmit(post.id, formData);
    onUpdated();
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!post) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          width: 500,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chỉnh sửa bài viết
        </Typography>

        <TextField
          fullWidth
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Mô tả"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Giao diện chọn ảnh */}
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Box
            sx={{
              width: 250,
              height: 250,
              border: "2px dashed #ccc",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fafafa",
              overflow: "hidden",
            }}
          >
            {previewUrl ? (
              <Box
                component="img"
                src={previewUrl}
                alt="preview"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography color="textSecondary" align="center">
                Chưa có ảnh sản phẩm
              </Typography>
            )}
          </Box>

          <Box>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button
              variant="outlined"
              sx={{
                borderColor: "#ffc107",
                color: "black",
                fontWeight: 500,
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Tải ảnh lên
            </Button>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{
            color: "black",
            fontWeight: "medium",
            borderRadius: 2,
            bgcolor: "var(--color-secondary)",
          }}
          fullWidth
          onClick={handleSubmit}
        >
          Cập nhật bài viết
        </Button>
      </Box>
    </Modal>
  );
};

export default EditPostModal;
