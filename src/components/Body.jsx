import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  Timestamp,
  getDoc,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import {
  setExpAndIdePanel,
  setOpenFileExplorer,
  setSelectedFileId,
} from "../utils/fileSlice";
import {
  setIdeAndIOPanel,
  setIOPanel,
  setShowIO,
  setTheme,
} from "../utils/ideSlice";

const Body = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  //TODO: a lot refactoring required here
  useEffect(() => {
    setLoading(true);

    const login = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const { uid, displayName, email, photoURL } = currentUser;
        dispatch(
          addUser({
            displayName,
            email,
            photoURL,
            uid,
          })
        );

        try {
          const userRef = doc(db, "users", currentUser.uid);

          const defaultUserData = {
            name: currentUser.displayName || "Anonymous",
            email: currentUser.email,
            settings: {
              theme: "vs-dark",
            },
            editorState: {
              //cursorPosition: { line: 0, column: 0 },
              //scrollPosition: { top: 0, left: 0 },
              expAndIdePanel: [20, 80],
              ideAndIOPanel: [70, 30],
              ioPanel: [50, 50],
              //splitSizes: [60, 40],
              openFileExplorer: true,
              showIO: true,
            },
            lastActiveFile: null,
          };

          const defaultFileData = {
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
            isDefault: true,
            languageId: 63,
            name: "default",
            sourceCode: "console.log('hi new user')",
            userId: currentUser.uid,
          };

          const filesRef = collection(db, "files");

          const userSnapshot = await getDoc(userRef);

          
          //no docs in the user
          if (!userSnapshot.exists()) {
            await setDoc(userRef, defaultUserData);

            const fileDocRef = await addDoc(filesRef, defaultFileData);
            // Update lastActiveFile in user data
           
           
            
            await updateDoc(
              userRef,
              { lastActiveFile: fileDocRef.id },
              { merge: true }
            );

            dispatch(setSelectedFileId(fileDocRef.id));
            dispatch(setTheme(defaultUserData.settings.theme));
            dispatch(
              setOpenFileExplorer(defaultUserData.editorState.openFileExplorer)
            );
            dispatch(setShowIO(defaultUserData.editorState.showIO));
            dispatch(
              setExpAndIdePanel(defaultUserData.editorState.expAndIdePanel)
            );
            dispatch(
              setIdeAndIOPanel(defaultUserData.editorState.ideAndIOPanel)
            );
            dispatch(setIOPanel(defaultUserData.editorState.ioPanel));
          } else {
            
            const userDataDoc = await getDoc(userRef);
            const userData = userDataDoc.data();
           
            dispatch(setSelectedFileId(userData.lastActiveFile));
            dispatch(setTheme(userData.settings.theme));
            dispatch(
              setOpenFileExplorer(userData.editorState.openFileExplorer)
            );
            dispatch(setShowIO(userData.editorState.showIO));
            dispatch(setExpAndIdePanel(userData.editorState.expAndIdePanel));
            dispatch(setIdeAndIOPanel(userData.editorState.ideAndIOPanel));
            dispatch(setIOPanel(userData.editorState.ioPanel));
          }
          //get the lastActiveFile from userRef
          // const userDataDoc = await getDoc(userRef);
          // const userData = userDataDoc.data();
          // dispatch(setSelectedFileId(userData.lastActiveFile));
          // dispatch(setTheme(userData.settings.theme));
          // dispatch(setOpenFileExplorer(userData.editorState.openFileExplorer));
          // dispatch(setShowIO(userData.editorState.showIO));
          // dispatch(setExpAndIdePanel(userData.editorState.expAndIdePanel));
          // dispatch(setIdeAndIOPanel(userData.editorState.ideAndIOPanel));
          // dispatch(setIOPanel(userData.editorState.ioPanel));
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      } else {
        dispatch(removeUser());
      }
      setLoading(false);
    });

    return () => login();
  }, [dispatch]);

  return (
    <>
      <div className="flex m-0 p-0 flex-col h-screen">
        <Navbar />
        {!loading ? (
          <Outlet />
        ) : (
          <div className="font-semibold text-xl text-center">
            loading please wait !!!
          </div>
        )}
      </div>
    </>
  );
};

export default Body;
