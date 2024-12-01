import React, { useState } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import { searchCategoryByName } from '../../../Services/categoryService';
import { searchEspecieByName } from '../../../Services/especieService';
import { createService } from '../../../Services/serviceService';

function ModalNewService({ onClose, onUpdate }) {
    const [serviceData, setServiceData] = useState({
        name: '',
        categoryName: '',
        categoryId: '',
        especieName: '',
        especieId: '',
        description: '',
        recommendedAge: '',
        recommendedFrequency: '',
        price: '',
        dirImage: 'ServiceFoto.png',
        status: '1',
    });

    const [categoryMessage, setCategoryMessage] = useState(null);
    const [especieMessage, setEspecieMessage] = useState(null);
    const [formMessage, setFormMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFindCategory = async () => {
        if (!serviceData.categoryName.trim()) {
            setCategoryMessage({ text: "Por favor, ingrese un nombre de categoría válido.", type: "error" });
            return;
        }

        try {
            const category = await searchCategoryByName(serviceData.categoryName);
            if (category) {
                setServiceData((prevState) => ({
                    ...prevState,
                    categoryId: category.idCategory,
                }));
                setCategoryMessage({ text: `Categoría encontrada: ${category.name}`, type: "success" });
            } else {
                setCategoryMessage({ text: "No se encontró una categoría con el nombre proporcionado.", type: "error" });
            }
        } catch (error) {
            console.error("Error al buscar categoría:", error);
            setCategoryMessage({ text: "Error al buscar la categoría.", type: "error" });
        }
    };

    const handleFindEspecie = async () => {
        if (!serviceData.especieName.trim()) {
            setEspecieMessage({ text: "Por favor, ingrese un nombre de especie válido.", type: "error" });
            return;
        }

        try {
            const especie = await searchEspecieByName(serviceData.especieName);
            if (especie) {
                setServiceData((prevState) => ({
                    ...prevState,
                    especieId: especie.idEspecie,
                }));
                setEspecieMessage({ text: `Especie encontrada: ${especie.name}`, type: "success" });
            } else {
                setEspecieMessage({ text: "No se encontró una especie con el nombre proporcionado.", type: "error" });
            }
        } catch (error) {
            console.error("Error al buscar especie:", error);
            setEspecieMessage({ text: "Error al buscar la especie.", type: "error" });
        }
    };

    const validateFields = () => {
        if (!serviceData.name.trim()) {
            setFormMessage({ text: "El campo Nombre no puede estar vacío.", type: "error" });
            return false;
        }
        if (!serviceData.categoryId) {
            setFormMessage({ text: "Debe seleccionar una categoría válida.", type: "error" });
            return false;
        }
        if (!serviceData.especieId) {
            setFormMessage({ text: "Debe seleccionar una especie válida.", type: "error" });
            return false;
        }
        if (!serviceData.description.trim()) {
            setFormMessage({ text: "El campo Descripción no puede estar vacío.", type: "error" });
            return false;
        }
        if (!serviceData.recommendedAge.trim()) {
            setFormMessage({ text: "El campo Edad Recomendada no puede estar vacío.", type: "error" });
            return false;
        }
        if (!serviceData.recommendedFrequency.trim()) {
            setFormMessage({ text: "El campo Frecuencia Recomendada no puede estar vacío.", type: "error" });
            return false;
        }
        if (!/^\d+(\.\d{1,2})?$/.test(serviceData.price)) {
            setFormMessage({ text: "El campo Precio solo puede contener números y un punto decimal.", type: "error" });
            return false;
        }
        if (!serviceData.dirImage.trim()) {
            setFormMessage({ text: "El campo Ruta de Imagen no puede estar vacío.", type: "error" });
            return false;
        }
        setFormMessage(null); // Limpia el mensaje si todo está válido
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        try {
            await createService({
                ...serviceData,
                category: { idCategory: serviceData.categoryId },
                especie: { idEspecie: serviceData.especieId },
            });
            setFormMessage({ text: "Servicio creado exitosamente.", type: "success" });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error al crear el servicio:", error);
            setFormMessage({ text: "Error al crear el servicio.", type: "error" });
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nuevo Servicio</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <Box_Text_Value
                                Label="Nombre"
                                V_Text={serviceData.name}
                                onChange={handleChange}
                                name="name"
                                required
                            />
                            <Box_Text_Value
                                Label="Categoría (Nombre)"
                                V_Text={serviceData.categoryName}
                                onChange={handleChange}
                                name="categoryName"
                                required
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindCategory}>
                                Buscar Categoría
                            </button>
                            {categoryMessage && (
                                <p className={categoryMessage.type === "error" ? "text-danger" : "text-success"}>
                                    {categoryMessage.text}
                                </p>
                            )}
                            <Box_Text_Value
                                Label="Especie (Nombre)"
                                V_Text={serviceData.especieName}
                                onChange={handleChange}
                                name="especieName"
                                required
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindEspecie}>
                                Buscar Especie
                            </button>
                            {especieMessage && (
                                <p className={especieMessage.type === "error" ? "text-danger" : "text-success"}>
                                    {especieMessage.text}
                                </p>
                            )}
                            <Box_Text_Value
                                Label="Descripción"
                                V_Text={serviceData.description}
                                onChange={handleChange}
                                name="description"
                                required
                            />
                            <Box_Text_Value
                                Label="Edad Recomendada"
                                V_Text={serviceData.recommendedAge}
                                onChange={handleChange}
                                name="recommendedAge"
                                required
                            />
                            <Box_Text_Value
                                Label="Frecuencia Recomendada"
                                V_Text={serviceData.recommendedFrequency}
                                onChange={handleChange}
                                name="recommendedFrequency"
                                required
                            />
                            <Box_Text_Value
                                Label="Precio"
                                V_Text={serviceData.price}
                                onChange={handleChange}
                                name="price"
                                type="number"
                                required
                            />
                            <Box_Text_Value
                                Label="Ruta de Imagen"
                                V_Text={serviceData.dirImage}
                                onChange={handleChange}
                                name="dirImage"
                                required
                            />
                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    name="status"
                                    value={serviceData.status}
                                    onChange={handleChange}
                                    className="input-box"
                                >
                                    <option value="1">Activo</option>
                                    <option value="0">Bloqueado</option>
                                </select>
                            </div>
                            {formMessage && (
                                <p className={formMessage.type === "error" ? "text-danger" : "text-success"}>
                                    {formMessage.text}
                                </p>
                            )}
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
                                Crear Servicio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalNewService;
