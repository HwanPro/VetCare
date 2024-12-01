import React, { useEffect, useState } from 'react';
import Btn_Edit from '../CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../CS_General/Buttons/Btn_Delete';
import Btn_New from '../CS_General/Buttons/Btn_New';
import Btn_Search from '../CS_General/Buttons/Btn_Search';
import Pagination from '../CS_General/Pagination';
import Box_Text_Empty from '../CS_General/Form Box/Box_Text/Box_Text_Empty';
import ModalEditQuote from '../../Layouts/LS_Employees/ModalQuote/ModalEditQuote';
import ModelNewQuote from '../../Layouts/LS_Employees/ModalQuote/ModelNewQuote';
import SelectImput from '../CS_General/Form Box/SelectImput/SelectImput';
import DateTimePicker from "../CS_General/Form Box/DateTimePicker/DateTimePicker";
import Btn_Confirm from '../CS_General/Buttons/Btn_Confirm';
import Btn_ConfirmPag from '../CS_General/Buttons/Btn_ConfirmPag';
import { fetchQuotes, cancelQuote, confirmQuote, confirmPayment } from '../../Services/quotesService';

function C_TablaCitas() {
    const [quotes, setQuotes] = useState([]); // Lista de citas
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const [filters, setFilters] = useState({
        date: '',
        status: '1',
        dni: '',
        serviceName: '',
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState(null);

    const statusOptions = [
        { value: '', label: 'Todos' },
        { value: '1', label: 'En espera' },
        { value: '0', label: 'Cancelado' },
        { value: '2', label: 'Vencido' },
        { value: '3', label: 'Confirmado' },
    ];

    // Cargar citas al iniciar
    useEffect(() => {
        loadQuotes();
    }, [currentPage]);

    // Obtener citas 
    const loadQuotes = async () => {
        try {
            const data = await fetchQuotes({ page: currentPage, filters });
            setQuotes(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Error al cargar las citas:", error);
        }
    };

    const handleCancelQuote = async (quoteId) => {
        try {
            const message = await cancelQuote(quoteId);
            alert(message);
            loadQuotes(); 
        } catch (error) {
            alert(`Error al cancelar la cita: ${error.message}`);
        }
    };

    const handleConfirmQuote = async (quoteId) => {
        try {
            const message = await confirmQuote(quoteId);
            alert(message);
            loadQuotes(); 
        } catch (error) {
            alert(`Error al confirmar la cita: ${error.message}`);
        }
    };

    const handleConfirmPayment = async (quoteId) => {
        try {
            const message = await confirmPayment(quoteId);
            alert(message);
            loadQuotes(); 
        } catch (error) {
            alert(`Error al confirmar el pago: ${error.message}`);
        }
    };

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Ejecutar búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        loadQuotes();
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    // Formatear hora
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hour, minute] = timeString.split(':'); // Dividir la hora y los minutos
        return `${hour}:${minute}`;
    };

    const openEditModal = (quoteId) => {
        setSelectedQuoteId(quoteId);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedQuoteId(null);
    };

    const openNewModal = () => {
        setIsNewModalOpen(true);
    };

    const closeNewModal = () => {
        setIsNewModalOpen(false);
    };

    return (
        <div>
            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="row">
                <div className="col">
                    <DateTimePicker
                        label="Fecha"
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col">
                    <SelectImput
                        label="Estado"
                        name="status"
                        value={filters.status}
                        options={statusOptions}
                        onChange={handleFilterChange}
                    />
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
                        id="serviceName"
                        Label="Nombre del Servicio"
                        value={filters.serviceName}
                        onChange={handleFilterChange}
                        name="serviceName"
                    />
                </div>
                <div className="col">
                    <Btn_Search
                        nameId="btnSearch"
                        showContent="text+icon"
                        onClick={handleSearch}
                    />
                </div>
            </form>

            {/* Tabla de citas */}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mascota</th>
                        <th>Dueño</th>
                        <th>Fecha</th>
                        <th>Servicio</th>
                        <th>Hora</th>
                        <th>Met. Pago</th>
                        <th>Estado de Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {quotes.length > 0 ? (
                        quotes.map((quote) => (
                            <tr key={quote.idQuote}>
                                <td>{quote.idQuote}</td>
                                <td>{quote.pet.name}</td>
                                <td>{quote.pet.client.firstName} {quote.pet.client.firstLastName}</td>
                                <td>{formatDate(quote.date)}</td>
                                <td>{quote.service.name}</td>
                                <td>{formatTime(quote.hour)}</td>
                                <td>{quote.metPag.name}</td>
                                <td>
                                    {quote.statusPag === '1'
                                        ? 'Pendiente'
                                        : 'Pagado'}
                                </td>
                                <td>
                                    {quote.status === '1'
                                        ? 'En espera'
                                        : quote.status === '0'
                                        ? 'Cancelado'
                                        : quote.status === '2'
                                        ? 'Vencido'
                                        : 'Confirmado'}
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <Btn_Edit
                                            nameId={quote.idQuote}
                                            showContent="icon"
                                            onEdit={() => openEditModal(quote.idQuote)}
                                        />
                                        {quote.status === '1' &&(
                                            <> 
                                                <Btn_Delete
                                                    nameId={quote.idQuote}
                                                    showContent="icon"
                                                    onDelete={() => handleCancelQuote(quote.idQuote)}
                                                />
                                                <Btn_Confirm
                                                    nameId={`confirm-${quote.idQuote}`}
                                                    showContent="icon"
                                                    onClick={() => handleConfirmQuote(quote.idQuote)}
                                                />
                                            </>
                                        )}
                                        
                                        {quote.statusPag === '1' && quote.status !== '0' && (
                                            <Btn_ConfirmPag
                                                nameId={`confirm-payment-${quote.idQuote}`}
                                                showContent="icon"
                                                onClick={() => handleConfirmPayment(quote.idQuote)}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">
                                No se encontraron citas.
                            </td>
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
                    nameId="btnAddNewQuote"
                    showContent="text+icon"
                    onNew={openNewModal}
                />
            </div>

            {/* Modales */}
            {isEditModalOpen && (
                <ModalEditQuote
                    quoteId={selectedQuoteId}
                    onClose={closeEditModal}
                    onUpdate={loadQuotes}
                />
            )}
            {isNewModalOpen && (
                <ModelNewQuote
                    onClose={closeNewModal}
                    onUpdate={loadQuotes}
                />
            )}
        </div>
    );
}

export default C_TablaCitas;
