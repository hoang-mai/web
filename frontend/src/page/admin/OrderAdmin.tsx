import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { patch,get } from '@/services/callApi';
import { getAllOrderRoute,updateOrderRoute } from '@/services/api';
import { toast } from 'react-toastify';


interface Product {
    createdAt: string;
    updatedAt: string;
    id: number;
    name: string;
    price: string;
    stock: number;
    description: string;
    imageUrl: string;
    isDeleted: boolean;
    discount: number;
    category: string;
}

interface OrderItem {
    createdAt: string;
    updatedAt: string;
    id: number;
    product: Product;
    price: string;
    quantity: number;
}

interface Order {
    createdAt: string;
    updatedAt: string;
    id: number;
    totalPrice: string;
    status: string;
    orderItems: OrderItem[];
}

const OrderManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('orders-list');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [currentSort, setCurrentSort] = useState({ field: 'id', direction: 'asc' });
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [timeRange, setTimeRange] = useState('month');

    const statusChartRef = useRef<HTMLCanvasElement>(null);
    const revenueChartRef = useRef<HTMLCanvasElement>(null);
    const statusChartInstance = useRef<Chart | null>(null);
    const revenueChartInstance = useRef<Chart | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await get(getAllOrderRoute);
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setFilteredOrders(orders);
        }
    };

    useEffect(() => {
        fetchOrders();
        initCharts();
        return () => {
            if (statusChartInstance.current) statusChartInstance.current.destroy();
            if (revenueChartInstance.current) revenueChartInstance.current.destroy();
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'order-stats') {
            updateCharts();
        }
    }, [activeTab, timeRange]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleSort = (field: string) => {
        const direction = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
        setCurrentSort({ field, direction });
    };

    const applyFilters = () => {
        const filtered = orders.filter(order => {
            if (searchInput && !order.id.toString().includes(searchInput)) {
                const items = order.orderItems;
                const hasMatchingItem = items.some(item => item.product.name.toLowerCase().includes(searchInput.toLowerCase()));
                if (!hasMatchingItem) return false;
            }
            if (statusFilter && order.status !== statusFilter) return false;
            if (dateFrom) {
                const orderDate = new Date(order.createdAt);
                const fromDate = new Date(dateFrom);
                if (orderDate < fromDate) return false;
            }
            if (dateTo) {
                const orderDate = new Date(order.createdAt);
                const toDate = new Date(dateTo);
                if (orderDate > toDate) return false;
            }
            return true;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const showOrderDetail = (orderId: number, focusOnStatus = false) => {
        setCurrentOrderId(orderId);
        setActiveTab('order-detail');
    };

    const updateOrder = (orderId: string | number,orderStatus:string) => {
        // Chuyển đổi orderId thành string nếu nó là number
        patch(updateOrderRoute.replace(':id', orderId.toString()), {
        status: orderStatus,
        });
    };
    const updateOrderStatus = () => {
        if (!currentOrderId) return;
        const newStatus = (document.getElementById('detail-status') as HTMLSelectElement).value;

        const orderIndex = orders.findIndex(o => o.id === currentOrderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            updateOrder(currentOrderId, newStatus);
            orders[orderIndex].updatedAt = new Date().toISOString();
            toast.success(`Đơn hàng #${currentOrderId} đã được cập nhật trạng thái thành ${getStatusText(newStatus)}`);
            applyFilters();
        }
    };

    const cancelOrder = () => {
        if (!currentOrderId) return;
        const orderIndex = orders.findIndex(o => o.id === currentOrderId);
        if (orderIndex !== -1) {
            const order = orders[orderIndex];
            if (order.status === 'delivered' || order.status === 'canceled') {
                toast.error(`Đơn hàng #${currentOrderId} không thể hủy vì đã được giao hoặc đã hủy.`);
                return;
            }
            if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${currentOrderId}?`)) {
                orders[orderIndex].status = 'canceled';
                orders[orderIndex].updatedAt = new Date().toISOString();
                updateOrder(currentOrderId, 'canceled');
                (document.getElementById('detail-status') as HTMLSelectElement).value = 'canceled';
                toast.success(`Đơn hàng #${currentOrderId} đã được hủy.`);
                applyFilters();
            }
        }
    };

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let aValue: any = a[currentSort.field as keyof Order];
        let bValue: any = b[currentSort.field as keyof Order];
        if (currentSort.field === 'totalPrice') {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        } else if (currentSort.field === 'orderItems') {
            aValue = a.orderItems.length;
            bValue = b.orderItems.length;
        } else if (currentSort.field === 'createdAt') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }
        if (currentSort.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = sortedOrders.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const initCharts = () => {
        if (statusChartRef.current) {
            statusChartInstance.current = new Chart(statusChartRef.current, {
                type: 'pie',
                data: {
                    labels: ['Chờ xử lý','Đã thanh toán', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy',],
                    datasets: [{
                        data: [0, 0, 0, 0, 0],
                      backgroundColor: [
                        '#facc15', 
                        '#fb923c', 
                        '#6366f1', 
                        '#10b981', 
                        '#f87171', 
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
        if (revenueChartRef.current) {
            revenueChartInstance.current = new Chart(revenueChartRef.current, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Doanh thu',
                        data: [],
                        backgroundColor: '#3B82F6',
                        borderColor: '#2563EB',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: (value) => formatCurrency(Number(value)) }
                        }
                    }
                }
            });
        }
        updateCharts();
    };

    const updateCharts = () => {
        if (statusChartInstance.current) {
            const statusCounts = {
                pending: 0,
                completed: 0,
                shipping: 0,
                delivered: 0,
                cancelled: 0
               
            };
            filteredOrders.forEach(order => statusCounts[order.status as keyof typeof statusCounts]++);
            statusChartInstance.current.data.datasets[0].data = [
                statusCounts.pending,
                statusCounts.completed,
                statusCounts.shipping,
                statusCounts.delivered,
                statusCounts.cancelled,
              
            ];
            statusChartInstance.current.update();
        }
        if (revenueChartInstance.current) {
            let labels: string[] = [];
            let data: number[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch (timeRange) {
                case 'today':
                    labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
                    data = Array(8).fill(0);
                    const startOfDay = new Date(today);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(startOfDay);
                    endOfDay.setDate(endOfDay.getDate() + 1);
                
                    filteredOrders.forEach(order => {
                        const orderDate = new Date(order.createdAt);
                        if (orderDate >= startOfDay && orderDate < endOfDay) {
                            const hour = orderDate.getHours();
                            const index = Math.floor(hour / 3);
                            data[index] += parseFloat(order.totalPrice);
                        }
                    });
                    break;
                case 'week':
                        labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
                        data = Array(7).fill(0);
                    
                        const currentDay = today.getDay(); // 0 (CN) - 6 (T7)
                        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
                        const startOfWeek = new Date(today);
                        startOfWeek.setDate(today.getDate() + mondayOffset);
                        startOfWeek.setHours(0, 0, 0, 0);
                    
                        const endOfWeek = new Date(startOfWeek);
                        endOfWeek.setDate(startOfWeek.getDate() + 7);
                    
                        filteredOrders.forEach(order => {
                            const orderDate = new Date(order.createdAt);
                            if (orderDate >= startOfWeek && orderDate < endOfWeek) {
                                const day = orderDate.getDay(); // 0 = CN
                                const index = day === 0 ? 6 : day - 1;
                                data[index] += parseFloat(order.totalPrice);
                            }
                        });
                    break;
                case 'year':
                    labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                    data = Array(12).fill(0);
                    filteredOrders.forEach(order => {
                        const orderDate = new Date(order.createdAt);
                        if (orderDate.getFullYear() === today.getFullYear()) {
                            const month = orderDate.getMonth();
                            data[month] += parseFloat(order.totalPrice);
                        }
                    });
                    break;
                default: // month
                    labels = ['1', '5', '10', '15', '20', '25', '30'];
                    data = Array(7).fill(0);
                    filteredOrders.forEach(order => {
                        const orderDate = new Date(order.createdAt);
                        if (orderDate.getFullYear() === today.getFullYear() && orderDate.getMonth() === today.getMonth()) {
                            const day = orderDate.getDate();
                            const index = Math.min(Math.floor((day - 1) / 5), 6);
                            data[index] += parseFloat(order.totalPrice);
                        }
                    });
                    break;
            }
            revenueChartInstance.current.data.labels = labels;
            revenueChartInstance.current.data.datasets[0].data = data;
            revenueChartInstance.current.update();
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(value);
      };

    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            pending: 'Chờ xử lý',
            completed: 'Đã thanh toán',
            shipping: 'Đang giao hàng',
            delivered: 'Đã giao hàng',
            canceled: 'Đã hủy',
        };
        return statusMap[status] || status;
    };

    const getOrderItems = (orderId: number): OrderItem[] => {
        const order = orders.find(o => o.id === orderId);
        return order ? order.orderItems : [];
    };

    const clearFilters = () => {
        setSearchInput('');
        setDateFrom('');
        setDateTo('');
        setStatusFilter('');    
      };

    useEffect(() => {
    applyFilters();
    }, [searchInput, dateFrom, dateTo, statusFilter]);
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <style>{`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f5f7fa;
                }
                .tab-content {
                    display: none;
                }
                .tab-content.active {
                    display: block;
                }
                .pagination-btn {
                    padding: 0.25rem 0.75rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                }
                .pagination-btn:hover {
                    background-color: #eff6ff;
                }
                .pagination-btn.active {
                    background-color: #2563eb;
                    color: white;
                }
                .pagination-btn.active:hover {
                    background-color: #1d4ed8;
                }
                .sortable:hover {
                    cursor: pointer;
                    background-color: #f9fafb;
                }
                .sortable::after {
                    content: "↕️";
                    font-size: 0.7rem;
                    margin-left: 4px;
                    opacity: 0.5;
                }
                .sortable.asc::after {
                    content: "↑";
                    opacity: 1;
                }
                .sortable.desc::after {
                    content: "↓";
                    opacity: 1;
                }
                .status-badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
               .status-pending {
                    background-color: #facc15; /* vàng đậm */
                    color: #78350f;
                }
                .status-completed {
                    background-color: #fb923c; /* cam đậm */
                    color: #7c2d12;
                }
                .status-shipping {
                    background-color: #6366f1; /* tím xanh đậm */
                    color: #eef2ff;
                }
                .status-delivered {
                    background-color: #10b981; /* xanh ngọc đậm */
                    color: #ecfdf5;
                }
                .status-canceled {
                    background-color: #f87171; /* đỏ nhạt đậm */
                    color: #7f1d1d;
                }
              
                .product-image {
                    width: 48px;
                    height: 48px;
                    object-fit: cover;
                    border-radius: 0.375rem;
                }
            `}</style>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🔍 Tìm theo</label>
                        <input
                            type="text"
                            id="search-input"
                            placeholder="ID, Tên sản phẩm"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">📆 Từ ngày</label>
                            <input
                                type="date"
                                id="date-from"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">📆 Đến ngày</label>
                            <input
                                type="date"
                                id="date-to"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">📂 Trạng thái</label>
                        <select
                            id="status-filter"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="completed">Đã thanh toán</option>
                            <option value="shipping">Đang giao hàng</option>
                            <option value="delivered">Đã giao hàng</option>
                            <option value="canceled">Đã hủy</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        id="search-btn"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
                        onClick={applyFilters}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Tìm kiếm
                    </button>
                    <button
                        id="clear-filters-btn"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-200 flex items-center"
                        onClick={clearFilters}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            className={`tab-btn py-4 px-6 border-b-2 text-sm font-medium ${activeTab === 'orders-list' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => handleTabChange('orders-list')}
                        >
                            📋 Danh sách đơn hàng
                        </button>
                        <button
                            className={`tab-btn py-4 px-6 border-b-2 text-sm font-medium ${activeTab === 'order-detail' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => handleTabChange('order-detail')}
                        >
                            📄 Chi tiết đơn hàng
                        </button>
                        <button
                            className={`tab-btn py-4 px-6 border-b-2 text-sm font-medium ${activeTab === 'order-stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            onClick={() => handleTabChange('order-stats')}
                        >
                            📊 Thống kê đơn hàng
                        </button>
                    </nav>
                </div>
                <div className="p-6">
                    <div className={`tab-content ${activeTab === 'orders-list' ? 'active' : ''}`}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sortable ${currentSort.field === 'id' ? currentSort.direction : ''}`}
                                            onClick={() => handleSort('id')}
                                        >
                                            ID
                                        </th>
                                        <th
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sortable ${currentSort.field === 'createdAt' ? currentSort.direction : ''}`}
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Ngày tạo
                                        </th>
                                        <th
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sortable ${currentSort.field === 'totalPrice' ? currentSort.direction : ''}`}
                                            onClick={() => handleSort('totalPrice')}
                                        >
                                            Tổng tiền
                                        </th>
                                        <th
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sortable ${currentSort.field === 'status' ? currentSort.direction : ''}`}
                                            onClick={() => handleSort('status')}
                                        >
                                            Trạng thái
                                        </th>
                                        <th
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sortable ${currentSort.field === 'orderItems' ? currentSort.direction : ''}`}
                                            onClick={() => handleSort('orderItems')}
                                        >
                                            Số sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parseFloat(order.totalPrice))}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`status-badge status-${order.status}`}>{getStatusText(order.status)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderItems.length} sản phẩm</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                    onClick={() => showOrderDetail(order.id)}
                                                >
                                                    👁 Chi tiết
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    onClick={() => showOrderDetail(order.id, true)}
                                                >
                                                    🖊 Cập nhật
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-700">
                                Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredOrders.length)} của {filteredOrders.length} đơn hàng
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    className="pagination-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    «
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="pagination-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`tab-content ${activeTab === 'order-detail' ? 'active' : ''}`}>
                        {currentOrderId && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin đơn hàng</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">ID đơn hàng</p>
                                                <p className="font-medium">{currentOrderId}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày tạo</p>
                                                <p className="font-medium">{new Date(orders.find(o => o.id === currentOrderId)?.createdAt || '').toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày cập nhật</p>
                                                <p className="font-medium">{new Date(orders.find(o => o.id === currentOrderId)?.updatedAt || '').toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm text-gray-500">Trạng thái</p>
                                                <select
                                                    id="detail-status"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                    defaultValue={orders.find(o => o.id === currentOrderId)?.status}
                                                >
                                                    <option value="pending">Chờ xử lý</option>
                                                    <option value="shipping">Đang giao hàng</option>
                                                    <option value="delivered">Đã giao hàng</option>
                                                    <option value="canceled">Đã hủy</option>
                                                    <option value="completed">Đã thanh toán</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tổng quan</h3>
                                        <div className="bg-white p-4 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Tổng tiền:</span>
                                                <span className="text-xl font-bold text-gray-900">{formatCurrency(parseFloat(orders.find(o => o.id === currentOrderId)?.totalPrice || '0'))}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex space-x-3">
                                            <button
                                                id="update-status-btn"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
                                                onClick={updateOrderStatus}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Cập nhật trạng thái
                                            </button>
                                            <button
                                                id="cancel-order-btn"
                                                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center ${orders.find(o => o.id === currentOrderId)?.status === 'delivered' || orders.find(o => o.id === currentOrderId)?.status === 'canceled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={cancelOrder}
                                                disabled={orders.find(o => o.id === currentOrderId)?.status === 'delivered' || orders.find(o => o.id === currentOrderId)?.status === 'canceled'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Hủy đơn hàng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Danh sách sản phẩm</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentOrderId && getOrderItems(currentOrderId).map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.product.imageUrl ? (
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        className="product-image"
                                        
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                                                        📦
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parseFloat(item.price))}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(parseFloat(item.price) * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`tab-content ${activeTab === 'order-stats' ? 'active' : ''}`}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn khoảng thời gian:</label>
                            <select
                                id="time-range"
                                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                                <option value="year">Năm nay</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái đơn hàng</h3>
                                <div className="h-64">
                                    <canvas ref={statusChartRef} />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Doanh thu theo thời gian</h3>
                                <div className="h-64">
                                    <canvas ref={revenueChartRef} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;