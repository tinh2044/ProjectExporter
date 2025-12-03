import type { ApiResponse } from "@/types/api-response";
import type { CreateDuAnDto, DuAn, UpdateDuAnDto } from "@/types/du-an";
import publicAxios from "../publicAxios";
import type { DuAnParams } from "../params/du-an";
import type { HopDong } from "@/types/hop-dong";
import type { HopDongParams } from "../params/hop-dong";

const duAnApi = {
  finds: async (params: DuAnParams): Promise<ApiResponse<DuAn>> => {
    const response = await publicAxios.get("/du-ans", { params });
    return response.data;
  },

  findHopDongsBy: async (
    duAnId: number,
    params: HopDongParams
  ): Promise<ApiResponse<HopDong>> => {
    const response = await publicAxios.get(`/du-ans/${duAnId}/hop-dongs`, {
      params,
    });
    return response.data;
  },

  create: async (dto: CreateDuAnDto): Promise<DuAn> => {
    const response = await publicAxios.post("/du-ans", dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateDuAnDto): Promise<DuAn> => {
    const response = await publicAxios.patch(`/du-ans/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await publicAxios.delete(`/du-ans/${id}`);
  },
};

export default duAnApi;
