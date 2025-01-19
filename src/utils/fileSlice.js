import { createSlice } from "@reduxjs/toolkit";

const initialState={
    openFileExplorer:true,
    isFileExplorerChanged:false,
    isEditFile:false,
    userFiles:null,
    currentFile:null,
    selectedFileId:null
}

const fileSlice=createSlice({
    name:"fileState",
    initialState,
    reducers:{
        setOpenFileExplorer:(state,action)=>{
            state.openFileExplorer=action.payload
        },
        setUserFiles:(state,action)=>{
            state.userFiles=action.payload
        },
        setSelectedFileId:(state,action)=>{
            state.selectedFileId=action.payload
        },
        setCurrentFile:(state,action)=>{
            state.currentFile=action.payload
        },
        setIsEditFile:(state,action)=>{
            state.isEditFile=action.payload
        },
        setIsFileExplorerChanged:(state,action)=>{
            state.isFileExplorerChanged=action.payload
        },
        setFile: (state, action) => {
            // Update multiple fields at once
            return { ...state, ...action.payload };
          },
    }
})

export const { setIsFileExplorerChanged,setUserFiles,setSelectedFileId,setCurrentFile,setIsEditFile,setOpenFileExplorer }=fileSlice.actions

export default fileSlice.reducer