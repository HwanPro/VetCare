import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchQuotesForCalendar } from '../../Services/quotesService.js';
import ModalViewQuoteCalendar from '../../Layouts/LS_Employees/ModalQuote/ModalViewQuoteCalendar';
function C_Calendar() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);

    // Cargar eventos del calendario
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchQuotesForCalendar(); // Llama al método para obtener las citas activas
                const formattedEvents = data.map(quote => ({
                    id: quote.idQuote,
                    title: `${quote.serviceName} - ${quote.petName}`,
                    start: `${quote.date}T${quote.hour}`, // Combina fecha y hora
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            }
        };

        loadEvents();
    }, []);

    // Manejador de clic en un evento
    const handleEventClick = (info) => {
        setSelectedQuoteId(info.event.id); // Configura el ID de la cita seleccionada
        setIsModalOpen(true); // Abre el modal
    };

    // Cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQuoteId(null);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick} // Manejador de clic en evento
            />

            {/* Modal para mostrar los detalles de la cita */}
            {isModalOpen && (
                <ModalViewQuoteCalendar
                    idQuote={selectedQuoteId} // Pasa el ID de la cita al modal
                    onClose={closeModal} // Función para cerrar el modal
                />
            )}
        </div>
    );
}

export default C_Calendar;
