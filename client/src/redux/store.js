import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { userSlice } from "./userSlice";
import { clanCategorySlice } from "./clanCategorySlice";
import { joinedClanSlice } from "./joinedClansSlice";
import { bookmarksSlice } from "./bookmarksSlice";
import { notificationSlice } from "./notificationsSlice";

const store = configureStore({
  reducer: {
    loaders: loaderSlice.reducer,
    users: userSlice.reducer,
    clanCategories: clanCategorySlice.reducer,
    joinedclans: joinedClanSlice.reducer,
    clanBookmarks: bookmarksSlice.reducer,
    notifications: notificationSlice.reducer,
  },
});

export default store;
