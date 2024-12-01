import React, { useEffect, useState } from "react";
import "../../Layouts/Layouts.css";
import Box_Text_Value from "../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import HiddenInput from "../../Components/CS_General/Form Box/Box_Text/HiddenInput";
import { getClientById, updateClient, isCellphoneInUseUpdate, isDniInUseUpdate } from "../../Services/clientService";
import apiReniec from "../../Services/reniecService";

function ModalEdit({ clientId, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        idClient: "",
        dni: "",
        firstName: "",
        preName: "",
        firstLastName: "",
        secondLastName: "",
        address: "",
        cellphone: "",
        status: "1",
    });

    const [errors, setErrors] = useState({}); // Almacena errores de validación

    useEffect(() => {
        if (clientId) {
            getClientById(clientId)
                .then((data) => {
                    setFormData({
                        idClient: data.idClient,
                        dni: data.dni,
                        firstName: data.firstName,
                        preName: data.preName,
                        firstLastName: data.firstLastName,
                        secondLastName: data.secondLastName,
                        address: data.address,
                        cellphone: data.cellphone,
                        status: data.status,
                    });
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del cliente:", error);
                    alert("Error al cargar los datos del cliente.");
                });
        }
    }, [clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateFields = async () => {
        const newErrors = {};

        // Validación de campos vacíos
        if (!formData.dni.trim()) newErrors.dni = "El DNI no puede estar vacío.";
        if (!formData.firstName.trim()) newErrors.firstName = "El primer nombre no puede estar vacío.";
        if (!formData.firstLastName.trim()) newErrors.firstLastName = "El primer apellido no puede estar vacío.";
        if (!formData.secondLastName.trim()) newErrors.secondLastName = "El segundo apellido no puede estar vacío.";
        if (!formData.cellphone.trim()) newErrors.cellphone = "El número de celular no puede estar vacío.";
        if (!formData.address.trim()) newErrors.address = "La dirección no puede estar vacía.";

        // Validación de DNI
        if (!/^\d{8}$/.test(formData.dni)) {
            newErrors.dni = "El DNI debe tener exactamente 8 dígitos numéricos.";
        } else {
            try {
                const dniInUse = await isDniInUseUpdate(formData.dni, clientId);
                if (dniInUse) {
                    newErrors.dni = "El DNI ya está registrado en otro cliente.";
                }
            } catch (error) {
                console.error("Error al verificar el DNI:", error);
            }
        }

        // Validación de celular
        if (!/^9\d{8}$/.test(formData.cellphone)) {
            newErrors.cellphone = "El número de celular debe comenzar con 9 y tener 9 dígitos.";
        } else {
            try {
                const cellphoneInUse = await isCellphoneInUseUpdate(formData.cellphone, clientId);
                if (cellphoneInUse) {
                    newErrors.cellphone = "El número de celular ya está registrado en otro cliente.";
                }
            } catch (error) {
                console.error("Error al verificar el número de celular:", error);
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, devuelve true
    };

    const handleSearchDni = async () => {
        if (!/^\d{8}$/.test(formData.dni)) {
            setErrors({ dni: "El DNI debe tener exactamente 8 dígitos numéricos." });
            return;
        }

        try {
            // Consultar datos en RENIEC
            const response = await apiReniec.get(`/${formData.dni}`);
            setFormData((prevState) => ({
                ...prevState,
                firstName: response.data.primerNombre,
                preName: response.data.preNombres,
                firstLastName: response.data.apellidoPaterno,
                secondLastName: response.data.apellidoMaterno,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                dni: null, // Limpiar errores de DNI si se completaron los datos
            }));
        } catch (error) {
            setErrors({ dni: "No se encontraron datos para el DNI ingresado." });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!(await validateFields())) return; // Detener si hay errores

        try {
            await updateClient(clientId, formData);
            alert("Cliente actualizado exitosamente");
            onUpdate(); // Refresca la tabla
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
            alert("Error al actualizar el cliente.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Cliente</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <HiddenInput name="idClient" value={formData.idClient} />

                            <div className="d-flex align-items-center">
                                <Box_Text_Value
                                    Label="DNI"
                                    V_Text={formData.dni}
                                    name="dni"
                                    onChange={handleChange}
                                    type="text"
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={handleSearchDni}
                                >
                                    Buscar en RENIEC
                                </button>
                            </div>
                            {errors.dni && <small className="text-danger">{errors.dni}</small>}

                            <Box_Text_Value
                                Label="Primer Nombre"
                                V_Text={formData.firstName}
                                name="firstName"
                                onChange={handleChange}
                                type="text"
                            />
                            {errors.firstName && <small className="text-danger">{errors.firstName}</small>}

                            <Box_Text_Value
                                Label="Segundo Nombre"
                                V_Text={formData.preName}
                                name="preName"
                                onChange={handleChange}
                                type="text"
                            />

                            <Box_Text_Value
                                Label="Primer Apellido"
                                V_Text={formData.firstLastName}
                                name="firstLastName"
                                onChange={handleChange}
                                type="text"
                            />
                            {errors.firstLastName && (
                                <small className="text-danger">{errors.firstLastName}</small>
                            )}

                            <Box_Text_Value
                                Label="Segundo Apellido"
                                V_Text={formData.secondLastName}
                                name="secondLastName"
                                onChange={handleChange}
                                type="text"
                            />
                            {errors.secondLastName && (
                                <small className="text-danger">{errors.secondLastName}</small>
                            )}

                            <Box_Text_Value
                                Label="Dirección"
                                V_Text={formData.address}
                                name="address"
                                onChange={handleChange}
                                type="text"
                            />
                            {errors.address && <small className="text-danger">{errors.address}</small>}

                            <Box_Text_Value
                                Label="Teléfono"
                                V_Text={formData.cellphone}
                                name="cellphone"
                                onChange={handleChange}
                                type="text"
                            />
                            {errors.cellphone && <small className="text-danger">{errors.cellphone}</small>}
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
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEdit;
