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
    dispatch(setMonacoLanguage(mLanguage.id));

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
    const fileRef = doc(db, "files", fileId);
    //when the currentFile is deleted ,set the position to first file
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const lastActiveFile = userSnap.data().lastActiveFile;

    if (lastActiveFile == fileId) {
      const q = query(collection(db, "files"), where("isDefault", "==", true));
      const querySnapshot = await getDocs(q);
      const defaultFile = querySnapshot.docs[0]; // Get data from the first document
      await updateDoc(userRef, {
        lastActiveFile: defaultFile.id,
      });
      dispatch(setSelectedFileId(defaultFile.id));
    }

    await deleteDoc(fileRef);

    dispatch(setIsFileExplorerChanged(true));
  };

  return (
    <div>
      {/* File Explorer Header */}
      <div className="flex justify-between p-3 items-center bg-slate-400">
        <h4>FileExplorer</h4>
        <div className="flex gap-2">
          <button className="" onClick={handleAddButtonAction}>
            {`➕`}
          </button>
          <button
            className=""
            onClick={() => dispatch(setOpenFileExplorer(false))}
          >
            {`⏪`}
          </button>
        </div>
      </div>

      <div>
        {userFiles &&
          userFiles.map((file) => {
            return (
              <div
                className={`p-1 m-1 flex items-center justify-between ${
                  file.fileId === selectedFileId
                    ? "bg-slate-300"
                    : "bg-slate-100"
                } `}
                id={file.fileId}
                key={file.fileId}
                onClick={() => dispatch(setSelectedFileId(file.fileId))}
              >
                <div className="flex items-center gap-1 flex-grow min-w-0">
                  <div>{`📄`}</div>
                  <div
                    className={`truncate text-left max-w-full overflow-hidden `}
                    title={file.name}
                  >
                    {file.name}
                    {findExtension(file.languageId).extensions[0]}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => handleEditButtonAction(e)}
                  >{`⚙️`}</button>
                  {!file.isDefault && (
                    <button
                      onClick={() => handleDeleteButtonAction(file.fileId)}
                    >{`🗑️`}</button>
                  )}
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
