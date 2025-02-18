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
    <div className="flex flex-grow h-full flex-col">
      <div className="flex justify-between items-center p-2">
        <h4 className="text-2xl font-bold">Input</h4>
        <div>
          <button
            className="bg-blue-500 text-white p-2  rounded shadow-md hover:bg-blue-600 transition"
            onClick={handleFileClick}
          >
            Choose File{" "}
          </button>{" "}
          {/* TODO:add file name afterwards for display */}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileSelect(e)}
          style={{ display: "none" }}
        />
      </div>
      <textarea
        name=""
        id=""
        className="flex-grow bg-black p-2 text-white"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
      ></textarea>
    </div>
  );
};

export default Input;
