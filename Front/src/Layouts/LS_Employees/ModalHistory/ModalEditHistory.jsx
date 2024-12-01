import React, { useEffect, useState } from "react";
import "../../../Layouts/Layouts.css";
import Box_Text_Value from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import { getClinicalHistoryById, updateClinicalHistory } from "../../../Services/historyClinService";
import { searchServiceByName } from "../../../Services/serviceService";

function ModalEditHistory({ idHistory, onClose, onUpdate }) {
  const [historyData, setHistoryData] = useState({
    diagnostico: "",
    resultado: "",
    registrationDate: "",
    status: "1",
    serviceName: "",
    serviceId: "",
    petId: "", // No editable
  });

  const [serviceData, setServiceData] = useState(null); // Datos del servicio encontrado
  const [serviceError, setServiceError] = useState(null); // Error al buscar servicio

  useEffect(() => {
    // Cargar datos del historial clínico
    const fetchHistoryData = async () => {
      try {
        const data = await getClinicalHistoryById(idHistory);
        setHistoryData({
          diagnostico: data.diagnostico,
          resultado: data.resultado,
          registrationDate: data.registrationDate,
          status: data.status,
          serviceName: data.serviceEntity.name,
          serviceId: data.serviceEntity.idService,
          petId: data.pet.idPet,
        });
      } catch (error) {
        console.error("Error al cargar el historial clínico:", error);
        alert("Error al cargar el historial clínico.");
      }
    };

    if (idHistory) fetchHistoryData();
  }, [idHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHistoryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Busca servicio por nombre
  const handleFindService = async () => {
    if (!historyData.serviceName) {
      setServiceError("Por favor, ingrese un nombre de servicio válido.");
      return;
    }

    try {
      const services = await searchServiceByName(historyData.serviceName);
      if (services.length > 0) {
        const service = services[0];
        setHistoryData((prevState) => ({
          ...prevState,
          serviceId: service.idService, // Asignar ID del servicio encontrado
        }));
        setServiceData(service);
        setServiceError(null);
        alert(`Servicio encontrado: ${service.name}`);
      } else {
        setServiceError("No se encontró un servicio con el nombre proporcionado.");
        setServiceData(null);
      }
    } catch (error) {
      console.error("Error en la búsqueda del servicio:", error);
      setServiceError("Ocurrió un error al buscar el servicio.");
      setServiceData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!historyData.serviceId) {
      alert("Por favor, busque y seleccione un servicio válido antes de guardar.");
      return;
    }

    try {
      await updateClinicalHistory(idHistory, {
        ...historyData,
        serviceEntity: { idService: historyData.serviceId },
        pet: { idPet: historyData.petId },
      });
      alert("Historial clínico actualizado exitosamente.");
      onUpdate(); // Actualiza la tabla
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar el historial clínico:", error);
      alert("Error al actualizar el historial clínico.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Historial Clínico</h5>
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
                Label="Diagnóstico"
                V_Text={historyData.diagnostico}
                onChange={handleChange}
                name="diagnostico"
                required
              />
              <Box_Text_Value
                Label="Resultado"
                V_Text={historyData.resultado}
                onChange={handleChange}
                name="resultado"
              />
              <Box_Text_Value
                Label="Fecha de Registro"
                V_Text={historyData.registrationDate}
                onChange={handleChange}
                name="registrationDate"
                type="date"
                required
              />
              <Box_Text_Value
                Label="Servicio (Nombre)"
                V_Text={historyData.serviceName}
                onChange={handleChange}
                name="serviceName"
                required
              />
              <button type="button" className="btn btn-secondary" onClick={handleFindService}>
                Buscar Servicio
              </button>
              {serviceError && <p className="text-danger">{serviceError}</p>}
              {serviceData && (
                <p className="text-success">Servicio encontrado: {serviceData.name}</p>
              )}
              <div className="form-group">
                <label>Estado:</label>
                <select
                  name="status"
                  value={historyData.status}
                  onChange={handleChange}
                  className="input-box"
                >
                  <option value="1">En curso</option>
                  <option value="2">Observación</option>
                  <option value="3">Terminado</option>
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
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalEditHistory;
