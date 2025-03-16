import { authInstance, db } from "../firebaseConfig";
//import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
//import { doc, setDoc } from "firebase/firestore";

// Register a new user
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await authInstance.createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign Up with Custom Fields
export const signUpWithProfile = async (email: string, password: string,
  firstName: string, lastName: string ) => {
    try{
      //create user 
      const userCred = await authInstance.createUserWithEmailAndPassword(
        email, password);
        const user = userCred.user;
      //writing extra fields to firestore db
      await db.collection("users").doc(user.uid).set({
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      });
      return user;
    }catch (error){
      throw error;
    }
  };

// Login user
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await authInstance.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logOut = async () => {
  try {
    await authInstance.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

