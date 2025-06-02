import { useEffect, useState } from 'react';
import { Container, Paper, Box, CircularProgress } from '@mui/material';
import ReviewList from '@/components/Review/Admin/ReviewList';
import ReviewDetailModal from '@/components/Review/Admin/ReviewDetailModal';
import { del, get } from '@/services/callApi';
const ReviewAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await get('/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đánh giá:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (review) => {
    setSelectedReview(review);
    setOpenDetail(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá đánh giá này?')) {
      await del(`/admin/reviews/${id}`);
      fetchReviews();
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        margin: '0',
        padding: '0',
        width: '100%',
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <Paper
        sx={{
          margin: '0',
          padding: '0',
          boxShadow: 'none',
          border: 'none',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <ReviewList
            reviews={reviews}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </Paper>

      <ReviewDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        review={selectedReview}
      />
    </Container>
  );
};

export default ReviewAdmin;
