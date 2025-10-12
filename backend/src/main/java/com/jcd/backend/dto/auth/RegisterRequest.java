package com.jcd.backend.dto.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String email;
    private String contrasena;
    private String telefono;
    private String direccion;
    private String rol; // "USER" o "BUSINESS"
}