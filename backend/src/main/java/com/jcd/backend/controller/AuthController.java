package com.jcd.backend.controller;

import com.jcd.backend.dto.auth.AuthRequest;
import com.jcd.backend.dto.auth.AuthResponse;
import com.jcd.backend.model.Usuario;
import com.jcd.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        return authService.registrarUsuario(usuario);
    }
}
