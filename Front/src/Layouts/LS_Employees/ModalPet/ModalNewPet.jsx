import React, { useState } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import HiddenInput from '../../../Components/CS_General/Form Box/Box_Text/HiddenInput';
import { getClientByDni } from '../../../Services/clientService';
import { searchRaceByName } from '../../../Services/raceService';
import { createPet } from '../../../Services/PetService';

function ModalNewPet({ onClose, onUpdate }) {
    const [petData, setPetData] = useState({
        name: '',
        raceName: '',
        sex: '',
        weight: '',
        dateNac: '',
        comments: '',
        dniClient: '',
        clientId: '',
        raceId: '',
        dirImage: 'PetFoto.png',
        status: '1',
    });

    const [clientData, setClientData] = useState(null);
    const [clientError, setClientError] = useState(null);
    const [raceData, setRaceData] = useState(null);
    const [raceError, setRaceError] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Validar campos antes de enviar
    const validateFields = () => {
        const newErrors = {};

        if (!petData.name.trim()) newErrors.name = "El nombre no puede estar vacío.";
        if (!petData.raceName.trim()) newErrors.raceName = "La raza no puede estar vacía.";
        if (!/^[A-Za-z\s]+$/.test(petData.raceName)) newErrors.raceName = "La raza solo debe contener letras.";
        if (!petData.sex) newErrors.sex = "Seleccione el sexo.";
        if (!petData.weight.trim()) newErrors.weight = "El peso no puede estar vacío.";
        if (!/^\d+(\.\d+)?$/.test(petData.weight)) newErrors.weight = "El peso debe ser un número válido.";
        if (!petData.dateNac.trim()) {
            newErrors.dateNac = "La fecha de nacimiento no puede estar vacía.";
        } else if (new Date(petData.dateNac) > new Date()) {
            newErrors.dateNac = "La fecha no puede ser mayor a la fecha actual.";
        }
        if (!petData.dniClient.trim()) newErrors.dniClient = "El DNI no puede estar vacío.";
        if (!/^\d{8}$/.test(petData.dniClient)) newErrors.dniClient = "El DNI debe tener 8 dígitos.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

        // Dentro de handleFindClient:
    const handleFindClient = async () => {
        if (!/^\d{8}$/.test(petData.dniClient)) {
            setClientError("El DNI debe tener exactamente 8 dígitos.");
            return;
        }

        try {
            const data = await getClientByDni(petData.dniClient);
            if (data.content && data.content.length > 0) {
                const client = data.content[0];
                setPetData((prevState) => ({
                    ...prevState,
                    clientId: client.idClient,
                }));
                setClientData({
                    name: client.firstName,
                    lastName: client.firstLastName,
                });
                setClientError(null); // Limpiar errores
            } else {
                setClientError("No se encontró un cliente con el DNI proporcionado.");
                setClientData(null); // Limpiar datos del cliente
            }
        } catch (error) {
            console.error("Error al buscar cliente por DNI:", error);
            setClientError("Ocurrió un error al buscar el cliente.");
            setClientData(null); // Limpiar datos del cliente
        }
    };
    const handleFindRace = async () => {
        if (!/^[A-Za-z\s]+$/.test(petData.raceName)) {
            setRaceError("El nombre de la raza solo debe contener letras.");
            setRaceData(null);
            return;
        }

        try {
            const data = await searchRaceByName(petData.raceName);
            if (data.content && data.content.length > 0) {
                const race = data.content[0];
                setPetData((prevState) => ({
                    ...prevState,
                    raceId: race.idRace,
                }));
                setRaceData({ name: race.name });
                setRaceError(null);
            } else {
                setRaceError("No se encontró una raza con el nombre proporcionado.");
                setRaceData(null);
            }
        } catch (error) {
            console.error("Error al buscar raza:", error);
            setRaceError("Error al buscar raza.");
            setRaceData(null);
        }
    };

    const handleCreatePet = async (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        if (!petData.clientId) {
            alert("Por favor, busque y seleccione un cliente antes de crear la mascota.");
            return;
        }

        if (!petData.raceId) {
            alert("Por favor, busque y seleccione una raza antes de crear la mascota.");
            return;
        }

        try {
            await createPet({
                name: petData.name,
                race: { idRace: petData.raceId },
                client: { idClient: petData.clientId },
                sex: petData.sex,
                weight: petData.weight,
                dateNac: petData.dateNac,
                comments: petData.comments,
                dirImage: petData.dirImage,
                status: petData.status,
            });
            alert("Mascota creada exitosamente.");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error al crear la mascota:", error);
            alert("Error al crear la mascota.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nueva Mascota</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleCreatePet}>
                        <div className="modal-body">
                            <Box_Text_Value
                                Label="Nombre"
                                V_Text={petData.name}
                                onChange={handleChange}
                                name="name"
                            />
                            {errors.name && <p className="text-danger">{errors.name}</p>}

                            <Box_Text_Value
                                Label="Nombre de Raza"
                                V_Text={petData.raceName}
                                onChange={handleChange}
                                name="raceName"
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindRace}>
                                Buscar Raza
                            </button>
                            {raceError && <p className="text-danger">{raceError}</p>}
                            {raceData && <p className="text-success">Raza: {raceData.name}</p>}
                            <HiddenInput name="raceId" value={petData.raceId} />

                            <div className="form-group">
                                <label>Sexo:</label>
                                <select
                                    name="sex"
                                    value={petData.sex}
                                    onChange={handleChange}
                                    className="input-box"
                                >
                                    <option value="">Seleccione</option>
                                    <option value="M">Macho</option>
                                    <option value="H">Hembra</option>
                                </select>
                                {errors.sex && <p className="text-danger">{errors.sex}</p>}
                            </div>

                            <Box_Text_Value
                                Label="Peso"
                                V_Text={petData.weight}
                                onChange={handleChange}
                                name="weight"
                            />
                            {errors.weight && <p className="text-danger">{errors.weight}</p>}

                            <Box_Text_Value
                                Label="Fecha de Nacimiento"
                                V_Text={petData.dateNac}
                                onChange={handleChange}
                                name="dateNac"
                                type="date"
                            />
                            {errors.dateNac && <p className="text-danger">{errors.dateNac}</p>}

                            <Box_Text_Value
                                Label="Comentarios"
                                V_Text={petData.comments}
                                onChange={handleChange}
                                name="comments"
                            />

                            <Box_Text_Value
                                Label="DNI del Cliente"
                                V_Text={petData.dniClient}
                                onChange={handleChange}
                                name="dniClient"
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindClient}>
                                Buscar Cliente
                            </button>
                            {clientError && <p className="text-danger">{clientError}</p>}
                            {clientData && (
                                <p className="text-success">
                                    Cliente: {clientData.name} {clientData.lastName}
                                </p>
                            )}
                            <HiddenInput name="clientId" value={petData.clientId} />

                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    name="status"
                                    value={petData.status}
                                    onChange={handleChange}
                                    className="input-box"
                                >
                                    <option value="1">Activo</option>
                                    <option value="0">Muerto</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Crear Mascota
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalNewPet;
