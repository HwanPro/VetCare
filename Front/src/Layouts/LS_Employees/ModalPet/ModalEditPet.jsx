import React, { useEffect, useState } from 'react';
import "../../../Layouts/Layouts.css";
import Box_Text_Value from '../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value';
import HiddenInput from '../../../Components/CS_General/Form Box/Box_Text/HiddenInput';
import { getPetById, updatePet } from "../../../Services/petService";
import { searchClientByDni } from "../../../Services/clientService";
import { searchRaceByName } from "../../../Services/raceService";

function ModalEditPet({ petId, onClose, onUpdate }) {
    const [petData, setPetData] = useState({
        name: '',
        raceName: '',
        raceId: '',
        sex: '',
        weight: '',
        dateNac: '',
        comments: '',
        dniClient: '',
        clientId: '',
        dirImage: 'PetFoto.png',
        status: '1',
    });

    const [clientData, setClientData] = useState(null);
    const [clientError, setClientError] = useState(null);
    const [raceData, setRaceData] = useState(null);
    const [raceError, setRaceError] = useState(null);

    useEffect(() => {
        if (petId) {
            getPetById(petId)
                .then((data) => {
                    setPetData({
                        name: data.name,
                        raceName: data.race.name,
                        raceId: data.race.idRace,
                        sex: data.sex,
                        weight: data.weight,
                        dateNac: data.dateNac.split('T')[0],
                        comments: data.comments,
                        dniClient: '',
                        clientId: data.client.idClient,
                        dirImage: data.dirImage,
                        status: data.status,
                    });
                    setClientData({
                        name: data.client.firstName,
                        lastName: data.client.firstLastName,
                    });
                })
                .catch((error) => console.error('Error al obtener datos de la mascota:', error));
        }
    }, [petId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFindClient = async () => {
        if (!/^\d{8}$/.test(petData.dniClient)) {
            setClientError('El DNI debe tener exactamente 8 dígitos.');
            return;
        }
        try {
            const data = await searchClientByDni(petData.dniClient);
            if (data.length > 0) {
                const client = data[0];
                setPetData((prevState) => ({
                    ...prevState,
                    clientId: client.idClient,
                }));
                setClientData({ name: client.firstName, lastName: client.firstLastName });
                setClientError(null);
            } else {
                setClientError('No se encontró un cliente con el DNI proporcionado.');
                setClientData(null);
            }
        } catch (error) {
            setClientError('Error al buscar cliente.');
            setClientData(null);
        }
    };

    const handleFindRace = async () => {
        if (!/^[a-zA-Z]+$/.test(petData.raceName)) {
            setRaceError('El nombre de la raza solo puede contener letras.');
            return;
        }
        try {
            const data = await searchRaceByName(petData.raceName);
            if (data.length > 0) {
                const race = data[0];
                setPetData((prevState) => ({
                    ...prevState,
                    raceId: race.idRace,
                }));
                setRaceData(race);
                setRaceError(null);
            } else {
                setRaceError('No se encontró una raza con el nombre proporcionado.');
                setRaceData(null);
            }
        } catch (error) {
            setRaceError('Error al buscar raza.');
            setRaceData(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!petData.clientId || !petData.raceId) {
            alert('Por favor, busque y seleccione un cliente y una raza antes de guardar.');
            return;
        }

        try {
            await updatePet(petId, {
                ...petData,
                race: { idRace: petData.raceId },
                client: { idClient: petData.clientId },
            });
            alert('Mascota actualizada exitosamente.');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error al actualizar la mascota:', error);
            alert('Error al actualizar la mascota.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Mascota</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <Box_Text_Value
                                Label="Nombre"
                                V_Text={petData.name}
                                onChange={handleChange}
                                name="name"
                                required
                            />
                            <Box_Text_Value
                                Label="Raza (Nombre)"
                                V_Text={petData.raceName}
                                onChange={handleChange}
                                name="raceName"
                                required
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindRace}>
                                Buscar Raza
                            </button>
                            {raceError && <p className="text-danger">{raceError}</p>}
                            {raceData && <p className="text-success">Raza encontrada: {raceData.name}</p>}

                            <div className="form-group">
                                <label>Sexo:</label>
                                <select
                                    name="sex"
                                    value={petData.sex}
                                    onChange={handleChange}
                                    className="input-box"
                                    required
                                >
                                    <option value="">Seleccione sexo</option>
                                    <option value="M">Macho</option>
                                    <option value="H">Hembra</option>
                                </select>
                            </div>

                            <Box_Text_Value
                                Label="Peso"
                                V_Text={petData.weight}
                                onChange={handleChange}
                                name="weight"
                                type="number"
                                min="0"
                                step="0.1"
                                required
                            />
                            <Box_Text_Value
                                Label="Fecha de Nacimiento"
                                V_Text={petData.dateNac}
                                onChange={handleChange}
                                name="dateNac"
                                type="date"
                                required
                            />
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
                                required
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
                                    required
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
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEditPet;
