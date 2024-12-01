import React, { useState, useEffect } from "react";
import { updateQuote, getQuoteById } from "../../../Services/quotesService"; 
import { fetchActivePetsForClient } from "../../../Services/petService";
import { fetchActivePaymentMethods } from "../../../Services/metPagService";
import { getServiceById } from "../../../Services/serviceService";
import DateTimePicker from "../../../Components/CS_General/Form Box/DateTimePicker/DateTimePicker";
import Box_Text_Value from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import SelectImput from "../../../Components/CS_General/Form Box/SelectImput/SelectImput";

function ModelEditQuote_Cl({ clientId, quoteId, onClose, onUpdate }) {
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

  const [pets, setPets] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [timeStep, setTimeStep] = useState("00:15:00");
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    const loadQuoteDetails = async () => {
      try {
        const quote = await getQuoteById(quoteId); // Obtener datos de la cita por ID
        setQuoteData({
          petId: quote.pet.idPet,
          serviceId: quote.service.idService,
          metPagId: quote.metPag.idMetPag,
          date: quote.date,
          hour: quote.hour,
          comments: quote.comments,
          statusPag: quote.statusPag.toString(),
          status: quote.status.toString(),
        });

        const service = await getServiceById(quote.service.idService);
        if (service) {
          setTimeStep(service.category?.timeSpan || "00:15:00");
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la cita:", error);
      }
    };

    const loadPets = async () => {
      try {
        const pets = await fetchActivePetsForClient(clientId);
        setPets(pets);
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      }
    };

    const loadPaymentMethods = async () => {
      try {
        const methods = await fetchActivePaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Error al cargar métodos de pago:", error);
      }
    };

    loadQuoteDetails();
    loadPets();
    loadPaymentMethods();
  }, [clientId, quoteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuoteData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    const selectedDate = new Date(`${quoteData.date}T${quoteData.hour}`);

    if (!quoteData.petId) newErrors.petId = "Selecciona una mascota.";
    if (!quoteData.serviceId) newErrors.serviceId = "Selecciona un servicio.";
    if (!quoteData.metPagId) newErrors.metPagId = "Selecciona un método de pago.";
    if (!quoteData.date) newErrors.date = "Selecciona una fecha.";
    if (!quoteData.hour) newErrors.hour = "Selecciona una hora.";
    if (selectedDate <= currentDate) {
      newErrors.date = "La fecha y hora no pueden ser anteriores a la actual.";
    }

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
      statusPag: parseInt(quoteData.statusPag),
      status: parseInt(quoteData.status),
    };

    try {
      const updatedData = await updateQuote(quoteId, formattedData); // Usar el servicio con el `quoteId`
      console.log("Respuesta de la actualización:", updatedData);
      alert("Cita actualizada exitosamente.");
      onUpdate(); // Refrescar citas
      onClose(); // Cerrar modal
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      setGlobalError("Error al actualizar la cita. Intenta de nuevo.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cita</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {globalError && <p className="text-danger">{globalError}</p>}
              <SelectImput
                label="Mascota"
                name="petId"
                value={quoteData.petId}
                onChange={handleChange}
                options={pets.map((pet) => ({ value: pet.id, label: pet.name }))}
              />
              {errors.petId && <p className="text-danger">{errors.petId}</p>}

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
              {errors.metPagId && <p className="text-danger">{errors.metPagId}</p>}

              <DateTimePicker
                label="Fecha"
                type="date"
                name="date"
                value={quoteData.date}
                onChange={handleChange}
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

export default ModelEditQuote_Cl;
