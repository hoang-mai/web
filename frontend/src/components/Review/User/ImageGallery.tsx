import { Box, Modal, IconButton } from '@mui/material';
import { useState } from 'react';
import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material';

export default function ImageGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const MAX_PREVIEW = 5;
  const previewImages = images.slice(0, MAX_PREVIEW);
  const hiddenCount = images.length - MAX_PREVIEW;

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNext = () =>
    setSelectedIndex((prev) => (prev + 1) % images.length);

  const handlePrev = () =>
    setSelectedIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));

  return (
    <>
      {/* Grid ảnh nhỏ */}
      <Box display="flex" flexWrap="wrap" gap={1}>
        {previewImages.map((url, index) => (
          <Box
            key={index}
            component="img"
            src={url}
            alt={`ảnh ${index + 1}`}
            onClick={() => handleOpen(index)}
            sx={{
              width: 100,
              height: 100,
              objectFit: 'cover',
              borderRadius: 1,
              cursor: 'pointer',
            }}
          />
        ))}

        {/* Ảnh +N */}
        {hiddenCount > 0 && (
          <Box
            onClick={() => handleOpen(MAX_PREVIEW)}
            sx={{
              width: 100,
              height: 100,
              borderRadius: 1,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 500,
              color: '#555',
              fontSize: '1rem',
            }}
          >
            +{hiddenCount}
          </Box>
        )}
      </Box>

      {/* Modal ảnh to */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'black',
            maxWidth: '80vw',
            maxHeight: '80vh',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Ảnh chính */}
          <Box
            component="img"
            src={images[selectedIndex]}
            sx={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />

          {/* Nút trái */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 10,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.4)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <ArrowBackIos />
          </IconButton>

          {/* Nút phải */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 10,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.4)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <ArrowForwardIos />
          </IconButton>

          {/* Nút đóng */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
}
