import React from "react";
import "../../styles/style.css";

const ReadOnlyProjectModal = ({ isOpen, project, onClose }) => {
  if (!isOpen || !project) return null;

  const bgColor = project.completedOnTime ? "bg-green-100" : "bg-red-100";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl ${bgColor}`}
      >
        <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
        <p className="mb-2">
          <span className="font-semibold">Dates:</span> {project.startDate} →{" "}
          {project.endDate}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Description:</span>{" "}
          {project.description || "Sin descripción"}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Progress:</span> {project.progress}%
        </p>
        <p className="mb-4">
          <span className="font-semibold">Project status:</span>{" "}
          {project.completedOnTime
            ? "Completed on time"
            : "Not completed on time"}
        </p>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tasks</h3>
          {project.tasks.map((task, index) => {
            const isOnTime =
              task.status === "completed" &&
              new Date(task.end || new Date()).getTime() <=
                new Date(task.dueDate).getTime();
            const taskStatus = isOnTime
              ? "Completed on time"
              : "Not completed on time";

            return (
              <div
                key={index}
                className={`mb-4 p-4 rounded-lg border ${
                  task.status === "completed"
                    ? isOnTime
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <p className="font-semibold">{task.name}</p>
                <p className="text-sm">Status: {task.status}</p>
                <p className="text-sm italic">{taskStatus}</p>
                <button
                  onClick={() =>
                    alert(
                      `Trabajadores en tarea: ${task.workers?.join(", ") || "Ninguno"}`
                    )
                  }
                  className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  🧑‍💻 Show workers
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReadOnlyProjectModal;
