import React from 'react';

const HelpPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Trợ Giúp</h1>
      <p className="text-gray-700 text-lg leading-relaxed">
        Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua:
      </p>
      <ul className="list-disc pl-6 text-gray-700 mt-4 space-y-2">
        <li>Email: <a href="mailto:hotro@cuahang.com" className="text-blue-500 hover:underline">hotro@cuahang.com</a></li>
        <li>Hotline: <span className="font-semibold">1800 1234</span> (miễn phí)</li>
        <li>Thời gian làm việc: 8:00 - 21:00 (Thứ 2 - Chủ nhật)</li>
      </ul>
      <p className="text-gray-700 text-lg mt-4">
        Bạn cũng có thể tham khảo <a href="/faq" className="text-blue-500 hover:underline">Câu hỏi thường gặp (FAQ)</a> để tìm câu trả lời nhanh chóng.
      </p>
    </div>
  );
};

export default HelpPage;
