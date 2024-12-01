import React, { useState, useEffect } from 'react';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import "../../Layouts/Layouts.css";
import Pagination from '../../Components/CS_General/Pagination';
import Btn_New from '../../Components/CS_General/Buttons/Btn_New';
import Btn_Edit from '../../Components/CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../../Components/CS_General/Buttons/Btn_Delete';
import ModalNewEspecie from './ModalEspecie/ModalNewEspecie';
import ModalEditEspecie from './ModalEspecie/ModalEditEspecie';
import { listActiveEspecies, blockEspecie } from '../../Services/especieService';

function L_Especie_Em() {
  const [especies, setEspecies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEspecieId, setSelectedEspecieId] = useState(null);

  // Función para cargar las especies activas con paginación
  const fetchEspecies = async (page) => {
    try {
      const data = await listActiveEspecies(page -1); 
      setEspecies(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error al cargar las especies:", error);
    }
  };

  // Cargar especies cuando cambia la página actual
  useEffect(() => {
    fetchEspecies(currentPage);
  }, [currentPage]);

  const handleBlockEspecie = async (id) => {
    try {
      await blockEspecie(id);
      alert("Especie bloqueada exitosamente");
      fetchEspecies(currentPage);
    } catch (error) {
      console.error("Error al bloquear la especie:", error);
      alert("Error al bloquear la especie");
    }
  };

  const openNewModal = () => {
    setIsNewModalOpen(true);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
  };

  const openEditModal = (id) => {
    setSelectedEspecieId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEspecieId(null);
    setIsEditModalOpen(false);
  };

  return (
    <section className="Layout">
      <div className="Content_Layout">
        <C_Title nameTitle={"Especies"} />

        {/* Tabla de especies */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {especies.length > 0 ? (
              especies.map((especie) => (
                <tr key={especie.idEspecie}>
                  <td>{especie.idEspecie}</td>
                  <td>{especie.name}</td>
                  <td>{especie.status === '1' ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <div className="d-flex">
                      <Btn_Edit
                        nameId={especie.idEspecie}
                        showContent="icon"
                        onEdit={() => openEditModal(especie.idEspecie)}
                      />
                      <Btn_Delete
                        nameId={especie.idEspecie}
                        showContent="icon"
                        onDelete={() => handleBlockEspecie(especie.idEspecie)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No se encontraron especies.</td>
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
            nameId="btnAddNewEspecie"
            showContent="text+icon"
            onNew={openNewModal}
          />
        </div>

        {/* Modales */}
        {isNewModalOpen && (
          <ModalNewEspecie
            onClose={closeNewModal}
            onUpdate={() => fetchEspecies(currentPage)}
          />
        )}
        {isEditModalOpen && (
          <ModalEditEspecie
            especieId={selectedEspecieId}
            onClose={closeEditModal}
            onUpdate={() => fetchEspecies(currentPage)}
          />
        )}
      </div>
    </section>
  );
}

export default L_Especie_Em;
