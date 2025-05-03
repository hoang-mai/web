import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { get, patch } from "../../services/callApi";
import {
  checkTokenRoute,
  findUserByIdRoute,
  updateUserRoute,
} from "@/services/api";
import {
  UserIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const UserDetail = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isOrders, setIsOrders] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      get(checkTokenRoute)
        .then((res) => {
          const userId = res.data.data.id;
          const userRoute = findUserByIdRoute.replace(":id", userId);
          get(userRoute)
            .then((response) => {
              setUser(response.data);
              setEditData(response.data);
              setLoading(false);
            })
            .catch((err) => {
              toast.error("Failed to fetch user details.");
              setLoading(false);
            });
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          toast.error("Error checking token.");
          navigate("/login");
          setLoading(false);

        });
    } else {
      toast.error("No token found!");
      navigate("/login");
    }
  }, [navigate]);

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
      const response = await patch(
        updateUserRoute.replace(":id", user.id),
        editData
      );
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
    <div className="min-h-screen flex flex-col lg:flex-row p-4 gap-4 max-w-6xl">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 mb-2 overflow-hidden">
            <img
              src="https://i.imgur.com/padyuTG_d.png?maxwidth=520&shape=thumb&fidelity=high"
              alt="avatar"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {user
              ? `${user.firstName || "Tên"} ${user.lastName || "Họ"}`
              : "Loading..."}
          </h3>
        </div>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => setIsOrders(true)}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 text-gray-700 ${
              isOrders
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            🛍️ Đơn hàng đã mua
          </button>
          <button
            onClick={() => setIsOrders(false)}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 text-gray-700 ${
              !isOrders
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
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
          <p>Hiện chưa có đơn hàng nào được hiển thị.</p>
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
                    className="ml-7 border rounded px-3 py-1 w-full"
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
                    className="ml-7 border rounded px-3 py-1 w-full"
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
                    className="ml-7 border rounded px-3 py-1 w-full"
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
                      className="w-full pr-10 border border-gray-300 rounded px-3 py-1.5 bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
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
                      className="border rounded px-3 py-1 w-full pr-10"
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
                      className="border rounded px-3 py-1 w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
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
                <p>
                  <strong>Họ tên:</strong> {user?.lastName} {user?.firstName}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {user?.address}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {user?.phone}
                </p>
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
