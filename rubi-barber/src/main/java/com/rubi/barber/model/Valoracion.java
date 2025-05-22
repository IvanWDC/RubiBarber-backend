package com.rubi.barber.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Valoracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int puntuacion; // de 1 a 5
    private String comentario;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties({"citas", "password", "email", "rol", "activo"})
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "peluquero_id")
    @JsonIgnoreProperties({"citas", "horarios", "especialidad", "activo"})
    private Peluquero peluquero;

    @OneToOne
    @JoinColumn(name = "cita_id")
    @JsonIgnoreProperties({"cliente", "peluquero", "servicio"})
    private Cita cita;


    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(int puntuacion) {
        this.puntuacion = puntuacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
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

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }
}
