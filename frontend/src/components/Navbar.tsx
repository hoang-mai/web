// src/components/Navbar.tsx
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LocationSelector from './LocationSelector';
import logo from '../assets/images/logo2.png';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
              <span className="text-lg font-bold">TechMart</span>
            </Link>
          </div>

          {/* Search Bar (hidden on small screens) */}
          <div className="hidden md:flex w-1/2 bg-white rounded-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Right: User + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-1 hover:text-blue-600"
              onClick={() => navigate('/page/login')}
            >
              <UserIcon className="h-5 w-5" />
              <span>Đăng nhập</span>
            </Link>
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
