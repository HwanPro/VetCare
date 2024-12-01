import "../../Layouts/Layouts.css";
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import C_FromData_Em from '../../Components/CS_Employees/C_FromData_Em/C_FromData_Em';
import C_CardData from '../../Components/CS_Employees/C_CardData_Em/C_CardData';
import Btn_Edit from '../../Components/CS_General/Buttons/Btn_Edit';
import React, { useState, useEffect } from 'react';
import ModalEditEmployee from "./ModalEmployee/ModalEditEmployee";
import { getEmployeeById } from "../../Services/employeeService"; // Ajusta la ruta si es necesario

function L_Profile_Em() {
    const [employee, setEmployee] = useState(null); // Estado para datos del empleado
    const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal

    useEffect(() => {
        // Obtén el ID del usuario desde localStorage
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('userType');

        if (!userId || userType !== 'empleado') {
            alert("Sin credenciales válidas o no eres un empleado");
            window.location.href = "/login"; // Redirige al login si no es válido
            return;
        }

        // Llamada al backend para obtener los datos del empleado
        const fetchEmployee = async () => {
            try {
                const data = await getEmployeeById(userId); // Usa la función de servicio
                setEmployee(data);
            } catch (error) {
                console.error('Error al obtener los datos del empleado:', error);
                alert(error);
            }
        };

        fetchEmployee(); // Ejecuta la función
    }, []);

    // Función para abrir el modal
    const openEditModal = () => {
        setShowEditModal(true);
    };

    // Función para cerrar el modal
    const closeEditModal = () => {
        setShowEditModal(false);
    };

    if (!employee) {
        return <p>Cargando datos del empleado...</p>;
    }

    return (
        <section className="Layout">
            <div className="Content_Layout">
                <C_Title nameTitle={"Perfil"} />
                <C_CardData />
                <C_FromData_Em />

                <Btn_Edit
                    nameId={employee.idEmployee}
                    showContent="text+icon"
                    onEdit={openEditModal}
                />

                {/* Modal para editar el empleado */}
                {showEditModal && (
                    <ModalEditEmployee
                        employeeId={employee.idEmployee}
                        onClose={closeEditModal}
                        onUpdate={() => {
                            closeEditModal();
                            window.location.reload();
                        }}
                    />
                )}
            </div>
        </section>
    );
}

export default L_Profile_Em;
