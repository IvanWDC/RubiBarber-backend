import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Select, MenuItem, FormControl, InputLabel, 
    Button, Paper, Grid, CircularProgress, Alert, Card, CardContent,
    Stack, TextField, IconButton, Divider, List, ListItem, 
    ListItemIcon, ListItemText, Switch, FormControlLabel
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Work as WorkIcon,
    Schedule as ScheduleIcon,
    EventNote as EventNoteIcon,
    Receipt as ReceiptIcon,
    Star as StarIcon,
    Spa as SpaIcon,
    Save as SaveIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import '../../styles/AdminDashboard.css';
import '../../styles/AdminSchedules.css';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Horas de ejemplo para los selectores (puedes ajustar según el horario de la peluquería)
const timeOptions = [];
for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) { // Intervalos de 30 minutos
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        timeOptions.push(`${hour}:${minute}`);
    }
}

const AdminSchedules = () => {
    const [peluqueros, setPeluqueros] = useState([]);
    const [selectedPeluquero, setSelectedPeluquero] = useState('');
    const [schedule, setSchedule] = useState({}); // { Lunes: { start: '09:00', end: '18:00' }, Martes: {...} }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedPeluqueroName, setSelectedPeluqueroName] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // TODO: Implementar useEffect para cargar la lista de peluqueros del admin
    useEffect(() => {
        const fetchPeluqueros = async () => {
            try {
                // Simulación de carga
                setLoading(true);
                // Aquí iría la llamada a la API para obtener los peluqueros de la peluquería del admin
                // const response = await api.getBarbersByAdminPeluqueria();
                // setPeluqueros(response.data);

                // Datos dummy mientras no hay backend
                const dummyPeluqueros = [
                    { id: 1, nombre: 'Juan Pérez' },
                    { id: 2, nombre: 'María García' },
                    { id: 3, nombre: 'Carlos Ruiz' },
                ];
                setPeluqueros(dummyPeluqueros);
                setLoading(false);

            } catch (err) {
                // setError('Error al cargar los peluqueros.');
                // console.error('Error fetching barbers:', err);
                setLoading(false);
            }
        };

        fetchPeluqueros();
    }, []);

    // TODO: Implementar useEffect para cargar el horario del peluquero seleccionado
    useEffect(() => {
        if (selectedPeluquero) {
            const fetchSchedule = async () => {
                try {
                    // Simulación de carga del horario
                    setLoading(true);
                    // Aquí iría la llamada a la API para obtener el horario del peluquero seleccionado
                    // const response = await api.getBarberSchedule(selectedPeluquero);
                    // setSchedule(response.data || getDefaultSchedule()); // Usar horario por defecto si no hay datos

                    // Datos dummy de horario (ejemplo: Lunes a Viernes 9-18)
                    const dummySchedule = getDefaultSchedule();
                    if(selectedPeluquero === 2) { // Ejemplo de horario diferente para María
                        dummySchedule.Sábado = { start: '10:00', end: '14:00' };
                        dummySchedule.Domingo = { start: '', end: '' }; // Domingo libre
                    }

                    setSchedule(dummySchedule);
                    setLoading(false);

                } catch (err) {
                    // setError('Error al cargar el horario.');
                    // console.error('Error fetching schedule:', err);
                    setLoading(false);
                    setSchedule(getDefaultSchedule()); // Cargar horario por defecto en caso de error
                }
            };
            fetchSchedule();
        } else {
            setSchedule({}); // Limpiar horario si no hay peluquero seleccionado
        }
    }, [selectedPeluquero]);

    useEffect(() => {
        if (selectedPeluquero) {
            const peluquero = peluqueros.find(p => p.id === selectedPeluquero);
            setSelectedPeluqueroName(peluquero?.nombre || '');
        }
    }, [selectedPeluquero, peluqueros]);

    const getDefaultSchedule = () => {
        const defaultSchedule = {};
        daysOfWeek.forEach(day => {
            // Horario por defecto: 9:00 a 18:00 de Lunes a Viernes, fin de semana libre
            if (day !== 'Sábado' && day !== 'Domingo') {
                defaultSchedule[day] = { start: '09:00', end: '18:00' };
            } else {
                defaultSchedule[day] = { start: '', end: '' };
            }
        });
        return defaultSchedule;
    };

    const handlePeluqueroChange = (event) => {
        setSelectedPeluquero(event.target.value);
    };

    const handleScheduleChange = (day, type, value) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: { 
                ...prevSchedule[day], 
                [type]: value,
                available: prevSchedule[day]?.available ?? true
            }
        }));
    };

    const handleAvailabilityChange = (day, available) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: { 
                ...prevSchedule[day],
                available,
                start: available ? prevSchedule[day]?.start || '09:00' : '',
                end: available ? prevSchedule[day]?.end || '18:00' : ''
            }
        }));
    };

    const handleSaveSchedule = async () => {
        if (!selectedPeluquero) {
            setError('Por favor, selecciona un peluquero primero.');
            return;
        }

        // Validación de horarios
        for (const day of daysOfWeek) {
            const daySchedule = schedule[day];
            if (daySchedule?.available && daySchedule.start && daySchedule.end) {
                if (daySchedule.start >= daySchedule.end) {
                    setError(`La hora de inicio debe ser anterior a la hora de fin para el ${day}`);
                    return;
                }
            }
        }

        setSaving(true);
        setError(null);

        try {
            // TODO: Implementar la llamada a la API
            console.log('Guardando horario:', schedule);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            setError('Error al guardar el horario.');
        } finally {
            setSaving(false);
        }
    };

    const handleCopyTemplate = () => {
        // TODO: Implementar la lógica para copiar plantilla
        alert('Funcionalidad "Copiar plantilla" pendiente de implementar.');
    };

    const sidebarItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Peluqueros', icon: <WorkIcon />, path: '/admin/barbers-services' },
        { text: 'Servicios', icon: <SpaIcon />, path: '/admin/barbers-services?tab=servicios' }, // Enlazar a la pestaña de servicios
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/admin/schedules', active: true }, // Marcado como activo
        { text: 'Facturación', icon: <ReceiptIcon />, path: '/admin/invoices' },
        { text: 'Valoraciones', icon: <StarIcon />, path: '/admin/ratings' },
    ];

    return (
        <Box className="admin-dashboard-container">
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
                    {sidebarItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
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
            <Box className="admin-dashboard-main-content">
                <Box className="admin-dashboard-topbar">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d72a3c' }}>Gestión de Horarios</Typography>
                </Box>

                <Divider />

                <Box className="admin-dashboard-content-area admin-schedules-content-area">
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3, 
                            mb: 4, 
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            '& .MuiTypography-root': {
                                color: 'text.primary'
                            },
                            '& .MuiFormControlLabel-label': {
                                color: 'text.primary'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary'
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#d72a3c'
                                }
                            },
                            '& .MuiInputBase-input': {
                                color: 'text.primary'
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'text.secondary'
                            }
                        }}
                    >
                        <Stack spacing={3}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#d72a3c' }}>
                                Selecciona un Peluquero
                            </Typography>
                            <FormControl variant="outlined" sx={{ minWidth: 200, maxWidth: 300 }}>
                                <InputLabel>Peluquero</InputLabel>
                                <Select
                                    value={selectedPeluquero}
                                    onChange={handlePeluqueroChange}
                                    label="Peluquero"
                                >
                                    <MenuItem value="">Selecciona un peluquero</MenuItem>
                                    {peluqueros.map((peluquero) => (
                                        <MenuItem key={peluquero.id} value={peluquero.id}>
                                            {peluquero.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <AnimatePresence>
                                {selectedPeluquero && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card sx={{ 
                                            mb: 3,
                                            backgroundColor: '#d72a3c',
                                            '& .MuiCardContent-root': {
                                                p: 3
                                            }
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom sx={{ 
                                                    color: '#212121',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    fontWeight: 'bold'
                                                }}>
                                                    <AccessTimeIcon />
                                                    Horarios de {selectedPeluqueroName}
                                                </Typography>
                                                
                                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                                    {daysOfWeek.map((day) => (
                                                        <Grid item xs={12} key={day}>
                                                            <Paper 
                                                                elevation={1} 
                                                                sx={{ 
                                                                    p: 2,
                                                                    backgroundColor: '#2a2a2a',
                                                                    border: '1px solid #d72a3c',
                                                                    boxShadow: '0 2px 4px rgba(215, 42, 60, 0.2)',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(215, 42, 60, 0.08)'
                                                                    }
                                                                }}
                                                            >
                                                                <Stack 
                                                                    direction="row" 
                                                                    spacing={2} 
                                                                    alignItems="center"
                                                                    justifyContent="space-between"
                                                                >
                                                                    <Typography variant="subtitle1" sx={{ 
                                                                        minWidth: 100,
                                                                        fontWeight: 'bold',
                                                                        color: '#ffffff'
                                                                    }}>
                                                                        {day}
                                                                    </Typography>
                                                                    
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={schedule[day]?.available ?? true}
                                                                                onChange={(e) => handleAvailabilityChange(day, e.target.checked)}
                                                                                color="primary"
                                                                                sx={{
                                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                                        color: '#d72a3c',
                                                                                        '& + .MuiSwitch-track': {
                                                                                            backgroundColor: '#d72a3c'
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            />
                                                                        }
                                                                        label="Disponible"
                                                                        sx={{ '& .MuiFormControlLabel-label': { color: '#ffffff' } }}
                                                                    />

                                                                    {schedule[day]?.available && (
                                                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                                <TimePicker
                                                                                    label="Entrada"
                                                                                    value={schedule[day]?.start ? new Date(`2000-01-01T${schedule[day].start}`) : null}
                                                                                    onChange={(newValue) => handleScheduleChange(day, 'start', newValue ? newValue.toTimeString().slice(0, 5) : '')}
                                                                                    slotProps={{
                                                                                        textField: {
                                                                                            size: 'small',
                                                                                            sx: {
                                                                                                '& .MuiInputLabel-root': {
                                                                                                    color: '#ffffff'
                                                                                                },
                                                                                                '& .MuiOutlinedInput-root': {
                                                                                                    '& fieldset': {
                                                                                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                                                                                    },
                                                                                                    '&:hover fieldset': {
                                                                                                        borderColor: '#ffffff'
                                                                                                    },
                                                                                                    '&.Mui-focused fieldset': {
                                                                                                        borderColor: '#d72a3c'
                                                                                                    },
                                                                                                    '& .MuiInputBase-input': {
                                                                                                        color: '#ffffff'
                                                                                                    },
                                                                                                    '& .MuiSvgIcon-root': {
                                                                                                        color: '#ffffff'
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <Typography sx={{ color: '#ffffff' }}>-</Typography>
                                                                                <TimePicker
                                                                                    label="Salida"
                                                                                    value={schedule[day]?.end ? new Date(`2000-01-01T${schedule[day].end}`) : null}
                                                                                    onChange={(newValue) => handleScheduleChange(day, 'end', newValue ? newValue.toTimeString().slice(0, 5) : '')}
                                                                                    slotProps={{
                                                                                        textField: {
                                                                                            size: 'small',
                                                                                            sx: {
                                                                                                '& .MuiInputLabel-root': {
                                                                                                    color: '#ffffff'
                                                                                                },
                                                                                                '& .MuiOutlinedInput-root': {
                                                                                                    '& fieldset': {
                                                                                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                                                                                    },
                                                                                                    '&:hover fieldset': {
                                                                                                        borderColor: '#ffffff'
                                                                                                    },
                                                                                                    '&.Mui-focused fieldset': {
                                                                                                        borderColor: '#d72a3c'
                                                                                                    },
                                                                                                    '& .MuiInputBase-input': {
                                                                                                        color: '#ffffff'
                                                                                                    },
                                                                                                    '& .MuiSvgIcon-root': {
                                                                                                        color: '#ffffff'
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </Stack>
                                                                        </LocalizationProvider>
                                                                    )}
                                                                </Stack>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>

                                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        startIcon={<SaveIcon />}
                                                        onClick={handleSaveSchedule}
                                                        disabled={saving}
                                                        sx={{
                                                            minWidth: 200,
                                                            py: 1.5,
                                                            backgroundColor: '#d72a3c',
                                                            color: '#ffffff',
                                                            '&:hover': {
                                                                backgroundColor: '#b51f2e'
                                                            },
                                                            '&.Mui-disabled': {
                                                                backgroundColor: 'rgba(215, 42, 60, 0.5)',
                                                                color: 'rgba(255, 255, 255, 0.7)'
                                                            }
                                                        }}
                                                    >
                                                        {saving ? <CircularProgress size={24} color="inherit" /> : 'Guardar Disponibilidad'}
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                            )}

                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        Horario guardado correctamente
                                    </Alert>
                                </motion.div>
                            )}
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminSchedules; 