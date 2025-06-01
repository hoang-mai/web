import { Route, Routes } from "react-router-dom";
import Home from "./page/user/Home";
import Login from "./page/user/Login";
import Layout from "./page/user/Layout";
import LoginAdmin from "./page/admin/LoginAdmin";
import UserDetail from "./page/user/UserDetail";
import LayoutAdmin from "./page/admin/Layout";
import Statistics from "./page/admin/Statistics";
import ProductAdmin from "./page/admin/product/ProductAdmin";
import DetailProductAdmin from "./page/admin/product/DetailProductAdmin/DetailProductAdmin";
import UserAdmin from "./page/admin/UserAdmin";
import OrderManagement from "./page/admin/OrderAdmin";
import PostAdmin from "./page/admin/PostAdmin";
import ProfileAdmin from "./page/admin/ProfileAdmin";
import ReviewAdmin from "./page/admin/ReviewAdmin";
import CartPage from "./page/user/Cart";
import ProductDetailUser from "./components/ProductDetailUser";
import OrderSuccess from "./OrderSuccess";
import AdminChatPage from "./page/admin/AdminChatPage";
import AboutPage from "./components/AboutPage";
import HelpPage from "./components/Help";
import PromotionsPage from "./components/Promotions";

function App() {
  return (
      <Routes>
        {/* Đường dẫn cho người dùng*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="userdetail" element={<UserDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="products/:id" element={<ProductDetailUser />} />
          <Route path="/order/vnpay_return" element={<OrderSuccess />} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/help" element={<HelpPage/>} />
          <Route path="/promotions" element={<PromotionsPage/>} />
          {/* Thêm các route khác ở đây */}
        </Route>
      {/* Đường dẫn cho admin*/}
      <Route path="/admin/login" element={<LoginAdmin />} />
      {/* Thêm các route khác ở đây */}
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<Statistics />} />
        <Route path="products" element={<ProductAdmin />} />
        <Route path="products/:id" element={<DetailProductAdmin />} />
        <Route path="users" element={<UserAdmin />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="reviews" element={<ReviewAdmin />} />
        <Route path="posts" element={<PostAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
        <Route path="chat" element={<AdminChatPage />} />
      </Route>
    </Routes>
  );
}
export default App;