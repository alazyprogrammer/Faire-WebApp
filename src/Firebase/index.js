// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKCm4i76T3i2VF-vFpEUcaHPvzVBjAaho",
  authDomain: "faire-task-list.firebaseapp.com",
  projectId: "faire-task-list",
  storageBucket: "faire-task-list.appspot.com",
  messagingSenderId: "952923335372",
  appId: "1:952923335372:web:2242afe946dd56cd1af069",
  measurementId: "G-CNF2EVPER1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };