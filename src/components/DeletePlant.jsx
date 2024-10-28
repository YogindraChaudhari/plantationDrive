import React, { useState } from "react";
import { db, storage } from "../services/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeletePlant = ({ onDeleteSuccess }) => {
  const [zone, setZone] = useState("");
  const [plantNumber, setPlantNumber] = useState("");
  const [plantName, setPlantName] = useState("");

  const handleDelete = async () => {
    const plantId = `${zone}-${plantNumber}`;
    const plantRef = doc(db, "plants", plantId);
    try {
      // Check if the plant document exists
      const plantDoc = await getDoc(plantRef);
      if (!plantDoc.exists()) {
        toast.error("Plant not found. Please check the zone and plant number.");
        return;
      }

      // Reference to the plant image in storage
      const imageRef = ref(storage, `plants/${plantId}`);
      await deleteObject(imageRef).catch((error) =>
        console.warn("No image to delete:", error)
      );

      // Delete plant document from Firestore
      await deleteDoc(plantRef);
      toast.success("Plant deleted successfully!");
      onDeleteSuccess(); // Trigger update on success
    } catch (error) {
      console.error("Error deleting plant:", error);
      toast.error("Failed to delete plant.");
      toast.error("Please check details again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-green-400 to-white-200 p-6">
      <div className="w-full max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-2xl font-bold mb-4 text-center">
          Delete Plant Information
        </h3>
        <div>
          <label className="block text-gray-600 font-medium">Zone</label>
          <input
            type="text"
            placeholder="Zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">
            Plant Number
          </label>
          <input
            type="text"
            placeholder="Plant Number"
            value={plantNumber}
            onChange={(e) => setPlantNumber(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Plant Name</label>
          <input
            type="text"
            placeholder="Plant Name"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <button
          onClick={handleDelete}
          className="w-full py-3 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete Plant
        </button>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default DeletePlant;
