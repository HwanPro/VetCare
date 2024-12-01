import React, { useState, useEffect } from "react";
import { createQuote } from "../../../Services/quotesService";
import { fetchActivePetsForClient } from "../../../Services/petService";
import { fetchActivePaymentMethods } from "../../../Services/metPagService";
import { getServiceById } from "../../../Services/serviceService";
import DateTimePicker from "../../../Components/CS_General/Form Box/DateTimePicker/DateTimePicker";
import Box_Text_Value from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import SelectImput from "../../../Components/CS_General/Form Box/SelectImput/SelectImput";

function ModalNewQuote_Cl({ clientId, onClose, onUpdate, defaultServiceId = null }) {
  const [quoteData, setQuoteData] = useState({
    petId: "",
    serviceId: defaultServiceId || "",
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
    const loadPets = async () => {
      try {
        const pets = await fetchActivePetsForClient(clientId);
        setPets(pets);

        if (pets.length > 0) {
          setQuoteData((prevState) => ({
            ...prevState,
            petId: pets[0].id,
          }));
        }
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      }
    };

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
        console.error("Error al cargar métodos de pago:", error);
      }
    };

    const loadServiceDetails = async () => {
      if (quoteData.serviceId) {
        try {
          const service = await getServiceById(quoteData.serviceId);
          if (service) {
            const categoryTimeSpan = service.category?.timeSpan || "00:15:00";
            setTimeStep(categoryTimeSpan);
          }
        } catch (error) {
          console.error("Error al cargar detalles del servicio:", error);
          setTimeStep("00:15:00");
        }
      }
    };

    loadPets();
    loadPaymentMethods();
    loadServiceDetails();
  }, [clientId, quoteData.serviceId]);

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
    if (selectedDate < currentDate) {
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
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalNewQuote_Cl;
