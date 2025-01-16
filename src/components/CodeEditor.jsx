import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Ide from "./ide/Ide";
import Split from "react-split";
import FileExplorer from "./ide/FileExplorer";
import { userData as udata } from "../constants/dummyFirebaseData";
import { getSubmissionResult, postSubmission } from "../utils/apiHelpers";
import { setLanguageId, setOutput, setSourceCode, setTheme } from "../utils/ideSlice";
import {
  setFileName,
  setFileLanguageId,
  setIsHandleAddFile,
  setIsHandleUpdateFile,
  setIsEditFile,
} from "../utils/fileSlice";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const CodeEditor = () => {
  const user = useSelector((store) => store.user);
  const stdIn = useSelector((store) => store.ide.stdIn);
  const sourceCode = useSelector((store) => store.ide.sourceCode);
  const languageId = useSelector((store) => store.ide.languageId);
  const theme=useSelector(store=>store.ide.theme)
  const fileName = useSelector((store) => store.file.fileName);
  const fileLanguageId = useSelector((store) => store.file.fileLanguageId);
  const isHandleAddFile = useSelector((store) => store.file.isHandleAddFile);
  const isHandleUpdateFile=useSelector(store=>store.file.isHandleUpdateFile)
  const languages = useSelector((store) => store.languages);

  const dispatch = useDispatch();

  const [openExplorer, setOpenExplorer] = useState(true);
  //TODO: please extract that particular user from it
  //also extract that particular user files content from here ...
  const [userFiles, setUserFiles] = useState(udata.userId1.files); //this contains specifically a user and its files
  const [selectedFileId, setSelectedFileId] = useState(userFiles[0].fileId);
  const [currentFile, setCurrentFile] = useState(userFiles[0]);

  //TODO: bank on this
  //const [fileModalState, setFileModalState] = useState(true);

  //importing from the Ide here
  // const [sourceCode, setSourceCode] = useState(() => {
  //   !user ? JSON.parse(localStorage.getItem("sourceCode")) || "" : "";
  // });
  // please make same for languageId also
  //const [stdIn, setStdIn] = useState("");
  // const [theme, setTheme] = useState(() =>
  //   !user ? JSON.parse(localStorage.getItem("theme")) || "vs-dark" : "vs-dark"
  // );
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  //handle updates from file Modal
  const handleAddFile = () => {
    console.log("File Name:", fileName, "File Type:", fileLanguageId);
    console.log(languages);
    const language = languages.find(
      (lang) => lang.languageId == fileLanguageId
    );
    console.log(language);
    const newFile = {
      fileId: new Date().getTime(),
      name: `${fileName}${language.extensions[0]}`,
      sourceCode: "// console.log('Hello, World!');",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      languageId: fileLanguageId,
    };

    // Update the state by creating a new array
    setUserFiles((prevData) => [...prevData, newFile]);

    setIsModalOpen(false);
    dispatch(setFileName(""));
    dispatch(setFileLanguageId(""));
  };

  useEffect(() => {
    if (isHandleAddFile) {
      dispatch(setIsEditFile(false))
      handleAddFile(file);
      dispatch(setIsHandleAddFile(false)); // Resetting the flag after handling the action
    }
  }, [isHandleAddFile]);

  //--end of tasks

  const handleUpdateFile = (file) => {
    //setFileModalState(true);
    setIsModalOpen(true);

    //clip name
    const clippedName = file.name.split(".").slice(0, -1).join(".");
    console.log("cy name " + clippedName);
    dispatch(setFileName(clippedName));
    const language = languages.find(
      (lang) => lang.languageId == file.languageId
    );
    console.log("language is " + language);
    dispatch(setFileLanguageId(language.languageId));
    //update the time
    //setFileModalState(false);
    
  };

  useEffect(() => { 
    if (isHandleUpdateFile) {
      dispatch(setIsEditFile(true))
      
      //send the current file here
      handleUpdateFile(currentFile);
      dispatch(setIsHandleAddFile(false)); // Resetting the flag after handling the action
    }
  }, [isHandleUpdateFile]);

  const handleSubmission = async () => {
    if (!languageId) {
      alert("please select language first !!!!");
      return;
    }
    if(!sourceCode){
      alert("please write the code for compilation")
      return
    }
    setLoading(true);
    try {
      const token = await postSubmission(
        apiUrl,
        apiKey,
        sourceCode,
        languageId,
        stdIn
      );

      if (!token) {
        console.error("No token received");
        setLoading(false);
        return;
      }

      const result = await getSubmissionResult(apiUrl, apiKey, token);
      dispatch(setOutput(result));
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  //find out through useEffect function what fileId we do have at that specific time
  useEffect(() => {
    const data = userFiles.find((file) => file.fileId === selectedFileId);
    setCurrentFile(data);
  }, [selectedFileId]);

  const handleSelectedFileId = (fileId) => {
    setSelectedFileId(fileId);
  };


  return (
    <div className="h-screen w-full">
      <Split
        sizes={[20, 80]}
        minSize={[150, 800]}
        gutterSize={9}
        direction="horizontal"
        cursor="col-resize"
        className="split flex h-full"
      >
        {openExplorer ? (
          <div className="h-full bg-gray-100 overflow-auto">
            <FileExplorer
              setOpenExplorer={setOpenExplorer}
              setUserFiles={setUserFiles}
              userFiles={userFiles}
              selectedFileId={selectedFileId}
              handleSelectedFileId={handleSelectedFileId}
              //handleAddFile={handleAddFile}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              //handleUpdate={handleUpdate}
            />
          </div>
        ) : (
          <div style={{ display: "none" }} />
        )}
        <div className="h-full flex-grow bg-white">
          <Ide
            setOpenExplorer={setOpenExplorer}
            openExplorer={openExplorer}
            currentFile={currentFile}
            handleSubmission={handleSubmission}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      </Split>
    </div>
  );
};

export default CodeEditor;
