import React, { useEffect, useState } from 'react';
import "../CS_Employees/C_FromData_Em/C_FromData_Em.css";
import Box_Text_Bloq from '../CS_General/Form Box/Box_Text/Box_Text_Bloq';
import { getClientById } from '../../Services/clientService'; // Ajusta la ruta según tu estructura
import "./Calendar.css"
function C_FromData_Cl() {
    const [cliente, setCliente] = useState(null); // Estado para almacenar los datos del cliente
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        // Obtiene el ID y tipo de usuario desde localStorage
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('userType');

        if (!userId || userType !== 'cliente') {
            console.error('Credenciales no válidas o tipo de usuario incorrecto');
            setError('Credenciales no válidas o tipo de usuario incorrecto');
            return;
        }

        // Llama al servicio para obtener los datos del cliente
        const fetchCliente = async () => {
            try {
                const data = await getClientById(userId);
                setCliente(data); // Asigna los datos obtenidos al estado
            } catch (error) {
                console.error('Error al obtener los datos del cliente:', error);
                setError(error || 'Error al obtener los datos del cliente.');
            }
        };

        fetchCliente(); // Ejecuta la función
    }, []); // Se ejecuta solo una vez al montar el componente

    if (error) {
        return <p className="text-danger">{error}</p>; // Muestra el error si ocurre
    }

    if (!cliente) {
        return <p>Cargando datos del cliente...</p>; // Muestra un mensaje mientras se cargan los datos
    }

    return (
        <div className='contentFromData'>
            <div className='contentData'>
                <div className="row g-3">
                    <div className="col">
                        <Box_Text_Bloq Label={"DNI"} V_Text={cliente.dni} />
                    </div>
                    <div className="col">
                        <Box_Text_Bloq Label={"Primer Nombre"} V_Text={cliente.firstName} />
                    </div>
                    <div className="col">
                        <Box_Text_Bloq Label={"Segundo Nombre"} V_Text={cliente.preName} />
                    </div>
                    <div className="col">
                        <Box_Text_Bloq Label={"Primer Apellido"} V_Text={cliente.firstLastName} />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col">
                        <Box_Text_Bloq Label={"Segundo Apellido"} V_Text={cliente.secondLastName} />
                    </div>
                    <div className="col">
                        <Box_Text_Bloq Label={"Email"} V_Text={cliente.user.email} />
                    </div>
                    <div className="col">
                        <Box_Text_Bloq Label={"Dirección"} V_Text={cliente.address} />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col">
                        <Box_Text_Bloq Label={"Teléfono"} V_Text={cliente.cellphone} />
                    </div>
                    <div className="col">
                        <Box_Text_Bloq Label={"Número de Mascotas"} V_Text={cliente.pets ? cliente.pets.length : 0} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default C_FromData_Cl;
