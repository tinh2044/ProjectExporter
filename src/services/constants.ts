import dayjs from "dayjs";

/**
 * Default form information for project forms
 */
export const getDefaultFormInformation = () => ({
  tenDuAn:
    "Hệ thống theo dõi, đánh giá học sinh và Học bạ số ngành Giáo dục và Đào tạo Thành phố",
  tongHopDuToan: 6810000000,
  chuDauTu: "Sở Giáo dục và Đào tạo",
  nguoiNhan: "Giám đốc Sở Giáo dục và Đào tạo",
  diaDiem: "Thành phố Hồ Chí Minh",
  thoiGian: [dayjs(), dayjs()],
  mucTieu: `
    Từng bước thay thế chữ ký bằng tay đối với các loại sổ sách, tài liệu (sổ học bạ, , …). Cung cấp cho giáo viên và cán bộ quản lý các trường THPT công cụ ký số để thực hiện việc ký số và quản lý hồ sơ đã được ký số.
    Nâng cao hiệu quả làm việc cho đội ngũ giáo viên, giúp giảm thời gian và tiết kiệm chi phí.
    Chuẩn hóa Cơ sở dữ liệu hiện có, xây dựng mô hình liên thông dữ liệu từ Cơ sở dữ liệu ngành, từ đó điểm số có thể được liên thông qua "Hệ thống quản lý Học bạ điện tử, sổ điểm điện tử", không cần gõ tay, giúp tiết kiệm công sức, tăng độ chính xác, giảm sai sót.
    Sử dụng mô hình chuỗi khối, mỗi đơn vị dữ liệu được lưu trong 1 khối riêng biệt, các khối được nối với nhau bằng các khóa được mã hóa bất đối xứng đảm bảo tính liên tục, toàn vẹn. Tất cả các học bạ được nối chung với nhau trên một chuỗi khối duy nhất, từ đó đảm bảo mỗi 1 em học sinh có thể có 1 quyển học bạ duy nhất
    Thay thế các phương thức xác thực công khai truyền thống của những giải pháp công nghệ chuỗi khối phổ biến hiện nay bằng cách sử dụng giải pháp xác thực từ các cơ quan nhà nước như đơn vị quản lý chuỗi khối: ở đây có thể là Bộ hoặc Sở GDĐT kết hợp với chứng thư số của ban cơ yếu chính phủ hoặc các đơn vị được cấp phép cung cấp chứng thư số. Với việc được cơ quan nhà nước có thẩm quyền xác thực, tính toàn vẹn và tính pháp lý của dữ liệu được đảm bảo.
    Việc sử dụng mô hình dữ liệu phi quan hệ và có cấu trúc linh hoạt đáp ứng tính mở trong lựa chọn tổ hợp môn của từng học sinh phù hợp với yêu cầu của Chương trình Giáo dục phổ thông 2018.
    Dữ liệu dạng cấu trúc được ký có thể đọc được các bằng phần mềm để liên thông khi học sinh chuyển trường, chuyển tỉnh hoặc đi du học. Cơ chế xác thực tính toàn vẹn dữ liệu bằng các hàm API công khai giúp các giải pháp quản lý trường học dễ dàng tích hợp học bạ số cũng như đảm bảo dữ liệu kết quả học tập của học sinh được đảm bảo tính pháp lý khi tiếp nhận học sinh mới thông qua hệ thống.
  `,
  quyMo: `
      - Hệ thống quản lý Học bạ điện tử, sổ điểm điện tử;
    - Hoàn thiện, chuẩn hóa dữ liệu đầu ra là CSDL hiện có của Sở;
    - Thực hiện đào tạo hướng dẫn sử dụng cho người sử dụng.
`,
  suCanThiet: `
    Ngày 18/01/2019 Bộ Giáo dục và Đào tạo ban hành Chỉ thị số 138/CT-BGDĐT về việc chấn chỉnh tình trạng lạm dụng hồ sơ, sổ sách trong nhà trường. Trong đó có đề cập "từng bước sử dụng hồ sơ, sổ sách điện tử thay cho các loại hồ sơ, sổ sách hiện hành theo lộ trình phù hợp với điều kiện của địa phương, nhà trường và khả năng thực hiện của giáo viên";
    Ngày 15/09/2020 Bộ Giáo dục và Đào tạo ban hành Thông tư số 32/2020/TT-BGDĐT về điều lệ trường trung học cơ sở, trường trung học phổ thông và trường phổ thông có nhiều cấp học do bộ giáo dục và đào tạo ban hành. Tại Điều 21 thông tư này có yêu cầu Hệ thống hồ sơ quản lý hoạt động giáo dục là "dạng hồ sơ điện tử được sử dụng thay cho các loại hồ sơ giấy theo lộ trình phù hợp với điều kiện của địa phương, nhà trường, khả năng thực hiện của giáo viên và bảo đảm tính hợp pháp của các loại hồ sơ điện tử";
    Việc lưu trữ các hồ sơ giấy gây thất thoát lớn về kinh phí, đồng thời đặt áp lực lớn lên các trường trên địa bàn Thành phố trong việc quản lý, lưu trữ, truy xuất;
    Các hồ sơ điện tử (sổ điểm, sổ học bạ, …) phải in ra để ký đóng dấu, sau đó lại số hóa lên môi trường điện tử phải tốn nhiều thời gian và công sức;
    Các văn bản cần xác thực phải gửi về cơ sở đào tạo gây mất thời gian, chi phí, tạo điều kiện cho vấn nạn làm giả hồ sơ được phổ biến;
    Hiện nay, giáo viên phải thực hiện ký bằng tay nhiều hồ sơ sổ sách. Việc in ấn, lưu giữ,...sau đó số hóa lên lại hệ thống gây mất nhiều thời gian, công sức, chi phí. Việc số hóa đôi lúc không kịp thời gây khó khăn trong việc tra cứu, sử dụng các hồ sơ. Ngoài ra, thực trạng làm giả các hồ sơ như bảng điểm, học bạ, bằng cấp cũng là một vấn đề nhức nhối trong xã hội; việc xác thực đòi hỏi đơn vị phải gửi hồ sơ kèm phiếu yêu cầu về cơ sở đào tạo, sau đó cơ sở đào tạo sẽ tra cứu văn bản giấy hoặc trên máy tính, sau đó viết công văn trả lời yêu cầu xác minh.
    Giải pháp quản lý Học bạ số, không phải là một khái niệm mới, thực tế giải pháp này đã được triển khai tại một số Tỉnh, Thành phố và các đơn vị giáo dục. Các nhà cung cấp giải pháp công nghệ thông tin về mảng giáo dục cũng đề xuất các giải pháp khác nhau. Điểm chung của các giải pháp này là đều sử dụng file .pdf để hiển thị chi tiết học bạ, cho phép tích hợp chữ ký số hoặc in ra trình ký giáo viên, hiệu trưởng.
    Về căn bản, các giải pháp này phần nào giải quyết được các khó khăn về lưu trữ, quản lý hồ sơ, tuy nhiên, có một số vấn đề vẫn chưa có hướng giải quyết:
    -	Việc nhập học bạ vào file vẫn còn thực hiện thủ công và giáo viên bắt buộc phải ký tên theo các mẫu chuẩn;
    -	Các dữ liệu không thể tái sử dụng, không sử dụng được cho hệ thống liên thông;
    -	Không đảm bảo được mỗi học sinh chỉ có một quyển học bạ duy nhất;
    -	Bảng điểm các năm bị tách rời thành các tập tin rời rạc;
    -	Việc cải chính hộ tịch gặp khó khăn trong việc cập nhật thông tin vào học bạ;
    -	Không đáp ứng được chương trình giáo dục từ năm 2018 về việc cho phép mỗi học sinh được lựa chọn các môn học khác nhau, khiến việc quản lý học bạ của từng lớp còn lỏng lẻo.
    Từ những yêu cầu trên, nhằm đảm bảo tính an toàn, bảo mật, bảo đảm tính hợp pháp của các loại hồ sơ điện tử, việc cung cấp một giải pháp quản lý hiệu quả và trang bị chữ ký số cho Ban Giám hiệu, giáo viên các trường trên địa bàn thành phố để ký sổ điểm, học bạ số là hết sức cần thiết.
  `,
  nguonKinhPhi: "Kinh phí chi sự nghiệp năm 2025",
  ghiChuDuToan: `
    -	Chi phí lập báo cáo kinh tế - kỹ thuật: 243.377.018 đồng.
    -	Chi phí thẩm tra báo cáo kinh tế - kỹ thuật: 11.794.425 đồng.
    (Chi tiết dự toán theo Phụ lục đính kèm)
  `,
  congViecDaThucHien: "Không có.",
  congViecKhongApDung: "Không có.",
  congViecKeHoach: `
      1.	Bảng tổng hợp phần công việc thuộc kế hoạch lựa chọn nhà thầu
    Xem Phụ lục I đính kèm.
    2.	Giải trình nội dung kế hoạch lựa chọn nhà thầu:
    Xem Phụ lục II đính kèm.
    `,
  selectedItems: ["lapBCKTKT", "thamTraBCKTKT"],
  itemAmounts: [243377018, 11794425],
});

