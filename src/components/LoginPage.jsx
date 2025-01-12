import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { auth } from "../utils/firebase";
import GoogleLogin from "./GoogleLogin";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignInPage, setIsSignInPage] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [persist, setPersist] = useState(false);

  useEffect(() => {
    if (user) navigate("/ide");
  }, []);

  const handleLoginAndSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      setPersistence(
        auth,
        persist ? browserLocalPersistence : browserSessionPersistence
      );

      if (isSignInPage) {
        await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(auth.currentUser, {
          displayName: userName,
        });

        navigate("ide");
      } else {
        await signInWithEmailAndPassword(auth, email, password);

        navigate("/ide");
      }
    } catch (err) {
      setError(err.message);
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 ">
        <h2 className="text-2xl font-bold text-center text-black">
          {isSignInPage ? "Sign up" : "Login"}
        </h2>
        <form className="mt-6" onSubmit={handleLoginAndSignUp}>
          {isSignInPage && (
            <div className="mb-4">
              <label htmlFor="userName">User Name</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your user name"
                className="w-full mt-1 px-4 py-2 rounded-lg  bg-gray-100"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 rounded-lg  bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="mr-1 w-4 h-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600"
              onChange={(e) => setPersist(e.target.checked)}
            />
            <label>Keep me signed in</label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mt-6">
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {isSignInPage ? (
                <>{loading ? "Signing up..." : "Sign up"}</>
              ) : (
                <>{loading ? "Logging in..." : "Login"}</>
              )}
            </button>

            <p className="text-md text-center m-2 font-bold">OR</p>

            <GoogleLogin />
          </div>
        </form>
        <div className="flex mt-6 justify-center text-sm text-gray-600">
          {!isSignInPage
            ? "Don't have an account?"
            : "Already have an account! "}
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => setIsSignInPage((val) => !val)}
          >
            {isSignInPage ? "Login" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
