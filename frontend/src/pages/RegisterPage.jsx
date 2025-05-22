import { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material'
import API from '../api/client'
import { useNavigate } from 'react-router-dom'
import '../styles/RegisterPage.css'

const RegisterPage = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await API.post('/auth/register', {
        nombre,
        email,
        password,
        rol: 'CLIENTE',
      })

      setSuccess('Registro exitoso. Ya puedes iniciar sesión.')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data || 'Error al registrarse.')
    }
  }

  return (
    <div className="register-container">
      <Paper elevation={6} className="register-box">
        <Box className="register-header">
          <div className="register-logo-circle">
            <div className="register-logo-inner">
              <img src="/logo.png" alt="Rubí Barber" className="register-logo" />
            </div>
          </div>
          <Typography variant="h4" className="register-title">
            Crear cuenta
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleRegister} className="register-form">
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            className="register-button"
          >
            Registrarse
          </Button>
        </Box>

        <Box className="register-link-back">
          <Typography variant="body2" align="center">
            ¿Ya tienes cuenta?{' '}
            <span className="register-link" onClick={() => navigate('/')}>
              Inicia sesión
            </span>
          </Typography>
        </Box>
      </Paper>
    </div>
  )
}

export default RegisterPage
