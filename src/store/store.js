import { configureStore } from "@reduxjs/toolkit";
import newprojectSlice from "./newprojectSlice";
import loadingslice from "./loadingslice";
import filtersSlice from "./filtersSlice";
import projectDetails from "./projectDetails";
const store = configureStore({
  reducer: {
    newprojects : newprojectSlice,
    loading:loadingslice,
  userFilter:filtersSlice,
  projectDetails:projectDetails
  },
});

export default store;