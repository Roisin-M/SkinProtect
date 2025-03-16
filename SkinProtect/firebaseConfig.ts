// import { initializeApp } from "firebase/app";
// import {getAuth} from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import firebase  from "@react-native-firebase/app";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAM8M3_mRdA3pO0zVn2_VpfISbDh1tM9FY",
  authDomain: "skinprotectproject300.firebaseapp.com",
  projectId: "skinprotectproject300",
  storageBucket: "skinprotectproject300.firebasestorage.app",
  messagingSenderId: "520853668992",
  appId: "1:520853668992:web:d058396081cde47f5e1265",
  databaseURL: "https://skinprotectproject300-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const authInstance = auth();
export const db = firestore();
//const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
//export database
//export const db = getFirestore(app);