import React, { useEffect, useState } from 'react';
import Btn_Edit from '../CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../CS_General/Buttons/Btn_Delete';
import Btn_New from '../CS_General/Buttons/Btn_New';
import Btn_Search from '../CS_General/Buttons/Btn_Search';
import Pagination from '../CS_General/Pagination';
import Box_Text_Empty from '../CS_General/Form Box/Box_Text/Box_Text_Empty';
import ModalEditEmployee from '../../Layouts/LS_Employees/ModalEmployee/ModalEditEmployee';
import ModalNewEmployee from '../../Layouts/LS_Employees/ModalEmployee/ModalNewEmployee';

import { searchEmployees, blockEmployee } from '../../Services/employeeService';

function C_TablaEmpleados() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        dni: '',
        name: '',
        role: '',
        status: '1',
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    useEffect(() => {
        fetchEmployees(currentPage, { status: '1' });
    }, [currentPage]);

    const fetchEmployees = (page, customFilters = {}) => {
        const mergedFilters = { ...filters, ...customFilters };

        searchEmployees(mergedFilters, page)
            .then((data) => {
                setEmployees(data.content || []);
                setTotalPages(data.totalPages || 0);
            })
            .catch((error) => {
                console.error("Error al obtener los empleados:", error);
                setEmployees([]);
                setTotalPages(0);
            });
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
        fetchEmployees(0, filters);
    };

    const handleBlockEmployee = (employeeId) => {
        blockEmployee(employeeId)
            .then(() => {
                fetchEmployees(currentPage);
            })
            .catch((error) => {
                console.error("Error al bloquear el empleado:", error);
            });
    };

    const openEditModal = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmployeeId(null);
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
                    <Box_Text_Empty
                        id="dni"
                        Label="DNI"
                        value={filters.dni}
                        onChange={handleFilterChange}
                        name="dni"
                    />
                </div>
                <div className="col">
                    <Box_Text_Empty
                        id="name"
                        Label="Nombre"
                        value={filters.name}
                        onChange={handleFilterChange}
                        name="name"
                    />
                </div>
                <div className="col">
                    <Box_Text_Empty
                        id="role"
                        Label="Rol"
                        value={filters.role}
                        onChange={handleFilterChange}
                        name="role"
                    />
                </div>
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
                    <Btn_Search
                        nameId="btnSearch"
                        showContent="text+icon"
                        onClick={handleSearch}
                    />
                </div>
            </form>

            {/* Tabla de empleados */}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Rol</th>
                        <th>CMVP</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <tr key={employee.idEmployee}>
                                <td>{employee.idEmployee}</td>
                                <td>{employee.dni}</td>
                                <td>{`${employee.firstName} ${employee.preName}`}</td>
                                <td>{`${employee.firstLastName} ${employee.secondLastName}`}</td>
                                <td>{employee.rol.name}</td>
                                <td>{employee.cmvp}</td>
                                <td>
                                    <a
                                        href={`https://wa.me/+51${employee.cellphone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {employee.cellphone}
                                    </a>
                                </td>
                                <td>{employee.status === '1' ? 'Activo' : 'Inactivo'}</td>
                                <td>
                                    <div className="d-flex">
                                        <Btn_Edit
                                            nameId={employee.idEmployee}
                                            showContent="icon"
                                            onEdit={() => openEditModal(employee.idEmployee)}
                                        />
                                        {employee.status === '1' && (
                                            <Btn_Delete
                                                nameId={employee.idEmployee}
                                                showContent="icon"
                                                onDelete={() => handleBlockEmployee(employee.idEmployee)}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No se encontraron empleados.</td>
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
                    nameId="btnAddNewEmployee"
                    showContent="text+icon"
                    onNew={openNewModal}
                />
            </div>

            {/* Modales */}
            {isEditModalOpen && (
                <ModalEditEmployee
                    employeeId={selectedEmployeeId}
                    onClose={closeEditModal}
                    onUpdate={() => fetchEmployees(currentPage)}
                />
            )}
            {isNewModalOpen && (
                <ModalNewEmployee
                    onClose={closeNewModal}
                    onUpdate={() => fetchEmployees(currentPage)}
                />
            )}
        </div>
    );
}

export default C_TablaEmpleados;
