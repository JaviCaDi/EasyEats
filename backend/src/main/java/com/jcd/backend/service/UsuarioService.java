package com.jcd.backend.service;

import com.jcd.backend.model.Usuario;

public interface UsuarioService {
    Usuario actualizarUsuario(Long id, Usuario usuario);

    Usuario asignarNegocio(Long usuarioId, Long negocioId);
}
