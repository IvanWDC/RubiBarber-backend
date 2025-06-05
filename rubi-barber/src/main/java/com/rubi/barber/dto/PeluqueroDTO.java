package com.rubi.barber.dto;

import com.rubi.barber.model.Peluquero;

public class PeluqueroDTO {
    private Long id;
    private String nombre;
    private String email;
    private String especialidad;
    private boolean activo;
    private String rol;
    private Long idUsuario;
    private UsuarioDTO usuarioPeluquero;

    // Constructor vacío necesario para deserialización JSON
    public PeluqueroDTO() {
    }

    // Constructor que mapea desde la entidad Peluquero
    public PeluqueroDTO(Peluquero peluquero) {
        this.id = peluquero.getId();
        this.nombre = peluquero.getUsuario().getNombre();
        this.email = peluquero.getUsuario().getEmail();
        this.especialidad = peluquero.getEspecialidad();
        this.activo = peluquero.isActivo();
        this.rol = peluquero.getUsuario().getRol().name();
        this.idUsuario = peluquero.getUsuario().getId();
    }

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

    public UsuarioDTO getUsuarioPeluquero() {
        return usuarioPeluquero;
    }

    public void setUsuarioPeluquero(UsuarioDTO usuarioPeluquero) {
        this.usuarioPeluquero = usuarioPeluquero;
    }
} 