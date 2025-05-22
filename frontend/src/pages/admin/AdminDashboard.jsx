import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, TextField, InputAdornment, IconButton, Paper, Grid, Modal, Stack, Button, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion'; // Importar motion
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Work as WorkIcon,
    Schedule as ScheduleIcon,
    EventNote as EventNoteIcon,
    Receipt as ReceiptIcon,
    Star as StarIcon,
    Search as SearchIcon,
    AccountCircle as AccountCircleIcon,
    Notifications as NotificationsIcon,
    Spa as SpaIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom'; // Asumiendo que usas react-router-dom para navegación
import { Bar } from 'react-chartjs-2'; // Importar componente de gráfica de barras
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Importar elementos necesarios de Chart.js
import dayjs from 'dayjs';
import '../../styles/AdminDashboard.css';

// Registrar los elementos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Placeholder para datos de widgets (luego vendrán del backend)
const dummyWidgetData = {
    citasHoy: 15,
    ingresosSemanales: 1250.75,
    peluquerosActivos: 8
};

// Placeholder para datos de últimas reservas (luego vendrán del backend)
const dummyLatestReservations = [
    { id: 1, cliente: 'Juan Pérez', fecha: '2023-10-27 10:00', servicio: 'Corte Caballero' },
    { id: 2, cliente: 'María García', fecha: '2023-10-27 11:30', servicio: 'Tinte y Mechas' },
    { id: 3, cliente: 'Carlos Ruiz', fecha: '2023-10-27 14:00', servicio: 'Afeitado Clásico' },
    { id: 4, cliente: 'Ana López', fecha: '2023-10-27 15:30', servicio: 'Peinado y Maquillaje' },
];

// Placeholder para datos de gráfica (luego vendrán del backend)
const dummyMonthlyAppointments = [
    { month: 'Ene', citas: 200 },
    { month: 'Feb', citas: 220 },
    { month: 'Mar', citas: 250 },
    { month: 'Abr', citas: 230 },
    { month: 'May', citas: 280 },
    { month: 'Jun', citas: 300 },
    { month: 'Jul', citas: 270 },
    { month: 'Ago', citas: 260 },
    { month: 'Sep', citas: 290 },
    { month: 'Oct', citas: 310 },
    { month: 'Nov', citas: 300 },
    { month: 'Dic', citas: 320 },
];

