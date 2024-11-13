import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null); // State to store user's role

  // Ensure user stays logged in on page refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch and set user data including role
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData(data);
          setUserRole(data.role); // Set role from Firestore
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        setUserRole(null); // Clear role on logout
      }
    });
    return unsubscribe;
  }, []);

  const register = async (
    email,
    password,
    firstname,
    lastname,
    zone,
    phone,
    role = "Read User" // Default role set to "Read User"
  ) => {
    try {
      const phoneQuery = query(
        collection(db, "users"),
        where("phone", "==", phone)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!phoneSnapshot.empty) {
        throw new Error("Phone number is already in use");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        firstname,
        lastname,
        zone,
        phone,
        role, // Save role in Firestore
        uid: user.uid,
      });

      setCurrentUser(user);
    } catch (error) {
      console.error("Error during registration:", error);
      throw new Error(error.message);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch additional user details, including role
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setUserData(data);
        setUserRole(data.role); // Set role
      }

      setCurrentUser(user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      setUserRole(null); // Clear role on logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Role-based access control helpers
  const isReadUser = () => userRole === "Read User";
  const isZonalAdmin = () => userRole === "Zonal Admin";
  const isSuperAdmin = () => userRole === "Super Admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        userRole,
        login,
        register,
        logout,
        isReadUser,
        isZonalAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
