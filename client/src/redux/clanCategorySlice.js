import { createSlice } from "@reduxjs/toolkit";



export const clanCategorySlice= createSlice({
     name:"clancategory",
     initialState:{
        clanCategory:"general",
     },
     reducers:{
        SetClanCategory:(state,action)=>{
            state.clanCategory=action.payload
        }
     }
})


export const {SetClanCategory}=clanCategorySlice.actions