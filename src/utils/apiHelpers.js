// utils/apiHelpers.js

import axios from "axios";
import { getSubmissionOptions, postSubmissionOptions } from "../constants/getApiOptions";

export const postSubmission = async (apiUrl, apiKey, sourceCode, selectedLanguageId, stdIn) => {
  try {
    const res = await axios.request(
      postSubmissionOptions(apiUrl, apiKey, sourceCode, selectedLanguageId, stdIn)
    );
    return res.data.token;
  } catch (error) {
    console.error("Error during submission:", error);
    throw error;
  }
};

export const getSubmissionResult = async (apiUrl, apiKey, token) => {
  try {
    let attempt = 0;
    const maxAttempts = 3;
    const delay = 2000;

    while (attempt < maxAttempts) {
      const res = await axios.request(getSubmissionOptions(apiUrl, apiKey, token));
      const status = res.data.status?.description;
      if (status === "Accepted" || status === "Wrong Answer") {
        return res.data;
      } else if (status === "Processing" || status === "In Queue" ) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        return {
          stderr: null,
          stdout: null,
          status,
          compileOutput: res.data?.compile_output,
        };
      }

      attempt++;
    }

    console.error("Exceeded maximum attempts. Processing took too long.");
    return null;
  } catch (error) {
    console.error("Error fetching submission result:", error);
    throw error;
  }
};
