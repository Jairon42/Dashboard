import React, { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";
import ProjectDetails from "./ProjectDetails";
import WorkersModal from "./WorkersModal";
import ReadOnlyProjectModal from "./ReadOnlyProjectModal";
import "../../styles/style.css";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center animate-scaleIn">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Are you sure you want to continue?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [readOnlyProject, setReadOnlyProject] = useState(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
  const stored = localStorage.getItem("projects");
  if (stored) {
    setProjects(JSON.parse(stored));
  }
  setHasLoaded(true);
}, []);

useEffect(() => {
  if (hasLoaded) {
    localStorage.setItem("projects", JSON.stringify(projects));
  }
}, [projects, hasLoaded]);
  

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
    const updated = projects.map((p) => {
      if (p.id === id) {
        const currentDate = new Date();
        const projectEndDate = new Date(p.endDate);
  
        const completedOnTime = currentDate <= projectEndDate;
        const realEndDate = completedOnTime ? currentDate : projectEndDate;
  
        return {
          ...p,
          completed: true,
          actualEndDate: realEndDate.toLocaleDateString(),
          completedOnTime,
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const handleProjectClick = (project) => {
    if (project.completed) {
      setReadOnlyProject(project);
    } else {
      setSelectedProject(project);
    }
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    setConfirmDeleteModalOpen(false);
  };

  const handleDeleteAllProjects = () => {
    localStorage.removeItem("projects");
    setProjects([]);
    setConfirmDeleteModalOpen(false);
  };  

  const handleDeleteProjectClick = (project) => {
    setProjectToDelete(project);
    setConfirmDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteModalOpen(false);
    setProjectToDelete(null);
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Company Projects</h2>
        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            New Project
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
            onClick={() => setConfirmDeleteModalOpen(true)}
          >
            Delete All
          </button>
        </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const allTasksCompleted = project.tasks.length > 0 &&
            project.tasks.every(t => t.status === "completed");
  
          return (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="relative bg-white shadow-md rounded-2xl p-4 cursor-pointer hover:shadow-xl transition group"
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProjectClick(project);
                }}
              >
                &times;
              </button>
  
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {project.startDate} → {project.endDate}
              </p>
  
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {project.description}
              </p>
  
              <p className="text-sm font-medium text-gray-700 mb-2">
                🧩 {project.tasks.length} Tasks
              </p>
  
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Progress: {project.progress}%</p>
  
              {!project.completed && allTasksCompleted && (
                <button
                  className="mt-4 w-full bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFinalizeProject(project.id);
                  }}
                >
                  Finalizar proyecto
                </button>
              )}
  
              {project.completed && (
                <p className="mt-4 text-sm text-green-600 font-semibold">
                  ✅ Project Finished
                </p>
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
  
      <ConfirmationModal
        isOpen={confirmDeleteModalOpen && projectToDelete !== null}
        onConfirm={() => handleDeleteProject(projectToDelete.id)}
        onCancel={handleCancelDelete}
      />
  
      <ConfirmationModal
        isOpen={confirmDeleteModalOpen && projectToDelete === null}
        onConfirm={handleDeleteAllProjects}
        onCancel={handleCancelDelete}
      />
    </div>
  );
  
};

export default Projects;
