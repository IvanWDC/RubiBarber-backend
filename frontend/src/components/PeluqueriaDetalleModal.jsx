import React from 'react';
import { Modal, Box, Typography, Button, CardContent, CardActions, Rating, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PeluqueriaDetalleModal = ({ peluqueria, open, onClose }) => {
    const navigate = useNavigate();

    if (!peluqueria) {
        return null; // No renderizar si no hay peluquería seleccionada
    }

    const handleReservar = () => {
        // Navegar a la página de reserva, pasando el ID de la peluquería
        navigate(`/cliente/reserva/${peluqueria.id}`);
        onClose(); // Cerrar el modal al navegar
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="peluqueria-modal-title"
            aria-describedby="peluqueria-modal-description"
        >
            <Box sx={style}>
                <Typography id="peluqueria-modal-title" variant="h6" component="h2" gutterBottom>
                    {peluqueria.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {peluqueria.direccion}
                </Typography>

                {/* Sección de Valoración */}
                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>Valoración:</Typography>
                    <Rating value={peluqueria.valoracionMedia || 0} readOnly size="small" precision={0.5} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                         ({peluqueria.numValoraciones || 0} valoraciones)
                    </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />

                {/* Información de Servicios */}
                {peluqueria.servicios && peluqueria.servicios.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>Servicios Ofrecidos:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {peluqueria.servicios.map(servicio => (
                                <Chip key={servicio.id} label={servicio.nombre} size="small" variant="outlined" />
                            ))}
                        </Box>
                    </Box>
                )}

                <CardActions sx={{ justifyContent: 'space-between', px: 0, pb: 0, pt: 2 }}> {/* Añadir pt para separar del contenido */}
                    <Button onClick={onClose} variant="outlined">
                        Cerrar
                    </Button>
                    <Button variant="contained" color="error" onClick={handleReservar}>
                        Reservar Cita
                    </Button>
                </CardActions>
            </Box>
        </Modal>
    );
};

export default PeluqueriaDetalleModal; 