import ProductList from "@/components/ProductList";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import ViewPostModal from "@/components/Post/ViewPostModal";
import UserPostBannerCarousel from "@/components/Post/UserPostBannerCarousel";
import { Post } from "@/types/post";
import ChatButton from "@/components/Chat/User/ChatButton";
import { getUserIdFromToken } from "@/services/getUserId";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openView, setOpenView] = useState(false);
  const userId = getUserIdFromToken();

  useEffect(() => {
    axios
      .get("http://localhost:8080/posts/user-side")
      .then((res) => {
        setPosts(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Lỗi tải bài viết:", err));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <UserPostBannerCarousel
        posts={posts}
        onClick={(post) => {
          setSelectedPost(post);
          setOpenView(true);
        }}
      />
      <ViewPostModal
        open={openView}
        onClose={() => setOpenView(false)}
        post={selectedPost}
      />
      <ProductList />
      {userId && <ChatButton userId={userId} />}
    </Container>
  );
};

export default Home;
