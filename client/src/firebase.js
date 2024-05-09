// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "mern-blog-1cd21.firebaseapp.com",
  projectId: "mern-blog-1cd21",
  storageBucket: "mern-blog-1cd21.appspot.com",
  messagingSenderId: "824196064479",
  appId: "1:824196064479:web:4c548b4a52f25e743ff56a",
  measurementId: "G-6NG97KMV9D",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
