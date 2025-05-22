import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';
import {
  Box, Typography, Paper, Button, Snackbar, IconButton, CircularProgress, Divider, Avatar
} from '@mui/material';
import {
  EventAvailable, EventBusy, CheckCircle, Cancel, Person, AccessTime, Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MisCitasCliente.css';

const MisCitasCliente = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mis Citas | Rubí Barber';
    fetchCitas();
    // eslint-disable-next-line
  }, []);

  const fetchCitas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/cliente/mis-citas');
      setCitas(res.data);
    } catch (err) {
      setError('Error al cargar tus citas.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    setCancelingId(id);
    try {
      await API.delete(`/citas/${id}`);
      setCitas((prev) => prev.filter((cita) => cita.id !== id));
    } catch (err) {
      setError('No se pudo cancelar la cita.');
      setSnackbarOpen(true);
    } finally {
      setCancelingId(null);
    }
  };

  const now = new Date();
  const citasFuturas = citas.filter((cita) => new Date(cita.fechaHora) > now);
  const citasPasadas = citas.filter((cita) => new Date(cita.fechaHora) <= now);

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora);
    return date.toLocaleString('es-ES', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Box className="mis-citas-root">
      <Box className="mis-citas-header">
        <Box
          className="mis-citas-logo-circle"
          sx={{
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
            transition: 'opacity 0.3s ease',
          }}
          onClick={() => navigate('/cliente/dashboard')}
        >
          <img
            src="/logo.png"
            alt="Rubí Barber"
            className="mis-citas-logo"
          />
        </Box>
        <Typography variant="h4" className="mis-citas-title">Mis Citas</Typography>
      </Box>

      <Box className="mis-citas-content-outer">
        <Box className="mis-citas-content">
          {loading ? (
            <Box className="mis-citas-loading"><CircularProgress /></Box>
          ) : (
            <>
              <Typography variant="h6" className="mis-citas-block-title">
                Próximas citas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <AnimatePresence>
                {citasFuturas.length === 0 ? (
                  <motion.div
                    key="no-futuras"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
                      No tienes citas futuras aún.
                    </Typography>
                  </motion.div>
                ) : (
                  citasFuturas.map((cita) => (
                    <motion.div
                      key={cita.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Paper className="mis-citas-cita-card" elevation={3}>
                        <Box className="mis-citas-cita-info">
                          <Avatar sx={{ bgcolor: '#d72a3c', mr: 2 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography className="mis-citas-servicio">{cita.servicio?.nombre || 'Servicio'}</Typography>
                            <Typography className="mis-citas-peluquero">
                              <Person sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                              {cita.peluquero?.nombre || 'N/D'}
                            </Typography>
                            <Typography className="mis-citas-fecha-hora">
                              <AccessTime sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                              {formatFechaHora(cita.fechaHora)}
                            </Typography>
                          </Box>
                          <Box className="mis-citas-estado">
                            {cita.confirmada ? (
                              <CheckCircle color="success" sx={{ mr: 0.5 }} />
                            ) : (
                              <Cancel color="warning" sx={{ mr: 0.5 }} />
                            )}
                            <Typography variant="caption">
                              {cita.confirmada ? 'Confirmada' : 'Pendiente'}
                            </Typography>
                          </Box>
                        </Box>
                        {!cita.confirmada && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            className="mis-citas-cancel-btn"
                            onClick={() => handleCancelar(cita.id)}
                            disabled={cancelingId === cita.id}
                          >
                            {cancelingId === cita.id ? 'Cancelando...' : 'Cancelar'}
                          </Button>
                        )}
                      </Paper>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              <Typography variant="h6" className="mis-citas-block-title" sx={{ mt: 5 }}>
                Citas pasadas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <AnimatePresence>
                {citasPasadas.length === 0 ? (
                  <motion.div
                    key="no-pasadas"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Typography align="center" color="text.secondary">
                      No tienes citas pasadas.
                    </Typography>
                  </motion.div>
                ) : (
                  citasPasadas.map((cita) => (
                    <motion.div
                      key={cita.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Paper className="mis-citas-cita-card" elevation={2}>
                        <Box className="mis-citas-cita-info">
                          <Avatar sx={{ bgcolor: '#bdbdbd', mr: 2 }}>
                            <EventBusy />
                          </Avatar>
                          <Box>
                            <Typography className="mis-citas-servicio">{cita.servicio?.nombre || 'Servicio'}</Typography>
                            <Typography className="mis-citas-peluquero">
                              <Person sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                              {cita.peluquero?.nombre || 'N/D'}
                            </Typography>
                            <Typography className="mis-citas-fecha-hora">
                              <AccessTime sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                              {formatFechaHora(cita.fechaHora)}
                            </Typography>
                          </Box>
                          <Box className="mis-citas-estado">
                            {cita.confirmada ? (
                              <CheckCircle color="success" sx={{ mr: 0.5 }} />
                            ) : (
                              <Cancel color="warning" sx={{ mr: 0.5 }} />
                            )}
                            <Typography variant="caption">
                              {cita.confirmada ? 'Confirmada' : 'Pendiente'}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        message={error}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default MisCitasCliente;
