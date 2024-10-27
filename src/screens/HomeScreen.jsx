import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
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

      {/* Button Container */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 overflow-x-auto font-bold">
        {/* Replace buttons with Link components */}
        <Link to="/zone-wise-plant-details">
          <button className="bg-violet-500 m-3 p-3 hover:bg-violet-600 text-white rounded-xl min-w-[120px]">
            Zone Wise Plant Details
          </button>
        </Link>
        <Link to="/register-plant">
          <button className="bg-green-500 m-3 p-3 hover:bg-green-600 text-white rounded-xl min-w-[120px]">
            Register Plant
          </button>
        </Link>
        <Link to="/update-plant">
          <button className="bg-yellow-500 m-3 p-3 hover:bg-yellow-600 text-white rounded-xl min-w-[120px]">
            Update Plant
          </button>
        </Link>
        <Link to="/delete-plant">
          <button className="bg-red-500 m-3 p-3 hover:bg-red-600 text-white rounded-xl min-w-[120px]">
            Delete Plant
          </button>
        </Link>
      </div>

      {/* Map Component */}
      <div className="overflow-hidden md:overflow-auto">
        <MapComponent />
      </div>
    </div>
  );
};

export default HomeScreen;
