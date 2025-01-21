import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sourceCode: JSON.parse(localStorage.getItem("sourceCode")) || "console.log('hello guest user')",
  theme: JSON.parse(localStorage.getItem("theme")) || "vs-dark",
  output: null,
  languageId: JSON.parse(localStorage.getItem("languageId")) || 63,
  showIO: true,
  ideAndIOPanel: [70, 30],
  ioPanel: [50, 50],
  monacoLanguage:JSON.parse(localStorage.getItem("monacoLanguage")) || "javascript"
};

const ideSlice = createSlice({
  name: "ide",
  initialState, // Use initialState directly here
  reducers: {
    setShowIO: (state, action) => {
      state.showIO = action.payload;
    },
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
    setIdeAndIOPanel: (state, action) => {
      state.ideAndIOPanel = action.payload;
    },
    setIOPanel: (state, action) => {
      state.ioPanel = action.payload;
    },
    setMonacoLanguage:(state,action)=>{
      state.monacoLanguage=action.payload
    },
    setIde: (state, action) => {
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
  setShowIO,
  setIdeAndIOPanel,
  setIOPanel,
  setMonacoLanguage
} = ideSlice.actions;

export default ideSlice.reducer;
