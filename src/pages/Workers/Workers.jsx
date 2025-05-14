import React, { useState, useEffect } from "react";
import WorkerCard from "./WorkerCard";
import WorkerDetails from "./WorkerDetails";
import "../../styles/style.css";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    position: "",
    efficiency: "",
    experience: "",
  });

  const [newWorker, setNewWorker] = useState({
    id: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    photo: "",
    hiringDate: "",
  });

  useEffect(() => {
    const storedWorkers = localStorage.getItem("workers");
    if (storedWorkers) {
      const parsed = JSON.parse(storedWorkers);
      setWorkers(parsed);
      setFilteredWorkers(parsed);
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("workers", JSON.stringify(workers));
    }
  }, [workers, hasLoaded]);

  // Filtrado por nombre (y más adelante por otras propiedades)
  useEffect(() => {
    let filtered = workers.filter((worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (filters.position) {
      filtered = filtered.filter((worker) =>
        worker.position.toLowerCase().includes(filters.position.toLowerCase())
      );
    }
    if (filters.efficiency) {
      // Filtrar por eficiencia
    }
    if (filters.experience) {
      // Filtrar por experiencia
    }
  
    setFilteredWorkers(filtered);
  }, [searchTerm, workers, filters]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWorker((prev) => ({ ...prev, [name]: value }));
  };


  const handleAddWorker = (e) => {
    e.preventDefault();
  
    const trimmedNewWorker = {
      ...newWorker,
      id: `${Date.now()}-${Math.random()}`,
      hiringDate: newWorker.hiringDate || null, // Garantiza consistencia
    };
  
    // Verificamos que el email sea único
    const emailExists = workers.some(worker => worker.email === trimmedNewWorker.email);
    if (emailExists) {
      alert("El correo electrónico ya está en uso. Por favor ingresa uno diferente.");
      return;
    }
  
    setWorkers((prev) => [...prev, trimmedNewWorker]);
  
    // Reiniciar formulario
    setNewWorker({
      id: "",
      name: "",
      position: "",
      email: "",
      phone: "",
      photo: "",
      hiringDate: "",
    });
    setShowModal(false);
  };

  const handleFireWorker = (email) => {
    const updatedWorkers = workers.filter((w) => w.email !== email);
    setWorkers(updatedWorkers);
    localStorage.setItem("workers", JSON.stringify(updatedWorkers));
    setSelectedWorker(null); // Cierra el modal
    alert("Trabajador despedido correctamente.");
  };
 
  

  return (
    <div className="p-4 relative">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Trabajadores</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setNewWorker({
              id: "",
              name: "",
              position: "",
              email: "",
              phone: "",
              photo: "",
              hiringDate: "",
            });
            setShowModal(true);
          }}          
        >
          Añadir trabajador
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          value={filters.position}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, position: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">Filtrar por cargo</option>
          {/* Opciones reales más adelante */}
          <option value="Developer">Developer</option>
          <option value="Diseñador">Diseñador</option>
        </select>
        <select
          value={filters.efficiency}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, efficiency: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">Filtrar por eficiencia</option>
        </select>
        <select
          value={filters.experience}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, experience: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">Filtrar por experiencia</option>
        </select>
      </div>

      {/* Descripción de empresa */}
      <div className="mb-6 p-4 bg-gray-50 border rounded shadow-sm">
        <p className="text-gray-700">
          Empresa dedicada a la innovación tecnológica y desarrollo de
          soluciones eficientes. Aquí podrás gestionar a tu equipo, revisar su
          rendimiento, asignarlos a proyectos y mucho más.
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredWorkers.map((worker, index) => (
          <WorkerCard
            key={index}
            worker={worker}
            onClick={() => setSelectedWorker(worker)}
          />
        ))}
      </div>

      {/* Modal para añadir trabajador */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Nuevo trabajador</h2>
            <form onSubmit={handleAddWorker} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newWorker.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="position"
                value={newWorker.position}
                onChange={handleChange}
                placeholder="Cargo / posición"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={newWorker.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                name="phone"
                value={newWorker.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewWorker((prev) => ({
                        ...prev,
                        photo: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="hiringDate"
                value={newWorker.hiringDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewWorker({ id: "", name: "", position: "", email: "", phone: "", photo: "", hiringDate: "" });
                  }}                  
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      <WorkerDetails
        isOpen={!!selectedWorker}
        worker={selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onFire={handleFireWorker}
      />

    </div>
  );
};

export default Workers;
