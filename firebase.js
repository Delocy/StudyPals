// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAae5wIuRN8tuqvKTbwJJDWOCDFutgF2M0",
  authDomain: "studypals-auth.firebaseapp.com",
  projectId: "studypals-auth",
  storageBucket: "studypals-auth.appspot.com",
  messagingSenderId: "848602608150",
  appId: "1:848602608150:web:214341bebeac9aea74fb37",
  measurementId: "G-C13G3L9F88"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore, firebase};

