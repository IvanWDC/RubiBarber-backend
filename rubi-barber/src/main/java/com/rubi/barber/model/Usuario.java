package com.rubi.barber.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    private boolean activo = true;

    // Nuevo campo para la URL de la imagen de perfil
    private String imagenPerfilUrl;

    // Relación con Peluqueria (si el usuario es ADMIN)
    @OneToOne
    @JoinColumn(name = "peluqueria_id")
    @JsonIgnoreProperties("usuario")
    private Peluqueria peluqueria;

    // Getters y setters

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Peluqueria getPeluqueria() {
        return peluqueria;
    }

    public void setPeluqueria(Peluqueria peluqueria) {
        this.peluqueria = peluqueria;
    }

    // Getter y setter para imagenPerfilUrl
    public String getImagenPerfilUrl() {
        return imagenPerfilUrl;
    }

    public void setImagenPerfilUrl(String imagenPerfilUrl) {
        this.imagenPerfilUrl = imagenPerfilUrl;
    }
}
