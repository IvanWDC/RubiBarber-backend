import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Divider, TextField, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Grid } from '@mui/material';
import { motion } from 'framer-motion';
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
    Spa as SpaIcon,
    Add as AddIcon, // Icono para el botón Nuevo
    Edit as EditIcon, // Icono para editar
    ToggleOn as ToggleOnIcon, // Icono para activar
    ToggleOff as ToggleOffIcon // Icono para desactivar
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

import '../../styles/AdminDashboard.css'; // Reutilizamos estilos del dashboard principal para la estructura general
import '../../styles/AdminBarbersServices.css'; // Estilos específicos de esta página

const AdminBarbersServices = () => {
    const location = useLocation();
    const [tabValue, setTabValue] = useState(0); // 0 para Peluqueros, 1 para Servicios

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'servicios') {
            setTabValue(1);
        } else {
            setTabValue(0);
        }
    }, [location.search]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Datos placeholder para la tabla de Peluqueros
    const dummyBarbers = [
        { id: 1, nombre: 'Juan Pérez', especialidad: 'Corte Caballero', estado: true },
        { id: 2, nombre: 'María García', especialidad: 'Tinte y Mechas', estado: false },
    ];

    // Datos placeholder para la tabla de Servicios
    const dummyServices = [
        { id: 1, nombre: 'Corte Caballero', precio: 15.00, duracion: 30, estado: true },
        { id: 2, nombre: 'Tinte y Mechas', precio: 50.00, duracion: 90, estado: true },
        { id: 3, nombre: 'Afeitado Clásico', precio: 20.00, duracion: 45, estado: false },
    ];

    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Peluqueros', icon: <WorkIcon />, path: '/admin/barbers-services', active: tabValue === 0 },
        { text: 'Servicios', icon: <SpaIcon />, path: '/admin/barbers-services', active: tabValue === 1 },
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/admin/schedules' },
        { text: 'Facturación', icon: <ReceiptIcon />, path: '/admin/invoices' },
        { text: 'Valoraciones', icon: <StarIcon />, path: '/admin/ratings' },
    ];

    return (
        <Box className="admin-dashboard-container"> {/* Reutilizamos el contenedor principal */}
            {/* Sidebar */}
            <motion.Box 
                className="admin-dashboard-sidebar" // Reutilizamos estilos del sidebar
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box className="sidebar-logo-container"> {/* Contenedor del logo */}
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" /> {/* Logo */}
                </Box>
                <Divider sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                <List>
                    {sidebarItems.map((item, index) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            onClick={() => setTabValue(index === 1 ? 0 : (index === 2 ? 1 : tabValue))} // Controlar la pestaña al hacer clic en Peluqueros o Servicios
                            sx={{ /* Estilos de item */
                                '&.active': { /* Estilo para el item activo */
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderLeft: '4px solid #d72a3c', // Indicador rojo activo
                                    paddingLeft: '16px' // Ajustar padding por el borde
                                },
                                color: item.active ? '#fff' : 'rgba(255, 255, 255, 0.8)', // Color de texto
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#d72a3c' // Color rojo al pasar el ratón
                                },
                                /* Asegurar que el padding sea consistente si no está activo */
                                ...(!item.active && { paddingLeft: '20px' })
                            }}
                        >
                            <ListItemIcon sx={{ color: item.active ? '#fff' : 'rgba(255, 255, 255, 0.8)' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: item.active ? '#fff' : 'rgba(255, 255, 255, 0.8)' }} />
                        </ListItem>
                    ))}
                </List>
            </motion.Box>

            {/* Main Content Area */}
            <Box className="admin-dashboard-main-content"> {/* Reutilizamos el contenedor principal */}
                {/* Topbar */}
                <Box className="admin-dashboard-topbar"> {/* Reutilizamos estilos de topbar */}
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Gestión de {tabValue === 0 ? 'Peluqueros' : 'Servicios'}</Typography>
                    {/* Buscador, Icono/Avatar, Notificaciones */}
                    <Box className="topbar-right"> {/* Reutilizamos estilos */}
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
                        <IconButton color="inherit">
                            <AccountCircleIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Divider />

                {/* Content Area below Topbar */}
                <Box className="admin-dashboard-content-area admin-barbers-services-content-area"> {/* Reutilizamos estilos */}
                    {/* Tabs */}
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="gestión tabs" sx={{ mb: 3 }}>
                        <Tab label="Peluqueros" />
                        <Tab label="Servicios" />
                    </Tabs>

                    {/* Botón Nuevo */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#d72a3c', '&:hover': { bgcolor: '#b0212e' } }}>
                            Nuevo {tabValue === 0 ? 'Peluquero' : 'Servicio'}
                        </Button>
                    </Box>

                    {/* Contenido de la Tabla */}
                    {tabValue === 0 && ( // Pestaña de Peluqueros
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Especialidad</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dummyBarbers.map((barber) => (
                                        <TableRow key={barber.id}>
                                            <TableCell>{barber.nombre}</TableCell>
                                            <TableCell>{barber.especialidad}</TableCell>
                                            <TableCell>{barber.estado ? 'Activo' : 'Inactivo'}</TableCell>
                                            <TableCell>
                                                <IconButton aria-label="editar">
                                                    <EditIcon /> {/* TODO: Implementar funcionalidad de editar */}
                                                </IconButton>
                                                <IconButton aria-label={barber.estado ? 'desactivar' : 'activar'}>
                                                    {barber.estado ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />} {/* TODO: Implementar funcionalidad de activar/desactivar */}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {tabValue === 1 && ( // Pestaña de Servicios
                         <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Duración (min)</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dummyServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{service.nombre}</TableCell>
                                            <TableCell>{service.precio.toFixed(2)} €</TableCell>
                                            <TableCell>{service.duracion} min</TableCell>
                                            <TableCell>{service.estado ? 'Activo' : 'Inactivo'}</TableCell>
                                            <TableCell>
                                                <IconButton aria-label="editar">
                                                    <EditIcon /> {/* TODO: Implementar funcionalidad de editar */}
                                                </IconButton>
                                                <IconButton aria-label={service.estado ? 'desactivar' : 'activar'}>
                                                    {service.estado ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="error" />} {/* TODO: Implementar funcionalidad de activar/desactivar */}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                </Box>
            </Box>
        </Box>
    );
};

export default AdminBarbersServices; 