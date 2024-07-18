import { createSlice } from "@reduxjs/toolkit";

export const bookmarksSlice = createSlice({
  name: "clanbookmarks",
  initialState: {
    clanBookmarks: [],
  },
  reducers: {
    SetClanBookmarks: (state, action) => {
      state.clanBookmarks = action.payload;
    },
  },
});

export const { SetClanBookmarks } = bookmarksSlice.actions;
