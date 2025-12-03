import duAnApi from "@/api/duAn/duAnApi";
import hopDongApi from "@/api/hopDong/hopDongApi";
import type { DuAnParams } from "@/api/params/du-an";
import type { CreateDuAnDto, UpdateDuAnDto } from "@/types/du-an";
import type { CreateHopDongDto, UpdateHopDongDto } from "@/types/hop-dong";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDuAns = createAsyncThunk(
  "duAns/fetchDuAns",
  async (params: DuAnParams) => {
    return await duAnApi.finds(params);
  }
);

export const fetchHopDongsBy = createAsyncThunk(
  "duAns/fetchHopDongsBy",
  async ({ duAnId, params }: { duAnId: number; params: DuAnParams }) => {
    return await duAnApi.findHopDongsBy(duAnId, params);
  }
);

export const createDuAn = createAsyncThunk(
  "duAns/createDuAn",
  async (dto: CreateDuAnDto) => {
    return await duAnApi.create(dto);
  }
);

export const updateDuAn = createAsyncThunk(
  "duAns/updateDuAn",
  async ({ id, dto }: { id: number; dto: UpdateDuAnDto }) => {
    return await duAnApi.update(id, dto);
  }
);

export const deleteDuAn = createAsyncThunk(
  "duAns/deleteDuAn",
  async (id: number) => {
    await duAnApi.delete(id);
    return id;
  }
);

export const createHopDongForDuAn = createAsyncThunk(
  "duAns/createHopDongForDuAn",
  async ({ duAnId, dto }: { duAnId: number; dto: CreateHopDongDto }) => {
    return await hopDongApi.createForDuAn(duAnId, dto);
  }
);

export const updateHopDongForDuAn = createAsyncThunk(
  "duAns/updateHopDongForDuAn",
  async ({
    duAnId,
    id,
    dto,
  }: {
    duAnId: number;
    id: number;
    dto: UpdateHopDongDto;
  }) => {
    return await hopDongApi.updateForDuAn(duAnId, id, dto);
  }
);

export const deleteHopDongForDuAn = createAsyncThunk(
  "duAns/deleteHopDongForDuAn",
  async ({ duAnId, id }: { duAnId: number; id: number }) => {
    await hopDongApi.deleteForDuAn(duAnId, id);
    return id;
  }
);
