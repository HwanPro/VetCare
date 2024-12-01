import React, { useEffect, useState } from 'react';
import Btn_Edit from '../CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../CS_General/Buttons/Btn_Delete';
import Btn_New from '../CS_General/Buttons/Btn_New';
import Btn_Search from '../CS_General/Buttons/Btn_Search';
import Pagination from '../CS_General/Pagination';
import Box_Text_Empty from '../CS_General/Form Box/Box_Text/Box_Text_Empty';
import ModelEditService from '../../Layouts/LS_Employees/ModalService/ModalEditService';
import ModelNewService from '../../Layouts/LS_Employees/ModalService/ModalNewService';
import { fetchServices, blockService } from '../../Services/serviceService';

function C_TablaServicios() {
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        name: '',
        categoryName: '',
        especieName: '',
        status: '1',
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    useEffect(() => {
        loadServices(currentPage, filters);
    }, [currentPage]);

    const loadServices = async (page, customFilters = {}) => {
        try {
            const data = await fetchServices({ filters: { ...filters, ...customFilters }, currentPage: page });
            setServices(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
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
        loadServices(0, filters);
    };

    const handleBlockService = async (serviceId) => {
        try {
            await blockService(serviceId);
            loadServices(currentPage, filters);
        } catch (error) {
            console.error('Error al bloquear el servicio:', error);
        }
    };

    const openEditModal = (serviceId) => {
        setSelectedServiceId(serviceId);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedServiceId(null);
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
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div className="col">
                    <Box_Text_Empty
                        id="name"
                        Label="Nombre del Servicio"
                        value={filters.name}
                        onChange={handleFilterChange}
                        name="name"
                    />
                </div>
                <div className="col">
                    <Box_Text_Empty
                        id="categoryName"
                        Label="Categoría"
                        value={filters.categoryName}
                        onChange={handleFilterChange}
                        name="categoryName"
                    />
                </div>
                <div className="col">
                    <Box_Text_Empty
                        id="especieName"
                        Label="Especie"
                        value={filters.especieName}
                        onChange={handleFilterChange}
                        name="especieName"
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

            {/* Tabla de servicios */}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Especie</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <tr key={service.idService}>
                                <td>{service.idService}</td>
                                <td>{service.name}</td>
                                <td>{service.category.name}</td>
                                <td>{service.especie.name}</td>
                                <td>S/. {service.price}</td>
                                <td>{service.status === '1' ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    <div className="d-flex">
                                        <Btn_Edit
                                            nameId={service.idService}
                                            showContent="icon"
                                            onEdit={() => openEditModal(service.idService)}
                                        />
                                        <Btn_Delete
                                            nameId={service.idService}
                                            showContent="icon"
                                            onDelete={() => handleBlockService(service.idService)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No se encontraron servicios.</td>
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
                    nameId="btnAddNewService"
                    showContent="text+icon"
                    onNew={openNewModal}
                />
            </div>

            {/* Modales */}
            {isEditModalOpen && (
                <ModelEditService
                    serviceId={selectedServiceId}
                    onClose={closeEditModal}
                    onUpdate={() => loadServices(currentPage)}
                />
            )}
            {isNewModalOpen && (
                <ModelNewService
                    onClose={closeNewModal}
                    onUpdate={() => loadServices(currentPage)}
                />
            )}
        </div>
    );
}

export default C_TablaServicios;
