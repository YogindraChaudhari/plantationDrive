import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig"; // Ensure this path is correct
import { collection, getDocs } from "firebase/firestore";
import bgImg2 from "../assets/bg-img2.png";

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
    <div
      className="flex flex-col items-center min-h-screen  p-6"
      style={{
        backgroundImage: `url(${bgImg2})`,
        opacity: 0.9,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl font-semibold mb-4 text-white">Plants by Zone</h1>
      <div className="mb-4">
        {Object.keys(plantsByZone).map((zone) => (
          <button
            key={zone}
            onClick={() => handleZoneClick(zone)}
            className="m-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Zone {zone}
          </button>
        ))}
      </div>
      {selectedZone && (
        <div>
          <h2 className="text-3xl font-semibold mb-2 text-white">
            Plants in Zone {selectedZone}
          </h2>
          <ol className="list-disc pl-5 text-white text-2xl">
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
            className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Back to Zones
          </button>
        </div>
      )}
    </div>
  );
};

export default ZoneWisePlants;
