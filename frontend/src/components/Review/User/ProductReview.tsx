import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Divider,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ImageGallery from './ImageGallery';
import ReviewCard from './ReviewCard';
import { get, post } from '@/services/callApi';
import ReviewModal from './ReviewModal';

export default function ProductReview({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    starBreakdown: [],
  });
  const [images, setImages] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    const reviewData = await getReviewsByProductName(productName);
    const statsData = await getReviewStats(productName);
    setReviews(reviewData);
    setStats(statsData);

    const reviewImages = reviewData.flatMap((r: any) =>
      r.imageUrl ? [r.imageUrl] : [],
    );
    setImages(reviewImages);

    // Gọi song song tất cả comment theo từng review
    const commentsMap = await Promise.all(
      reviewData.map(async (r: any) => {
        const comments = await getReviewComments(r.id);
        return { reviewId: r.id, comments };
      }),
    );

    // Gắn comment vào từng review
    const enrichedReviews = reviewData.map((r: any) => ({
      ...r,
      reviewComments:
        commentsMap.find((c) => c.reviewId === r.id)?.comments || [],
    }));

    setReviews(enrichedReviews);
  };

  const getReviewComments = async (reviewId: number) => {
    const res = await get(`/review-comment/${reviewId}`);
    if (!res) throw new Error('Không tải được phản hồi');
    return res.data;
  };

  const getReviewStats = async (productName: string) => {
    const res = await get('/reviews/products/stats', {
      name: productName,
    });
    if (!res) throw new Error('Không tải được thống kê đánh giá');
    return res.data;
  };

  const getReviewsByProductName = async (productName: string) => {
    const res = await get('/reviews/products', { name: productName });
    if (!res) throw new Error('Không tải được danh sách đánh giá');
    return res.data;
  };

  const handleReviewSubmit = async (
    rating: number,
    content: string,
    imageUrl: string | null,
  ) => {
    try {
      const res = await post('/reviews', {
        productName: productName,
        rating: rating,
        review: content,
        imageUrl: imageUrl,
      });
      if (res) {
        const updated = await getReviewsByProductName(productName);
        setReviews(updated);
        await fetchData();
      }
    } catch (error: any) {
      // Nếu backend trả lỗi từ NestJS (403, 409...)
      console.log(error);
      const message =
        error?.message || 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại.';
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  return (
    <Box mt={10} p={4} bgcolor="white" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Đánh giá {productName}
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        mt={3}
        gap={3}
      >
        {/* Tổng quan đánh giá */}
        <Box flex="1" minWidth={250}>
          <Typography
            textAlign="center"
            variant="h6"
            color="warning.main"
            fontWeight="bold"
          >
            ⭐ {stats.averageRating.toFixed(1)} / 5
          </Typography>
          <Typography textAlign="center" variant="body2" color="textSecondary">
            {stats.totalReviews} đánh giá
          </Typography>
        </Box>

        {/* Biểu đồ sao */}
        <Box sx={{ width: 300, minWidth: 250 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.starBreakdown?.[star] || 0;
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <Box key={star} display="flex" alignItems="center" mb={1}>
                <Typography variant="body2" width={24}>
                  {star}★
                </Typography>
                <Box sx={{ width: 200, mx: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#dee2e6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ffc107',
                      },
                    }}
                  />
                </Box>
                <Typography variant="body2" width={40}>
                  {percentage.toFixed(1)}%
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Hình ảnh khách hàng */}
        <Box flex="1" minWidth={250}>
          <ImageGallery images={images} />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Danh sách đánh giá */}
      <Box display="flex" flexDirection="column" gap={3}>
        {reviews.map((review: any) => (
          <ReviewCard
            key={review.id}
            review={review}
            onImageClick={setPreviewImage}
          />
        ))}
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={1}
        gap={2}
      >
        <Button
          variant="text"
          sx={{
            color: '#6c757d',
            border: '1px solid #6c757d',
            width: '250px',
            padding: '5px 10px',
          }}
        >
          Xem tất cả đánh giá
        </Button>
        <Button
          variant="contained"
          sx={{
            color: '#333533',
            bgcolor: '#ffc300',
            width: '250px',
            padding: '5px 10px',
          }}
          onClick={() => setOpenModal(true)}
        >
          Viết đánh giá
        </Button>
      </Box>
      <Modal open={!!previewImage} onClose={() => setPreviewImage(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '80vw',
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
          }}
        >
          <img
            src={previewImage!}
            alt="Ảnh đánh giá"
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
      <ReviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleReviewSubmit}
      />
      <Dialog open={!!errorMessage} onClose={() => setErrorMessage(null)}>
        <DialogTitle>Lỗi</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: '#eeba0b' }}
            onClick={() => setErrorMessage(null)}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
