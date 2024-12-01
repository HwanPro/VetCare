import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/categories`;

// Search category by name
export const searchCategoryByName = async (name) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/search`, {
            params: { name },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        return response.data.content?.[0] || null; // Return first match or null
    } catch (error) {
        console.error("Error al buscar categoría:", error);
        throw error;
    }
};

// Crear categoría
export const createCategory = async (categoryData) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.post(API_URL, categoryData,{
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }});
        return response.data;
    } catch (error) {
        console.error("Error al crear categoría:", error);
        throw error;
    }
};

// Actualizar categoría
export const updateCategory = async (id, categoryData) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.put(`${API_URL}/${id}`, categoryData,{
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }}
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        throw error;
    }
};

// Listar categorías activas con paginación
export const listActiveCategories = async (page = 0, size = 10) => {
    try {
        const token = localStorage.getItem('authToken'); 
        const response = await axios.get(API_URL, { params: { page, size },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
         });
        return response.data;
    } catch (error) {
        console.error("Error al listar categorías activas:", error);
        throw error;
    }
};

// Bloquear categoría
export const blockCategory = async (id) => {
    try {
        const token = localStorage.getItem('authToken'); 

        await axios.patch(`${API_URL}/${id}/block`,{
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }}
        );
    } catch (error) {
        console.error("Error al bloquear categoría:", error);
        throw error;
    }
};

// Obtener categoría por ID
export const getCategoryById = async (id) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }}
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener categoría por ID:", error);
        throw error;
    }
};