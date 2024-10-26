// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../services/firebaseConfig";
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
//       setUser(currentUser)
//     );
//     return unsubscribe;
//   }, []);

//   const login = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);
//   const register = (email, password) =>
//     createUserWithEmailAndPassword(auth, email, password);
//   const logout = () => signOut(auth);

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState } from "react";
import { auth } from "../services/firebaseConfig"; // Ensure this is correct
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setCurrentUser(userCredential.user); // Set the current user after registration
    } catch (error) {
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
      setCurrentUser(userCredential.user); // Set the current user after login
    } catch (error) {
      throw new Error(error.message); // Throw error to be caught in AuthScreen
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear current user on sign-out
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