const AdminDashboard = () => {
    const location = useLocation();
    const [widgetData, setWidgetData] = useState(dummyWidgetData);
    const [latestReservations, setLatestReservations] = useState(dummyLatestReservations);
    const [monthlyAppointments, setMonthlyAppointments] = useState(dummyMonthlyAppointments);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openProfileModal, setOpenProfileModal] = useState(false);

    // Nuevos estados para los datos del perfil del administrador
    const [adminProfile, setAdminProfile] = useState({
        nombreCompleto: '',
        correoElectronico: '',
        imagenPerfilUrl: null, // URL de la imagen actual
        nuevaImagenPerfil: null, // Archivo de la nueva imagen a subir
    });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState(null);

    // Configuración para la gráfica de barras
    const chartData = {
        labels: monthlyAppointments.map(data => data.month),
        datasets: [
            {
                label: 'Número de Citas',
                data: monthlyAppointments.map(data => data.citas),
                backgroundColor: 'rgba(215, 42, 60, 0.6)', // Color rojo principal con transparencia
                borderColor: 'rgba(215, 42, 60, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Citas Mensuales',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Citas',
                },
            },
            x: {
                 title: {
                    display: true,
                    text: 'Mes',
                },
            },
        },
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Simular carga de datos de resumen
            await new Promise(resolve => setTimeout(resolve, 500));
            setWidgetData({
                citasHoy: 25,
                ingresosSemanales: 500.75,
                peluquerosActivos: 12
            });
            setLoading(false);

            // Simular carga de citas recientes
            await new Promise(resolve => setTimeout(resolve, 600));
            const dummyAppointments = [
                { id: 1, cliente: 'Cliente Ejemplo 1', fechaHora: dayjs().subtract(1, 'hour').toDate(), servicio: 'Corte de pelo', peluquero: 'Juan Pérez', estado: 'Completada' },
                { id: 2, cliente: 'Cliente Ejemplo 2', fechaHora: dayjs().add(2, 'hours').toDate(), servicio: 'Barba', peluquero: 'María García', estado: 'Pendiente' },
                { id: 3, cliente: 'Cliente Ejemplo 3', fechaHora: dayjs().subtract(3, 'days').toDate(), servicio: 'Tinte', peluquero: 'Juan Pérez', estado: 'Cancelada' },
            ];
            setLatestReservations(dummyAppointments);

            // Simular carga de servicios más demandados
            await new Promise(resolve => setTimeout(resolve, 700));
            const dummyTopServices = [
                { id: 1, nombre: 'Corte de pelo', vecesReservado: 120 },
                { id: 2, nombre: 'Barba', vecesReservado: 80 },
                { id: 3, nombre: 'Tinte', vecesReservado: 50 },
            ];
            setMonthlyAppointments(dummyTopServices);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Error al cargar los datos del dashboard.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Funciones para abrir y cerrar el modal de perfil
    const handleOpenProfileModal = () => {
        // TODO: Cargar datos del perfil del administrador al abrir el modal
        fetchAdminProfile();
        setOpenProfileModal(true);
    };
    const handleCloseProfileModal = () => {
        setOpenProfileModal(false);
        // Resetear estados del modal al cerrar si es necesario
        setProfileError(null);
        setAdminProfile({ // Opcional: resetear a los datos cargados si no se guardaron
            nombreCompleto: '',
            correoElectronico: '',
            imagenPerfilUrl: null,
            nuevaImagenPerfil: null,
        });
    };

    // TODO: Implementar carga de datos del perfil del administrador
    const fetchAdminProfile = async () => {
        setLoadingProfile(true);
        setProfileError(null);
        try {
            // Aquí iría la llamada a la API para obtener los datos del perfil
            // const response = await api.getAdminProfile();
            // setAdminProfile(response.data);

            // Datos dummy por ahora
            await new Promise(resolve => setTimeout(resolve, 500));
            setAdminProfile({
                nombreCompleto: 'Administrador Ejemplo',
                correoElectronico: 'admin.ejemplo@rubibarber.com',
                imagenPerfilUrl: '/path/to/dummy/image.jpg', // O null si no hay imagen
                nuevaImagenPerfil: null,
            });

        } catch (err) {
            console.error('Error fetching admin profile:', err);
            setProfileError('Error al cargar el perfil.');
        } finally {
            setLoadingProfile(false);
        }
    };

    // Manejar cambios en los campos de texto
    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setAdminProfile(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar selección de archivo de imagen
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // TODO: Validar tamaño y formato del archivo si es necesario
            setAdminProfile(prevState => ({
                ...prevState,
                nuevaImagenPerfil: file,
                // Opcional: mostrar preview de la imagen seleccionada
                // imagenPerfilUrl: URL.createObjectURL(file),
            }));
        }
    };

    // TODO: Implementar guardado de cambios del perfil
    const handleSaveChanges = async () => {
        setLoadingProfile(true);
        setProfileError(null);
        try {
            // Aquí iría la llamada a la API para actualizar el perfil
            // const formData = new FormData();
            // formData.append('nombreCompleto', adminProfile.nombreCompleto);
            // formData.append('correoElectronico', adminProfile.correoElectronico);
            // if (adminProfile.nuevaImagenPerfil) {
            //     formData.append('imagenPerfil', adminProfile.nuevaImagenPerfil);
            // }
            // await api.updateAdminProfile(formData);

            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Perfil guardado:', adminProfile);
            // TODO: Mostrar mensaje de éxito
            handleCloseProfileModal(); // Cerrar modal tras guardar

        } catch (err) {
            console.error('Error saving admin profile:', err);
            setProfileError('Error al guardar los cambios.');
            // TODO: Mostrar mensaje de error
        } finally {
            setLoadingProfile(false);
        }
    };

    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard', active: true },
        { text: 'Peluqueros', icon: <WorkIcon />, path: '/admin/barbers-services' },
        { text: 'Servicios', icon: <SpaIcon />, path: '/admin/barbers-services?tab=servicios' },
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/admin/schedules' },
        { text: 'Facturación', icon: <ReceiptIcon />, path: '/admin/invoices' },
        { text: 'Valoraciones', icon: <StarIcon />, path: '/admin/ratings' },
    ];

    // Función auxiliar para formatear fecha y hora (usada en citas recientes)
    const formatFechaHora = (fechaHora) => {
        return dayjs(fechaHora).format('DD/MM/YYYY HH:mm');
    };

    return (
        <Box className="admin-dashboard-container">
            {/* Sidebar */}
            <motion.Box 
                className="admin-dashboard-sidebar"
                initial={{ x: -250 }} // Inicia fuera de la pantalla
                animate={{ x: 0 }} // Se desliza hacia adentro
                transition={{ duration: 0.5 }}
            >
                <Box className="sidebar-logo-container">
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                </Box>
                <Divider sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                <List>
                    {sidebarItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            sx={{
                                '&.active': { /* Estilo para el item activo */ }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: '#fff' }} />
                        </ListItem>
                    ))}
                </List>
            </motion.Box>

            {/* Main Content Area */}
            <Box className="admin-dashboard-main-content">
                {/* Topbar */}
                <Box className="admin-dashboard-topbar">
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Panel de Administración</Typography>
                    {/* Buscador, Icono/Avatar, Notificaciones */}
                    <Box className="topbar-right">
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Buscar..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                style: { borderRadius: '20px', backgroundColor: '#f0f0f0' }
                            }}
                            sx={{ mr: 2, '& fieldset': { border: 'none' } }} // Eliminar borde y añadir margen
                        />
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleOpenProfileModal}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Divider />

                {/* Content Area below Topbar */}
                <Box className="admin-dashboard-content-area">
                    {/* Widgets Resumen */}
                    <Grid container spacing={3} className="admin-dashboard-summary-widgets">
                        <Grid item xs={12} sm={4}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6" color="textSecondary">Citas Hoy</Typography>
                                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>{widgetData.citasHoy}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6" color="textSecondary">Ingresos Semanales</Typography>
                                <Typography variant="h4" color="success.main" sx={{ mt: 1 }}>${widgetData.ingresosSemanales.toFixed(2)}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6" color="textSecondary">Peluqueros Activos</Typography>
                                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>{widgetData.peluquerosActivos}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Gráfica y Tabla */}
                    <Box className="admin-dashboard-bottom-section">
                        {/* Gráfica (60%) */}
                        <Box className="admin-dashboard-chart-area">
                            <Typography variant="h6" gutterBottom>Gráfica Citas Mensuales</Typography>
                            <Bar data={chartData} options={chartOptions} />
                        </Box>

                        {/* Tabla (40%) */}
                        <Box className="admin-dashboard-table-area">
                            <Typography variant="h6" gutterBottom>Últimas Reservas</Typography>
                            {/* Placeholder de Tabla - Aquí puedes usar un componente Table de MUI */}
                            <Box>
                                {/* Ejemplo básico de cómo podría ser la tabla con Box y Typography */}
                                {latestReservations.map(reservation => (
                                    <Box key={reservation.id} sx={{ borderBottom: '1px solid #eee', py: 1 }}>
                                        <Typography variant="body1"><b>Cliente:</b> {reservation.cliente}</Typography>
                                        <Typography variant="body2" color="textSecondary"><b>Fecha:</b> {formatFechaHora(reservation.fechaHora)}</Typography>
                                        <Typography variant="body2" color="textSecondary"><b>Servicio:</b> {reservation.servicio}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Modal de Perfil del Administrador */}
            <Modal
                open={openProfileModal}
                onClose={handleCloseProfileModal}
                aria-labelledby="profile-modal-title"
                aria-describedby="profile-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400, md: 500 }, // Ancho responsive
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    outline: 'none', // Eliminar borde de foco
                    maxHeight: '90vh', // Altura máxima para evitar desbordamiento
                    overflowY: 'auto', // Scroll si el contenido es largo
                }}>
                    <Typography id="profile-modal-title" variant="h6" component="h2" gutterBottom>
                        Perfil del Administrador
                    </Typography>
                    {loadingProfile ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : profileError ? (
                        <Alert severity="error">{profileError}</Alert>
                    ) : (
                        <Stack spacing={2}>
                            <TextField
                                label="Nombre Completo"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="nombreCompleto"
                                value={adminProfile.nombreCompleto}
                                onChange={handleProfileInputChange}
                            />
                            <TextField
                                label="Correo Electrónico"
                                variant="outlined"
                                fullWidth
                                size="small"
                                type="email"
                                name="correoElectronico"
                                value={adminProfile.correoElectronico}
                                onChange={handleProfileInputChange}
                            />
                            {/* Sección para la imagen de perfil */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Box sx={{
                                    width: 80, height: 80, bgcolor: '#ccc', borderRadius: '50%', mr: 2,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
                                }}>
                                    {adminProfile.imagenPerfilUrl ? (
                                        <img src={adminProfile.imagenPerfilUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                         <AccountCircleIcon sx={{ fontSize: 60, color: '#fff' }} />
                                    )}
                                </Box>
                                <Button variant="outlined" component="label">
                                    Subir Imagen
                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                </Button>
                                 {adminProfile.nuevaImagenPerfil && (
                                    <Typography variant="body2" sx={{ ml: 1, fontStyle: 'italic' }}>
                                        Archivo seleccionado: {adminProfile.nuevaImagenPerfil.name}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    )}

                     <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', spacing: 2 }}>
                         <Button onClick={handleCloseProfileModal} sx={{ mr: 1 }}>Cancelar</Button>
                         <Button
                            variant="contained"
                            sx={{ bgcolor: '#d72a3c', '&:hover': { bgcolor: '#b0212e' } }}
                            onClick={handleSaveChanges}
                            disabled={loadingProfile} // Deshabilitar botón al guardar
                         >
                            {loadingProfile ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default AdminDashboard; 