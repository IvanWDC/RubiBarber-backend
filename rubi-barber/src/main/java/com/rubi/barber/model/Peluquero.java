package com.rubi.barber.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;

@Entity
@Getter
@Setter
public class Peluquero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String especialidad;

    private boolean activo = true;

    // Relación con usuario
    @ManyToOne
    @JoinColumn(name = "usuario_peluquero_id")
    private Usuario usuario;

    // Relación con peluquería
    @ManyToOne
    @JoinColumn(name = "peluqueria_id")
    @JsonBackReference
    private Peluqueria peluqueria;

    // Relación con servicios que puede realizar
    @ManyToMany
    @JoinTable(
        name = "peluquero_servicio",
        joinColumns = @JoinColumn(name = "peluquero_id"),
        inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> servicios;

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

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Peluqueria getPeluqueria() {
        return peluqueria;
    }

    public void setPeluqueria(Peluqueria peluqueria) {
        this.peluqueria = peluqueria;
    }

    public List<Servicio> getServicios() {
        return servicios;
    }

    public void setServicios(List<Servicio> servicios) {
        this.servicios = servicios;
    }
}
