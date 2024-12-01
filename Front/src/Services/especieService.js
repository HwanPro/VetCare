import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;

const API_URL = `${API_BASE_URL}/api/especies`;

// Search especie by name
export const searchEspecieByName = async (name) => {
    try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`${API_URL}/search`, { params: { name },
            headers: {
            Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
        } },
            
        );
        return response.data.content?.[0] || null; // Return first match or null
    } catch (error) {
        console.error("Error al buscar especie:", error);
        throw error;
    }
};


// Crear especie
export const createEspecie = async (especieData) => {
    try {
        const token = localStorage.getItem('authToken');

        const response = await axios.post(API_URL, especieData,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear especie:", error);
        throw error;
    }
};

// Actualizar especie
export const updateEspecie = async (id, especieData) => {
    try {
        const token = localStorage.getItem('authToken');

        const response = await axios.put(`${API_URL}/${id}`, especieData,
            {
                headers: {
                    Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar especie:", error);
        throw error;
    }
};

// Listar especies activas con paginación
export const listActiveEspecies = async (page = 0, size = 10) => {
    try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`${API_URL}`, { params: { page, size },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
         });
        return response.data; // Aquí se espera un objeto con "content" y "totalPages"
    } catch (error) {
      console.error("Error al listar especies activas:", error);
      throw error;
    }
  };
  

// Bloquear especie
export const blockEspecie = async (id) => {
    try {
        const token = localStorage.getItem('authToken');

        await axios.patch(`${API_URL}/${id}/block`,{
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
    } catch (error) {
        console.error("Error al bloquear especie:", error);
        throw error;
    }
};

// Obtener especie por ID
export const getEspecieById = async (id) => {
    try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get(`${API_URL}/${id}`,{
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener especie por ID:", error);
        throw error;
    }
};