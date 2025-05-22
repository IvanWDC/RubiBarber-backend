package com.rubi.barber.security;

public class AuthResponse {

    private String token;
    private String rol;

    public AuthResponse(String token, String rol) {
        this.token = token;
        this.rol = rol;
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
}
