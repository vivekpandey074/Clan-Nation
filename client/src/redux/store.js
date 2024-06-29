import {configureStore} from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { userSlice } from "./userSlice";
import { clanCategorySlice} from "./clanCategorySlice"

const store=configureStore({
    reducer:{
        loaders:loaderSlice.reducer,
        users:userSlice.reducer,
        clanCategories:clanCategorySlice.reducer,
    }
})




export default store;