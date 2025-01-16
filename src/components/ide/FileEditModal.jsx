import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFileName,setFileLanguageId,setIsHandleAddFile,setIsHandleUpdateFile } from '../../utils/fileSlice'

const FileEditModal = ({ setIsModalOpen,file}) => {
  const languages=useSelector(store=>store.languages)
  const fileName=useSelector(store=>store.file.fileName)
  const fileLanguageId=useSelector(store=>store.file.fileLanguageId)
  const isEditFile=useSelector(store=>store.file.isEditFile)
  const dispatch=useDispatch()
  console.log("in fileEdiModal "+fileLanguageId)
  console.log("in fileModal "+fileName);
  
  //make a temporary state to store fileName and fileType  && when clicked on button dispatch action to update fileName & fileType 

  return (
    <div>
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 "
        >
          <div className="bg-slate-100 rounded p-5 w-96 shadow-lg mb-48">
            <h2 className="text-xl font-bold mb-4">Add New File</h2>
            <div className="mb-3">
              <label className="block font-semibold mb-1">File Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter file name"
                value={fileName || ""}
                onChange={(e) => dispatch(setFileName(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">File Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={fileLanguageId}
                onChange={(e) => dispatch(setFileLanguageId(e.target.value))}
              >
                <option value="" disabled>
                  Select file type
                </option>
                {
                  languages.map((lang)=>{
                    return (
                      <option key={lang.id} value={lang.languageId}>{lang.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              {!isEditFile?<>
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={()=> dispatch(setIsHandleAddFile(true)) }
                disabled={!fileName || !fileLanguageId}
              >
                Add File
              </button>
              </>:
              <>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={()=>dispatch(setIsHandleUpdateFile(true))}
                disabled={!fileName || !fileLanguageId}
              >
                Update File
              </button>
              </>}
              
            </div>
          </div>
        </div>
    </div>
  )
}

export default FileEditModal