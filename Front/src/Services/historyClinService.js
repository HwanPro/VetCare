import axios from "axios";

// URL base definida desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;

// URL base específica para historial clínico
const API_URL = `${API_BASE_URL}/api/pet-clinical-history`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Obtener historial clínico de una mascota con paginación
export const fetchHistoryByPet = async (petId, page = 0, size = 6) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${petId}`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`, // Agregar token en los encabezados
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error al obtener el historial clínico:", error.response || error.message);
    throw error.response?.data || "Error al obtener el historial clínico.";
  }
};

// Bloquear (eliminar lógicamente) un historial clínico
export const blockHistory = async (historyId) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${historyId}/block`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar token en los encabezados
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error al bloquear el historial clínico:", error.response || error.message);
    throw error.response?.data || "Error al bloquear el historial clínico.";
  }
};

// Crear un nuevo historial clínico
export const createClinicalHistory = async (historyData) => {
  try {
    const token = getToken();
    const response = await axios.post(API_URL, historyData, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agregar token en los encabezados
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el historial clínico:", error.response || error.message);
    throw error.response?.data || "Error al crear el historial clínico.";
  }
};

// Obtener un historial clínico por ID
export const getClinicalHistoryById = async (id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/search/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar token en los encabezados
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el historial clínico:", error.response || error.message);
    throw error.response?.data || "Error al obtener el historial clínico.";
  }
};

// Actualizar un historial clínico
export const updateClinicalHistory = async (id, historyData) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${id}`, historyData, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agregar token en los encabezados
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el historial clínico:", error.response || error.message);
    throw error.response?.data || "Error al actualizar el historial clínico.";
  }
};
