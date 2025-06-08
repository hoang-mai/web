# Ứng dụng Thương mại Điện tử - E-commerce Platform

Ứng dụng thương mại điện tử toàn diện được xây dựng với NestJS (Backend) và React + TypeScript (Frontend), chuyên bán các sản phẩm điện tử như laptop, điện thoại, tablet và phụ kiện.

## 🚀 Tính năng chính

### 👥 Quản lý người dùng
- **Đăng ký/Đăng nhập**: Xác thực JWT với access token và refresh token
- **Phân quyền**: Hệ thống role-based (USER, ADMIN)
- **Quản lý hồ sơ**: Cập nhật thông tin cá nhân, đổi mật khẩu
- **Lịch sử tìm kiếm**: Lưu trữ và quản lý lịch sử tìm kiếm sản phẩm

### 🛍️ Quản lý sản phẩm
- **Danh mục sản phẩm**: LAPTOP, PHONE, TABLET, ACCESSORY
- **Tìm kiếm và lọc**: Tìm kiếm theo tên, danh mục, giá, tình trạng
- **Quản lý kho**: Theo dõi số lượng tồn kho
- **Thống kê**: Báo cáo doanh thu theo sản phẩm, thời gian

### 🛒 Giỏ hàng và Đặt hàng
- **Giỏ hàng**: Thêm, sửa, xóa sản phẩm
- **Thanh toán**: Tích hợp VNPay
- **Quản lý đơn hàng**: Trạng thái đơn hàng (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- **Lịch sử đơn hàng**: Theo dõi và lọc đơn hàng

### ⭐ Hệ thống đánh giá
- **Đánh giá sản phẩm**: Rating và bình luận
- **Bình luận**: Trả lời đánh giá
- **Quản lý**: Admin có thể quản lý tất cả đánh giá

### 💬 Chat hỗ trợ
- **Real-time chat**: Sử dụng Socket.IO
- **Chat với admin**: Khách hàng có thể chat trực tiếp với admin
- **Quản lý tin nhắn**: Admin có thể xem và trả lời tất cả cuộc hội thoại

### 📢 Thông báo Push
- **Web Push Notifications**: Thông báo real-time
- **Thông báo đến admin**: Khi có đơn hàng mới, đánh giá mới

### 📝 Quản lý bài viết
- **Tin tức/Blog**: Admin có thể tạo và quản lý bài viết
- **Hiển thị công khai**: Bài viết hiển thị cho người dùng

### 📊 Thống kê và Báo cáo
- **Doanh thu**: Theo ngày, tháng, năm
- **Sản phẩm**: Thống kê bán chạy, tồn kho
- **Charts**: Biểu đồ trực quan với Material-UI

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: NestJS
- **Database**: MySQL với TypeORM
- **Authentication**: JWT (Access + Refresh Token)
- **Real-time**: Socket.IO
- **Payment**: VNPay Integration
- **Push Notifications**: Web Push API
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston Logger
- **Validation**: Class Validator & Class Transformer

### Frontend
- **Framework**: React 19 với TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Charts**: Chart.js với MUI X-Charts
- **Real-time**: Socket.IO Client

## 📁 Cấu trúc dự án

```
web/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── entities/       # Database entities
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── users/      # User management
│   │   │   ├── products/   # Product management
│   │   │   ├── carts/      # Shopping cart
│   │   │   ├── orders/     # Order management
│   │   │   ├── chat/       # Real-time chat
│   │   │   ├── review/     # Product reviews
│   │   │   └── statistics/ # Analytics
│   │   ├── database/       # Database seeding
│   │   ├── guard/          # Authorization guards
│   │   └── middleware/     # Custom middleware
│   └── test/               # E2E tests
└── frontend/               # React Frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── page/
    │   │   ├── admin/      # Admin dashboard
    │   │   └── user/       # User interface
    │   ├── services/       # API services
    │   └── store/          # State management
    └── public/             # Static assets
```

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js 18+
- MySQL 8.0+
- npm hoặc yarn

### 1. Cài đặt Backend

```bash
cd backend
npm install
```

### 2. Cấu hình Database
Tạo file `.env` trong thư mục `backend`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ecommerce_db

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# VNPay
VNP_TMN_CODE=your_vnpay_code
VNP_HASH_SECRET=your_vnpay_secret
VNP_API=your_vnpay_api
VNP_URL=your_vnpay_url
VNP_RETURN_URL=http://localhost:5173/order-success

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 3. Khởi tạo Database

```bash
# Chạy seeding
npm run seed
```

### 4. Chạy Backend

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 5. Cài đặt và chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

Sau khi chạy backend, truy cập Swagger documentation tại:
```
http://localhost:3000/api
```

## 🔧 Scripts hữu dụng

### Backend
```bash
npm run start:dev    # Chạy dev mode với hot reload
npm run build        # Build production
npm run test         # Chạy unit tests
npm run test:e2e     # Chạy end-to-end tests
npm run seed         # Khởi tạo dữ liệu mẫu
npm run lint         # Kiểm tra code style
```

### Frontend
```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Kiểm tra code style
```

## 🌐 Ports

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **MySQL**: localhost:3306

## 📋 Tài khoản mặc định

Sau khi chạy seeding, bạn có thể đăng nhập với:

**Admin:**
- Email: admin@example.com
- Password: password123

**User:**
- Email: user@example.com  
- Password: password123

## 🔐 Bảo mật

- **JWT Authentication**: Access token (10h) + Refresh token
- **Password Hashing**: BCrypt
- **Role-based Authorization**: Guard và Decorator
- **Input Validation**: Class Validator
- **SQL Injection Protection**: TypeORM Query Builder

## 🎯 Tính năng nổi bật

1. **Real-time Chat**: Socket.IO cho chat support
2. **Payment Integration**: VNPay cho thanh toán trực tuyến
3. **Push Notifications**: Thông báo web push
4. **Advanced Search**: Tìm kiếm và lọc sản phẩm
5. **Analytics Dashboard**: Thống kê doanh thu và sản phẩm
6. **Mobile Responsive**: Giao diện responsive với Tailwind CSS
7. **PWA Ready**: Service Worker đã được cấu hình

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới [MIT License](LICENSE).

## 📞 Liên hệ

- **Email**: maianhhoang31072003@gmail.com
- **Số điện thoại**: 0867254603

---

⭐ Nếu project này hữu ích, đừng quên để lại một star!