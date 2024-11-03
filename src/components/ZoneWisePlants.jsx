import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig"; // Ensure this path is correct
import { collection, getDocs } from "firebase/firestore";

const ZoneWisePlants = () => {
  const [plantsByZone, setPlantsByZone] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);

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
                <th className="px-4 py-2">Plant Number</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Height (ft)</th>
                <th className="px-4 py-2">Health</th>
              </tr>
            </thead>
            <tbody>
              {plantsByZone[selectedZone].map((plant) => (
                <tr
                  key={plant.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{plant.plantNumber}</td>
                  <td className="px-4 py-2">{plant.name}</td>
                  <td className="px-4 py-2">{plant.height}</td>
                  <td className="px-4 py-2">{plant.health}</td>
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
