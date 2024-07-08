import { createSlice } from "@reduxjs/toolkit";

export const joinedClanSlice = createSlice({
  name: "joinedclans",
  initialState: {
    joinedclans: [],
  },
  reducers: {
    SetJoinedClans: (state, action) => {
      state.joinedclans = action.payload;
    },
  },
});

export const { SetJoinedClans } = joinedClanSlice.actions;
