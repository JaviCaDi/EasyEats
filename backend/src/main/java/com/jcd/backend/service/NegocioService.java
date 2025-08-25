package com.jcd.backend.service;

import com.jcd.backend.model.Negocio;
import org.springframework.web.multipart.MultipartFile;

public interface NegocioService {
    Negocio crearNegocio(Negocio negocio);

    // Nuevo método para guardar imagen y devolver su ruta
    String guardarImagen(MultipartFile imagen);
}
