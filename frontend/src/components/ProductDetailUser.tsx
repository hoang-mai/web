import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

const ProductDetailUser = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8080/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Đang tải sản phẩm...</p>;
  if (!product) return <p className="text-center text-red-500">Không tìm thấy sản phẩm.</p>;

  const finalPrice = product.discount
    ? Math.round(Number(product.price) * (1 - product.discount / 100))
    : Number(product.price);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover rounded-xl border"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">Danh mục: {product.category}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>

            {/* Giá sản phẩm */}
            <div className="mb-4">
              {product.discount > 0 ? (
                <div>
                  <p className="text-xl text-gray-400 line-through">
                    {Number(product.price).toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-3xl text-red-600 font-semibold">
                    {finalPrice.toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Giảm {product.discount}%
                  </p>
                </div>
              ) : (
                <p className="text-3xl text-blue-600 font-semibold">
                  {Number(product.price).toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>

            <p className="text-sm text-gray-600">Kho còn: {product.stock} sản phẩm</p>
          </div>

          {/* Nút thêm vào giỏ */}
          <button
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl text-lg transition"
            onClick={() => {
              // xử lý thêm vào giỏ
              axios
                .post("http://localhost:8080/cart-products", {
                  cartId: localStorage.getItem("access_token"), // xử lý đúng sau
                  productId: product.id,
                  quantity: 1,
                })
                .then(() => alert("Đã thêm vào giỏ hàng"))
                .catch(() => alert("Lỗi khi thêm vào giỏ"));
            }}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailUser;
