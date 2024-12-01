import React, { useEffect, useState } from "react";
import C_Title from "../../Components/CS_General/C_Title/C_Title";
import Btn_Edit from "../../Components/CS_General/Buttons/Btn_Edit";
import Btn_PetInfo from "../../Components/CS_General/Buttons/Btn_PetInfo";
import Btn_Delete from "../../Components/CS_General/Buttons/Btn_Delete";
import ModalNewPet_Cl from "../LS_Clients/ModelPets/ModalNewPet_Cl";
import Btn_New from "../../Components/CS_General/Buttons/Btn_New";
import L_InfoPet_Em from "../LS_Employees/L_InfoPet_Em";
import { fetchPetsByClientId, blockPet } from "../../Services/petService";
import ModalEditPet from "../LS_Employees/ModalPet/ModalEditPet"
import "./LS_Client.css";

function L_Pets_Cl() {
  const [pets, setPets] = useState([]); // Lista de mascotas
  const [loading, setLoading] = useState(true); // Cargando
  const [error, setError] = useState(null); // Errores
  const [selectedPetId, setSelectedPetId] = useState(null); // ID para editar mascota
  const [showEditModal, setShowEditModal] = useState(false); // Estado del modal de edición
  const [showNewModal, setShowNewModal] = useState(false); // Estado del modal de nueva mascota
  const [selectedPetInfoId, setSelectedPetInfoId] = useState(null); // ID para mostrar información de mascota

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Obtén el ID del cliente
    if (!userId) {
      setError("No se encontró el ID del cliente en el almacenamiento local.");
      setLoading(false);
      return;
    }

    // Llamada al backend para obtener las mascotas
    const fetchPets = async () => {
      try {
        const data = await fetchPetsByClientId(userId); // Utilizando Axios
        setPets(data.content || []); // Guarda las mascotas
      } catch (err) {
        setError("Hubo un problema al cargar las mascotas.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets(); // Ejecuta la función
  }, []);

  const calculateAge = (dateNac) => {
    const today = new Date();
    const birthDate = new Date(dateNac);
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semanas`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} meses`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} años`;
    }
  };

  const handleBlockPet = async (petId) => {
    try {
      await blockPet(petId); // Llamada al método blockPet de axios
      alert("Mascota bloqueada exitosamente.");
      setPets((prevPets) => prevPets.filter((pet) => pet.idPet !== petId));
    } catch (error) {
      alert("Error al intentar bloquear la mascota.");
    }
  };

  const openEditModal = (petId) => {
    setSelectedPetId(petId);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedPetId(null);
    setShowEditModal(false);
  };

  const openNewModal = () => setShowNewModal(true);

  const closeNewModal = () => setShowNewModal(false);

  const openPetInfo = (petId) => setSelectedPetInfoId(petId); // Muestra información de mascota

  const closePetInfo = () => setSelectedPetInfoId(null); // Cierra la vista de información

  const handleUpdate = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const data = await fetchPetsByClientId(userId); // Actualiza lista de mascotas
      setPets(data.content || []);
    } catch (error) {
      alert("Error al actualizar la lista de mascotas.");
    }
  };

  if (loading) return <p>Cargando mascotas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="Layout">
      <div className="Content_Layout">
        {selectedPetInfoId ? (
          // Muestra la información detallada de la mascota
          <L_InfoPet_Em idPet={selectedPetInfoId} onClose={closePetInfo} />
        ) : (
          <>
            <C_Title nameTitle={"Mascotas"} />
            {/* Lista de mascotas */}
            <div className="pets-list-client">
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <div key={pet.idPet} className="pet-card">
                    <div className="content-pet-card">
                      <img
                        src={`/Img/${pet.race.especie.name}.webp`}
                        alt={`Foto de ${pet.name}`}
                      />
                      <div> 
                        <h3>{pet.name}</h3>
                        <p>Raza: {pet.race.name}</p>
                        <p>Edad: {calculateAge(pet.dateNac)}</p>
                      </div>
                    </div>
                    
                    <div
                      className="flex_button_options"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Btn_Edit
                        nameId={pet.idPet}
                        showContent="icon"
                        onEdit={() => openEditModal(pet.idPet)}
                      />
                      <Btn_PetInfo
                        nameId={pet.idPet}
                        showContent="icon"
                        onClick={() => openPetInfo(pet.idPet)}
                      />
                      <Btn_Delete
                        nameId={pet.idPet}
                        showContent="icon"
                        onDelete={() => handleBlockPet(pet.idPet)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No tienes mascotas registradas.</p>
              )}
            </div>

            {/* Botón para añadir nueva mascota */}
            <Btn_New showContent="text+icon" onNew={openNewModal} />
          </>
        )}

        {/* Modal de edición */}
        {showEditModal && selectedPetId && (
          <ModalEditPet
            petId={selectedPetId}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        )}

        {/* Modal de nueva mascota */}
        {showNewModal && (
          <ModalNewPet_Cl
            clientId={localStorage.getItem("userId")}
            onClose={closeNewModal}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </section>
  );
}

export default L_Pets_Cl;
