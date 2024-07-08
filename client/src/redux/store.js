import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { userSlice } from "./userSlice";
import { clanCategorySlice } from "./clanCategorySlice";
import { joinedClanSlice } from "./joinedClansSlice";

const store = configureStore({
  reducer: {
    loaders: loaderSlice.reducer,
    users: userSlice.reducer,
    clanCategories: clanCategorySlice.reducer,
    joinedclans: joinedClanSlice.reducer,
  },
});

export default store;
