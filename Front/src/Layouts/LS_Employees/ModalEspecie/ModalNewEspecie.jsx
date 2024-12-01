import React, { useState } from 'react';
import "../../../Layouts/Layouts.css";
import { createEspecie } from '../../../Services/especieService';

function ModalNewEspecie({ onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    status: "1", // Agregar el campo status con valor predeterminado '1' (activo)
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre no puede estar vacío.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await createEspecie(formData); // Ahora se envía con el campo status
      alert("Especie creada exitosamente");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al crear la especie:", error);
      alert("Hubo un error al crear la especie.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nueva Especie</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleCreate}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre de la Especie
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalNewEspecie;
