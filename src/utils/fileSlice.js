import { createSlice } from "@reduxjs/toolkit";

const initialState={
    fileName:"",
    fileLanguageId:"",
    isHandleAddFile:false,
    isHandleUpdate:false,
    isHandleDelete:false,
    isEditFile:false
}

const fileSlice=createSlice({
    name:"fileState",
    initialState,
    reducers:{
        setFileLanguageId:(state,action)=>{
            state.fileLanguageId=action.payload
        },
        setFileName:(state,action)=>{
            state.fileName=action.payload
        },
        setIsHandleAddFile:(state,action)=>{
            state.isHandleAddFile=action.payload
        },
        setIsEditFile:(state,action)=>{
            state.isEditFile=action.payload
        },
        setIsHandleUpdateFile:(state,action)=>{
            state.isHandleUpdateFile=(action.payload)
        }
    }
})

export const { setFileName ,setFileLanguageId,setIsHandleAddFile,setIsEditFile,setIsHandleUpdateFile }=fileSlice.actions

export default fileSlice.reducer