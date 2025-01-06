import React from "react";
import HomePage from "./HomePage";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

const Body = () => {
  return (
    <>
      <div className="flex m-0 p-0 flex-col h-screen">
        <Navbar />
        <Outlet/>
      </div>
    </>
  );
};

export default Body;
