import { configureStore } from '@reduxjs/toolkit';
import projectFormSlice from './slices/projectFormSlice';

export const store = configureStore({
  reducer: {
    projectForm: projectFormSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
