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

// Register.jsx
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

    if (!validateDMS(plantData.latitude) || !validateDMS(plantData.longitude)) {
      setError(
        "Please enter valid latitude and longitude values in DMS format."
      );
      toast.error("Invalid latitude or longitude format.");
      return;
    }

    const lat = dmsToDecimal(plantData.latitude);
    const lng = dmsToDecimal(plantData.longitude);

    if (lat === null || lng === null) {
      setError("Invalid DMS format for latitude or longitude.");
      toast.error("Invalid DMS format for coordinates.");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Register Plant Information
        </h3>
        {error && <p className="text-red-500">{error}</p>}
        <form
          onSubmit={handleRegister}
          className="flex flex-col p-4 space-y-4 bg-white rounded shadow-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Plant Name"
            value={plantData.name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="plantNumber"
            placeholder="Plant Number"
            value={plantData.plantNumber}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="type"
            placeholder="Type of Plant"
            value={plantData.type}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="height"
            placeholder="Height (in ft/cm)"
            value={plantData.height}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={plantData.latitude}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={plantData.longitude}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <select
            name="health"
            value={plantData.health}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="file"
            onChange={handleImageUpload}
            className="p-2 border rounded"
          />
          <button type="submit" className="p-2 text-white bg-blue-500 rounded">
            Register Plant
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegisterPlant;
