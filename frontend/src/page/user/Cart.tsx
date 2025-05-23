// src/pages/Cart.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const userId = 2; // localStorage ...

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get<Cart>(
          `http://localhost:8080/carts/user/${userId}`
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

  if (loading) return <p>Đang tải giỏ hàng...</p>;

  if (!cart || cart.cartProducts.length === 0) {
    return <p>Giỏ hàng trống.</p>;
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
                <p className="font-semibold text-right">
                  Tổng: {subtotal.toLocaleString()} đ
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <hr className="my-4" />

      <div className="text-right text-xl font-bold">
        Tổng cộng: {calculateTotal().toLocaleString()} đ
      </div>
    </div>
  );
};

export default CartPage;
