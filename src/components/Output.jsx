import React from 'react'

const Output = () => {
  return (
    <div className="flex flex-grow h-full flex-col">
      <div className="flex justify-between items-center p-3">
        <h4 className="text-2xl font-bold">Output</h4>
        
        
      </div>
      <textarea
        name=""
        id=""
        className="flex-grow bg-gray-400 p-2"
        value={"here is the output"}
        //onChange={(e) => setFileContent(e.target.value)}
        disabled
      ></textarea>
    </div>
  )
}

export default Output