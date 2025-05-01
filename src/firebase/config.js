// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0E40Wi-FxF2RRnJDD4Hjx5MMqdrPO9V8",
  authDomain: "paninigo-653ec.firebaseapp.com",
  projectId: "paninigo-653ec",
  storageBucket: "paninigo-653ec.firebasestorage.app",
  messagingSenderId: "600822998901",
  appId: "1:600822998901:web:639675d019a630a864953c",
  measurementId: "G-M7V64KNVWM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, auth };