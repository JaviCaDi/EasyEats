package com.jcd.backend.service;

import com.jcd.backend.model.Usuario;

public interface UsuarioService {
    Usuario actualizarUsuario(Long id, Usuario usuario);

    // Nuevo método para asignar un negocio al usuario
    Usuario asignarNegocio(Long usuarioId, Long negocioId);
}
