import { createSlice ,current} from "@reduxjs/toolkit";
import { getActiveFilters } from "../helper/getActiveFilters";

const initialState={
    is_admin: false,
    is_owner: false,
    is_uploader: {
        read: false,
        write: false
    },
    is_analyzer: {
        read: false,
        write: false
    },
    is_reporter: {
        read: false,
        write: false
    },
}
const filterSlice=createSlice({
    name: 'filterSlice',
    initialState: {
        filters: {initialState },
        totalActiveFilterCount:0,
        
    },
    reducers:{
        setFilters:(state,action)=>{
            state.filters=action.payload
        },
        setActiveFilterCount:(state)=>{
            const currentState=current(state)
            state.totalActiveFilterCount=getActiveFilters(currentState?.filters)

        },
        resetFilters:(state)=>{
            state.totalActiveFilterCount=0
            state.filters=initialState
            
        }
       
        
    }
})

export const{setFilters,setActiveFilterCount,resetFilters}=filterSlice.actions
export default filterSlice.reducer