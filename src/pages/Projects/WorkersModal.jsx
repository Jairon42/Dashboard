import React from "react";
import "../../styles/WorkersModal.css"; // Asegúrate de tener o crear este archivo

const WorkersModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Asignar trabajador</h3>
        
        {/* Aquí luego se colocará la lógica y la lista de trabajadores */}
        <p>Contenido del modal aún no implementado.</p>

        <button className="close-modal-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default WorkersModal;
