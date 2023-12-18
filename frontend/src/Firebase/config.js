// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUOlXHuDkzsnwlJs4h9SbxtlxHZYL5B8k",
  authDomain: "forusdb.firebaseapp.com",
  projectId: "forusdb",
  storageBucket: "forusdb.appspot.com",
  messagingSenderId: "157701262668",
  appId: "1:157701262668:web:1718e78d062e0dd48613e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export {storage};
