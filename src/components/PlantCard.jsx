import React from "react";

const PlantCard = ({ plant }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm">
      <h3 className="text-3xl font-bold mb-2">{plant.name}</h3>
      <p className="text-gray-700 mb-1">
        <strong>Type:</strong> {plant.type}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Height:</strong> {plant.height} ft.
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Health:</strong> {plant.health}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Zone:</strong> {plant.zone}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Plant Number:</strong> {plant.plantNumber}
      </p>
      {plant.imageUrl && (
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-auto rounded-md"
        />
      )}
    </div>
  );
};

export default PlantCard;
