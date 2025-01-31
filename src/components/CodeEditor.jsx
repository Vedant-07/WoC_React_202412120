import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Ide from "./ide/Ide";
import Split from "react-split";
import FileExplorer from "./ide/FileExplorer";
import { getSubmissionResult, postSubmission } from "../utils/apiHelpers";
import { setOutput } from "../utils/ideSlice";
import { setExpAndIdePanel, setOpenFileExplorer } from "../utils/fileSlice";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import ChatBot from "./chat/chatBot";

//TODO: move this somewhere else
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const CodeEditor = () => {
  const user = useSelector((s) => s.user);
  const stdIn = useSelector((store) => store.ide.stdIn);
  const sourceCode = useSelector((store) => store.ide.sourceCode);
  const languageId = useSelector((store) => store.ide.languageId);
  const openFileExplorer = useSelector((s) => s.file.openFileExplorer);
  const showIO = useSelector((s) => s.ide.showIO);
  const expAndIdePanel = useSelector((s) => s.file.expAndIdePanel); //make this as a state in file exp

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const handleSubmission = async () => {
    if (!languageId) {
      alert("please select language first !!!!");
      return;
    }
    if (!sourceCode) {
      alert("please write the code for compilation");
      return;
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

  useEffect(() => {
    // updating the code editor state to the user doc
    const setEditorButtonLayout = async () => {
      const userRef = doc(db, "users", user.uid);
      const userData=await getDoc(userRef)
      if(userData.exists()){
        await updateDoc(userRef, {
          "editorState.showIO": showIO,
          "editorState.openFileExplorer": openFileExplorer,
        },{merge:true});
      }
      
    };

    if (user && openFileExplorer !== undefined && showIO !== undefined)
      {
        //TODO: add debounce to this .....
       
      setEditorButtonLayout();
      }
  }, [openFileExplorer, showIO,user]);

  const updateExpAndIdePanel = async () => {
    if (!user) return; // Ensure user is available
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
       
        return//no values so returning it
      }
  
      await updateDoc(
        userRef,
        { "editorState.expAndIdePanel": expAndIdePanel },
        { merge: true } // Creates if not exists, updates if exists
      );
  
     
    } catch (error) {
      console.error("Error updating expAndIdePanel:", error);
    }
  };

  
  useEffect(() => {
    if (!user || !expAndIdePanel) return; // Prevent unnecessary calls
    updateExpAndIdePanel();
  }, [expAndIdePanel, user]); // Include `user` to ensure it's available
  

  const handleDragEnd = (sizes) => {
    dispatch(setExpAndIdePanel(sizes));
    //add a ddebounce later to this
  };

  return (
    <div className="h-screen w-full">
      {!user ? (
        <div className="h-full flex-grow bg-white">
          <Ide
            handleSubmission={handleSubmission}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      ) : (
        <>
        <Split
          sizes={expAndIdePanel || [20, 80]}
          minSize={[150, 500]}
          gutterSize={9}
          direction="horizontal"
          cursor="col-resize"
          className="split flex h-full"
          dragInterval={20}
          onDragEnd={handleDragEnd}
        >
          {openFileExplorer ? (
            <div className="h-full bg-gray-100 overflow-auto">
              <FileExplorer
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          ) : (
            <div style={{ display: "none" }} />
          )}

          <div className="h-full flex-grow bg-white">
            <Ide
              handleSubmission={handleSubmission}
              setLoading={setLoading}
              loading={loading}
            />
          </div>
        </Split>
        <ChatBot/>
        </>
      )}
    </div>
  );
};

export default CodeEditor;
