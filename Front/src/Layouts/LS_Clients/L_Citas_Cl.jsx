import React, { useEffect, useState } from 'react';
import { getActiveQuotesByClientId, cancelQuote } from "../../Services/quotesService.js";
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import Btn_Info from '../../Components/CS_General/Buttons/Btn_Info';
import './LS_Client.css';
import Btn_Delete from '../../Components/CS_General/Buttons/Btn_Delete';
import Pagination from '../../Components/CS_General/Pagination';
import Btn_Edit from "../../Components/CS_General/Buttons/Btn_Edit";
import ModalViewQuoteCalendarCl from './ModalQuote/ModelViewQuoteCalendarCl';
import ModelEditQuote_Cl from '../LS_Clients/ModalQuote/ModelEditQuote_Cl.jsx';

function L_Citas_Cl() {
    const [appointments, setAppointments] = useState([]); // Lista de citas
    const [loading, setLoading] = useState(true); // Indicador de carga
    const [error, setError] = useState(null); // Mensaje de error
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Modal de información
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal de edición
    const [selectedQuoteId, setSelectedQuoteId] = useState(null); // ID de la cita seleccionada
    const [currentPage, setCurrentPage] = useState(0); // Página actual de paginación
    const [totalPages, setTotalPages] = useState(0); // Total de páginas para paginación

    // Cargar citas al cargar el componente o cambiar de página
    useEffect(() => {
        fetchAppointments();
    }, [currentPage]);

    // Función para cargar las citas del cliente
    const fetchAppointments = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('No se encontró el ID del cliente.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getActiveQuotesByClientId(userId, currentPage, 5);
            console.log("Citas cargadas:", data);
            setAppointments(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error("Error al cargar citas:", err);
            setError('Hubo un problema al cargar las citas.');
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal de información
    const handleViewInfo = (idQuote) => {
        console.log("Ver detalles de la cita con ID:", idQuote);
        setSelectedQuoteId(idQuote);
        setIsInfoModalOpen(true);
    };

    // Abrir modal de edición
    const handleEditQuote = (idQuote) => {
        console.log("Editando cita con ID:", idQuote);
        setSelectedQuoteId(idQuote);
        setIsEditModalOpen(true);
    };


    // Cancelar una cita
    const handleCancelQuote = async (idQuote) => {
        try {
            await cancelQuote(idQuote);
            console.log("Cita cancelada con ID:", idQuote);
            await fetchAppointments(); // Refrescar citas
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            setError('Error al cancelar la cita.');
        }
    };

    // Cerrar modal de información
    const handleCloseInfoModal = () => {
        console.log("Cerrando modal de información");
        setIsInfoModalOpen(false);
        setSelectedQuoteId(null);
    };

    // Cerrar modal de edición
    const handleCloseEditModal = () => {
        console.log("Cerrando modal de edición");
        setIsEditModalOpen(false);
        setSelectedQuoteId(null);
        fetchAppointments(); // Refrescar citas después de editar
    };

    // Cambiar página de paginación
    const handlePageChange = (page) => {
        console.log("Cambiando a la página:", page);
        setCurrentPage(page);
    };

    if (loading) {
        return <p>Cargando citas...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <section className='Layout'>
            <div className='Content_Layout'>
                <C_Title nameTitle={'Citas'} />

                <div className='appointments-list'>
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div key={appointment.idQuote} className='appointment-card'>
                                <div className='content-appointment-card'> 
                                    <div className='appointment-icon'>
                                        <img src='/Img/calendar_clock.svg' alt='' />
                                    </div>
                                    <div className='appointment-info'>
                                        <h5 className='appointment-title'>{appointment.service.name}</h5>
                                        <p>Mascota: {appointment.pet.name}</p>
                                        <p>
                                            {new Date(appointment.date).toLocaleDateString()}{' '}
                                            {new Date(appointment.date).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className='appointment-actions'>
                                    <Btn_Info
                                        showContent='icon'
                                        onClick={() => handleViewInfo(appointment.idQuote)}
                                    />
                                    <Btn_Edit 
                                        showContent='icon'
                                        onEdit={() => handleEditQuote(appointment.idQuote)}
                                    />
                                    <Btn_Delete
                                        nameId={"eliminarQuote"}
                                        showContent='icon'
                                        onDelete={() => handleCancelQuote(appointment.idQuote)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No tienes citas registradas.</p>
                    )}
                </div>

                <div className='d-flex justify-content-between align-items-center mt-3'>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            {isInfoModalOpen && selectedQuoteId && (
                <ModalViewQuoteCalendarCl
                    idQuote={selectedQuoteId}
                    onClose={handleCloseInfoModal}
                />
            )}

            {isEditModalOpen && selectedQuoteId && (
                <ModelEditQuote_Cl
                    clientId={localStorage.getItem('userId')}
                    quoteId={selectedQuoteId}
                    onClose={handleCloseEditModal}
                    onUpdate={fetchAppointments}
                />
            )}
        </section>
    );
}

export default L_Citas_Cl;
