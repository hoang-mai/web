// frontend/src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { post } from '@service/api';
import { useNavigate } from 'react-router-dom';
import { get } from '@/services/callApi';
import { productRoute } from '@/services/api';

type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  imageUrl: string;
  discount: number;
  category: string;
};

const token = localStorage.getItem('access_token');
let userId = null;
if (token) {
  const decodedToken = jwtDecode(token); // Sử dụng hàm jwtDecode
  userId = decodedToken.sub; // Lấy user ID từ trường sub
}

//hàm xử lý thêm sản phẩm vào giỏ hàng
const handleAddToCart = (productId: number) => {
  axios.post('http://localhost:8080/cart-products', {
    cartId: userId, // Sử dụng userId làm cartId
    productId: productId,
    quantity: 1, // Mặc định thêm 1 sản phẩm
  })
    .then(() => {
      alert('Sản phẩm đã được thêm vào giỏ hàng');
    })
    .catch((err) => {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng', err);
    });
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {

    get(productRoute).then((res) => {
      setProducts(res.data.data.data);
    })
      .catch((err) => {
        console.error('Lỗi khi tải sản phẩm', err);
      });
  }, []);

  const formatPrice = (price: string, discount: number) => {
    const original = Number(price);
    if (discount > 0) {
      const discounted = Math.round(original * (1 - discount / 100));
      return (
        <>
          <p className="text-sm text-gray-500 line-through">
            {original.toLocaleString('vi-VN')}₫
          </p>
          <p className="text-lg font-semibold text-red-600">
            {discounted.toLocaleString('vi-VN')}₫
          </p>
        </>
      );
    }
    return (
      <p className="text-lg font-semibold text-blue-600">
        {original.toLocaleString('vi-VN')}₫
      </p>
    );
  };

  return (
    <div className="bg-gray-100 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 px-2 sm:px-4 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative cursor-pointer"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {/* Discount badge */}
            {product.discount > 0 && (
              <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-br-lg z-10">
                GIẢM {product.discount}%
              </div>
            )}

            {/* Product image */}
            <div className="p-4 pb-2 relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn.tgdd.vn/Products/Images/42/default.png";
                }}
              />

              {/* Quick actions */}
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <button
                  className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist functionality
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Compare functionality
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product info */}
            <div className="px-3 pb-3 flex-grow flex flex-col">
              {/* Product name */}
              <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] mb-1">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-1.5">
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 100) + 10})</span>
              </div>

              {/* Short description - optional */}
              <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-grow">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-auto">
                {product.discount > 0 ? (
                  <div className="flex flex-col">
                    <span className="text-red-600 font-bold text-base">
                      {formatPrice(product.price * (1 - product.discount / 100))}
                    </span>
                    <span className="text-gray-500 line-through text-xs">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-red-600 font-bold text-base">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="mt-1 text-xs text-orange-600">
                  Chỉ còn {product.stock} sản phẩm
                </div>
              )}
              {product.stock === 0 && (
                <div className="mt-1 text-xs text-red-600 font-medium">
                  Tạm hết hàng
                </div>
              )}

              {/* Add to cart button */}
              <button
                className={`mt-2 w-full py-2 rounded-md text-sm font-medium flex items-center justify-center ${product.stock > 0
                    ? 'bg-[#fdd835] hover:bg-[#fbc02d] text-[#333]'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.stock > 0) {
                    handleAddToCart(product.id);
                  }
                }}
                disabled={product.stock === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>

              {/* Promotion tag - randomly shown on some products */}
              {Math.random() > 0.5 && (
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded p-1.5 text-xs text-blue-800 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span>Tặng PMH 100.000đ mua hàng tại TGDĐ</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
