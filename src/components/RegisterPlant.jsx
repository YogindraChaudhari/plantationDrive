// import React, { useState } from "react";
// import { db, storage } from "../services/firebaseConfig";
// import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const RegisterPlant = () => {
//   const [plantData, setPlantData] = useState({
//     name: "",
//     plantNumber: "",
//     type: "",
//     height: "",
//     latitude: "",
//     longitude: "",
//     health: "good", // default option
//     zone: "",
//   });
//   const [image, setImage] = useState(null);

//   const handleInputChange = (e) => {
//     setPlantData({ ...plantData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setImage(file);
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       // Add plant data to Firestore
//       const docRef = await addDoc(collection(db, "plants"), plantData);

//       // Upload image if present
//       if (image) {
//         const imageRef = ref(storage, `plants/${docRef.id}`);
//         await uploadBytes(imageRef, image);
//         const imageUrl = await getDownloadURL(imageRef);

//         // Update Firestore document with image URL
//         await updateDoc(doc(db, "plants", docRef.id), { imageUrl });
//       }

//       alert("Plant registered successfully!");
//       setPlantData({
//         name: "",
//         plantNumber: "",
//         type: "",
//         height: "",
//         latitude: "",
//         longitude: "",
//         health: "good",
//         zone: "",
//       });
//       setImage(null);
//     } catch (error) {
//       console.error("Error registering plant:", error);
//       alert("Failed to register plant. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
//         <h3 className="text-xl font-semibold mb-4 text-center">
//           Register Plant Information
//         </h3>
//         <form
//           onSubmit={handleRegister}
//           className="flex flex-col p-4 space-y-4 bg-white rounded shadow-md"
//         >
//           <input
//             type="text"
//             name="name"
//             placeholder="Plant Name"
//             value={plantData.name}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="plantNumber"
//             placeholder="Plant Number"
//             value={plantData.plantNumber}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="type"
//             placeholder="Type of Plant"
//             value={plantData.type}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="height"
//             placeholder="Height (in ft/cm)"
//             value={plantData.height}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="latitude"
//             placeholder="Latitude"
//             value={plantData.latitude}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             name="longitude"
//             placeholder="Longitude"
//             value={plantData.longitude}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <select
//             name="health"
//             value={plantData.health}
//             onChange={handleInputChange}
//             className="p-2 border rounded"
//           >
//             <option value="good">Good</option>
//             <option value="deceased">Deceased</option>
//             <option value="infected">Infected</option>
//           </select>
//           <input
//             type="text"
//             name="zone"
//             placeholder="Zone"
//             value={plantData.zone}
//             onChange={handleInputChange}
//             required
//             className="p-2 border rounded"
//           />
//           <input
//             type="file"
//             onChange={handleImageUpload}
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="p-2 text-white bg-blue-500 rounded">
//             Register Plant
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPlant;

import React, { useState } from "react";
import { db, storage } from "../services/firebaseConfig";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
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
    health: "good", // default option
    zone: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(""); // To handle validation errors

  const handleInputChange = (e) => {
    setPlantData({ ...plantData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
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

  const handleRegister = async (e) => {
    e.preventDefault();
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
      });
      setImage(null);
    } catch (error) {
      console.error("Error registering plant:", error);
      toast.error("Failed to register plant. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-300 p-6">
      <div className="w-full max-w-lg mx-auto p-8 border rounded-lg shadow-xl bg-white">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register New Plant
        </h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Register Plant
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegisterPlant;
