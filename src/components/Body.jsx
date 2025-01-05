import React from "react";
import Footer from "./Footer";
import HomePage from "./HomePage";
import Navbar from "./Navbar";

const Body = () => {
  return (
    <>
      <div className="flex m-0 p-0 flex-col h-screen">
        <Navbar />
        <HomePage/>
        <Footer />
      </div>
    </>
  );
};

export default Body;
