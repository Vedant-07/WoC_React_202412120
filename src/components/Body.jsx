import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { onAuthStateChanged } from "firebase/auth";

const Body = () => {
  const [loading, useLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    useLoading(true);
    const getUser = () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          const { accessToken, displayName, email, photoURL } = currentUser;
          dispatch(
            addUser({
              accessToken,
              displayName,
              email,
              photoURL,
            })
          );
        } else {
          dispatch(removeUser);
        }
        useLoading(false);
      });
    };

    return () => getUser();
  }, []);

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
