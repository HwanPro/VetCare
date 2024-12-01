import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/auth`;

// Método para iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; // Devuelve los datos si la autenticación fue exitosa
    } catch (error) {
        console.error('Error al autenticar:', error.response || error.message);
        throw error.response?.data?.message || 'Error en la autenticación.';
    }
};
