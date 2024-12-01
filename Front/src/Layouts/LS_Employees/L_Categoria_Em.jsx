import React, { useState, useEffect } from 'react';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import "../../Layouts/Layouts.css";
import Btn_Edit from '../../Components/CS_General/Buttons/Btn_Edit';
import Btn_Delete from '../../Components/CS_General/Buttons/Btn_Delete';
import Btn_New from '../../Components/CS_General/Buttons/Btn_New';
import Pagination from '../../Components/CS_General/Pagination';
import ModalEditCategory from '../LS_Employees/ModalCategory/ModalEditCategory';
import ModalNewCategory from '../LS_Employees/ModalCategory/ModalNewCategory';
import {
    listActiveCategories,
    blockCategory
} from '../../Services/categoryService'; // Métodos de Axios

function L_Categoria_Em() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Cargar categorías con paginación
    const loadCategories = async (page) => {
        try {
            const data = await listActiveCategories(page, 10); // 10 elementos por página
            setCategories(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    useEffect(() => {
        loadCategories(currentPage);
    }, [currentPage]);

    // Abrir el modal para editar
    const openEditModal = (idCategory) => {
        setSelectedCategoryId(idCategory);
        setIsEditModalOpen(true);
    };

    // Cerrar el modal de editar
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCategoryId(null);
    };

    // Abrir el modal para agregar nueva categoría
    const openNewModal = () => {
        setIsNewModalOpen(true);
    };

    // Cerrar el modal de agregar nueva categoría
    const closeNewModal = () => {
        setIsNewModalOpen(false);
    };

    // Manejar el bloqueo de categoría
    const handleBlockCategory = async (idCategory) => {
        try {
            await blockCategory(idCategory);
            loadCategories(currentPage);
        } catch (error) {
            console.error("Error al bloquear categoría:", error);
        }
    };

    return (
        <section className="Layout">
            <div className="Content_Layout">
                <C_Title nameTitle={"Categorías"} />

                {/* Tabla de categorías */}
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Salto de tiempo</th>
                            <th>capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.idCategory}>
                                    <td>{category.idCategory}</td>
                                    <td>{category.name}</td>
                                    <td>{category.timeSpan}</td>
                                    <td>{category.capacity}</td>
                                    <td>{category.status === '1' ? 'Activo' : 'Inactivo'}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Btn_Edit
                                                nameId={category.idCategory}
                                                showContent="icon"
                                                onEdit={() => openEditModal(category.idCategory)}
                                            />
                                            <Btn_Delete
                                                nameId={category.idCategory}
                                                showContent="icon"
                                                onDelete={() => handleBlockCategory(category.idCategory)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No se encontraron categorías.</td>
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
                        nameId="btnAddNewCategory"
                        showContent="text+icon"
                        onNew={openNewModal}
                    />
                </div>

                {/* Modales */}
                {isEditModalOpen && (
                    <ModalEditCategory
                        categoryId={selectedCategoryId}
                        onClose={closeEditModal}
                        onUpdate={() => loadCategories(currentPage)}
                    />
                )}
                {isNewModalOpen && (
                    <ModalNewCategory
                        onClose={closeNewModal}
                        onUpdate={() => loadCategories(currentPage)}
                    />
                )}
            </div>
        </section>
    );
}

export default L_Categoria_Em;
