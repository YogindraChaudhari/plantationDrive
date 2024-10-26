// src/components/UpdatePlant.jsx
import React, { useState } from "react";
import { db } from "../services/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const UpdatePlant = () => {
  const [searchParams, setSearchParams] = useState({
    zone: "",
    plantNumber: "",
  });
  const [plantData, setPlantData] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});

  // Handle changes for searching a plant by zone and plant number
  const handleSearchInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // Handle changes for fields to be updated
  const handleUpdateInputChange = (e) => {
    setUpdatedFields({ ...updatedFields, [e.target.name]: e.target.value });
  };

  // Fetch the plant based on zone and plant number
  const fetchPlant = async () => {
    try {
      const plantRef = doc(
        db,
        "plants",
        `${searchParams.zone}-${searchParams.plantNumber}`
      );
      const plantDoc = await getDoc(plantRef);
      if (plantDoc.exists()) {
        setPlantData(plantDoc.data());
      } else {
        alert("Plant not found.");
      }
    } catch (error) {
      console.error("Error fetching plant:", error);
    }
  };

  // Update the specified fields of the plant
  const handleUpdate = async () => {
    try {
      const plantRef = doc(
        db,
        "plants",
        `${searchParams.zone}-${searchParams.plantNumber}`
      );
      await updateDoc(plantRef, updatedFields);
      alert("Plant updated successfully!");
    } catch (error) {
      console.error("Error updating plant:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Update Plant Information
        </h3>

        <input
          type="text"
          name="zone"
          placeholder="Zone"
          onChange={handleSearchInputChange}
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          name="plantNumber"
          placeholder="Plant Number"
          onChange={handleSearchInputChange}
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={fetchPlant}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        >
          Fetch Plant
        </button>

        {plantData && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="bg-gray-100 p-4 rounded-lg shadow-inner"
          >
            <input
              type="text"
              name="name"
              placeholder="Plant Name"
              defaultValue={plantData.name}
              onChange={handleUpdateInputChange}
              className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="type"
              placeholder="Plant Type"
              defaultValue={plantData.type}
              onChange={handleUpdateInputChange}
              className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="plantNumber"
              placeholder="Plant Number"
              value={plantData.plantNumber}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="height"
              placeholder="Height (in ft/cm)"
              value={plantData.height}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={plantData.latitude}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={plantData.longitude}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <select
              name="health"
              value={plantData.health}
              onChange={handleUpdateInputChange}
              className="p-2 border rounded"
            >
              <option value="good">Good</option>
              <option value="deceased">Deceased</option>
              <option value="infected">Infected</option>
            </select>
            <input
              type="text"
              name="zone"
              placeholder="Zone"
              value={plantData.zone}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="file"
              onChange={handleImageUpload}
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Update Plant
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePlant;
