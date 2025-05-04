function Statistics() {
    return ( 
        <div>
            <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Tổng số người dùng</h2>
                    <p className="text-2xl">1000</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
                    <p className="text-2xl">500</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Tổng doanh thu</h2>
                    <p className="text-2xl">$10,000</p>
                </div>
            </div>
        </div>
     );
}

export default Statistics;