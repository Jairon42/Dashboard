import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import WorkerCard from "./WorkerCard";

const ReadOnlyProjectModal = ({ isOpen, project, onClose, onReopen }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  if (!isOpen || !project) return null;

  const getProjectStatusColor = () => {
    if (project.forceIncomplete) return "bg-red-700 text-white";
    if (!project.completedOnTime) return "bg-red-200 text-red-800";
    return "bg-green-200 text-green-800";
  };

  const getTaskStatusColor = (task) => {
    if (task.status === "incomplete") return "bg-red-700 text-white";
    if (task.status === "completed") {
      const dueDate = new Date(task.dueDate);
      const completionDate = new Date(task.completionDate);
      return completionDate > dueDate
        ? "bg-red-200 text-red-800"
        : "bg-green-200 text-green-800";
    }
    return "bg-gray-200 text-gray-800";
  };

  const getTaskStatusLabel = (task) => {
    if (task.status === "incomplete") return "Cancelada";
    if (task.status === "completed") {
      const dueDate = new Date(task.dueDate);
      const completionDate = new Date(task.completionDate);
      return completionDate > dueDate ? "Retrasada" : "A tiempo";
    }
    return "Desconocido";
  };

  const getProjectStatusText = () => {
    if (!project.completed) return "Cancelado";
    if (!project.completedOnTime) return "Completado con retraso";
    return "Completado a tiempo";
  };

  const showWorkersForTask = (task) => {
    setSelectedTask(task);
    alert("Trabajadores");
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-6 space-y-6">
        {/* ENCABEZADO DEL PROYECTO */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{project.title}</h2>
            <p className="text-gray-500">
              Desde {project.startDate} hasta {project.endDate}
            </p>
          </div>
          <div>
            <Badge className={cn("text-sm", getProjectStatusColor())}>
              {getProjectStatusText()}
            </Badge>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="text-gray-700">{project.description}</p>

        {/* TAREAS */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Tareas</h3>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Fecha entrega</th>
                <th className="p-2">Trabajadores</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{task.name}</td>
                  <td className="p-2">
                    <Badge className={cn("text-xs", getTaskStatusColor(task))}>
                      {getTaskStatusLabel(task)}
                    </Badge>
                  </td>
                  <td className="p-2">{task.dueDate}</td>
                  <td className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showWorkersForTask(task)}
                    >
                      Ver trabajadores
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TRABAJADORES ASIGNADOS A LA TAREA SELECCIONADA */}
        {selectedTask && (
          <div className="mt-4">
            <h4 className="font-semibold text-md mb-2">
              Trabajadores de: {selectedTask.name}
            </h4>
            {selectedTask.workers && selectedTask.workers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedTask.workers.map((worker, i) => (
                  <WorkerCard key={i} worker={worker} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay trabajadores asignados.</p>
            )}
          </div>
        )}

        {/* BOTÓN PARA REABRIR PROYECTO */}
        <div className="pt-4 border-t flex gap-2 items-center">
          <Button variant="destructive" onClick={() => onReopen(project.id)}>
            Reabrir proyecto
          </Button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            ← Volver a Proyectos
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyProjectModal;
