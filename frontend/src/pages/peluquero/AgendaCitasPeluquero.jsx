import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Grid,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { reservaService } from '../../api/reservaService';
import '../../styles/AgendaCitasPeluquero.css';
import {
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

// Importaciones para el calendario
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const AgendaCitasPeluquero = () => {
    const [peluquero, setPeluquero] = useState(null);
    const [citas, setCitas] = useState([]);
    const [citasDelDia, setCitasDelDia] = useState([]);
    const [ultimasCitas, setUltimasCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [perfilData, citasData] = await Promise.all([
                    reservaService.getPerfilPeluquero(),
                    reservaService.getMisCitasPeluquero()
                ]);

                setPeluquero(perfilData);
                setCitas(citasData);
                
                // Ordenar citas por fecha y tomar las 10 más recientes
                const citasOrdenadas = [...citasData].sort((a, b) => 
                    new Date(b.fechaHora) - new Date(a.fechaHora)
                ).slice(0, 10);
                setUltimasCitas(citasOrdenadas);

            } catch (err) {
                setError('Error al cargar los datos de la agenda.');
                console.error('Error fetching barber agenda data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (fechaSeleccionada && citas.length > 0) {
            const fechaInicioDia = fechaSeleccionada.startOf('day');
            const fechaFinDia = fechaSeleccionada.endOf('day');

            const citasFiltradas = citas.filter(cita => {
                const fechaCita = dayjs(cita.fechaHora);
                return fechaCita.isAfter(fechaInicioDia) && fechaCita.isBefore(fechaFinDia);
            });
            setCitasDelDia(citasFiltradas);
        } else {
            setCitasDelDia([]);
        }
    }, [fechaSeleccionada, citas]);

    const handleVerDetalle = (cita) => {
        navigate(`/peluquero/citas/${cita.id}`, { state: { cita } });
    };

    const formatFechaHora = (fechaHora) => {
        return dayjs(fechaHora).format('HH:mm');
    };

    const formatFechaCompleta = (fechaHora) => {
        return dayjs(fechaHora).locale('es').format('dddd, D [de] MMMM [de] YYYY');
    };

    if (loading) {
        return (
            <Box className="agenda-peluquero-loading">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="agenda-peluquero-root" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            </Box>
        );
    }

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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">

            {/* Contenido principal */}
            <motion.div
                className="agenda-peluquero-root"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={titleVariants}>
                    <Box className="agenda-peluquero-header">
                        <Typography variant="h3" className="agenda-peluquero-title">
                            Agenda del Peluquero
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Box className="agenda-peluquero-content">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <Paper 
                                        elevation={2} 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            borderTop: '3px solid #d72a3c'
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            color: '#000',
                                            fontWeight: 600
                                        }}>
                                            <CalendarIcon sx={{ color: '#d72a3c' }} />
                                            Selecciona una fecha
                                        </Typography>
                                        <DatePicker
                                            label="Fecha"
                                            value={fechaSeleccionada}
                                            onChange={(newValue) => setFechaSeleccionada(newValue)}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    fullWidth 
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': {
                                                                borderColor: '#d72a3c'
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Paper>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <motion.div variants={cardVariants}>
                                    <Paper 
                                        elevation={2} 
                                        sx={{ 
                                            p: 3,
                                            borderTop: '3px solid #d72a3c'
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            color: '#000',
                                            fontWeight: 600
                                        }}>
                                            <EventNoteIcon sx={{ color: '#d72a3c' }} />
                                            Citas del {formatFechaCompleta(fechaSeleccionada)}
                                        </Typography>
                                        <Divider sx={{ 
                                            my: 2,
                                            '&::before, &::after': {
                                                borderColor: 'rgba(215, 42, 60, 0.2)'
                                            }
                                        }} />

                                        <AnimatePresence mode="wait">
                                            {citasDelDia.length === 0 ? (
                                                <motion.div
                                                    key="no-citas"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Box className="agenda-no-citas">
                                                        <InfoIcon className="agenda-no-citas-icon" />
                                                        <Typography variant="h6" color="text.secondary" align="center">
                                                            No hay citas programadas para esta fecha
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" align="center">
                                                            Selecciona otro día o espera nuevas reservas
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                            ) : (
                                                <Box className="agenda-citas-lista">
                                                    {citasDelDia.map((cita, index) => (
                                                        <motion.div
                                                            key={cita.id}
                                                            variants={cardVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            whileHover="hover"
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <Paper
                                                                elevation={1}
                                                                className="agenda-cita-item"
                                                                onClick={() => handleVerDetalle(cita)}
                                                                sx={{ p: 2.5, cursor: 'pointer' }}
                                                            >
                                                                <Grid container spacing={2} alignItems="center">
                                                                    <Grid item xs={12} sm={7}>
                                                                        <Typography className="agenda-cliente-nombre">
                                                                            {cita.cliente?.nombre || 'Cliente no especificado'}
                                                                        </Typography>
                                                                        <Typography className="agenda-servicio-nombre">
                                                                            {cita.servicio?.nombre || 'Servicio no especificado'}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={5}>
                                                                        <Box className="agenda-fecha-hora">
                                                                            <AccessTimeIcon fontSize="small" sx={{ color: '#d72a3c' }} />
                                                                            <Typography variant="body2">
                                                                                {formatFechaHora(cita.fechaHora)}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Chip
                                                                            icon={cita.confirmada ? <CheckCircleIcon /> : <PendingIcon />}
                                                                            label={cita.confirmada ? 'Confirmada' : 'Pendiente'}
                                                                            className={`agenda-status-badge ${cita.confirmada ? 'confirmada' : 'pendiente'}`}
                                                                            size="small"
                                                                            sx={{ mt: 1 }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Paper>
                                                        </motion.div>
                                                    ))}
                                                </Box>
                                            )}
                                        </AnimatePresence>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        </Grid>

                        <motion.div 
                            className="agenda-ultimas-citas"
                            variants={itemVariants}
                        >
                            <Paper 
                                elevation={2} 
                                sx={{ 
                                    p: 3, 
                                    mt: 4,
                                    background: 'linear-gradient(to bottom, #fff, #fafafa)',
                                    borderTop: '3px solid #d72a3c'
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    color: '#000',
                                    fontWeight: 600
                                }}>
                                    <EventNoteIcon sx={{ color: '#d72a3c' }} />
                                    Últimas citas asignadas
                                </Typography>
                                <Divider sx={{ 
                                    my: 2,
                                    '&::before, &::after': {
                                        borderColor: 'rgba(215, 42, 60, 0.2)'
                                    }
                                }} />

                                <Grid container spacing={3} className="agenda-ultimas-citas-grid">
                                    {ultimasCitas.length === 0 ? (
                                        <Grid item xs={12}>
                                            <Alert 
                                                severity="info" 
                                                sx={{ 
                                                    mt: 2,
                                                    '& .MuiAlert-icon': {
                                                        color: '#d72a3c'
                                                    }
                                                }}
                                            >
                                                No hay citas recientes para mostrar
                                            </Alert>
                                        </Grid>
                                    ) : (
                                        ultimasCitas.map((cita, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={cita.id}>
                                                <motion.div
                                                    variants={cardVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover="hover"
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Card 
                                                        elevation={2}
                                                        sx={{ 
                                                            height: '100%',
                                                            cursor: 'pointer',
                                                            borderTop: '2px solid #d72a3c',
                                                            '&:hover': {
                                                                boxShadow: '0 8px 24px rgba(215, 42, 60, 0.12)'
                                                            }
                                                        }}
                                                        onClick={() => handleVerDetalle(cita)}
                                                    >
                                                        <CardContent sx={{ p: 2.5 }}>
                                                            <Typography className="agenda-cliente-nombre">
                                                                {cita.cliente?.nombre || 'Cliente no especificado'}
                                                            </Typography>
                                                            <Typography className="agenda-servicio-nombre">
                                                                {cita.servicio?.nombre || 'Servicio no especificado'}
                                                            </Typography>
                                                            <Box className="agenda-fecha-hora">
                                                                <AccessTimeIcon fontSize="small" sx={{ color: '#d72a3c' }} />
                                                                <Typography variant="body2">
                                                                    {formatFechaCompleta(cita.fechaHora)}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                icon={cita.confirmada ? <CheckCircleIcon /> : <PendingIcon />}
                                                                label={cita.confirmada ? 'Confirmada' : 'Pendiente'}
                                                                className={`agenda-status-badge ${cita.confirmada ? 'confirmada' : 'pendiente'}`}
                                                                size="small"
                                                                sx={{ mt: 1.5 }}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            </Paper>
                        </motion.div>
                    </Box>
                </motion.div>
            </motion.div>
        </LocalizationProvider>
    );
};

export default AgendaCitasPeluquero; 