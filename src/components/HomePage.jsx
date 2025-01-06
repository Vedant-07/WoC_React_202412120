import React from "react";
import Footer from "./Footer"
import {Link} from 'react-router'
const HomePage = () => {
  return (
    <>
    <div className="flex-grow text-center">
      <p>Home Page to be created later</p>
      <div className="flex gap-4 justify-center m-4 p-2">
        <button className="bg-slate-200 rounded-md m-4 p-2"><Link to="guest">Guest mode</Link></button>
        <button className="bg-slate-200 rounded-md m-4 p-2">
          Sign up here
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default HomePage;
