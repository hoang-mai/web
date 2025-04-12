const addressData: Record<string, Record<string, string[]>> = {
    "Hồ Chí Minh": {
      "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Cô Giang"
        , "Phường Đa Kao", "Phường Nguyễn Cư Trinh", "Phường Nguyễn Thái Bình", "Phường Phạm Ngũ Lão", "Phường Tân Định"
      ],
      "Quận 3": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 9", "Phường 10"
        , "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường Võ Thị Sáu"
      ],
      "Quận 4": ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 8", "Phường 9", "Phường 10"
        , "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 18"],
      "Quận 5": ["Phường 1", "Phường 2","Phường 3","Phường 4","Phường 5","Phường 6","Phường 7","Phường 8","Phường 9",
        "Phường 10","Phường 11","Phường 12","Phường 13","Phường 14"
      ],
      "Quận 6": [],
      "Quận 7": [],
      "Quận 8": [],
      "Quận 10": [],
      "Quận 11": [],
      "Quận 12": [],
      "Quận Bình Tân": [],
      "Quận Bình Thạnh": [],
      "Quận Gò Vấp": [],
      "Quận Phú Nhuận": [],
        "Quận Tân Bình": [],
        "Quận Tân Phú": [],
        "Huyện Bình Chánh": [],
        "Huyện Cần Giờ": [],
        "Huyện Củ Chi": [],
        "Huyện Hóc Môn": [],
        "Huyện Nhà Bè": [],
        "Thành phố Thủ Đức": []
    },
    "Hà Nội": {
      "Quận Ba Đình": ["Phường Điện Biên", "Phường Kim Mã"],
      "Quận Bắc Từ Liêm": ["Phường Thụy Phương", "Phường Xuân Đỉnh"],
      "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Nghĩa Tân"],
      "Quận Đống Đa": ["Phường Khâm Thiên", "Phường Văn Chương"],
      "Quận Hà Đông": ["Phường Biên Giang", "Phường Đồng Mai"],
      "Quận Hai Bà Trưng": ["Phường Bạch Đằng", "Phường Thanh Lương"],
        "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Tràng Tiền"],
        "Quận Hoàng Mai": ["Phường Định Công", "Phường Lĩnh Nam"],
        "Quận Long Biên": ["Phường Việt Hưng", "Phường Gia Thụy"],
        "Quận Nam Từ Liêm": ["Phường Mỹ Đình 1", "Phường Phú Đô"],
        "Quận Tây Hồ": ["Phường Bưởi", "Phường Nhật Tân"],
        "Quận Thanh Xuân": ["Phường Nhân Chính", "Phường Thanh Xuân Bắc"],
        "Huyện Ba Vì": ["Xã Ba Trại", "Xã Cẩm Lĩnh"],
        "Huyện Chương Mỹ": ["Xã Bình Minh", "Xã Đông Sơn"],
        "Huyện Đan Phượng": ["Xã Đan Phượng", "Xã Hạ Mỗ"],
        "Huyện Đông Anh": ["Xã Bắc Hồng", "Xã Cổ Loa"],
        "Huyện Gia Lâm": ["Xã Đình Xuyên", "Xã Kim Sơn"],
        "Huyện Hoài Đức": ["Xã An Khánh", "Xã Cát Quế"],
        "Huyện Mê Linh": ["Xã Chu Phan", "Xã Đại Thịnh"],
        "Huyện Mỹ Đức": ["Xã An Phú", "Xã Bột Xuyên"],
        "Huyện Phú Xuyên": ["Xã Đại Thắng", "Xã Hồng Thái"],
        "Huyện Phúc Thọ": ["Xã Bình Yên", "Xã Tam Hiệp"],
        "Huyện Quốc Oai": ["Xã Cộng Hòa", "Xã Đông Yên"],
        "Huyện Sóc Sơn": ["Xã Bắc Sơn", "Xã Minh Trí"],
        "Huyện Thanh Oai": ["Xã Bích Hòa", "Xã Kim Bài"],
        "Huyện Thanh Trì": ["Xã Đại Áng", "Xã Ngọc Hồi"],
        "Huyện Thạch Thất": ["Xã Bình Phú", "Xã Cần Kiệm"],
        "Huyện Thường Tín": ["Xã Bình Minh", "Xã Dũng Tiến"],
        "Huyện Ứng Hòa": ["Xã Đồng Tiến", "Xã Hòa Nam"],
        "Thị xã Sơn Tây": ["Phường Lê Lợi", "Phường Quang Trung"]
    },
    "Đà Nẵng": {
        "Quận Hải Châu": ["Phường Bình Hiên", "Phường Hòa Cường Bắc"],
        "Quận Liên Chiểu": ["Phường Hòa Minh", "Phường Thanh Khê Tây"],
        "Quận Ngũ Hành Sơn": ["Phường Hòa Hải", "Phường Mỹ An"],
        "Quận Sơn Trà": ["Phường An Hải Bắc", "Phường Thọ Quang"],
        "Quận Thanh Khê": ["Phường Chính Gián", "Phường Xuân Hà"],
        "Huyện Hòa Vang": ["Xã Hòa Phong", "Xã Hòa Nhơn"],
        "Huyện Hoàng Sa": ["Xã Đảo Hoàng Sa"]
    },
    "An Giang": {
        "Huyện An Phú": ["Thị trấn An Phú", "Xã Khánh An"],
        "Huyện Châu Phú": ["Thị trấn Cái Dầu", "Xã Khánh Hòa"],
        "Huyện Châu Thành": ["Thị trấn Cái Dầu", "Xã Vĩnh An"],
        "Huyện Phú Tân": ["Thị trấn Phú Mỹ", "Xã Phú Thọ"],
        "Huyện Tân Châu": ["Thị trấn Tân Châu", "Xã Tân An"],
        "Huyện Tịnh Biên": ["Thị trấn Tịnh Biên", "Xã Núi Voi"],
        "Huyện Thoại Sơn": ["Thị trấn Núi Sập", "Xã Vĩnh Trạch"],
        "Thành phố Châu Đốc": ["Phường Châu Phú A", "Phường Vĩnh Mỹ"],
        "Thành phố Long Xuyên": ["Phường Mỹ Bình", "Phường Mỹ Long"],
        "Thành phố Núi Sập": ["Phường Núi Sập", "Phường Vĩnh Trà"]
    },
    "Bà Rịa - Vũng Tàu": {
        "Thành phố Bà Rịa": ["Phường Phước Trung", "Phường Long Tâm"],
        "Thành phố Vũng Tàu": ["Phường 1", "Phường 2"],
        "Huyện Châu Đức": ["Thị trấn Ngãi Giao", "Xã Bình Trung"],
        "Huyện Đất Đỏ": ["Thị trấn Đất Đỏ", "Xã Long Tân"],
        "Huyện Long Điền": ["Thị trấn Long Điền", "Xã An Ngãi"],
        "Huyện Tân Thành": ["Thị trấn Phú Mỹ", "Xã Hắc Dịch"]
    },
    "Bắc Giang": {
        "Huyện Hiệp Hòa": ["Thị trấn Thắng", "Xã Bắc Lý"],
        "Huyện Lạng Giang": ["Thị trấn Lạng Giang", "Xã Tân Dĩnh"],
        "Huyện Lục Nam": ["Thị trấn Đồi Ngô", "Xã Lục Sơn"],
        "Huyện Lục Ngạn": ["Thị trấn Chũ", "Xã Tân Quang"],
        "Huyện Sơn Động": ["Thị trấn An Châu", "Xã An Bá"],
        "Huyện Tân Yên": ["Thị trấn Nhã Nam", "Xã Ngọc Châu"],
        "Huyện Việt Yên": ["Thị trấn Bích Động", "Xã Vân Trung"],
        "Thành phố Bắc Giang": ["Phường Dĩnh Kế", "Phường Trần Nguyên Hãn"]
    },
    "Bắc Kạn": {
        "Huyện Ba Bể": ["Thị trấn Chợ Rã", "Xã Nam Mẫu"],
        "Huyện Bạch Thông": ["Thị trấn Phủ Thông", "Xã Quân Bình"],
        "Huyện Chợ Đồn": ["Thị trấn Bằng Lũng", "Xã Yên Thượng"],
        "Huyện Chợ Mới": ["Thị trấn Đồng Tâm", "Xã Thanh Bình"],
        "Huyện Na Rì": ["Thị trấn Na Rì", "Xã Nguyên Phúc"],
        "Thành phố Bắc Kạn": ["Phường Sông Cầu", "Phường Xuất Hóa"]
    },
    "Bạc Liêu": {
        "Huyện Bạc Liêu": ["Thị trấn Bạc Liêu", "Xã Vĩnh Trạch"],
        "Huyện Đông Hải": ["Thị trấn Gành Hào", "Xã An Trạch"],
        "Huyện Hòa Bình": ["Thị trấn Hòa Bình", "Xã Vĩnh Mỹ A"],
        "Huyện Hồng Dân": ["Thị trấn Hồng Dân", "Xã Ninh Quới"],
        "Huyện Phước Long": ["Thị trấn Phước Long", "Xã Vĩnh Phú Tây"],
        "Huyện Vĩnh Lợi": ["Thị trấn Châu Hưng", "Xã Châu Hưng A"],
        "Thành phố Bạc Liêu": ["Phường 1", "Phường 2"],
        "Thành phố Giá Rai": ["Phường 1", "Phường 2"]
    },
    "Bắc Ninh": {
        "Huyện Gia Bình": ["Thị trấn Gia Bình", "Xã Nhân Thắng"],
        "Huyện Lương Tài": ["Thị trấn Lương Tài", "Xã An Bình"],
        "Huyện Quế Võ": ["Thị trấn Phố Mới", "Xã Việt Hùng"],
        "Huyện Thuận Thành": ["Thị trấn Hồ", "Xã Ngũ Thái"],
        "Huyện Tiên Du": ["Thị trấn Lim", "Xã Nội Duong"],
        "Thành phố Bắc Ninh": ["Phường Đại Phúc", "Phường Khắc Niệm"]
    },
    "Bến Tre": {
        "Huyện Ba Tri": ["Thị trấn Ba Tri", "Xã An Bình"],
        "Huyện Bình Đại": ["Thị trấn Bình Đại", "Xã Thới Lai"],
        "Huyện Châu Thành": ["Thị trấn Châu Thành", "Xã Phú Túc"],
        "Huyện Giồng Trôm": ["Thị trấn Giồng Trôm", "Xã Lương Hòa"],
        "Huyện Mỏ Cày Bắc": ["Thị trấn Mỏ Cày", "Xã Tân Thanh"],
        "Huyện Mỏ Cày Nam": ["Thị trấn Mỏ Cày", "Xã Tân Phú"],
        "Huyện Thạnh Phú": ["Thị trấn Thạnh Phú", "Xã An Nhơn"],
        "Thành phố Bến Tre": ["Phường 1", "Phường 2"]
    },
    "Bình Định": {
        "Huyện An Lão": ["Thị trấn An Lão", "Xã An Hòa"],
        "Huyện Hoài Ân": ["Thị trấn Tăng Bạt Hổ", "Xã Ân Tín"],
        "Huyện Hoài Nhơn": ["Thị trấn Bồng Sơn", "Xã Hoài Châu"],
        "Huyện Phù Cát": ["Thị trấn Ngọc Hòa", "Xã Cát Khánh"],
        "Huyện Phù Mỹ": ["Thị trấn Phù Mỹ", "Xã Mỹ Thắng"],
        "Huyện Tuy Phước": ["Thị trấn Tuy Phước", "Xã Phước Lộc"],
        "Thành phố Quy Nhơn": ["Phường Trần Phú", "Phường Lê Hồng Phong"]
    },
    "Bình Dương": {
        "Huyện Bắc Tân Uyên": ["Thị trấn Tân Thành", "Xã Lạc An"],
        "Huyện Bàu Bàng": ["Thị trấn Lai Uyên", "Xã Trừ Văn Thố"],
        "Huyện Dầu Tiếng": ["Thị trấn Dầu Tiếng", "Xã Minh Hòa"],
        "Huyện Phú Giáo": ["Thị trấn Phước Vĩnh", "Xã Tân Hiệp"],
        "Huyện Tân Uyên": ["Thị trấn Tân Phước Khánh", "Xã Khánh Bình"],
        "Thành phố Dĩ An": ["Phường Dĩ An", "Phường Bình An"],
        "Thành phố Thuận An": ["Phường Lái Thiêu", "Phường Bình Chuẩn"]
    },
    "Bình Phước": {
        "Huyện Bù Đốp": ["Thị trấn Thanh Bình", "Xã Tân Tiến"],
        "Huyện Bù Gia Mập": ["Thị trấn Phước Bình", "Xã Đak Ơ"],
        "Huyện Chơn Thành": ["Thị trấn Chơn Thành", "Xã Minh Hưng"],
        "Huyện Đồng Phú": ["Thị trấn Đồng Phú", "Xã Tân Phước"],
        "Huyện Hớn Quản": ["Thị trấn Hớn Quản", "Xã An Khương"],
        "Huyện Phú Riềng": ["Thị trấn Phú Riềng", "Xã Long Bình"],
        "Thành phố Đồng Xoài": ["Phường Tân Bình", "Phường Tân Xuân"]
    },
    "Bình Thuận": {
        "Huyện Bắc Bình": ["Thị trấn Chợ Lầu", "Xã Phan Điền"],
        "Huyện Đức Linh": ["Thị trấn Đức Tài", "Xã Đức Hạnh"],
        "Huyện Hàm Tân": ["Thị trấn Ma Lâm", "Xã Tân Thắng"],
        "Huyện Tuy Phong": ["Thị trấn Tuy Phong", "Xã Phú Lạc"],
        "Thành phố Phan Thiết": ["Phường Phú Thủy", "Phường Phú Hài"]
    },
    "Cà Mau": {
        "Huyện Cái Nước": ["Thị trấn Cái Nước", "Xã Hưng Mỹ"],
        "Huyện Đầm Dơi": ["Thị trấn Đầm Dơi", "Xã Tân Đức"],
        "Huyện Năm Căn": ["Thị trấn Năm Căn", "Xã Tam Giang"],
        "Huyện Ngọc Hiển": ["Thị trấn Rạch Gốc", "Xã Tân Ân"],
        "Huyện Phú Tân": ["Thị trấn Phú Tân", "Xã Phú Thuận"],
        "Huyện Thới Bình": ["Thị trấn Thới Bình", "Xã Biển Bạch"],
        "Thành phố Cà Mau": ["Phường 1", "Phường 2"]
    },
    "Cần Thơ": {
        "Quận Bình Thủy": ["Phường Bình Thủy", "Phường Long Hòa"],
        "Quận Cái Răng": ["Phường Ba Láng", "Phường Hưng Phú"],
        "Quận Ninh Kiều": ["Phường An Khánh", "Phường An Hội"],
        "Quận Ô Môn": ["Phường Châu Văn Liêm", "Phường Thới An"],
        "Quận Thốt Nốt": ["Phường Thốt Nốt", "Phường Tân Hưng"],
        "Huyện Cờ Đỏ": ["Thị trấn Cờ Đỏ", "Xã Trung An"],
        "Huyện Phong Điền": ["Thị trấn Phong Điền", "Xã Nhơn Ái"],
        "Huyện Thới Lai": ["Thị trấn Thới Lai", "Xã Trường Thành"]
    },
    "Cao Bằng": {
        "Huyện Bảo Lạc": ["Thị trấn Bảo Lạc", "Xã Hưng Đạo"],
        "Huyện Bảo Lâm": ["Thị trấn Bảo Lâm", "Xã Đức Hạnh"],
        "Huyện Hà Quảng": ["Thị trấn Xuân Hòa", "Xã Hồng Việt"],
        "Huyện Nguyên Bình": ["Thị trấn Nguyên Bình", "Xã Vũ Minh"],
        "Huyện Phục Hòa": ["Thị trấn Phục Hòa", "Xã Tân Việt"],
        "Huyện Thạch An": ["Thị trấn Thạch An", "Xã Đức Thông"],
        "Thành phố Cao Bằng": ["Phường Sông Bằng", "Phường Tân Giang"]
    },
    "Đắk Lắk": {
        "Huyện Buôn Đôn": ["Thị trấn Buôn Đôn", "Xã Krông Na"],
        "Huyện Cư Kuin": ["Thị trấn Cư Kuin", "Xã Ea Ktur"],
        "Huyện Cư M'gar": ["Thị trấn Quảng Phú", "Xã Ea Tar"],
        "Huyện Ea H'leo": ["Thị trấn Ea H'leo", "Xã Ea H'leo"],
        "Huyện Krông Ana": ["Thị trấn Buôn Trấp", "Xã Bình Hòa"],
        "Huyện Krông Búk": ["Thị trấn Krông Búk", "Xã Tân Lập"],
        "Huyện Lắk": ["Thị trấn Liên Sơn", "Xã Đắk Liêng"],
        "Huyện M'Đrắk": ["Thị trấn M'Đrắk", "Xã Cư San"],
        "Huyện Tây Sơn": ["Thị trấn Phú Túc", "Xã Bình Thuận"],
        "Thành phố Buôn Ma Thuột": ["Phường Tân Lợi", "Phường Tân Thành"]
    },
    "Đắk Nông": {
        "Huyện Đắk Glong": ["Thị trấn Đắk Mil", "Xã Quảng Sơn"],
        "Huyện Đắk R'lấp": ["Thị trấn Kiến Đức", "Xã Nghĩa Thắng"],
        "Huyện Gia Nghĩa": ["Thị trấn Gia Nghĩa", "Xã Đắk Nia"],
        "Huyện Krông Nô": ["Thị trấn Đắk Mâm", "Xã Nam Nung"],
        "Huyện Tuy Đức": ["Thị trấn Tuy Đức", "Xã Đắk Buk So"]
    },
    "Điện Biên": {
        "Huyện Điện Biên": ["Thị trấn Điện Biên Đông", "Xã Thanh Nưa"],
        "Huyện Điện Biên Đông": ["Thị trấn Điện Biên Đông", "Xã Mường Luân"],
        "Huyện Mường Nhé": ["Thị trấn Mường Nhé", "Xã Mường Nhé"],
        "Huyện Mường Lay": ["Thị trấn Mường Lay", "Xã Lay Nưa"],
        "Huyện Tủa Chùa": ["Thị trấn Tủa Chùa", "Xã Tủa Thàng"],
        "Thành phố Điện Biên Phủ": ["Phường Him Lam", "Phường Mường Thanh"]
    },
    "Đồng Nai" :{
        "Huyện Biên Hòa": ["Phường An Bình", "Phường Bửu Long"],
        "Huyện Long Thành": ["Thị trấn Long Thành", "Xã An Phước"],
        "Huyện Nhơn Trạch": ["Thị trấn Nhơn Trạch", "Xã Phú Hội"],
        "Huyện Tân Phú": ["Thị trấn Tân Phú", "Xã Nam Cát Tiên"],
        "Huyện Vĩnh Cửu": ["Thị trấn Vĩnh An", "Xã Thanh Bình"],
        "Thành phố Biên Hòa": ["Phường Tam Hiệp", "Phường Tân Hiệp"]
    },
    "Đồng Tháp": {
        "Huyện Cao Lãnh": ["Thị trấn Cao Lãnh", "Xã An Bình"],
        "Huyện Châu Thành": ["Thị trấn Cái Tàu Hạ", "Xã An Hiệp"],
        "Huyện Hồng Ngự": ["Thị trấn Hồng Ngự", "Xã Thường Thới Tiền"],
        "Huyện Lai Vung": ["Thị trấn Lai Vung", "Xã Long Hậu"],
        "Huyện Lấp Vò": ["Thị trấn Lấp Vò", "Xã Bình Thạnh"],
        "Huyện Tam Nông": ["Thị trấn Tràm Chim", "Xã Phú Thành A"],
        "Huyện Tân Hồng": ["Thị trấn Sa Rài", "Xã Tân Hộ Cơ"],
        "Thành phố Cao Lãnh": ["Phường 1", "Phường 2"]
    },
    "Gia Lai": {
        "Huyện An Khê": ["Thị trấn An Khê", "Xã An Phú"],
        "Huyện Chư Păh": ["Thị trấn Chư Păh", "Xã Ia Kha"],
        "Huyện Chư Prông": ["Thị trấn Chư Prông", "Xã Ia Băng"],
        "Huyện Đức Cơ": ["Thị trấn Đức Cơ", "Xã Ia Dom"],
        "Huyện Đak Đoa": ["Thị trấn Đak Đoa", "Xã Tân Bình"],
        "Huyện Ia Grai": ["Thị trấn Ia Kha", "Xã Ia Sao"],
        "Huyện Krông Pa": ["Thị trấn Phú Túc", "Xã Phú Cần"],
        "Huyện Mang Yang": ["Thị trấn Kon Gang", "Xã Lơ Pang"],
        "Huyện Phú Thiện": ["Thị trấn Phú Thiện", "Xã Ia Hla"],
        "Thành phố Pleiku": ["Phường Diên Hồng", "Phường Hoa Lư"]
    },
    "Hà Giang": {
        "Huyện Bắc Mê": ["Thị trấn Yên Phú", "Xã Đường Thượng"],
        "Huyện Bắc Quang": ["Thị trấn Vĩnh Tuy", "Xã Đồng Tâm"],
        "Huyện Hoàng Su Phì": ["Thị trấn Phố Lu", "Xã Bản Phùng"],
        "Huyện Mèo Vạc": ["Thị trấn Mèo Vạc", "Xã Pả Vi"],
        "Huyện Quản Bạ": ["Thị trấn Tam Sơn", "Xã Quyết Tiến"],
        "Huyện Vị Xuyên": ["Thị trấn Vị Xuyên", "Xã Linh Hồ"],
        "Thành phố Hà Giang": ["Phường Trần Phú", "Phường Nguyễn Trãi"]
    },
    "Hà Nam": {
        "Huyện Bình Lục": ["Thị trấn Bình Mỹ", "Xã An Đổ"],
        "Huyện Duy Tiên": ["Thị trấn Duy Tiên", "Xã Châu Giang"],
        "Huyện Kim Bảng": ["Thị trấn Quế", "Xã Thanh Sơn"],
        "Huyện Lý Nhân": ["Thị trấn Vĩnh Trụ", "Xã Nhân Đạo"],
        "Huyện Thanh Liêm": ["Thị trấn Kiện Khê", "Xã Thanh Hải"],
        "Thành phố Phủ Lý": ["Phường Minh Khai", "Phường Lê Hồng Phong"]
    },
    "Hà Tĩnh": {
        "Huyện Cẩm Xuyên": ["Thị trấn Cẩm Xuyên", "Xã Cẩm Bình"],
        "Huyện Đức Thọ": ["Thị trấn Đức Thọ", "Xã Đức Lạc"],
        "Huyện Hương Khê": ["Thị trấn Hương Khê", "Xã Hương Xuân"],
        "Huyện Kỳ Anh": ["Thị trấn Kỳ Anh", "Xã Kỳ Phú"],
        "Huyện Lộc Hà": ["Thị trấn Lộc Hà", "Xã Thạch Kim"],
        "Huyện Nghi Xuân": ["Thị trấn Nghi Xuân", "Xã Xuân Viên"],
        "Huyện Thạch Hà": ["Thị trấn Thạch Hà", "Xã Thạch Đài"],
        "Thành phố Hà Tĩnh": ["Phường Bắc Hà", "Phường Nam Hà"]
    },
    "Hải Dương": {
        "Huyện Bình Giang": ["Thị trấn Kẻ Sặt", "Xã Bình Minh"],
        "Huyện Cẩm Giàng": ["Thị trấn Cẩm Giàng", "Xã Cẩm Phúc"],
        "Huyện Gia Lộc": ["Thị trấn Gia Lộc", "Xã Gia Khánh"],
        "Huyện Kim Thành": ["Thị trấn Phú Thái", "Xã Kim Anh"],
        "Huyện Nam Sách": ["Thị trấn Nam Sách", "Xã An Sơn"],
        "Huyện Ninh Giang": ["Thị trấn Ninh Giang", "Xã Ninh Hải"],
        "Huyện Thanh Hà": ["Thị trấn Thanh Hà", "Xã Thanh Khê"],
        "Huyện Thanh Miện": ["Thị trấn Thanh Miện", "Xã Ngọc Châu"],
        "Thành phố Hải Dương": ["Phường Trần Hưng Đạo", "Phường Nguyễn Trãi"]
    },
    "Hải Phòng": {
        "Quận An Dương": ["Phường An Hưng", "Phường An Lạc"],
        "Quận An Lão": ["Phường An Lão", "Phường Đằng Hải"],
        "Quận Đồ Sơn": ["Phường Bàng La", "Phường Đồ Sơn"],
        "Quận Dương Kinh": ["Phường Anh Dũng", "Phường Dương Kinh"],
        "Quận Hải An": ["Phường Đông Hải 1", "Phường Đông Hải 2"],
        "Quận Hải Phòng": ["Phường Minh Khai", "Phường Trần Nguyên Hãn"],
        "Quận Kiến An": ["Phường Bắc Sơn", "Phường Nam Sơn"],
        "Quận Lê Chân": ["Phường An Biên", "Phường An Dương"],
        "Quận Ngô Quyền": ["Phường Máy Tơ", "Phường Máy Chai"],
        "Quận Thủy Nguyên": ["Thị trấn Núi Đèo", "Xã Thủy Đường"],
        "Huyện Bạch Long Vĩ": ["Xã Bạch Long Vĩ"],
        "Huyện Cát Hải": ["Thị trấn Cát Bà", "Xã Gia Luận"]
    },
    "Hậu Giang": {
        "Huyện Châu Thành": ["Thị trấn Ngã Bảy", "Xã Phú Hữu"],
        "Huyện Châu Thành A": ["Thị trấn Một Ngàn", "Xã Thạnh Xuân"],
        "Huyện Long Mỹ": ["Thị trấn Long Mỹ", "Xã Lương Tâm"],
        "Huyện Phụng Hiệp": ["Thị trấn Cái Tắc", "Xã Phụng Hiệp"],
        "Huyện Vị Thủy": ["Thị trấn Vị Thanh", "Xã Vị Thủy"],
        "Thành phố Vị Thanh": ["Phường 1", "Phường 2"]
    },
    "Hòa Bình": {
        "Huyện Đà Bắc": ["Thị trấn Đà Bắc", "Xã Đồng Nghê"],
        "Huyện Cao Phong": ["Thị trấn Cao Phong", "Xã Bắc Phong"],
        "Huyện Kim Bôi": ["Thị trấn Bo", "Xã Kim Bình"],
        "Huyện Lạc Sơn": ["Thị trấn Vụ Bản", "Xã Tân Mỹ"],
        "Huyện Lương Sơn": ["Thị trấn Lương Sơn", "Xã Hòa Sơn"],
        "Huyện Mai Châu": ["Thị trấn Mai Châu", "Xã Tòng Đậu"],
        "Huyện Tân Lạc": ["Thị trấn Mường Khến", "Xã Ngọc Mỹ"],
        "Huyện Yên Thủy": ["Thị trấn Yên Thủy", "Xã Yên Trị"],
        "Thành phố Hòa Bình": ["Phường Hữu Nghị", "Phường Tân Hòa"]
    },
    "Hưng Yên": {
        "Huyện Ân Thi": ["Thị trấn Ân Thi", "Xã Đào Dương"],
        "Huyện Bình Giang": ["Thị trấn Bình Giang", "Xã Bình Minh"],
        "Huyện Khoái Châu": ["Thị trấn Khoái Châu", "Xã Đông Tảo"],
        "Huyện Kim Động": ["Thị trấn Lương Bằng", "Xã Minh Hải"],
        "Huyện Mỹ Hào": ["Thị xã Mỹ Hào", "Xã Bạch Sam"],
        "Huyện Phù Cừ": ["Thị trấn Phù Cừ", "Xã Phú Thịnh"],
        "Huyện Tiên Lữ": ["Thị trấn Tiên Lữ", "Xã Lệ Xá"],
        "Thành phố Hưng Yên": ["Phường An Tảo", "Phường Hiến Nam"]
    },
    "Khánh Hòa": {
        "Huyện Cam Lâm": ["Thị trấn Cam Đức", "Xã Cam Hải Đông"],
        "Huyện Diên Khánh": ["Thị trấn Diên Khánh", "Xã Diên Phú"],
        "Huyện Khánh Sơn": ["Thị trấn Tô Hạp", "Xã Sơn Hiệp"],
        "Huyện Vạn Ninh": ["Thị trấn Vạn Giã", "Xã Vạn Thạnh"],
        "Thành phố Nha Trang": ["Phường Vĩnh Hải", "Phường Vĩnh Hòa"],
        "Thành phố Cam Ranh": ["Phường Cam Nghĩa", "Phường Cam Lộc"]
    },
    "Kiên Giang": {
        "Huyện An Biên": ["Thị trấn An Biên", "Xã Tây Yên"],
        "Huyện An Minh": ["Thị trấn Thứ Ba", "Xã Đông Hòa"],
        "Huyện Châu Thành": ["Thị trấn Minh Lương", "Xã Vĩnh Hòa"],
        "Huyện Giang Thành": ["Thị trấn Giang Thành", "Xã Phú Mỹ"],
        "Huyện Hòn Đất": ["Thị trấn Hòn Đất", "Xã Mỹ Thái"],
        "Huyện Kiên Hải": ["Thị trấn Kiên Hải", "Xã An Sơn"],
        "Huyện Kiên Lương": ["Thị trấn Kiên Lương", "Xã Bình Trị"],
        "Huyện Phú Quốc": ["Thị trấn Dương Đông", "Xã Cửa Cạn"],
        "Huyện U Minh Thượng": ["Thị trấn U Minh Thượng", "Xã An Minh Bắc"],
        "Thành phố Rạch Giá": ["Phường Vĩnh Thanh", "Phường Vĩnh Quang"]
    },
    "Kon Tum": {
        "Huyện Đăk Glei": ["Thị trấn Đăk Glei", "Xã Đăk Nho"],
        "Huyện Đăk Hà": ["Thị trấn Đăk Hà", "Xã Đăk Mar"],
        "Huyện Kon Plong": ["Thị trấn Măng Đen", "Xã Đăk Ring"],
        "Huyện Kon Rẫy": ["Thị trấn Đăk Tô", "Xã Đăk Ruồng"],
        "Huyện Ngọc Hồi": ["Thị trấn Plei Kần", "Xã Đăk Ang"],
        "Huyện Sa Thầy": ["Thị trấn Sa Thầy", "Xã Sa Bình"],
        "Thành phố Kon Tum": ["Phường Trường Chinh", "Phường Quyết Thắng"]
    },
    "Lai Châu": {
        "Huyện Mường Tè": ["Thị trấn Mường Tè", "Xã Mường Tè"],
        "Huyện Nậm Nhùn": ["Thị trấn Nậm Nhùn", "Xã Nậm Manh"],
        "Huyện Phong Thổ": ["Thị trấn Phong Thổ", "Xã Sì Lở Lầu"],
        "Huyện Sìn Hồ": ["Thị trấn Sìn Hồ", "Xã Sà Dề Phìn"],
        "Huyện Tam Đường": ["Thị trấn Tam Đường", "Xã Bản Giang"],
        "Huyện Than Uyên": ["Thị trấn Than Uyên", "Xã Pha Mu"],
        "Thành phố Lai Châu": ["Phường Tân Phong", "Phường Quyết Thắng"]
    },
    "Lâm Đồng": {
        "Huyện Bảo Lâm": ["Thị trấn Bảo Lộc", "Xã Lộc Thành"],
        "Huyện Bảo Lộc": ["Thị trấn Bảo Lộc", "Xã Lộc Sơn"],
        "Huyện Di Linh": ["Thị trấn Di Linh", "Xã Tân Nghĩa"],
        "Huyện Đạ Huoai": ["Thị trấn Đạ Huoai", "Xã Đạ M'ri"],
        "Huyện Đạ Tẻh": ["Thị trấn Đạ Tẻh", "Xã Đạ Kho"],
        "Huyện Đức Trọng": ["Thị trấn Liên Nghĩa", "Xã Ninh Gia"],
        "Huyện Lạc Dương": ["Thị trấn Lạc Dương", "Xã Đạ Sar"],
        "Huyện Lâm Hà": ["Thị trấn Nam Ban", "Xã Gia Bắc"],
        "Thành phố Đà Lạt": ["Phường 1", "Phường 2"]
    },
    "Lạng Sơn": {
        "Huyện Bình Gia": ["Thị trấn Bình Gia", "Xã Hữu Kiên"],
        "Huyện Cao Lộc": ["Thị trấn Cao Lộc", "Xã Tân Thành"],
        "Huyện Chi Lăng": ["Thị trấn Chi Lăng", "Xã Chiến Thắng"],
        "Huyện Đình Lập": ["Thị trấn Đình Lập", "Xã Bắc Xa"],
        "Huyện Hữu Lũng": ["Thị trấn Hữu Lũng", "Xã Hòa Bình"],
        "Huyện Lộc Bình": ["Thị trấn Lộc Bình", "Xã Tam Gia"],
        "Huyện Tràng Định": ["Thị trấn Tràng Định", "Xã Đội Cấn"],
        "Thành phố Lạng Sơn": ["Phường Chi Lăng", "Phường Hoàng Văn Thụ"]
    },
    "Lào Cai": {
        "Huyện Bát Xát": ["Thị trấn Bát Xát", "Xã Bản Vược"],
        "Huyện Bắc Hà": ["Thị trấn Bắc Hà", "Xã Bản Phố"],
        "Huyện Mường Khương": ["Thị trấn Mường Khương", "Xã Lùng Khấu Nhin"],
        "Huyện Sa Pa": ["Thị trấn Sa Pa", "Xã Tả Phìn"],
        "Huyện Văn Bàn": ["Thị trấn Văn Bàn", "Xã Khánh Yên Trung"],
        "Thành phố Lào Cai": ["Phường Bắc Lệnh", "Phường Kim Tân"]
    },
    "Long An": {
        "Huyện Bến Lức": ["Thị trấn Bến Lức", "Xã Bình Đức"],
        "Huyện Cần Đước": ["Thị trấn Cần Đước", "Xã Long Định"],
        "Huyện Cần Giuộc": ["Thị trấn Cần Giuộc", "Xã Tân Kim"],
        "Huyện Châu Thành": ["Thị trấn Châu Thành", "Xã Hòa Khánh Tây"],
        "Huyện Đức Hòa": ["Thị trấn Đức Hòa", "Xã Đức Hòa Đông"],
        "Huyện Đức Huệ": ["Thị trấn Đông Thành", "Xã Mỹ Thạnh Bắc"],
        "Huyện Mộc Hóa": ["Thị trấn Mộc Hóa", "Xã Bình Hiệp"],
        "Huyện Tân Hưng": ["Thị trấn Tân Hưng", "Xã Vĩnh Châu"],
        "Huyện Thạnh Hóa": ["Thị trấn Thạnh Hóa", "Xã Thạnh An"]
    },
    "Nam Định": {
        "Huyện Hải Hậu": ["Thị trấn Hải Hậu", "Xã Hải Bắc"],
        "Huyện Giao Thủy": ["Thị trấn Ngô Đồng", "Xã Giao Thiện"],
        "Huyện Nam Trực": ["Thị trấn Nam Giang", "Xã Nam Thắng"],
        "Huyện Nghĩa Hưng": ["Thị trấn Liễu Đề", "Xã Nghĩa Minh"],
        "Huyện Trực Ninh": ["Thị trấn Cổ Lễ", "Xã Trực Chính"],
        "Huyện Xuân Trường": ["Thị trấn Xuân Trường", "Xã Xuân Thượng"],
        "Thành phố Nam Định": ["Phường Bà Triệu", "Phường Cửa Bắc"]
    },
    "Nghệ An": {
        "Huyện Anh Sơn": ["Thị trấn Anh Sơn", "Xã Đỉnh Sơn"],
        "Huyện Con Cuông": ["Thị trấn Con Cuông", "Xã Bồng Khê"],
        "Huyện Diễn Châu": ["Thị trấn Diễn Châu", "Xã Diễn Thái"],
        "Huyện Đô Lương": ["Thị trấn Đô Lương", "Xã Đà Sơn"],
        "Huyện Hưng Nguyên": ["Thị trấn Hưng Nguyên", "Xã Hưng Tây"],
        "Huyện Nghi Lộc": ["Thị trấn Nghi Lộc", "Xã Nghi Kiều"],
        "Huyện Quế Phong": ["Thị trấn Kim Sơn", "Xã Mường Nọc"],
        "Huyện Tân Kỳ": ["Thị trấn Tân Kỳ", "Xã Nghĩa Hoàn"],
        "Huyện Thanh Chương": ["Thị trấn Thanh Chương", "Xã Thanh Thủy"],
        "Huyện Yên Thành": ["Thị trấn Yên Thành", "Xã Đồng Thành"],
        "Thành phố Vinh": ["Phường Cửa Nam", "Phường Quang Trung"]
    },
    "Ninh Bình": {
        "Huyện Gia Viễn": ["Thị trấn Gia Viễn", "Xã Gia Hưng"],
        "Huyện Hoa Lư": ["Thị trấn Hoa Lư", "Xã Ninh Mỹ"],
        "Huyện Kim Sơn": ["Thị trấn Bình Minh", "Xã Kim Đông"],
        "Huyện Nho Quan": ["Thị trấn Nho Quan", "Xã Thanh Lạc"],
        "Thành phố Ninh Bình": ["Phường Tân Thành", "Phường Đông Thành"]
    },
    "Ninh Thuận": {
        "Huyện Bác Ái": ["Thị trấn Phước Trung", "Xã Phước Bình"],
        "Huyện Ninh Hải": ["Thị trấn Khánh Hải", "Xã Nhơn Hải"],
        "Huyện Ninh Phước": ["Thị trấn Phước Dân", "Xã Phước Hậu"],
        "Huyện Thuận Bắc": ["Thị trấn Khánh Hải", "Xã Bắc Sơn"],
        "Huyện Thuận Nam": ["Thị trấn Thiện Hải", "Xã Phước Nam"],
        "Thành phố Phan Rang-Tháp Chàm": ["Phường Đô Vinh", "Phường Mỹ Hương"]
    },
    "Phú Thọ": {
        "Huyện Cẩm Khê": ["Thị trấn Cẩm Khê", "Xã Tiên Lương"],
        "Huyện Đoan Hùng": ["Thị trấn Đoan Hùng", "Xã Minh Tiến"],
        "Huyện Hạ Hòa": ["Thị trấn Hạ Hòa", "Xã Bằng Luân"],
        "Huyện Lâm Thao": ["Thị trấn Lâm Thao", "Xã Sơn Vi"],
        "Huyện Phù Ninh": ["Thị trấn Phù Ninh", "Xã Phú Mỹ"],
        "Huyện Tam Nông": ["Thị trấn Tam Nông", "Xã Hương Nộn"],
        "Huyện Thanh Ba": ["Thị trấn Thanh Ba", "Xã Thanh Xá"],
        "Huyện Tân Sơn": ["Thị trấn Tân Sơn", "Xã Xuân Đài"],
        "Thành phố Việt Trì": ["Phường Gia Cẩm", "Phường Minh Phương"]
    },
    "Phú Yên": {
        "Huyện Đông Hòa": ["Thị trấn Hòa Vinh", "Xã Hòa Xuân Tây"],
        "Huyện Đầm Hà": ["Thị trấn Đầm Hà", "Xã Quảng An"],
        "Huyện Phú Hòa": ["Thị trấn Phú Hòa", "Xã Hòa Trị"],
        "Huyện Sông Hinh": ["Thị trấn Hai Riêng", "Xã Sơn Giang"],
        "Huyện Tây Hòa": ["Thị trấn Phú Thứ", "Xã Hòa Bình 1"],
        "Thành phố Tuy Hòa": ["Phường 1", "Phường 2"]
    },
    "Quảng Bình": {
        "Huyện Bố Trạch": ["Thị trấn Hoàn Lão", "Xã Bắc Trạch"],
        "Huyện Minh Hóa": ["Thị trấn Quy Đạt", "Xã Hóa Sơn"],
        "Huyện Quảng Ninh": ["Thị trấn Quán Hàu", "Xã Vạn Ninh"],
        "Huyện Tuyên Hóa": ["Thị trấn Đồng Lê", "Xã Đức Hóa"],
        "Thành phố Đồng Hới": ["Phường Hải Thành", "Phường Nam Lý"]
    },
    "Quảng Nam": {
        "Huyện Đại Lộc": ["Thị trấn Ái Nghĩa", "Xã Đại Nghĩa"],
        "Huyện Duy Xuyên": ["Thị trấn Nam Phước", "Xã Duy Hải"],
        "Huyện Hiệp Đức": ["Thị trấn Hiệp Đức", "Xã Sông Trà"],
        "Huyện Nông Sơn": ["Thị trấn Nông Sơn", "Xã Quế Lộc"],
        "Huyện Núi Thành": ["Thị trấn Núi Thành", "Xã Tam Anh Bắc"],
        "Huyện Phú Ninh": ["Thị trấn Phú Thịnh", "Xã Tam Đàn"],
        "Huyện Thăng Bình": ["Thị trấn Thăng Bình", "Xã Bình Đào"],
        "Thành phố Hội An": ["Phường Cẩm Châu", "Phường Minh An"],
        "Thành phố Tam Kỳ": ["Phường An Mỹ", "Phường An Sơn"]
    },
    "Quảng Ngãi": {
        "Huyện Ba Tơ": ["Thị trấn Ba Tơ", "Xã Ba Điền"],
        "Huyện Bình Sơn": ["Thị trấn Châu Ổ", "Xã Bình Thạnh"],
        "Huyện Đức Phổ": ["Thị trấn Đức Phổ", "Xã Phổ Thạnh"],
        "Huyện Lý Sơn": ["Thị trấn Lý Sơn", "Xã An Hải"],
        "Huyện Sơn Tịnh": ["Thị trấn Sơn Tịnh", "Xã Tịnh Ấn Tây"],
        "Huyện Trà Bồng": ["Thị trấn Trà Xuân", "Xã Trà Thủy"],
        "Huyện Tư Nghĩa": ["Thị trấn La Hà", "Xã Nghĩa Kỳ"],
        "Thành phố Quảng Ngãi": ["Phường Trần Hưng Đạo", "Phường Nghĩa Chánh"]
    },
    "Quảng Trị": {
        "Huyện Cam Lộ": ["Thị trấn Cam Lộ", "Xã Cam Tuyền"],
        "Huyện Gio Linh": ["Thị trấn Gio Linh", "Xã Gio Mỹ"],
        "Huyện Hải Lăng": ["Thị trấn Hải Lăng", "Xã Hải Thọ"],
        "Huyện Hướng Hóa": ["Thị trấn Khe Sanh", "Xã Hướng Linh"],
        "Huyện Triệu Phong": ["Thị trấn Triệu Phong", "Xã Triệu Độ"],
        "Thành phố Đông Hà": ["Phường 1", "Phường 2"]
    },
    "Sóc Trăng": {
        "Huyện Châu Thành": ["Thị trấn Châu Thành", "Xã An Hiệp"],
        "Huyện Cù Lao Dung": ["Thị trấn Cù Lao Dung", "Xã An Thạnh 1"],
        "Huyện Kế Sách": ["Thị trấn Kế Sách", "Xã Kế An"],
        "Huyện Long Phú": ["Thị trấn Long Phú", "Xã Long Đức"],
        "Huyện Mỹ Tú": ["Thị trấn Mỹ Tú", "Xã Mỹ Hương"],
        "Huyện Thạnh Trị": ["Thị trấn Thạnh Trị", "Xã Thạnh Tân"],
        "Huyện Trần Đề": ["Thị trấn Trần Đề", "Xã Trung Bình"],
        "Thành phố Sóc Trăng": ["Phường 1", "Phường 2"]
    },
    "Sơn La": {
        "Huyện Bắc Yên": ["Thị trấn Bắc Yên", "Xã Háng Đồng"],
        "Huyện Mai Sơn": ["Thị trấn Hát Lót", "Xã Chiềng Chăn"],
        "Huyện Mộc Châu": ["Thị trấn Mộc Châu", "Xã Mường Sang"],
        "Huyện Phù Yên": ["Thị trấn Phù Yên", "Xã Tân Lang"],
        "Huyện Quỳnh Nhai": ["Thị trấn Quỳnh Nhai", "Xã Mường Giôn"],
        "Huyện Sông Mã": ["Thị trấn Sông Mã", "Xã Chiềng Khương"],
        "Huyện Sốp Cộp": ["Thị trấn Sốp Cộp", "Xã Mường Lạn"],
        "Thành phố Sơn La": ["Phường Chiềng An", "Phường Chiềng Cơi"]
    },
    "Tây Ninh": {
        "Huyện Bến Cầu": ["Thị trấn Bến Cầu", "Xã Long Chữ"],
        "Huyện Dương Minh Châu": ["Thị trấn Dương Minh Châu", "Xã Bàu Năng"],
        "Huyện Gò Dầu": ["Thị trấn Gò Dầu", "Xã Phước Thạnh"],
        "Huyện Tân Biên": ["Thị trấn Tân Biên", "Xã Tân Lập"],
        "Huyện Tân Châu": ["Thị trấn Tân Châu", "Xã Tân Hà"],
        "Thành phố Tây Ninh": ["Phường 1", "Phường 2"]
    },
    "Thái Bình": {
        "Huyện Đông Hưng": ["Thị trấn Đông Hưng", "Xã Đông La"],
        "Huyện Hưng Hà": ["Thị trấn Hưng Hà", "Xã Thái Phúc"],
        "Huyện Kiến Xương": ["Thị trấn Kiến Xương", "Xã Bình Định"],
        "Huyện Quỳnh Phụ": ["Thị trấn Quỳnh Côi", "Xã An Khê"],
        "Huyện Thái Thụy": ["Thị trấn Thái Thụy", "Xã Thái Sơn"],
        "Huyện Tiền Hải": ["Thị trấn Tiền Hải", "Xã Tây Giang"],
        "Thành phố Thái Bình": ["Phường Trần Lãm", "Phường Trần Hưng Đạo"]
    },
    "Thái Nguyên": {
        "Huyện Định Hóa": ["Thị trấn Chợ Chu", "Xã Phú Đình"],
        "Huyện Đồng Hỷ": ["Thị trấn Trại Cau", "Xã Hòa Bình"],
        "Huyện Phú Bình": ["Thị trấn Phú Bình", "Xã Tân Khánh"],
        "Huyện Phú Lương": ["Thị trấn Phú Lương", "Xã Yên Đổ"],
        "Huyện Võ Nhai": ["Thị trấn Đình Cả", "Xã La Hiên"],
        "Thành phố Thái Nguyên": ["Phường Hoàng Văn Thụ", "Phường Tân Thịnh"]
    },
    "Thanh Hóa": {
        "Huyện Bá Thước": ["Thị trấn Cành Nàng", "Xã Điền Lư"],
        "Huyện Cẩm Thủy": ["Thị trấn Cẩm Thủy", "Xã Cẩm Bình"],
        "Huyện Đông Sơn": ["Thị trấn Rừng Thông", "Xã Đông Khê"],
        "Huyện Hà Trung": ["Thị trấn Hà Trung", "Xã Hà Bắc"],
        "Huyện Hậu Lộc": ["Thị trấn Hậu Lộc", "Xã Hải Lộc"],
        "Huyện Hoằng Hóa": ["Thị trấn Bút Sơn", "Xã Hoằng Đạo"],
        "Huyện Lang Chánh": ["Thị trấn Lang Chánh", "Xã Trí Nang"],
        "Huyện Ngọc Lặc": ["Thị trấn Ngọc Lặc", "Xã Ngọc Liên"],
        "Huyện Như Thanh": ["Thị trấn Như Thanh", "Xã Thanh Tân"],
        "Huyện Như Xuân": ["Thị trấn Như Xuân", "Xã Xuân Hòa"],
        "Huyện Quảng Xương": ["Thị trấn Quảng Xương", "Xã Quảng Phú"],
        "Huyện Tĩnh Gia": ["Thị trấn Tĩnh Gia", "Xã Hải An"],
        "Huyện Triệu Sơn": ["Thị trấn Triệu Sơn", "Xã Đồng Lợi"],
        "Huyện Vĩnh Lộc": ["Thị trấn Vĩnh Lộc", "Xã Vĩnh Long"],
        "Thành phố Thanh Hóa": ["Phường Lam Sơn", "Phường Điện Biên"]
    },
    "Thành phố Huế": {
        "Thành phố Huế": ["Phường Phú Hậu", "Phường Phú Hội"],
        "Huyện A Lưới": ["Thị trấn A Lưới", "Xã Hồng Kim"],
        "Huyện Bạch Mã": ["Thị trấn Bạch Mã", "Xã Lộc Bình"],
        "Huyện Phú Lộc": ["Thị trấn Lăng Cô", "Xã Vinh Hiền"],
        "Huyện Phú Vang": ["Thị trấn Phú Đa", "Xã Phú Diên"],
        "Huyện Quảng Điền": ["Thị trấn Sịa", "Xã Quảng Thái"],
        "Huyện Nam Đông": ["Thị trấn Khe Tre", "Xã Hương Phú"],
        "Huyện Hương Thủy": ["Thị trấn Phú Bài", "Xã Thủy Phù"],
        "Huyện Hương Trà": ["Thị trấn Hương Trà", "Xã Hương Vân"]
    },
    "Tiền Giang": {
        "Huyện Châu Thành": ["Thị trấn Châu Thành", "Xã Tam Hiệp"],
        "Huyện Cái Bè": ["Thị trấn Cái Bè", "Xã Hậu Mỹ Bắc"],
        "Huyện Cai Lậy": ["Thị trấn Cai Lậy", "Xã Tân Bình"],
        "Huyện Gò Công Đông": ["Thị trấn Vĩnh Bình", "Xã Tân Điền"],
        "Huyện Gò Công Tây": ["Thị trấn Gò Công", "Xã Bình Nhì"],
        "Huyện Tân Phước": ["Thị trấn Tân Hiệp", "Xã Phước Lập"],
        "Thành phố Mỹ Tho": ["Phường 1", "Phường 2"]
    },
    "Trà Vinh": {
        "Huyện Càng Long": ["Thị trấn Càng Long", "Xã An Trường"],
        "Huyện Cầu Kè": ["Thị trấn Cầu Kè", "Xã Hòa Ân"],
        "Huyện Cầu Ngang": ["Thị trấn Cầu Ngang", "Xã Nhị Trường"],
        "Huyện Duyên Hải": ["Thị trấn Duyên Hải", "Xã Long Toàn"],
        "Huyện Tiểu Cần": ["Thị trấn Tiểu Cần", "Xã Tân Hòa"],
        "Thành phố Trà Vinh": ["Phường 1", "Phường 2"]
    },
    "Tuyên Quang": {
        "Huyện Chiêm Hóa": ["Thị trấn Chiêm Hóa", "Xã Hòa An"],
        "Huyện Hàm Yên": ["Thị trấn Tân Yên", "Xã Minh Khương"],
        "Huyện Lâm Bình": ["Thị trấn Lâm Bình", "Xã Thượng Lâm"],
        "Huyện Na Hang": ["Thị trấn Na Hang", "Xã Đà Vị"],
        "Huyện Sơn Dương": ["Thị trấn Sơn Dương", "Xã Tân Thanh"],
        "Thành phố Tuyên Quang": ["Phường Tân Quang", "Phường Minh Xuân"]
    },
    "Vĩnh Long": {
        "Huyện Bình Minh": ["Thị trấn Bình Minh", "Xã Đông Bình"],
        "Huyện Long Hồ": ["Thị trấn Long Hồ", "Xã Phú Đức"],
        "Huyện Mang Thít": ["Thị trấn Mang Thít", "Xã Tân An Hội"],
        "Huyện Tam Bình": ["Thị trấn Tam Bình", "Xã Tân Ngãi"],
        "Huyện Vũng Liêm": ["Thị trấn Vũng Liêm", "Xã Trung Chánh"],
        "Thành phố Vĩnh Long": ["Phường 1", "Phường 2"]
    },
    "Vĩnh Phúc": {
        "Huyện Bình Xuyên": ["Thị trấn Bình Xuyên", "Xã Thiện Kế"],
        "Huyện Lập Thạch": ["Thị trấn Lập Thạch", "Xã Đạo Tú"],
        "Huyện Tam Đảo": ["Thị trấn Tam Đảo", "Xã Đại Đình"],
        "Huyện Vĩnh Tường": ["Thị trấn Vĩnh Tường", "Xã Vĩnh Sơn"],
        "Huyện Yên Lạc": ["Thị trấn Yên Lạc", "Xã Yên Đồng"],
        "Thành phố Vĩnh Yên": ["Phường Liên Bảo", "Phường Khai Quang"],
        "Thành phố Phúc Yên": ["Phường Trưng Trắc", "Phường Trưng Nhị"],
        "Huyện Sông Lô": ["Thị trấn Tam Sơn", "Xã Đôn Nhân"]
    },
    "Yên Bái": {
        "Huyện Lục Yên": ["Thị trấn Lục Yên", "Xã Tân Lĩnh"],
        "Huyện Mù Cang Chải": ["Thị trấn Mù Cang Chải", "Xã Kim Nọi"],
        "Huyện Văn Chấn": ["Thị trấn Văn Chấn", "Xã Nghĩa Tâm"],
        "Huyện Trấn Yên": ["Thị trấn Cổ Phúc", "Xã Việt Hồng"],
        "Huyện Yên Bình": ["Thị trấn Yên Bình", "Xã Hán Đà"],
        "Thành phố Yên Bái": ["Phường Đồng Tâm", "Phường Minh Tân"]
    }
  };
  
  export default addressData;
  