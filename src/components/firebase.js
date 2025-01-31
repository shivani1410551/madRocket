import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbvMT6WFyg36VwdqGpegOuRbUEWLpLg1w",
  authDomain: "madrocket-58310.firebaseapp.com",
  projectId: "madrocket-58310",
  storageBucket: "madrocket-58310.firebasestorage.app",
  messagingSenderId: "997709677005",
  appId: "1:997709677005:web:ee09483d493d371284c484"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app,db };
