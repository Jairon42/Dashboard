// src/pages/projects/ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import WorkersModal from "./WorkersModal";
import TaskDetailsPanel from "./TaskDetailsPanel";
import "../../styles/style.css";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Users, Plus, ArrowLeft } from "lucide-react";

const ProjectDetails = ({ project, onBack, onUpdate }) => {
  const [tasks, setTasks] = useState(project.tasks || []);
  const [newTask, setNewTask] = useState({ name: "", dueDate: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [taskDetailIndex, setTaskDetailIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem("workers");
    return saved ? JSON.parse(saved) : [];
  });

  const saveWorkersToStorage = (updatedWorkers) => {
    localStorage.setItem("workers", JSON.stringify(updatedWorkers));
    setWorkers(updatedWorkers);
  };

  useEffect(() => {
    const updatedProject = {
      ...project,
      tasks,
      progress: calcProgress(tasks),
    };
    onUpdate(updatedProject);
  }, [tasks]);

  const calcProgress = (tasksArray) => {
    const validTasks = tasksArray.filter((t) => t.status !== "incomplete");
    if (validTasks.length === 0) return 0;
    const completed = validTasks.filter((t) => t.status === "completed").length;
    return Math.round((completed / validTasks.length) * 100);
  };

  const getTaskStatus = (task) => {
    const today = new Date().toISOString().split("T")[0];
    if (task.status === "completed") {
      const dueDate = new Date(task.dueDate);
      const completionDate = new Date(task.completionDate);
      return completionDate <= dueDate ? "In time" : "Delayed";
    }
    if (!task.start) return new Date(task.dueDate) < new Date(today) ? "Delayed" : "Pending";
    return new Date(task.dueDate) < new Date(today) ? "Delayed" : "inProgress";
  };

  const handleAssignWorkers = (taskIndex, selectedWorkers) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[taskIndex];
    task.workers = selectedWorkers;

    const updatedWorkers = workers.map((worker) => {
      const isAssigned = selectedWorkers.some((w) => w.id === worker.id);
      if (isAssigned) {
        const alreadyHasTask = worker.tasks?.some(
          (t) => t.taskName === task.name && t.projectName === project.title
        );
        if (!alreadyHasTask) {
          return {
            ...worker,
            tasks: [
              ...(worker.tasks || []),
              {
                taskName: task.name,
                projectName: project.title,
                dueDate: task.dueDate,
                status: "assigned",
              },
            ],
          };
        }
      }
      return worker;
    });

    saveWorkersToStorage(updatedWorkers);
    setTasks(updatedTasks);
    setShowModal(false);
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
    updated[index].completionDate = new Date().toISOString().split("T")[0];
    setTasks(updated);
  };

  const handleAddTask = () => {
    if (!newTask.name || !newTask.dueDate) return;
    const updatedTasks = [...tasks, {
      ...newTask,
      status: "pending",
      start: null,
      workers: [],
      equipment: ""
    }];
    setTasks(updatedTasks);
    setNewTask({ name: "", dueDate: "" });
    setIsAdding(false);
  };

  const handleFinalizeProject = (id, forceIncomplete = false) => {
    const saved = JSON.parse(localStorage.getItem("projects")) || [];
    const updated = saved.map((p) => {
      if (p.id === id) {
        const currentDate = new Date();
        const projectEndDate = new Date(p.endDate);
        const completedOnTime = currentDate <= projectEndDate;
        return {
          ...p,
          completed: true,
          actualEndDate: currentDate.toLocaleDateString(),
          completedOnTime,
          forceIncomplete,
          readonly: true,
        };
      }
      onBack();
      return p;
    });

    localStorage.setItem("projects", JSON.stringify(updated));
    onUpdate(updated.find((p) => p.id === id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-sm text-muted-foreground">{project.startDate} → {project.endDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Progress: {calcProgress(tasks)}%</Badge>
          {tasks.length > 0 &&
            tasks.every(t => t.status === "completed" || t.status === "incomplete") &&
            !project.completed && (
              <Badge variant="success">✅ Project Finished</Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-1">About this project:</h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Task</th>
              <th className="px-4 py-2">Start</th>
              <th className="px-4 py-2">Due</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Workers</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr
                key={i}
                className={`cursor-pointer hover:bg-muted 
                  ${task.status === "completed" ? "bg-green-100" : ""} 
                  ${task.status === "incomplete" ? "bg-red-200" : ""}`}
                onClick={() => setTaskDetailIndex(i)}
              >
                <td className="px-4 py-2">{task.name}</td>
                <td className="px-4 py-2">{task.start || "—"}</td>
                <td className="px-4 py-2">{task.dueDate}</td>
                <td className="px-4 py-2">
                  <Badge variant={
                    getTaskStatus(task) === "Delayed" ? "destructive" :
                    getTaskStatus(task) === "In time" ? "success" :
                    "outline"
                  }>
                    {getTaskStatus(task)}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedTaskIndex(i); setShowModal(true); }}
                    disabled={task.status === "completed" || task.status === "incomplete"}
                  >
                    <Users className="w-4 h-4 mr-1" /> {task.workers?.length || 0}
                  </Button>
                </td>
              </tr>
            ))}

            {/* Add Task */}
            <tr>
              <td colSpan="5" className="px-4 py-4">
                {isAdding ? (
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <input
                      type="text"
                      placeholder="Task name"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      className="input w-full md:w-1/3"
                    />
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="input"
                    />
                    <Button size="sm" onClick={handleAddTask}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Add new task
                  </Button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Buttons */}
      <Button variant="link" onClick={onBack} className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <Button
        onClick={() => {
          const isFullyCompleted = tasks.every(
            (t) => t.status === "completed" || t.status === "incomplete"
          );
          if (isFullyCompleted) {
            handleFinalizeProject(project.id);
          } else {
            setShowConfirm(true);
          }
        }}
      >
        Finalizar proyecto
      </Button>

      {/* Modals */}
      {showModal && (
        <WorkersModal
          task={tasks[selectedTaskIndex]}
          onClose={() => setShowModal(false)}
          onAssign={(selected) => handleAssignWorkers(selectedTaskIndex, selected)}
        />
      )}

      {taskDetailIndex !== null && (
        <TaskDetailsPanel
          task={tasks[taskDetailIndex]}
          onClose={() => setTaskDetailIndex(null)}
          onUpdate={(updatedTask) => {
            const updatedTasks = [...tasks];
            updatedTasks[taskDetailIndex] = updatedTask;

            const updatedProject = {
              ...project,
              tasks: updatedTasks,
              progress: calcProgress(updatedTasks),
            };

            const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
            const updatedProjects = savedProjects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            );
            localStorage.setItem("projects", JSON.stringify(updatedProjects));
            setTasks(updatedTasks);
            onUpdate(updatedProject);
            setTaskDetailIndex(null);
          }}
          onStart={() => handleStartTask(taskDetailIndex)}
          onComplete={() => handleCompleteTask(taskDetailIndex)}
        />
      )}

      <ConfirmDialog
        open={showConfirm}
        onClose={setShowConfirm}
        onConfirm={() => {
          handleFinalizeProject(project.id, true);
          setShowConfirm(false);
        }}
        title="¿Finalizar proyecto como incompleto?"
        message="Hay tareas que aún no están completadas. ¿Deseas finalizar el proyecto igualmente?"
        confirmText="Finalizar como incompleto"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ProjectDetails;
