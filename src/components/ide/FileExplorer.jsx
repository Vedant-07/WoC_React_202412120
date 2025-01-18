import { collection, getDoc ,doc,query, where, getDocs, orderBy, deleteDoc} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentFile, setIsFileExplorerChanged, setSelectedFileId, setUserFiles,setIsEditFile } from "../../utils/fileSlice";
import { auth } from "../../utils/firebase";
import FileEditModal from "./FileEditModal";
import { db } from "../../utils/firebase";

const FileExplorer = ({
  setOpenExplorer,
  
  handleSelectedFileId,
  isModalOpen,
  setIsModalOpen,
  handleUpdate,
}) => {
  const user=useSelector(store=>store.user)
  const userFiles = useSelector((store) => store.file.userFiles);
  const selectedFileId = useSelector((store) => store.file.selectedFileId);
  const isFileExplorerChanged=useSelector(s=>s.file.isFileExplorerChanged)
  const languages=useSelector(s=>s.languages)

  const dispatch =useDispatch()

  const findExtension=(id)=>{
     return languages.find(lang=>lang.languageId==id)
  }


  const getUserFiles = async () => {
    try {
      // Get the current authenticated user
      const currentUser = auth.currentUser;
      if (user ) {
        // Get the user ID
  
        // Fetch files associated with the user ID
        const filesRef = collection(db, "files");
        const q = query(filesRef, where("userId", "==", currentUser.uid),orderBy("createdAt"));
        

        const fileMetadata = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const docData=doc.data()
          fileMetadata.push({
            name:docData.name,
            languageId:docData.languageId,
            isDefault:docData.isDefault,
            fileId:doc.id
          })
        });

        dispatch(setUserFiles(fileMetadata))
        dispatch(setIsFileExplorerChanged(false))
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error fetching user files:", error);
    }
  };
  
  useEffect(() => {
    getUserFiles();
  }, [isFileExplorerChanged]);

  //fetch the selectedFileId && filll up the current File
  const getCurrentFile = async (fileId) => {
    
    if(!user)return
    const fileRef = doc(db, "files", fileId);
    const fileSnap = await getDoc(fileRef);

    const fileData = fileSnap.data();
    const serializableFileData = {
      ...fileData,
      createdAt: fileData.createdAt.toDate().toISOString(),
      updatedAt: fileData.updatedAt.toDate().toISOString(),
    };

    dispatch(setCurrentFile(serializableFileData))
  };

  useEffect(() => {
    //TODO: problem here .....
    if (!selectedFileId) return;
    getCurrentFile(selectedFileId);
  }, [selectedFileId]);

  const handleEditButtonAction=(e)=>{
     dispatch(setIsEditFile(true))
     setIsModalOpen(true)
  }

  const handleAddButtonAction=(e)=>{
    //TODO:no change from this ------------ do something here
    e.stopPropagation()
    dispatch(setIsEditFile(false))
    setIsModalOpen(true)
  }

  const handleDeleteButtonAction=async(fileId)=>{
  
    const fileRef=doc(db,"files",fileId)
    await deleteDoc(fileRef)
    dispatch(setIsFileExplorerChanged(true))
  }

  return (
    <div>
      {/* File Explorer Header */}
      <div className="flex justify-between p-3 items-center bg-slate-400">
        <h4>FileExplorer</h4>
        <div className="flex gap-2">
          <button className="" onClick={handleAddButtonAction}>
            {`➕`}
          </button>
          <button className="" onClick={() => setOpenExplorer((val) => !val)}>
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
                  file.fileId === selectedFileId ? "bg-slate-300" : "bg-slate-100"
                } `}
                id={file.fileId}
                key={file.fileId}
                onClick={()=>dispatch(setSelectedFileId(file.fileId))}
              >
                <div className="flex items-center gap-1 flex-grow min-w-0">
                  <div>{`📄`}</div>
                  <div
                    className={`truncate text-left max-w-full overflow-hidden `}
                    title={file.name}
                  >
                    {file.name}{findExtension(file.languageId).extensions[0]}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={(e)=>handleEditButtonAction(e)}>{`⚙️`}</button>
                  { !file.isDefault && <button onClick={()=>handleDeleteButtonAction(file.fileId)}>{`🗑️`}</button> }
                  
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
