import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZvXEUs8FxgWQleCTNATYE0AVfbfst8Og",
  authDomain: "ifistocks.firebaseapp.com",
  projectId: "ifistocks",
  storageBucket: "ifistocks.appspot.com",
  messagingSenderId: "127944911194",
  appId: "1:127944911194:web:8cceab0baa221da4b42b63",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const firestore = getFirestore(app);
