import { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    CircularProgress,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useReserva } from '../../context/ReservaContext';
import { reservaService } from '../../api/reservaService';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { es } from 'date-fns/locale/es';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PasoFechaHora = () => {
    const {
        peluqueroSeleccionado,
        fechaHoraSeleccionada,
        setFechaHoraSeleccionada,
        siguientePaso,
        servicioSeleccionado
    } = useReserva();

    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        const cargarHorarios = async () => {
            if (!peluqueroSeleccionado) {
                setError('No se ha seleccionado un peluquero');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await reservaService.getHorariosDisponibles(
                    peluqueroSeleccionado.id,
                    selectedDate
                );
                setHorariosDisponibles(data);
            } catch (error) {
                setError(error.message);
                console.error('Error al cargar horarios:', error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedDate) {
            cargarHorarios();
        }
    }, [peluqueroSeleccionado, selectedDate]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        setSelectedTime(null);
        setFechaHoraSeleccionada(null);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        const fechaHora = new Date(selectedDate);
        fechaHora.setHours(time.getHours(), time.getMinutes());
        setFechaHoraSeleccionada(fechaHora);
        setTimeout(siguientePaso, 500);
    };

    const isDateDisabled = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const formatTime = (time) => {
        return time.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && selectedDate) {
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
                Selecciona Fecha y Hora
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon sx={{ color: '#d72a3c' }} />
                                Selecciona una fecha
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    shouldDisableDate={isDateDisabled}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: "outlined"
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        {selectedDate && (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTimeIcon sx={{ color: '#d72a3c' }} />
                                    Horarios disponibles
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {horariosDisponibles.length > 0 ? (
                                        horariosDisponibles.map((horario) => (
                                            <Chip
                                                key={horario}
                                                label={formatTime(new Date(horario))}
                                                onClick={() => handleTimeSelect(new Date(horario))}
                                                color={selectedTime?.getTime() === new Date(horario).getTime() ? "primary" : "default"}
                                                variant={selectedTime?.getTime() === new Date(horario).getTime() ? "filled" : "outlined"}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderColor: selectedTime?.getTime() === new Date(horario).getTime() ? '#d72a3c' : undefined,
                                                    '&:hover': {
                                                        backgroundColor: selectedTime?.getTime() === new Date(horario).getTime() ? '#d72a3c' : 'primary.light',
                                                        color: selectedTime?.getTime() === new Date(horario).getTime() ? 'white' : 'inherit',
                                                        borderColor: '#d72a3c',
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography color="text.secondary">
                                            No hay horarios disponibles para esta fecha
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Resumen de la reserva
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Servicio
                                </Typography>
                                <Typography variant="body1">
                                    {servicioSeleccionado?.nombre}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Peluquero
                                </Typography>
                                <Typography variant="body1">
                                    {peluqueroSeleccionado?.nombre}
                                </Typography>
                            </Box>
                            {fechaHoraSeleccionada && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Fecha y hora seleccionada
                                    </Typography>
                                    <Typography variant="body1">
                                        {fechaHoraSeleccionada.toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {' a las '}
                                        {formatTime(fechaHoraSeleccionada)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </motion.div>
    );
};

export default PasoFechaHora; 