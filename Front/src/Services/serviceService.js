import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/services`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Buscar servicios por nombre
export const searchServicesByName = async (name) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/searchName`, {
            params: { name },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al buscar servicios por nombre:', error);
        throw error;
    }
};

// Buscar servicio por nombre
export const searchServiceByName = async (name) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/search`, {
            params: { name },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.content || [];
    } catch (error) {
        console.error("Error al buscar el servicio:", error.response || error.message);
        throw error.response?.data || "Error al buscar el servicio.";
    }
};

// Crear un nuevo servicio
export const createService = async (serviceData) => {
    try {
        const token = getToken();
        const response = await axios.post(API_URL, serviceData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el servicio:", error);
        throw error;
    }
};

// Obtener servicios con filtros
export const fetchServices = async ({ filters, currentPage }) => {
    const { name, categoryName, especieName, status } = filters;

    const queryParams = new URLSearchParams({
        page: currentPage,
        size: 9,
        ...(name && { name }),
        ...(categoryName && { categoryName }),
        ...(especieName && { especieName }),
        ...(status && { status }), // Asegura que status se envíe
    }).toString();

    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/search?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al obtener los servicios:', error.response || error.message);
        throw error.response?.data || 'Error al obtener los servicios.';
    }
};

// Bloquear un servicio
export const blockService = async (serviceId) => {
    try {
        const token = getToken();
        const response = await axios.put(`${API_URL}/${serviceId}/block`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al bloquear el servicio (detalles):', error.response);
        throw error;
    }
};

// Obtener datos de un servicio por su ID
export const getServiceById = async (serviceId) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/${serviceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el servicio:", error);
        throw error;
    }
};

// Actualizar un servicio
export const updateService = async (serviceId, serviceData) => {
    try {
        const token = getToken();
        const response = await axios.put(`${API_URL}/update/${serviceId}`, serviceData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        throw error;
    }
};