/**
 * Investor information with addresses
 */
export const getInvestorData = () => ({
  "Sở An toàn thực phẩm":
    "18 Cách Mạng Tháng Tám, phường Bến Thành, Tp Hồ Chí Minh",
  "Sở Công Thương": "163 Hai Bà Trưng, Phường Xuân Hòa, Tp Hồ Chí Minh",
  "Sở Du lịch": "201 Võ Thị Sáu, Phường Xuân Hòa, Tp Hồ Chí Minh",
  "Sở Dân tộc và Tôn giáo":
    "177 Lý Chính Thắng, Phường Xuân Hòa, Tp Hồ Chí Minh",
  "Sở Giáo dục và Đào tạo":
    "66 - 68 Lê Thánh Tôn, Phường Sài Gòn, Tp Hồ Chí Minh",
  "Sở Khoa học và Công nghệ":
    "244 Điện Biên Phủ, phường Xuân Hòa, Tp Hồ Chí Minh",
  "Sở Nội vụ": "86B Lê Thánh Tôn, phường Sài Gòn, Tp Hồ Chí Minh",
  "Sở Tài chính": [
    {
      linhVuc: "Trụ sở 1",
      diaChi: "32 Lê Thánh Tôn, phường Sài Gòn, Tp Hồ Chí Minh",
    },
    {
      linhVuc: "Trụ sở 2",
      diaChi: "90G, Trần Quốc Toản, phường Xuân Hòa, Tp Hồ Chí Minh",
    },
  ],
  "Sở Tư pháp": "141-143 Pasteur, phường Xuân Hòa, Tp Hồ Chí Minh",
  "Sở Văn hóa và Thể thao": "164 Đồng Khởi, phường Sài Gòn, Tp Hồ Chí Minh",
  "Sở Xây dựng": [
    {
      linhVuc: "Cơ sở 1",
      diaChi: "60 Trương Định, phường Xuân Hòa, Tp Hồ Chí Minh",
    },
    {
      linhVuc: "Cơ sở 2",
      diaChi: "63 Lý Tự Trọng, phường Sài Gòn, Tp Hồ Chí Minh",
    },
  ],
  "Sở Y tế": "59 Nguyễn Thị Minh Khai, phường Bến Thành, Tp Hồ Chí Minh",
  "Ban Quản lý các Khu chế xuất và công nghiệp Thành phố":
    "35 Nguyễn Bỉnh Khiêm, phường Tân Định, Tp Hồ Chí Minh",
  "Ban Quản lý Khu công nghệ cao Thành phố":
    "Lô T2-3, đường D1, phường Tăng Nhơn Phú, Tp Hồ Chí Minh",
  "Thanh tra Thành phố": "13 Trần Quốc Thảo, phường Xuân Hòa, Tp Hồ Chí Minh",
  "Trung tâm Phục vụ Hành chính côngThành phố (cơ sở Bình Dương)":
    "Tòa nhà Trung tâm hành chính tỉnh, đường Lê Lợi,phường Bình Dương",
  "Trung tâm Phục vụ Hành chính côngThành phố (cơ sở Bà Rịa – Vũng Tàu)":
    "Số 4 Nguyễn Tất Thành, phường Bà Rịa",
  "Sở Nông nghiệp và Môi trường": [
    {
      linhVuc:
        "Khí tượng thủy văn; Tài nguyên nước; Địa chất và Khoáng sản; Biển và Hải đảo; Môi trường; Đo đạc bản đồ; Đất đai",
      diaChi: "63 Lý Tự Trọng, phường Sài Gòn, Tp Hồ Chí Minh",
    },
    {
      linhVuc:
        "Nông nghiệp; Khoa học, công nghệ và môi trường; Doanh nghiệp; Quản lý chất lượng nông lâm sản và thủy sản; Kinh tế hợp tác và phát triển nông thôn; Thủy lợi; Phòng chống thiên tai",
      diaChi: "176 Hai Bà Trưng, phường Tân Định, Tp Hồ Chí Minh",
    },
    {
      linhVuc: "Thủy sản",
      diaChi: "126GH Phan Đăng Lưu, phường Đức Nhuận, Tp Hồ Chí Minh",
    },
    {
      linhVuc: "Bảo vệ thực vật; Trồng trọt; Giáo thông vận tải",
      diaChi: "10 Nguyễn Huy Tưởng, phường Gia Định, Tp Hồ Chí Minh",
    },
    {
      linhVuc: "Thú y; Chăn nuôi",
      diaChi: "151 Lý Thường Kiệt, phường Minh Phụng, Tp Hồ Chí Minh",
    },
    {
      linhVuc: "Lâm nghiệp; Kiểm lâm",
      diaChi: "Số 1 Đỗ Ngọc Thạnh, phường Chợ Lớn, Tp Hồ Chí Minh",
    },
  ],
});

