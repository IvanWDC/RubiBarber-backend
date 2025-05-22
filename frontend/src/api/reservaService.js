import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configurar axios para incluir el token en todas las peticiones
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const reservaService = {
    // Obtener servicios disponibles
    getServicios: async () => {
        try {
            const response = await axios.get(`${API_URL}/cliente/servicios`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            throw new Error('No se pudieron cargar los servicios');
        }
    },

    // Obtener peluqueros de una peluquería
    getPeluquerosByPeluqueria: async (peluqueriaId) => {
        try {
            const response = await axios.get(`${API_URL}/peluquerias/${peluqueriaId}/peluqueros`);
            return response.data.filter(p => p.activo); // Solo peluqueros activos
        } catch (error) {
            console.error('Error al obtener peluqueros:', error);
            throw new Error('No se pudieron cargar los peluqueros');
        }
    },

    // Obtener horarios disponibles de un peluquero
    getHorariosDisponibles: async (peluqueroId, fecha) => {
        try {
            const response = await axios.get(
                `${API_URL}/horarios/peluquero/${peluqueroId}?fecha=${fecha}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            throw new Error('No se pudieron cargar los horarios disponibles');
        }
    },

    // Crear una nueva cita
    crearCita: async (usuarioId, servicioId, peluqueroId, fechaHora) => {
        try {
            const response = await axios.post(
                `${API_URL}/citas/${usuarioId}/${servicioId}/${peluqueroId}`,
                { fechaHora }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 409) {
                throw new Error('El peluquero ya tiene una cita en ese horario');
            }
            console.error('Error al crear cita:', error);
            throw new Error('No se pudo crear la cita');
        }
    },

    // Obtener detalles de una peluquería
    getPeluqueriaById: async (peluqueriaId) => {
        try {
            const response = await axios.get(`${API_URL}/peluquerias/${peluqueriaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching barber shop details ${peluqueriaId}:`, error);
            throw new Error('No se pudo cargar la información de la peluquería.');
        }
    },

    // Obtener peluquerias cercanas
    getPeluqueriasCercanas: async (lat, lng, radio) => {
        try {
            const response = await axios.get(`${API_URL}/peluquerias/cercanas`, {
                params: { lat, lng, radio }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching nearby barber shops:', error);
            throw new Error('No se pudieron obtener las peluquerías cercanas.');
        }
    },

    // Obtener servicios disponibles (asumiendo un endpoint general)
    getServiciosDisponibles: async () => {
        try {
            // TODO: Ajustar si hay un endpoint específico de cliente para servicios disponibles
            const response = await axios.get(`${API_URL}/servicios`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available services:', error);
            throw new Error('No se pudieron obtener los servicios disponibles.');
        }
    },

    // Obtener las citas del cliente autenticado
    getMisCitasCliente: async () => {
        try {
            // TODO: Asegurarse de que el backend resuelve el usuario desde el token de autenticación en este endpoint.
            // Si no, se necesitará pasar el usuarioId aquí y modificar el endpoint del backend.
            const response = await axios.get(`${API_URL}/cliente/mis-citas`);
            return response.data;
        } catch (error) {
            console.error('Error fetching client appointments:', error);
            throw new Error('No se pudieron cargar tus citas.');
        }
    },

    // Cancelar una cita del cliente
    cancelarCitaCliente: async (citaId) => {
        try {
            // TODO: Asegurarse de que el backend resuelve el usuario desde el token de autenticación en este endpoint
            // para verificar que el cliente es dueño de la cita antes de cancelarla.
            const response = await axios.delete(`${API_URL}/cliente/cancelar/${citaId}`);
            return response.data;
        } catch (error) {
            console.error(`Error cancelling appointment ${citaId}:`, error);
            throw new Error('No se pudo cancelar la cita.');
        }
    },

    // Funciones para el rol PELUQUERO

    // Obtener perfil del peluquero autenticado (NUEVO)
    getPerfilPeluquero: async () => {
        try {
            const response = await axios.get(`${API_URL}/peluquero/perfil`);
            return response.data;
        } catch (error) {
            console.error('Error fetching barber profile:', error);
            throw new Error('No se pudo cargar el perfil del peluquero.');
        }
    },

    getMisCitasPeluquero: async () => {
        try {
            // TODO: Asegurarse de que el backend resuelve el peluquero desde el token de autenticación en este endpoint.
            // Endpoint: GET /api/peluquero/mis-citas
            const response = await axios.get(`${API_URL}/peluquero/mis-citas`);
            // TODO: El backend actualmente devuelve una lista de Cita. Si la estructura incluye cliente y servicio, genial.
            // Si solo devuelve IDs, necesitarás obtener esos detalles adicionalmente o ajustar el backend.
            return response.data;
        } catch (error) {
            console.error('Error fetching barber appointments:', error);
            throw new Error('No se pudieron cargar tus citas.');
        }
    },

    // Obtener detalle de una cita para el peluquero
    // NOTA: No parece existir un endpoint específico en backend para obtener una ÚNICA cita por ID para el rol PELUQUERO/ADMIN.
    // Si la lista de la agenda (getMisCitasPeluquero) incluye todos los datos necesarios (cliente, servicio, fechaHora), podemos pasar
    // el objeto completo de la cita al componente DetalleCitaPeluquero a través del estado de navegación en lugar de hacer una nueva llamada aquí.
    // Si getMisCitasPeluquero solo devuelve IDs o datos incompletos, SÍ se necesitaría un nuevo endpoint en backend para esto.
    // Por ahora, eliminaremos la simulación y la alerta, asumiendo que los datos completos vendrán de la agenda.
    // Si necesitas un endpoint GET para detalle, avísame para añadir el TODO correspondiente en backend.
    // getCitaDetallePeluquero: async (citaId) => { /* ... */ },

    // Confirmar una cita (PELUQUERO)
    confirmarCitaPeluquero: async (citaId) => {
        try {
            // Endpoint: POST /api/peluquero/confirmar/{citaId}
            const response = await axios.post(`${API_URL}/peluquero/confirmar/${citaId}`);
            return response.data; // Debería devolver la cita actualizada
        } catch (error) {
            console.error(`Error confirming appointment ${citaId}:`, error);
            // TODO: Manejar errores específicos del backend (ej: cita no encontrada, ya confirmada/rechazada)
            throw new Error('No se pudo confirmar la cita.');
        }
    },

    // Rechazar una cita (PELUQUERO)
    rechazarCitaPeluquero: async (citaId) => {
        try {
            // Endpoint: POST /api/peluquero/rechazar/{citaId}
            const response = await axios.post(`${API_URL}/peluquero/rechazar/${citaId}`);
            return response.data; // Debería devolver la cita actualizada
        } catch (error) {
            console.error(`Error rejecting appointment ${citaId}:`, error);
            // TODO: Manejar errores específicos del backend
            throw new Error('No se pudo rechazar la cita.');
        }
    }
}; 