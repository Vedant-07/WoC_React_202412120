import React, { useState } from "react";

const Output = ({ output }) => {
  console.log("from Output");
  console.log(!output);

  return (
    <div className="flex flex-grow h-full flex-col">
      <div className="flex justify-between items-center p-3">
        <h4 className="text-2xl font-bold">Output</h4>
      </div>

      {/* Display Error (stderr) */}
      {output?.stderr && (
        <textarea
          className="flex-grow bg-black text-red-600"
          value={output.stderr}
          disabled
        ></textarea>
      )}

      {/* Display Output (stdout) */}
      {output?.stdout && (
        <textarea
          className="flex-grow bg-black text-green-600"
          value={output.stdout}
          disabled
        ></textarea>
      )}

      {/* If No Output */}
      {!output && (
        <textarea
          className="flex-grow bg-black"
          value="Output would be displayed here ....."
          disabled
        ></textarea>
      )}
    </div>
  );
};

export default Output;
