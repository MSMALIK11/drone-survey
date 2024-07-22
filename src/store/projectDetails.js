import { createSlice } from "@reduxjs/toolkit";
import {getUserPermissions} from '../helper/getProjectUserPermission'
const projectDetailsSlice=createSlice({
    name:"Project details",
    initialState:{
        data:{},
        permissions:{}
    },
    reducers:{
        setProjectDetails:(state,action)=>{
            state.data=action.payload;
            state.permissions=getUserPermissions(action.payload)
        },
        resetProjectDetails:(state)=>{
        state.data={}

        }
     
    }
})
export const{resetProjectDetails,setProjectDetails} =projectDetailsSlice.actions

export default projectDetailsSlice.reducer

