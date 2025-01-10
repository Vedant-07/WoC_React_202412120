export const getLanguagesOptions = (apiUrl, apiKey) => ({
  method: "GET",
  url: `https://${apiUrl}/languages`,
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiUrl,
  },
});

export const postSubmissionOptions = (
  apiUrl,
  apiKey,
  sourceCode,
  languageId,
  stdIn
) => ({
  method: "POST",
  url: `https://${apiUrl}/submissions`,
  // params: {
  //   base64_encoded: 'true',
  // },
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiUrl,
    "Content-Type": "application/json",
  },
  data: {
    source_code: sourceCode,
    language_id: languageId,
    stdin: stdIn,
    expected_output: "",
  },
});

export const getSubmissionOptions = (apiUrl, apiKey, token) => ({
  method: "GET",
  url: `https://${apiUrl}/submissions/${token}`,
  // params: {
  //   base64_encoded: 'true',
  //   fields: '*'
  // },
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiUrl,
  },
});
