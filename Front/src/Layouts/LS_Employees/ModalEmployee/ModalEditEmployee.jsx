import React, { useEffect, useState } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import Box_Text_Bloq from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Bloq';
import HiddenInput from '../../../Components/CS_General/Form Box/Box_Text/HiddenInput';
import SelectInput from '../../../Components/CS_General/Form Box/SelectImput/SelectImput';
import { getEmployeeById, updateEmployee, isCellphoneInUseUpdate, isCmvpInUseUpdate, isDniInUse } from '../../../Services/employeeService';
import { getActiveRoles } from '../../../Services/roleService';
import apiReniec from '../../../Services/reniecService';

function ModalEditEmployee({ employeeId, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        dni: '',
        cmvp: '',
        firstName: '',
        preName: '',
        firstLastName: '',
        secondLastName: '',
        address: '',
        cellphone: '',
        dirImage: 'UserFoto.png',
        status: '1',
        rol: { idRol: '' },
        user: { idUser: '' },
    });

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employeeId) {
            getEmployeeById(employeeId)
                .then((data) => {
                    setFormData({
                        dni: data.dni,
                        cmvp: data.cmvp,
                        firstName: data.firstName,
                        preName: data.preName,
                        firstLastName: data.firstLastName,
                        secondLastName: data.secondLastName,
                        address: data.address,
                        cellphone: data.cellphone,
                        dirImage: data.dirImage,
                        status: data.status,
                        rol: { idRol: data.rol.idRol },
                        user: { idUser: data.user.idUser },
                    });
                })
                .catch((error) => console.error('Error al obtener datos del empleado:', error));
        }

        getActiveRoles()
            .then((data) => setRoles(data || []))
            .catch((error) => console.error('Error al obtener roles:', error));
    }, [employeeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rol') {
            setFormData((prevState) => ({
                ...prevState,
                rol: { idRol: value },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const validateFields = async () => {
        const newErrors = {};

        // Validación de campos obligatorios
        if (!formData.dni.trim()) newErrors.dni = 'El DNI no puede estar vacío.';
        if (!formData.firstName.trim()) newErrors.firstName = 'El primer nombre no puede estar vacío.';
        if (!formData.firstLastName.trim()) newErrors.firstLastName = 'El primer apellido no puede estar vacío.';
        if (!formData.secondLastName.trim()) newErrors.secondLastName = 'El segundo apellido no puede estar vacío.';
        if (!formData.address.trim()) newErrors.address = 'La dirección no puede estar vacía.';
        if (!formData.cellphone.trim()) newErrors.cellphone = 'El número de celular no puede estar vacío.';

        // Validación de DNI
        if (!/^\d{8}$/.test(formData.dni)) {
            newErrors.dni = 'El DNI debe tener exactamente 8 dígitos numéricos.';
        }

        // Validación de celular
        if (!/^9\d{8}$/.test(formData.cellphone)) {
            newErrors.cellphone = 'El número de celular debe comenzar con 9 y tener 9 dígitos.';
        } else {
            try {
                const inUse = await isCellphoneInUseUpdate(formData.cellphone, employeeId);
                if (inUse) newErrors.cellphone = 'El número de celular ya está en uso.';
            } catch (error) {
                console.error('Error al verificar celular:', error);
            }
        }

        // Validación de CMVP
        if (formData.cmvp.trim() && !/^\d{5}$/.test(formData.cmvp)) {
            newErrors.cmvp = 'El CMVP debe tener exactamente 5 caracteres numéricos.';
        } else if (formData.cmvp.trim()) {
            try {
                const inUse = await isCmvpInUseUpdate(formData.cmvp, employeeId);
                if (inUse) newErrors.cmvp = 'El CMVP ya está en uso.';
            } catch (error) {
                console.error('Error al verificar CMVP:', error);
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearchDni = async () => {
        if (!/^\d{8}$/.test(formData.dni)) {
            setErrors({ dni: 'El DNI debe tener exactamente 8 dígitos numéricos.' });
            return;
        }

        try {
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
                dni: null,
            }));
        } catch (error) {
            setErrors({ dni: 'No se encontraron datos para el DNI ingresado.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(await validateFields())) return;

        const updatedEmployeeData = {
            dni: formData.dni,
            cmvp: formData.cmvp,
            firstName: formData.firstName,
            preName: formData.preName,
            firstLastName: formData.firstLastName,
            secondLastName: formData.secondLastName,
            address: formData.address,
            cellphone: formData.cellphone,
            dirImage: formData.dirImage,
            status: formData.status,
            rol: { idRol: formData.rol.idRol },
        };

        try {
            await updateEmployee(employeeId, updatedEmployeeData);
            alert('Empleado actualizado exitosamente.');
            onUpdate();
            onClose();
        } catch (error) {
            alert('Error al actualizar el empleado. Intenta nuevamente.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Empleado</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="d-flex align-items-center">
                                <Box_Text_Value
                                    Label="DNI"
                                    V_Text={formData.dni}
                                    onChange={handleChange}
                                    name="dni"
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

                            <Box_Text_Bloq Label="Primer Nombre" V_Text={formData.firstName} />
                            <Box_Text_Bloq Label="Segundo Nombre" V_Text={formData.preName} />
                            <Box_Text_Bloq Label="Primer Apellido" V_Text={formData.firstLastName} />
                            <Box_Text_Bloq Label="Segundo Apellido" V_Text={formData.secondLastName} />

                            <Box_Text_Value
                                Label="Dirección"
                                V_Text={formData.address}
                                onChange={handleChange}
                                name="address"
                            />
                            {errors.address && <small className="text-danger">{errors.address}</small>}

                            <Box_Text_Value
                                Label="Teléfono"
                                V_Text={formData.cellphone}
                                onChange={handleChange}
                                name="cellphone"
                            />
                            {errors.cellphone && <small className="text-danger">{errors.cellphone}</small>}

                            <Box_Text_Value
                                Label="CMVP"
                                V_Text={formData.cmvp}
                                onChange={handleChange}
                                name="cmvp"
                            />
                            {errors.cmvp && <small className="text-danger">{errors.cmvp}</small>}

                            <SelectInput
                                label="Rol"
                                name="rol"
                                value={formData.rol.idRol}
                                options={roles.map((role) => ({
                                    value: role.idRol,
                                    label: role.name,
                                }))}
                                onChange={handleChange}
                            />

                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input-box"
                                >
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
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
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEditEmployee;
