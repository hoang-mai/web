import React from 'react';

const PromotionsPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Khuyến Mãi Đặc Biệt</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Giảm giá 20% cho iPhone</h2>
          <p className="text-gray-700">Áp dụng đến hết ngày 15/06. Số lượng có hạn, nhanh tay đặt mua!</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Mua 1 tặng 1 phụ kiện</h2>
          <p className="text-gray-700">Khi mua bất kỳ điện thoại nào, bạn sẽ được tặng ngay 1 phụ kiện bất kỳ.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Miễn phí vận chuyển</h2>
          <p className="text-gray-700">Cho mọi đơn hàng từ 500.000 VNĐ trên toàn quốc.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Trả góp 0% lãi suất</h2>
          <p className="text-gray-700">Áp dụng với tất cả sản phẩm điện thoại và laptop.</p>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
