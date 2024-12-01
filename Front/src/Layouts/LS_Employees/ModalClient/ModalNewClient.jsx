import React, { useState } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Bloq from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Bloq';
import Box_Number from '../../../Components/CS_General/Form Box/Box_Number/Box_Number';
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import HiddenInput from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import apiReniec from '../../../Services/reniecService';
import { createClient, getFirstNameByDni, isCellphoneInUse } from '../../../Services/clientService';
import { isEmailInUse } from "../../../Services/userService";

function ModalNewClient({ onClose, onUpdate }) {
    const [clientData, setClientData] = useState({
        dni: "",
        firstName: "",
        preName: "",
        firstLastName: "",
        secondLastName: "",
        address: "",
        cellphone: "",
        dirImage: "UserFoto.png",
        status: "1",
        email: "",
        password: ""
    });

    const [withUser, setWithUser] = useState(false); // Controla si mostrar campos de usuario
    const [errors, setErrors] = useState({}); // Almacena errores de validación

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData(prevData => ({ ...prevData, [name]: value }));
    };

    // Validaciones
    const validateFields = async () => {
        const newErrors = {};

        // Validación de campos vacíos
        if (!clientData.dni.trim()) newErrors.dni = "El DNI no puede estar vacío.";
        if (!clientData.firstName.trim()) newErrors.firstName = "El primer nombre no puede estar vacío.";
        if (!clientData.firstLastName.trim()) newErrors.firstLastName = "El primer apellido no puede estar vacío.";
        if (!clientData.secondLastName.trim()) newErrors.secondLastName = "El segundo apellido no puede estar vacío.";
        if (!clientData.cellphone.trim()) newErrors.cellphone = "El número de celular no puede estar vacío.";
        if (!clientData.address.trim()) newErrors.address = "La dirección no puede estar vacía.";

        // Validación de DNI
        if (!/^\d{8}$/.test(clientData.dni)) {
            newErrors.dni = "El DNI debe tener exactamente 8 dígitos numéricos.";
        }

        // Validación de celular
        if (!/^9\d{8}$/.test(clientData.cellphone)) {
            newErrors.cellphone = "El número de celular debe comenzar con 9 y tener 9 dígitos.";
        } else {
            try {
                const cellphoneInUse = await isCellphoneInUse(clientData.cellphone);
                if (cellphoneInUse) {
                    newErrors.cellphone = "El número de celular ya está registrado.";
                }
            } catch (error) {
                console.error("Error al verificar el número de celular:", error);
            }
        }

        // Validación de correo
        if (withUser && !clientData.email.trim()) {
            newErrors.email = "El correo electrónico no puede estar vacío.";
        } else if (withUser) {
            try {
                const emailInUse = await isEmailInUse(clientData.email);
                if (emailInUse) {
                    newErrors.email = "El correo electrónico ya está registrado.";
                }
            } catch (error) {
                console.error("Error al verificar el correo:", error);
            }
        }

        // Validación de contraseña
        if (withUser && !clientData.password.trim()) {
            newErrors.password = "La contraseña no puede estar vacía.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, devuelve true
    };

    const handleSearchDni = async () => {
        if (!/^\d{8}$/.test(clientData.dni)) {
            setErrors({ dni: "El DNI debe tener exactamente 8 dígitos numéricos." });
            return;
        }

        try {
            // Verificar si el cliente ya existe
            const existingFirstName = await getFirstNameByDni(clientData.dni);
            if (existingFirstName) {
                setErrors({ dni: `Cliente ya registrado con ese DNI: ${existingFirstName}` });
                
                // Limpiar campos de nombres y apellidos
                setClientData(prevData => ({
                    ...prevData,
                    firstName: "",
                    preName: "",
                    firstLastName: "",
                    secondLastName: ""
                }));

                return; // Detener el flujo si el cliente ya está registrado
            }

            // Si no existe, buscar los datos en RENIEC
            const response = await apiReniec.get(`/${clientData.dni}`);
            setClientData(prevData => ({
                ...prevData,
                firstName: response.data.primerNombre,
                preName: response.data.preNombres,
                firstLastName: response.data.apellidoPaterno,
                secondLastName: response.data.apellidoMaterno
            }));
            setErrors({}); // Limpiar errores si todo salió bien
        } catch (error) {
            // Manejo del caso en que el DNI no se encuentra en RENIEC
            setErrors({ dni: "No se encontraron datos para el DNI ingresado." });
        }
    };

    const handleCreateClient = async () => {
        if (!(await validateFields())) return; // Detener el envío si hay errores de validación

        let user = null;

        if (withUser) {
            user = {
                email: clientData.email,
                password: clientData.password,
                status: clientData.status,
            };
        }

        const newClientData = {
            user,
            dni: clientData.dni,
            firstName: clientData.firstName,
            preName: clientData.preName,
            firstLastName: clientData.firstLastName,
            secondLastName: clientData.secondLastName,
            address: clientData.address,
            cellphone: clientData.cellphone,
            dirImage: clientData.dirImage,
            status: clientData.status,
        };

        try {
            await createClient(newClientData);
            alert("Cliente creado exitosamente!");
            onUpdate();
            onClose();
        } catch (error) {
            alert("Error al crear el cliente. Intenta nuevamente.");
            console.error("Detalle del error:", error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nuevo Cliente</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateClient(); }}>
                        <div className="modal-body">
                            <div className="d-flex align-items-center">
                                <Box_Number
                                    Label="DNI"
                                    V_Number={clientData.dni}
                                    onChange={handleChange}
                                    name="dni"
                                    min="10000000"
                                    max="99999999"
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={handleSearchDni}
                                >
                                    Buscar
                                </button>
                            </div>
                            {errors.dni && <small className="text-danger">{errors.dni}</small>}

                            <Box_Text_Bloq Label="Primer Nombre" V_Text={clientData.firstName} />
                            <Box_Text_Bloq Label="Pre Nombre" V_Text={clientData.preName} />
                            <Box_Text_Bloq Label="Primer Apellido" V_Text={clientData.firstLastName} />
                            <Box_Text_Bloq Label="Segundo Apellido" V_Text={clientData.secondLastName} />
                            <Box_Text_Value
                                Label="Dirección"
                                V_Text={clientData.address}
                                onChange={handleChange}
                                name="address"
                            />
                            <Box_Number
                                Label="Celular"
                                V_Number={clientData.cellphone}
                                onChange={handleChange}
                                name="cellphone"
                                min="900000000"
                                max="999999999"
                            />
                            {errors.cellphone && <small className="text-danger">{errors.cellphone}</small>}

                            <button
                                type="button"
                                className="btn btn-info mt-3"
                                onClick={() => setWithUser(!withUser)}
                            >
                                {withUser ? "Sin Usuario" : "Con Usuario"}
                            </button>

                            {withUser && (
                                <>
                                    <Box_Text_Value
                                        Label="Correo Electrónico"
                                        V_Text={clientData.email}
                                        onChange={handleChange}
                                        name="email"
                                    />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                    <Box_Text_Value
                                        Label="Contraseña"
                                        V_Text={clientData.password}
                                        onChange={handleChange}
                                        name="password"
                                    />
                                    {errors.password && <small className="text-danger">{errors.password}</small>}
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Crear Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalNewClient;
