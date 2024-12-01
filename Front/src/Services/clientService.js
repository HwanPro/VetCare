import axios from "axios";

// desde .env
const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;

const API_URL = `${API_BASE_URL}/api/clients`;

/*------------------Metodos para el Empleado--------------- */

// Método para crear cliente
export const createClient = async (clientData) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.post(API_URL, clientData, {
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        }
    );
        return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        throw error;
    }
};

// Método para obtener el primer nombre de un cliente por DNI
export const getFirstNameByDni = async (dni) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/firstname`, {
            params: { dni },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        const data = response.data; // Respuesta del servidor
        return data.length > 0 ? data[0] : null; // Si el arreglo tiene datos, devuelve el primer elemento; si no, null
    } catch (error) {
        console.error("Error al obtener el primer nombre por DNI:", error.response || error.message);
        throw error.response?.data || "Error al comunicarse con el servidor.";
    }
};


// Obtener información del cliente por ID
export const getClientById = async (clientId) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        }
    );
        return response.data; // Retorna los datos del cliente
    } catch (error) {
        console.error("Error al obtener los datos del cliente:", error.response || error.message);
        throw error.response?.data || "Error al obtener los datos del cliente.";
    }
};

// Actualizar información del cliente
export const updateClient = async (clientId, clientData) => {
    try {
        
        const token = localStorage.getItem('authToken'); 

        const response = await axios.put(
            `${API_URL}/update/${clientId}`,
            clientData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data; // Retorna la respuesta del servidor
    } catch (error) {
        console.error("Error al actualizar el cliente:", error.response || error.message);
        throw error.response?.data || "Error al actualizar el cliente.";
    }
};

// Buscar clientes con filtros
export const searchClients = async (filters, page = 0, size = 9) => {
    try {
        
        const token = localStorage.getItem('authToken'); 

        // Filtrar parámetros no válidos (vacíos o null)
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== "" && value !== null)
        );

        // Agregar paginación
        const params = {
            ...validFilters,
            page,
            size,
        };

        const response = await axios.get(`${API_URL}/search`, { params,
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
         });

        return response.data; // Retorna los datos de la API
    } catch (error) {
        console.error("Error al buscar clientes:", error.response || error.message);
        throw error.response?.data || "Error al buscar clientes.";
    }
};


// Bloquear cliente por ID
export const blockClient = async (clientId) => {
    try {
        
        const token = localStorage.getItem('authToken'); 

        const response = await axios.put(`${API_URL}/${clientId}/block`, {
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        }
    );
        return response.data;
    } catch (error) {
        console.error("Error al bloquear el cliente:", error.response || error.message);
        throw error.response?.data || "Error al bloquear cliente.";
    }
};


// Validar si un número de celular está en uso
export const isCellphoneInUse = async (cellphone) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/cellphone-exists`, {
            params: { cellphone },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        return response.data; // Retorna true si está en uso, false si no
    } catch (error) {
        console.error("Error al verificar el número de celular:", error);
        throw error;
    }
};

// Validar si un número de celular está en uso excluyendo un ID específico
export const isCellphoneInUseUpdate = async (cellphone, id) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/update/cellphone-exists`, {
            params: { cellphone, id },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        return response.data; // Retorna true si está en uso, false si no
    } catch (error) {
        console.error("Error al verificar el número de celular (excluyendo ID):", error);
        throw error;
    }
};

// Validar si un DNI está en uso excluyendo un ID específico
export const isDniInUseUpdate = async (dni, id) => {
    try {
        
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/update/dni-exists`, {
            params: { dni, id },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        return response.data; // Retorna true si está en uso, false si no
    } catch (error) {
        console.error("Error al verificar el DNI (excluyendo ID):", error);
        throw error;
    }
};


// Buscar cliente por DNI
export const getClientByDni = async (dni) => {
    try {
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/search`, {
            params: { dni },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
        });
        return response.data; // Devuelve los datos del cliente
    } catch (error) {
        console.error("Error al buscar cliente por DNI:", error.response || error.message);
        throw error.response?.data || "Error al buscar cliente.";
    }
};

// Buscar cliente por DNI
export const searchClientByDni = async (dni) => {
    try {
        
        const token = localStorage.getItem('authToken'); 

        const response = await axios.get(`${API_URL}/search`, { params: { dni },
            headers: {
                Authorization: `Bearer ${token}` // Agregar el token en el encabezado Authorization
            }
         });
        return response.data.content;
    } catch (error) {
        console.error('Error al buscar cliente por DNI:', error.response || error.message);
        throw error.response?.data || 'Error al buscar cliente.';
    }
}