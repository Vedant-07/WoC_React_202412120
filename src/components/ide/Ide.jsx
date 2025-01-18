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
import { setStdIn,setSourceCode,setLanguageId,setTheme } from "../../utils/ideSlice";
import { defaultLanguages } from "../../constants/defaultLanguages";

const Ide = ({
  setOpenExplorer,
  openExplorer,
  handleSubmission,
  loading,
  setLoading,
}) => {
  const user = useSelector((store) => store.user);
  const sourceCode=useSelector(store=>store.ide.sourceCode)
  const languageId=useSelector(store=>store.ide.languageId)
  const theme =useSelector(store=>store.ide.theme)
  const currentFile=useSelector(store=>store.file.currentFile)

  const [hideInputAndOutput, setHideInputAndOutput] = useState(false);

  

  const languages = useSelector((state) => state.languages);
  const [monacoLanguage, setMonacoLanguage] = useState("plaintext");
  const dispatch = useDispatch();

  useEffect(() => {
    //fetching languages
    if (localStorage.getItem("languages")) {
      const langData = JSON.parse(localStorage.getItem("languages"));
      dispatch(addLanguages(langData));
    } else if (languages.length === 0) {
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
      //localStorage.setItem("languageId",JSON.stringify(languageId))
    } else {
      //TODO: apply hre updating related to firebase

    }
  }, [sourceCode, theme]);

  useEffect(()=>{
    if(!user)
    {
      console.log("is this triggered ????????????????????????//");
      localStorage.setItem("languageId",JSON.stringify(languageId))
      const defaultLanguage=defaultLanguages(+languageId)
      dispatch(setSourceCode(defaultLanguage))
      localStorage.setItem("sourceCode",JSON.stringify(defaultLanguage))
      //setSourceCode(defaultLanguage)
    }
  },[languageId])


  //cant load files now when the user is signed in
  useEffect(() => {
    
    if (user && currentFile?.sourceCode && currentFile?.languageId ) {
      
      dispatch(setSourceCode(currentFile.sourceCode));
      dispatch(setLanguageId(currentFile.languageId));
      
    }
  }, [user, currentFile]);

  const handleOption = (e) => {
    const selectedId = e.target.value;
    //setSelectedLanguageId(selectedId);
    dispatch(setLanguageId(selectedId))
    // Find the language object based on languageId
    const mLanguage = languages.find((lang) => lang.languageId == selectedId);
    if (mLanguage) setMonacoLanguage(mLanguage.id);
    setSourceCode(defaultLanguages(mLanguage.id)); //what is this for???
  };

  const handleStdIn = (val) => {
    dispatch(setStdIn(val))
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between px-4 py-2 items-center">
        <div className="flex gap-3">
          {!openExplorer && (
            <button className="" onClick={() => setOpenExplorer((val) => !val)}>
              {`⏩`}
            </button>
          )}

          <button
            className="bg-slate-400"
            onClick={() => setHideInputAndOutput((val) => !val)}
          >
            I/O
          </button>
          <div>
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
  sizes={hideInputAndOutput ? [70, 30] : [100, 0]}
  minSize={[0, hideInputAndOutput ? 125 : 0]} 
  gutterSize={10}
  direction="vertical"
  cursor="row-resize"
  className="flex-grow split overflow-hidden" 
  dragInterval={20}
>
  
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

  
  {hideInputAndOutput ? (
    <div className="flex h-full">
      <Split
        sizes={[50, 50]}
        minSize={[180, 150]} 
        gutterSize={10}
        direction="horizontal"
        cursor="col-resize"
        className="flex-grow flex"
        dragInterval={20}
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
