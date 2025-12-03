export type LoaiHopDong =
  | "Tư vấn lập thuyết minh"
  | "Tư vấn đấu thầu"
  | "Tư vấn quản lí dự án"
  | "Tư vấn giám sát"
  | "Tư vấn thẩm tra";

export type TinhTrangHopDong =
  | "Đang thực hiện"
  | "Đã hoàn thành"
  | "Dự kiến kí hợp đồng"
  | "Dừng thực hiện";

export interface HopDong {
  id: number;
  loai: LoaiHopDong;
  tienDo: string;
  tinhTrang: TinhTrangHopDong;
  nhanSuThucHien: string | null;
  giaTri: string;
  tamUng: string | null;
  ngayKy: string;
  ngayKetThuc: string;
  ngayKetThucGiaHan: string | null;
  phuLuc: string | null;
  duAnId: number;
  soNgayConHan: number;
  soNgayConHanGiaHan: number | null;
  soTienConPhaiDong: number;
}

export interface CreateHopDongDto {
  loai?: LoaiHopDong;
  tienDo?: string;
  tinhTrang?: TinhTrangHopDong;
  nhanSuThucHien?: string;
  giaTri: number;
  tamUng?: number;
  ngayKy: string;
  ngayKetThuc: string;
  ngayKetThucGiaHan?: string;
  phuLuc: string;
}

export interface UpdateHopDongDto {
  loai?: LoaiHopDong;
  tienDo?: string;
  tinhTrang?: TinhTrangHopDong;
  nhanSuThucHien?: string;
  giaTri?: number;
  tamUng?: number;
  ngayKy?: string;
  ngayKetThuc?: string;
  ngayKetThucGiaHan?: string;
  phuLuc?: string;
}

export interface TinhTrangStatus {
  label: string;
  count: number;
  tongGiaTri: number;
}

export interface LoaiHopDongStatus {
  loai: LoaiHopDong;
  tinhTrang: TinhTrangStatus[];
  tongSo: number;
  tongGiaTri: number;
}

export interface HopDongDashboard {
  data: LoaiHopDongStatus[];
  totalSummary: {
    tongSo: number;
    tongGiaTri: number;
    tinhTrang: TinhTrangStatus[];
  };
}
