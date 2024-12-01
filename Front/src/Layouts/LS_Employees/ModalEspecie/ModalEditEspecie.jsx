import React, { useState, useEffect } from 'react';
import "../../../Layouts/Layouts.css";
import { getEspecieById, updateEspecie } from '../../../Services/especieService';

function ModalEditEspecie({ especieId, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEspecie = async () => {
      try {
        const data = await getEspecieById(especieId);
        setFormData({ name: data.name });
      } catch (error) {
        console.error("Error al obtener los datos de la especie:", error);
        alert("Hubo un error al cargar los datos de la especie.");
      }
    };

    fetchEspecie();
  }, [especieId]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await updateEspecie(especieId, formData);
      alert("Especie actualizada exitosamente");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar la especie:", error);
      alert("Hubo un error al actualizar la especie.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Especie</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleUpdate}>
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
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalEditEspecie;
