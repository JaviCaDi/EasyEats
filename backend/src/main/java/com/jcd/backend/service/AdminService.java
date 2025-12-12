package com.jcd.backend.service;

import com.jcd.backend.model.Usuario;
import java.util.List;

public interface AdminService {
    List<Usuario> getUsuarios();
    void eliminarUsuario(Long id);
}
