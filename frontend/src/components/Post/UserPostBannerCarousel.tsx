import React, { useState, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Post {
  id: number;
  title: string;
  imgUrl: string;
  description: string;
}

interface Props {
  posts: Post[];
  onClick?: (post: Post) => void;
}

const UserPostBannerCarousel: React.FC<Props> = ({ posts, onClick }) => {
  const [hiddenPostIds, setHiddenPostIds] = useState<number[]>([]);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);

  const visiblePosts = posts.filter((post) => !hiddenPostIds.includes(post.id));

  const handleClose = (postId: number) => {
    setHiddenPostIds((prev) => [...prev, postId]);
  };

  const handleImageClick = (post: Post) => {
    clickCount.current += 1;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    clickTimeout.current = setTimeout(() => {
      if (clickCount.current >= 2) {
        onClick?.(post);
      }
      clickCount.current = 0;
    }, 250);
  };

  const isSingle = visiblePosts.length === 1;
  const settings = {
    dots: true,
    infinite: !isSingle,        // chỉ lặp khi có nhiều post
    autoplay: !isSingle,        // chỉ tự chạy nếu > 1 post
    autoplaySpeed: 10000,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !isSingle,          // ẩn mũi tên nếu chỉ 1

    // Chấm tròn bên trái dưới ảnh
    appendDots: (dots: React.ReactNode) => (
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 16,
          display: "flex",
          gap: 1.2,
          zIndex: 2,
        }}
      >
        {dots}
      </Box>
    ),

    // Đổi màu chấm tròn tương ứng khi 1 banner hoạt động
    customPaging: () => (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          border: "1px solid white",
          boxShadow: "0px 0px 4px rgba(0,0,0,1)",
          transition: "all 0.3s ease",
          ".slick-active &": {
            backgroundColor: "#ffc107 !important",
            borderColor: "#fff !important",
          },
        }}
      />
    ),
  };

  if (visiblePosts.length === 0) return null;

  return (
    <Slider {...settings}>
      {visiblePosts.map((post) => (
        <Box
          key={post.id}
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            outline: "none",
          }}
        >
          <Box
            component="img"
            src={post.imgUrl}
            alt={post.title}
            onClick={() => handleImageClick(post)}
            sx={{
              width: "100%",
              maxHeight: 250,
              objectFit: "cover",
              display: "block",
              cursor: "pointer",
              borderRadius: 2,
            }}
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(post.id);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.4)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Slider>
  );
};

export default UserPostBannerCarousel;
