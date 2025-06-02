// src/components/Navbar.tsx
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import LocationSelector from './LocationSelector';
import logo from '../assets/images/logo2.png';
import { get } from '@/services/callApi';
import { checkTokenRoute, findUserByIdRoute } from '@/services/api';
import AboutPage from './AboutPage';
import HelpPage from './HelpPage';
import PromotionsPage from './PromotionsPage';


export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Hàm lấy thông tin người dùng
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const tokenRes = await get(checkTokenRoute);
        const userData = tokenRes.data.data;
        const userId = userData.id;
        const userRoute = findUserByIdRoute.replace(":id", userId);
        const userRes = await get(userRoute);
        const user = userRes.data;

        setUserName(`${user.firstName} ${user.lastName}`);
      } else {
        setUserName(null); // Reset nếu không có token
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
    }
  };

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    fetchUser();
    
    // Lắng nghe sự thay đổi trong localStorage (token bị xóa)
    const handleStorageChange = () => {
      if (!localStorage.getItem("access_token")) {
        setUserName(null); // Reset khi token bị xóa
        navigate("/login", { replace: true }); // Điều hướng tới trang login
      }
    };

    // Thêm event listener để lắng nghe sự thay đổi trong localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);
  
  
  return (
    <nav className="bg-yellow-400 text-black py-2 px-4 shadow-md font-semibold">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          {/* Left: Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Location Selector (hidden on mobile) */}
          <div className="hidden md:block">
            <LocationSelector />
          </div>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="TechMart" className="h-8" />
              <span className="text-lg font-bold">Thế giới công nghệ</span>
            </Link>
          </div>

          {/* Quick links */}
          <div className="hidden md:flex w-1/2 items-center justify-evenly text-black">
            <Link to="/about" className="hover:underline">Về chúng tôi</Link>
            <Link to="/help" className="hover:underline">Trợ giúp</Link>
            <Link to="/promotions" className="hover:underline">Khuyến mãi</Link>
          </div>

          {/* Right: User + Cart */}
          <div className="hidden md:flex items-center space-x-4">
          {userName ? (
              <Link
                to="/userdetail"
                className="flex items-center space-x-2 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon className="h-5 w-5" />
                <span>{userName}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 hover:text-blue-600"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/page/login');
                }}
              >
                <UserIcon className="h-5 w-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
            <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-600">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="flex flex-col space-y-2 mt-2 md:hidden">
            <LocationSelector />
            <div className="flex bg-white rounded-full px-4 py-2 items-center">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                className="w-full text-sm border-none outline-none"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </div>
              {userName ? (
              <Link
                to="/userdetail"
                className="flex items-center space-x-2 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon className="h-5 w-5" />
                <span>{userName}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 hover:text-blue-600"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/page/login');
                }}
              >
                <UserIcon className="h-5 w-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="flex items-center space-x-2 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Giỏ hàng</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
