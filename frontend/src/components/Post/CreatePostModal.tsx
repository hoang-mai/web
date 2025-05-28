import React, { useState, useRef } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
  onCreated,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    if (!title || !description || !imageUrl) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("imgUrl", imageUrl);

    await onSubmit(formData);
    setTitle("");
    setDescription("");
    setImageFile(null);
    setPreviewUrl(null);
    onCreated();
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
      const uploadedImageUrl = await res.json();
      setImageFile(uploadedImageUrl.url);
      setPreviewUrl(URL.createObjectURL(file));
      setLoading(false);
    }
  };

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
          Đăng bài viết mới
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

        {/* Khung chọn ảnh */}
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
            bgcolor: "var(--color-primary)",
          }}
          fullWidth
          onClick={handleSubmit}
        >
          Đăng bài
        </Button>
      </Box>
    </Modal>
  );
};

export default CreatePostModal;
