/*import React, { useState } from "react";
//import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
//import WorkerCard from "./WorkerCard";

const ReadOnlyProjects = ({ isOpen, project, onClose, onReopen }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const getProjectStatusColor = () => {
    if (project.canceled) return "bg-red-700 text-white";
    if (project.completedWithDelay) return "bg-red-200 text-red-800";
    return "bg-green-200 text-green-800";
  };

  const getTaskStatusColor = (task) => {
    if (task.canceled) return "bg-red-700 text-white";
    if (task.completed && task.delayed) return "bg-red-200 text-red-800";
    if (task.completed) return "bg-green-200 text-green-800";
    return "bg-gray-200 text-gray-800";
  };

  const getProjectStatusText = () => {
    if (project.canceled) return "Cancelado";
    if (project.completedWithDelay) return "Completado con retraso";
    return "Completado a tiempo";
  };

  const showWorkersForTask = (task) => {
    setSelectedTask(task);
    alert("Trabajadores");
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-6 space-y-6">
        
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

        
        <p className="text-gray-700">{project.description}</p>

       
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
                      {task.canceled
                        ? "Cancelada"
                        : task.completed
                        ? task.delayed
                          ? "Retrasada"
                          : "A tiempo"
                        : "Incompleta"}
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

        
        <div className="pt-4 border-t">
          <Button variant="destructive" onClick={() => onReopen(project.id)}>
            Reabrir proyecto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyProjects;*/
