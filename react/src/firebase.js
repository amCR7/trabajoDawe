// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkLdxHJfOJ7DxFHJjxXLEb2wFRVbqdpn0",
  authDomain: "dawe-23f11.firebaseapp.com",
  projectId: "dawe-23f11",
  storageBucket: "dawe-23f11.firebasestorage.app",
  messagingSenderId: "952621644008",
  appId: "1:952621644008:web:484c882f3a5f39585a315d",
  measurementId: "G-F0Y76YXLEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)