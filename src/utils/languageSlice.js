import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "languages",
  initialState: [],
  reducers: {
    addLanguages: (state, action) => {
      return action.payload;
    },
    removeLanguages: (state) => {
      return null;
    },
  },
});

export const { addLanguages } = languageSlice.actions;

export default languageSlice.reducer;
