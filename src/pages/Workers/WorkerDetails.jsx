import React, { useEffect, useState } from "react";
import { Mail, Phone, Briefcase, Calendar, UserCheck } from "lucide-react";
import "../../styles/style.css";

const WorkerDetails = ({ isOpen, worker, onClose, onFire }) => {
  const [experience, setExperience] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (worker) {
      const storedWorkers = localStorage.getItem("workers");
      if (storedWorkers) {
        const workers = JSON.parse(storedWorkers);
        const currentWorker = workers.find((w) => w.email === worker.email);
        if (currentWorker) {
          calculateExperience(currentWorker.hiringDate);
        }
      }
      setFeedback(worker.feedback || "");
    }
  }, [worker]);

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
    setExperience(result);
  };

  const handleFeedbackChange = (e) => {
    const value = e.target.value;
    setFeedback(value);
    updateWorkerInfo("feedback", value);
  };

  const updateWorkerInfo = (field, value) => {
    const stored = localStorage.getItem("workers");
    if (stored) {
      const workers = JSON.parse(stored);
      const updated = workers.map((w) =>
        w.email === worker.email ? { ...w, [field]: value } : w
      );
      localStorage.setItem("workers", JSON.stringify(updated));
    }
  };

  const handleFireWorker = () => {
    if (onFire && worker?.email) {
      onFire(worker.email);
    }
  };

  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-5xl relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Perfil y datos */}
          <div className="col-span-1 flex flex-col items-center">
            {worker.photo ? (
              <img
                src={worker.photo}
                alt={worker.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl">
                {worker.name?.[0] || "?"}
              </div>
            )}
            <h2 className="text-2xl font-bold mt-4">{worker.name}</h2>
            <p className="text-blue-600 font-medium">{worker.position}</p>
            <span className="mt-2 text-sm inline-flex items-center gap-2 text-green-600 font-medium">
              <UserCheck size={16} /> Activo
            </span>

            <div className="mt-6 space-y-2 text-sm text-gray-700 w-full">
              <div className="flex items-center gap-2">
                <Briefcase size={16} /> <span>{worker.position}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> <span>{worker.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> <span>{worker.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} /> <span>{worker.hiringDate}</span>
              </div>
              {experience && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> <span>{experience} de experiencia</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna 2: Feedback y eficiencia */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Eficiencia:</label>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-gray-400 h-full w-1/3"></div>
              </div>
              <p className="text-gray-600 text-xs mt-1">Pendiente de calcular</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Feedback:</label>
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                rows={4}
                className="w-full p-3 border rounded-lg resize-none"
                placeholder="Añade aquí tus comentarios sobre desempeño, actitud, puntualidad..."
              />
            </div>

            {/* Espacio para tareas y proyectos */}
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-semibold mb-2">Proyectos y tareas asignadas</h3>
              <p className="text-gray-500 text-sm">Aquí se mostrarán los proyectos y tareas del trabajador.</p>
            </div>

            {/* Timeline */}
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-semibold mb-2">Historial reciente</h3>
              <p className="text-gray-500 text-sm">Aquí se mostrará un mini timeline de actividades recientes.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFireWorker}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Despedir trabajador
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetails;
