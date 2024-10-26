import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link
import MapComponent from "../components/MapComponent";

const HomeScreen = () => {
  const { username } = useAuth();

  useEffect(() => {
    if (username) {
      toast.info(`Welcome, ${username}!`);
    }
  }, [username]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
        Welcome to the Plant Tracker App
      </h1>
      <p className="text-md text-center text-gray-900 text-lg mb-8">
        Use this app to track, register, and update information on various
        plants around you.
      </p>
      <ToastContainer />
      <div className="flex justify-center gap-4 mb-8">
        {/* Replace buttons with Link components */}
        <Link to="/register-plant">
          <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">
            Register Plant
          </button>
        </Link>
        <Link to="/update-plant">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded">
            Update Plant
          </button>
        </Link>
        <Link to="/delete-plant">
          <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
            Delete Plant
          </button>
        </Link>
      </div>
      <MapComponent />
    </div>
  );
};

export default HomeScreen;
