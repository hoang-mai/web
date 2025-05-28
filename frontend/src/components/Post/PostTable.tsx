import React, { useState } from "react";
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
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Post } from "@/types/post";

interface PostTableProps {
  posts: Post[];
  onView: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  onCreate: () => void;
}

const PostTable: React.FC<PostTableProps> = ({
  posts,
  onView,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const [search, setSearch] = useState("");
  const [isVisibleFilter, setIsVisibleFilter] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const filteredPosts = posts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchVisible =
      isVisibleFilter !== ""
        ? isVisibleFilter === "true"
          ? post.isVisible
          : !post.isVisible
        : true;
    const matchFrom = fromDate
      ? dayjs(post.createdAt).isAfter(dayjs(fromDate).startOf("day"))
      : true;
    const matchTo = toDate
      ? dayjs(post.createdAt).isBefore(dayjs(toDate).endOf("day"))
      : true;
    return matchSearch && matchVisible && matchFrom && matchTo;
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Quản lý bài viết
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "var(--color-tertiary)",
            color: "black",
            fontWeight: 500,
            borderRadius: 2,
          }}
          onClick={onCreate}
        >
          Tạo bài viết mới
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          size="small"
          placeholder="Tìm kiếm tiêu đề"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        />

        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={isVisibleFilter}
            onChange={(e) => setIsVisibleFilter(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Hiển thị</MenuItem>
            <MenuItem value="false">Đã ẩn</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Từ ngày"
            value={fromDate}
            onChange={setFromDate}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="Đến ngày"
            value={toDate}
            onChange={setToDate}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>

        <Button
          size="small"
          variant="outlined"
          sx={{
            color: "#333533",
            fontSize: ".8rem",
            fontWeight: "600",
            borderColor: "#f5bd1f",
            bgcolor: "#f5bd1f",
          }}
          startIcon={<RestartAltIcon />}
          onClick={() => {
            setSearch("");
            setIsVisibleFilter("");
            setFromDate(null);
            setToDate(null);
          }}
        >
          Cài lại
        </Button>
      </Box>

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
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có bài viết nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={post.imgUrl}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PostTable;
