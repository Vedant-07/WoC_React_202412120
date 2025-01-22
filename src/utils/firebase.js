// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const provider = new GoogleAuthProvider();
// TODO: refactor here
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "coderunner-ide.firebaseapp.com",
  projectId: "coderunner-ide",
  storageBucket: "coderunner-ide.firebasestorage.app",
  messagingSenderId: "796370051296",
  appId: "1:796370051296:web:2f303cc527ceb380a47085",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
