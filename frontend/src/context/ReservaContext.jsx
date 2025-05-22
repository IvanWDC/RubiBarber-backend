import { createContext, useContext, useState } from 'react';

const ReservaContext = createContext();

export const useReserva = () => useContext(ReservaContext);

export const ReservaProvider = ({ children }) => {
    const [pasoActual, setPasoActual] = useState(0);
    const [peluqueriaSeleccionada, setPeluqueriaSeleccionada] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState(null);
    const [fechaHoraSeleccionada, setFechaHoraSeleccionada] = useState(null);

    const resetReserva = () => {
        setPasoActual(0);
        setPeluqueriaSeleccionada(null);
        setServicioSeleccionado(null);
        setPeluqueroSeleccionado(null);
        setFechaHoraSeleccionada(null);
    };

    const siguientePaso = () => setPasoActual(prev => prev + 1);
    const pasoAnterior = () => setPasoActual(prev => prev - 1);

    const value = {
        pasoActual,
        peluqueriaSeleccionada,
        servicioSeleccionado,
        peluqueroSeleccionado,
        fechaHoraSeleccionada,
        setPeluqueriaSeleccionada,
        setServicioSeleccionado,
        setPeluqueroSeleccionado,
        setFechaHoraSeleccionada,
        siguientePaso,
        pasoAnterior,
        resetReserva
    };

    return (
        <ReservaContext.Provider value={value}>
            {children}
        </ReservaContext.Provider>
    );
}; 