// Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-800 text-white p-10 text-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Plant Management Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          {/* Dropdown for Services */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:text-gray-300 focus:outline-none"
            >
              Services
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-gray-800">
                <Link
                  to="/register-plant"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Register Plant
                </Link>
                <Link
                  to="/update-plant"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Update Plant
                </Link>
                <Link
                  to="/delete-plant"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Delete Plant
                </Link>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button onClick={logout} className="hover:text-gray-300">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
