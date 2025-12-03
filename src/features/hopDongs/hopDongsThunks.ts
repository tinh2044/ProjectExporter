import hopDongApi from "@/api/hopDong/hopDongApi";
import type {
  HopDongDashboardParams,
  HopDongParams,
} from "@/api/params/hop-dong";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHopDongs = createAsyncThunk(
  "hopDongs/fetchHopDongs",
  async (params: HopDongParams) => {
    return await hopDongApi.finds(params);
  }
);

export const fetchHopDongDashboard = createAsyncThunk(
  "hopDongs/fetchDashboard",
  async (params: HopDongDashboardParams) => {
    return await hopDongApi.findDashboard(params);
  }
);
