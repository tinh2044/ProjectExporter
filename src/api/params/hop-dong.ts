export interface HopDongParams {
  page?: number;
  limit?: number;
  days?: number;
  status?: "expired" | "active" | "all";
  sort?: string;
}

export interface HopDongDashboardParams {
  from?: Date;
  to?: Date;
}
