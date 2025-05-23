// frontend/src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/products')
      .then((res) => {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group border rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-300 flex flex-col"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 flex-grow mt-2">{product.description}</p>
          <div className="mt-4">{formatPrice(product.price, product.discount)}</div>
          <button className="mt-4 bg-yellow-400 text-white font-medium py-2 rounded-xl hover:bg-yellow-500 transition">
            Mua ngay
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
