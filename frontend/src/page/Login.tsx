import { useState,useEffect } from "react";
import { login, register,checkToken } from "../Services/login_register"; 
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Form state dùng chung
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      checkToken(token)
        .then((res) => {
         if(res){
          navigate("/"); // Chuyển hướng về trang chính nếu token hợp lệ
         }else{
          sessionStorage.removeItem("access_token"); // Xóa token nếu không hợp lệ
         }
        })
     
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // 🟡 Gọi hàm login từ auth.api
        const data = await login(formData.email, formData.password);
        sessionStorage.setItem("access_token", data.access_token);
        navigate("/"); // Chuyển hướng về trang chính sau khi đăng nhập thành công
        alert("Đăng nhập thành công!");   
       
      } else {
        // 🔵 Gọi hàm register từ auth.api
        const data = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstname,
          lastName: formData.lastname,
          phone: formData.phone,
          address: formData.address,
        });
        alert("Đăng ký thành công!");
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra khi gửi request");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen py-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg border-t-[6px] border-yellow-400">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Họ</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1">Tên</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-white font-semibold py-2 rounded-xl hover:bg-yellow-500 transition"
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-500 hover:underline"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
