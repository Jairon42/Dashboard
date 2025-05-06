// src/pages/projects/ProjectDetails.jsx
import React, { useState } from "react";
import "../../styles/Projects.css";

const ProjectDetails = ({ project, onBack }) => {
  const [tasks, setTasks] = useState(project.tasks || []);

  const handleStartTask = (index) => {
    const updated = [...tasks];
    updated[index].start = new Date().toISOString().split("T")[0];
    updated[index].status = "inProgress";
    setTasks(updated);
  };

  const handleCompleteTask = (index) => {
    const updated = [...tasks];
    updated[index].status = "completed";
    setTasks(updated);
  };

  const getTaskStatus = (task) => {
    const today = new Date().toISOString().split("T")[0];
    if (task.status === "completed") return "Completada";
    if (!task.start) return new Date(task.dueDate) < new Date(today) ? "Retrasada" : "Pendiente";
    return new Date(task.dueDate) < new Date(today) ? "Retrasada" : "En progreso";
  };

  return (
    <div className="details-container">
      <div className="header-row">
        <div><strong>Proyecto:</strong> {project.title}</div>
        <div><strong>Fechas:</strong> {project.startDate} → {project.endDate}</div>
        <div><strong>Progreso:</strong> {
          Math.round(
            (tasks.filter(t => t.status === "completed").length / tasks.length) * 100 || 0
          )
        }%</div>
      </div>

      <div className="description">{project.description}</div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Acción</th>
            <th>Inicio</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Trabajadores</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={i} className={task.status === "completed" ? "completed" : ""}>
              <td>
                {task.status !== "completed" ? (
                  task.start ? (
                    <button onClick={() => handleCompleteTask(i)}>Completar</button>
                  ) : (
                    <button onClick={() => handleStartTask(i)}>Iniciar</button>
                  )
                ) : (
                  "✔"
                )}
              </td>
              <td>{task.start || "—"}</td>
              <td>{task.dueDate}</td>
              <td>{getTaskStatus(task)}</td>
              <td>
                <button>👥</button>
              </td>
            </tr>
          ))}
          {/* Fila para añadir tarea */}
          <tr>
            <td colSpan="5">
              <button>+ Añadir nueva tarea</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button className="back-btn" onClick={onBack}>← Volver</button>
    </div>
  );
};

export default ProjectDetails;
