import React, { useState } from "react";
import { db } from "../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDoc, getDocs } from "firebase/firestore";

const UpdatePlant = () => {
  const [searchParams, setSearchParams] = useState({
    zone: "",
    plantNumber: "",
  });
  const [plantData, setPlantData] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [fileName, setFileName] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields({ ...updatedFields, [name]: value });
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const fetchPlant = async () => {
    console.log(
      "Searching for plant with Zone:",
      searchParams.zone,
      "and Plant Number:",
      searchParams.plantNumber
    );

    try {
      const plantsRef = collection(db, "plants");
      const plantQuery = query(
        plantsRef,
        where("zone", "==", searchParams.zone),
        where("plantNumber", "==", searchParams.plantNumber)
      );

      const querySnapshot = await getDocs(plantQuery);
      if (!querySnapshot.empty) {
        const plantDoc = querySnapshot.docs[0];
        console.log("Plant data fetched:", plantDoc.data());
        setPlantData(plantDoc.data());
        setUpdatedFields(plantDoc.data()); // Populate updatedFields with the fetched data
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
    if (!plantData) return; // Early exit if plantData is null

    const zone = searchParams.zone.trim();
    const plantNumber = searchParams.plantNumber.trim();

    const plantRef = doc(db, "plants", `${zone}-${plantNumber}`);

    console.log("Zone:", zone);
    console.log("Plant Number:", plantNumber);
    console.log("Plant reference ID:", `${zone}-${plantNumber}`);

    try {
      // Check if the document exists
      const docSnap = await getDoc(plantRef);
      if (!docSnap.exists()) {
        alert("Document does not exist!");
        console.error("No document found with ID:", `${zone}-${plantNumber}`);
        return; // Exit if the document does not exist
      }

      console.log("Updating plant with data:", {
        ...plantData,
        ...updatedFields,
      });

      await updateDoc(plantRef, { ...plantData, ...updatedFields });

      alert("Plant updated successfully!");
      setPlantData(null); // Reset the plantData after update
      setUpdatedFields({}); // Reset updatedFields after update
    } catch (error) {
      console.error("Error updating plant:", error);
      alert("Error updating plant. Please check the console for details.");
    }
  };

  // const handleUpdate = async () => {
  //   if (!plantData) return; // Early exit if plantData is null

  //   try {
  //     const plantRef = doc(
  //       db,
  //       "plants",
  //       `${searchParams.zone}-${searchParams.plantNumber}`
  //     );

  //     console.log("Updating plant with data:", {
  //       ...plantData,
  //       ...updatedFields,
  //     });

  //     await updateDoc(plantRef, { ...plantData, ...updatedFields });

  //     alert("Plant updated successfully!");
  //     setPlantData(null); // Reset the plantData after update
  //     setUpdatedFields({}); // Reset updatedFields after update
  //   } catch (error) {
  //     console.error("Error updating plant:", error);
  //     alert("Error updating plant. Please check the console for details.");
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Update Plant Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Zone</label>
            <input
              type="text"
              name="zone"
              placeholder="Zone"
              onChange={handleSearchInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Plant Number
            </label>
            <input
              type="text"
              name="plantNumber"
              placeholder="Plant Number"
              onChange={handleSearchInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={fetchPlant}
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Fetch Plant
          </button>
        </div>

        {plantData && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-gray-600">
                Plant Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Plant Name"
                value={updatedFields.name || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Plant Number
              </label>
              <input
                type="text"
                name="plantNumber"
                placeholder="Plant Number"
                value={updatedFields.plantNumber || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Plant Type
              </label>
              <input
                type="text"
                name="type"
                placeholder="Plant Type"
                value={updatedFields.type || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Height (ft/cm)
              </label>
              <input
                type="text"
                name="height"
                placeholder="Height"
                value={updatedFields.height || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={updatedFields.latitude || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={updatedFields.longitude || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Health
              </label>
              <select
                name="health"
                value={updatedFields.health || "good"}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="good">Good</option>
                <option value="deceased">Deceased</option>
                <option value="infected">Infected</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Zone</label>
              <input
                type="text"
                name="zone"
                placeholder="Zone"
                value={updatedFields.zone || ""}
                onChange={handleUpdateInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">
                Upload Image
              </label>
              <div className="relative mt-1">
                <input
                  type="file"
                  onChange={handleUpdateInputChange}
                  id="file-upload"
                  className="sr-only" // Hides the default file input
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full p-2 text-center bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Choose File
                </label>
                <span
                  id="file-chosen"
                  className="mt-2 block text-sm text-gray-500"
                >
                  {fileName ? fileName : "No file chosen"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 mt-4"
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
