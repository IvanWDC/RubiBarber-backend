import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Paper, 
    Stepper, 
    Step, 
    StepLabel, 
    Box,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useReserva } from '../../context/ReservaContext';
import PasoServicio from '../../components/reserva/PasoServicio';
import PasoPeluquero from '../../components/reserva/PasoPeluquero';
import PasoFechaHora from '../../components/reserva/PasoFechaHora';
import PasoConfirmacion from '../../components/reserva/PasoConfirmacion';
import { reservaService } from '../../api/reservaService';

const pasos = [
    'Seleccionar Servicio',
    'Elegir Peluquero',
    'Fecha y Hora',
    'Confirmar'
];

const ReservaCita = () => {
    const { peluqueriaId } = useParams();
    const navigate = useNavigate();
    const { 
        pasoActual, 
        pasoAnterior, 
        siguientePaso,
        peluqueriaSeleccionada,
        setPeluqueriaSeleccionada
    } = useReserva();

    const [loadingPeluqueria, setLoadingPeluqueria] = useState(true);
    const [errorPeluqueria, setErrorPeluqueria] = useState(null);

    useEffect(() => {
        const cargarPeluqueria = async () => {
            if (peluqueriaId) {
                try {
                    setLoadingPeluqueria(true);
                    setErrorPeluqueria(null);
                    const peluqueriaData = await reservaService.getPeluqueriaById(peluqueriaId);
                    setPeluqueriaSeleccionada(peluqueriaData);
                    setLoadingPeluqueria(false);
                } catch (error) {
                    console.error('Error al cargar la peluquería por ID:', error);
                    setErrorPeluqueria('No se pudo cargar la información de la peluquería.');
                    setLoadingPeluqueria(false);
                }
            } else {
                setLoadingPeluqueria(false);
            }
        };

        cargarPeluqueria();
    }, [peluqueriaId, setPeluqueriaSeleccionada]);

    if (loadingPeluqueria) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (errorPeluqueria) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography color="error">{errorPeluqueria}</Typography>
            </Box>
        );
    }

    if (!peluqueriaSeleccionada) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography color="text.secondary">Por favor, selecciona una peluquería para comenzar la reserva.</Typography>
            </Box>
        );
    }

    const renderPaso = () => {
        switch (pasoActual) {
            case 0:
                return <PasoServicio />;
            case 1:
                return <PasoPeluquero />;
            case 2:
                return <PasoFechaHora />;
            case 3:
                return <PasoConfirmacion />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{
            backgroundColor: '#f5f5f5', // Fondo gris claro
            minHeight: '100vh', // Ocupar toda la altura de la pantalla
            display: 'flex',
            justifyContent: 'center', // Centrar horizontalmente
            alignItems: 'center', // Centrar verticalmente
            py: 4, // Padding vertical
        }}>
            <Container maxWidth="lg">
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Reserva tu Cita
                    </Typography>
                    
                    <Stepper activeStep={pasoActual} alternativeLabel sx={{ mb: 4 }}>
                        {pasos.map((label) => (
                            <Step key={label} completed={pasoActual > pasos.indexOf(label)}>
                                <StepLabel
                                    StepIconProps={{
                                        sx: {
                                            '&.Mui-completed': {
                                                color: '#d72a3c',
                                            },
                                            '&.Mui-active': {
                                                color: '#d72a3c',
                                            },
                                            color: pasoActual >= pasos.indexOf(label) ? '#d72a3c' : undefined,
                                        },
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pasoActual}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderPaso()}
                        </motion.div>
                    </AnimatePresence>

                    {pasoActual < 3 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/cliente/mapa')}
                                sx={{
                                    color: '#d72a3c',
                                    borderColor: '#d72a3c',
                                    '&:hover': {
                                        borderColor: '#c02534',
                                        backgroundColor: 'rgba(215, 42, 60, 0.04)',
                                    },
                                }}
                            >
                                Cancelar
                            </Button>
                            <Box>
                                {pasoActual > 0 && (
                                    <Button
                                        variant="outlined"
                                        onClick={pasoAnterior}
                                        sx={{
                                            mr: 1,
                                            color: '#d72a3c',
                                            borderColor: '#d72a3c',
                                            '&:hover': {
                                                borderColor: '#c02534',
                                                backgroundColor: 'rgba(215, 42, 60, 0.04)',
                                            },
                                        }}
                                    >
                                        Anterior
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={siguientePaso}
                                    disabled={pasoActual === 0 && !peluqueriaSeleccionada ||
                                        (pasoActual === 1 && !peluqueriaSeleccionada) ||
                                        (pasoActual === 2 && !peluqueriaSeleccionada)
                                    }
                                    sx={{
                                        backgroundColor: '#d72a3c',
                                        '&:hover': {
                                            backgroundColor: '#c02534',
                                        },
                                    }}
                                >
                                    {pasoActual === pasos.length - 2 ? 'Confirmar' : 'Siguiente'}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ReservaCita; 