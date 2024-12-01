import React, { useState, useEffect } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import Box_Text_Bloq from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Bloq';
import HiddenInput from '../../../Components/CS_General/Form Box/Box_Text/HiddenInput';
import SelectInput from '../../../Components/CS_General/Form Box/SelectImput/SelectImput';
import { createEmployee, isCellphoneInUse, isCmvpInUse } from '../../../Services/employeeService';
import { isEmailInUse } from '../../../Services/userService';
import { getActiveRoles } from '../../../Services/roleService';
import { isDniInUse } from '../../../Services/employeeService';
import apiReniec from '../../../Services/reniecService';

function ModalNewEmployee({ onClose, onUpdate }) {
    const [employeeData, setEmployeeData] = useState({
        dni: "",
        cmvp: "",
        firstName: "",
        preName: "",
        firstLastName: "",
        secondLastName: "",
        address: "",
        cellphone: "",
        dirImage: "UserFoto.png",
        status: "1",
        email: "",
        password: "",
        rolId: "",
    });

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getActiveRoles()
            .then((data) => {
                setRoles(data);
                if (data.length > 0) {
                    setEmployeeData((prevData) => ({
                        ...prevData,
                        rolId: data[0].idRol,
                    }));
                }
            })
            .catch((error) => console.error("Error al obtener roles:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateFields = async () => {
        const newErrors = {};

        // Validación de campos obligatorios
        if (!employeeData.dni.trim()) newErrors.dni = "El DNI no puede estar vacío.";
        if (!employeeData.firstName.trim()) newErrors.firstName = "El primer nombre no puede estar vacío.";
        if (!employeeData.firstLastName.trim()) newErrors.firstLastName = "El primer apellido no puede estar vacío.";
        if (!employeeData.secondLastName.trim()) newErrors.secondLastName = "El segundo apellido no puede estar vacío.";
        if (!employeeData.address.trim()) newErrors.address = "La dirección no puede estar vacía.";
        if (!employeeData.cellphone.trim()) newErrors.cellphone = "El número de celular no puede estar vacío.";
        if (!employeeData.email.trim()) newErrors.email = "El correo electrónico no puede estar vacío.";
        if (!employeeData.password.trim()) newErrors.password = "La contraseña no puede estar vacía.";

        // Validación de DNI
        if (!/^\d{8}$/.test(employeeData.dni)) {
            newErrors.dni = "El DNI debe tener exactamente 8 dígitos numéricos.";
        }

        // Validación de celular
        if (!/^9\d{8}$/.test(employeeData.cellphone)) {
            newErrors.cellphone = "El número de celular debe comenzar con 9 y tener 9 dígitos.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearchDni = async () => {
        if (!/^\d{8}$/.test(employeeData.dni)) {
            setErrors((prevErrors) => ({ ...prevErrors, dni: "El DNI debe tener exactamente 8 dígitos numéricos." }));
            return;
        }

        try {
            const dniInUse = await isDniInUse(employeeData.dni);
            if (dniInUse) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    dni: "El DNI ya está registrado como empleado.",
                }));
                setEmployeeData((prevData) => ({
                    ...prevData,
                    firstName: "",
                    preName: "",
                    firstLastName: "",
                    secondLastName: "",
                }));
                return;
            }

            const response = await apiReniec.get(`/${employeeData.dni}`);
            setEmployeeData((prevData) => ({
                ...prevData,
                firstName: response.data.primerNombre,
                preName: response.data.preNombres,
                firstLastName: response.data.apellidoPaterno,
                secondLastName: response.data.apellidoMaterno,
            }));
            setErrors({});
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                dni: "No se encontraron datos para el DNI ingresado.",
            }));
        }
    };

    const handleCreateEmployee = async () => {
        if (!(await validateFields())) return;

        try {
            const emailInUse = await isEmailInUse(employeeData.email);
            if (emailInUse) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: "El correo electrónico ya está registrado.",
                }));
                return;
            }

            const cellphoneInUse = await isCellphoneInUse(employeeData.cellphone);
            if (cellphoneInUse) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    cellphone: "El número de celular ya está registrado.",
                }));
                return;
            }

            const cmvpInUse = await isCmvpInUse(employeeData.cmvp);
            if (cmvpInUse) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    cmvp: "El CMVP ya está registrado.",
                }));
                return;
            }
        } catch (error) {
            alert("Error al verificar datos únicos. Intenta nuevamente más tarde.");
            return;
        }

        const newEmployeeData = {
            user: {
                email: employeeData.email,
                password: employeeData.password,
                status: employeeData.status,
            },
            dni: employeeData.dni,
            cmvp: employeeData.cmvp,
            firstName: employeeData.firstName,
            preName: employeeData.preName,
            firstLastName: employeeData.firstLastName,
            secondLastName: employeeData.secondLastName,
            address: employeeData.address,
            cellphone: employeeData.cellphone,
            dirImage: employeeData.dirImage,
            status: employeeData.status,
            rol: {
                idRol: employeeData.rolId,
            },
        };

        try {
            await createEmployee(newEmployeeData);
            alert("Empleado creado exitosamente.");
            onUpdate();
            onClose();
        } catch (error) {
            alert("Error al crear el empleado. Intenta nuevamente.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nuevo Empleado</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateEmployee(); }}>
                        <div className="modal-body">
                            <Box_Text_Value
                                Label="DNI"
                                V_Text={employeeData.dni}
                                onChange={handleChange}
                                name="dni"
                            />
                            <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={handleSearchDni}
                            >
                                Buscar
                            </button>
                            {errors.dni && <small className="text-danger">{errors.dni}</small>}

                            <Box_Text_Bloq
                                Label="Primer Nombre"
                                V_Text={employeeData.firstName}
                            />
                            <Box_Text_Bloq
                                Label="Segundo Nombre"
                                V_Text={employeeData.preName}
                            />
                            <Box_Text_Bloq
                                Label="Primer Apellido"
                                V_Text={employeeData.firstLastName}
                            />
                            <Box_Text_Bloq
                                Label="Segundo Apellido"
                                V_Text={employeeData.secondLastName}
                            />

                            <Box_Text_Value
                                Label="Dirección"
                                V_Text={employeeData.address}
                                onChange={handleChange}
                                name="address"
                            />
                            {errors.address && <small className="text-danger">{errors.address}</small>}

                            <Box_Text_Value
                                Label="Teléfono"
                                V_Text={employeeData.cellphone}
                                onChange={handleChange}
                                name="cellphone"
                            />
                            {errors.cellphone && <small className="text-danger">{errors.cellphone}</small>}

                            <Box_Text_Value
                                Label="CMVP"
                                V_Text={employeeData.cmvp}
                                onChange={handleChange}
                                name="cmvp"
                            />
                            {errors.cmvp && <small className="text-danger">{errors.cmvp}</small>}

                            <SelectInput
                                label="Rol"
                                name="rolId"
                                value={employeeData.rolId}
                                onChange={handleChange}
                                options={roles.map((rol) => ({
                                    value: rol.idRol,
                                    label: rol.name,
                                }))}
                            />
                            <Box_Text_Value
                                Label="Correo Electrónico"
                                V_Text={employeeData.email}
                                onChange={handleChange}
                                name="email"
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}

                            <Box_Text_Value
                                Label="Contraseña"
                                V_Text={employeeData.password}
                                onChange={handleChange}
                                name="password"
                                type="password"
                            />
                            {errors.password && <small className="text-danger">{errors.password}</small>}

                            <HiddenInput name="dirImage" value={employeeData.dirImage} />
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
                                Crear Empleado
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalNewEmployee;
