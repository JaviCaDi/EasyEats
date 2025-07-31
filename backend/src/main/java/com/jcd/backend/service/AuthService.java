package com.jcd.backend.service;

import com.jcd.backend.dto.auth.AuthRequest;
import com.jcd.backend.dto.auth.AuthResponse;
import com.jcd.backend.model.Usuario;
import com.jcd.backend.repository.UsuarioRepository;
import com.jcd.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest authRequest) {
        try {
            // Autenticar con email y contraseña
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getContraseña())
            );

            // Obtener usuario y generar token
            Usuario usuario = usuarioRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String token = jwtUtil.generateToken(usuario);
            return new AuthResponse(token);

        } catch (AuthenticationException e) {
            throw new RuntimeException("Credenciales inválidas");
        }
    }

    public void registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }

        usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
        usuarioRepository.save(usuario);
    }
}
