// src/components/Navbar.tsx
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import LocationSelector from "./LocationSelector";
import logo from "../assets/images/logo2.png";
import { get } from "@/services/callApi";
import {
  checkTokenRoute,
  findUserByIdRoute,
  productSearchRoute,
} from "@/services/api";

// Product interface
interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  imageUrl: string;
  discount: number;
  category: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
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

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await get(`${productSearchRoute}?name=${query}`);
      setSearchResults(response.data.data ?? []);
      setShowSearchResults(true);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search result click
  const handleProductClick = (productId: number) => {
    setShowSearchResults(false);
    setSearchQuery("");
    navigate(`/products/${productId}`);
  };  // Handle click outside search
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    
    // Check if click is outside both desktop and mobile search areas
    const isOutsideDesktopSearch = searchRef.current && !searchRef.current.contains(target);
    const isOutsideMobileSearch = !mobileSearchRef.current?.contains(target);
    
    // Close search results if clicking outside both search areas
    if (isOutsideDesktopSearch && isOutsideMobileSearch) {
      setShowSearchResults(false);
    }
  };

  // Handle escape key press
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowSearchResults(false);
    }
  };

  // Format price helper
  const formatPrice = (price: string, discount: number) => {
    const original = Number(price);
    if (discount > 0) {
      const discounted = Math.round(original * (1 - discount / 100));
      return `${discounted.toLocaleString("vi-VN")}₫`;
    }
    return `${original.toLocaleString("vi-VN")}₫`;
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
    };    // Thêm event listener để lắng nghe sự thay đổi trong localStorage
    window.addEventListener("storage", handleStorageChange);

    // Add click outside listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Add keyboard listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

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
          </div>{" "}
          {/* Search Bar */}
          <div className="hidden md:flex relative w-1/2" ref={searchRef}>
            <div className="bg-white rounded-full px-4 py-2 items-center w-full flex">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                className="w-full text-sm border-none outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchResults.length > 0 && setShowSearchResults(true)
                }
              />
              {isSearching ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={
                        product.imageUrl ||
                        "https://karanzi.websites.co.in/obaju-turquoise/img/product-placeholder.png"
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold text-blue-600">
                          {formatPrice(product.price, product.discount)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-gray-500 line-through">
                            {Number(product.price).toLocaleString("vi-VN")}₫
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="text-xs bg-red-100 text-green-600 px-1 py-0.5 rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>
                ))}
                
              </div>
            )}

            {/* No Results */}
            {showSearchResults &&
              searchResults.length === 0 &&
              searchQuery.trim() &&
              !isSearching && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 mt-1">
                  <p className="text-sm text-gray-500 text-center">
                    Không tìm thấy sản phẩm nào
                  </p>
                </div>
              )}
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
                  navigate("/page/login");
                }}
              >
                <UserIcon className="h-5 w-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="flex items-center space-x-1 hover:text-blue-600"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Giỏ hàng</span>
            </Link>
          </div>        </div>{" "}
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white mt-2 rounded-lg shadow-lg">
            {/* Mobile Search */}
            <div className="p-4" ref={mobileSearchRef}>
              <div className="relative">
                <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                  <input
                    type="text"
                    placeholder="Bạn tìm gì..."
                    className="w-full text-sm border-none outline-none bg-transparent"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() =>
                      searchResults.length > 0 && setShowSearchResults(true)
                    }
                  />
                  {isSearching ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                {/* Mobile Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto mt-1">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          handleProductClick(product.id);
                          setMenuOpen(false);
                        }}
                      >
                        <img
                          src={
                            product.imageUrl ||
                            "https://karanzi.websites.co.in/obaju-turquoise/img/product-placeholder.png"
                          }
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-semibold text-red-600">
                              {formatPrice(product.price, product.discount)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-xs text-gray-500 line-through">
                                {Number(product.price).toLocaleString("vi-VN")}₫
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mobile No Results */}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchQuery.trim() &&
                  !isSearching && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 mt-1">
                      <p className="text-sm text-gray-500 text-center">
                        Không tìm thấy sản phẩm nào
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Mobile Location Selector */}
            <div className="px-4 pb-2">
              <LocationSelector />
            </div>

            {/* Mobile Menu Items */}
            <div className="border-t border-gray-200">
              {userName ? (
                <Link
                  to="/userdetail"
                  className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>{userName}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/page/login");
                  }}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Đăng nhập</span>
                </Link>
              )}
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Giỏ hàng</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
