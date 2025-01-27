import { createSlice } from "@reduxjs/toolkit";
const initialState={
    isLoading:false
}
export const loadingSlice=createSlice({
    name:'loading',
    initialState,
    reducers:{
        startLoading:(state)=>{
           state.loading=true
        },
        stopLoading:(state)=>{
           state.isLoading=false
        }
        
    }
})

export const {startLoading,stopLoading}=loadingSlice.actions
export default loadingSlice.reducer