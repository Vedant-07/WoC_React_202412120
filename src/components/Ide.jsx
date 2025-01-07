import React, { useState, useEffect } from "react";
import Split from "react-split";
import axios from "axios";
import CodeSection from "./CodeSection";
import Input from "./Input";
import Output from "./Output";
import "../styles.css";
import languages from "../utils/languages";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const getLanguagesOptions = {
  method: "GET",
  url: `https://${apiUrl}/languages`,
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiUrl
  }
};

//correct this code...............
const getLanguages = async () => {
  console.log("Fetching all languages..."+apiKey);

  try {
    const response = await axios.request(getLanguagesOptions);
    const languages = await response.data;
    console.log("Available languages:", languages);
  } catch (err) {
    console.error("Problem fetching languages:", err.message);
  }
};

const Ide = () => {
  const [hideInputAndOutput, setHideInputAndOutput] = useState(false);
  //console.log(languageData)
  const [selectedLanguageId,setSelectedLanguageId]=useState(languages[0].id)

  useEffect(() => {
    const fetchLanguages = async () => {
      const languages=await getLanguages();
    };
    //fetchLanguages();
  }, []);

  const handleOption=(e)=>{
    setSelectedLanguageId(e.target.value)
  }

  
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
            <select name="" id="" value={selectedLanguageId} onChange={handleOption} className="bg-slate-500">
            <option value="" disabled className="bg-white">Select a language</option>
              {
                languages.map((val)=>{
                  return (
                    <option key={val.id} value={val.id} className='bg-white'>{val.name}</option>
                  )
                })
              }
              <option value=""></option>
            </select>
            {selectedLanguageId}
          </div>
        </div>
        <div className="bg-green-500 rounded-lg p-1">Run code</div>
        <div>themes</div>
      </div>

      {hideInputAndOutput ? (
        <div className="flex-grow">
          <CodeSection languageId={selectedLanguageId}/>
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
            <CodeSection languageId={selectedLanguageId} />
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
                <Input />
              </div>
              <div className="flex-grow">
                <Output />
              </div>
            </Split>
          </div>
        </Split>
      )}
    </div>
  );
};

export default Ide;
