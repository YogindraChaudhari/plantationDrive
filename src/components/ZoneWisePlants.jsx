import React, { useEffect, useState } from "react";
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
          <h2 className="text-xl font-semibold mb-2">
            Plants in Zone {selectedZone}
          </h2>
          <ol className="list-disc pl-5">
            {plantsByZone[selectedZone].map((plant) => (
              <li key={plant.id} className="mb-1">
                <strong>Plant Number: </strong> {plant.plantNumber},
                <strong> Name: </strong> {plant.name},{" "}
                <strong> Height: </strong> {plant.height} ft,{" "}
                <strong> Health: </strong> {plant.health}
              </li>
            ))}
          </ol>
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
