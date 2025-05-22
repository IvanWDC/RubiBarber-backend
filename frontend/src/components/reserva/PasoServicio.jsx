import { useState, useEffect } from 'react';
import { 
    Paper, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActionArea, 
    Box,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useReserva } from '../../context/ReservaContext';
import { reservaService } from '../../api/reservaService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EuroIcon from '@mui/icons-material/Euro';

const PasoServicio = () => {
    const { 
        servicioSeleccionado, 
        setServicioSeleccionado, 
        siguientePaso,
        peluqueriaSeleccionada
    } = useReserva();
    
    // Obtener servicios de la peluquería seleccionada del contexto
    const servicios = peluqueriaSeleccionada?.servicios?.filter(s => s.activo) || [];
    // No necesitamos loading/error state en este componente si la peluquería ya fue cargada en el componente padre (ReservaCita)
    const loading = false; // Simpre false si los datos vienen del contexto
    const error = null; // Siempre null si los datos vienen del contexto

    const handleSeleccionServicio = (servicio) => {
        setServicioSeleccionado(servicio);
        setTimeout(siguientePaso, 500); // Pequeño delay para la animación
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Typography variant="h6" gutterBottom>
                Selecciona el Servicio
            </Typography>
            
            {peluqueriaSeleccionada && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Seleccionando servicio para {peluqueriaSeleccionada.nombre}
                </Alert>
            )}

            <Grid container spacing={3}>
                {servicios.map((servicio) => (
                    <Grid item xs={12} sm={6} md={4} key={servicio.id}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: servicioSeleccionado?.id === servicio.id 
                                        ? '2px solid #d72a3c' 
                                        : '1px solid rgba(0, 0, 0, 0.12)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <CardActionArea 
                                    onClick={() => handleSeleccionServicio(servicio)}
                                    sx={{ flexGrow: 1 }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {servicio.nombre}
                                        </Typography>
                                        
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={{ mb: 2 }}
                                        >
                                            {servicio.descripcion}
                                        </Typography>

                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mt: 'auto'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {servicio.duracion} min
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ fontWeight: 'bold', color: '#d72a3c' }}
                                                >
                                                    {servicio.precio}
                                                </Typography>
                                                <EuroIcon fontSize="small" sx={{ color: '#d72a3c' }} />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </motion.div>
    );
};

export default PasoServicio; 