import React, { useState, useEffect } from "react";
import Box_Text_Value from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import DateTimePicker from "../../../Components/CS_General/Form Box/DateTimePicker/DateTimePicker";
import SelectInput from "../../../Components/CS_General/Form Box/SelectImput/SelectImput";
import { getPetNameById } from "../../../Services/petService";
import { searchServicesByName } from "../../../Services/serviceService";
import { fetchActivePaymentMethods } from "../../../Services/metPagService";
import { createQuote } from "../../../Services/quotesService";

function ModelNewQuote({ onClose, onUpdate }) {
    const [quoteData, setQuoteData] = useState({
        petId: "",
        serviceId: "",
        metPagId: "",
        date: "",
        hour: "",
        comments: "",
        statusPag: "1",
        status: "1",
    });

    const [timeStep, setTimeStep] = useState("00:15:00"); // Valor predeterminado
    const [petMessage, setPetMessage] = useState("");
    const [serviceMessage, setServiceMessage] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState("");

    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                const methods = await fetchActivePaymentMethods();
                setPaymentMethods(methods);
                if (methods.length > 0) {
                    setQuoteData((prevState) => ({
                        ...prevState,
                        metPagId: methods[0].idMetPag,
                    }));
                }
            } catch (error) {
                console.error("Error al cargar los métodos de pago:", error);
                setGlobalError("Error al cargar los métodos de pago.");
            }
        };

        loadPaymentMethods();
    }, []);

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
            console.error("Error al buscar la mascota:", error);
            const errorMessage = error?.includes("muerta")
                ? "Mascota encontrada pero está marcada como muerta."
                : "Mascota no encontrada.";
            setPetMessage(errorMessage);
        }
    };

    const handleFindService = async () => {
        if (!quoteData.serviceId.trim()) {
            setServiceMessage("Por favor, ingrese un nombre de servicio válido.");
            return;
        }

        try {
            const serviceData = await searchServicesByName(quoteData.serviceId);
            const service = serviceData.content[0]; // Primer resultado
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
            console.error("Error al buscar el servicio:", error);
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

        const formattedData = {
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
            await createQuote(formattedData);
            alert("Cita creada exitosamente.");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error al crear la cita:", error);
            const errorMessage = error?.includes("Capacidad máxima alcanzada")
                ? "Capacidad máxima alcanzada para la fecha y hora seleccionadas."
                : "Error al crear la cita.";
            setGlobalError(errorMessage);
        }
    };

    return (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nueva Cita</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {globalError && <p className="text-danger">{globalError}</p>}
                            <Box_Text_Value
                                Label="ID Mascota"
                                V_Text={quoteData.petId}
                                onChange={handleChange}
                                name="petId"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleFindPet}
                            >
                                Buscar Mascota
                            </button>
                            {petMessage && (
                                <p
                                    className={
                                        petMessage.includes("muerta") ||
                                        petMessage.includes("no encontrada")
                                            ? "text-danger"
                                            : "text-success"
                                    }
                                >
                                    {petMessage}
                                </p>
                            )}
                            {errors.petId && <p className="text-danger">{errors.petId}</p>}

                            <Box_Text_Value
                                Label="Nombre del Servicio"
                                V_Text={quoteData.serviceId}
                                onChange={handleChange}
                                name="serviceId"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleFindService}
                            >
                                Buscar Servicio
                            </button>
                            {serviceMessage && (
                                <p
                                    className={
                                        serviceMessage.includes("error")
                                            ? "text-danger"
                                            : "text-success"
                                    }
                                >
                                    {serviceMessage}
                                </p>
                            )}
                            {errors.serviceId && <p className="text-danger">{errors.serviceId}</p>}

                            <SelectInput
                                label="Método de Pago"
                                name="metPagId"
                                value={quoteData.metPagId}
                                onChange={handleChange}
                                options={paymentMethods.map((method) => ({
                                    value: method.idMetPag,
                                    label: method.name,
                                }))}
                            />
                            {errors.metPagId && <p className="text-danger">{errors.metPagId}</p>}

                            <DateTimePicker
                                label="Fecha"
                                type="date"
                                name="date"
                                value={quoteData.date}
                                onChange={handleChange}
                                dateRestriction="future"
                            />
                            {errors.date && <p className="text-danger">{errors.date}</p>}

                            <DateTimePicker
                                label="Hora"
                                type="time"
                                name="hour"
                                value={quoteData.hour}
                                onChange={handleChange}
                                timeStep={timeStep}
                            />
                            {errors.hour && <p className="text-danger">{errors.hour}</p>}

                            <Box_Text_Value
                                Label="Comentarios"
                                V_Text={quoteData.comments}
                                onChange={handleChange}
                                name="comments"
                            />
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
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModelNewQuote;
