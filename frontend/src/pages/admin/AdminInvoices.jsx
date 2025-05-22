import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert,
    Stack, TextField, Divider, List, ListItem,
    ListItemIcon, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Select, MenuItem, FormControl, InputLabel, IconButton, InputAdornment
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
    Visibility as VisibilityIcon, // Icono para ver detalle
    Download as DownloadIcon, // Icono para descargar PDF
    Email as EmailIcon // Icono para reenviar email
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

// Importamos estilos generales del dashboard y crearemos estilos específicos
import '../../styles/AdminDashboard.css';
// import '../../styles/AdminStatisticsAppointments.css'; // Usamos algunos estilos de la vista anterior si aplican
// import '../../styles/AdminInvoices.css'; // TODO: Crear y usar este archivo para estilos específicos

const AdminInvoices = () => {
    const location = useLocation();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedClient, setSelectedClient] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // TODO: Obtener la lista de clientes para el dropdown
    const dummyClients = [
        { id: '', nombre: 'Todos los clientes' },
        { id: 1, nombre: 'Cliente Uno' },
        { id: 2, nombre: 'Cliente Dos' },
    ];

    // TODO: Obtener las facturas según los filtros
    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            // Aquí iría la llamada a la API para obtener las facturas
            // console.log('Filtrando desde', startDate, 'hasta', endDate, 'para cliente', selectedClient);
            
            // Datos dummy por ahora
            const dummyInvoices = [
                { id: 1, fecha: '2023-10-26', cliente: 'Cliente Uno', montoTotal: 25.00 },
                { id: 2, fecha: '2023-10-25', cliente: 'Cliente Dos', montoTotal: 50.00 },
                { id: 3, fecha: '2023-10-25', cliente: 'Cliente Uno', montoTotal: 30.00 },
            ];

            // Simular un retardo de red
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Filtrar datos dummy (implementación básica)
            const filteredInvoices = dummyInvoices.filter(invoice => {
                const invoiceDate = dayjs(invoice.fecha);
                const start = startDate ? dayjs(startDate) : null;
                const end = endDate ? dayjs(endDate) : null;

                const dateFilter = (!start || invoiceDate.isAfter(start.subtract(1, 'day'))) &&
                                   (!end || invoiceDate.isBefore(end.add(1, 'day')));

                const clientFilter = selectedClient === '' || invoice.cliente === dummyClients.find(c => c.id === selectedClient)?.nombre; // Comparar por nombre dummy

                return dateFilter && clientFilter;
            });

            setInvoices(filteredInvoices);

        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError('Error al cargar las facturas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Cargar facturas iniciales al montar o cuando cambien los filtros (si no usamos botón filtrar)
        // Por ahora, lo llamaremos solo al hacer clic en filtrar.
    }, []); // Dependencias vacías para que se ejecute solo una vez al montar

    const handleFilterClick = () => {
        fetchInvoices();
    };

    const handleExportClick = () => {
        // TODO: Implementar lógica de exportación (PDF/CSV)
        console.log('Exportar facturas con filtros:', { startDate, endDate, selectedClient });
        alert('Funcionalidad de exportación aún no implementada.');
    };

    const handleViewDetails = (invoiceId) => {
        // TODO: Implementar navegación a la vista de detalle de factura
        console.log('Ver detalle de factura:', invoiceId);
        alert(`Ver detalles de factura ${invoiceId} aún no implementado.`);
    };

    const handleDownloadPdf = (invoiceId) => {
        // TODO: Implementar descarga de PDF
        console.log('Descargar PDF de factura:', invoiceId);
        alert(`Descargar PDF de factura ${invoiceId} aún no implementado.`);
    };

    const handleResendEmail = (invoiceId) => {
        // TODO: Implementar reenvío por email
        console.log('Reenviar email de factura:', invoiceId);
        alert(`Reenviar email de factura ${invoiceId} aún no implementado.`);
    };

    // Definición de los elementos del sidebar
    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Peluqueros', icon: <WorkIcon />, path: '/admin/barbers-services' },
        { text: 'Servicios', icon: <SpaIcon />, path: '/admin/barbers-services?tab=servicios' }, // Enlazar a la pestaña de servicios
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/admin/schedules' },
        { text: 'Facturación', icon: <ReceiptIcon />, path: '/admin/invoices', active: true }, // Marcado como activo
        { text: 'Valoraciones', icon: <StarIcon />, path: '/admin/ratings' }, // TODO: Actualizar path si es necesario
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
                            // Si la ruta actual coincide con la del item, o si el item está marcado como activo
                            // usamos location.pathname para comparar solo la ruta base, ignorando query params
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Facturación</Typography>
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
                        <ReceiptIcon sx={{ fontSize: 40, color: '#d72a3c' }} />
                        <Box>
                            <Typography variant="h6" gutterBottom>Gestión de Facturas</Typography>
                            <Typography variant="body2" color="text.secondary">Consulta y exporta las facturas generadas por tus clientes en el rango de fechas deseado.</Typography>
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
                                <InputLabel>Cliente</InputLabel>
                                <Select
                                    value={selectedClient}
                                    label="Cliente"
                                    onChange={(event) => setSelectedClient(event.target.value)}
                                >
                                    {dummyClients.map(client => (
                                        <MenuItem key={client.id} value={client.id}>{client.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Button 
                                variant="contained" 
                                sx={{ bgcolor: '#d72a3c', '&:hover': { bgcolor: '#b0212e' }, height: '100%' }} // Ajustar altura
                                fullWidth // Opcional: hacer que el botón ocupe todo el ancho en móviles
                                onClick={handleFilterClick}
                            >
                                Filtrar
                            </Button>
                        </Grid>
                         <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                             <Button 
                                variant="outlined" 
                                sx={{ color: '#d72a3c', borderColor: '#d72a3c', '&:hover': { borderColor: '#b0212e', color: '#b0212e' } }}
                                 startIcon={<DownloadIcon />}
                                 onClick={handleExportClick}
                             >
                                Exportar
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Tabla de Resultados */}
                    {loading ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
                    ) : invoices.length === 0 ? (
                         <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            No se han encontrado facturas para estos filtros.
                        </Typography>
                    ) : (
                         <TableContainer component={Paper} elevation={1}> {/* Añadimos un poco de elevación */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Monto Total</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>{dayjs(invoice.fecha).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>{invoice.cliente}</TableCell>
                                            <TableCell>{invoice.montoTotal.toFixed(2)} €</TableCell>
                                            <TableCell>
                                                <IconButton aria-label="ver detalles" onClick={() => handleViewDetails(invoice.id)}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton aria-label="descargar pdf" onClick={() => handleDownloadPdf(invoice.id)}>
                                                    <DownloadIcon />
                                                </IconButton>
                                                 <IconButton aria-label="reenviar email" onClick={() => handleResendEmail(invoice.id)}>
                                                    <EmailIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             {/* TODO: Implementar paginación si es necesario */}
                        </TableContainer>
                    )}


                </Box>
            </Box>
        </Box>
    );
};

export default AdminInvoices; 