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
    <nav className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold hover:text-gray-100 transition duration-200"
        >
          🌿 Plant Tracker
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
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
          <Link to="/" className="hover:text-gray-100 transition duration-200">
            Home
          </Link>

          {/* Dropdown for Services */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center hover:text-gray-100 transition duration-200 focus:outline-none"
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
                  className="block px-4 py-2 hover:bg-green-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Register Plant
                </Link>
                <Link
                  to="/update-plant"
                  className="block px-4 py-2 hover:bg-green-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Update Plant
                </Link>
                <Link
                  to="/delete-plant"
                  className="block px-4 py-2 hover:bg-green-100"
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
            className="bg-violet-500 px-4 py-2 rounded-md hover:bg-violet-600 transition duration-200"
          >
            Zone Wise Plant Details
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center mt-4">
          <Link
            to="/"
            className="hover:text-gray-100 transition duration-200 mb-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <button
            onClick={toggleDropdown}
            className="flex items-center hover:text-gray-100 transition duration-200 mb-2"
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
            <div className="flex flex-col items-center mt-2 bg-gray-200 rounded-lg shadow-lg text-gray-800 z-10 mb-4">
              <Link
                to="/register-plant"
                className="block px-4 py-2 hover:bg-green-100 w-full text-center"
                onClick={() => {
                  setDropdownOpen(false);
                  setMenuOpen(false);
                }}
              >
                Register Plant
              </Link>
              <Link
                to="/update-plant"
                className="block px-4 py-2 hover:bg-green-100 w-full text-center"
                onClick={() => {
                  setDropdownOpen(false);
                  setMenuOpen(false);
                }}
              >
                Update Plant
              </Link>
              <Link
                to="/delete-plant"
                className="block px-4 py-2 hover:bg-green-100 w-full text-center"
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
            className="bg-violet-500 px-4 py-2 rounded-md hover:bg-violet-600 transition duration-200 mb-2 text-center"
            onClick={toggleMenu}
          >
            Zone Wise Plant Details
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 text-center"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
