import React, { useState } from 'react';
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
  Button,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TagIcon from '@mui/icons-material/LocalOfferOutlined';
import DoneIcon from '@mui/icons-material/CheckCircleOutline';
import ReplyIcon from '@mui/icons-material/ReplyOutlined';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useOutletContext } from 'react-router-dom';
import 'dayjs/locale/vi';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const ReviewList = ({ reviews, onView, onDelete }) => {
  const { drawerWidth } = useOutletContext<{ drawerWidth: number }>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [productFilter, setProductFilter] = useState('');
  const [starFilter, setStarFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const renderStars = (count: number) => {
    const full = Array(count).fill(
      <StarIcon fontSize="small" sx={{ color: '#fbbc04' }} />,
    );
    const empty = Array(5 - count).fill(
      <StarBorderIcon fontSize="small" sx={{ color: '#fbbc04' }} />,
    );
    return [...full, ...empty];
  };

  const uniqueProducts = Array.from(
    new Set(reviews.map((r) => r.product?.name).filter(Boolean)),
  );

  const filteredReviews = reviews.filter((review) => {
    const matchProduct = productFilter
      ? review.product?.name === productFilter
      : true;
    const matchStar = starFilter
      ? review.rating === parseInt(starFilter)
      : true;
    const matchTag = tagFilter
      ? tagFilter === 'report'
        ? review.reported === true
        : tagFilter === 'resolved'
        ? review.isResolved === true
        : true
      : true;
    const matchKeyword =
      searchKeyword.trim() !== ''
        ? review.review?.toLowerCase().includes(searchKeyword.toLowerCase())
        : true;
    const matchFrom = fromDate
      ? dayjs(review.createdAt).isAfter(dayjs(fromDate).startOf('day'))
      : true;
    const matchTo = toDate
      ? dayjs(review.createdAt).isBefore(dayjs(toDate).endOf('day'))
      : true;

    return (
      matchProduct &&
      matchStar &&
      matchTag &&
      matchKeyword &&
      matchFrom &&
      matchTo
    );
  });

  return (
    <Box display="flex">
      <Box
        position="fixed"
        top={0}
        left={drawerWidth}
        width={`calc(100% - ${drawerWidth}px)`}
        zIndex={10}
        bgcolor="#fff"
        boxShadow={1}
        padding="18.3px"
      >
        <Box display="flex" justifyContent={'space-between'}>
          <Typography
            fontSize="var(--text-xl)"
            fontWeight="var(--font-weight-bold)"
          >
            Quản lý đánh giá sản phẩm
          </Typography>
          <Box display="flex" gap={4}>
            <TextField
              sx={{ width: '200px' }}
              size="small"
              placeholder="Tìm kiếm nội dung đánh giá"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: '200px', height: '40px' }}
                label="Từ ngày"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    placeholder: 'Chọn ngày bắt đầu',
                    fullWidth: true,
                  },
                }}
              />
              <DatePicker
                sx={{ width: '200px', height: '40px' }}
                label="Đến ngày"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    placeholder: 'Chọn ngày kết thúc',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        <Box display="flex" mt={2} justifyContent={'space-between'}>
          <Box display="flex" gap={4}>
            <FormControl size="small" sx={{ width: '200px' }}>
              <InputLabel>Sản phẩm</InputLabel>
              <Select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                label="Sản phẩm"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {uniqueProducts.map((name, idx) => (
                  <MenuItem key={idx} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: '200px' }}>
              <InputLabel>Sao</InputLabel>
              <Select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                label="Sao"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {[5, 4, 3, 2, 1].map((count) => (
                  <MenuItem key={count} value={count.toString()}>
                    {Array(count)
                      .fill(0)
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          fontSize="small"
                          sx={{ color: '#fbbc04' }}
                        />
                      ))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: '200px' }}>
              <InputLabel>Thẻ</InputLabel>
              <Select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                label="Thẻ"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="report">Báo cáo</MenuItem>
                <MenuItem value="resolved">Đã xử lý</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: '#333533',
                fontSize: '.8rem',
                fontWeight: '600',
                borderColor: '#f5bd1f',
                bgcolor: '#f5bd1f',
              }}
              startIcon={<RestartAltIcon />}
              onClick={() => {
                setProductFilter('');
                setStarFilter('');
                setTagFilter('');
                setSearchKeyword('');
                setFromDate(null);
                setToDate(null);
              }}
            >
              Cài lại
            </Button>
          </>
        </Box>
      </Box>

      <Box flex={1} display="flex" justifyContent="center" mt={15}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '60%', py: 4 }}>
          {filteredReviews.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" mt={4}>
              Không có kết quả tìm kiếm phù hợp.
            </Typography>
          ) : (
            filteredReviews.map((review) => (
              <Paper
                key={review.id}
                elevation={2}
                sx={{
                  position: 'relative',
                  bgcolor: '#fff',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: '#ced4da',
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={1}
                  borderColor={'#ced4da'}
                  paddingX={2}
                  paddingY={1}
                >
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar src={review.user?.imageUrl} />
                    <Box>
                      <Typography fontWeight={600}>
                        {review.user?.email || 'Ẩn danh'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.product?.name || '[SP đã xoá]'}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(review.createdAt)
                      .tz('Asia/Ho_Chi_Minh')
                      .format('DD/MM/YYYY HH:mm')}
                  </Typography>
                </Box>

                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  paddingLeft={3}
                >
                  {renderStars(review.rating || 0)}
                </Box>

                <Typography mt={1} paddingLeft={3}>
                  {review.review}
                </Typography>

                {review.imageUrl && (
                  <Box mt={1} paddingLeft={3}>
                    <img
                      src={review.imageUrl}
                      alt="review-img"
                      style={{ maxWidth: '250px', borderRadius: 8 }}
                    />
                  </Box>
                )}

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={1}
                  paddingRight={2}
                >
                  <Box />
                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Gắn thẻ">
                      <IconButton>
                        <TagIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Đánh dấu đã xử lý">
                      <IconButton>
                        <DoneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Phản hồi">
                      <IconButton>
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Tuỳ chọn">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, review.id)}
                      >
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
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      onView(review);
                    }}
                  >
                    Xem chi tiết
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      onDelete(review.id);
                    }}
                  >
                    Xoá đánh giá
                  </MenuItem>
                </Menu>
              </Paper>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ReviewList;
