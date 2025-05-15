// src/pages/projects/ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import WorkersModal from "./WorkersModal";
import TaskDetailsPanel from "./TaskDetailsPanel";
import "../../styles/style.css";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Users, Plus, ArrowLeft, Check, Play } from "lucide-react";

const ProjectDetails = ({ project, onBack, onUpdate }) => {
  const [tasks, setTasks] = useState(project.tasks || []);
  const [newTask, setNewTask] = useState({ name: "", dueDate: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [taskDetailIndex, setTaskDetailIndex] = useState(null);
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

  const calcProgress = (tasksArray) =>
    Math.round(
      (tasksArray.filter((t) => t.status === "completed").length /
        tasksArray.filter((t) => t.status !== "incomplete").length) *
        100 || 0
    );
  
  const getTaskStatus = (task) => {
    const today = new Date().toISOString().split("T")[0];
    if (task.status === "completed") {
      const dueDate = new Date(task.dueDate);
      const completionDate = new Date(task.completionDate);
      return completionDate <= dueDate ? "In time" : "Delayed";
    }
    if (!task.start) return new Date(task.dueDate) < new Date(today) ? "Delayed" : "Pending";
    return new Date(task.dueDate) < new Date(today) ? "Delayed" : "In progress";
  };

  const handleStartTask = (index) => {
    const updated = [...tasks];
    updated[index].start = new Date().toISOString().split("T")[0];
    updated[index].status = "inProgress";
    setTasks(updated);
  };

  const handleCompleteTask = (index) => {
    const updated = [...tasks];
    const completionDate = new Date().toISOString().split("T")[0];
    updated[index].status = "completed";
    updated[index].completionDate = completionDate;
    setTasks(updated);
  };

  const handleAddTask = () => {
    if (!newTask.name || !newTask.dueDate) return;

    const updatedTasks = [
      ...tasks,
      { ...newTask, status: "pending", start: null, workers: [], equipment: "" },
    ];
    setTasks(updatedTasks);
    setNewTask({ name: "", dueDate: "" });
    setIsAdding(false);
  };
  

  return (
    <div className="p-6 space-y-6">
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

      <div>
        <h3 className="font-semibold mb-1">About this project:</h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>

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
                    getTaskStatus(task) === "Delayed"
                      ? "destructive"
                      : getTaskStatus(task) === "In time"
                      ? "success"
                      : "outline"
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

      <Button variant="link" onClick={onBack} className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

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
          
            // Persistimos en localStorage
            const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
            const updatedProjects = savedProjects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            );
          
            localStorage.setItem("projects", JSON.stringify(updatedProjects));
          
            setTasks(updatedTasks);
            onUpdate(updatedProject); // Dispara actualización al padre también
            setTaskDetailIndex(null);
          }}
          
          onStart={() => handleStartTask(taskDetailIndex)}
          onComplete={() => handleCompleteTask(taskDetailIndex)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
