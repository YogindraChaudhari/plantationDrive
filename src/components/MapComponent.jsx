import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapComponent = ({ updateKey }) => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const querySnapshot = await getDocs(collection(db, "plants"));
      setPlants(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchPlants();
  }, [updateKey]); // Refetch when updateKey changes

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <MapContainer
          center={[19.1, 73.1]}
          zoom={10}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {plants.map((plant) => (
            <Marker key={plant.id} position={[plant.latitude, plant.longitude]}>
              <Popup>
                <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm overflow-auto">
                  <h3 className="text-3xl font-bold mb-2">{plant.name}</h3>
                  <p className="text-gray-700 mb-1">
                    <strong>Type:</strong> {plant.type}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Height:</strong> {plant.height} ft.
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Health:</strong> {plant.health}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Zone:</strong> {plant.zone}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Plant Number:</strong> {plant.plantNumber}
                  </p>
                  {plant.imageUrl && (
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-full h-auto rounded-md"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
