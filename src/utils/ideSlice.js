import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceCode: JSON.parse(localStorage.getItem("sourceCode")) || "",
  theme: JSON.parse(localStorage.getItem("theme")) || "vs-dark",
  output: null,
  languageId: JSON.parse(localStorage.getItem("languageId")) || "",
};

const ideSlice = createSlice({
  name: "ide",
  initialState,  // Use initialState directly here
  reducers: {
    setStdIn: (state, action) => {
      state.stdIn = action.payload;
    },
    setSourceCode: (state, action) => {
      state.sourceCode = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguageId: (state, action) => {
      state.languageId = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setIde: (state, action) => {
      // Update multiple fields at once
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setStdIn,
  setSourceCode,
  setTheme,
  setLanguageId,
  setOutput,
  setIde,
} = ideSlice.actions;

export default ideSlice.reducer;