/**
 * Base required keys for all forms
 */
export const getBaseRequiredKeys = () => [
  "tenDuAn",
  "tongHopDuToan",
  "chuDauTu",
  "diaDiem",
  "nguoiNhan",
  "thoiGian",
];

/**
 * Get sorted investor keys for AutoComplete
 */
export const getSortedInvestorKeys = () => {
  return Object.keys(getInvestorData()).sort((a, b) =>
    a.localeCompare(b, "vi")
  );
};

/**
 * Get addresses for a specific investor
 */
export const getInvestorAddresses = (investorName: string) => {
  const investorData = getInvestorData();
  const invVal = investorData[
    investorName as keyof typeof investorData
  ] as unknown;

  if (Array.isArray(invVal)) {
    return (invVal as Array<{ diaChi?: string }>)
      .map((i) => i.diaChi || "")
      .filter(Boolean) as string[];
  } else if (typeof invVal === "string") {
    return [invVal];
  }
  return [];
};

export const getDistrictAdminCenter = () => {
  return {
    "Phường Tân Định": "58B Nguyễn Đình Chiểu, phường Tân Định, Tp Hồ Chí Minh",
    "Phường Sài Gòn": "45 - 47 Lê Duẩn, phường Sài Gòn, Tp Hồ Chí Minh",
    "Phường Bến Thành": "92 Nguyễn Trãi, phường Bến Thành, Tp Hồ Chí Minh",
    "Phường Cầu Ông Lãnh":
      "105 Trần Đình Xu, phường Cầu Ông Lãnh, Tp Hồ Chí Minh",
    "Phường Bàn Cờ":
      "611/20 Điện Biên Phủ (số cũ 611C), phường Bàn Cờ, Tp Hồ Chí Minh",
    "Phường Xuân Hòa":
      "99 Trần Quốc Thảo (số cũ 101), phường Xuân Hòa, Tp Hồ Chí Minh",
    "Phường Nhiêu Lộc":
      "82 Bà Huyện Thanh Quan, phường Nhiêu Lộc, Tp Hồ Chí Minh",
    "Phường Vĩnh Hội": "130 đường 46, phường Vĩnh Hội, Tp Hồ Chí Minh",
    "Phường Khánh Hội": "531 Vĩnh Khánh, phường Khánh Hội, Tp Hồ Chí Minh",
    "Phường Xóm Chiếu": "18 Đoàn Như Hài, phường Xóm Chiếu, Tp Hồ Chí Minh",
    "Phường Chợ Quán": "53 A Trần Phú, phường Chợ Quán, Tp Hồ Chí Minh",
    "Phường An Đông": "45 Phước Hưng, phường An Đông, Tp Hồ Chí Minh",
    "Phường Chợ Lớn": "527 Hồng Bàng, phường Chợ Lớn, Tp Hồ Chí Minh",
    "Phường Bình Tiên": "107 Cao Văn Lầu, phường Bình Tiên, Tp Hồ Chí Minh",
    "Phường Bình Tây": "154 Tháp Mười, phường Bình Tây, Tp Hồ Chí Minh",
    "Phường Bình Phú": "15 Chợ Lớn, phường Bình Phú, Tp Hồ Chí Minh",
    "Phường Phú Lâm": "152 Đặng Nguyên Cẩn, phường Phú Lâm, Tp Hồ Chí Minh",
    "Phường Tân Hưng": "Số 9 đường 2A phường Tân Hưng, Tp Hồ Chí Minh",
    "Phường Tân Thuận":
      "Số 342 Huỳnh Tấn Phát, phường Tân Thuận, Tp Hồ Chí Minh",
    "Phường Phú Thuận":
      "Số 1203 Huỳnh Tấn Phát, phường Phú Thuận, Tp Hồ Chí Minh",
    "Phường Tân Mỹ": "Số 7 đường Tân Phú, Phường Tân Mỹ, Tp Hồ Chí Minh",
    "Phường Chánh Hưng": [
      {
        linhVuc: "Trụ sở chính",
        diaChi: "39 Dương Bạch Mai, phường Chánh Hưng, Tp Hồ Chí Minh",
      },
      {
        linhVuc: "Điểm tiếp nhận thứ nhất",
        diaChi: "210-212 Âu Dương Lân, phường Chánh Hưng, Tp Hồ Chí Minh",
      },
      {
        linhVuc: "Điểm tiếp nhận thứ hai",
        diaChi: "625-625A Hưng Phú, phường Chánh Hưng, Tp Hồ Chí Minh",
      },
    ],
    "Phường Bình Đông": "1094 Tạ Quang Bửu, phường Bình Đông, Tp Hồ Chí Minh",
    "Phường Phú Định": [
      {
        linhVuc: "Trụ sở chính",
        diaChi: "184 Lưu Hữu Phước, phường Phú Định, Tp Hồ Chí Minh",
      },
      {
        linhVuc: "Điểm tiếp nhận thứ nhất",
        diaChi: "942 Nguyễn Duy, phường Phú Định, Tp Hồ Chí Minh",
      },
      {
        linhVuc: "Điểm tiếp nhận thứ hai",
        diaChi: "450 Phú Định, phường Phú Định, Tp Hồ Chí Minh",
      },
    ],
    "Phường Diên Hồng": "1a Thành Thái, phường Diên Hồng, Tp Hồ Chí Minh",
    "Phường Hòa Hưng": "A8 Châu Thới, phường Hòa Hưng, Tp Hồ Chí Minh",
    "Phường Vườn Lài": "168 Hùng Vương, phường Vườn Lài, Tp Hồ Chí Minh",
    "Phường Minh Phụng": "183 A Lý Nam Đế, phường Minh Phụng, Tp Hồ Chí Minh",
    "Phường Bình Thới": "270 Bình Thới, phường Bình Thới, Tp Hồ Chí Minh",
    "Phường Hòa Bình": "347 Lạc Long Quân, phường Hòa Bình, Tp Hồ Chí Minh",
    "Phường Phú Thọ": "233 - 235 Lê Đại Hành, phường Phú Thọ, Tp Hồ Chí Minh",
    "Phường Đông Hưng Thuận":
      "Số 68, đường TTN14, phường Đông Hưng Thuận, Tp Hồ Chí Minh",
    "Phường Trung Mỹ Tây": "Số 036, phường Trung Mỹ Tây, Tp Hồ Chí Minh",
    "Phường Tân Thới Hiệp":
      "Số 226 Trương Thị Hoa, phường Tân Thới Hiệp, Tp Hồ Chí Minh",
    "Phường Thới An": "Số 340 Lê Văn Khương, phường Thới An, Tp Hồ Chí Minh",
    "Phường An Phú Đông":
      "Số 540 Hà Huy Giáp, phường An Phú Đông, Tp Hồ Chí Minh",
    "Phường Bình Tân": "43 đường số 16, phường Bình Tân, Tp Hồ Chí Minh",
    "Phường Bình Hưng Hòa":
      "621 Tân Kỳ Tân Quý, phường Bình Hưng Hòa, Tp Hồ Chí Minh",
    "Phường Bình Trị Đông": "162 Mã Lò, phường Bình Trị Đông, Tp Hồ Chí Minh",
    "Phường An Lạc": "521 Kinh Dương Vương, phường An Lạc, Tp Hồ Chí Minh",
    "Phường Tân Tạo": "1409 Tỉnh lộ 10, phường Tân Tạo, Tp Hồ Chí Minh",
    "Phường Thạnh Mỹ Tây":
      "85/16 Phạm Viết Chánh, phường Thạnh Mỹ Tây, Tp Hồ Chí Minh",
    "Phường Bình Lợi Trung":
      "133 Nguyễn Văn Đậu, phường Bình Lợi Trung, Tp Hồ Chí Minh",
    "Phường Bình Thạnh":
      "số 6 Phan Đăng Lưu, phường Bình Thạnh, Tp Hồ Chí Minh",
    "Phường Gia Định": "98 Lê Lê Văn Duyệt, phường Gia Định, Tp Hồ Chí Minh",
    "Phường Bình Quới":
      "Số 1 khu hành chính Thanh Đa, phường Bình Quới, Tp Hồ Chí Minh",
    "Phường Hạnh Thông":
      "306 (số cũ 304) Nguyễn Văn Nghi, phường Hạnh Thông, Tp Hồ Chí Minh",
    "Phường An Nhơn": "Số 1C Nguyễn Văn Lượng, phường An Nhơn, Tp Hồ Chí Minh",
    "Phường Gò Vấp":
      "332 (Số cũ 19) Quang Trung, phường Gò Vấp, Tp Hồ Chí Minh",
    "Phường Thông Tây Hội":
      "175 Nguyễn Văn Khối, phường Thông Tây Hội, Tp Hồ Chí Minh",
    "Phường An Hội Tây": "397 Phan Huy Ích, phường An Hội Tây, Tp Hồ Chí Minh",
    "Phường An Hội Đông":
      "330 (số cũ 182) Thống Nhất, phường An Hội Đông, Tp Hồ Chí Minh",
    "Phường Đức Nhuận": "744 Nguyễn Kiệm, phường Đức Nhuận, Tp Hồ Chí Minh",
    "Phường Phú Nhuận": "159 Nguyễn Văn Trỗi, phường Phú Nhuận, Tp Hồ Chí Minh",
    "Phường Cầu Kiệu": "458 Phan Xích Long, phường Cầu Kiệu, Tp Hồ Chí Minh",
    "Phường Tân Sơn Hòa": "291 Lê Văn Sỹ, phường Tân Sơn Hòa, Tp Hồ Chí Minh",
    "Phường Tân Sơn Nhất":
      "25/4-6 Hoàng Việt, phường Tân Sơn Nhất, Tp Hồ Chí Minh",
    "Phường Tân Hòa": "356A Bắc Hải, phường Tân Hòa, Tp Hồ Chí Minh",
    "Phường Bảy Hiền":
      "1129/20 (số cũ 2025/20) Lạc Long Quân, phường Bảy Hiền, Tp Hồ Chí Minh",
    "Phường Tân Bình": "387A Trường Chinh, phường Tân Bình, Tp Hồ Chí Minh",
    "Phường Tân Sơn":
      "822 (số cũ 8/6) Trường Chinh, phường Tân Sơn, Tp Hồ Chí Minh",
    "Phường Tây Thạnh":
      "200/12 Nguyễn Hữu Tiến, phường Tây Thạnh, Tp Hồ Chí Minh",
    "Phường Tân Sơn Nhì": "48 Tân Quý, phường Tân Sơn Nhì, Tp Hồ Chí Minh",
    "Phường Phú Thọ Hòa": "146 Độc Lập, phường Phú Thọ Hòa, Tp Hồ Chí Minh",
    "Phường Phú Thạnh": "275 Nguyễn Sơn, phường Phú Thạnh, Tp Hồ Chí Minh",
    "Phường Tân Phú": "525 Âu Cơ, phường Tân Phú, Tp Hồ Chí Minh",
    "Xã Tân Nhựt": "số 79, đường Tân Túc, xã Tân Nhựt, Tp Hồ Chí Minh",
    "Xã Bình Chánh":
      "số 345, đường Trịnh Như Khuê, xã Bình Chánh, Tp Hồ Chí Minh",
    "Xã Bình Hưng":
      "A10/26A đường số 10, Khu dân cư Bình Hưng, xã Bình Hưng, Tp Hồ Chí Minh",
    "Xã Hưng Long": "564 Đoàn Nguyễn Tuấn, xã Hưng Long, Tp Hồ Chí Minh",
    "Xã Bình Lợi": "Số 1905, đường Trần Văn Giàu, xã Bình Lợi, Tp Hồ Chí Minh",
    "Xã Vĩnh Lộc": "F7/16 Hương lộ 80, xã Vĩnh Lộc, Tp Hồ Chí Minh",
    "Xã Tân Vĩnh Lộc":
      "2206 đường Trần Văn Giàu, xã Tân Vĩnh Lộc, Tp Hồ Chí Minh",
    "Xã Bình Khánh": "Ấp Bình An 1, xã Bình Khánh, Tp Hồ Chí Minh",
    "Xã An Thới Đông": "Ấp An Hòa 1, xã An Thới Đông, Tp Hồ Chí Minh",
    "Xã Cần Giờ": "số 48 đường Lương Văn Nho, xã Cần Giờ, Tp Hồ Chí Minh",
    "Xã Thạnh An": "Ấp Thạnh Bình, xã Thạnh An, Tp Hồ Chí Minh",
    "Xã An Nhơn Tây":
      "1407 Tỉnh lộ 7, ấp Chợ Củ 2, xã An Nhơn Tây, Tp Hồ Chí Minh",
    "Xã Thái Mỹ":
      "712 Phan Văn Khải, ấp Phước Hưng, xã Thái Mỹ, Tp Hồ Chí Minh",
    "Xã Nhuận Đức": "1A Bà Thiên, ấp Ngã Tư, xã Nhuận Đức, Tp Hồ Chí Minh",
    "Xã Tân An Hội": "77 Tỉnh lộ 8, xã Tân An Hội, Tp Hồ Chí Minh",
    "Xã Củ Chi": "342 Phan Văn Khải, ấp Đình, xã Củ Chi, Tp Hồ Chí Minh",
    "Xã Phú Hòa Đông": "269 Tỉnh lộ 8, ấp 2A, xã Phú Hòa Đông, Tp Hồ Chí Minh",
    "Xã Bình Mỹ": "1627 Tỉnh lộ 8, ấp 1A, xã Bình Mỹ, Tp Hồ Chí Minh",
    "Xã Hóc Môn": "Số 01, Lý Thường Kiệt, xã Hóc Môn, Tp Hồ Chí Minh",
    "Xã Bà Điểm":
      "14/9 Phan Văn Hớn, ấp Tiền Lân 1, xã Bà Điểm, Tp Hồ Chí Minh",
    "Xã Đông Thạnh":
      "250 ấp 54, đường Đặng Thúc Vịnh, xã Đông Thạnh, Tp Hồ Chí Minh",
    "Xã Xuân Thới Sơn":
      "Số 1A Lê Thị Kim, ấp 11, xã Xuân Thới Sơn, Tp Hồ Chí Minh",
    "Xã Nhà Bè": "330 Nguyễn Bình, xã Nhà Bè, Tp Hồ Chí Minh",
    "Xã Hiệp Phước": "209 Nguyễn Văn Tạo, xã Hiệp Phước, Tp Hồ Chí Minh",
    "Phường An Khánh": "171/1 Lương Định Của, phường An Khánh, Tp Hồ Chí Minh",
    "Phường Bình Trưng": "8 Hồ Thị Nhung, phường Bình Trưng, Tp Hồ Chí Minh",
    "Phường Cát Lái": "441A Nguyễn Thị Định, phường Cát Lái, Tp Hồ Chí Minh",
    "Phường Phước Long": "616 Đỗ Xuân Hợp, phường Phước Long, Tp Hồ Chí Minh",
    "Phường Long Trường":
      "893 Nguyễn Duy Trinh, phường Long Trường, Tp Hồ Chí Minh",
    "Phường Long Bình": "325 Nguyễn Văn Tăng, phường Long Bình, Tp Hồ Chí Minh",
    "Phường Long Phước":
      "239 Khu phố Long Thuận, phường Long Phước, Tp Hồ Chí Minh",
    "Phường Tăng Nhơn Phú":
      "29 Lê Văn Việt, phường Tăng Nhơn Phú, Tp Hồ Chí Minh",
    "Phường Linh Xuân": "1262 Kha Vạn Cân, phường Linh Xuân, Tp Hồ Chí Minh",
    "Phường Tam Bình": "707 Tỉnh lộ 43, phường Tam Bình, Tp Hồ Chí Minh",
    "Phường Thủ Đức": "2 Nguyễn Công Trứ, phường Thủ Đức, Tp Hồ Chí Minh",
    "Phường Hiệp Bình": "721 Quốc lộ 13, phường Hiệp Bình, Tp Hồ Chí Minh",
    "Phường Thủ Dầu Một":
      "Số 01, đường Quang Trung, phường Thủ Dầu Một, Bình Dương",
    "Phường Bình Dương":
      "Số 357, đường Võ Nguyên Giáp, phường Bình Dương, Bình Dương",
    "Phường Phú Lợi": "Số 438, đường Phú Lợi, phường Phú Lợi, Bình Dương",
    "Phường Chánh Hiệp":
      "Số 279, đường Hồ Văn Cống, phường Chánh Hiệp, Bình Dương",
    "Phường Phú An": "Số 143, đường Nguyễn Đức Cảnh, phường Phú An, Bình Dương",
    "Phường Lái Thiêu": "Đường Phan Đình Phùng, phường Lái Thiêu, Bình Dương",
    "Phường Thuận An":
      "Số 289, đường Hưng Định 31, phường Thuận An, Bình Dương",
    "Phường Bình Hòa": "Đường ĐT743C, phường Bình Hòa, Bình Dương",
    "Phường An Phú": "Đường ĐT743, phường An Phú, Bình Dương",
    "Phường Thuận Giao": "Đường Thủ Khoa Huân, phường Thuận Giao, Bình Dương",
    "Phường Dĩ An": "Đường số 10, phường Dĩ An, Bình Dương",
    "Phường Đông Hòa": "Số 153, đường Quốc Lộ 1K, phường Đông Hòa, Bình Dương",
    "Phường Tân Đông Hiệp":
      "Số 880, đường Nguyễn Thị Minh Khai, phường Tân Đông Hiệp, Bình Dương",
    "Phường Tân Uyên": "Khu phố 1, phường Tân Uyên, Bình Dương",
    "Phường Tân Khánh": "Đường ĐT746, phường Tân Khánh, Bình Dương",
    "Phường Tân Hiệp": "Đường Nguyễn Khuyến, phường Tân Hiệp, Bình Dương",
    "Phường Bình Cơ": "Đường ĐT747A, phường Bình Cơ, Bình Dương",
    "Phường Vĩnh Tân": "Đường ĐT742, phường Vĩnh Tân, Bình Dương",
    "Phường Bến Cát": "Đường 30 Tháng 4, phường Bến Cát, Bình Dương",
    "Phường Tây Nam": "Đường ĐT744, phường Tây Nam, Bình Dương",
    "Phường Long Nguyên": "Đường An Điền 151, phường Long Nguyên, Bình Dương",
    "Phường Thới Hòa": "Đường Quốc lộ 13, phường Thới Hòa, Bình Dương",
    "Phường Hòa Lợi":
      "Số 353, đường Nguyễn Văn Thành, phường Hòa Lợi, Bình Dương",
    "Phường Chánh Phú Hòa":
      "Đường Nguyễn Văn Thành, phường Chánh Phú Hòa, Bình Dương",
    "Xã Bàu Bàng": "Đường N17-5A, xã Bàu Bàng, Bình Dương",
    "Xã Trừ Văn Thố": "Đường ĐT750, xã Trừ Văn Thố, Bình Dương",
    "Xã Phú Giáo": "Số 16A, đường Trần Quang Diệu, xã Phú Giáo, Bình Dương",
    "Xã Phước Hòa": "Số 410, đường ĐT741, xã Phước Hòa, Bình Dương",
    "Xã Phước Thành": "Đường ĐH508, xã Phước Thành, Bình Dương",
    "Xã An Long": "Số 231, đường ĐT 741C, xã An Long, Bình Dương",
    "Xã Dầu Tiếng": "Số 5, đường Lê Lợi, xã Dầu Tiếng, Bình Dương",
    "Xã Long Hòa": "Đường ĐT749A, ấp Long Điền, xã Long Hòa, Bình Dương",
    "Xã Minh Thạnh": "Đường ĐT749B, ấp Hòa Cường, xã Minh Thạnh, Bình Dương",
    "Xã Thanh An": "Đường ĐT744, ấp Cần Giăng, xã Thanh An, Bình Dương",
    "Xã Bắc Tân Uyên": "Khu phố 5, xã Bắc Tân Uyên, Bình Dương",
    "Xã Thường Tân": "Đường ĐT746, ấp 4, xã Thường Tân, Bình Dương",
    "Xã Ngãi Giao": "70 Trần Hưng Đạo, xã Ngãi Giao, Bà Rịa - Vũng Tàu",
    "Xã Kim Long": "Tổ 19, xã Kim Long, Bà Rịa - Vũng Tàu",
    "Xã Bình Giã":
      "đường Mỹ xuân-Hoà bình, tổ 1, ấp Vĩnh Bình, xã Bình Giã, Bà Rịa - Vũng Tàu",
    "Xã Xuân Sơn": "tổ 11, thôn Xuân Tân, xã Xuân Sơn, Bà Rịa - Vũng Tàu",
    "Xã Nghĩa Thành": "tổ 6 thôn Sông Cầu, xã Nghĩa Thành, Bà Rịa - Vũng Tàu",
    "Xã Châu Đức": "Ấp Liên Lộc, xã Châu Đức, Bà Rịa - Vũng Tàu",
    "Phường Bà Rịa":
      "221 Cách mạng Tháng Tám, phường Bà Rịa, Bà Rịa - Vũng Tàu",
    "Phường Tam Long":
      "Tỉnh lộ 52, Ấp Đông, phường Tam Long, Bà Rịa - Vũng Tàu",
    "Phường Long Hương":
      "Đường Trịnh Đình Thảo, phường Long Hương, Bà Rịa - Vũng Tàu",
    "Phường Phú Mỹ": "Số 412 Độc lập, phường Phú Mỹ, Bà Rịa - Vũng Tàu",
    "Phường Tân Phước":
      "số 2102, Đường Độc lập, phường Tân Phước, Bà Rịa - Vũng Tàu",
    "Phường Tân Hải": "QL 51, thôn Láng Cát, phường Tân Hải, Bà Rịa - Vũng Tàu",
    "Phường Tân Thành":
      "Số 152, đường Bình Giã, phường Tân Thành, Bà Rịa - Vũng Tàu",
    "Xã Châu Pha": "Thôn Tân Lễ B, xã Châu pha, Bà Rịa - Vũng Tàu",
    "Xã Đất Đỏ":
      "Đường Lê Hồng Phong, ấp Hiệp Hòa, xã Đất Đỏ, Bà Rịa - Vũng Tàu",
    "Xã Long Điền": "Số 1939, Quốc lộ 55, xã Long Điền, Bà Rịa - Vũng Tàu",
    "Xã Long Hải": "Số 45, Hương lộ 5, xã Long Hải, Bà Rịa - Vũng Tàu",
    "Xã Phước Hải": "Ấp Hội Mỹ, xã Phước Hải, Bà Rịa - Vũng Tàu",
    "Phường Vũng Tàu":
      "Số 89 Lý Thường Kiệt, Phường 1, phường Vũng Tàu, Bà Rịa - Vũng Tàu",
    "Phường Tam Thắng":
      "Số 603 đường Nguyễn An Ninh, phường Tam Thắng, Bà Rịa - Vũng Tàu",
    "Phường Phước Thắng":
      "Số 7A đường Nguyễn Gia Thiều, phường Phước Thắng, Bà Rịa - Vũng Tàu",
    "Phường Rạch Dừa":
      "Số 219/28 Lưu Chí Hiếu, phường Rạch Dừa, Bà Rịa - Vũng Tàu",
    "Xã Long Sơn": "Thôn 1, xã Long Sơn, Bà Rịa - Vũng Tàu",
    "Xã Xuyên Mộc":
      "Quốc lộ 55, ấp Trang Hoàng, xã Xuyên Mộc, Bà Rịa - Vũng Tàu",
    "Xã Hoà Hội": "Tỉnh lộ 328, ấp 4, xã Hoà Hội, Bà Rịa - Vũng Tàu",
    "Xã Hòa Hiệp": "Tỉnh lộ 329, ấp Phú Bình, xã Hòa Hiệp, Bà Rịa - Vũng Tàu",
    "Xã Bàu Lâm": "Ấp 2 Đông, xã Bàu Lâm, Bà Rịa - Vũng Tàu",
    "Xã Bình Châu": "Quốc lộ 55, ấp Láng Găng, xã Bình Châu, Bà Rịa - Vũng Tàu",
    "Xã Hồ Tràm": "Hẻm 147, Quốc lộ 55, xã Hồ Tràm, Bà Rịa - Vũng Tàu",
    "Đặc khu Côn Đảo":
      "Số 28, Tôn Đức Thắng, Đặc Khu Côn Đảo, Bà Rịa - Vũng Tàu",
  };
};

export const costReportOptions = [
  { label: "Lập báo cáo kinh tế - kỹ thuật", value: "lapBCKTKT" },
  { label: "Thẩm tra báo cáo kinh tế - kỹ thuật", value: "thamTraBCKTKT" },
  { label: "Lập kế hoạch thuê dịch vụ", value: "lapKeHoachThueDV" },
  { label: "Thẩm tra kế hoạch thuê dịch vụ", value: "thamTraKeHoachThueDV" },
  { label: "Lập báo cáo nghiên cứu khả thi", value: "lapBCNCKT" },
  { label: "Thẩm tra báo cáo nghiên cứu khả thi", value: "thamTraBCNCKT" },
];