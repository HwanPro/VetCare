import axios from "axios";

// Asegúrate de definir API_BASE_URL antes de usarla
const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;

const API_URL = `${API_BASE_URL}/api/quotes`;

// Obtener el token desde localStorage
const getToken = () => localStorage.getItem('authToken');

/*------------------------Metodos Generales----------------- */

// Método para crear una nueva cita
export const createQuote = async (quoteData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/create`, quoteData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al crear la cita.';
  }
};

// Actualizar una cita
export const updateQuote = async (quoteId, updatedQuote) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/update/${quoteId}`, updatedQuote, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    throw error;
  }
};

// Cancelar cita
export const cancelQuote = async (quoteId) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${quoteId}/cancel`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al cancelar la cita:", error);
    throw error;
  }
};

// Obtener detalles de una cita por ID
export const getQuoteById = async (quoteId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${quoteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los detalles de la cita:", error);
    throw error;
  }
};

/*------------------------Metodos Empleado----------------- */

// Obtener citas con filtros para la tabla
export const fetchQuotes = async ({ page, filters }) => {
  const { date, status, dni, serviceName } = filters;

  const formattedDate = date ? new Date(date).toISOString().split('T')[0] : ''; // Formato yyyy-MM-dd

  const queryParams = new URLSearchParams({
    page,
    size: 9,
    ...(formattedDate && { date: formattedDate }),
    ...(status && { status }),
    ...(dni && { dni }),
    ...(serviceName && { serviceName }),
  }).toString();

  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/search?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    throw error;
  }
};

// Obtener citas activas para el calendario del empleado
export const fetchQuotesForCalendar = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/employee/calendar`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las citas activas:", error);
    throw error;
  }
};

// Confirmar cita
export const confirmQuote = async (quoteId) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${quoteId}/confirm`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al confirmar la cita:", error);
    throw error;
  }
};

// Confirmar pago
export const confirmPayment = async (quoteId) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${quoteId}/confirm-payment`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al confirmar el pago:", error);
    throw error;
  }
};

// Obtener total de citas activas
export const getTotalActiveQuotes = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/active/total`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el total de citas activas:', error);
    throw error;
  }
};

// Obtener citas activas de hoy
export const getTodayActiveQuotes = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/active/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las citas activas de hoy:', error);
    throw error;
  }
};

/*----------------Cliente------------------------------- */

// Obtener citas activas para el calendario del cliente
export const fetchQuotesForClientCalendar = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${clientId}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener citas activas del cliente:', error);
    throw error;
  }
};

// Total de citas activas para un cliente específico
export const getTotalActiveQuotesByClientId = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${clientId}/active/total`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el total de citas activas:', error);
    throw error;
  }
};

// Total de citas activas de hoy para un cliente específico
export const getTodayActiveQuotesByClientId = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${clientId}/active/hoy`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las citas activas de hoy:', error);
    throw error;
  }
};

// Obtener citas activas de un cliente con paginación
export const getActiveQuotesByClientId = async (clientId, page = 0, size = 5) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/client`, {
      params: { clientId, page, size },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener citas activas del cliente:", error);
    throw error;
  }
};
