import React, { useState } from "react";

const UserEditForm = ({ user, onSave, onCancel }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting updated user:", updatedUser);
    onSave(updatedUser); // Pass updated user to onSave (onUpdate)
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md">
      <div>
        <label className="block">First Name</label>
        <input
          type="text"
          name="firstname"
          value={updatedUser.firstname}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        <label className="block">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={updatedUser.lastname}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        <label className="block">Email</label>
        <input
          type="email"
          name="email"
          value={updatedUser.email}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        <label className="block">Phone</label>
        <input
          type="text"
          name="phone"
          value={updatedUser.phone}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        <label className="block">Zone</label>
        <input
          type="text"
          name="zone"
          value={updatedUser.zone}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
      </div>
      <div>
        <label className="block">Role</label>
        <input
          type="text"
          name="role"
          value={updatedUser.role}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
