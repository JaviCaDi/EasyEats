package com.jcd.backend.service;

import com.jcd.backend.model.Negocio;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

public interface NegocioService {
    Negocio crearNegocio(Negocio negocio);

    String guardarImagen(MultipartFile imagen);

    List<Negocio> listarNegocios();

    Optional<Negocio> obtenerPorId(Long id);
}
