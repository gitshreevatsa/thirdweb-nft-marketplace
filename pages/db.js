// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmYZGriBmc6TiWGx-IJsronporMjJ5nkw",
  authDomain: "nreft-mvp.firebaseapp.com",
  projectId: "nreft-mvp",
  storageBucket: "nreft-mvp.appspot.com",
  messagingSenderId: "1067953501884",
  appId: "1:1067953501884:web:bbd4be1de07f16b91cc2b9",
  measurementId: "G-FZRSTB7VTD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
