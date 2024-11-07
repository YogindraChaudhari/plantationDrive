import { useState } from "react";
import { db, storage } from "../services/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeletePlant = ({ onDeleteSuccess = () => {} }) => {
  // Default empty function
  const [zone, setZone] = useState("");
  const [plantNumber, setPlantNumber] = useState("");
  const [plantName, setPlantName] = useState("");

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete plant...");

      // Query Firestore to find the plant document by zone and plantNumber
      const q = query(
        collection(db, "plants"),
        where("zone", "==", zone),
        where("plantNumber", "==", plantNumber)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast.error("Plant not found. Please check the zone and plant number.");
        console.log("Plant not found in Firestore.");
        return; // Exit early if the plant is not found
      }

      // Document ID from the query result
      const plantDoc = querySnapshot.docs[0]; // Get the first matching document
      const plantId = plantDoc.id; // The document ID (auto-generated like 'bTztjcjhVtwrin2AbFpH')

      // Get the image URL from the plant document
      const plantData = plantDoc.data();
      const imageURL = plantData.imageUrl;

      // If imageURL exists, delete the image from Firebase Storage
      if (imageURL) {
        try {
          const imageID = imageURL
            .split("/o/plants%2F")[1]
            .split("?alt=media")[0];
          const imageRef = ref(storage, `plants/${imageID}`);

          await deleteObject(imageRef);
          console.log("Image deleted.");
        } catch (error) {
          console.warn("Error deleting image:", error);
        }
      }

      // Delete the plant document from Firestore
      await deleteDoc(doc(db, "plants", plantId));
      console.log("Plant deleted.");

      // Success message after successful deletion
      toast.success("Plant deleted successfully!");
      onDeleteSuccess(); // Trigger update on success
    } catch (error) {
      // Log the error to investigate why the catch block is being triggered
      console.error("Error deleting plant:", error);

      // Add more specific checks in the catch block for clarity
      if (error instanceof Error) {
        console.log("Caught error:", error.message);
      } else {
        console.log("Unknown error occurred.");
      }

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
