import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import Ide from "./Ide";

const CodeEditor = () => {
  const user = useSelector((store) => store.user);

  return (
    <>
      {user ? (
        <>
          <span>
            Something's cooking (file explorer) | till then use guest mode for
            ide
          </span>
        </>
      ) : (
        <>
          <Ide />
        </>
      )}
    </>
  );
};

export default CodeEditor;
