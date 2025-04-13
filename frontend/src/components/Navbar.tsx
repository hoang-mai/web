// src/components/Navbar.tsx
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-yellow-400 text-black py-2 px-4 shadow-md">
      <div className="flex flex-col ">
        <div className='flex flex-row items-center justify-between'>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src=""
                alt="Web ban do dien tu"
                className="h-8"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-1/2 bg-white rounded-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Right Section (User, Cart) */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="flex items-center space-x-1 hover:text-blue-600">
              <UserIcon className="h-5 w-5" />
              <span>Đăng nhập</span>
            </Link>
            <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-600">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>
        <div>
          
        </div>
      
      
      </div>

     
    </nav>
  );
}