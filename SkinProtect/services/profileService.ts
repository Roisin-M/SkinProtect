import { authInstance, db } from '../firebaseConfig';

export async function fetchUserProfile() {
  const user = authInstance.currentUser;
  if (!user) {
    return null; // not logged in
  }
  // user document from the "users" collection
  const snapshot = await db.collection('users').doc(user.uid).get();
  if (snapshot.exists) {
    return snapshot.data(); // { firstName, lastName, ... }
  }
  return null;
}

export async function updateUserSkinType(skinType: string) {
  const user = authInstance.currentUser;
  if (!user) {
    return null; // not logged in
  }
  // Update the "skinType" field 
  await db.collection('users').doc(user.uid).set(
    { skinType },
    { merge: true }
  );
  return null;
}
