import React from "react";
import "../../styles/ReadOnlyProjectModal.css"; // Puedes crear este archivo para estilos

const ReadOnlyProjectModal = ({ isOpen, project, onClose }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="readonly-modal-backdrop">
      <div className="readonly-modal">
        <h2>{project.title}</h2>
        <p>
          <strong>Fechas:</strong> {project.startDate} → {project.endDate}
        </p>
        <p>
          <strong>Descripción:</strong>{" "}
          {project.description || "Sin descripción"}
        </p>

        <p>
          <strong>Progreso:</strong> {project.progress}%
        </p>

        <div className="readonly-tasks">
          <h3>Tareas</h3>
          {project.tasks.map((task, index) => (
            <div key={index} className={`task-item ${task.status}`}>
              <p><strong>{task.title}</strong></p>
              <p>Estado: {task.status}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="close-readonly-btn">Cerrar</button>
      </div>
    </div>
  );
};

export default ReadOnlyProjectModal;
