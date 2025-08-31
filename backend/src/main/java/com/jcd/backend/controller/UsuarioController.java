package com.jcd.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jcd.backend.model.Usuario;
import com.jcd.backend.repository.UsuarioRepository;
import com.jcd.backend.service.UsuarioService;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    // Obtener usuario por id
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuario(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar usuario (ej: campos generales)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario actualizado = usuarioService.actualizarUsuario(id, usuario);
        return ResponseEntity.ok(actualizado);
    }

    // ✅ Nuevo endpoint para asignar un negocio
    @PutMapping("/{usuarioId}/negocio/{negocioId}")
    public ResponseEntity<Usuario> asignarNegocio(
            @PathVariable Long usuarioId,
            @PathVariable Long negocioId) {

        Usuario usuario = usuarioService.asignarNegocio(usuarioId, negocioId);
        return ResponseEntity.ok(usuario);
    }
}
