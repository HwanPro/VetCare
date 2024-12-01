import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_BACK_URL;
const API_URL = `${API_BASE_URL}/api/report`;

// Función para generar el reporte
export const generateReport = async (filters) => {
    const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );

    const queryParams = new URLSearchParams(sanitizedFilters).toString();
    const token = localStorage.getItem('authToken'); // Obtener el token del almacenamiento local

    try {
        const response = await axios.get(`${API_URL}/generate-report?${queryParams}`, {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
        });
        // Obtener la fecha actual en formato YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0]; 

        // Crear el nombre dinámico para el archivo
        const fileName = `${currentDate}_RptCitas.xlsx`;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        throw new Error("No se pudo generar el reporte.");
    }
};

// Función para buscar citas con filtros
export const fetchQuotes = async (filters, page = 0, size = 9) => {
    const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );

    const queryParams = new URLSearchParams({
        page,
        size,
        ...sanitizedFilters,
    }).toString();
    const token = localStorage.getItem('authToken'); // Obtener el token del almacenamiento local

    try {
        const response = await axios.get(`${API_URL}/search?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        throw new Error("No se pudo obtener las citas.");
    }
};
