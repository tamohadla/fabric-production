// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// إعدادات مشروعك في Firebase (من لوحة التحكم)
const firebaseConfig = {
  apiKey: "AIzaSyDMd28vdw3gk0Hy3x1pT0122L6FVAQHZg",
  authDomain: "adlatex-fabricproduction.firebaseapp.com",
  projectId: "adlatex-fabricproduction",
  storageBucket: "adlatex-fabricproduction.firebasestorage.app",
  messagingSenderId: "751924462984",
  appId: "1:751924462984:web:3115d1888f05fe8e83e63d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
