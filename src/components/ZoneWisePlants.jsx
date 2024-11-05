import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig"; // Ensure this path is correct
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing edit and delete icons

const ZoneWisePlants = () => {
  const [plantsByZone, setPlantsByZone] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);
  const navigate = useNavigate();

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
          id: doc.id, // Store the document ID for future use
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

  const handleEditClick = (plantId) => {
    navigate(`/edit-plant/${plantId}`); // Navigate to edit plant page
  };

  const handleDeleteClick = (plantId) => {
    // Logic to delete the plant from Firestore
    console.log(`Delete plant with ID: ${plantId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-green-300 p-6">
      <h1 className="text-2xl font-bold mb-4">Plants by Zone</h1>
      <div className="mb-4">
        {Object.keys(plantsByZone).map((zone) => (
          <button
            key={zone}
            onClick={() => handleZoneClick(zone)}
            className="m-3 p-3 font-bold bg-blue-800 text-white rounded-xl hover:bg-blue-600"
          >
            Zone {zone}
          </button>
        ))}
      </div>
      {selectedZone && (
        <div>
          <h2 className="text-xl text-center font-bold mb-2">
            Plants in Zone {selectedZone}
          </h2>
          <table className="w-full text-left table-auto sm:table-auto">
            <thead className="text-xs font-medium text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-2">Plant No.</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Height (ft)</th>
                <th className="px-4 py-2">Health</th>
                <th className="px-4 py-2">Actions</th>{" "}
                {/* Added actions header */}
              </tr>
            </thead>
            <tbody>
              {plantsByZone[selectedZone].map((plant) => (
                <tr
                  key={plant.id}
                  className="border-b border-gray-400 hover:bg-green-300"
                >
                  <td
                    className="px-4 py-2 text-center underline underline-offset-8 cursor-pointer"
                    onClick={() => handlePlantClick(plant)}
                  >
                    {plant.plantNumber}
                  </td>
                  <td className="px-4 py-2">{plant.name}</td>
                  <td className="px-4 py-2 text-center">{plant.height}</td>
                  <td className="px-4 py-2">{plant.health}</td>
                  <td className="px-4 py-2 text-center">
                    {" "}
                    {/* Actions cell */}
                    <button
                      onClick={() => handleEditClick(plant.id)}
                      className="text-white bg-green-800 hover:text-green-800 hover:bg-white mr-2"
                      aria-label="Edit Plant"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(plant.id)}
                      className="text-white  bg-red-800 hover:text-green-800 hover:bg-white"
                      aria-label="Delete Plant"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setSelectedZone(null)}
            className="mt-4 p-3 font-bold bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Back to Zones
          </button>
        </div>
      )}
    </div>
  );
};

export default ZoneWisePlants;
