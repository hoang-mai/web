// src/pages/Cart.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {paymentRoute} from "@/services/api.ts";
import { useNavigate } from "react-router-dom";
import { del, get, post } from "@/services/callApi.ts";


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

interface CartProduct {
  id: number;
  quantity: number;
  product: Product;
}

interface Cart {
  id: number;
  cartProducts: CartProduct[];
  isCheckedOut: boolean;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");
  let userId = null;
  if (token) {
    const decodedToken = jwtDecode(token); // Sử dụng hàm jwtDecode
    userId = decodedToken.sub; // Lấy user ID từ trường sub
  }
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await get(
          `/carts/user/${userId}`
        );
        setCart(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const calculateTotal = () => {
    if (!cart) return 0;

    return cart.cartProducts.reduce((sum, item) => {
      const price = parseFloat(item.product.price);
      const discount = item.product.discount || 0;
      const finalPrice = price * (1 - discount / 100);
      return sum + finalPrice * item.quantity;
    }, 0);
  };

  //Cái này vứt nhé, tại vì hàm này xóa cart, mà mình cần xóa cartProduct
  const handleCancelCart = async () => {
    if (!cart) return;
    try {
      del(`/carts/${cart.id}`);
      alert("Đã xóa giỏ hàng thành công!");
      setCart(null); // Xóa giỏ hàng sau khi hủy
    } catch (error) {
      console.error("Lỗi khi hủy cart:", error);
      alert("Lỗi khi hủy cart, xem ở Cart.tsx");
    }
  }

  const handleCheckout = async () => {
    if (!cart) return;
    // try {
    //   await axios.patch(`http://localhost:8080/carts/${cart.id}/checkout`);
    //   alert("Đã thanh toán giỏ hàng thành công!");
    //   setCart(null); // Xóa giỏ hàng sau khi thanh toán
    // } catch (error) {
    //   console.error("Lỗi khi thanh toán giỏ hàng:", error);
    //   alert("Lỗi khi thanh toán giỏ hàng, xem ở Cart.tsx");
    // }
    post(paymentRoute, {
      cartItems: cart.cartProducts.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: parseFloat(item.product.price) * (1 - (item.product.discount || 0) / 100),
        name: item.product.name,
      })),
      cartId: cart.id,
    }).then((res) => {
      window.location.href = res.data.url;
    });

  };

  const deleteProduct = async () => {
    if (!cart) return;
    try {
      // Giả sử bạn muốn xóa sản phẩm đầu tiên trong giỏ hàng
      const productId = cart.cartProducts[0].product.id;
      await del(`/cart-products/user/${userId}/product/${productId}`);
      alert("Đã xóa sản phẩm khỏi giỏ hàng thành công!");
      // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
      setCart((prevCart) => ({
        ...prevCart,
        cartProducts: prevCart.cartProducts.filter(item => item.product.id !== productId)
      }));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng, xem ở Cart.tsx");
    }
  };

  if (loading) return <p>Đang tải giỏ hàng...</p>;

  if (!cart || cart.cartProducts.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 mb-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-14h6" />
      </svg>
      <p className="text-lg font-semibold">Giỏ hàng trống.</p>
      <p className="mt-2 text-sm text-gray-400">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
      <button
        onClick={() =>  navigate('/')} // hoặc dùng router push
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Xem sản phẩm
      </button>
    </div>
  );
}

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h1>

      <div className="space-y-4">
        {cart.cartProducts.map((item) => {
          const product = item.product;
          const price = parseFloat(product.price);
          const discount = product.discount || 0;
          const finalPrice = price * (1 - discount / 100);
          const subtotal = finalPrice * item.quantity;

          return (
            <div
              key={item.id}
              className="flex items-center border rounded-lg p-4 shadow"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm">
                  Giá:{" "}
                  <span className="font-medium">
                    {finalPrice.toLocaleString()} đ
                  </span>{" "}
                  {discount > 0 && (
                    <span className="text-red-500 ml-1">(-{discount}%)</span>
                  )}
                </p>
                <p>Số lượng: {item.quantity}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteProduct()}
                    className="mt-2 ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600 transition"
                  >Xóa sản phẩm</button>
                </div>

                <p className="font-semibold text-right">
                  Tổng: {subtotal.toLocaleString()} đ
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <hr className="my-4" />

      <div className="text-red-500 text-right text-xl font-bold">
        Tổng cộng: {calculateTotal().toLocaleString()} đ
      </div>
      {/* Nút thanh toán */}
      <div className="flex justify-end">
        <button
          onClick={() => handleCheckout()}
          className="mt-2 ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >Xác nhận thanh toán</button>
      </div>
      {/* Nút hủy đơn hàng */}
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => alert("Xin hãy xóa các sản phẩm trong giỏ hàng")}
        >
          Xóa giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default CartPage;
