import React, { useState } from "react";
import Box_Text_Value from "../../../Components/CS_General/Form Box/Box_Text/Box_Text_Value";
import HiddenInput from "../../../Components/CS_General/Form Box/Box_Text/HiddenInput";
import { createPet } from "../../../Services/petService";
import { searchRaceByName } from "../../../Services/RaceService";

function ModalNewPet_Cl({ clientId, onClose, onUpdate }) {
  const [petData, setPetData] = useState({
    name: "",
    raceId: "",
    raceName: "",
    sex: "",
    weight: "",
    dateNac: "",
    comments: "",
    dirImage: "PetFoto.png",
    status: "1",
  });

  const [raceData, setRaceData] = useState(null); // Datos de la raza encontrada
  const [raceError, setRaceError] = useState(null); // Error al buscar raza
  const [isLoading, setIsLoading] = useState(false); // Cargando

  // Maneja cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Busca raza por nombre utilizando el método `searchRaceByName` de axios
  const handleFindRace = async () => {
    if (!petData.raceName) {
      setRaceError("Por favor, ingrese un nombre de raza válido.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchRaceByName(petData.raceName);
      if (response.content && response.content.length > 0) {
        const race = response.content[0];
        setPetData((prevState) => ({
          ...prevState,
          raceId: race.idRace,
        }));
        setRaceData({ name: race.name });
        setRaceError(null); // Limpiar errores
      } else {
        setRaceError("No se encontró una raza con el nombre proporcionado.");
        setRaceData(null); // Limpiar datos de la raza
      }
    } catch (error) {
      console.error("Error en la búsqueda de raza:", error);
      setRaceError("Ocurrió un error al buscar la raza.");
      setRaceData(null); // Limpiar datos de la raza
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja el envío del formulario para crear una nueva mascota utilizando `createPet`
  const handleCreatePet = async (e) => {
    e.preventDefault();

    if (!petData.raceId) {
      alert("Por favor, busque y seleccione una raza antes de crear la mascota.");
      return;
    }

    const petPayload = {
      name: petData.name,
      race: { idRace: petData.raceId },
      client: { idClient: clientId }, // Se utiliza el clientId pasado como parámetro
      sex: petData.sex,
      weight: petData.weight,
      dateNac: petData.dateNac,
      comments: petData.comments,
      dirImage: petData.dirImage,
      status: petData.status,
    };

    try {
      await createPet(petPayload); // Usar el método de axios para crear la mascota
      alert("Mascota creada exitosamente.");
      onUpdate(); // Actualiza la tabla de mascotas
      onClose(); // Cierra el modal
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
                required
              />
              <Box_Text_Value
                Label="Nombre de Raza"
                V_Text={petData.raceName}
                onChange={handleChange}
                name="raceName"
                required
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleFindRace}
                disabled={isLoading}
              >
                {isLoading ? "Buscando..." : "Buscar Raza"}
              </button>
              {raceError && <p className="text-danger">{raceError}</p>}
              {raceData && (
                <p className="text-success">Raza encontrada: {raceData.name}</p>
              )}
              <HiddenInput name="raceId" value={petData.raceId} />
              <Box_Text_Value
                Label="Sexo"
                V_Text={petData.sex}
                onChange={handleChange}
                name="sex"
                required
              />
              <Box_Text_Value
                Label="Peso"
                V_Text={petData.weight}
                onChange={handleChange}
                name="weight"
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
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

export default ModalNewPet_Cl;
