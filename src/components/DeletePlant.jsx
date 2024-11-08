import { useState, useEffect } from "react";
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
  const [zone, setZone] = useState("");
  const [plantNumber, setPlantNumber] = useState("");
  const [plantName, setPlantName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    // Display a pop-up notification before the form is filled
    toast.info(
      "Please fill out all the fields correctly to delete plant data."
    );
  }, []);

  const handleDeleteConfirmation = () => {
    if (!zone || !plantNumber || !plantName) {
      toast.error("Please fill out zone, plant number and plant name.");
      return; // Don't open modal if zone or plantNumber is missing
    }
    setIsModalOpen(true); // Open the confirmation modal if valid data is present
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal without deleting
  };

  const confirmDelete = async () => {
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
      console.error("Error deleting plant:", error);
      toast.error("Failed to delete plant.");
      toast.error("Please check details again.");
    }

    setIsModalOpen(false); // Close the modal after deletion
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
          onClick={handleDeleteConfirmation}
          className="w-full py-3 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete Plant
        </button>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 lg:w-1/4">
            <h2 className="text-xl font-bold text-center mb-4">
              Confirm Delete
            </h2>
            <p className="text-center mb-4">
              Are you sure you want to delete this plant?
            </p>
            <div className="flex flex-col sm:flex-row justify-between sm:space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 mb-2 sm:mb-0"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePlant;
