import React, { useEffect, useState } from "react";
import "../../styles/style.css";

const WorkersModal = ({ task, onClose, onAssign }) => {
  const [allWorkers, setAllWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("workers");
    const parsed = stored ? JSON.parse(stored) : [];
    setAllWorkers(parsed);

    if (task?.workers?.length) {
      const current = parsed.filter((w) =>
        task.workers.some((tw) => tw.id === w.id)
      );
      setSelectedWorkers(current);
    }
  }, [task]);

  const isSelected = (worker) =>
    selectedWorkers.some((w) => w.id === worker.id);

  const assignWorker = (worker) => {
    if (!isSelected(worker)) {
      setSelectedWorkers((prev) => [...prev, worker]);
    }
  };

  const unassignWorker = (workerId) => {
    setSelectedWorkers((prev) => prev.filter((w) => w.id !== workerId));
  };

  const handleAssign = () => {
    onAssign(selectedWorkers);
  };

  const calculateExperience = (dateString) => {
    const startDate = new Date(dateString);
    const now = new Date();
    const years = now.getFullYear() - startDate.getFullYear();
    const months = now.getMonth() - startDate.getMonth();
    const totalMonths = years * 12 + months;
    const result =
      totalMonths < 12
        ? `${totalMonths} mes${totalMonths !== 1 ? "es" : ""}`
        : `${Math.floor(totalMonths / 12)} año${
            Math.floor(totalMonths / 12) !== 1 ? "s" : ""
          } y ${totalMonths % 12} mes${totalMonths % 12 !== 1 ? "es" : ""}`;
    return result;
  };

  const calculateEfficiency = (worker) => {
    return worker.efficiency !== undefined ? `${worker.efficiency}%` : "—";
  };

  const availableWorkers = allWorkers.filter(
    (w) => !isSelected(w)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-6 text-blue-700">
          Asignar trabajadores a: <span className="text-gray-900">{task?.name}</span>
        </h3>

        {/* Trabajadores asignados */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-green-700">🧑‍💼 Trabajadores asignados</h4>
          {selectedWorkers.length === 0 ? (
            <p className="text-gray-500 italic">Ninguno asignado aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedWorkers.map((worker) => (
                <div key={worker.id} className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-green-800">{worker.name}</p>
                  <p className="text-sm text-gray-600">{worker.position}</p>
                  <p className="text-sm text-gray-500">Experiencia: {calculateExperience(worker.hiringDate)}</p>
                  <p className="text-sm text-gray-500">Eficiencia: {calculateEfficiency(worker)}</p>
                  <button
                    className="mt-2 text-red-600 hover:underline text-sm"
                    onClick={() => unassignWorker(worker.id)}
                  >
                    ❌ Desasignar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trabajadores disponibles */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-blue-700">📋 Disponibles para asignar</h4>
          {availableWorkers.length === 0 ? (
            <p className="text-gray-500 italic">No hay trabajadores disponibles para esta tarea.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableWorkers.map((worker) => (
                <div key={worker.id} className="bg-gray-100 rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-800">{worker.name}</p>
                  <p className="text-sm text-gray-600">{worker.position}</p>
                  <p className="text-sm text-gray-500">Experiencia: {calculateExperience(worker.hiringDate)}</p>
                  <p className="text-sm text-gray-500">Eficiencia: {calculateEfficiency(worker)}</p>
                  <button
                    className="mt-2 text-blue-600 hover:underline text-sm"
                    onClick={() => assignWorker(worker)}
                  >
                    ✅ Asignar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar cambios
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkersModal;
