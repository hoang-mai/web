
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Dashboard,
  Inventory2,
  People,
  ShoppingCart,
  Assessment,
  ChatBubbleOutline,
  MenuOpen,
  Menu,
} from "@mui/icons-material";
import { useProfileAdmin } from "@/store/useProfileAdmin";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface LeftSideBarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftSideBar = ({ collapsed, setCollapsed }: LeftSideBarProps) => {
  const location = useLocation();
  const admin = useProfileAdmin((state) => state.admin);

  const navItems: NavItem[] = [
    { label: "Trang chủ", path: "/admin", icon: <Dashboard /> },
    { label: "Sản phẩm", path: "/admin/products", icon: <Inventory2 /> },
    { label: "Người dùng", path: "/admin/users", icon: <People /> },
    { label: "Đơn hàng", path: "/admin/orders", icon: <ShoppingCart /> },
    { label: "Thống kê", path: "/admin/statistics", icon: <Assessment /> },
    { label: "Đánh giá", path: "/admin/reviews", icon: <ChatBubbleOutline /> },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`h-screen bg-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } fixed left-0 top-0 z-10`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-xl font-bold text-gray-800 overflow-hidden  whitespace-nowrap">
            Quản trị viên
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {collapsed ? <Menu /> : <MenuOpen />}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary)] text-black"
                      : "text-gray-600 hover:bg-[var(--color-tertiary)]"
                  }`}
                >
                  <div className={`${collapsed ? "mx-auto" : "mr-3"}`}>
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="font-medium whitespace-nowrap overflow-hidden ">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <span className="font-bold text-black">Q</span>
          </div>
          {!collapsed && (
            <Link to="/admin/profile">
              <div className="ml-3 cursor-pointer">
                <p className="font-medium text-gray-800">Quản trị viên</p>
                <p className="text-xs text-gray-500">
                  {admin?.email ?? "admin@example.com"}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
