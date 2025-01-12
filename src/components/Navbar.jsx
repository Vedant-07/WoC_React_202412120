import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const defaultUserImage =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="mx-auto bg-slate-500 p-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-white">IDE</h1>
        <div className="flex justify-around gap-4 rounded">
          {user ? (
            <div className="relative">
              <div className="flex items-center">
                <span className="text-white mr-3">
                  Welcome {user.displayName || "User"}
                </span>
                <button
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User Menu"
                >
                  <img
                    src={user.photoURL || defaultUserImage}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-10 w-32 bg-white text-black rounded-lg shadow-lg z-10"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <ul>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="bg-slate-300 p-2 rounded">
                <Link to="signup">Login</Link>
              </button>
              <button className="bg-slate-300 p-2 rounded">
                <Link to="ide">Explore</Link>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
