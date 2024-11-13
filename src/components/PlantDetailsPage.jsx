import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig"; // Import your Firebase config
import { collection, getDocs } from "firebase/firestore";

const PlantDetailsPage = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState("All Zones"); // Default to "All Zones"
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc"); // State to track sorting order
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Scroll listener for showing the "Back to Top" button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    // Attach the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch plant data from Firestore
  useEffect(() => {
    const fetchPlantData = async () => {
      setLoading(true);
      try {
        const plantCollection = collection(db, "plants");
        const plantSnapshot = await getDocs(plantCollection);
        const plantList = plantSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlants(plantList);

        // Get unique zones for the filter
        const uniqueZones = [
          "All Zones",
          ...new Set(plantList.map((plant) => plant.zone)),
        ];
        setZones(uniqueZones);

        // Default filtered plants to all plants
        setFilteredPlants(plantList);
      } catch (error) {
        console.error("Error fetching plant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, []);

  useEffect(() => {
    let updatedPlants =
      selectedZone === "All Zones"
        ? plants
        : plants.filter((plant) => plant.zone === selectedZone);

    // Sort the filtered plants by plant number
    updatedPlants = updatedPlants.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.plantNumber - b.plantNumber;
      } else {
        return b.plantNumber - a.plantNumber;
      }
    });

    setFilteredPlants(updatedPlants);
  }, [selectedZone, plants, sortOrder]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown"; // Return 'Unknown' if no timestamp is available
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
    return date.toLocaleString(); // Format the date to a human-readable string
  };

  if (loading)
    return (
      <p className="text-center text-xl font-bold pt-10 mt-10 text-green-700">
        Loading...
      </p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl md:text-3xl text-black font-bold mb-6 text-center">
        Plant Details
      </h2>

      {/* Zone Filter */}
      <div className="mb-4 flex justify-center">
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="p-2 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg"
        >
          {zones.map((zone, index) => (
            <option key={index} value={zone} className="text-gray-800 bg-white">
              {zone}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Plant Number Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg"
        >
          <option value="asc">Sort by Plant Number (Ascending)</option>
          <option value="desc">Sort by Plant Number (Descending)</option>
        </select>
      </div>

      {/* Plant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 mt-4"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Left: Text Fields */}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl text-center md:text-2xl font-bold text-gray-800">
                  {plant.name || "Unnamed Plant"}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Type:</strong> {plant.type || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Zone:</strong> {plant.zone || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Plant Number:</strong> {plant.plantNumber || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Height:</strong> {plant.height || "N/A"} cm
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Latitude:</strong> {plant.latitude || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Longitude:</strong> {plant.longitude || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Health:</strong> {plant.health || "N/A"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Uploaded on:</strong>{" "}
                  {formatTimestamp(plant.createdAt)}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Insects Present:</strong>{" "}
                  {plant.insects ? "Yes" : "No"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Fertilizers Applied:</strong>{" "}
                  {plant.fertilizers ? "Yes" : "No"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Soil Level Maintained:</strong>{" "}
                  {plant.soilLevel ? "Yes" : "No"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Tree Burnt:</strong> {plant.treeBurnt ? "Yes" : "No"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Unwanted Grass:</strong>{" "}
                  {plant.unwantedGrass ? "Yes" : "No"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Water Logging:</strong>{" "}
                  {plant.waterLogging ? "Yes" : "No"}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  <strong>Compound Maintained:</strong>{" "}
                  {plant.compound ? "Yes" : "No"}
                </p>
              </div>

              {/* Right: Image */}
              <div className="flex-1 w-full h-56 md:h-64 bg-gray-200 rounded-lg overflow-hidden">
                {plant.imageUrl ? (
                  <img
                    src={plant.imageUrl}
                    alt={plant.name || "Plant Image"}
                    className="object-cover w-full h-full cursor-pointer"
                    onClick={() => openImageModal(plant.imageUrl)}
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-4 font-bold bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
          style={{ zIndex: 1000 }}
        >
          ↑ Back To Top
        </button>
      )}
    </div>
  );
};

export default PlantDetailsPage;
