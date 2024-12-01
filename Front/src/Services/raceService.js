import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/races`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Buscar raza por nombre
export const searchRaceByName = async (name) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/search`, {
            params: { name },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Retorna los datos de la API
    } catch (error) {
        console.error("Error al buscar raza:", error.response || error.message);
        throw error.response?.data || "Error al buscar raza.";
    }
};

// Crear raza
export const createRace = async (raceData) => {
    try {
        const token = getToken();
        const response = await axios.post(API_URL, raceData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear raza:", error);
        throw error;
    }
};

// Actualizar raza
export const updateRace = async (id, raceData) => {
    try {
        const token = getToken();
        const response = await axios.put(`${API_URL}/${id}`, raceData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar raza:", error);
        throw error;
    }
};

// Listar razas activas con paginación
export const listActiveRaces = async (page = 0, size = 10) => {
    try {
        const token = getToken();
        const response = await axios.get(API_URL, {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al listar razas activas:", error);
        throw error;
    }
};

// Bloquear raza
export const blockRace = async (id) => {
    try {
        const token = getToken();
        await axios.patch(`${API_URL}/${id}/block`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error al bloquear raza:", error);
        throw error;
    }
};

// Obtener raza por ID
export const getRaceById = async (id) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener raza por ID:", error);
        throw error;
    }
};
