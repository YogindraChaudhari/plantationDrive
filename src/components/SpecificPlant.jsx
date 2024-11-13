import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore";

const SpecificPlant = () => {
  const { id } = useParams(); // Get the plant ID from the URL
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      setLoading(true);
      try {
        const plantDoc = doc(db, "plants", id); // Reference the plant document using the ID
        const plantSnapshot = await getDoc(plantDoc);

        if (plantSnapshot.exists()) {
          setPlant({ id: plantSnapshot.id, ...plantSnapshot.data() });
        } else {
          console.log("No plant found!");
        }
      } catch (error) {
        console.error("Error fetching plant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown"; // Return 'Unknown' if no timestamp is available
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
    return date.toLocaleString(); // Format the date to a human-readable string
  };

  if (loading)
    return (
      <p className="text-center text-2xl font-bold text-green-700 mt-12">
        Loading...
      </p>
    );

  if (!plant)
    return (
      <p className="text-center text-2xl font-bold text-green-700 mt-12">
        Plant not found.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        key={plant.id}
        className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform m-4"
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
              <strong>Uploaded on</strong> {formatTimestamp(plant.createdAt)}
            </p>
            <p className="text-sm md:text-base text-gray-600">
              <strong>Insects Present:</strong> {plant.insects ? "Yes" : "No"}
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
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-500">
                No Image Available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificPlant;
