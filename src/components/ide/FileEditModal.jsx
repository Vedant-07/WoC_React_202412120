import {
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { defaultLanguages } from "../../constants/defaultLanguages";
import { setIsFileExplorerChanged, setUserFiles } from "../../utils/fileSlice";
import { db } from "../../utils/firebase";
import {
  setLanguageId,
  setMonacoLanguage,
  setSourceCode,
} from "../../utils/ideSlice";

const FileEditModal = ({ setIsModalOpen }) => {
  const languages = useSelector((store) => store.languages);
  const user = useSelector((s) => s.user);
  const currentFile = useSelector((s) => s.file.currentFile);
  const selectedFileId = useSelector((s) => s.file.selectedFileId);
  //const languageId=useSelector(s=>s.ide.languageId)
  const [fileName, setFileName] = useState("");
  const [fileLanguageId, setFileLanguageId] = useState("");
  const isEditFile = useSelector((store) => store.file.isEditFile);

  const dispatch = useDispatch();

  const handleAddFile = async () => {
    try {
      console.log("Adding file:", { fileName, fileLanguageId, user: user?.uid });
      const filesRef = collection(db, "files");
      const defaultCode = defaultLanguages(+fileLanguageId);
      const defaultFileData = {
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        isDefault: false,
        languageId: fileLanguageId,
        name: fileName,
        sourceCode: defaultCode,
        userId: user.uid,
      };
      console.log("File data:", defaultFileData);
      await addDoc(filesRef, defaultFileData);
      console.log("File added successfully");
      dispatch(setIsFileExplorerChanged(true));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding file:", error);
      alert("Error creating file. Please try again.");
    }
  };

  const handleUpdateFile = async () => {
    try {
      const fileRef = doc(db, "files", selectedFileId);
      await updateDoc(fileRef, {
        name: fileName,
        languageId: fileLanguageId,
      });
      dispatch(setLanguageId(fileLanguageId));
      const mLanguage = languages.find(
        (lang) => lang.languageId == fileLanguageId
      );
      if (mLanguage) {
        dispatch(setMonacoLanguage(mLanguage.id));
      }
      const defaultSourceCode = defaultLanguages(+fileLanguageId);
      dispatch(setSourceCode(defaultSourceCode));
      const updatedSourceCode = async () => {
        await updateDoc(fileRef, { sourceCode: defaultSourceCode });
      };
      updatedSourceCode();
      dispatch(setUserFiles(null));
      dispatch(setIsFileExplorerChanged(true));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating file:", error);
      alert("Error updating file. Please try again.");
    }
  };

  useEffect(() => {
    if (!isEditFile) return;
    if (currentFile) {
      setFileName(currentFile.name);
      setFileLanguageId(currentFile.languageId);
    }
  }, [isEditFile, currentFile]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📄</span>
          <h2 className="text-xl font-bold text-secondary-900">
            {isEditFile ? "Edit File" : "Add New File"}
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              File Name
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter file name"
              value={fileName || ""}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Programming Language
            </label>
            <select
              className="input-field"
              value={fileLanguageId}
              onChange={(e) => setFileLanguageId(e.target.value)}
            >
              <option value="" disabled>
                Select programming language
              </option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.languageId}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="btn-secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          {!isEditFile ? (
            <button
              className="btn-primary"
              onClick={handleAddFile}
              disabled={!fileName || !fileLanguageId}
            >
              <span className="mr-2">➕</span>
              Add File
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleUpdateFile}
              disabled={!fileName || !fileLanguageId}
            >
              <span className="mr-2">💾</span>
              Update File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileEditModal;
