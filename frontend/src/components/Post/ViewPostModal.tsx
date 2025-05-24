import React from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import { Post } from "@/types/post";

interface ViewPostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
}

const ViewPostModal: React.FC<ViewPostModalProps> = ({
  open,
  onClose,
  post,
}) => {
  if (!post) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          outline: "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          width: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Box
          component="img"
          src={post.imgUrl}
          alt={post.title}
          sx={{
            width: 400,
            height: 400,
            objectFit: "fill",
            borderRadius: 1,
            mb: 2,
            display: "block",
            mx: "auto",
          }}
        />
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ngày đăng: {new Date(post.createdAt).toLocaleString("vi-VN")}
        </Typography>
        <Box mt={3} textAlign="right">
          <Button
            variant="outlined"
            sx={{
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              "&:hover": {
                borderColor: "var(--color-primary)",
                backgroundColor: "#f7f7f7",
              },
            }}
            onClick={onClose}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewPostModal;
