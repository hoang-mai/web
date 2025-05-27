import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/user/Home";
import Login from "./page/user/Login";
import Layout from "./page/user/Layout";
import LoginAdmin from "./page/admin/LoginAdmin";
import UserDetail from "./page/user/UserDetail";
import LayoutAdmin from "./page/admin/Layout";
import HomeAdmin from "./page/admin/Home";
import Statistics from "./page/admin/Statistics";
import ProductAdmin from "./page/admin/product/ProductAdmin";
import DetailProductAdmin from "./page/admin/product/DetailProductAdmin/DetailProductAdmin";
import UserAdmin from "./page/admin/UserAdmin";
import OrderManagement from "./page/admin/OrderAdmin";
import PostAdmin from "./page/admin/PostAdmin";
import ProfileAdmin from "./page/admin/ProfileAdmin";
import ProductList from "./components/ProductList";
import ReviewAdminPage from "./page/admin/ReviewAdmin";
import CartPage from "./page/user/Cart";


function App() {
  return (
      <Routes>
        {/* Đường dẫn cho người dùng*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="userdetail" element={<UserDetail />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      {/* Đường dẫn cho admin*/}
      <Route path="/admin/login" element={<LoginAdmin />} />
      {/* Thêm các route khác ở đây */}
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<HomeAdmin />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="products" element={<ProductAdmin />} />
        <Route path="products/:id" element={<DetailProductAdmin />} />
        <Route path="users" element={<UserAdmin />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="reviews" element={<ReviewAdmin />} />
        <Route path="posts" element={<PostAdmin />} />
        <Route path="profile" element={<ProfileAdmin />} />
      </Route>
    </Routes>
  );
}
export default App;
