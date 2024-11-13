import React, { useState } from "react";
import PropTypes from "prop-types";

const UserTable = ({
  users,
  onEdit,
  onUpdate,
  onDelete,
  onRegeneratePassword,
}) => {
  // State for managing confirmation popup visibility and selected user ID
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(userToDelete); // Call the onDelete function with the selected userId
    setShowConfirm(false); // Close the confirmation popup
  };

  const handleCancelDelete = () => {
    setShowConfirm(false); // Close the confirmation popup
    setUserToDelete(null); // Clear selected user ID
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-sm sm:text-base">First Name</th>
              <th className="p-2 text-sm sm:text-base">Last Name</th>
              <th className="p-2 text-sm sm:text-base">Email</th>
              <th className="p-2 text-sm sm:text-base">Zone</th>
              <th className="p-2 text-sm sm:text-base">Phone</th>
              <th className="p-2 text-sm sm:text-base">Role</th>
              <th className="p-2 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2 text-sm sm:text-base">{user.firstname}</td>
                <td className="p-2 text-sm sm:text-base">{user.lastname}</td>
                <td className="p-2 text-sm sm:text-base">{user.email}</td>
                <td className="p-2 text-sm sm:text-base">{user.zone}</td>
                <td className="p-2 text-sm sm:text-base">{user.phone}</td>
                <td className="p-2 text-sm sm:text-base">{user.role}</td>
                <td className="p-2 flex flex-wrap justify-center space-x-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => onEdit(user)} // Calls onEdit to open the edit form
                      className="text-white  bg-blue-600 mb-2 text-xs font-bold sm:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)} // Calls handleDeleteClick to show the confirmation popup
                      className="text-white bg-red-500 mb-2 text-xs font-bold sm:text-base"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onRegeneratePassword(user.email)}
                      className="text-white bg-green-500 mb-2 text-xs font-bold sm:text-base"
                    >
                      Regenerate Password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <p className="text-lg">
              Are you sure you want to delete this user?
            </p>
            <div className="mt-4 flex justify-between space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 w-full sm:w-auto"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      email: PropTypes.string.isRequired,
      zone: PropTypes.string,
      phone: PropTypes.string,
      role: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired, // Used to show the editing form
  onUpdate: PropTypes.func.isRequired, // Should be called when the user submits the edit form
  onDelete: PropTypes.func.isRequired,
  onRegeneratePassword: PropTypes.func.isRequired,
};

export default UserTable;
