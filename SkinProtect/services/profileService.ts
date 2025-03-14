import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function fetchUserProfile() {
  const user = auth.currentUser;
  if (!user) {
    return null; // not logged in
  }
  const docRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data(); // { firstName, lastName, ... }
  }
  return null;
}

export async function updateUserSkinType(skinType: string){
  const user = auth.currentUser;
  if(!user){
    return null; // not logged in
  }
  const docRef = doc(db, 'users', user.uid);
  await setDoc(
    docRef, { skinType }, {merge:true} //update skintype field only
  );
  return null;
}