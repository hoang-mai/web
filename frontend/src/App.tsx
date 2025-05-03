import { Route, Routes } from "react-router-dom";
import Home from "./page/user/Home";
import Login from "./page/user/Login";
import Layout from "./page/user/Layout";
import LoginAdmin from "./page/admin/LoginAdmin";
import UserDetail from "./page/user/UserDetail";

function App() {
  return (
    /* Thêm router vào đây */
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userdetail" element={<UserDetail />} />
      </Route>

      <Route path="/admin/login" element={<LoginAdmin />} />
      {/* Thêm các route khác ở đây */}
    </Routes>
  );
}
export default App;
