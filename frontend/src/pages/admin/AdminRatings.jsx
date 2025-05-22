import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert,
    Stack, TextField, Divider, List, ListItem,
    ListItemIcon, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Select, MenuItem, FormControl, InputLabel, IconButton, InputAdornment, Rating, Tooltip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Work as WorkIcon,
    Schedule as ScheduleIcon,
    EventNote as EventNoteIcon,
    Receipt as ReceiptIcon,
    Star as StarIcon,
    Spa as SpaIcon,
    Search as SearchIcon, // Icono para buscar en el topbar
    AccountCircle as AccountCircleIcon, // Icono de usuario en topbar
    Notifications as NotificationsIcon, // Icono de notificaciones en topbar
    Visibility as VisibilityIcon, // Icono para ver detalle (quizás no necesario aquí, pero lo mantenemos por ahora)
    // Download as DownloadIcon, // Icono para descargar PDF (no aplica para valoraciones)
    // Email as EmailIcon, // Icono para reenviar email (no aplica para valoraciones)
    RateReview as RateReviewIcon // Icono para valoraciones
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

// Importamos estilos generales del dashboard y crearemos estilos específicos
import '../../styles/AdminDashboard.css';
// import '../../styles/AdminRatings.css'; // TODO: Crear y usar este archivo para estilos específicos

