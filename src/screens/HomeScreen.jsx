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
      <div className="flex flex-wrap justify-center gap-6 mb-8 overflow-x-auto font-bold">
        <Link to="/zone-wise-plant-details">
          <button className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-violet-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300">
            Zone Wise Plant Details
          </button>
        </Link>
        <Link to="/register-plant">
          <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300">
            Register Plant
          </button>
        </Link>
        <Link to="/update-plant">
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300">
            Update Plant
          </button>
        </Link>
        <Link to="/delete-plant">
          <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300">
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
          className="fixed bottom-4 right-4 p-4 font-bold bg-green-500 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
          style={{ zIndex: 1000 }}
        >
          ↑ Back To Top
        </button>
      )}
    </div>
  );
};

export default HomeScreen;
