// src/components/Card/ProjectCard.jsx
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const ProjectCard = ({ project }) => {
  const { title, startDate, endDate, progress, tasks } = project;

  return (
    <div className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition cursor-pointer">
      <h3 className="text-xl font-bold mb-2">{title}</h3>

      <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <FaCalendarAlt />
        <span>{startDate} → {endDate}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="h-3 rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h4 className="text-sm font-semibold mb-1 text-gray-700">Tareas próximas:</h4>
      <ul className="text-sm text-gray-600 list-disc pl-4">
        {tasks.slice(0, 3).map((task, i) => (
          <li key={i}>{task.title} – {task.dueDate}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectCard;
