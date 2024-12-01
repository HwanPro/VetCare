import axios from "axios";

// Base URL desde .env
const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_USER_URL = `${API_BASE_URL}/api/users`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Verificar si el correo está en uso
export const isEmailInUse = async (email) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_USER_URL}/email-exists`, {
            params: { email },
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
            },
        });
        return response.data; // true o false
    } catch (error) {
        console.error("Error al verificar el correo:", error.response || error.message);
        throw new Error("Error al verificar el correo.");
    }
};
