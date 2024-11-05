import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const ZoneWisePlants = () => {
  const [plantsByZone, setPlantsByZone] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);
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

  const handleDeleteClick = async (plantId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plant?"
    );
    if (confirmDelete) {
      try {
        const plantDocRef = doc(db, "plants", plantId);
        await deleteDoc(plantDocRef);
        setPlantsByZone((prevPlants) => {
          const updatedPlants = { ...prevPlants };
          const plantsInZone = updatedPlants[selectedZone].filter(
            (plant) => plant.id !== plantId
          );
          updatedPlants[selectedZone] = plantsInZone;
          return updatedPlants;
        });
        toast.success("Plant deleted successfully!");
      } catch (error) {
        console.error("Error deleting plant: ", error);
        toast.error("There was an error deleting the plant.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-green-300 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Plants by Zone</h1>
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Object.keys(plantsByZone).map((zone) => (
          // <button
          //   key={zone}
          //   onClick={() => handleZoneClick(zone)}
          //   className="px-4 py-2 font-bold bg-blue-800 text-white rounded-lg hover:bg-blue-600"
          // >
          //   Zone {zone}
          // </button>
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
                        onClick={() => handleDeleteClick(plant.id)}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ZoneWisePlants;
