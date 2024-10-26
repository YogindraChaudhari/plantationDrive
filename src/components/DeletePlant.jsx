// DeletePlant.jsx
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
    try {
      const plantId = `${zone}-${plantNumber}`;
      const plantRef = doc(db, "plants", plantId);

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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Delete Plant Information
        </h3>
        <input
          type="text"
          placeholder="Zone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Plant Number"
          value={plantNumber}
          onChange={(e) => setPlantNumber(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Plant Name"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleDelete}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete Plant
        </button>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default DeletePlant;
