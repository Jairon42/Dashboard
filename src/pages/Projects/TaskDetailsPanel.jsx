import React, { useState } from "react";
import { X, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TaskDetailsPanel = ({ task, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelTask = () => {
    onUpdate({ ...editedTask, status: "incomplete", start: null });
    onClose();
  };

  const handleReopenTask = () => {
    onUpdate({ ...editedTask, status: "pending", completionDate: null });
    onClose();
  };

  const handleSave = () => {
    onUpdate(editedTask);
    onClose();
  };

  // Nuevo handler para iniciar o completar tarea
  const handleStartTask = () => {
    const updated = editedTask;
    if(editedTask.status === "pending" || editedTask.status === "incomplete") {
        updated.start = new Date().toISOString().split("T")[0];
        updated.status = "inProgress";
        setEditedTask(updated);
        onUpdate(editedTask);
        return;
    }
    if(editedTask.status === "inProgress") {
        const completionDate = new Date().toISOString().split("T")[0];
        updated.status = "completed";
        updated.completionDate = completionDate;
        setEditedTask(updated);
        onUpdate(editedTask);
        return;
    }   
  };


  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "incomplete":
        return "Cancelled";
      case "inProgress":
        return "In Progress";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l shadow-lg z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Task Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Task Name</label>
          <Input value={editedTask.name} name="name" onChange={handleInputChange} />
        </div>

        {editedTask.start && (
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <Input value={editedTask.start} readOnly />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <Input
            type="date"
            value={editedTask.dueDate || ""}
            name="dueDate"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <Badge variant="outline">{getStatusLabel(editedTask.status)}</Badge>
        </div>

        <div>
          <label className="block text-sm font-medium">Assigned Workers</label>
          <ul className="text-sm list-disc list-inside text-muted-foreground">
            {editedTask.workers?.length > 0 ? (
              editedTask.workers.map((w) => <li key={w.id}>{w.name}</li>)
            ) : (
              <li>No workers assigned</li>
            )}
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium">Equipment Needed</label>
          <Input
            placeholder="e.g. Laptop, tools..."
            value={editedTask.equipment || ""}
            name="equipment"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Nuevo botón para iniciar o completar */}
          {(editedTask.status === "pending" ||
            editedTask.status === "inProgress") && (
            <Button onClick={handleStartTask}>
              {editedTask.status === "inProgress" ? "Complete Task" : "Start Task"}
            </Button>
          )}

          <Button onClick={handleSave}>Save</Button>

          {(editedTask.status === "completed" || editedTask.status === "incomplete") && (
            <Button variant="outline" onClick={handleReopenTask}>
            <Undo2 className="w-4 h-4 mr-1" /> Reopen
            </Button>
          )}

          {editedTask.status !== "completed" && editedTask.status !== "incomplete" && (
            <Button variant="destructive" onClick={handleCancelTask}>
              <X className="w-4 h-4 mr-1" /> Cancel Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;