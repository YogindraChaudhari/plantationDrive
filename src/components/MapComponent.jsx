import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../services/firebaseConfig";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet-color-markers";
import "./Component.css";
import L from "leaflet";

// Map zone to marker color icons
const createZoneIcon = (zone, isSelected = false) => {
  const colorUrls = {
    1: "marker-icon-red.png",
    2: "marker-icon-gold.png",
    10: "marker-icon-black.png",
    11: "marker-icon-orange.png",
    12: "marker-icon-violet.png",
    13: "marker-icon-green.png",
    14: "marker-icon-yellow.png",
    15: "marker-icon-grey.png",
  };

  const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${
    colorUrls[zone] || "marker-icon-blue.png"
  }`;

  return L.icon({
    iconUrl,
    iconSize: isSelected ? [25, 41] : [25, 41], // Bigger size for selected marker
    iconAnchor: [12, 41],
  });
};

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
};

const MapComponent = ({ updateKey }) => {
  const [plants, setPlants] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null); // State for the selected plant
  const markerRef = useRef(null); // Ref for selected plant's marker
  const location = useLocation(); // Get location object
  const [imageDate, setImageDate] = useState(null); // State for the image's creation date
  const { latitude, longitude, plantData } = location.state || {};
  const [loading, setLoading] = useState(true);

  const openImageModal = (imageUrl, createdAt) => {
    if (imageUrl && createdAt) {
      setSelectedImage(imageUrl);
      setImageDate(createdAt);
    } // Set the image's creation date when opening the modal
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageDate(null); // Clear the image date when closing the modal
  };

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "plants"));
      setPlants(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    };
    fetchPlants();
  }, [updateKey]); // Refetch when updateKey changes

  // Set the selected plant from the passed data
  useEffect(() => {
    if (plantData) {
      setSelectedPlant(plantData);
    }
  }, [plantData]);

  // Open the popup for the selected plant's marker when it changes
  useEffect(() => {
    if (selectedPlant && markerRef.current) {
      setTimeout(() => {
        markerRef.current.openPopup();
      }, 300); // Add a small delay to ensure the marker is mounted
    }
  }, [selectedPlant]);

  // Function to format the Firestore timestamp directly
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown"; // Return 'Unknown' if no timestamp is available
    const date =
      timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp); // Convert Firestore Timestamp to JavaScript Date object
    return date.toLocaleString(); // Format the date to a human-readable string
  };

  useEffect(() => {
    if (plantData) {
      // Ensure createdAt is a Firestore Timestamp or convert it if needed
      const processedPlantData = {
        ...plantData,
        createdAt:
          plantData.createdAt instanceof Timestamp
            ? plantData.createdAt
            : Timestamp.fromDate(new Date()),
      };
      setSelectedPlant(processedPlantData);
    }
  }, [plantData]);

  return (
    <div className="flex flex-col h-screen relative">
      <div className={`flex-grow ${selectedImage ? "hidden" : ""}`}>
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <MapContainer
            center={[latitude || 19.1, longitude || 73.1]}
            zoom={10}
            style={{ height: "100%", zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Recenter map to selectedPlant location */}
            {selectedPlant && (
              <RecenterMap
                position={[selectedPlant.latitude, selectedPlant.longitude]}
              />
            )}

            {plants.map((plant) => (
              <Marker
                key={plant.id}
                position={[plant.latitude, plant.longitude]}
                icon={createZoneIcon(plant.zone)}
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
                    <p className="text-gray-700 mb-2">
                      <strong>Created At:</strong>{" "}
                      {formatTimestamp(plant.createdAt)}
                    </p>
                    {plant.imageUrl && (
                      <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        className="w-full h-auto rounded-md cursor-pointer"
                        onClick={() =>
                          openImageModal(plant.imageUrl, plant.createdAt)
                        }
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Show popup for the selected plant, if any */}
            {selectedPlant && (
              <Marker
                position={[selectedPlant.latitude, selectedPlant.longitude]}
                icon={createZoneIcon(selectedPlant.zone, true)}
                ref={markerRef}
              >
                <Popup>
                  <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm overflow-auto">
                    <h3 className="text-3xl font-bold mb-2">
                      {selectedPlant.name}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <strong>Type:</strong> {selectedPlant.type}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Height:</strong> {selectedPlant.height} ft.
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Latitude:</strong> {selectedPlant.latitude}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Longitude:</strong> {selectedPlant.longitude}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Health:</strong> {selectedPlant.health}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Zone:</strong> {selectedPlant.zone}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Plant Number:</strong> {selectedPlant.plantNumber}
                    </p>
                    {/* Displaying the formatted creation time for selectedPlant */}
                    {selectedPlant.createdAt && (
                      <p className="text-gray-700 mb-2">
                        <strong>Uploaded On:</strong>{" "}
                        {formatTimestamp(selectedPlant.createdAt)}
                      </p>
                    )}
                    {selectedPlant.imageUrl && (
                      <img
                        src={selectedPlant.imageUrl}
                        alt={selectedPlant.name}
                        className="w-full h-auto rounded-md"
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Zoomed Plant"
              className="max-w-full max-h-screen rounded-lg"
            />
            {
              // display date here
              imageDate && (
                <p className="mt-2 text-center text-white">
                  <strong>Uploaded On:</strong> {formatTimestamp(imageDate)}
                </p>
              )
            }
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
