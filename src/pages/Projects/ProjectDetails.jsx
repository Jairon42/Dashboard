// src/pages/projects/ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import WorkersModal from "./WorkersModal";
import "../../styles/Projects.css";

const ProjectDetails = ({ project, onBack, onUpdate }) => {
  const [tasks, setTasks] = useState(project.tasks || []);
  const [newTask, setNewTask] = useState({ name: "", dueDate: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

  useEffect(() => {
    const updatedProject = {
      ...project,
      tasks,
      progress: calcProgress(tasks),
    };
    onUpdate(updatedProject);
  }, [tasks]);

  const calcProgress = (tasksArray) =>
    Math.round(
      (tasksArray.filter((t) => t.status === "completed").length /
        tasksArray.length) *
        100 || 0
    );

  const getTaskStatus = (task) => {
    const today = new Date().toISOString().split("T")[0];
    if (task.status === "completed") return "Completada";
    if (!task.start) return new Date(task.dueDate) < new Date(today) ? "Retrasada" : "Pendiente";
    return new Date(task.dueDate) < new Date(today) ? "Retrasada" : "En progreso";
  };

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

  const handleAddTask = () => {
    if (!newTask.name || !newTask.dueDate) return;

    const updatedTasks = [
      ...tasks,
      { ...newTask, status: "pending", start: null, workers: [] },
    ];
    setTasks(updatedTasks);
    setNewTask({ name: "", dueDate: "" });
    setIsAdding(false);
  };

  const handleAssignWorkers = (taskIndex, selectedWorkers) => {
    const updated = [...tasks];
    updated[taskIndex].workers = selectedWorkers;
    setTasks(updated);
    setShowModal(false);
  };

  return (
    <div className="details-container">
      <div className="header-row">
        <div><strong>Proyecto:</strong> {project.title}</div>
        <div><strong>Fechas:</strong> {project.startDate} → {project.endDate}</div>
        <div><strong>Progreso:</strong> {calcProgress(tasks)}%</div>
      </div>

      <div className="description">{project.description}</div>

      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: "120px" }}>Nombre</th>
            <th style={{ width: "600px"}}>Acción</th>
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
              <td>{task.name}</td>
              <td>{task.start || "—"}</td>
              <td>{task.dueDate}</td>
              <td>{getTaskStatus(task)}</td>
              <td>
                <button onClick={() => { setSelectedTaskIndex(i); setShowModal(true); }}>
                  👥 {task.workers?.length || 0}
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan="6">
              {isAdding ? (
                <div className="add-task-row">
                  <input
                    type="text"
                    placeholder="Nombre de la tarea"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  />
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <button onClick={handleAddTask}>Guardar</button>
                  <button onClick={() => setIsAdding(false)}>Cancelar</button>
                </div>
              ) : (
                <button onClick={() => setIsAdding(true)}>+ Añadir nueva tarea</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <button className="back-btn" onClick={onBack}>← Volver</button>

      {tasks.length > 0 && tasks.every(t => t.status === "completed") && !project.completed && (
        <p className="project-completed-text">✅ Proyecto completado</p>
      )}

      {showModal && (
        <WorkersModal
          task={tasks[selectedTaskIndex]}
          onClose={() => setShowModal(false)}
          onAssign={(selected) => handleAssignWorkers(selectedTaskIndex, selected)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
