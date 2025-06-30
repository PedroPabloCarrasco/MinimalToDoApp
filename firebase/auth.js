// src/firebase/auth.js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "./config";

const auth = getAuth(initializeApp(firebaseConfig));

export const authService = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  getCurrentUser: () => auth.currentUser
};