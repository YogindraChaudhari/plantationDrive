import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import UserEditForm from "./UserEditForm";
import {
  getUsers,
  deleteUser,
  updateUser, // Ensure updateUser is imported
  regeneratePassword,
} from "../services/userService";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleUpdate = async (updatedUser) => {
    console.log(users.id);
    try {
      await updateUser(updatedUser); // This will call Firebase to update
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleRegeneratePassword = async (email) => {
    await regeneratePassword(email);
    alert(`Password reset email sent to ${email}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">
        User Management
      </h1>
      <UserTable
        users={users}
        onEdit={handleEditClick}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onRegeneratePassword={handleRegeneratePassword}
      />
      {editingUser && (
        <UserEditForm
          user={editingUser}
          onSave={(updatedUser) => {
            handleUpdate(updatedUser);
            setEditingUser(null); // Close the edit form after saving
          }}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
