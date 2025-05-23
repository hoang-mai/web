import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Tooltip,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TagIcon from "@mui/icons-material/LocalOfferOutlined";
import DoneIcon from "@mui/icons-material/CheckCircleOutline";
import ReplyIcon from "@mui/icons-material/ReplyOutlined";
import dayjs from "dayjs";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import 'dayjs/locale/vi'; 
dayjs.locale('vi');       

const ReviewList = ({ reviews, onView, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const renderStars = (count: number) => {
    const full = Array(count).fill(<StarIcon fontSize="small" sx={{ color: '#fbbc04' }} />);
    const empty = Array(5 - count).fill(<StarBorderIcon fontSize="small" sx={{ color: '#fbbc04' }} />);
    return [...full, ...empty];
  };

  const uniqueProducts = Array.from(new Set(reviews.map(r => r.product?.name).filter(Boolean)));

  return (
    <Box display="flex" maxWidth="100wh">
      <Box
        position="fixed"
        top={0}
        left={256}
        width="100%"
        zIndex={10}
        bgcolor="#fff"
        boxShadow={1}
        padding="18.3px"
      >
        <Typography fontSize="var(--text-xl)" fontWeight="var(--font-weight-bold)">
          Quản lý đánh giá sản phẩm
        </Typography>
        <Box display="flex" gap={4} mt={2}>
          <FormControl size="small" sx={{ width: '200px' }}>
            <InputLabel>Sản phẩm</InputLabel>
            <Select defaultValue="" label="Sản phẩm">
              <MenuItem value="">Tất cả</MenuItem>
              {uniqueProducts.map((name, idx) => (
                <MenuItem key={idx} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: '200px' }}>
            <InputLabel>Sao</InputLabel>
            <Select defaultValue="" label="Sao">
              <MenuItem value="">Tất cả</MenuItem>
              {[5, 4, 3, 2, 1].map((count) => (
                <MenuItem key={count} value={count}>
                  {Array(count).fill(0).map((_, i) => (
                    <StarIcon key={i} fontSize="small" sx={{ color: '#fbbc04' }} />
                  ))}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: '200px' }}>
            <InputLabel>Thẻ</InputLabel>
            <Select defaultValue="" label="Thẻ">
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="report">Báo cáo</MenuItem>
              <MenuItem value="resolved">Đã xử lý</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box flex={1} display="flex" justifyContent="center" mt={15}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '60%', py: 4 }}>
          {reviews.map((review) => (
            <Paper key={review.id} elevation={2} sx={{ position: "relative", bgcolor: "#fff", borderRadius: "6px", border:"1px solid", borderColor:"#ced4da" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={1} borderColor={"#ced4da"} paddingX={2} paddingY={1}>
                <Box display="flex" gap={2} alignItems="center">
                  <Avatar src={review.user?.imageUrl} />
                  <Box>
                    <Typography fontWeight={600}>
                      {review.user?.email || "Ẩn danh"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.product?.name || "[SP đã xoá]"}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(review.createdAt).format("DD/MM/YYYY")}
                </Typography>
              </Box>

              <Box mt={1} display="flex" alignItems="center" gap={0.5} paddingLeft={3}>
                {renderStars(review.rating || 0)}
              </Box>

              <Typography mt={1} paddingLeft={3}>{review.review}</Typography>

              {review.imageUrl && (
                <Box mt={1} paddingLeft={3}>
                  <img
                    src={review.imageUrl}
                    alt="review-img"
                    style={{ maxWidth: "250px", borderRadius: 8 }}
                  />
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" mt={1} paddingRight={2}>
                <Box />
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title="Gắn thẻ">
                    <IconButton><TagIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Đánh dấu đã xử lý">
                    <IconButton><DoneIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Phản hồi">
                    <IconButton><ReplyIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Tuỳ chọn">
                    <IconButton onClick={(e) => handleMenuClick(e, review.id)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedId === review.id}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); onView(review); }}>Xem chi tiết</MenuItem>
                <MenuItem onClick={() => { handleClose(); onDelete(review.id); }}>Xoá đánh giá</MenuItem>
              </Menu>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ReviewList;
