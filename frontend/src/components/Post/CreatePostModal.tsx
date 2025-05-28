import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    if (!title || !description || !uploadedImageUrl) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("imgUrl", uploadedImageUrl);
    formData.append("isVisible", isVisible.toString());
    await onSubmit(formData);
    setTitle("");
    setDescription("");
    setUploadedImageUrl(null);
    setPreviewUrl(null);
    setIsVisible(true);
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
      const uploaded = await res.json();

      setUploadedImageUrl(uploaded.url);
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
          maxHeight: "90vh",
          overflow: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
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

        {/* Chọn ảnh */}
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

        {/* Switch bật/tắt hiển thị */}
        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "var(--color-primary)",
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
          label="Hiển thị trên trang người dùng"
          sx={{ mb: 2 }}
        />

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
