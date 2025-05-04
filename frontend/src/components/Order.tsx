import React, { useState } from 'react';
import {patch} from "@/services/callApi";
import { updateOrderRoute} from "@/services/api";


// TypeScript interfaces
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

interface OrderItem {
  id: string;
  product: Product;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'canceled' | 'returned';
  createdAt: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

interface OrderComponentProps {
  order: Order;
  onCancelOrder?: (orderId: string) => void;
}

// Order Component
const OrderComponent: React.FC<OrderComponentProps> = ({ order, onCancelOrder }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getColorByStatus = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipping: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      returned: "bg-gray-100 text-gray-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statusTranslations: { [key: string]: string } = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    canceled: "Đã hủy",
    returned: "Đã trả hàng"
  };
  const cancelOrderApi = (orderId: string | number) => {
    // Chuyển đổi orderId thành string nếu nó là number
    return patch(updateOrderRoute.replace(':id', orderId.toString()), {
      status: 'canceled',
    });
  };
  const handleCancel = async () => {
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      await cancelOrderApi(order.id); // Gọi API PATCH
      onCancelOrder?.(order.id); // Gọi callback nếu có
      alert("Đã hủy đơn hàng thành công");
      
    }
  };

  const canCancel=(status: string) => {
    if(status === "pending" || status === "confirmed"|| status === "shipping"){
      return true;
    }
    return false;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Order header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Đơn hàng #{order.id}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorByStatus(order.status)}`}>
              {statusTranslations[order.status]}
            </span>
            <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>

          {onCancelOrder&&(<button
            onClick={handleCancel}
            className={`px-3 py-1 text-sm font-medium border rounded transition 
              ${canCancel(order.status)
                ? "text-red-600 border-red-500 hover:bg-red-50"
                : "text-gray-400 border-gray-300 cursor-not-allowed"}
            `}
            disabled={!canCancel(order.status)}
            >
            Hủy đơn hàng
          </button>)}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <div className="px-4 py-3 bg-gray-50 flex justify-center">
        <button 
          onClick={toggleExpand}
          className="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span>{expanded ? "Thu gọn" : "Xem chi tiết"}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            fill="currentColor" 
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 16 16"
          >
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>

      {/* Order details (expanded) */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-4">
          <h4 className="font-medium text-gray-700">Chi tiết sản phẩm</h4>
          
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 p-3 border border-gray-100 rounded-lg">
              <div className="w-full md:w-24 h-24 flex-shrink-0">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <h5 className="font-medium text-gray-800">{item.product.name}</h5>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                    <span className="text-sm text-gray-500">x{item.quantity}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.product.description}</p>
                <div className="mt-2 text-sm font-medium text-gray-700">
                  Tổng: {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
