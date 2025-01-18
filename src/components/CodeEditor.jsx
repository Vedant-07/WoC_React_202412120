import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Ide from "./ide/Ide";
import Split from "react-split";
import FileExplorer from "./ide/FileExplorer";
import { getSubmissionResult, postSubmission } from "../utils/apiHelpers";
import { setOutput } from "../utils/ideSlice";
//TODO: move this somewhere else
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const CodeEditor = () => {
  const user=useSelector(s=>s.user)
  const stdIn = useSelector((store) => store.ide.stdIn);
  const sourceCode = useSelector((store) => store.ide.sourceCode);
  const languageId = useSelector((store) => store.ide.languageId);

  const dispatch = useDispatch();

  const [openExplorer, setOpenExplorer] = useState(true);

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

  return (
    <div className="h-screen w-full">
      {!user ? 
      <div className="h-full flex-grow bg-white">
      <Ide
        setOpenExplorer={setOpenExplorer}
        openExplorer={openExplorer}
        handleSubmission={handleSubmission}
        setLoading={setLoading}
        loading={loading}
      />
  </div> :
    <Split
        sizes={[20, 80]}
        minSize={[150, 800]}
        gutterSize={9}
        direction="horizontal"
        cursor="col-resize"
        className="split flex h-full"
      >
        {false ? (
          <div className="h-full bg-gray-100 overflow-auto">
            <FileExplorer
              setOpenExplorer={setOpenExplorer}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        ) : (
          <div style={{ display: "none" }} />
        )}

        <div className="h-full flex-grow bg-white">
          <Ide
            setOpenExplorer={setOpenExplorer}
            openExplorer={openExplorer}
            handleSubmission={handleSubmission}
            setLoading={setLoading}
            loading={loading}
          />
        </div> 
        </Split>
    
  }
      </div> 
      
  );
};

export default CodeEditor;
