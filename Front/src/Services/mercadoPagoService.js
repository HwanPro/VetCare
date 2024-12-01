import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/mp`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Crear preferencia
export const createPreference = async (userBuyer) => {
    try {
        const token = getToken(); // Obtener el token
        const response = await axios.post(API_URL, userBuyer, {
            headers: {
                "Content-Type": "application/json", // Definir el tipo de contenido
                Authorization: `Bearer ${token}`, // Agregar token en los encabezados
            },
        });
        return response.data; // Devuelve el ID de la preferencia
    } catch (error) {
        console.error('Error al crear la preferencia:', error.response || error.message);
        throw error.response?.data || "Error al crear la preferencia.";
    }
};
