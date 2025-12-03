import { configureStore } from "@reduxjs/toolkit";
import duAnsSlice from "@/features/duAns/duAnsSlice";
import hopDongsSlice from "@/features/hopDongs/hopDongsSlice";
export const store = configureStore({
  reducer: {
    duAns: duAnsSlice,
    hopDongs: hopDongsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
