import React, { useRef, useState } from "react";

const Input = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    console.log(file);

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large!");
      return;
    }
    let maxLength = 20;
    if (file) {
      setFileName(
        file.name.length > maxLength
          ? file.name.substring(0, maxLength) + "..."
          : file.name
      );
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

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
          {fileName.length > 0 ? fileName : ""}{" "}
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
        className="flex-grow bg-gray-400 p-2"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
      ></textarea>
    </div>
  );
};

export default Input;
