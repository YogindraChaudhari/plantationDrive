// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import AuthScreen from "./screens/AuthScreen";
// import HomeScreen from "./screens/HomeScreen";
// import "./App.css";
// import RegisterPlant from "./components/RegisterPlant";
// import DeletePlant from "./components/DeletePlant";
// import UpdatePlant from "./components/UpdatePlant";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/auth" element={<AuthScreen />} />

//           {/* Protected Routes */}
//           <Route
//             path="/"
//             element={
//               <PrivateRoute>
//                 <HomeScreen />
//               </PrivateRoute>
//             }
//           />
//           <Route path="/register-plant" element={<RegisterPlant />} />
//           <Route path="/update-plant" element={<UpdatePlant />} />
//           <Route path="/delete-plant" element={<DeletePlant />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// // PrivateRoute component to protect routes
// function PrivateRoute({ children }) {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/auth" />;
// }

// export default App;

// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import "./App.css";
import ZoneWisePlants from "./components/ZoneWisePlants";
import RegisterPlant from "./components/RegisterPlant";
import DeletePlant from "./components/DeletePlant";
import UpdatePlant from "./components/UpdatePlant";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/auth" && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthScreen />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomeScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/zone-wise-plant-details"
          element={
            <PrivateRoute>
              <ZoneWisePlants />
            </PrivateRoute>
          }
        />
        <Route
          path="/register-plant"
          element={
            <PrivateRoute>
              <RegisterPlant />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-plant"
          element={
            <PrivateRoute>
              <UpdatePlant />
            </PrivateRoute>
          }
        />
        <Route
          path="/delete-plant"
          element={
            <PrivateRoute>
              <DeletePlant />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/register-plant" element={<RegisterPlant />} />
        <Route path="/update-plant" element={<UpdatePlant />} />
        <Route path="/delete-plant" element={<DeletePlant />} /> */}
      </Routes>
    </>
  );
}

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
}

export default App;
