import {
  Box,
  Button,
  Modal,
  Typography,
  Rating,
  TextField,
  Stack,
} from '@mui/material';
import { useRef, useState } from 'react';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, content: string, imageUrl: string | null) => void;
}

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number | null>(0);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'Posts_imgs');
      data.append('cloud_name', 'dhituyxjn');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dhituyxjn/image/upload',
        {
          method: 'POST',
          body: data,
        },
      );
      const uploaded = await res.json();
      setImageUrl(uploaded.url);
      setPreviewUrl(URL.createObjectURL(file));
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (rating && content.trim()) {
      onSubmit(rating, content.trim(), imageUrl);
      setRating(0);
      setContent('');
      setImageUrl(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 500,
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: 'auto',
          mt: '10vh',
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Viết đánh giá
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2">Đánh giá của bạn:</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
            />
          </Box>

          <TextField
            multiline
            rows={4}
            fullWidth
            label="Nội dung đánh giá"
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              '& label.Mui-focused': {
                color: '#ff7b00',
              },
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#ffd000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ffd000',
                },
              },
            }}
          />

          {/* Ảnh đánh giá */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box
              sx={{
                width: 120,
                height: 120,
                border: '2px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fafafa',
                overflow: 'hidden',
              }}
            >
              {previewUrl && !loading ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="preview"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : loading ? (
                <Typography color="textSecondary" align="center">
                  Đang tải ảnh...
                </Typography>
              ) : (
                <Typography color="textSecondary" align="center">
                  Chưa chọn ảnh
                </Typography>
              )}
            </Box>

            <Box>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                sx={{ borderColor: '#ffc107', color: 'black', fontWeight: 500 }}
              >
                Tải ảnh lên
              </Button>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#ffc300',
                color: '#333533',
                fontWeight: 'medium',
                borderRadius: 2,
              }}
              onClick={handleSubmit}
              disabled={!rating || !content.trim()}
            >
              Gửi đánh giá
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
