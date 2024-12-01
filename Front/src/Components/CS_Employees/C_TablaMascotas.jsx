import React, { useEffect, useState } from 'react';
import Btn_Edit from '../CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../CS_General/Buttons/Btn_Delete';
import Btn_New from '../CS_General/Buttons/Btn_New';
import Btn_PetInfo from '../CS_General/Buttons/Btn_PetInfo';
import Box_Text_Empty from '../CS_General/Form Box/Box_Text/Box_Text_Empty';
import Pagination from '../CS_General/Pagination';
import ModalEditPet from '../../Layouts/LS_Employees/ModalPet/ModalEditPet';
import ModalNewPet from '../../Layouts/LS_Employees/ModalPet/ModalNewPet';
import L_InfoPet_Em from '../../Layouts/LS_Employees/L_InfoPet_Em';
import C_Title from '../CS_General/C_Title/C_Title';
import { searchPets, blockPet } from '../../Services/PetService';

function C_TablaMascotas() {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: '1',
    dni: '',
    raceName: '',
    petName: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetInfoId, setSelectedPetInfoId] = useState(null);

  // Restaurar función calculateAge
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

  useEffect(() => {
    fetchPets(currentPage, filters);
  }, [currentPage]);

  const fetchPets = async (page, customFilters = {}) => {
    try {
      const mergedFilters = { ...filters, ...customFilters };
      const data = await searchPets(mergedFilters, page, 9);
      setPets(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPets(0, filters);
  };

  const handleBlockPet = async (petId) => {
    try {
      await blockPet(petId);
      fetchPets(currentPage, filters);
    } catch (error) {
      console.error('Error al bloquear la mascota:', error);
    }
  };

  const openModal = (petId) => {
    setSelectedPetId(petId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPetId(null);
  };

  const openNewPetModal = () => {
    setIsNewPetModalOpen(true);
  };

  const closeNewPetModal = () => {
    setIsNewPetModalOpen(false);
  };

  const openPetInfo = (petId) => {
    setSelectedPetInfoId(petId);
  };

  const closePetInfo = () => {
    setSelectedPetInfoId(null);
  };

  const styles = {
    flexButtonOptions: {
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <div>
      {!selectedPetInfoId ? (
        <>
          <C_Title nameTitle="Gestión de Mascotas" />
          <form onSubmit={handleSearch} className="row">
            <div className="col">
              <div className="form-group">
                <label>Estado:</label>
                <select
                  name="status"
                  className="input-box"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="1">Activo</option>
                  <option value="0">Muerto</option>
                </select>
              </div>
            </div>
            <div className="col">
              <Box_Text_Empty
                id="dni"
                Label="DNI del Dueño"
                value={filters.dni}
                onChange={handleFilterChange}
                name="dni"
              />
            </div>
            <div className="col">
              <Box_Text_Empty
                id="raceName"
                Label="Nombre de la Raza"
                value={filters.raceName}
                onChange={handleFilterChange}
                name="raceName"
              />
            </div>
            <div className="col">
              <Box_Text_Empty
                id="petName"
                Label="Nombre de la Mascota"
                value={filters.petName}
                onChange={handleFilterChange}
                name="petName"
              />
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </div>
          </form>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Raza</th>
                <th>Sexo</th>
                <th>Dueño</th>
                <th>Peso</th>
                <th>Edad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <tr key={pet.idPet}>
                    <td>{pet.idPet}</td>
                    <td>{pet.name}</td>
                    <td>{pet.race.name}</td>
                    <td>{pet.sex}</td>
                    <td>{`${pet.client.firstName} ${pet.client.firstLastName}`}</td>
                    <td>{pet.weight} kg</td>
                    <td>{calculateAge(pet.dateNac)}</td>
                    <td>{pet.status === '1' ? 'Activo' : 'Muerto'}</td>
                    <td>
                      <div
                        className="flex_button_options"
                        style={styles.flexButtonOptions}
                      >
                        <Btn_PetInfo
                          nameId={pet.idPet}
                          showContent="icon"
                          onClick={() => openPetInfo(pet.idPet)}
                        />
                        <Btn_Edit
                          nameId={pet.idPet}
                          showContent="icon"
                          onEdit={() => openModal(pet.idPet)}
                        />
                        <Btn_Delete
                          nameId={pet.idPet}
                          showContent="icon"
                          onDelete={() => handleBlockPet(pet.idPet)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No se encontraron mascotas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
            <Btn_New
              nameId="btnAddNewPet"
              showContent="text+icon"
              onNew={openNewPetModal}
            />
          </div>
        </>
      ) : (
        <L_InfoPet_Em idPet={selectedPetInfoId} onClose={closePetInfo} />
      )}

      {isModalOpen && (
        <ModalEditPet
          petId={selectedPetId}
          onClose={closeModal}
          onUpdate={() => fetchPets(currentPage, filters)}
        />
      )}
      {isNewPetModalOpen && (
        <ModalNewPet
          onClose={closeNewPetModal}
          onUpdate={() => fetchPets(currentPage, filters)}
        />
      )}
    </div>
  );
}

export default C_TablaMascotas;
