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

  const toggleSelect = (worker) => {
    const alreadySelected = selectedWorkers.some((w) => w.id === worker.id);
    if (alreadySelected) {
      setSelectedWorkers((prev) => prev.filter((w) => w.id !== worker.id));
    } else {
      setSelectedWorkers((prev) => [...prev, worker]);
    }
  };

  const isSelected = (worker) =>
    selectedWorkers.some((w) => w.id === worker.id);

  const handleAssign = () => {
    onAssign(selectedWorkers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Asignar trabajadores a: <span className="text-blue-600">{task?.name}</span></h3>

        <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
          {allWorkers.length === 0 ? (
            <p className="text-gray-500">No hay trabajadores registrados.</p>
          ) : (
            allWorkers.map((worker) => (
              <label
                key={worker.id}
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected(worker)}
                  onChange={() => toggleSelect(worker)}
                  className="accent-blue-500"
                />
                <span>{worker.name} — <span className="text-sm text-gray-600">{worker.position}</span></span>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Asignar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkersModal;
