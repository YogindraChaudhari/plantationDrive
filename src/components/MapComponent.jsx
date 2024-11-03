import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet-color-markers";
import L from "leaflet";

// Map zone to marker color icons
const zoneIcons = {
  10: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  11: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  13: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  14: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  // Add more zones and colors as needed
};

// Default icon in case a zone doesn’t match
const defaultIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = ({ updateKey }) => {
  const [plants, setPlants] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

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
    <div className="flex flex-col h-screen relative">
      <div className={`flex-grow ${selectedImage ? "hidden" : ""}`}>
        <MapContainer
          center={[19.1, 73.1]}
          zoom={10}
          style={{ height: "100%", zIndex: 0 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {plants.map((plant) => (
            <Marker
              key={plant.id}
              position={[plant.latitude, plant.longitude]}
              icon={zoneIcons[plant.zone] || defaultIcon}
            >
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
                    <strong>Latitude:</strong> {plant.latitude}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Longitude:</strong> {plant.longitude}
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
                      className="w-full h-auto rounded-md cursor-pointer"
                      onClick={() => openImageModal(plant.imageUrl)}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Zoomed Plant"
              className="max-w-full max-h-screen rounded-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 bg-green-800 text-white rounded-3xl px-4 p-2 hover:bg-green-600"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
