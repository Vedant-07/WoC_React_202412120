import React, { useState, useEffect } from "react";
import Split from "react-split";
import axios from "axios";
import Input from "./Input";
import Output from "./Output";
import "../../styles.css";
import { useSelector, useDispatch } from "react-redux";
import { addLanguages } from "../../utils/languageSlice";
import Editor from "@monaco-editor/react";
import { getLanguagesOptions } from "../../constants/getApiOptions";
import * as monaco from "monaco-editor";
import { findCommonLanguages } from "../../utils/findCommonLanguages";
import {
  setStdIn,
  setSourceCode,
  setLanguageId,
  setTheme,
  setShowIO,
  setIdeAndIOPanel,
  setIOPanel,
  setMonacoLanguage,
} from "../../utils/ideSlice";
import { defaultLanguages } from "../../constants/defaultLanguages";
import { setOpenFileExplorer } from "../../utils/fileSlice";
import { db } from "../../utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { debounce } from "../../utils/debounce";
import { contentType } from "../../constants/contentType";

const Ide = ({ handleSubmission, loading }) => {
  const user = useSelector((store) => store.user);
  const sourceCode = useSelector((store) => store.ide.sourceCode);
  const languageId = useSelector((store) => store.ide.languageId);
  const theme = useSelector((store) => store.ide.theme);
  const currentFile = useSelector((store) => store.file.currentFile);
  const openFileExplorer = useSelector((s) => s.file.openFileExplorer);
  const selectedFileId = useSelector((s) => s.file.selectedFileId);
  const showIO = useSelector((s) => s.ide.showIO);
  const ideAndIOPanel = useSelector((s) => s.ide.ideAndIOPanel);
  const ioPanel = useSelector((s) => s.ide.ioPanel);
  const languages = useSelector((state) => state.languages);
  const monacoLanguage = useSelector((s) => s.ide.monacoLanguage);
  const dispatch = useDispatch();

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    //fetching languages
    if (localStorage.getItem("languages")) {
      const langData = JSON.parse(localStorage.getItem("languages"));
      dispatch(addLanguages(langData));
    } else {
      const fetchLanguages = async () => {
        const res = await axios.request(getLanguagesOptions(apiUrl, apiKey));
        const languages = findCommonLanguages(
          monaco.languages.getLanguages(),
          res.data
        );
        dispatch(addLanguages(languages));
        localStorage.setItem("languages", JSON.stringify(languages));
      };
      fetchLanguages();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("sourceCode", JSON.stringify(sourceCode));
      localStorage.setItem("theme", JSON.stringify(theme));
    } else {
      if (!selectedFileId) return;
      //TODO: apply hre updating related to firebase
      //create a query to update sourceCode
      const fileRef = doc(db, "files", selectedFileId);
      const userRef = doc(db, "users", user.uid);

      //if(!userRef.exists()) return

      const updatedSourceCode = async () => {
        const fileSnap = await getDoc(fileRef);

        if (fileSnap.exists())
          await setDoc(fileRef, { sourceCode }, { merge: true });
      };
      const updatedTheme = async () => {
        const newTheme = {
          "settings.theme": theme,
        };
        await updateDoc(userRef, newTheme, { merge: true });
      };
      const delayCode = debounce(updatedSourceCode, 1000);
      const delayTheme = debounce(updatedTheme, 500);

      delayCode(sourceCode);

      delayTheme(theme);
    }
  }, [sourceCode, theme]);

  useEffect(() => {
    //TODO: problem here improvement needed in this code.............
    if (!user) {
      //make function for this not the useeffect
      localStorage.setItem("languageId", JSON.stringify(languageId));
      const mLanguage = languages.find((lang) => lang.languageId == languageId);
      if (mLanguage) dispatch(setMonacoLanguage(mLanguage.id));
      localStorage.setItem("monacoLanguage", JSON.stringify(monacoLanguage));
    }
  }, [languageId]);

  //cant load files now when the user is signed in
  useEffect(() => {
    if (user && currentFile?.sourceCode && currentFile?.languageId) {
      dispatch(setSourceCode(currentFile.sourceCode));
      dispatch(setLanguageId(currentFile.languageId));
    }
  }, [user, currentFile]);

  const handleOption = (e) => {
    const selectedId = e.target.value;
    dispatch(setLanguageId(selectedId));
    // Find the language object based on languageId
    const mLanguage = languages.find((lang) => lang.languageId == selectedId);
    if (mLanguage) dispatch(setMonacoLanguage(mLanguage.id));
    localStorage.setItem("monacoLanguage", JSON.stringify(monacoLanguage));
    dispatch(setSourceCode(defaultLanguages(+selectedId)));
  };

  const handleStdIn = (val) => {
    dispatch(setStdIn(val));
  };

  const updateIdeAndIOPanel = async () => {
    if (!user) return; // Ensure user is available

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      //TODO:remove this 
      if (!userSnap.exists()) {
        //console.log("User document does not exist. Creating...");
      }

      await updateDoc(
        userRef,
        { "editorState.ideAndIOPanel": ideAndIOPanel },
        { merge: true } // Create if not exists, update if exists
      );
    } catch (error) {
      console.error("Error updating ideAndIOPanel:", error);
    }
  };

  useEffect(() => {
    if (!user || !ideAndIOPanel) return; // Prevent unnecessary calls
    updateIdeAndIOPanel();
  }, [ideAndIOPanel, user]); // Include `user` to ensure it's available

  const handleDragEndIdeAndIOPanel = (sizes) => {
    dispatch(setIdeAndIOPanel(sizes));
  };

  const updateIOPanel = async () => {
    if (!user) return; //TODO:remove this later
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      //TODO: remove this 
      if (!userSnap.exists()) {
        //console.log("User document does not exist. Creating...");
      }

      await updateDoc(
        userRef,
        { "editorState.ioPanel": ioPanel },
        { merge: true } // Creates if not exists, updates if exists
      );
    } catch (error) {
      console.error("Error updating ioPanel:", error);
    }
  };

  useEffect(() => {
    if (!user || !ioPanel) return;
    updateIOPanel();
  }, [user, ioPanel]);

  const handleDragIOPanel = (sizes) => {
    dispatch(setIOPanel(sizes));
  };

  //download the code here
  const handleDownloadCode = () => {
    try {
      console.log("Download attempt:", { currentFile, sourceCode, languages });
      
      if (!currentFile || !currentFile.languageId) {
        console.log("No file selected or file data missing");
        alert("No file selected or file data missing");
        return;
      }

      const langContentType = contentType(+currentFile.languageId);
      const lang = languages.find(
        (language) => currentFile.languageId == language.languageId
      );

      console.log("Language info:", { lang, langContentType });

      if (!lang || !lang.extensions || !lang.extensions[0]) {
        console.log("Language extension not found");
        alert("Language extension not found");
        return;
      }

      const fileName = `${currentFile.name}${lang.extensions[0]}`;
      console.log("Downloading file:", fileName);
      
      const blob = new Blob([sourceCode], { type: langContentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("Download completed successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col w-full bg-secondary-50">
      {/* Modern Toolbar */}
      <div className="bg-white border-b border-secondary-200 shadow-soft">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Left Section - File Explorer & I/O Toggle */}
          <div className="flex items-center gap-3">
            {!openFileExplorer && (
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-all duration-200"
                onClick={() => dispatch(setOpenFileExplorer(true))}
                title="Show File Explorer"
              >
                <span>📁</span>
                <span className="hidden sm:inline">Files</span>
              </button>
            )}

            <button
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                showIO 
                  ? "bg-primary-100 text-primary-700" 
                  : "text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
              }`}
              onClick={() => dispatch(setShowIO(!showIO))}
              title="Toggle Input/Output Panel"
            >
              <span>📊</span>
              <span className="hidden sm:inline">I/O</span>
            </button>

            {/* Language Selector for Guest Users */}
            {!user && (
              <div className="relative">
                <select
                  value={languageId}
                  onChange={handleOption}
                  className="input-field text-sm py-2 pr-8 appearance-none cursor-pointer min-w-[140px]"
                  disabled={languages.length === 0}
                >
                  <option value="" disabled>
                    Select Language
                  </option>
                  {languages.length > 0 &&
                    languages.map((lang) => (
                      <option
                        key={lang.id}
                        value={lang.languageId}
                        className="text-secondary-900"
                      >
                        {lang.name}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Center Section - Run Button */}
          <div className="flex items-center">
            <button
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-soft ${
                loading 
                  ? "bg-secondary-400 cursor-not-allowed text-white" 
                  : "bg-accent-600 hover:bg-accent-700 text-white hover:shadow-medium"
              }`}
              onClick={handleSubmission}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <span>▶️</span>
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>

          {/* Right Section - Theme & Download */}
          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <div className="relative">
              <select
                value={theme}
                onChange={(e) => dispatch(setTheme(e.target.value))}
                className="input-field text-sm py-2 pr-8 appearance-none cursor-pointer min-w-[120px]"
              >
                <option value="vs-dark">🌙 Dark</option>
                <option value="light">☀️ Light</option>
                <option value="hc-black">⚫ High Contrast</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Download Button */}
            {user && (
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-all duration-200"
                onClick={handleDownloadCode}
                title="Download Code"
              >
                <span>📥</span>
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <Split
        sizes={showIO ? ideAndIOPanel || [70, 30] : [100, 0]}
        minSize={[0, showIO ? 125 : 0]}
        gutterSize={10}
        direction="vertical"
        cursor="row-resize"
        className="flex-grow split overflow-hidden"
        dragInterval={20}
        onDragEnd={handleDragEndIdeAndIOPanel}
      >
        {monacoLanguage && (
          <div className="flex-grow h-full">
            <Editor
              language={monacoLanguage}
              theme={theme}
              value={sourceCode}
              onChange={(value) => dispatch(setSourceCode(value))}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        )}

        {showIO ? (
          <div className="flex h-full">
            <Split
              sizes={ioPanel || [50, 50]}
              minSize={[180, 150]}
              gutterSize={10}
              direction="horizontal"
              cursor="col-resize"
              className="flex-grow flex"
              dragInterval={20}
              onDragEnd={handleDragIOPanel}
            >
              <div className="flex-grow overflow-auto">
                <Input handleStdIn={handleStdIn} />
              </div>

              <div className="flex-grow overflow-auto">
                <Output />
              </div>
            </Split>
          </div>
        ) : (
          <div className="hidden"></div>
        )}
      </Split>
    </div>
  );
};

export default Ide;
