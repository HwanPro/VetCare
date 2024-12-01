import React, { useState, useEffect } from 'react';
import C_Title from '../../Components/CS_General/C_Title/C_Title';
import C_FromData_Cl from '../../Components/CS_Clients/C_FromData_Cl';
import Btn_Edit from '../../Components/CS_General/Buttons/Btn_Edit';
import C_CardData_Client from '../../Components/CS_Clients/C_CardData_Client/C_CardData_Client';
import ModalEdit from '../LS_Employees/ModalEdit';

function L_Profile_Cl() {
    const [userId, setUserId] = useState(null); // Estado para el ID del usuario
    const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal

    useEffect(() => {
        const id = localStorage.getItem('userId'); // Obtén el ID del usuario desde localStorage
        const userType = localStorage.getItem('userType');

        if (!id || userType !== 'cliente') {
            alert("Sin credenciales válidas o no eres un cliente");
            window.location.href = "/login"; // Redirige al login si no es válido
            return;
        }

        setUserId(id); // Asigna el ID del usuario al estado
    }, []);

    // Función para abrir el modal
    const openEditModal = () => {
        setShowEditModal(true);
    };

    // Función para cerrar el modal
    const closeEditModal = () => {
        setShowEditModal(false);
    };

    if (!userId) {
        return <p>Cargando datos del cliente...</p>;
    }

    return (
        <div>
            <section className='Layout'>
                <div className='Content_Layout'>
                    <C_Title nameTitle={"Perfil"} />
                    <C_CardData_Client />
                    <C_FromData_Cl />

                    {/* Botón para abrir el modal de edición */}
                    <Btn_Edit
                        nameId={userId}
                        showContent="text+icon"
                        onEdit={openEditModal}
                    />
                    

                    {/* Modal para editar el cliente */}
                    {showEditModal && (
                        <ModalEdit
                            clientId={userId}
                            onClose={closeEditModal}
                            onUpdate={() => {
                                closeEditModal();
                                window.location.reload(); // Recarga los datos después de la edición
                            }}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default L_Profile_Cl;
