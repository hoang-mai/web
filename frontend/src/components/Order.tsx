import React, { useState } from "react";

type OrderCardProps = {
  order: any;
};

const Order: React.FC<OrderCardProps> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const getColorByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "confirmed":
        return "text-blue-500";
      case "shipping":
        return "text-indigo-500";
      case "delivered":
        return "text-green-600";
      case "canceled":
        return "text-red-500";
      case "returned":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white transition-transform duration-200 hover:scale-[1.01]">
      <div className="flex justify-between items-center">
        <div>
          <div className={`flex flex-row gap-1 text-lg font-semibold ${getColorByStatus(order.status)}`}>
            <p className="text-black">Đơn hàng {order.id} -</p>
            <p>{order.status.toUpperCase()}</p>
          </div>
          <p className="text-sm text-gray-600">
            Ngày tạo: {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-sm">Tổng tiền: ${order.totalPrice}</p>
          <p className="text-sm text-gray-700">
            Người mua: {order.user.firstName} {order.user.lastName}
          </p>
        </div>
        <button
          onClick={toggleExpand}
          className="text-blue-500 hover:underline transition-colors"
        >
          {expanded ? "Thu gọn" : "Xem chi tiết"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-4">
          {order.orderItems.map((item: any) => (
            <div key={item.id} className="flex items-start gap-4 mb-4">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded shadow"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">
                  Giá: ${item.price} — Số lượng: {item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  Mô tả: {item.product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
