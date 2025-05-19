import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Post } from "@/types/post";
import PostTable from "@/components/Post/PostTable";
import CreatePostModal from "@/components/Post/CreatePostModal";
import EditPostModal from "@/components/Post/EditPostModal";
import ViewPostModal from "@/components/Post/ViewPostModal";
import { toast } from "react-toastify";
import { del, get, post, put } from "@/services/callApi";
import { postsRoute } from "@/services/api";

const PostAdmin: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await get(postsRoute + "/admin-side");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Không thể tải danh sách bài viết");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      await post(postsRoute + "/create", formData);
      toast.success("Đăng bài viết thành công!");
      fetchPosts();
    } catch {
      toast.error("Lỗi khi đăng bài viết!");
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      await put(`${postsRoute}/${id}`, formData);
      toast.success("Cập nhật bài viết thành công!");
      fetchPosts();
    } catch {
      toast.error("Lỗi khi cập nhật bài viết!");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xoá bài viết này?")) {
      try {
        await del(`${postsRoute}/${id}`);
        toast.success("Đã xoá bài viết!");
        fetchPosts();
      } catch {
        toast.error("Lỗi khi xoá bài viết!");
      }
    }
  };

  const handleView = (post: Post) => {
    setSelectedPost(post);
    setOpenView(true);
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setOpenEdit(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8f9fa" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600, color: "#1a3353" }}
      >
        Quản Lý Bài Viết
      </Typography>

      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Danh sách bài viết</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              color: "black",
              fontWeight: "medium",
              borderRadius: 2,
              bgcolor: "var(--color-tertiary)",
            }}
            onClick={() => setOpenCreate(true)}
          >
            Tạo bài viết mới
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <PostTable
          posts={posts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <CreatePostModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={fetchPosts}
        onSubmit={handleCreate}
      />

      <EditPostModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        post={selectedPost}
        onUpdated={fetchPosts}
        onSubmit={handleUpdate}
      />

      <ViewPostModal
        open={openView}
        onClose={() => setOpenView(false)}
        post={selectedPost}
      />
    </Box>
  );
};

export default PostAdmin;
