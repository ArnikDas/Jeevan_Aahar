// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwJTQbfh_Ve8IgYFVd82FWIECgsG_Ht8g",
  authDomain: "jeevan-aahar-auth.firebaseapp.com",
  projectId: "jeevan-aahar-auth",
  storageBucket: "jeevan-aahar-auth.firebasestorage.app",
  messagingSenderId: "1012982358474",
  appId: "1:1012982358474:web:e848bef6481637cb85af33",
  measurementId: "G-M9QY5NQFC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);