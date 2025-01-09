import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../utils/languageSlice";

export const appStore = configureStore({
  reducer: {
    languages: languageReducer,
  },
});
