import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold py-4 shadow-xl border-b-teal-400">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold hover:text-gray-100 transition duration-200 transform hover:scale-105"
        >
          🌿 Plant Tracker
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white hover:text-gray-300"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Desktop Navigation Links */}
        <div className={`hidden md:flex space-x-8 items-center`}>
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-6 py-2 rounded-xl text-lg font-semibold hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition duration-200"
          >
            Home
          </Link>

          {/* Dropdown for Services */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className=" flex bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-6 py-2 rounded-xl text-lg font-semibold hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-800 transition duration-200 focus:outline-none"
            >
              Services
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-800 z-10">
                <Link
                  to="/register-plant"
                  className="block px-4 py-2 text-lg font-semibold hover:bg-green-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Register Plant
                </Link>
                <Link
                  to="/update-plant"
                  className="block px-4 py-2 text-lg font-semibold hover:bg-green-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Update Plant
                </Link>
                <Link
                  to="/delete-plant"
                  className="block px-4 py-2 text-lg font-semibold hover:bg-green-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Delete Plant
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/zone-wise-plant-details"
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-6 py-2 rounded-xl text-lg font-semibold hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-800 transition duration-200"
          >
            Zone Wise Plant Details
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-6 py-2 rounded-xl text-lg font-semibold hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center mt-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-4 rounded-xl">
          <Link
            to="/"
            className="text-lg font-extrabold hover:text-gray-100 transition duration-200 mb-4"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-lg font-extrabold hover:text-gray-100 transition duration-200 mb-4"
          >
            Services
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="flex flex-col items-center mt-2 bg-gradient-to-r from-gray-100 via-white to-gray-200 rounded-lg shadow-lg text-green-500 z-10 mb-4">
              <Link
                to="/register-plant"
                className="block px-4 py-2 text-lg font-extrabold hover:bg-green-200 hover:text-black rounded-lg w-full text-center"
                onClick={() => {
                  setDropdownOpen(false);
                  setMenuOpen(false);
                }}
              >
                Register Plant
              </Link>
              <Link
                to="/update-plant"
                className="block px-4 py-2 text-lg font-extrabold hover:bg-green-200 hover:text-black rounded-lg w-full text-center"
                onClick={() => {
                  setDropdownOpen(false);
                  setMenuOpen(false);
                }}
              >
                Update Plant
              </Link>
              <Link
                to="/delete-plant"
                className="block px-4 py-2 text-lg font-extrabold hover:bg-green-200 hover:text-black rounded-lg w-full text-center"
                onClick={() => {
                  setDropdownOpen(false);
                  setMenuOpen(false);
                }}
              >
                Delete Plant
              </Link>
            </div>
          )}
          <Link
            to="/zone-wise-plant-details"
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-6 py-2 rounded-md text-lg font-extrabold hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-800 transition duration-200 mb-4 text-center"
            onClick={toggleMenu}
          >
            Zone Wise Plant Details
          </Link>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-6 py-2 rounded-md text-lg font-extrabold hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 transition duration-200 mb-4 text-center"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
