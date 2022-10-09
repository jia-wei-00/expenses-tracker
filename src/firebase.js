// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3_23A1aqOsnZ2l1rMvzI8nKUQxyHVqS4",
  authDomain: "expense-tracker-b15e6.firebaseapp.com",
  projectId: "expense-tracker-b15e6",
  storageBucket: "expense-tracker-b15e6.appspot.com",
  messagingSenderId: "638503103605",
  appId: "1:638503103605:web:931343e920da1f56745c3c",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const fieldValue = firebase.firestore.FieldValue;

export { auth, fieldValue };
export default db;
