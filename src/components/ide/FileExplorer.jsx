import {
  collection,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentFile,
  setIsFileExplorerChanged,
  setSelectedFileId,
  setUserFiles,
  setIsEditFile,
  setOpenFileExplorer,
} from "../../utils/fileSlice";
import { auth } from "../../utils/firebase";
import FileEditModal from "./FileEditModal";
import { db } from "../../utils/firebase";
import { setMonacoLanguage } from "../../utils/ideSlice";

const FileExplorer = ({ isModalOpen, setIsModalOpen }) => {
  const user = useSelector((store) => store.user);
  const userFiles = useSelector((store) => store.file.userFiles);
  const selectedFileId = useSelector((store) => store.file.selectedFileId);
  const isFileExplorerChanged = useSelector(
    (s) => s.file.isFileExplorerChanged
  );
  const languages = useSelector((s) => s.languages);
  //const openFileExplorer = useSelector((s) => s.file.openFileExplorer);
  //const languageId = useSelector((s) => s.ide.languageId);
  const dispatch = useDispatch();

  const findExtension = (id) => {
    return languages.find((lang) => lang.languageId == id);
  };

  const getUserFiles = async () => {
    try {
      // Get the current authenticated user
      const currentUser = auth.currentUser;
      if (user) {
        const filesRef = collection(db, "files");
        const q = query(
          filesRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt")
        );

        const fileMetadata = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          fileMetadata.push({
            name: docData.name,
            languageId: docData.languageId,
            isDefault: docData.isDefault,
            fileId: doc.id,
          });
        });

        dispatch(setUserFiles(fileMetadata));
        dispatch(setIsFileExplorerChanged(false));
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error fetching user files:", error);
    }
  };

  useEffect(() => {
    getUserFiles();
  }, [isFileExplorerChanged,user]);

  //fetch the selectedFileId && fill up the current File
  const getCurrentFile = async (fileId) => { //cahggne fileId name to selectedFileId
    if (!user) return;//make changes here if requied
   
    const fileRef = doc(db, "files", fileId);
    const fileSnap = await getDoc(fileRef);
    if (!fileSnap.data()) return;
    const fileData = fileSnap.data();
    const serializableFileData = {
      ...fileData,
      createdAt: fileData.createdAt.toDate().toISOString(),
      updatedAt: fileData.updatedAt.toDate().toISOString(),
    };

    //set the monacoLanguage here // check this one out tooo
    const mLanguage = languages.find(
      (lang) => lang.languageId == fileData.languageId
    );
    if (mLanguage) {
      dispatch(setMonacoLanguage(mLanguage.id));
    }

    dispatch(setCurrentFile(serializableFileData));
  };

  useEffect(() => {
    if (!selectedFileId || !user) return;
  
    const updateAndFetchFile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (!userSnap.exists()) {
         
          //await setDoc(userRef, { lastActiveFile: selectedFileId }, { merge: true });
          return
        } else {
          await setDoc(userRef, { lastActiveFile: selectedFileId }, { merge: true });
        }
  
        await getCurrentFile(selectedFileId);
      } catch (error) {
        console.error("Error updating or fetching file:", error);
      }
    };
  
    updateAndFetchFile();
  }, [selectedFileId]);
  

  const handleEditButtonAction = (e) => {
    dispatch(setIsEditFile(true));
    setIsModalOpen(true);
  };

  const handleAddButtonAction = (e) => {
    //TODO:no change from this ------------ do something here
    //e.stopPropagation();
    dispatch(setIsEditFile(false));
    setIsModalOpen(true);
  };

  const handleDeleteButtonAction = async (fileId) => {
    try {
      const fileRef = doc(db, "files", fileId);
      //when the currentFile is deleted ,set the position to first file
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const lastActiveFile = userSnap.data()?.lastActiveFile;

      if (lastActiveFile == fileId) {
        const q = query(collection(db, "files"), where("isDefault", "==", true));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          const defaultFile = querySnapshot.docs[0]; // Get data from the first document
          await updateDoc(userRef, {
            lastActiveFile: defaultFile.id,
          });
          dispatch(setSelectedFileId(defaultFile.id));
        }
      }

      await deleteDoc(fileRef);
      dispatch(setIsFileExplorerChanged(true));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* File Explorer Header */}
      <div className="flex justify-between items-center p-4 border-b border-secondary-200 bg-secondary-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">📁</span>
          <h4 className="text-lg font-semibold text-secondary-900">Files</h4>
        </div>
        <div className="flex gap-2">
          <button 
            className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            onClick={handleAddButtonAction}
            title="Add New File"
          >
            <span className="text-lg">➕</span>
          </button>
          <button
            className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            onClick={() => dispatch(setOpenFileExplorer(false))}
            title="Close File Explorer"
          >
            <span className="text-lg">⏪</span>
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-grow overflow-y-auto">
        {userFiles && userFiles.length > 0 ? (
          <div className="p-2">
            {userFiles.map((file) => {
              const isSelected = file.fileId === selectedFileId;
              const extension = findExtension(file.languageId)?.extensions[0] || '';
              
              return (
                <div
                  className={`group flex items-center justify-between p-3 rounded-lg mb-1 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-primary-100 border border-primary-200 shadow-soft"
                      : "hover:bg-secondary-50 border border-transparent"
                  }`}
                  id={file.fileId}
                  key={file.fileId}
                  onClick={() => dispatch(setSelectedFileId(file.fileId))}
                >
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="text-lg">
                      {file.isDefault ? "⭐" : "📄"}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-secondary-900 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-secondary-500 font-mono">
                          {extension}
                        </span>
                      </div>
                      {file.isDefault && (
                        <div className="text-xs text-primary-600 font-medium">
                          Default
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-1.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditButtonAction(e);
                      }}
                      title="Edit File"
                    >
                      <span className="text-sm">⚙️</span>
                    </button>
                    {!file.isDefault && (
                      <button
                        className="p-1.5 text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteButtonAction(file.fileId);
                        }}
                        title="Delete File"
                      >
                        <span className="text-sm">🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No Files Yet
            </h3>
            <p className="text-secondary-600 mb-4">
              Create your first file to get started
            </p>
            <button
              className="btn-primary text-sm px-4 py-2"
              onClick={handleAddButtonAction}
            >
              <span className="mr-2">➕</span>
              Create File
            </button>
          </div>
        )}
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
