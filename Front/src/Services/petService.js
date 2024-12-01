import axios from "axios";

// Asegúrate de definir API_BASE_URL antes de usarla
const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;

const API_URL = `${API_BASE_URL}/api/pets`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Crear una nueva mascota
export const createPet = async (petData) => {
  try {
    const token = getToken(); // Obtener el token de autenticación
    const response = await axios.post(API_URL, petData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado
      },
    });
    return response.data; // Retorna los datos de la API tras la creación
  } catch (error) {
    console.error("Error al crear la mascota:", error.response || error.message);
    throw error.response?.data || "Error al crear la mascota.";
  }
};

// Obtener datos de una mascota por ID
export const getPetById = async (petId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de la mascota:', error.response || error.message);
    throw error.response?.data || 'Error al obtener datos de la mascota.';
  }
};

// Actualizar una mascota por ID
export const updatePet = async (petId, petData) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/update/${petId}`, petData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la mascota:', error.response || error.message);
    throw error.response?.data || 'Error al actualizar la mascota.';
  }
};

// Buscar mascotas con filtros y paginación
export const searchPets = async (filters, page = 0, size = 9) => {
  try {
    const token = getToken();
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "" && value !== null)
    );

    const params = {
      ...validFilters,
      page,
      size,
    };

    const response = await axios.get(`${API_URL}/search`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al buscar mascotas:", error.response || error.message);
    throw error.response?.data || "Error al buscar mascotas.";
  }
};

// Bloquear una mascota
export const blockPet = async (petId) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${petId}/block`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al bloquear la mascota:', error);
    throw error;
  }
};

// Obtener el total de mascotas activas
export const getTotalActivePets = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/active/total`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el total de mascotas activas:', error);
    throw error;
  }
};

// Obtiene las mascotas activas para un cliente específico
export const fetchActivePetsForClient = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${clientId}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las mascotas activas:', error);
    throw error;
  }
};

// Buscar mascota por ID y validar estado
export const getPetNameById = async (petId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${petId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al buscar la mascota.';
  }
};

// Buscar mascotas activas de un cliente específico
export const fetchPetsByClientId = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/client`, {
      params: { clientId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar mascotas del cliente:", error.response || error.message);
    throw error.response?.data || "Error al buscar mascotas del cliente.";
  }
};
