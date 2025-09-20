import React, { useEffect, useRef, useState } from "react";

const Input = ({ handleStdIn }) => {
  const fileInputRef = useRef(null);
  const [fileContent, setFileContent] = useState("");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large!");
      return;
    }

    if (file) {
      //TODO: understand this code
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    handleStdIn(fileContent);
  }, [fileContent, handleStdIn]);

  return (
    <div className="flex flex-grow h-full flex-col bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-secondary-200 bg-secondary-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h4 className="text-lg font-semibold text-secondary-900">Input</h4>
        </div>
        <button
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
          onClick={handleFileClick}
        >
          <span>📁</span>
          <span>Choose File</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelect(e)}
          style={{ display: "none" }}
        />
      </div>
      
      {/* Input Area */}
      <div className="flex-grow p-4">
        <textarea
          name="input"
          id="input"
          className="w-full h-full bg-secondary-900 text-secondary-100 p-4 rounded-lg border border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
          placeholder="Enter your input here or choose a file..."
        />
      </div>
    </div>
  );
};

export default Input;
