package com.rubi.barber.security;

import com.rubi.barber.model.Peluqueria;

public class AuthResponse {

    private String token;
    private String rol;
    private Long idUsuario;
    private String email;
    private String nombre;
    private Peluqueria peluqueria;

    public AuthResponse(String token, String rol, Long idUsuario, String email, String nombre, Peluqueria peluqueria) {
        this.token = token;
        this.rol = rol;
        this.idUsuario = idUsuario;
        this.email = email;
        this.nombre = nombre;
        this.peluqueria = peluqueria;
    }

    // Getters y setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Peluqueria getPeluqueria() {
        return peluqueria;
    }

    public void setPeluqueria(Peluqueria peluqueria) {
        this.peluqueria = peluqueria;
    }
}
