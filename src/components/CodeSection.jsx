import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const CodeSection = ({language_id}) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;
  const [sourceCode, setSourceCode] = useState("");

  const submitCode = async () => {
    try {
      const options = {
        method: "POST",
        url: "https://judge029.p.rapidapi.com/submissions",
        params: {
          base64_encoded: "false",
          wait: "false",
          fields: "*",
        },
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": apiUrl,
          "Content-Type": "application/json",
        },
        data: {
          source_code: sourceCode, // Submit the Base64-encoded code
          language_id: language_id, // Node.js
          stdin: "",
        },
      };

      const response = await axios.request(options);
      const token = response.data.token;
      console.log("Token:", token);

      // Poll for results
      fetchResults(token);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const fetchResults = async (token) => {
    const getOptions = {
      method: "GET",
      url: `https://${apiUrl}/submissions/${token}`,
      params: {
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiUrl,
      },
    };

    let completed = false;

    while (!completed) {
      try {
        const response = await axios.request(getOptions);
        const { status, stdout, stderr } = response.data;

        if (
          status.description === "In Queue" ||
          status.description === "Processing"
        ) {
          console.log(`Status: ${status.description}`);
          await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait 1 second before retrying
        } else {
          completed = true;
          console.log(`Status: ${status.description}`);
          console.log("Output:", stdout ? atob(stdout) : "No output");
          console.log("Error:", stderr ? atob(stderr) : "No errors");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        break;
      }
    }
  };

  useEffect(() => {
    // submitCode(); // Submit the code on component mount
  }, []);

  return (
    <div className="bg-slate-300 flex flex-grow h-full flex-col">
      <div className="bg-slate-200 flex flex-grow h-full p-1">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="code from here"
          className="flex-grow"
          onChange={(e) => setSourceCode(e.target.value)}
          value={sourceCode}
        ></textarea>
      </div>
    </div>
  );
};

export default CodeSection;
