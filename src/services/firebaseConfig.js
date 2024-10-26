// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFQM_3BOvqIfOOj8rkATHtIAGkYPkx3e8",
  authDomain: "plant-location-app.firebaseapp.com",
  projectId: "plant-location-app",
  storageBucket: "plant-location-app.appspot.com",
  messagingSenderId: "722633871659",
  appId: "1:722633871659:web:509df1ae3c59df4397756e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
