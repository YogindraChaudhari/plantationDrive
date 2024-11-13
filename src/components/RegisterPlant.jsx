import { useState, useEffect } from "react";
import { db, storage } from "../services/firebaseConfig";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPlant = () => {
  const [plantData, setPlantData] = useState({
    name: "",
    plantNumber: "",
    type: "",
    height: "",
    latitude: "",
    longitude: "",
    health: "Good", // default option
    zone: "",
    createdAt: "",
    insects: false,
    fertilizers: false,
    soilLevel: false,
    treeBurnt: false,
    unwantedGrass: false,
    waterLogging: false,
    compound: false,
    waterSchedule: "daily", // default water schedule
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(""); // To handle validation errors
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    // Display a pop-up notification before the form is filled
    toast.info("Please fill out all the fields before submitting the form.");
  }, []);

  // const handleInputChange = (e) => {
  //   setPlantData({ ...plantData, [e.target.name]: e.target.value });
  // };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      setPlantData((plantData) => ({
        ...plantData,
        [name]: checked,
      }));
    } else if (type === "radio") {
      setPlantData((plantData) => ({
        ...plantData,
        [name]: value,
      }));
    } else {
      setPlantData((plantData) => ({
        ...plantData,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPlantData({
            ...plantData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          toast.success("Location fetched successfully!");
        },
        (error) => {
          toast.error("Error fetching location. Please try again.");
          console.error("Error fetching location:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const validateDMS = (coordinate) => {
    const dmsRegex =
      /^(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(\.\d+)?)"\s*([NSEW])$/;
    return dmsRegex.test(coordinate);
  };

  const dmsToDecimal = (dms) => {
    const parts = dms.match(
      /^(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(\.\d+)?)"\s*([NSEW])$/
    );
    if (!parts) return null;

    let degrees = parseFloat(parts[1]);
    const minutes = parseFloat(parts[2]);
    const seconds = parseFloat(parts[3]);
    const direction = parts[5];

    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === "S" || direction === "W") {
      decimal = -decimal;
    }

    return decimal;
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the modal on register button click
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setError("");

    const decimalRegex = /^-?\d+(\.\d+)?$/; // Matches decimal format

    let lat, lng;

    // Check if latitude is in decimal or DMS format
    if (decimalRegex.test(plantData.latitude)) {
      lat = parseFloat(plantData.latitude);
    } else if (validateDMS(plantData.latitude)) {
      lat = dmsToDecimal(plantData.latitude);
    } else {
      setError("Invalid latitude format. Please use decimal or DMS.");
      toast.error("Invalid latitude format.");
      return;
    }

    // Check if longitude is in decimal or DMS format
    if (decimalRegex.test(plantData.longitude)) {
      lng = parseFloat(plantData.longitude);
    } else if (validateDMS(plantData.longitude)) {
      lng = dmsToDecimal(plantData.longitude);
    } else {
      setError("Invalid longitude format. Please use decimal or DMS.");
      toast.error("Invalid longitude format.");
      return;
    }

    if (lat === null || lng === null) {
      setError("Invalid coordinates format.");
      toast.error("Invalid coordinates format.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "plants"), {
        ...plantData,
        latitude: lat,
        longitude: lng,
        createdAt: serverTimestamp(), // Add timestamp here
      });

      if (image) {
        const imageRef = ref(storage, `plants/${docRef.id}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "plants", docRef.id), { imageUrl });
      }

      toast.success("Plant registered successfully!");
      toast.success("Checkout registered plant details in maps");
      setPlantData({
        name: "",
        plantNumber: "",
        type: "",
        height: "",
        latitude: "",
        longitude: "",
        health: "good",
        zone: "",
        createdAt: serverTimestamp(),
        insects: false,
        fertilizers: false,
        soilLevel: false,
        treeBurnt: false,
        unwantedGrass: false,
        waterLogging: false,
        compound: false,
        waterSchedule: "daily",
      });
      setImage(null);
    } catch (error) {
      console.error("Error registering plant:", error);
      toast.error("Failed to register plant. Please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without confirming
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <div className="w-full max-w-lg mx-auto p-8 border rounded-lg shadow-xl bg-white">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register New Plant
        </h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegisterClick} className="space-y-4">
          {/* Plant Name */}
          <div>
            <label className="block text-gray-600 font-medium">
              Plant Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter plant name"
              value={plantData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Plant Number */}
          <div>
            <label className="block text-gray-600 font-medium">
              Plant Number
            </label>
            <input
              type="text"
              name="plantNumber"
              placeholder="Enter plant number"
              value={plantData.plantNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-600 font-medium">
              Type of Plant
            </label>
            <input
              type="text"
              name="type"
              placeholder="Enter type of plant"
              value={plantData.type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-gray-600 font-medium">
              Height (ft/cm)
            </label>
            <input
              type="text"
              name="height"
              placeholder="Enter height"
              value={plantData.height}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Fetch Location Button */}
          <button
            type="button"
            onClick={handleFetchLocation}
            className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-500"
          >
            Use Current Location
          </button>

          {/* Latitude */}
          <div>
            <label className="block text-gray-600 font-medium">
              Latitude (DMS)
            </label>
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={plantData.latitude}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-gray-600 font-medium">
              Longitude (DMS)
            </label>
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={plantData.longitude}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Health */}
          <div>
            <label className="block text-gray-600 font-medium">
              Health Status
            </label>
            <select
              name="health"
              value={plantData.health}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Good">Good</option>
              <option value="Deceased">Deceased</option>
              <option value="Infected">Infected</option>
            </select>
          </div>

          {/* Zone */}
          <div>
            <label className="block text-gray-600 font-medium">Zone</label>
            <input
              type="text"
              name="zone"
              placeholder="Enter zone"
              value={plantData.zone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Upload Plant Image</label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="p-3 border border-dashed rounded-lg cursor-pointer text-center bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {image ? image.name : "Choose File"}
            </label>
          </div>
          {/* Insects */}
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
                  checked={plantData.insects === true}
                  onChange={() => setPlantData({ ...plantData, insects: true })}
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="insects"
                  value="no"
                  checked={plantData.insects === false}
                  onChange={() =>
                    setPlantData({ ...plantData, insects: false })
                  }
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
                  checked={plantData.fertilizers === true}
                  onChange={() =>
                    setPlantData({ ...plantData, fertilizers: true })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="fertilizers"
                  value="no"
                  checked={plantData.fertilizers === false}
                  onChange={() =>
                    setPlantData({ ...plantData, fertilizers: false })
                  }
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
                  checked={plantData.soilLevel === true}
                  onChange={() =>
                    setPlantData({ ...plantData, soilLevel: true })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="soilLevel"
                  value="no"
                  checked={plantData.soilLevel === false}
                  onChange={() =>
                    setPlantData({ ...plantData, soilLevel: false })
                  }
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
                  checked={plantData.treeBurnt === true}
                  onChange={() =>
                    setPlantData({ ...plantData, treeBurnt: true })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="treeBurnt"
                  value="no"
                  checked={plantData.treeBurnt === false}
                  onChange={() =>
                    setPlantData({ ...plantData, treeBurnt: false })
                  }
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
                  checked={plantData.unwantedGrass === true}
                  onChange={() =>
                    setPlantData({ ...plantData, unwantedGrass: true })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="unwantedGrass"
                  value="no"
                  checked={plantData.unwantedGrass === false}
                  onChange={() =>
                    setPlantData({ ...plantData, unwantedGrass: false })
                  }
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
                  checked={plantData.waterLogging === true}
                  onChange={() =>
                    setPlantData({ ...plantData, waterLogging: true })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="waterLogging"
                  value="no"
                  checked={plantData.waterLogging === false}
                  onChange={() =>
                    setPlantData({ ...plantData, waterLogging: false })
                  }
                  className="w-4 h-4 text-red-500 focus:ring-2 focus:ring-red-400"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Compound */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Compound Maintained:
            </label>
            <div className="flex justify-center gap-6">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="compound"
                  value="yes"
                  checked={plantData.compound === true}
                  onChange={() =>
                    setPlantData({ ...plantData, compound: true })
                  }
                  className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition ease-in-out duration-200">
                <input
                  type="radio"
                  name="compound"
                  value="no"
                  checked={plantData.compound === false}
                  onChange={() =>
                    setPlantData({ ...plantData, compound: false })
                  }
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
              value={plantData.waterSchedule}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="alternate">Alternate Days</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Register Plant
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-center">
              Are you sure you want to register?
            </h4>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleRegister}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 w-full sm:w-auto"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPlant;
