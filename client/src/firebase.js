// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b0904.firebaseapp.com",
  projectId: "mern-estate-b0904",
  storageBucket: "mern-estate-b0904.appspot.com",
  messagingSenderId: "83517627578",
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);