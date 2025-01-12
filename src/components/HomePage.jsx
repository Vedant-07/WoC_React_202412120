import React from "react";
import Footer from "./Footer";
import { Link } from "react-router";
import { useSelector } from "react-redux";
const HomePage = () => {
  const user = useSelector((store) => store.user);

  return (
    <>
      <div className="flex-grow text-center">
        <div className="items-center mt-10">
          <span>Home Page to be created later . </span> <br />
          <span>
            {!user
              ? "You are currently in guest mode"
              : `You have signed in ${user.displayName},Checkout the cool features`}
          </span>{" "}
        </div>

        <div className="flex gap-4 justify-center m-4 p-2">
          {user ? (
            <>
              <button className="bg-slate-200 rounded-md m-4 p-2">
                <Link to="ide"> Explore IDE </Link>
              </button>
            </>
          ) : (
            <>
              <button className="bg-slate-200 rounded-md m-4 p-2">
                <Link to="ide">Guest mode</Link>
              </button>
              <button className="bg-slate-200 rounded-md m-4 p-2">
                <Link to="signup">Login / Sign-Up here</Link>
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
