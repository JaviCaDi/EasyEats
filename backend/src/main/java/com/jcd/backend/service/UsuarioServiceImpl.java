package com.jcd.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jcd.backend.model.Negocio;
import com.jcd.backend.model.Usuario;
import com.jcd.backend.repository.NegocioRepository;
import com.jcd.backend.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        return usuarioRepository.findById(id).map(u -> {
            // solo actualizamos los campos que vengan
            if (usuario.getNegocio() != null) {
                u.setNegocio(usuario.getNegocio());
            }
            if (usuario.getNombre() != null) {
                u.setNombre(usuario.getNombre());
            }
            if (usuario.getEmail() != null) {
                u.setEmail(usuario.getEmail());
            }
            if (usuario.getDireccion() != null) {
                u.setDireccion(usuario.getDireccion());
            }
            if (usuario.getTelefono() != null) {
                u.setTelefono(usuario.getTelefono());
            }
            return usuarioRepository.save(u);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado con id " + id));
    }

    @Override
    public Usuario asignarNegocio(Long usuarioId, Long negocioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id " + usuarioId));

        Negocio negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new RuntimeException("Negocio no encontrado con id " + negocioId));

        usuario.setNegocio(negocio);
        return usuarioRepository.save(usuario);
    }
}
