import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/roles`;

// Obtener roles activos
export const getActiveRoles = async () => {
    const token = localStorage.getItem('authToken'); // Obtener el token de autenticación
    try {
        const response = await axios.get(`${API_URL}/active`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token al encabezado
            },
        });
        return response.data; // Devuelve los roles activos
    } catch (error) {
        console.error("Error al obtener roles activos:", error.response || error.message);
        throw error.response?.data || "Error al obtener roles activos.";
    }
};