const AdminRatings = () => {
    const location = useLocation();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState('');
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // TODO: Obtener la lista de peluqueros para el dropdown
    const dummyBarbers = [
        { id: '', nombre: 'Todos los peluqueros' },
        { id: 1, nombre: 'Juan Pérez' },
        { id: 2, nombre: 'María García' },
    ];

    // TODO: Obtener las valoraciones según los filtros
    const fetchRatings = async () => {
        setLoading(true);
        setError(null);
        try {
            // Aquí iría la llamada a la API para obtener las valoraciones
            // console.log('Filtrando desde', startDate, 'hasta', endDate, 'para peluquero', selectedBarber);
            
            // Datos dummy por ahora
            const dummyRatings = [
                { id: 1, fecha: '2023-10-26', cliente: 'Cliente Uno', peluquero: 'Juan Pérez', puntuacion: 5, comentario: 'Excelente servicio de corte!' },
                { id: 2, fecha: '2023-10-25', cliente: 'Cliente Dos', peluquero: 'María García', puntuacion: 4, comentario: 'Buen tinte, aunque un poco caro.' },
                { id: 3, fecha: '2023-10-25', cliente: 'Cliente Uno', peluquero: 'Juan Pérez', puntuacion: 5, comentario: '' }, // Sin comentario
                { id: 4, fecha: '2023-10-24', cliente: 'Cliente Tres', peluquero: 'María García', puntuacion: 3, comentario: 'El tiempo de espera fue largo.' },
                { id: 5, fecha: '2023-10-24', cliente: 'Cliente Cuatro', peluquero: 'Juan Pérez', puntuacion: 5, comentario: 'Muy profesional y rápido.' },
            ];

            // Simular un retardo de red
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Filtrar datos dummy (implementación básica)
            const filteredRatings = dummyRatings.filter(rating => {
                const ratingDate = dayjs(rating.fecha);
                const start = startDate ? dayjs(startDate) : null;
                const end = endDate ? dayjs(endDate) : null;

                const dateFilter = (!start || ratingDate.isAfter(start.subtract(1, 'day'))) &&
                                   (!end || ratingDate.isBefore(end.add(1, 'day')));

                const barberFilter = selectedBarber === '' || rating.peluquero === dummyBarbers.find(b => b.id === selectedBarber)?.nombre; // Comparar por nombre dummy

                return dateFilter && barberFilter;
            });

            setRatings(filteredRatings);

        } catch (err) {
            console.error('Error fetching ratings:', err);
            setError('Error al cargar las valoraciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Cargar valoraciones iniciales al montar o cuando cambien los filtros (si no usamos botón filtrar)
        // Por ahora, lo llamaremos solo al hacer clic en filtrar.
    }, []); // Dependencias vacías para que se ejecute solo una vez al montar

    const handleFilterClick = () => {
        fetchRatings();
    };

    // Función para truncar comentarios largos
    const truncateComment = (comment, maxLength) => {
        if (!comment) return '—'; // Mostrar guion si no hay comentario
        if (comment.length <= maxLength) return comment;
        return comment.substring(0, maxLength) + '...';
    };

    // Definición de los elementos del sidebar
    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Peluqueros', icon: <WorkIcon />, path: '/admin/barbers-services' },
        { text: 'Servicios', icon: <SpaIcon />, path: '/admin/barbers-services?tab=servicios' }, // Enlazar a la pestaña de servicios
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/admin/schedules' },
        { text: 'Facturación', icon: <ReceiptIcon />, path: '/admin/invoices' },
        { text: 'Valoraciones', icon: <StarIcon />, path: '/admin/ratings', active: true }, // Marcado como activo
    ];

    return (
        <Box className="admin-dashboard-container"> {/* Contenedor principal */}
            {/* Sidebar */}
            <motion.Box 
                className="admin-dashboard-sidebar" 
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box className="sidebar-logo-container"> 
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" /> 
                </Box>
                <Divider sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                <List>
                    {sidebarItems.map((item, index) => (
                         <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            // Si la ruta actual coincide con la del item, o si el item está marcado como activo\n // usamos location.pathname para comparar solo la ruta base, ignorando query params
                            sx={{
                                /* Estilos de item */
                                '&.active': { /* Estilo para el item activo */
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderLeft: '4px solid #d72a3c', // Indicador rojo activo
                                    paddingLeft: '16px' // Ajustar padding por el borde
                                },
                                // Determinar si el item está activo basado en la ruta actual
                                color: (location.pathname === item.path.split('?')[0] || item.active) ? '#fff' : 'rgba(255, 255, 255, 0.8)', // Color de texto
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#d72a3c' // Color rojo al pasar el ratón
                                },
                                /* Asegurar que el padding sea consistente si no está activo */
                                ...(!(location.pathname === item.path.split('?')[0] || item.active) && { paddingLeft: '20px' })
                            }}
                         >
                            <ListItemIcon sx={{ color: (location.pathname === item.path.split('?')[0] || item.active) ? '#fff' : 'rgba(255, 255, 255, 0.8)' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: (location.pathname === item.path.split('?')[0] || item.active) ? '#fff' : 'rgba(255, 255, 255, 0.8)' }} />
                        </ListItem>
                    ))}
                </List>
            </motion.Box>

            {/* Main Content Area */}
            <Box className="admin-dashboard-main-content"> 
                {/* Topbar */}
                <Box className="admin-dashboard-topbar"> 
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Valoraciones</Typography>
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
                             sx={{ mr: 2, '& fieldset': { border: 'none' } }}
                         />
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <AccountCircleIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Divider />

                {/* Content Area below Topbar */}
                <Box className="admin-dashboard-content-area" sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, mt: 3 }}> {/* Contenedor principal con fondo blanco */}
                    {/* Encabezado del módulo */}
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <RateReviewIcon sx={{ fontSize: 40, color: '#d72a3c' }} />
                        <Box>
                            <Typography variant="h6" gutterBottom>Gestión de Valoraciones</Typography>
                            <Typography variant="body2" color="text.secondary">Consulta y analiza las valoraciones de tus clientes sobre los peluqueros.</Typography>
                        </Box>
                    </Stack>

                    {/* Zona de Filtros */}
                    <Grid container spacing={2} alignItems="center" mb={3}>
                        <Grid item xs={12} md={3}>
                             <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha Inicio"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha Fin"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                />
                            </LocalizationProvider>
                        </Grid>
                         <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Peluquero</InputLabel>
                                <Select
                                    value={selectedBarber}
                                    label="Peluquero"
                                    onChange={(event) => setSelectedBarber(event.target.value)}
                                >
                                    {dummyBarbers.map(barber => (
                                        <MenuItem key={barber.id} value={barber.id}>{barber.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                             <Button 
                                variant="contained" 
                                sx={{ bgcolor: '#d72a3c', '&:hover': { bgcolor: '#b0212e' }, height: '100%' }} // Ajustar altura
                                fullWidth // Opcional: hacer que el botón ocupe todo el ancho en móviles
                                onClick={handleFilterClick}
                            >
                                Filtrar
                            </Button>
                        </Grid>
                         {/* TODO: Añadir contador de valoraciones filtradas opcional */}
                    </Grid>

                    {/* Tabla de Resultados */}
                    {loading ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
                    ) : ratings.length === 0 ? (
                         <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            No se han encontrado valoraciones para estos filtros.\n                    </Typography>
                    ) : (
                         <TableContainer component={Paper} elevation={1}> {/* Añadimos un poco de elevación */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Peluquero</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Puntuación</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Comentario</TableCell>
                                         {/* TODO: Añadir columna de Acciones si es necesario */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ratings.map((rating) => (
                                        <TableRow key={rating.id}>
                                            <TableCell>{dayjs(rating.fecha).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>{rating.cliente}</TableCell>
                                            <TableCell>{rating.peluquero}</TableCell>
                                            <TableCell>
                                                <Rating name="read-only" value={rating.puntuacion} readOnly precision={0.5} />
                                            </TableCell>
                                            <TableCell>
                                                {/* TODO: Implementar tooltip para comentario completo */}
                                                <Tooltip title={rating.comentario || 'Sin comentario'} arrow>
                                                    <Typography variant="body2">{truncateComment(rating.comentario, 50)}</Typography> {/* Truncar a 50 caracteres */}
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             {/* TODO: Implementar paginación y ordenación si es necesario */}
                        </TableContainer>
                    )}


                </Box>
            </Box>
        </Box>
    );
};

export default AdminRatings; 