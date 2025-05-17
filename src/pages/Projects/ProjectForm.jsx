import React, { useState, useEffect, useRef } from "react";
import "../../styles/style.css";

const ProjectForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    tasks: [{ name: "", dueDate: "", status: "pending" }],
  });

  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index][field] = value;
    setFormData({ ...formData, tasks: newTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, { name: "", dueDate: "", status: "pending" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      tasks: [{ name: "", dueDate: "", status: "pending" }],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              name="title"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                name="startDate"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                name="endDate"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe the project..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Tasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Tasks
            </label>
            <div className="space-y-2">
              {formData.tasks.map((task, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Task name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={task.name}
                    onChange={(e) =>
                      handleTaskChange(i, "name", e.target.value)
                    }
                    required
                  />
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={task.dueDate}
                    onChange={(e) =>
                      handleTaskChange(i, "dueDate", e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTask}
              className="mt-3 text-sm font-medium text-blue-600 hover:underline"
            >
              + Add task
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
