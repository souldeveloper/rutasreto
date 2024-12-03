// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDngOGHhgAMIR976_BdkZVRhEA2wzcCNyc",
  authDomain: "rutasretoapp.firebaseapp.com",
  projectId: "rutasretoapp",
  storageBucket: "rutasretoapp.firebasestorage.app",
  messagingSenderId: "629462850294",
  appId: "1:629462850294:web:4fd7cd93e466d1f1f0ead7",
  measurementId: "G-5YG2020RDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);