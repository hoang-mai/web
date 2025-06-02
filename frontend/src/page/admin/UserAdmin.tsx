import React, { useEffect, useState } from 'react';
import { get } from '@/services/callApi';
import { getUserRoute, getOrderRoute } from '@/services/api';
import OrderComponent from "@/components/Order";
import { toast } from 'react-toastify';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  imageUrl: string;
}

const itemsPerPage = 10;

const UserAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await get(`${getUserRoute}?page=${page}&limit=${itemsPerPage}`);
      if (response?.data?.data) {
        setUsers(response.data.data);
        setTotalUsers(response.data.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleFindOrders = async (userId: number) => {
    try {
      const url = getOrderRoute.replace(':userId', userId.toString());
      const response = await get(url);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === '' || user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handleRowClick = (userId: number) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null);
      setOrders([]);
    } else {
      setSelectedUserId(userId);
      handleFindOrders(userId);
    }
  };

  const getBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      case "staff":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">View and manage user accounts</p>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name, email, phone, or address..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase">Address</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(user.id)}
                      >
                        <td className="py-4 px-6">{user.id}</td>
                        <td className="py-4 px-6 flex flex-row items-center gap-2">
                          <img src={user.imageUrl} alt=" " className="w-10 h-10 rounded-full" />
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </td>
                        <td className="py-4 px-6">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">{user.phone}</td>
                        <td className="py-4 px-6 max-w-xs">{user.address}</td>
                      </tr>
                      {selectedUserId === user.id && (
                        <tr>
                          <td colSpan={6} className="bg-gray-50 px-6 py-4">
                            <div className="text-sm text-gray-700">
                              <p><strong>Full name:</strong> {user.firstName} {user.lastName}</p>
                              <p><strong>Email:</strong> {user.email}</p>
                              <p><strong>Phone:</strong> {user.phone}</p>
                              <p><strong>Address:</strong> {user.address}</p>
                              <p><strong>Role:</strong> {user.role}</p>
                              <div className="mt-4">
                                <h3 className="font-semibold mb-2">Orders:</h3>
                                {orders.length === 0 ? (
                                  <p className="text-gray-500">No orders found.</p>
                                ) : (
                                  orders.map((order) => (
                                    <OrderComponent key={order.id} order={order} />
                                  ))
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAdmin;
