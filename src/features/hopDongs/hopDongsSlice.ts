import type { HopDong, HopDongDashboard } from "@/types/hop-dong";
import { createSlice } from "@reduxjs/toolkit";
import { fetchHopDongDashboard, fetchHopDongs } from "./hopDongsThunks";

interface HopDongsState {
  total: number;
  hopDongs: HopDong[];
  dashboard: HopDongDashboard | null;
  status: "idle" | "pending" | "succeeded" | "failed";
  dashboardStatus: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: HopDongsState = {
  total: 0,
  hopDongs: [],
  dashboard: null,
  status: "idle",
  dashboardStatus: "idle",
  error: null,
};

const hopDongsSlice = createSlice({
  name: "hopDongs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHopDongs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchHopDongs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.hopDongs = action.payload.data;
      })
      .addCase(fetchHopDongs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(fetchHopDongDashboard.pending, (state) => {
        state.dashboardStatus = "pending";
      })
      .addCase(fetchHopDongDashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "succeeded";
        state.dashboard = action.payload;
      })
      .addCase(fetchHopDongDashboard.rejected, (state, action) => {
        state.dashboardStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export default hopDongsSlice.reducer;
