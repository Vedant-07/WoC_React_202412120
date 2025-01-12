import React from "react";
import { useNavigate } from "react-router";
import { auth, provider, signInWithPopup } from "../utils/firebase";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      navigate("/ide");
    } catch (error) {
      navigate("/signup");
      alert("Google Sign-In failed.");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center gap-2 mt-4 w-full px-4 py-2 bg-white text-black font-medium rounded-lg shadow hover:bg-blue-100 transition"
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="Google Logo"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLogin;
