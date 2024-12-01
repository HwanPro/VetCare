import React, { useEffect, useState } from 'react';
import { getActiveQuotesByClientId } from '../../Services/quotesService.js';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import Pagination from '../../Components/CS_General/Pagination';

function L_Notifications_Cl() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAppointments();
    }, [currentPage]);

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
            setAppointments(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            setError('Hubo un problema al cargar las citas.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <p>Cargando notificaciones...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <section className="Layout">
            <div className="Content_Layout">
                <C_Title nameTitle={'Recordatorios | Notificaciones'} />

                <div className="appointments-list">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div key={appointment.idQuote} className="appointment-card">
                                <div className="appointment-icon">
                                    <img src="/Img/Notification.svg" alt="icon-notifi" />
                                </div>
                                <div className="appointment-info">
                                    <h5 className="appointment-title">Hola!</h5>
                                    <p>Te Recordatorios que tienes una cita próxima para la {appointment.service.name} de tu {appointment.pet.race.especie.name} {appointment.pet.name} 
                                      <br />¡Nos vemos pronto para asegurarnos de que siga saludable y protegido!
                                    </p>
                                    <p>
                                        {new Date(appointment.date).toLocaleDateString()}{' '}
                                        {new Date(appointment.date).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No tienes notificaciones registradas.</p>
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </section>
    );
}

export default L_Notifications_Cl;
