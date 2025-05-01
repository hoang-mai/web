import { Route, Routes } from "react-router-dom";
import Home from "./page/user/Home";
import Login from "./page/user/Login";
import Layout from "./page/user/Layout";
import LoginAdmin from "./page/admin/LoginAdmin";

function App() {
  return (
    /* Thêm router vào đây */
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/admin/login" element={<LoginAdmin />} />
    </Routes>
  );
}
export default App;
