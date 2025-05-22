import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardCliente from './pages/DashboardCliente';
import MapaPeluquerias from './pages/MapaPeluquerias';
import ReservaCita from './pages/cliente/ReservaCita';
import MisCitasCliente from './pages/MisCitasCliente';
import PrivateRoute from './components/PrivateRoute';

// Importar las nuevas páginas de Peluquero
import AgendaCitasPeluquero from './pages/peluquero/AgendaCitasPeluquero';
import DetalleCitaPeluquero from './pages/peluquero/DetalleCitaPeluquero';

// Importar la página del Dashboard de Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBarbersServices from './pages/admin/AdminBarbersServices';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminRatings from './pages/admin/AdminRatings';

import { AuthProvider } from './context/AuthContext';
import { ReservaProvider } from './context/ReservaContext';

function App() {
  return (
    <Router>
      <AuthProvider>
         <ReservaProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas para CLIENTE */}
            <Route
              path="/cliente/dashboard"
              element={
                <PrivateRoute requiredRole="CLIENTE">
                  <DashboardCliente />
                </PrivateRoute>
              }
            />
             <Route
                path="/cliente/mapa"
                element={
                  <PrivateRoute requiredRole="CLIENTE">
                    <MapaPeluquerias />
                  </PrivateRoute>
                }
             />
             <Route
                path="/cliente/reserva/:peluqueriaId"
                element={
                  <PrivateRoute requiredRole="CLIENTE">
                    <ReservaCita />
                  </PrivateRoute>
                }
             />
              <Route
                path="/cliente/mis-citas"
                element={
                  <PrivateRoute requiredRole="CLIENTE">
                    <MisCitasCliente />
                  </PrivateRoute>
                }
             />

             {/* Rutas protegidas para PELUQUERO */}
             <Route
                 path="/peluquero/agenda"
                 element={
                     <PrivateRoute requiredRole="PELUQUERO">
                         <AgendaCitasPeluquero />
                     </PrivateRoute>
                 }
             />
              <Route
                 path="/peluquero/citas/:citaId"
                 element={
                     <PrivateRoute requiredRole="PELUQUERO">
                         <DetalleCitaPeluquero />
                     </PrivateRoute>
                 }
             />

             {/* Rutas protegidas para ADMIN */}
             <Route
                 path="/admin/dashboard"
                 element={
                     <PrivateRoute requiredRole="ADMIN">
                         <AdminDashboard />
                     </PrivateRoute>
                 }
             />
             <Route
                 path="/admin/barbers-services"
                 element={
                     <PrivateRoute requiredRole="ADMIN">
                         <AdminBarbersServices />
                     </PrivateRoute>
                 }
             />
             <Route
                 path="/admin/schedules"
                 element={
                     <PrivateRoute requiredRole="ADMIN">
                         <AdminSchedules />
                     </PrivateRoute>
                 }
             />
             <Route
                 path="/admin/invoices"
                 element={
                     <PrivateRoute requiredRole="ADMIN">
                         <AdminInvoices />
                     </PrivateRoute>
                 }
             />
             <Route
                 path="/admin/ratings"
                 element={
                     <PrivateRoute requiredRole="ADMIN">
                         <AdminRatings />
                     </PrivateRoute>
                 }
             />

            {/* Ruta por defecto: redirigir al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

          </Routes>
         </ReservaProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
