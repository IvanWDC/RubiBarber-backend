import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Snackbar, IconButton } from '@mui/material';
import { ContentCut, Face, Palette, Wash, AllInclusive, CalendarToday, LocationOn, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardCliente.css';

const categorias = [
  { key: 'Todos', label: 'Todos' },
  { key: 'Cortes', label: 'Cortes' },
  { key: 'Barba', label: 'Barba' },
  { key: 'Color', label: 'Color' },
  { key: 'Lavados', label: 'Lavados' },
];

const servicios = [
  {
    id: 1,
    nombre: 'Corte de pelo',
    precio: '12€',
    duracion: '30min',
    categoria: 'Cortes',
    icono: <ContentCut sx={{ fontSize: 32 }} />,
  },
  {
    id: 2,
    nombre: 'Corte y barba',
    precio: '18€',
    duracion: '45min',
    categoria: 'Cortes',
    icono: <ContentCut sx={{ fontSize: 32 }} />,
  },
  {
    id: 3,
    nombre: 'Solo barba',
    precio: '10€',
    duracion: '20min',
    categoria: 'Barba',
    icono: <Face sx={{ fontSize: 32 }} />,
  },
  {
    id: 4,
    nombre: 'Arreglo de barba',
    precio: '13€',
    duracion: '25min',
    categoria: 'Barba',
    icono: <Face sx={{ fontSize: 32 }} />,
  },
  {
    id: 5,
    nombre: 'Coloración',
    precio: '35€',
    duracion: '60min',
    categoria: 'Color',
    icono: <Palette sx={{ fontSize: 32 }} />,
  },
  {
    id: 6,
    nombre: 'Mechas',
    precio: '40€',
    duracion: '70min',
    categoria: 'Color',
    icono: <Palette sx={{ fontSize: 32 }} />,
  },
  {
    id: 7,
    nombre: 'Lavado y peinado',
    precio: '15€',
    duracion: '30min',
    categoria: 'Lavados',
    icono: <Wash sx={{ fontSize: 32 }} />,
  },
  {
    id: 8,
    nombre: 'Tratamiento capilar',
    precio: '25€',
    duracion: '45min',
    categoria: 'Lavados',
    icono: <Wash sx={{ fontSize: 32 }} />,
  },
  {
    id: 9,
    nombre: 'Combo completo',
    precio: '45€',
    duracion: '90min',
    categoria: 'Cortes',
    icono: <AllInclusive sx={{ fontSize: 32 }} />,
  },
  {
    id: 10,
    nombre: 'Diseño de barba',
    precio: '15€',
    duracion: '25min',
    categoria: 'Barba',
    icono: <Face sx={{ fontSize: 32 }} />,
  },
  {
    id: 11,
    nombre: 'Afeitado tradicional',
    precio: '20€',
    duracion: '30min',
    categoria: 'Barba',
    icono: <Face sx={{ fontSize: 32 }} />,
  },
  {
    id: 12,
    nombre: 'Tinte de barba',
    precio: '25€',
    duracion: '40min',
    categoria: 'Color',
    icono: <Palette sx={{ fontSize: 32 }} />,
  },
  {
    id: 13,
    nombre: 'Corte degradado',
    precio: '15€',
    duracion: '35min',
    categoria: 'Cortes',
    icono: <ContentCut sx={{ fontSize: 32 }} />,
  },
  {
    id: 14,
    nombre: 'Corte clásico',
    precio: '14€',
    duracion: '30min',
    categoria: 'Cortes',
    icono: <ContentCut sx={{ fontSize: 32 }} />,
  },
  {
    id: 15,
    nombre: 'Tratamiento anti-caída',
    precio: '30€',
    duracion: '45min',
    categoria: 'Lavados',
    icono: <Wash sx={{ fontSize: 32 }} />,
  },
  {
    id: 16,
    nombre: 'Masaje capilar',
    precio: '18€',
    duracion: '25min',
    categoria: 'Lavados',
    icono: <Wash sx={{ fontSize: 32 }} />,
  },
  {
    id: 17,
    nombre: 'Corte + Barba + Tratamiento',
    precio: '50€',
    duracion: '90min',
    categoria: 'Cortes',
    icono: <AllInclusive sx={{ fontSize: 32 }} />,
  },
  {
    id: 18,
    nombre: 'Corte + Coloración',
    precio: '45€',
    duracion: '75min',
    categoria: 'Color',
    icono: <AllInclusive sx={{ fontSize: 32 }} />,
  }
];

const DashboardCliente = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const navigate = useNavigate();

  const filtrarServicios = () => {
    if (categoriaSeleccionada === 'Todos') return servicios;
    return servicios.filter((s) => s.categoria === categoriaSeleccionada);
  };

  const handleReserva = (nombre) => {
    setSnackbarMsg(`¡Has solicitado reservar: ${nombre}!`);
    setSnackbarOpen(true);
  };

  return (
    <Box className="dashboard-nuevo-container">
      {/* Cabecera */}
      <Box className="dashboard-nuevo-header">
        <Box className="dashboard-nuevo-logo-circle">
          <img src="/logo.png" alt="Rubí Barber" className="dashboard-nuevo-logo" />
        </Box>
        <Button
          className="dashboard-nuevo-citas-btn"
          startIcon={<CalendarToday />}
          onClick={() => navigate('/cliente/mis-citas')}
        >
          Mis Citas
        </Button>
      </Box>

      {/* Hero */}
      <Box className="dashboard-nuevo-hero" sx={{ gap: { xs: 2, md: 3 } }}>
        <Typography variant="h3" className="dashboard-nuevo-hero-title" style={{ fontWeight: 900 }}>
          Reserva tu Cita en un Clic
        </Typography>
        <Button
          className="dashboard-nuevo-mapa-btn"
          startIcon={<LocationOn />}
          onClick={() => navigate('/cliente/mapa')}
        >
          Ver en mapa
        </Button>

      </Box>

      {/* Categorías */}
      <Box className="dashboard-nuevo-categorias">
        {categorias.map((cat) => (
          <Button
            key={cat.key}
            className={`dashboard-nuevo-categoria-btn${categoriaSeleccionada === cat.key ? ' active' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </Box>

      {/* Servicios */}
      <Grid container spacing={3} justifyContent="center" alignItems="stretch" className="dashboard-nuevo-servicios">
        {filtrarServicios().map((servicio) => (
          <Grid item key={servicio.id} xs={12} sm={6} md={3} style={{ display: 'flex' }}>
            <Paper className="dashboard-nuevo-servicio-card" elevation={3}>
              <Box className="dashboard-nuevo-servicio-icono">{servicio.icono}</Box>
              <Typography variant="h6" className="dashboard-nuevo-servicio-nombre">{servicio.nombre}</Typography>
              <Typography variant="body2" className="dashboard-nuevo-servicio-detalle">
                {servicio.precio} · {servicio.duracion}
              </Typography>
              <Button
                fullWidth
                className="dashboard-nuevo-reserva-btn"
                onClick={() => handleReserva(servicio.nombre)}
              >
                Reserva
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default DashboardCliente;
