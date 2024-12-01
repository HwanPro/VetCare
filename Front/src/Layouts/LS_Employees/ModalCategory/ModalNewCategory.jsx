import React, { useState } from "react";
import { createCategory } from "../../../Services/categoryService";

function ModalNewCategory({ onClose, onUpdate }) {
    const [categoryData, setCategoryData] = useState({
        name: "",
        timeSpan: "",
        capacity: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateFields = () => {
        const newErrors = {};
        if (!categoryData.name.trim()) {
            newErrors.name = "El nombre no puede estar vacío.";
        }
        if (!categoryData.timeSpan.trim()) {
            newErrors.timeSpan = "El tiempo no puede estar vacío.";
        } else if (!/^(\d{2}):(\d{2}):(\d{2})$/.test(categoryData.timeSpan)) {
            newErrors.timeSpan = "El tiempo debe estar en formato HH:mm:ss.";
        }
        if (!categoryData.capacity.trim() || isNaN(categoryData.capacity) || categoryData.capacity <= 0) {
            newErrors.capacity = "La capacidad debe ser un número mayor a 0.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateCategory = async () => {
        if (!validateFields()) return;

        try {
            await createCategory(categoryData);
            alert("Categoría creada exitosamente");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error al crear categoría:", error);
            alert("Error al crear la categoría. Intente nuevamente.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nueva Categoría</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={categoryData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tiempo (HH:mm:ss)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="timeSpan"
                                value={categoryData.timeSpan}
                                onChange={handleChange}
                            />
                            {errors.timeSpan && <small className="text-danger">{errors.timeSpan}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Capacidad</label>
                            <input
                                type="number"
                                className="form-control"
                                name="capacity"
                                value={categoryData.capacity}
                                onChange={handleChange}
                            />
                            {errors.capacity && <small className="text-danger">{errors.capacity}</small>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleCreateCategory}>
                            Crear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalNewCategory;
