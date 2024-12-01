import React, { useState, useEffect } from 'react';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import "../../Layouts/Layouts.css";
import Pagination from '../../Components/CS_General/Pagination';
import Btn_New from '../../Components/CS_General/Buttons/Btn_New';
import Btn_Edit from '../../Components/CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../../Components/CS_General/Buttons/Btn_Delete';
import ModalNewRace from './ModalRace/ModalNewRace';
import ModalEditRace from './ModalRace/ModalEditRace';
import { listActiveRaces, blockRace } from '../../Services/raceService';

function L_Race_Em() {
  const [races, setRaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRaceId, setSelectedRaceId] = useState(null);

  const loadRaces = async (page) => {
    try {
      const data = await listActiveRaces(page - 1); // Backend espera página indexada desde 0
      setRaces(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al cargar las razas:", error);
    }
  };

  useEffect(() => {
    loadRaces(currentPage);
  }, [currentPage]);

  const handleBlockRace = async (id) => {
    try {
      await blockRace(id);
      alert("Raza bloqueada exitosamente");
      loadRaces(currentPage);
    } catch (error) {
      console.error("Error al bloquear la raza:", error);
      alert("Error al bloquear la raza");
    }
  };

  const openNewModal = () => {
    setIsNewModalOpen(true);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
  };

  const openEditModal = (id) => {
    setSelectedRaceId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedRaceId(null);
    setIsEditModalOpen(false);
  };

  return (
    <section className="Layout">
      <div className="Content_Layout">
        <C_Title nameTitle={"Razas"} />

        {/* Tabla de razas */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {races.length > 0 ? (
              races.map((race) => (
                <tr key={race.idRace}>
                  <td>{race.idRace}</td>
                  <td>{race.name}</td>
                  <td>{race.especie.name}</td>
                  <td>{race.status === '1' ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <div className="d-flex">
                      <Btn_Edit
                        nameId={race.idRace}
                        showContent="icon"
                        onEdit={() => openEditModal(race.idRace)}
                      />
                      <Btn_Delete
                        nameId={race.idRace}
                        showContent="icon"
                        onDelete={() => handleBlockRace(race.idRace)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No se encontraron razas.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <Btn_New
            nameId="btnAddNewRace"
            showContent="text+icon"
            onNew={openNewModal}
          />
        </div>

        {/* Modales */}
        {isNewModalOpen && (
          <ModalNewRace
            onClose={closeNewModal}
            onUpdate={() => loadRaces(currentPage)}
          />
        )}
        {isEditModalOpen && (
          <ModalEditRace
            raceId={selectedRaceId}
            onClose={closeEditModal}
            onUpdate={() => loadRaces(currentPage)}
          />
        )}
      </div>
    </section>
  );
}

export default L_Race_Em;
