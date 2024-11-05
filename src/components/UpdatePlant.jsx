import { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
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

    try {
      await updateDoc(plantRef, {
        ...updatedFields,
        uploadDate: new Date().toISOString(), // Update uploadDate to the current date
      });
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
