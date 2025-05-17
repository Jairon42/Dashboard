import React, { useEffect, useState } from "react";
import { Undo2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkersModal from "./WorkersModal";

const TaskDetailsPanel = ({ task, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState(task);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

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

  const handleReopenTask = () => {
    const updated = { ...editedTask, status: "inProgress" };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleCancelTask = () => {
    const updated = { ...editedTask, status: "incomplete" };
    setEditedTask(updated);
    onUpdate(updated);
  };

  const handleSave = () => {
    onUpdate(editedTask);
  };

  const handleFieldChange = (field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  // Cierra el panel cuando se hace clic fuera (en el overlay)
  const handleOverlayClick = () => {
    onClose();
  };

  // Evita cerrar el panel cuando se hace clic dentro de él
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay semitransparente que cubre toda la pantalla y cierra el panel al hacer clic */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={handleOverlayClick}
      />

      {/* Panel lateral */}
      <div
        className="fixed right-0 top-[37px] h-[calc(100vh-102px)] w-full sm:w-[500px] bg-white border-l shadow-lg z-50 flex flex-col"
        onClick={handlePanelClick}
      >
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Botones de tarea arriba */}
          <div className="flex flex-wrap gap-2 justify-end mb-4">
            {(editedTask.status === "pending" || editedTask.status === "inProgress") && (
              <Button size="sm" className="w-[45%]" onClick={handleStartTask}>
                {editedTask.status === "inProgress" ? "Completar" : "Iniciar"}
              </Button>
            )}

            {(editedTask.status === "completed" || editedTask.status === "incomplete") && (
              <Button size="sm" variant="outline" className="w-[45%]" onClick={handleReopenTask}>
                <Undo2 className="w-4 h-4 mr-1" /> Reabrir
              </Button>
            )}

            {editedTask.status !== "completed" && editedTask.status !== "incomplete" && (
              <Button size="sm" variant="destructive" className="w-[40%]" onClick={handleCancelTask}>
                Cancelar
              </Button>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={editedTask.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Fecha de entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de entrega</label>
            <input
              type="date"
              value={editedTask.dueDate?.split("T")[0] || ""}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Equipamiento necesario */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Equipamiento necesario</label>
            <textarea
              rows={3}
              value={editedTask.equipment || ""}
              onChange={(e) => handleFieldChange("equipment", e.target.value)}
              className="w-full border rounded px-3 py-2 resize-y"
              placeholder="Especifica el equipo necesario..."
            />
          </div>

          {/* Fechas */}
          {editedTask.startDate && (
            <p className="text-sm text-gray-500">
              Fecha de inicio: {new Date(editedTask.startDate).toLocaleDateString()}
            </p>
          )}
          {editedTask.endDate && (
            <p className="text-sm text-gray-500">
              Fecha de finalización: {new Date(editedTask.endDate).toLocaleDateString()}
            </p>
          )}

          {/* Estado */}
          {editedTask.status === "incomplete" && (
            <p className="text-red-600 font-semibold">Esta tarea fue cancelada.</p>
          )}
          {editedTask.status === "completed" && (
            <p className="text-green-600 font-semibold">Esta tarea fue completada.</p>
          )}

          {/* Trabajadores asignados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trabajadores asignados
            </label>
            {editedTask.workers?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {editedTask.workers.map((worker) => (
                  <span
                    key={worker.id}
                    className="bg-gray-100 text-sm px-3 py-1 rounded-full border text-gray-800"
                  >
                    {worker.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No hay trabajadores asignados.</p>
            )}

            {/* Botón para asignar trabajadores */}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowWorkerModal(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Asignar Trabajadores
            </Button>
          </div>

          {/* Botón para guardar cambios */}
          <div>
            <Button className="w-full mt-4" onClick={handleSave}>
              Guardar cambios
            </Button>
          </div>
        </div>

        {/* Botón para cerrar panel */}
        <div className="p-2 border-t text-right bg-gray-50">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Cerrar panel ✖
          </button>
        </div>
      </div>

      {/* Modal para asignar trabajadores */}
      {showWorkerModal && (
        <WorkersModal
          task={editedTask}
          onClose={() => setShowWorkerModal(false)}
          onAssign={(assignedWorkers) => {
            const updated = { ...editedTask, workers: assignedWorkers };
            setEditedTask(updated);
            onUpdate(updated);
            setShowWorkerModal(false);
          }}
        />
      )}
    </>
  );
};

export default TaskDetailsPanel;
