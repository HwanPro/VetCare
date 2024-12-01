import React, { useEffect, useState } from 'react';
import { getClientById } from '../../../Services/clientService'; // Ajusta la ruta según tu estructura

function C_CardData_Client() {
    const DirImgs = "/Img/"; 
    const [dataProfile, setDataProfile] = useState(null); // Estado para almacenar los datos del perfil
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Obtiene el ID del usuario del localStorage
        const userType = localStorage.getItem('userType'); // Obtiene el tipo de usuario del localStorage

        // Validar credenciales
        if (!userId || userType !== 'cliente') {
            console.error('Credenciales no válidas o tipo de usuario incorrecto');
            setError('Credenciales no válidas o tipo de usuario incorrecto');
            return;
        }

        // Llamada al servicio para obtener los datos del cliente
        const fetchProfileData = async () => {
            try {
                const data = await getClientById(userId);
                setDataProfile(data); // Asigna los datos obtenidos al estado
            } catch (error) {
                console.error('Error al obtener los datos del perfil:', error);
                setError(error || 'Error al obtener los datos del perfil.');
            }
        };

        fetchProfileData(); // Ejecuta la función
    }, []); // Solo se ejecuta una vez al montar el componente

    if (error) {
        return <p className="text-danger">{error}</p>; // Muestra el error si ocurre
    }

    if (!dataProfile) {
        return <p>Cargando datos del perfil...</p>; // Muestra un mensaje mientras se cargan los datos
    }

    return (
        <div className='container'>
            <div className='preview'>
                <div className='imagenProfile'>
                    <img 
                        className='imagenP' 
                        src={DirImgs + dataProfile.dirImage} 
                        alt="Foto Usuario" 
                    />
                </div>
                <div className='info'>
                    <h4>
                        {dataProfile.firstName + " " + dataProfile.firstLastName}
                    </h4>
                    <label>DNI: {dataProfile.dni}</label>
                </div>
            </div>
        </div>
    );
}

export default C_CardData_Client;
