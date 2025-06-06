import React, { useState } from 'react';
import {patch} from "@/services/callApi";
import { updateOrderRoute} from "@/services/api";
import {toast} from 'react-toastify';
import { Box, Button, Modal, Typography } from '@mui/material';

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
  address: string;
}

interface OrderComponentProps {
  order: Order;
  updateStatus?: (orderId: string) => void;
}

// Order Component
const OrderComponent: React.FC<OrderComponentProps> = ({ order, updateStatus }) => {
  const [expanded, setExpanded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getColorByStatus = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipping: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
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

 const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};


  const statusTranslations: { [key: string]: string } = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    returned: "Đã trả hàng"
  };
  const cancelOrderApi = (orderId: string | number) => {
    // Chuyển đổi orderId thành string nếu nó là number
    return patch(updateOrderRoute.replace(':id', orderId.toString()), {
      status: 'cancelled',
    });
  };
 const handleCancel = async () => {
 
    try {
      await cancelOrderApi(order.id);
      updateStatus?.(order.id);
      toast.success("Đơn hàng đã được hủy thành công");
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
    } finally {
      setOpenModal(false);
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
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>Xác nhận hủy đơn hàng</Typography>
          <Typography mb={3}>
            Bạn có chắc chắn muốn hủy đơn hàng #{order.id}?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setOpenModal(false)} variant="outlined">
              Thoát
            </Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              color='warning'
            >
              Xác nhận hủy
            </Button>
          </Box>
        </Box>
      </Modal>
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

          {updateStatus&&(<button
            onClick={()=>setOpenModal(true)}
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
          <div>
            <h4 className="font-medium text-gray-700">Địa chỉ giao hàng</h4>
            <p className="text-sm text-gray-600">{order.address}</p>
          </div>
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
