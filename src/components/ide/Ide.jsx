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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { debounce } from "../../utils/debounce";

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
      const updatedSourceCode = async () => {
        await updateDoc(fileRef, { sourceCode });
      };
      const updatedTheme = async () => {
        const newTheme = {
          "settings.theme": theme,
        };
        await updateDoc(userRef, newTheme);
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
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      "editorState.ideAndIOPanel": ideAndIOPanel,
    });
  };

  useEffect(() => {
    if (!user) return;
    updateIdeAndIOPanel();
  }, [ideAndIOPanel]);

  const handleDragEndIdeAndIOPanel = (sizes) => {
    dispatch(setIdeAndIOPanel(sizes));
  };

  const updateIOPanel = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      "editorState.ioPanel": ioPanel,
    });
  };

  useEffect(() => {
    if (!user) return;
    updateIOPanel();
  }, [ioPanel]);

  const handleDragIOPanel = (sizes) => {
    dispatch(setIOPanel(sizes));
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between px-4 py-2 items-center">
        <div className="flex gap-3">
          {!openFileExplorer && (
            <button
              className=""
              onClick={() => dispatch(setOpenFileExplorer(true))}
            >
              {`⏩`}
            </button>
          )}

          <button
            className="bg-slate-400"
            onClick={() => dispatch(setShowIO(!showIO))}
          >
            I/O
          </button>
          <div>
            {!user && (
              <select
                value={languageId}
                onChange={handleOption}
                style={{ backgroundColor: "white", color: "black" }}
                disabled={languages.length === 0}
              >
                <option value="" disabled>
                  Select a language
                </option>
                {languages.length > 0 &&
                  languages.map((lang) => (
                    <option
                      key={lang.id}
                      value={lang.languageId}
                      className="text-black"
                    >
                      {lang.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
        <button
          className={`rounded-lg p-1 ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
          }`}
          onClick={handleSubmission}
        >
          {loading ? "Processing the code plz wait ......" : "Run code"}
        </button>
        <div>
          <select
            value={theme}
            onChange={(e) => dispatch(setTheme(e.target.value))}
            className="bg-slate-500"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>
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
