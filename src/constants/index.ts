import dayjs from "dayjs";

export const defaultFormInformation = {
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
    Chuẩn hóa Cơ sở dữ liệu hiện có, xây dựng mô hình liên thông dữ liệu từ Cơ sở dữ liệu ngành, từ đó điểm số có thể được liên thông qua “Hệ thống quản lý Học bạ điện tử, sổ điểm điện tử”, không cần gõ tay, giúp tiết kiệm công sức, tăng độ chính xác, giảm sai sót.
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
    Ngày 18/01/2019 Bộ Giáo dục và Đào tạo ban hành Chỉ thị số 138/CT-BGDĐT về việc chấn chỉnh tình trạng lạm dụng hồ sơ, sổ sách trong nhà trường. Trong đó có đề cập “từng bước sử dụng hồ sơ, sổ sách điện tử thay cho các loại hồ sơ, sổ sách hiện hành theo lộ trình phù hợp với điều kiện của địa phương, nhà trường và khả năng thực hiện của giáo viên";
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
  baoCaoOptions: "Lập kế hoạch thuê dịch vụ",
  soTienBaoCao: 243377018,
  chiPhiOptions: "Chi phí thẩm tra báo cáo kinh tế - kỹ thuật",
  soTienChiPhi: 11794425,
};
