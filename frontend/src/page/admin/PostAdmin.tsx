import React, { useEffect, useState } from "react";
import { Container, Paper, Box, CircularProgress } from "@mui/material";
import ViewPostModal from "@/components/Post/ViewPostModal";
import CreatePostModal from "@/components/Post/CreatePostModal";
import EditPostModal from "@/components/Post/EditPostModal";
import { toast } from "react-toastify";
import { del, get, post, put } from "@/services/callApi";
import { postsRoute } from "@/services/api";
import { Post } from "@/types/post";
import PostTable from "@/components/Post/PostTable";

const PostAdmin = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await get(postsRoute + "/admin-side");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
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
    setOpenDetail(true);
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setOpenEdit(true);
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ m: 0, p: 0, width: "100%" }}
    >
      <Paper sx={{ m: 0, p: 0, boxShadow: "none", border: "none" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <PostTable
            posts={posts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={() => setOpenCreate(true)}
          />
        )}
      </Paper>

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
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        post={selectedPost}
      />
    </Container>
  );
};

export default PostAdmin;
