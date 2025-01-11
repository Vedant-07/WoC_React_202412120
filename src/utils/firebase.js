// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "coderunner-ide.firebaseapp.com",
  projectId: "coderunner-ide",
  storageBucket: "coderunner-ide.firebasestorage.app",
  messagingSenderId: "796370051296",
  appId: "1:796370051296:web:2f303cc527ceb380a47085"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);