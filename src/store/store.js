import { configureStore } from "@reduxjs/toolkit";
import newprojectSlice from "./newprojectSlice";
import loadingslice from "./loadingslice";
import filtersSlice from "./filtersSlice";
const store = configureStore({
  reducer: {
    newprojects : newprojectSlice,
    loading:loadingslice,
  userFilter:filtersSlice
  },
});

export default store;