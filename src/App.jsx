// import dotenv from "dotenv";
// dotenv.config();
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
import MapComponent from "./components/MapComponent";
import PlantDetailsPage from "./components/PlantDetailsPage";
import SpecificPlant from "./components/SpecificPlant";
import AttendancePage from "./components/AttendancePage";
// import UserManagementPage from "./components/UserManagementPage";

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
          path="/attendance"
          element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserManagementPage />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/zone-wise-plant-details"
          element={
            <PrivateRoute>
              <ZoneWisePlants />
            </PrivateRoute>
          }
        />
        <Route
          path="/map"
          element={
            <PrivateRoute>
              <MapComponent />
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
        <Route
          path="/plant-details"
          element={
            <PrivateRoute>
              <PlantDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/specific-plant/:id"
          element={
            <PrivateRoute>
              <SpecificPlant />
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
