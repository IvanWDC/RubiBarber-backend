package com.rubi.barber.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Usuario (cliente)
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties({"citas", "password", "email", "rol", "activo"})
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "peluquero_id")
    @JsonIgnoreProperties({"citas", "horarios", "especialidad", "activo"})
    private Peluquero peluquero;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    @JsonIgnoreProperties({"activo", "descripcion"})
    private Servicio servicio;

    private LocalDateTime fechaHora;

    private boolean confirmada = false;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public Peluquero getPeluquero() {
        return peluquero;
    }

    public void setPeluquero(Peluquero peluquero) {
        this.peluquero = peluquero;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public boolean isConfirmada() {
        return confirmada;
    }

    public void setConfirmada(boolean confirmada) {
        this.confirmada = confirmada;
    }
}
