import React, { useState, useEffect } from 'react';
import "../../../Layouts/Layouts.css";
import { createRace } from '../../../Services/raceService';
import { listActiveEspecies } from '../../../Services/especieService';

function ModalNewRace({ onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    especieId: "",
  });
  const [especies, setEspecies] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadEspecies = async () => {
      try {
        const data = await listActiveEspecies();
        setEspecies(data.content || []);
      } catch (error) {
        console.error("Error al cargar las especies:", error);
      }
    };
    loadEspecies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre no puede estar vacío.";
    }
    if (!formData.especieId) {
      newErrors.especieId = "Debe seleccionar una especie.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await createRace({
        name: formData.name,
        especie: { idEspecie: formData.especieId },
      });
      alert("Raza creada exitosamente");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al crear la raza:", error);
      alert("Hubo un error al crear la raza.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nueva Raza</h5>
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
                  Nombre de la Raza
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
              <div className="mb-3">
                <label htmlFor="especieId" className="form-label">
                  Especie
                </label>
                <select
                  id="especieId"
                  name="especieId"
                  className={`form-select ${errors.especieId ? "is-invalid" : ""}`}
                  value={formData.especieId}
                  onChange={handleChange}
                >
                  <option value="">Seleccione una especie</option>
                  {especies.map((especie) => (
                    <option key={especie.idEspecie} value={especie.idEspecie}>
                      {especie.name}
                    </option>
                  ))}
                </select>
                {errors.especieId && (
                  <div className="invalid-feedback">{errors.especieId}</div>
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

export default ModalNewRace;
