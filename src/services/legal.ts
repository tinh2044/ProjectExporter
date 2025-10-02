import legalInfo from './legal.json';

/**
 * load legal info
 * @returns {Promise<string[]>} list legal info
 */
export const loadLegalInfo = async () => {
  try {
    return legalInfo;
  } catch (error) {
    console.error('Error loading legal info:', error);
    return getDefaultLegalInfo();
  }
};

/**
 * get default legal info
 * @returns {string[]} list legal info
 */
const getDefaultLegalInfo = () => {
  return [
    "Căn cứ Luật Đấu thầu số 22/2023/QH15 ngày 23 tháng 6 năm 2023;",
    "Căn cứ Luật số 57/2024/QH15 ngày 29 tháng 11 năm 2024 về sửa đổi, bổ sung một số điều của Luật Quy hoạch, Luật Đầu tư, Luật Đầu tư theo phương thức đối tác công tư và Luật Đấu thầu;",
    "Căn cứ Luật số 90/2025/QH15 ngày 25 tháng 6 năm 2025 về sửa đổi, bổ sung một số điều của luật đấu thầu, luật đầu tư theo phương thức đối tác công tư, luật hải quan, luật thuế giá trị gia tăng, luật thuế xuất khẩu, thuế nhập khẩu, luật đầu tư, luật đầu tư công, luật quản lý; sử dụng tài sản công;",
    "Căn cứ Nghị định số 214/2025/NĐ-CP ngày 04 tháng 8 năm 2025 của Chính phủ về quy định chi tiết một số điều và biện pháp thi hành luật đấu thầu về lựa chọn nhà thầu;",
    "Căn cứ Thông tư số 79/2025/TT-BTC ngày 04 tháng 8 năm 2025 của Bộ Tài Chính về hướng dẫn việc cung cấp, đăng tải thông tin về đấu thầu và mẫu hồ sơ đấu thầu trên hệ thống mạng đấu thầu quốc gia;",
  ];
};

/**
 * @param {Array} data - list legal info
 * @param {string} keyword - search keyword
 */
export const searchLegalInfo = (data: string[], keyword: string) => {
  if (!keyword) return data;
  
  const lowerKeyword = keyword.toLowerCase();
  return data.filter(item => 
    item.toLowerCase().includes(lowerKeyword)
  );
};