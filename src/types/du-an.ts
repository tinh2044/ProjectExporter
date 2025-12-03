export interface DuAn {
  id: number;
  ten: string;
  chuDauTu: string;
}

export interface CreateDuAnDto {
  ten: string;
  chuDauTu: string;
}

export interface UpdateDuAnDto {
  ten?: string;
  chuDauTu?: string;
}
