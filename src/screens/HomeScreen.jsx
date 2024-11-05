import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import MapComponent from "../components/MapComponent";

const HomeScreen = () => {
  const { username } = useAuth();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (username) {
      toast.info(`Welcome, ${username}!`);
    }

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
  }, [username]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
        Welcome to the Plant Tracker App
      </h1>
      <p className="text-md text-center text-gray-900 text-lg mb-8">
        Use this app to track, register, and update information on various
        plants around you.
      </p>
      <ToastContainer />

      {/* Button Container */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 overflow-x-auto font-bold">
        <Link to="/zone-wise-plant-details">
          <button className="bg-violet-500 m-3 p-3 hover:bg-violet-600 text-white rounded-xl min-w-[120px]">
            Zone Wise Plant Details
          </button>
        </Link>
        <Link to="/register-plant">
          <button className="bg-green-500 m-3 p-3 hover:bg-green-600 text-white rounded-xl min-w-[120px]">
            Register Plant
          </button>
        </Link>
        <Link to="/update-plant">
          <button className="bg-yellow-500 m-3 p-3 hover:bg-yellow-600 text-white rounded-xl min-w-[120px]">
            Update Plant
          </button>
        </Link>
        <Link to="/delete-plant">
          <button className="bg-red-500 m-3 p-3 hover:bg-red-600 text-white rounded-xl min-w-[120px]">
            Delete Plant
          </button>
        </Link>
      </div>

      {/* Map Component */}
      <div className="overflow-hidden md:overflow-auto">
        <MapComponent />
      </div>

      {/* Back to Top Button for Mobile View */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-3 font-bold bg-green-500 text-white rounded-full shadow-lg focus:outline-none md:hidden"
          style={{ zIndex: 1000 }}
        >
          ↑ Back To Top
        </button>
      )}
    </div>
  );
};

export default HomeScreen;
