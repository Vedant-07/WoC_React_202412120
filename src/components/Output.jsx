import React, { useState } from "react";

const Output = ({ output }) => {
  return (
    <div className="flex flex-grow h-full flex-col">
      <div className="flex justify-between items-center p-3">
        <h4 className="text-2xl font-bold">Output</h4>
      </div>

      {output?.stdout && (
        <textarea
          className="flex-grow bg-black text-green-600"
          value={output.stdout}
          disabled
        ></textarea>
      )}

      {/* Display Error (stderr) */}
      {output?.stderr && (
        <textarea
          className="flex-grow bg-black text-red-600"
          value={output.stderr}
          disabled
        ></textarea>
      )}

      {/* If No Output */}
      {output && !output?.stderr && !output?.stdout && (
        <textarea
          className="flex-grow bg-black text-yellow-600"
          value={
            output?.status +
            "  \n " +
            (output?.compileOutput === null ? "" : output?.compileOutput)
          }
          disabled
        ></textarea>
      )}

      {!output && (
        <textarea
          className="flex-grow bg-black text-white"
          value={" Output would be displayed here "}
          disabled
        ></textarea>
      )}
    </div>
  );
};

export default Output;
