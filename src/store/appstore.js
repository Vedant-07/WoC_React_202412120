import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../utils/languageSlice";
import userReducer from "../utils/userSlice";
import ideReducer from "../utils/ideSlice"
import fileReducer from "../utils/fileSlice"

export const appStore = configureStore({
  reducer: {
    languages: languageReducer,
    user: userReducer,
    ide: ideReducer,
    file:fileReducer
  },
});
