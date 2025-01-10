import React, { useState, useEffect } from "react";
import Split from "react-split";
import axios from "axios";
import Input from "./Input";
import Output from "./Output";
import "../styles.css";
import { useSelector, useDispatch } from "react-redux";
import { addLanguages } from "../utils/languageSlice";
import Editor from "@monaco-editor/react";
import {
  getLanguagesOptions,
  getSubmissionOptions,
  postSubmissionOptions,
} from "../constants/getApiOptions";
import * as monaco from "monaco-editor";
import { findCommonLanguages } from "../utils/findCommonLanguages";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const Ide = () => {
  const [hideInputAndOutput, setHideInputAndOutput] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  //const [sourceCode, setSourceCode] = useState("");
  const [sourceCode, setSourceCode] = useState(() => {
    return JSON.parse(localStorage.getItem('sourceCode')) || "";
  });
  const [stdIn, setStdIn] = useState("");
  const [output, setOutput] = useState(null);
  //three themes for now
  //const [theme, setTheme] = useState("vs-dark");
  const [theme,setTheme]=useState(()=>{
    return JSON.parse(localStorage.getItem('theme')) || 'vs-dark'
  }
  )
  const [loading, setLoading] = useState(false);

  const languages = useSelector((state) => state.languages);
  const [monacoLanguage, setMonacoLanguage] = useState("plaintext");
  const dispatch = useDispatch();

  useEffect(() => {
    //fetching languages
    if(localStorage.getItem("languages")){
     const langData=JSON.parse(localStorage.getItem("languages"))
      dispatch(addLanguages(langData));
    }
    else if (languages.length === 0) {
      const fetchLanguages = async () => {
        const res = await axios.request(getLanguagesOptions(apiUrl, apiKey));
        const languages = findCommonLanguages(
          monaco.languages.getLanguages(),
          res.data
        );
        dispatch(addLanguages(languages));
        localStorage.setItem("languages",JSON.stringify(languages))
      };
       fetchLanguages();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sourceCode', JSON.stringify(sourceCode));
  }, [sourceCode]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  const handleOption = (e) => {
    const selectedId = e.target.value;
    setSelectedLanguageId(selectedId);
    // Find the language object based on languageId
    const mLanguage = languages.find((lang) => lang.languageId == selectedId);
    if (mLanguage) setMonacoLanguage(mLanguage.id);
  };

  const handleSubmission = async () => {
    if(!selectedLanguageId) {
      alert("please select language first !!!!") 
      return
    }
    setLoading(true);
    let token = null;

    //TODO move below this two functions to utils
    // post submission and getting token
    const postSubmission = async () => {
      try {
        const res = await axios.request(
          postSubmissionOptions(
            apiUrl,
            apiKey,
            sourceCode,
            selectedLanguageId,
            stdIn
          )
        );
        token = res.data.token;
        console.log("Token is:", token);
      } catch (error) {
        console.error("Error during submission:", error);
      }
    };

    await postSubmission();

    // Proceed only if the token is available
    if (!token) {
      console.error("No token received......................");
      return;
    }

    const getSubmissionResult = async (token) => {
      try {
        let attempt = 0;
        const maxAttempts = 3;
        const delay = 2000;

        while (attempt < maxAttempts) {
          const res = await axios.request(
            getSubmissionOptions(apiUrl, apiKey, token)
          );
          const status = res.data.status?.description;

          if (
            status === "In Queue" ||
            status == "Accepted" ||
            status == "Wrong Answer"
          ) {
            setOutput(res.data);
            console.log("Final output is:", res.data);
            return;
          } else if (status === "Processing") {
            console.log("Still processing, retrying...");
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            console.error("Unexpected status:", status);
            setOutput({
              stderr:null,
              stdout:null,
              status,
              compileOutput:res.data?.compile_output
            })
            return;
          }

          attempt++;
        }

        console.error("Exceeded maximum attempts. Processing took too long.");
      } catch (error) {
        console.error("Error fetching submission result:", error);
      }
    };
     await getSubmissionResult(token);

    setLoading(false);
  };

  const handleStdIn = (val) => {
    setStdIn(val);
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex justify-between px-4 py-2 items-center">
        <div className="flex gap-3">
          <button
            className="bg-slate-400"
            onClick={() => setHideInputAndOutput((val) => !val)}
          >
            I/O
          </button>
          <div>
            <select
              value={selectedLanguageId}
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
            onChange={(e) => setTheme(e.target.value)}
            className="bg-slate-500"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>
        </div>
      </div>

      {hideInputAndOutput ? (
        <div className="flex-grow ">
          <Editor
            language={monacoLanguage}
            defaultValue={""}
            value={sourceCode}
            onChange={(value) => setSourceCode(value)}
            theme={theme}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
            className="flex-grow"
          />
        </div>
      ) : (
        <Split
          sizes={[70, 30]}
          minSize={70}
          gutterSize={10}
          direction="vertical"
          cursor="row-resize"
          className="flex-grow split"
        >
          <div className="flex-grow">
            <Editor
              defaultValue=""
              language={monacoLanguage}
              theme={theme}
              value={sourceCode}
              onChange={(value) => setSourceCode(value)}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>

          <div className="h-full">
            <Split
              sizes={[50, 50]}
              minSize={360}
              gutterSize={10}
              direction="horizontal"
              cursor="col-resize"
              className="flex h-full"
            >
              <div className="flex-grow">
                <Input handleStdIn={handleStdIn} />
              </div>
              <div className="flex-grow">
                <Output output={output} />
              </div>
            </Split>
          </div>
        </Split>
      )}
    </div>
  );
};

export default Ide;
