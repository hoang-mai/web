import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { get, patch } from "../../services/callApi";
import { checkToken } from "../../services/checkToken";
import { findUserByIdRoute,updateUserRoute,findOrdersRoute } from "@/services/api";
import {
  UserIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import Order from "@/components/Order";
const UserDetail = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isOrders, setIsOrders] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [filters, setFilters] = useState({
    status: 'all', 
    startDate: sevenDaysAgo.toISOString().split('T')[0], 
    endDate: tomorrow.toISOString().split('T')[0], 
  });
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      checkToken(token)
        .then((res) => {
          if (res.valid) {
            const userId = res.payload.sub;
            const userRoute = findUserByIdRoute.replace(":id", userId);
            get(userRoute)
              .then((response) => {
                setUser(response.data);
                setEditData(response.data);
                handleFindOrders(response.data.id); // Fetch orders for the user
                setLoading(false);
              })
              .catch((err) => {
                toast.error("Failed to fetch user details.");
                setLoading(false);
              });
          } else {
            toast.error("Token is not valid!");
            sessionStorage.removeItem("access_token");
            navigate("/login");
          }
        })
        .catch(() => {
          toast.error("Error checking token.");
          setLoading(false);
        });
    } else {
      toast.error("No token found!");
      navigate("/login");
    }
  }, [navigate]);

  const handleFindOrders = async (id:number) => {
    try {
      const response = await get('/orders/filter', {
        userId: id, // Flat params object
        status:filters.status,
        start:filters.startDate,
        end:filters.endDate,
      });
      // Check if response contains orders
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        toast.error('Không tìm thấy đơn hàng!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lấy danh sách đơn hàng!');
      console.error('Error fetching orders:', error);
    }
  };
  
  const handleUpdate = async () => {
    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
  
    // Nếu có thay đổi mật khẩu, thêm nó vào dữ liệu cập nhật
    if (newPassword) {
      editData.password = newPassword;
    }
  
    // Thực hiện gọi API để cập nhật thông tin người dùng
    try {
      const response = await patch(updateUserRoute.replace(":id", user.id), editData);
      console.log(response.data); // In ra dữ liệu trả về từ API
      // Kiểm tra nếu API trả về thành công
      if (response.data.affected === 1) {
        toast.success("Cập nhật thông tin thành công!"); 
        setIsEditing(false); 
        setUser({ ...user, ...editData }); // Cập nhật lại thông tin người dùng
      } else {
        toast.error(response.data.message); // Nếu thất bại, hiển thị thông báo lỗi
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 gap-4 max-w-6xl lg:ml-15">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-sm ">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 mb-2 overflow-hidden">
            <img
              src={user?.imageUrl || "https://via.placeholder.com/150"}
              alt="avatar"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {user ? `${user.firstName || "Tên"} ${user.lastName || "Họ"}` : "Loading..."}
          </h3>
        </div>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setIsOrders(true)}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 text-gray-700 ${
              isOrders ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-100"
            }`}
          >
            🛍️ Đơn hàng đã mua
          </button>
          <button
            onClick={() => setIsOrders(false)}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 text-gray-700 ${
              !isOrders ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-100"
            }`}
          >
            🏠 Thông tin và số địa chỉ
          </button>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("access_token");
            navigate("/login");
          }}
          className="mt-6 w-full text-center text-red-600 border border-red-500 px-3 py-2 rounded hover:bg-red-50"
        >
          Đăng Xuất
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isOrders ? "ĐƠN HÀNG ĐÃ MUA" : "THÔNG TIN CÁ NHÂN"}
        </h2>

        {loading ? (
          <div className="flex justify-center">Đang tải dữ liệu...</div>
        ) : isOrders ? (
        <div>
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="canceled">Đã hủy</option>
            <option value="returned">Hoàn trả</option>
          </select>
          <button
            onClick={() => handleFindOrders(user.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lọc
          </button>
        </div>
        <div>
            {orders.length===0?
             <div className="text-center text-gray-500 py-4">
             <p>Không tìm thấy đơn hàng nào.</p>
             <button
               onClick={() => navigate("/")}
               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
             >
               Về trang chủ
             </button>
           </div>
            :orders.map((order) => (
              <Order key={order.id} order={order} />
            ))}
          </div>
        </div>
        
        ) : (
          <div className="space-y-5">
            {/* Hiển thị thông tin hoặc form chỉnh sửa */}
            {isEditing ? (
              <>
                {/* Các input chỉnh sửa */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <UserIcon className="w-5 h-5" /> Họ tên
                  </label>
                  <div className="ml-7">
                    <input
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      className="mr-2 border rounded px-2 py-1"
                    />
                    <input
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <MapPinIcon className="w-5 h-5" /> Địa chỉ
                  </label>
                  <input
                    name="address"
                    value={editData.address || ""}
                    onChange={handleInputChange}
                    className="ml-7 border rounded px-3 py-1 w-3/4"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <EnvelopeIcon className="w-5 h-5" /> Email
                  </label>
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="ml-7 border rounded px-3 py-1 w-1/2"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <PhoneIcon className="w-5 h-5" /> Số điện thoại
                  </label>
                  <input
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleInputChange}
                    className="ml-7 border rounded px-3 py-1 w-1/4"
                  />
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <LockClosedIcon className="w-5 h-5" /> Mật khẩu
                  </label>
                  <div className="relative ml-7 w-1/2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value="**********"
                      readOnly
                      className="w-1/2 pr-10 border border-gray-300 rounded px-3 py-1.5 bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="relative -ml-6 top-1"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                 {/* Mật khẩu mới */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <LockClosedIcon className="w-5 h-5" /> Mật khẩu mới
                  </label>
                  <div className="ml-7 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="border rounded px-3 py-1 w-1/2 pr-10"
                    />
                  </div>
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <LockClosedIcon className="w-5 h-5" /> Xác nhận mật khẩu
                  </label>
                  <div className="ml-7 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu"
                      className="border rounded px-3 py-1 w-1/2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="relative -ml-6 top-1"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nút xác nhận & hủy */}
                <div className="mt-4 ml-7 space-x-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Xác nhận chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Chỉ hiển thị thông tin người dùng */}
                <p><strong>Họ tên:</strong> {user?.lastName} {user?.firstName}</p>
                <p><strong>Địa chỉ:</strong> {user?.address}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Điện thoại:</strong> {user?.phone}</p>
                {/* Nút chỉnh sửa */}
                <div className="text-right mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Chỉnh sửa thông tin
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
