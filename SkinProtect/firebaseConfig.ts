import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAM8M3_mRdA3pO0zVn2_VpfISbDh1tM9FY",
  authDomain: "skinprotectproject300.firebaseapp.com",
  projectId: "skinprotectproject300",
  storageBucket: "skinprotectproject300.firebasestorage.app",
  messagingSenderId: "520853668992",
  appId: "1:520853668992:web:d058396081cde47f5e1265"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);