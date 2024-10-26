import React, { useState } from "react";
import { db } from "../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UpdatePlant = () => {
  const [searchParams, setSearchParams] = useState({
    zone: "",
    plantNumber: "",
  });
  const [plantData, setPlantData] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [image, setImage] = useState(null); // State to hold the uploaded image

  const handleSearchInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields({ ...updatedFields, [name]: value });
    setPlantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const fetchPlant = async () => {
    console.log(
      "Searching for plant with Zone:",
      searchParams.zone,
      "and Plant Number:",
      searchParams.plantNumber
    );

    try {
      // Query the collection to find a document with matching zone and plantNumber fields
      const plantsRef = collection(db, "plants");
      const plantQuery = query(
        plantsRef,
        where("zone", "==", searchParams.zone),
        where("plantNumber", "==", searchParams.plantNumber)
      );

      const querySnapshot = await getDocs(plantQuery);
      if (!querySnapshot.empty) {
        // Assuming there is only one matching document
        const plantDoc = querySnapshot.docs[0];
        console.log("Plant data fetched:", plantDoc.data()); // Log fetched data
        setPlantData(plantDoc.data());
      } else {
        console.warn("No plant found with the provided zone and plant number.");
        alert("Plant not found.");
      }
    } catch (error) {
      console.error("Error fetching plant:", error);
      alert("Error fetching plant. Please check the console for details.");
    }
  };

  const handleUpdate = async () => {
    try {
      const plantRef = doc(
        db,
        "plants",
        `${searchParams.zone}-${searchParams.plantNumber}`
      );

      // Update plant data in Firestore
      await updateDoc(plantRef, updatedFields);

      // Handle image upload if an image is provided
      if (image) {
        const imageRef = ref(storage, `plants/${plantRef.id}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        await updateDoc(plantRef, { imageUrl });
      }

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
              name="plantNumber"
              placeholder="Plant Number"
              value={plantData.plantNumber}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
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
              name="height"
              placeholder="Height (in ft/cm)"
              value={plantData.height}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={plantData.latitude}
              onChange={handleUpdateInputChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
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
