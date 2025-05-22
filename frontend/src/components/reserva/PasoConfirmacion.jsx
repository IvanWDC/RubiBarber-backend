import { useState } from 'react';
import {
    Typography,
    Paper,
    Box,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import { useReserva } from '../../context/ReservaContext';
import { reservaService } from '../../api/reservaService';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import SpaIcon from '@mui/icons-material/Spa';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useAuth } from '../../context/AuthContext';

const PasoConfirmacion = () => {
    const {
        servicioSeleccionado,
        peluqueroSeleccionado,
        peluqueriaSeleccionada,
        fechaHoraSeleccionada,
        resetReserva
    } = useReserva();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [citaConfirmada, setCitaConfirmada] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleConfirmarCita = async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Ajustar la llamada a reservaService.crearCita para que coincida con el endpoint del backend (espera usuarioId, servicioId, peluqueroId en la URL y fechaHora en el body).
            // Necesitas obtener el usuarioId del usuario autenticado (probablemente del AuthContext).
            const usuarioId = user?.id;

            if (!usuarioId) {
                setError("No se pudo obtener la información del usuario autenticado.");
                setLoading(false);
                return;
            }

            const cita = await reservaService.crearCita(
                 usuarioId, // Pasar usuarioId como argumento
                 servicioSeleccionado.id,
                 peluqueroSeleccionado.id,
                 fechaHoraSeleccionada.toISOString() // Fecha y hora en el body (como espera el backend)
             );

            setCitaConfirmada(cita);
            setShowSuccessDialog(true);
        } catch (error) {
            setError(error.message);
            console.error('Error al crear la cita:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCerrarDialogo = () => {
        setShowSuccessDialog(false);
        resetReserva();
        navigate('/cliente/mis-citas');
    };

    const formatDateTime = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Typography variant="h6" gutterBottom>
                Confirma tu Reserva
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Detalles de la Reserva
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <StoreIcon sx={{ color: '#d72a3c' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Peluquería
                                    </Typography>
                                    <Typography variant="body1">
                                        {peluqueriaSeleccionada?.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {peluqueriaSeleccionada?.direccion}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SpaIcon sx={{ color: '#d72a3c' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Servicio
                                    </Typography>
                                    <Typography variant="body1">
                                        {servicioSeleccionado?.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Duración: {servicioSeleccionado?.duracion} minutos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Precio: {servicioSeleccionado?.precio}€
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: '#d72a3c' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Peluquero
                                    </Typography>
                                    <Typography variant="body1">
                                        {peluqueroSeleccionado?.nombre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {peluqueroSeleccionado?.especialidad}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccessTimeIcon sx={{ color: '#d72a3c' }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Fecha y Hora
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDateTime(fechaHoraSeleccionada)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Resumen
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Servicio
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d72a3c' }}>
                                    {servicioSeleccionado?.precio}€
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1">
                                    Total
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
                                    {servicioSeleccionado?.precio}€
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleConfirmarCita}
                                disabled={loading}
                                startIcon={<CheckCircleIcon />}
                                sx={{
                                    backgroundColor: '#d72a3c',
                                    '&:hover': {
                                        backgroundColor: '#c02534', // Un rojo un poco más oscuro para el hover
                                    },
                                }}
                            >
                                Confirmar Reserva
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={showSuccessDialog}
                onClose={handleCerrarDialogo}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    Reserva Confirmada
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Typography variant="body1">
                            Tu cita ha sido reservada exitosamente.
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ConfirmationNumberIcon color="primary" />
                            <Typography variant="body1">
                                Número de reserva: {citaConfirmada?.id}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Recibirás un correo electrónico con los detalles de tu reserva.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCerrarDialogo} color="primary">
                        Ver mis citas
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};

export default PasoConfirmacion; 