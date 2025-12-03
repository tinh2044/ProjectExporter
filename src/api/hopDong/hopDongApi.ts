import type { ApiResponse } from "@/types/api-response";
import type {
  CreateHopDongDto,
  HopDong,
  HopDongDashboard,
  UpdateHopDongDto,
} from "@/types/hop-dong";
import publicAxios from "../publicAxios";
import type { HopDongDashboardParams, HopDongParams } from "../params/hop-dong";

const hopDongApi = {
  finds: async (params: HopDongParams): Promise<ApiResponse<HopDong>> => {
    const response = await publicAxios.get("/hop-dongs", { params });
    return response.data;
  },

  findDashboard: async (
    params: HopDongDashboardParams
  ): Promise<HopDongDashboard> => {
    const response = await publicAxios.get("/hop-dongs/dashboard", { params });
    return response.data;
  },

  createForDuAn: async (
    duAnId: number,
    dto: CreateHopDongDto
  ): Promise<HopDong> => {
    const response = await publicAxios.post(`/du-ans/${duAnId}/hop-dongs`, dto);
    return response.data;
  },

  updateForDuAn: async (
    duAnId: number,
    id: number,
    dto: UpdateHopDongDto
  ): Promise<HopDong> => {
    const response = await publicAxios.patch(
      `/du-ans/${duAnId}/hop-dongs/${id}`,
      dto
    );
    return response.data;
  },

  deleteForDuAn: async (duAnId: number, id: number): Promise<void> => {
    await publicAxios.delete(`/du-ans/${duAnId}/hop-dongs/${id}`);
  },
};

export default hopDongApi;
