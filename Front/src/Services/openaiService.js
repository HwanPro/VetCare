import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/hitOpenaiApi`; // URL del backend

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

// Método para comunicarse con el backend usando el token
export const hitOpenaiApi = async (prompt) => {
  try {
    const token = getToken(); // Obtener el token de localStorage
    const response = await axios.post(
      API_URL,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Agregar el token en los encabezados
        },
      }
    );
    return response.data; // Retorna el contenido de la respuesta
  } catch (error) {
    console.error('Error al comunicarse con el backend:', error.response || error.message);
    throw error.response?.data || 'Error al comunicarse con el backend.';
  }
};
