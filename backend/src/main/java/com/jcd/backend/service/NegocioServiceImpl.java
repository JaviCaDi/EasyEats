package com.jcd.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.Negocio;
import com.jcd.backend.repository.NegocioRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class NegocioServiceImpl implements NegocioService {

    private final NegocioRepository negocioRepository;

    // Carpeta donde se guardarán las imágenes
    private final String uploadDir = "uploads/negocios";

    @Autowired
    public NegocioServiceImpl(NegocioRepository negocioRepository) {
        this.negocioRepository = negocioRepository;

        // Crear carpeta si no existe
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @Override
    public Negocio crearNegocio(Negocio negocio) {
        // Simplemente guardamos el negocio sin usuario
        return negocioRepository.save(negocio);
    }

    @Override
    public String guardarImagen(MultipartFile imagen) {
        if (imagen == null || imagen.isEmpty()) {
            return null;
        }

        try {
            String nombreArchivo = StringUtils.cleanPath(imagen.getOriginalFilename());
            String extension = "";
            int lastDot = nombreArchivo.lastIndexOf(".");
            if (lastDot != -1) {
                extension = nombreArchivo.substring(lastDot);
            }

            String nombreUnico = UUID.randomUUID().toString() + extension;
            Path rutaDestino = Paths.get(uploadDir, nombreUnico);
            Files.copy(imagen.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/negocios/" + nombreUnico;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen: " + e.getMessage());
        }
    }
}
