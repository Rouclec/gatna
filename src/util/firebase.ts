// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_qJZ99cQ6TkU0NDwUBuMjuKjrQEHTM3o",
  authDomain: "omala-ebdba.firebaseapp.com",
  projectId: "omala-ebdba",
  storageBucket: "omala-ebdba.firebasestorage.app",
  messagingSenderId: "293110362111",
  appId: "1:293110362111:web:f3718b942153d68b0ac1ca",
  measurementId: "G-C2ZE3B3HEJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// getAnalytics(app);
export const storage = getStorage(app);
