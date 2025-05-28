// components/Product.tsx
import React from 'react';

interface ProductProps {
  name: string;
  price: string;
  imageUrl: string;
  description: string;
}

const Product: React.FC<ProductProps> = ({ name, price, imageUrl, description }) => {
  return (
    <div className="border rounded-lg p-4 shadow">
      <img src={imageUrl} alt={name} className="w-full h-40 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-blue-600 font-bold mt-1">${price}</p>
    </div>
  );
};

export default Product;
