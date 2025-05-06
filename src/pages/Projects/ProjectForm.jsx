// src/components/NewProjectModal.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../styles/Projects.css";

const ProjectForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    tasks: [{ name: "", dueDate: "" }],
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
      tasks: [...formData.tasks, { name: "", dueDate: "" }],
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
      tasks: [{ name: "", dueDate: "" }],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" ref={modalRef}>
        <h2 className="modal-title">New Project</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="title"
            placeholder="Project name"
            className="input"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <div className="input-group">
            <input
              name="startDate"
              type="date"
              className="input half"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <input
              name="endDate"
              type="date"
              className="input half"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            name="description"
            placeholder="Description (optional)"
            className="textarea"
            rows={2}
            value={formData.description}
            onChange={handleChange}
          />

          <div className="task-list">
            <label className="label">Initial tasks:</label>
            {formData.tasks.map((task, i) => (
              <div key={i} className="task-row">
                <input
                  type="text"
                  placeholder="Nombre tarea"
                  className="input task-name"
                  value={task.name}
                  onChange={(e) =>
                    handleTaskChange(i, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="date"
                  className="input task-date"
                  value={task.dueDate}
                  onChange={(e) =>
                    handleTaskChange(i, "dueDate", e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTask}
              className="add-task-btn"
            >
              + Add task
            </button>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn cancel-btn">
              Cancel
            </button>
            <button type="submit" className="btn save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
