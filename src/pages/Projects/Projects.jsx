import React, { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";
import ProjectDetails from "./ProjectDetails";
import WorkersModal from "./WorkersModal";
import ReadOnlyProjectModal from "./ReadOnlyProjectModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import "../../styles/style.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [readOnlyProject, setReadOnlyProject] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

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
    const relevantTasks = updatedProject.tasks.filter((t) => t.status !== "incomplete");
    const completedTasks = relevantTasks.filter((t) => t.status === "completed").length;
    const totalTasks = relevantTasks.length;
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
        (
          newProject.tasks.filter((t) => t.status === "completed").length /
          newProject.tasks.filter((t) => t.status !== "incomplete").length
        ) * 100 || 0
      ),
    };
    setProjects([...projects, fullProject]);
    setShowModal(false);
  };

  const handleBackFromDetails = () => {
    setSelectedProject(null);
    setReadOnlyProject(null);
  };

  const handleProjectClick = (project) => {
    if (project.completed) {
      setReadOnlyProject(project);
    } else {
      setSelectedProject(project);
    }
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter((p) => p.id !== projectToDelete.id));
    } else {
      setProjects([]);
    }
    setShowConfirm(false);
    setProjectToDelete(null);
  };

  const reopenProject = (id) => {
    projects.map( (p) => {
      if(p.id === id){
        p.completed = false;
        handleUpdateProject(p);
        setSelectedProject(p);
      }
    })
  }

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={handleBackFromDetails}
        onUpdate={handleUpdateProject}
      />
    );
  }

  if (readOnlyProject) {
    return (
      <ReadOnlyProjectModal
        isOpen={true}
        project={readOnlyProject}
        onClose={() => setReadOnlyProject(false)}
        onReopen={reopenProject}
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
            onClick={() => {
              setProjectToDelete(null); // Borrar todos
              setShowConfirm(true);
            }}
          >
            Delete All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="relative bg-white shadow-md rounded-2xl p-4 cursor-pointer hover:shadow-xl transition group"
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                setProjectToDelete(project);
                setShowConfirm(true);
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
            <p className="text-sm text-gray-600">
              Progress: {project.progress}%
            </p>
            {project.completed && (
              <p className="mt-4 text-sm text-green-600 font-semibold">
                ✅ Project Finished
              </p>
            )}
          </div>
        ))}
      </div>

      <ProjectForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProject}
      />

      <ConfirmDialog
        open={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={projectToDelete ? "Delete this project?" : "Delete all projects?"}
        message={
          projectToDelete
            ? "Are you sure you want to delete this project? This action cannot be undone."
            : "Are you sure you want to delete all projects? This action cannot be undone."
        }
        confirmText={projectToDelete ? "Delete" : "Delete All"}
        cancelText="Cancel"
      />
    </div>
  );
};

export default Projects;
