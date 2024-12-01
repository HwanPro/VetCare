import React, { useState, useEffect } from "react";
import SelectImput from "../../../Components/CS_General/Form Box/SelectImput/SelectImput";
import DateTimePicker from "../../../Components/CS_General/Form Box/DateTimePicker/DateTimePicker";
import Box_Text_Value from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import { getPetNameById } from "../../../Services/petService";
import { searchServicesByName } from "../../../Services/serviceService";
import { fetchActivePaymentMethods } from "../../../Services/metPagService";
import { getQuoteById, updateQuote } from "../../../Services/quotesService";

function ModalEditQuote({ quoteId, onClose, onUpdate }) {
    const [quoteData, setQuoteData] = useState({
        petId: "",
        serviceId: "",
        metPagId: "",
        statusPag: "",
        status: "",
        date: "",
        hour: "",
        comments: "",
    });

    const [petMessage, setPetMessage] = useState("");
    const [serviceMessage, setServiceMessage] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [errors, setErrors] = useState({});
    const [timeStep, setTimeStep] = useState("00:15:00");

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch quote data
                const data = await getQuoteById(quoteId);
                setQuoteData({
                    petId: data.pet.idPet,
                    serviceId: data.service.idService,
                    metPagId: data.metPag.idMetPag,
                    statusPag: data.statusPag,
                    status: data.status,
                    date: data.date,
                    hour: data.hour,
                    comments: data.comments,
                });

                // Fetch pet name for validation message
                const petMessage = await getPetNameById(data.pet.idPet);
                setPetMessage(petMessage);

                // Fetch service name for validation message
                const serviceResponse = await searchServicesByName(data.service.name);
                const service = serviceResponse.content[0];
                setServiceMessage(service ? `Servicio encontrado: ${service.name}` : "Servicio no encontrado");

                // Load payment methods
                const methods = await fetchActivePaymentMethods();
                setPaymentMethods(methods);

                // Update timeStep based on service category
                if (service && service.category.timeSpan) {
                    setTimeStep(service.category.timeSpan);
                }
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        loadData();
    }, [quoteId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuoteData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFindPet = async () => {
        if (!quoteData.petId.trim()) {
            setPetMessage("Por favor, ingrese un ID de mascota válido.");
            return;
        }

        try {
            const message = await getPetNameById(quoteData.petId);
            setPetMessage(message);
        } catch (error) {
            setPetMessage(error || "Ocurrió un error al buscar la mascota.");
        }
    };

    const handleFindService = async () => {
        if (!quoteData.serviceId.trim()) {
            setServiceMessage("Por favor, ingrese un nombre de servicio válido.");
            return;
        }

        try {
            const serviceResponse = await searchServicesByName(quoteData.serviceId);
            const service = serviceResponse.content[0];
            if (service) {
                setServiceMessage(`Servicio encontrado: ${service.name}`);
                setQuoteData((prevState) => ({
                    ...prevState,
                    serviceId: service.idService,
                }));
                setTimeStep(service.category.timeSpan || "00:15:00");
            } else {
                setServiceMessage("No se encontró un servicio con el nombre proporcionado.");
            }
        } catch (error) {
            setServiceMessage("Ocurrió un error al buscar el servicio.");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!quoteData.petId) newErrors.petId = "Selecciona una mascota.";
        if (!quoteData.serviceId) newErrors.serviceId = "Selecciona un servicio.";
        if (!quoteData.metPagId) newErrors.metPagId = "Selecciona un método de pago.";
        if (!quoteData.date) newErrors.date = "Selecciona una fecha.";
        if (!quoteData.hour) newErrors.hour = "Selecciona una hora.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            pet: { idPet: parseInt(quoteData.petId) },
            service: { idService: parseInt(quoteData.serviceId) },
            metPag: { idMetPag: parseInt(quoteData.metPagId) },
            date: quoteData.date,
            hour: quoteData.hour,
            comments: quoteData.comments,
            statusPag: quoteData.statusPag,
            status: quoteData.status,
        };

        try {
            await updateQuote(quoteId, payload);
            alert("Cita actualizada exitosamente.");
            onUpdate();
            onClose();
        } catch (error) {
            alert(error || "Error al actualizar la cita.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Cita</h5>
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
                                Label="ID Mascota"
                                V_Text={quoteData.petId}
                                onChange={handleChange}
                                name="petId"
                                required
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindPet}>
                                Buscar Mascota
                            </button>
                            {petMessage && (
                                <p className={petMessage.includes("error") ? "text-danger" : "text-success"}>
                                    {petMessage}
                                </p>
                            )}
                            <Box_Text_Value
                                Label="Nombre del Servicio"
                                V_Text={quoteData.serviceId}
                                onChange={handleChange}
                                name="serviceId"
                                required
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleFindService}>
                                Buscar Servicio
                            </button>
                            {serviceMessage && (
                                <p className={serviceMessage.includes("error") ? "text-danger" : "text-success"}>
                                    {serviceMessage}
                                </p>
                            )}
                            <SelectImput
                                label="Método de Pago"
                                name="metPagId"
                                value={quoteData.metPagId}
                                onChange={handleChange}
                                options={paymentMethods.map((method) => ({
                                    value: method.idMetPag,
                                    label: method.name,
                                }))}
                            />
                            <DateTimePicker
                                label="Fecha"
                                type="date"
                                name="date"
                                value={quoteData.date}
                                onChange={handleChange}
                                dateRestriction="future"
                            />
                            <DateTimePicker
                                label="Hora"
                                type="time"
                                name="hour"
                                value={quoteData.hour}
                                onChange={handleChange}
                                timeStep={timeStep}
                            />
                            <Box_Text_Value
                                Label="Comentarios"
                                V_Text={quoteData.comments}
                                onChange={handleChange}
                                name="comments"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalEditQuote;
