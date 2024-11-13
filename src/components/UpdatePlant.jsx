import { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const UpdatePlant = () => {
  const [searchParams, setSearchParams] = useState({
    zone: "",
    plantNumber: "",
  });
  const [plantData, setPlantData] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [fileName, setFileName] = useState("");
  const [plantDocId, setPlantDocId] = useState("");

  useEffect(() => {
    // Display a pop-up notification before the form is filled
    toast.info("Please ensure all the fields are correct before fetching.");
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields({ ...updatedFields, [name]: value });
  };

  const location = useLocation();
  const { zone, plantNumber } = location.state || { zone: "", plantNumber: "" };

  useEffect(() => {
    setSearchParams({ zone, plantNumber }); // Set initial search params to pre-fill inputs
  }, [zone, plantNumber]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleRadioChange = (name, value) => {
    setUpdatedFields({ ...updatedFields, [name]: value });
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
        // console.log("Plant data fetched:", plantDoc.data());
        toast.success("Plant data fetched successfully");
        setPlantData(plantDoc.data());
        setUpdatedFields(plantDoc.data()); // Populate updatedFields with the fetched data
        setPlantDocId(plantDoc.id); // Save the document ID
      } else {
        console.warn("No plant found with the provided zone and plant number.");
        toast.error("Plant not found."); // Show error toast
      }
    } catch (error) {
      console.error("Error fetching plant:", error);
      toast.error(
        "Error fetching plant. Please check the console for details."
      ); // Show error toast
    }
  };

  const handleUpdate = async () => {
    if (!plantData || !plantDocId) return;

    const plantRef = doc(db, "plants", plantDocId); // Use the stored document ID
    const storage = getStorage();
    const oldImageRef = ref(storage, `plants/${plantDocId}`);
    try {
      if (fileName) {
        // If a new file is selected, delete the old image
        await deleteObject(oldImageRef);

        // Upload the new image
        const newImageRef = ref(storage, `plants/${plantDocId}`);
        const file = document.getElementById("file-upload").files[0];
        await uploadBytes(newImageRef, file);

        // Get the URL of the new image
        const newImageUrl = await getDownloadURL(newImageRef);

        // Update Firestore with the new image URL and other fields
        await updateDoc(plantRef, {
          ...updatedFields,
          imageUrl: newImageUrl,
          createdAt: serverTimestamp(), // Update createdAt to the current date
        });
      } else {
        // If no new file, update Firestore with other fields only
        await updateDoc(plantRef, {
          ...updatedFields,
          createdAt: serverTimestamp(), // Update createdAt to the current date
        });
      }

      toast.success("Plant updated successfully!"); // Show success toast
      setPlantData(null);
      setUpdatedFields({});
      setPlantDocId(""); // Clear the document ID after updating
    } catch (error) {
      console.error("Error updating plant:", error);
      toast.error("Error updating plant. Please check the details."); // Show error toast
    }
  };

  // Fetch current location and update latitude and longitude fields
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUpdatedFields((prevFields) => ({
            ...prevFields,
            latitude: latitude.toFixed(6), // Limit to 6 decimal places
            longitude: longitude.toFixed(6),
          }));
          toast.success("Location fetched successfully!");
        },
        (error) => {
          console.error("Error fetching location:", error);
          toast.error("Error fetching location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Update Plant Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Zone</label>
            <input
              type="text"
              name="zone"
              placeholder="Zone"
              value={searchParams.zone} // Pre-filled with the zone
              onChange={handleSearchInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              value={searchParams.plantNumber}
              onChange={handleSearchInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            onClick={fetchPlant}
            className="w-full mt-4 py-3 font-bold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            {/* Fetch Location Button */}
            <button
              type="button"
              onClick={fetchCurrentLocation}
              className="w-full py-3 bg-yellow-400 text-white font-bold rounded-lg hover:bg-yellow-500"
            >
              Use Current Location
            </button>
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Good">Good</option>
                <option value="Deceased">Deceased</option>
                <option value="Infected">Infected</option>
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                  onChange={handleFileChange}
                  id="file-upload"
                  className="sr-only"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full py-3 font-bold text-center bg-yellow-400 text-white rounded-lg cursor-pointer hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
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

            {/* Insects Present */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Insects Present:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="insects"
                    value="yes"
                    checked={updatedFields.insects === true}
                    onChange={() => handleRadioChange("insects", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="insects"
                    value="no"
                    checked={updatedFields.insects === false}
                    onChange={() => handleRadioChange("insects", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Fertilizers */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Fertilizers Applied:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="fertilizers"
                    value="yes"
                    checked={updatedFields.fertilizers === true}
                    onChange={() => handleRadioChange("fertilizers", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="fertilizers"
                    value="no"
                    checked={updatedFields.fertilizers === false}
                    onChange={() => handleRadioChange("fertilizers", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Soil Level */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Soil Level Maintained:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="soilLevel"
                    value="yes"
                    checked={updatedFields.soilLevel === true}
                    onChange={() => handleRadioChange("soilLevel", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="soilLevel"
                    value="no"
                    checked={updatedFields.soilLevel === false}
                    onChange={() => handleRadioChange("soilLevel", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Tree Burnt */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Tree Burnt:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="treeBurnt"
                    value="yes"
                    checked={updatedFields.treeBurnt === true}
                    onChange={() => handleRadioChange("treeBurnt", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="treeBurnt"
                    value="no"
                    checked={updatedFields.treeBurnt === false}
                    onChange={() => handleRadioChange("treeBurnt", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Unwanted Grass */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Unwanted Grass:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="unwantedGrass"
                    value="yes"
                    checked={updatedFields.unwantedGrass === true}
                    onChange={() => handleRadioChange("unwantedGrass", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="unwantedGrass"
                    value="no"
                    checked={updatedFields.unwantedGrass === false}
                    onChange={() => handleRadioChange("unwantedGrass", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Water Logging */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Water Logging:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="waterLogging"
                    value="yes"
                    checked={updatedFields.waterLogging === true}
                    onChange={() => handleRadioChange("waterLogging", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="waterLogging"
                    value="no"
                    checked={updatedFields.waterLogging === false}
                    onChange={() => handleRadioChange("waterLogging", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Compound */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium">
                Compound:
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="compound"
                    value="yes"
                    checked={updatedFields.compound === true}
                    onChange={() => handleRadioChange("compound", true)}
                    className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                  <input
                    type="radio"
                    name="compound"
                    value="no"
                    checked={updatedFields.compound === false}
                    onChange={() => handleRadioChange("compound", false)}
                    className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Water Schedule */}
            <div>
              <label className="block text-gray-600 font-medium">
                Water Schedule
              </label>
              <select
                name="waterSchedule"
                value={updatedFields.waterSchedule || ""}
                onChange={handleUpdateInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="alternate">Alternate Days</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 font-bold bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              Update Plant
            </button>
          </form>
        )}
      </div>
      <ToastContainer /> {/* Include ToastContainer to show toasts */}
    </div>
  );
};

export default UpdatePlant;
