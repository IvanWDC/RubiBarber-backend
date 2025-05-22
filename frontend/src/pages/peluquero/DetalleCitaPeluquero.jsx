import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Button,
    Grid,
    Chip,
    IconButton,
    Tooltip,
    Card,
    CardContent
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { reservaService } from '../../api/reservaService';
import '../../styles/DetalleCitaPeluquero.css';
import {
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
    Store as StoreIcon,
    Spa as SpaIcon,
    EventNote as EventNoteIcon,
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    CalendarMonth as CalendarIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const DetalleCitaPeluquero = () => {
    const { citaId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [cita, setCita] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.6,
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.4 }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    useEffect(() => {
        const citaFromState = location.state?.cita;

        if (citaFromState) {
            setCita(citaFromState);
            setLoading(false);
        } else if (citaId) {
            setError('No se pudo cargar el detalle de la cita. Intenta seleccionarla desde la agenda.');
            setLoading(false);
        } else {
            setError('ID de cita no proporcionado.');
            setLoading(false);
        }
    }, [citaId, location.state]);

    const mostrarSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const cerrarSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleConfirmar = async () => {
        setActionLoading(true);
        try {
            const citaActualizada = await reservaService.confirmarCitaPeluquero(citaId);
            setCita(citaActualizada);
            mostrarSnackbar('¡Cita confirmada exitosamente!', 'success');
        } catch (err) {
            mostrarSnackbar(`Error al confirmar cita: ${err.message}`, 'error');
            console.error('Error confirming appointment:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRechazar = async () => {
        setActionLoading(true);
        try {
            const citaActualizada = await reservaService.rechazarCitaPeluquero(citaId);
            setCita(citaActualizada);
            mostrarSnackbar('Cita rechazada exitosamente.', 'success');
        } catch (err) {
            mostrarSnackbar(`Error al rechazar cita: ${err.message}`, 'error');
            console.error('Error rejecting appointment:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleVolver = () => {
        navigate('/peluquero/agenda');
    };

    const formatFechaHora = (fechaHora) => {
        return dayjs(fechaHora).locale('es').format('dddd, D [de] MMMM [de] YYYY [a las] HH:mm');
    };

    if (loading && !cita) {
        return (
            <Box className="detalle-cita-loading" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#d72a3c' }} />
            </Box>
        );
    }

    if (error && !cita) {
        return (
            <Box className="detalle-cita-error" sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleVolver}
                    sx={{ mt: 2 }}
                >
                    Volver a la Agenda
                </Button>
            </Box>
        );
    }

    if (!cita) {
        return (
            <Box className="detalle-cita-not-found" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Cita no encontrada o no se pudo cargar.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleVolver}
                    sx={{ mt: 2 }}
                >
                    Volver a la Agenda
                </Button>
            </Box>
        );
    }

    return (
        <motion.div
            className="detalle-cita-peluquero-root"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{ p: { xs: 3, md: 6 }, position: 'relative' }}
        >
            <IconButton 
                onClick={handleVolver}
                sx={{ 
                    position: 'absolute', 
                    top: { xs: 16, md: 24 },
                    left: { xs: 16, md: 24 },
                    color: '#d72a3c',
                    '&:hover': {
                        backgroundColor: 'rgba(215, 42, 60, 0.1)'
                    },
                    zIndex: 10,
                    p: 1
                }}
            >
                <ArrowBackIcon />
            </IconButton>

            <motion.div variants={titleVariants} sx={{ mt: { xs: 3, md: 4 } }}>
                <Box 
                    className="detalle-cita-header" 
                    sx={{ 
                        mb: 6, 
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                    }}
                >
                    <Typography 
                        variant="h3" 
                        className="detalle-cita-title" 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: 2,
                            color: '#d72a3c',
                            fontWeight: 600,
                            fontSize: '2.5rem', 
                            ml: { xs: 4, md: 0 },
                        }}
                    >
                        Detalle de Cita
                    </Typography>
                </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Box className="detalle-cita-content" sx={{ mb: 6 }}>
                    <motion.div variants={cardVariants} sx={{ mb: 6 }}>
                        <Paper 
                            elevation={2} 
                            className="detalle-cita-card-with-line"
                            sx={{ 
                                p: { xs: 4, md: 6 },
                                borderTop: '3px solid #d72a3c',
                                height: '100%'
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 3,
                                flexWrap: 'wrap',
                                gap: 2
                            }}>
                                <Typography variant="h5" sx={{ color: '#d72a3c', fontWeight: 600 }}>
                                    Cita #{cita.id}
                                </Typography>
                                <Chip
                                    icon={cita.confirmada ? <CheckCircleIcon /> : <InfoIcon />}
                                    label={cita.confirmada ? 'Confirmada' : 'Pendiente'}
                                    color={cita.confirmada ? 'success' : 'warning'}
                                    sx={{ 
                                        '& .MuiChip-icon': { color: 'inherit' },
                                        fontWeight: 500,
                                        px: 1.5
                                    }}
                                />
                            </Box>
                            <Divider sx={{ 
                                my: 4,
                                '&::before, &::after': {
                                    borderColor: 'rgba(215, 42, 60, 0.2)'
                                }
                            }} />

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Card 
                                        elevation={0}
                                        sx={{ 
                                            bgcolor: 'rgba(215, 42, 60, 0.05)',
                                            borderRadius: 2,
                                            p: 3
                                        }}
                                    >
                                        <CardContent sx={{ p: '0 !important' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                color="text.secondary" 
                                                gutterBottom
                                                sx={{ mb: 2, color: '#000' }}
                                            >
                                                INFORMACIÓN DEL CLIENTE
                                            </Typography>
                                            <Divider sx={{ 
                                                my: 2,
                                                '&::before, &::after': {
                                                    borderColor: 'rgba(215, 42, 60, 0.2)'
                                                }
                                            }} />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <PersonIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                                    <Typography variant="body1">
                                                        {cita.cliente?.nombre || 'Desconocido'}
                                                    </Typography>
                                                </Box>
                                                {cita.cliente?.telefono && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <PhoneIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                                        <Typography variant="body2">
                                                            {cita.cliente.telefono}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {cita.cliente?.email && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <EmailIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                                        <Typography variant="body2">
                                                            {cita.cliente.email}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card 
                                        elevation={0}
                                        sx={{ 
                                            bgcolor: 'rgba(215, 42, 60, 0.05)',
                                            borderRadius: 2,
                                            p: 3
                                        }}
                                    >
                                        <CardContent sx={{ p: '0 !important' }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                color="text.secondary" 
                                                gutterBottom
                                                sx={{ mb: 2, color: '#000' }}
                                            >
                                                DETALLES DE LA CITA
                                            </Typography>
                                            <Divider sx={{ 
                                                my: 2,
                                                '&::before, &::after': {
                                                    borderColor: 'rgba(215, 42, 60, 0.2)'
                                                }
                                            }} />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <CalendarIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                                    <Typography variant="body2">
                                                        {formatFechaHora(cita.fechaHora)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <SpaIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                                    <Typography variant="body1">
                                                        {cita.servicio?.nombre || 'N/D'}
                                                    </Typography>
                                                </Box>
                                                {cita.servicio?.duracion && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <AccessTimeIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                                        <Typography variant="body2">
                                                            Duración: {cita.servicio.duracion} minutos
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>

                    <motion.div variants={cardVariants} sx={{ mb: 4 }}>
                        <Paper 
                            elevation={2} 
                            className="detalle-cita-card-with-line"
                            sx={{ 
                                p: { xs: 3, md: 5 },
                                borderTop: '3px solid #d72a3c',
                                height: '100%'
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                gutterBottom 
                                sx={{ 
                                    color: '#000',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 2
                                }}
                            >
                                <StoreIcon sx={{ color: '#d72a3c', fontSize: '1.5rem' }} />
                                Información del Servicio
                            </Typography>
                            <Divider sx={{ 
                                my: 2,
                                '&::before, &::after': {
                                    borderColor: 'rgba(215, 42, 60, 0.2)'
                                }
                            }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {cita.servicio?.descripcion && (
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.6, mb: cita.servicio?.precio ? 2 : 0 }}
                                    >
                                        {cita.servicio.descripcion}
                                    </Typography>
                                )}
                                {cita.servicio?.precio && (
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            color: '#2e7d32', 
                                            fontWeight: 600,
                                            mt: cita.servicio?.descripcion ? 0 : 2
                                        }}
                                    >
                                        ${cita.servicio.precio.toFixed(2)}
                                    </Typography>
                                )}
                                {cita.notas && (
                                    <Box sx={{ mt: (cita.servicio?.descripcion || cita.servicio?.precio) ? 3 : 2 }}>
                                        <Typography 
                                            variant="subtitle2" 
                                            color="text.secondary" 
                                            gutterBottom
                                            sx={{ mb: 1.5 }}
                                        >
                                            Notas adicionales:
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                p: 2.5,
                                                bgcolor: 'rgba(0, 0, 0, 0.03)',
                                                borderRadius: 1,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {cita.notas}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </motion.div>

                    {!cita.confirmada && (
                        <Box sx={{ 
                            mt: 4,
                            mb: { xs: 3, md: 5 },
                            display: 'flex', 
                            gap: 3,
                            justifyContent: 'flex-end'
                        }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={handleRechazar}
                                disabled={actionLoading}
                                sx={{
                                    minWidth: 160,
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(215, 42, 60, 0.1)'
                                    }
                                }}
                            >
                                {actionLoading ? 'Rechazando...' : 'Rechazar'}
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={handleConfirmar}
                                disabled={actionLoading}
                                sx={{
                                    minWidth: 160,
                                    py: 1.5,
                                    backgroundColor: '#2e7d32',
                                    '&:hover': {
                                        backgroundColor: '#1b5e20'
                                    }
                                }}
                            >
                                {actionLoading ? 'Confirmando...' : 'Confirmar'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </motion.div>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={cerrarSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ mb: { xs: 3, md: 5 } }}
            >
                <MuiAlert 
                    onClose={cerrarSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ 
                        width: '100%',
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' ? '#2e7d32' : '#d72a3c'
                        }
                    }}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </motion.div>
    );
};

export default DetalleCitaPeluquero;