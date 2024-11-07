import { useEffect, useState } from "react";
import { db, storage } from "../services/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const ZoneWisePlants = () => {
  const [plantsByZone, setPlantsByZone] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const navigate = useNavigate();

  const zoneColors = {
    1: "bg-red-600",
    2: "bg-gold-600",
    10: "bg-black-600",
    11: "bg-orange-600",
    12: "bg-violet-600",
    13: "bg-green-600",
    14: "bg-yellow-600",
    15: "bg-grey-600",
    // Add more zones and colors as needed
  };

  useEffect(() => {
    const fetchPlants = async () => {
      const plantsRef = collection(db, "plants");
      const plantsSnapshot = await getDocs(plantsRef);

      const plantsData = {};
      plantsSnapshot.forEach((doc) => {
        const plant = doc.data();
        const plantZone = plant.zone;

        if (!plantsData[plantZone]) {
          plantsData[plantZone] = [];
        }
        plantsData[plantZone].push({
          id: doc.id,
          ...plant,
        });
      });

      setPlantsByZone(plantsData);
    };

    fetchPlants();
  }, []);

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
  };

  const handlePlantClick = (plant) => {
    navigate("/map", {
      state: {
        latitude: plant.latitude,
        longitude: plant.longitude,
        plantData: plant,
      },
    });
  };

  const handleEditClick = (zone, plantNumber) => {
    navigate("/update-plant", {
      state: {
        zone,
        plantNumber,
      },
    });
  };

  const handleDeleteClick = (plantId, imageUrl) => {
    setSelectedPlantId(plantId);
    setSelectedImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete the image from Firebase Storage if image URL exists
      if (selectedImageUrl) {
        const imageID = selectedImageUrl
          .split("/o/plants%2F")[1]
          .split("?alt=media")[0];
        const imageRef = ref(storage, `plants/${imageID}`);

        await deleteObject(imageRef);
        console.log("Image deleted from Firebase Storage.");
      }

      // Delete the plant document from Firestore
      const plantDocRef = doc(db, "plants", selectedPlantId);
      await deleteDoc(plantDocRef);

      // Update the UI to reflect the deletion
      setPlantsByZone((prevPlants) => {
        const updatedPlants = { ...prevPlants };
        const plantsInZone = updatedPlants[selectedZone].filter(
          (plant) => plant.id !== selectedPlantId
        );
        updatedPlants[selectedZone] = plantsInZone;
        return updatedPlants;
      });

      toast.success("Plant deleted successfully!");
    } catch (error) {
      console.error("Error deleting plant: ", error);
      toast.error("There was an error deleting the plant.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-green-300 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Plants by Zone</h1>
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Object.keys(plantsByZone).map((zone) => (
          <button
            key={zone}
            onClick={() => handleZoneClick(zone)}
            className={`px-4 py-2 font-bold text-white rounded-lg hover:opacity-90 ${
              zoneColors[zone] || "bg-blue-800"
            }`}
          >
            Zone {zone}
          </button>
        ))}
      </div>
      {selectedZone && (
        <div className="w-full sm:w-3/4 lg:w-1/2">
          <h2 className="text-xl font-bold text-center mb-2">
            Plants in Zone {selectedZone}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border border-gray-300">
              <thead className="text-xs font-medium text-black uppercase bg-green-400">
                <tr>
                  <th className="px-4 py-2 text-center">Plant No.</th>
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Height (ft)</th>
                  <th className="px-4 py-2 text-center">Health</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plantsByZone[selectedZone].map((plant) => (
                  <tr key={plant.id} className="border-b hover:bg-green-100">
                    <td
                      className="px-4 py-2 text-center underline cursor-pointer"
                      onClick={() => handlePlantClick(plant)}
                    >
                      {plant.plantNumber}
                    </td>
                    <td className="px-4 py-2">{plant.name}</td>
                    <td className="px-4 py-2 text-center">{plant.height}</td>
                    <td className="px-4 py-2">{plant.health}</td>
                    <td className="px-4 py-2 text-center flex">
                      <button
                        onClick={() =>
                          handleEditClick(plant.zone, plant.plantNumber)
                        }
                        className="text-white bg-green-800 hover:bg-green-600 p-1 rounded mr-2"
                        aria-label="Edit Plant"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(plant.id, plant.imageUrl)
                        }
                        className="text-white bg-red-800 hover:bg-red-600 p-1 rounded"
                        aria-label="Delete Plant"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setSelectedZone(null)}
            className="mt-4 px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Back to Zones
          </button>
        </div>
      )}

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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ZoneWisePlants;
