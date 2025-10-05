import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAV8N2Tt4NUw4uB1uzzsngux1RsCrPPRp4",
  authDomain: "nasa-buoy-project.firebaseapp.com",
  databaseURL: "https://nasa-buoy-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nasa-buoy-project",
  storageBucket: "nasa-buoy-project.firebasestorage.app",
  messagingSenderId: "648009839259",
  appId: "1:648009839259:web:a9159ef7a40d1d3bcd8c3e",
  measurementId: "G-RR4ZS7L3HV"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue };
