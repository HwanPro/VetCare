import React, { useState, useEffect } from 'react';
import "./LS_Client.css";
import Btn_Search from '../../Components/CS_General/Buttons/Btn_Search';
import Box_Text_Empty from '../../Components/CS_General/Form Box/Box_Text/Box_Text_Empty';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import Pagination from '../../Components/CS_General/Pagination';
import ModalNewQuote_Cl from '../LS_Clients/ModalQuote/ModalNewQuote_Cl';
import { fetchServices } from '../../Services/serviceService'; 

function L_Services_Cl() {
    const clientId = localStorage.getItem("userId");
    const [services, setServices] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        categoryName: '',
        especieName: '',
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedService, setSelectedService] = useState(null); // Estado para el servicio seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    useEffect(() => {
        loadServices();
    }, [currentPage]);

    const loadServices = async () => {
        try {
            const data = await fetchServices({ filters, currentPage });
            console.log("Respuesta de la API:", data); // Inspecciona los datos aquí
            setServices(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Error al cargar los servicios:', error);
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
        loadServices();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleMoreInfo = (service) => {
        setSelectedService(service);
    };

    const handleBack = () => {
        setSelectedService(null);
    };

    const handleOpenModal = (serviceId) => {
        setSelectedServiceId(serviceId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedServiceId(null);
    };

    return (
        <div>
            <section className='Layout'>
                <div className='Content_Layout'>
                    {!selectedService ? (
                        <>
                            <C_Title nameTitle={"Servicios"} />
                            <form onSubmit={handleSearch} className="row">
                                <div className='col'>
                                    <Box_Text_Empty
                                        id="especieName"
                                        Label="Especie"
                                        name="especieName"
                                        value={filters.especieName}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className='col'>
                                    <Box_Text_Empty
                                        id="categoryName"
                                        Label="Categoría"
                                        name="categoryName"
                                        value={filters.categoryName}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className='col'>
                                    <Box_Text_Empty
                                        id="name"
                                        Label="Nombre"
                                        name="name"
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className='col'>
                                    <Btn_Search
                                        nameId="btnSearch"
                                        showContent="text+icon"
                                        onClick={handleSearch}
                                    />
                                </div>
                            </form>

                            <div className="services-list">
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <div key={service.idService} className="service-card">
                                            <div className='service-img'>
                                                <img src={service.dirImage} alt={service.name || "Sin nombre"} />
                                            </div>
                                            <div className='service-info'>
                                                <h3 className='service-title'>{service.name || "Sin nombre"}</h3>
                                                <p>Especie: {service.especie?.name || "No especificada"}</p>
                                                <button
                                                    className="btn-infomacio"
                                                    onClick={() => handleMoreInfo(service)}
                                                >
                                                    Más Información
                                                </button>
                                                <button
                                                    className="btn-appointment"
                                                    onClick={() => handleOpenModal(service.idService)}
                                                >
                                                    Agendar Cita
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No se encontraron servicios activos.</p>
                                )}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="service-details">
                            <C_Title nameTitle={selectedService.name || "Sin nombre"} />
                            <div className="service-details-content">
                                <div className="service-details-img">
                                    <img src={selectedService.dirImage} alt={selectedService.name || "Sin nombre"} />
                                </div>
                                <div className="service-details-info">
                                    <p><strong>Descripción:</strong> {selectedService.description || "Sin descripción"}</p>
                                    <p><strong>Especie:</strong> {selectedService.especie?.name || "No especificada"}</p>
                                    <p><strong>Edad recomendada:</strong> {selectedService.recommendedAge || "No especificada"}</p>
                                    <p><strong>Frecuencia:</strong> {selectedService.recommendedFrequency || "No especificada"}</p>
                                    <p><strong>Precio:</strong> S/. {selectedService.price || "No especificado"}</p>
                                </div>
                            </div>
                            <div className="service-details-actions">
                                <button
                                    className="btn-appointment"
                                    onClick={() => handleOpenModal(selectedService.idService)}
                                >
                                    Reservar
                                </button>
                                <button className="btn-back" onClick={handleBack}>
                                    Volver
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {isModalOpen && (
                <ModalNewQuote_Cl
                    clientId={clientId}
                    defaultServiceId={selectedServiceId}
                    onClose={handleCloseModal}
                    onUpdate={() => loadServices()}
                />
            )}
        </div>
    );
}

export default L_Services_Cl;
