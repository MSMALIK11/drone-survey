import { createSlice } from "@reduxjs/toolkit";

const projectDetailsSlice=createSlice({
    name:"Project details",
    initialState:{
        data:{
            active:true
        }
    },
    reducers:{
        setProjectDetails:(state,action)=>{
            state.data=action.payload
        },
        resetProjectDetails:(state)=>{
        state.data={}

        }
    }
})
export const{resetProjectDetails,setProjectDetails} =projectDetailsSlice.actions

export default projectDetailsSlice.reducer

