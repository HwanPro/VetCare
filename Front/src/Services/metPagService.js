import axios from 'axios';

// Asegúrate de definir API_BASE_URL antes de usarla
const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;

const API_URL = `${API_BASE_URL}/api/metpags`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Método para obtener métodos de pago activos
export const fetchActivePaymentMethods = async () => {
    try {
        const token = getToken(); // Obtener el token
        const response = await axios.get(`${API_URL}/active`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregar token en los encabezados
            },
        });
        return response.data; // Retornar los datos
    } catch (error) {
        console.error('Error al obtener métodos de pago activos:', error.response || error.message);
        throw error.response?.data || "Error al obtener métodos de pago activos.";
    }
};
