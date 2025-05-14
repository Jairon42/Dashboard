// src/components/WorkerCard.jsx
import React from "react";
import '../../styles/style.css';

const WorkerCard = ({ worker, onClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {worker.photo ? (
          <img
            src={worker.photo}
            alt={worker.name}
            className="w-16 h-16 object-cover rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
            {worker.name?.[0]}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{worker.name}</h3>
          <p className="text-sm text-gray-600">{worker.position}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
