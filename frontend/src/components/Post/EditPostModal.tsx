import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setUploadedImageUrl(null);
      setPreviewUrl(post.imgUrl || null);
      setIsVisible(post.isVisible ?? true);
    }
  }, [post]);

  const handleSubmit = async () => {
    if (!post) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (uploadedImageUrl) formData.append("imgUrl", uploadedImageUrl);
    formData.append("isVisible", isVisible.toString());

    await onSubmit(post.id, formData);
    onUpdated();
    onClose();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "Posts_imgs");
      data.append("cloud_name", "dhituyxjn");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhituyxjn/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploaded = await res.json();

      setUploadedImageUrl(uploaded.url);
      setPreviewUrl(URL.createObjectURL(file));
      setLoading(false);
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
          maxHeight: "90vh",
          overflow: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          mb={2}
        >
          <Typography variant="h6" gutterBottom>
            Chỉnh sửa bài viết
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#ffc107",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#ffc107",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#ccc",
                  },
                }}
              />
            }
            label="Hiển thị"
            labelPlacement="start"
            sx={{ whiteSpace: "nowrap" }}
          />
        </Box>

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
            {previewUrl && !loading ? (
              <Box
                component="img"
                src={previewUrl}
                alt="preview"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : loading ? (
              <Typography color="textSecondary" align="center">
                Đang tải ảnh...
              </Typography>
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
