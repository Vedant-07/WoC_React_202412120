import React, { useState } from "react";
import { useSelector } from "react-redux";
import FileEditModal from "./FileEditModal";

const FileExplorer = ({
  setOpenExplorer,
  setUserFiles,
  selectedFileId,
  handleSelectedFileId,
  userFiles,
  isModalOpen,
  setIsModalOpen,
  handleUpdate,
}) => {

  
  return (
    <div>
      {/* File Explorer Header */}
      <div className="flex justify-between p-3 items-center bg-slate-400">
        <h4>FileExplorer</h4>
        <div className="flex gap-2">
          <button className="" onClick={() => setIsModalOpen(true)}>
            {`➕`}
          </button>
          <button className="" onClick={() => setOpenExplorer((val) => !val)}>
            {`⏪`}
          </button>
        </div>
      </div>

      <div>
        {userFiles.map((file) => {
          return (
            <div
              className={`p-1 m-1 flex items-center justify-between ${
                file.fileId === selectedFileId ? "bg-slate-300" : "bg-slate-100"
              } `}
              id={file.fileId}
              key={file.fileId}
              onClick={() => handleSelectedFileId(file.fileId)}
            >
              <div className="flex items-center gap-1 flex-grow min-w-0">
                <div>{`📄`}</div>
                <div
                  className={`truncate text-left max-w-full overflow-hidden `}
                  title={file.name}
                >
                  {file.name}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsModalOpen(true)}>{`⚙️`}</button>
                <button>{`🗑️`}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <FileEditModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default FileExplorer;
