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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              {isSignInPage ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-secondary-600">
              {isSignInPage 
                ? "Join thousands of developers worldwide" 
                : "Sign in to continue coding"
              }
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLoginAndSignUp}>
            {isSignInPage && (
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="userName"
                  placeholder="Enter your full name"
                  className="input-field"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="persist"
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                onChange={(e) => setPersist(e.target.checked)}
              />
              <label htmlFor="persist" className="ml-2 text-sm text-secondary-600">
                Keep me signed in
              </label>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                <p className="text-danger-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full btn-primary py-3 text-base font-medium ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignInPage ? "Creating Account..." : "Signing In..."}
                </div>
              ) : (
                <>
                  {isSignInPage ? "Create Account" : "Sign In"}
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">Or continue with</span>
              </div>
            </div>

            <GoogleLogin />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              {!isSignInPage ? "Don't have an account?" : "Already have an account?"}
              <button
                className="ml-1 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                onClick={() => setIsSignInPage((val) => !val)}
              >
                {isSignInPage ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
