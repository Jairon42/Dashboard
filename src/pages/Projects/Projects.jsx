import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import ProjectDetails from "./ProjectDetails";
import "../../styles/Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSaveProject = (newProject) => {
    const fullProject = {
      ...newProject,
      id: crypto.randomUUID(),
      progress: 0, // luego calculamos esto con base en tareas completadas
    };
    setProjects([...projects, fullProject]);
    setShowModal(false);
  };

  const handleBackFromDetails = () => {
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <div className="project-container">
      <div className="project-header">
        <h2>Projects</h2>
        <button
          className="add-project-btn"
          onClick={() => setShowModal(true)}
        >
          + New Project
        </button>
      </div>

      {/* Lista de proyectos */}
      <div className="project-cards-display">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card-container"
            onClick={() => setSelectedProject(project)}
          >
            <h3 className="card-title">{project.title}</h3>
            <p className="card-dates">
              {project.startDate} → {project.endDate}
            </p>

            <p className="card-description">
              {project.description || "Sin descripción"}
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
              Progress: {project.progress}%
            </p>
          </div>
        ))}
      </div>

      <ProjectForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default Projects;
