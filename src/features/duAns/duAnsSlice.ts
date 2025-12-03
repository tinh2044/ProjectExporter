import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDuAns,
  createDuAn,
  updateDuAn,
  deleteDuAn,
  fetchHopDongsBy,
  createHopDongForDuAn,
  updateHopDongForDuAn,
  deleteHopDongForDuAn,
} from "./duAnsThunks";
import type { DuAn } from "@/types/du-an";
import type { HopDong } from "@/types/hop-dong";

interface DuAnsState {
  total: number;
  duAns: DuAn[];
  currentDuAnHopDongs: {
    total: number;
    data: HopDong[];
  };
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  actionStatus: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: DuAnsState = {
  total: 0,
  duAns: [],
  currentDuAnHopDongs: {
    total: 0,
    data: [],
  },
  status: "idle",
  error: null,
  actionStatus: "idle",
};

const duAnsSlice = createSlice({
  name: "duAns",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDuAns.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchDuAns.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.duAns = action.payload.data;
      })
      .addCase(fetchDuAns.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(createDuAn.pending, (state) => {
        state.actionStatus = "pending";
      })
      .addCase(createDuAn.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.duAns.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createDuAn.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(updateDuAn.pending, (state) => {
        state.actionStatus = "pending";
      })
      .addCase(updateDuAn.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.duAns.findIndex(
          (da: DuAn) => da.id === action.payload.id
        );
        if (index !== -1) {
          state.duAns[index] = action.payload;
        }
      })
      .addCase(updateDuAn.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(deleteDuAn.pending, (state) => {
        state.actionStatus = "pending";
      })
      .addCase(deleteDuAn.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.duAns = state.duAns.filter(
          (da: DuAn) => da.id !== action.payload
        );
        state.total -= 1;
      })
      .addCase(deleteDuAn.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(fetchHopDongsBy.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchHopDongsBy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentDuAnHopDongs = action.payload;
      })
      .addCase(fetchHopDongsBy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(createHopDongForDuAn.pending, (state) => {
        state.actionStatus = "pending";
      })
      .addCase(createHopDongForDuAn.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.currentDuAnHopDongs.data.unshift(action.payload);
        state.currentDuAnHopDongs.total += 1;
      })
      .addCase(createHopDongForDuAn.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(updateHopDongForDuAn.pending, (state) => {
        state.actionStatus = "pending";
      })
      .addCase(updateHopDongForDuAn.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.currentDuAnHopDongs.data.findIndex(
          (hd: HopDong) => hd.id === action.payload.id
        );
        if (index !== -1) {
          state.currentDuAnHopDongs.data[index] = action.payload;
        }
      })
      .addCase(updateHopDongForDuAn.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      })
      .addCase(deleteHopDongForDuAn.pending, (state) => {
        state.actionStatus = "pending";
      })
      .addCase(deleteHopDongForDuAn.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.currentDuAnHopDongs.data = state.currentDuAnHopDongs.data.filter(
          (hd: HopDong) => hd.id !== action.payload
        );
        state.currentDuAnHopDongs.total -= 1;
      })
      .addCase(deleteHopDongForDuAn.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.error.message ?? "Unknown Error";
      });
  },
});

export const { resetActionStatus } = duAnsSlice.actions;
export default duAnsSlice.reducer;
