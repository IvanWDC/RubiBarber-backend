import { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await loginUser(email, password)
      login(data.token, data.rol)

      // Redirigir directamente según el rol
      if (data.rol === 'CLIENTE') navigate('/cliente/dashboard') // Redirigir a la ruta específica del dashboard de cliente
      else if (data.rol === 'PELUQUERO') navigate('/peluquero/agenda') // Redirigir a la ruta específica de la agenda de peluquero
      else if (data.rol === 'ADMIN') navigate('/admin/dashboard') // TODO: Asegúrate de tener una ruta y componente para el dashboard de admin
      else setError('Rol desconocido')

    } catch (err) {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Paper elevation={6} className="login-box">
        <Box className="login-header">
          <div className="login-logo-circle">
            <div className="login-logo-inner">
              <img src="/logo.png" alt="Rubí Barber" className="login-logo" />
            </div>
          </div>
          <Typography variant="h4" className="login-title">
            Rubí Barber
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} className="login-form">
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
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>

        <Box className="login-register-link">
          <Typography variant="body2" align="center">
            ¿No tienes cuenta?{' '}
            <span className="register-link" onClick={() => navigate('/registro')}>
              Regístrate
            </span>
          </Typography>
        </Box>
      </Paper>
    </div>
  )
}

export default LoginPage
