import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    count: 0,
  },
  reducers: {
    IncrementNotificationCount: (state) => {
      state.count = state.count + 1;
    },
    ResetNotficationCount: (state) => {
      state.count = 0;
    },
  },
});

export const { IncrementNotificationCount, ResetNotficationCount } =
  notificationSlice.actions;
