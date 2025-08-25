package com.jcd.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.Negocio;
import com.jcd.backend.model.Usuario;
import com.jcd.backend.repository.NegocioRepository;
import com.jcd.backend.repository.UsuarioRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class NegocioServiceImpl implements NegocioService {

    private final NegocioRepository negocioRepository;
    private final UsuarioRepository usuarioRepository;

    // Carpeta donde se guardarán las imágenes
    private final String uploadDir = "uploads/negocios";

    @Autowired
    public NegocioServiceImpl(NegocioRepository negocioRepository, UsuarioRepository usuarioRepository) {
        this.negocioRepository = negocioRepository;
        this.usuarioRepository = usuarioRepository;

        // Crear carpeta si no existe
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @Override
    public Negocio crearNegocio(Negocio negocio) {
        Long usuarioId = negocio.getUsuario().getId();

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        negocio.setUsuario(usuario);
        return negocioRepository.save(negocio);
    }

    @Override
    public String guardarImagen(MultipartFile imagen) {
        if (imagen == null || imagen.isEmpty()) {
            return null;
        }

        try {
            // Nombre original
            String nombreArchivo = StringUtils.cleanPath(imagen.getOriginalFilename());

            // Extraemos la extensión (ej: ".png", ".jpg")
            String extension = "";
            int lastDot = nombreArchivo.lastIndexOf(".");
            if (lastDot != -1) {
                extension = nombreArchivo.substring(lastDot);
            }

            // Generamos un nombre único
            String nombreUnico = UUID.randomUUID().toString() + extension;

            // Guardamos la imagen en el directorio
            Path rutaDestino = Paths.get(uploadDir, nombreUnico);
            Files.copy(imagen.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);

            // Retornamos la ruta relativa (que será accesible vía /uploads/negocios/...)
            return "/uploads/negocios/" + nombreUnico;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen: " + e.getMessage());
        }
    }
}
