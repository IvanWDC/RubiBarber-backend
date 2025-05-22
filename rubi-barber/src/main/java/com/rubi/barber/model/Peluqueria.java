package com.rubi.barber.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Peluqueria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String direccion;

    private Double latitud;

    private Double longitud;

    private boolean activo = true;

    // Relación con Peluquero (una peluquería tiene muchos peluqueros)
    @OneToMany(mappedBy = "peluqueria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Peluquero> peluqueros;

    // ===== Getters y Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public List<Peluquero> getPeluqueros() {
        return peluqueros;
    }

    public void setPeluqueros(List<Peluquero> peluqueros) {
        this.peluqueros = peluqueros;
    }
}
