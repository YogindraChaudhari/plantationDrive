import { db, auth } from "./firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

const usersCollection = collection(db, "users");

// Fetch all users
export const getUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add or update a user
// export const addUser = async (userData) => {
//   const userRef = doc(usersCollection, userData.id);
//   await setDoc(userRef, userData, { merge: true });
// };
export const updateUser = async (updatedUser) => {
  try {
    const userRef = doc(db, "users", updatedUser.id); // Refer to the user's document by ID
    await updateDoc(userRef, {
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      phone: updatedUser.phone,
      zone: updatedUser.zone,
      role: updatedUser.role,
    });
    console.log("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  await deleteDoc(doc(usersCollection, id));
};

// Regenerate password - send password reset email
export const regeneratePassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
