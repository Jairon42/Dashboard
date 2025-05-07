import React, { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";
import ProjectDetails from "./ProjectDetails";
import WorkersModal from "./WorkersModal";
import ReadOnlyProjectModal from "./ReadOnlyProjectModal";
import "../../styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [readOnlyProject, setReadOnlyProject] = useState(null); // Para el futuro modal de solo vista

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      setProjects(JSON.parse(stored)); // Establecer proyectos si existen en localStorage
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects)); // Guardar en localStorage
    }
  }, [projects]);

  const handleUpdateProject = (updatedProject) => {
    const completedTasks = updatedProject.tasks.filter(t => t.status === "completed").length;
    const totalTasks = updatedProject.tasks.length;
    const newProgress = Math.round((completedTasks / totalTasks) * 100 || 0);

    const updated = {
      ...updatedProject,
      progress: newProgress,
    };

    const updatedProjects = projects.map((p) =>
      p.id === updated.id ? updated : p
    );
    setProjects(updatedProjects);
  };

  const handleSaveProject = (newProject) => {
    const fullProject = {
      ...newProject,
      id: crypto.randomUUID(),
      completed: false,
      progress: Math.round(
        (newProject.tasks.filter((t) => t.status === "completed").length / 
          newProject.tasks.length) * 100 || 0
      ),
    };
    setProjects([...projects, fullProject]);
    setShowModal(false);
  };

  const handleBackFromDetails = () => {
    setSelectedProject(null);
  };

  const handleFinalizeProject = (id) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        return { ...p, completed: true };
      }
      return p;
    });
    setProjects(updated);
  };

  const handleProjectClick = (project) => {
    if (project.completed) {
      setReadOnlyProject(project); // Mostraremos luego un modal solo lectura
    } else {
      setSelectedProject(project);
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={handleBackFromDetails}
        onUpdate={handleUpdateProject}
      />
    );
  }

  return (
    <div className="project-container">
      <div className="project-header">
        <h2>Projects</h2>
        <button className="add-project-btn" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      <div className="project-cards-display">
        {projects.map((project) => {
          const allTasksCompleted = project.tasks.length > 0 &&
            project.tasks.every(t => t.status === "completed");

          return (
            <div
              key={project.id}
              className="card-container"
              onClick={() => handleProjectClick(project)}
            >
              <h3 className="card-title">
              {project.title && project.title.length > 20
                ? project.title.substring(0, 20) + "..."
                : project.title}
              </h3>
              <p className="card-dates">
                {project.startDate} → {project.endDate}
              </p>

              <p className="card-description">
                {project.description && project.description.length > 20
                ? project.description.substring(0, 20) + "..."
                : project.description}
              </p>

              <div className="card tasks">
                <strong>{project.tasks.length}</strong> tareas registradas
              </div>

              <div className="card-progress-bar">
                <div
                  className="card-progress-bar-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <p className="card-progres">
                Progreso: {project.progress}%
              </p>

              {!project.completed && allTasksCompleted && (
                <button
                  className="finalize-project-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // evita abrir detalles
                    handleFinalizeProject(project.id);
                  }}
                >
                  Finalizar proyecto
                </button>
              )}

              {project.completed && (
                <p className="project-completed-text">✅ Proyecto Finalizado</p>
              )}
            </div>
          );
        })}
      </div>

      <ProjectForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProject}
      />

      <ReadOnlyProjectModal
        isOpen={!!readOnlyProject}
        project={readOnlyProject}
        onClose={() => setReadOnlyProject(null)}
      />
    </div>
  );
};

export default Projects;
