import React from "react";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Post } from "@/types/post";

interface PostTableProps {
  posts: Post[];
  onView: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({
  posts,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fff3cd" }}>
            <TableCell>Mã bài</TableCell>
            <TableCell>Hình ảnh</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Ngày đăng</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} hover>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                <Avatar
                  variant="rounded"
                  src={post.imgUrl}
                  alt={post.title}
                  sx={{ width: 56, height: 56 }}
                />
              </TableCell>
              <TableCell>
                <b>{post.title}</b>
              </TableCell>
              <TableCell>
                {post.description.length > 50
                  ? post.description.slice(0, 50) + "..."
                  : post.description}
              </TableCell>
              <TableCell>
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Xem chi tiết">
                  <IconButton onClick={() => onView(post)}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <IconButton onClick={() => onEdit(post)}>
                    <EditIcon color="warning" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xoá">
                  <IconButton onClick={() => onDelete(post.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostTable;
