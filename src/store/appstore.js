import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../utils/languageSlice";
import userReducer from "../utils/userSlice";

export const appStore = configureStore({
  reducer: {
    languages: languageReducer,
    user: userReducer,
  },
});
