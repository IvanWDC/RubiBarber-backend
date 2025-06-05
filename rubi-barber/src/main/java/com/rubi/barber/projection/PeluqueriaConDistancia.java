package com.rubi.barber.projection;

public interface PeluqueriaConDistancia {
    Long getId();
    String getNombre();
    String getDireccion();
    Double getLatitud();
    Double getLongitud();
    boolean isActivo();
    Double getDistancia(); // Campo para la distancia calculada
} 