import React from "react";
import { Link } from "react-router-dom"; // Import Link
import MapComponent from "../components/MapComponent";
import RegisterPlant from "../components/RegisterPlant";
import UpdatePlant from "../components/UpdatePlant";
import DeletePlant from "../components/DeletePlant";

const HomeScreen = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Regional Map</h1>
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
      {/* <div className="mt-8 space-y-4">
        Optionally remove these components since you have separate routes now 
        <RegisterPlant />
        <UpdatePlant />
        <DeletePlant />
      </div> */}
    </div>
  );
};

export default HomeScreen;
