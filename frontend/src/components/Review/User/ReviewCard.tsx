import dayjs from 'dayjs';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Card,
  CardContent,
  Stack,
} from '@mui/material';

export default function ReviewCard({
  review,
  onImageClick,
}: {
  review: any;
  onImageClick?: (url: string) => void;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Người dùng */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar>{review.user?.fullName?.[0] || '?'}</Avatar>
            <Box>
              <Typography fontWeight="bold">
                {review.user?.firstName + ' ' + review.user?.lastName ||
                  'Ẩn danh'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dayjs(review.createdAt)
                  .tz('Asia/Ho_Chi_Minh')
                  .format('DD/MM/YYYY HH:mm') || 'Không rõ thời gian'}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Đánh giá sao */}
        <Rating
          value={review.rating || 0}
          readOnly
          precision={0.5}
          sx={{ mt: 1 }}
        />

        {/* Nội dung đánh giá */}
        {review.review && (
          <Typography variant="body2" mt={1}>
            {review.review}
          </Typography>
        )}

        {/* Hình ảnh nếu có */}
        {review.imageUrl && (
          <Box
            component="img"
            src={review.imageUrl}
            alt="Ảnh đánh giá"
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              mt: 2,
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => onImageClick?.(review.imageUrl)}
          />
        )}

        {/* Số lượt thích */}
        {review.likeCount > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            mt={1}
            display="block"
          >
            {review.likeCount} lượt thích
          </Typography>
        )}
        {/* Phản hồi của quản trị viên (nếu có) */}
        {review.reviewComments?.map((comment: any) => (
          <Box
            key={comment.id}
            mt={2}
            ml={4}
            p={2}
            bgcolor="#f9f9f9"
            borderLeft="4px solid #ffc107"
            borderRadius={1}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{ bgcolor: '#ffc107', width: 28, height: 28, fontSize: 14 }}
              >
                Q
              </Avatar>
              <Typography fontWeight="bold" fontSize={14}>
                Quản trị viên
              </Typography>
              <Typography variant="caption" color="text.secondary" ml={1}>
                {dayjs(comment.createdAt)
                  .tz('Asia/Ho_Chi_Minh')
                  .format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Stack>
            <Typography variant="body2" mt={1}>
              {comment.comment}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
