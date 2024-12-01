import React, { useEffect, useState } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import { searchCategoryByName } from '../../../Services/categoryService';
import { searchEspecieByName } from '../../../Services/especieService';
import { getServiceById, updateService } from '../../../Services/serviceService';

function ModalEditService({ serviceId, onClose, onUpdate }) {
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
        dirImage: '',
        status: '1',
    });

    const [categoryError, setCategoryError] = useState(null);
    const [categoryMessage, setCategoryMessage] = useState(null);
    const [especieError, setEspecieError] = useState(null);
    const [especieMessage, setEspecieMessage] = useState(null);

    useEffect(() => {
        if (serviceId) {
            getServiceById(serviceId)
                .then((data) => {
                    setServiceData({
                        name: data.name,
                        categoryName: data.category.name,
                        categoryId: data.category.idCategory,
                        especieName: data.especie.name,
                        especieId: data.especie.idEspecie,
                        description: data.description,
                        recommendedAge: data.recommendedAge,
                        recommendedFrequency: data.recommendedFrequency,
                        price: data.price,
                        dirImage: data.dirImage,
                        status: data.status,
                    });
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del servicio:", error);
                });
        }
    }, [serviceId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFindCategory = async () => {
        if (!serviceData.categoryName.trim()) {
            setCategoryError("Por favor, ingrese un nombre de categoría válido.");
            setCategoryMessage(null);
            return;
        }
        try {
            const category = await searchCategoryByName(serviceData.categoryName);
            if (category) {
                setServiceData((prevState) => ({
                    ...prevState,
                    categoryId: category.idCategory,
                }));
                setCategoryError(null);
                setCategoryMessage(`Categoría encontrada: ${category.name}`);
            } else {
                setCategoryError("No se encontró una categoría con el nombre proporcionado.");
                setCategoryMessage(null);
            }
        } catch (error) {
            console.error("Error al buscar categoría:", error);
            setCategoryError("Error al buscar la categoría.");
            setCategoryMessage(null);
        }
    };

    const handleFindEspecie = async () => {
        if (!serviceData.especieName.trim()) {
            setEspecieError("Por favor, ingrese un nombre de especie válido.");
            setEspecieMessage(null);
            return;
        }
        try {
            const especie = await searchEspecieByName(serviceData.especieName);
            if (especie) {
                setServiceData((prevState) => ({
                    ...prevState,
                    especieId: especie.idEspecie,
                }));
                setEspecieError(null);
                setEspecieMessage(`Especie encontrada: ${especie.name}`);
            } else {
                setEspecieError("No se encontró una especie con el nombre proporcionado.");
                setEspecieMessage(null);
            }
        } catch (error) {
            console.error("Error al buscar especie:", error);
            setEspecieError("Error al buscar la especie.");
            setEspecieMessage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serviceData.categoryId || !serviceData.especieId) {
            alert("Por favor, busque y seleccione una categoría y una especie antes de guardar los cambios.");
            return;
        }
        try {
            await updateService(serviceId, {
                ...serviceData,
                category: { idCategory: serviceData.categoryId },
                especie: { idEspecie: serviceData.especieId },
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error al actualizar el servicio:", error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Servicio</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
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
                            {categoryError && <p className="text-danger">{categoryError}</p>}
                            {categoryMessage && <p className="text-success">{categoryMessage}</p>}

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
                            {especieError && <p className="text-danger">{especieError}</p>}
                            {especieMessage && <p className="text-success">{especieMessage}</p>}

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
                                Label="Imagen del Servicio (URL)"
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
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEditService;
