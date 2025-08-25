package com.jcd.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.Negocio;
import com.jcd.backend.service.NegocioService;

@RestController
@RequestMapping("/api/negocio")
@CrossOrigin(origins = "http://localhost:4200")
public class NegocioController {

    private final NegocioService negocioService;

    @Autowired
    public NegocioController(NegocioService negocioService) {
        this.negocioService = negocioService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Negocio> crearNegocio(
            @RequestPart("negocio") Negocio negocio,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {

        if (imagen != null && !imagen.isEmpty()) {
            String rutaImagen = negocioService.guardarImagen(imagen); // Guardar la imagen en el servidor
            negocio.setImagenUrl(rutaImagen);
        }

        Negocio nuevoNegocio = negocioService.crearNegocio(negocio);
        return ResponseEntity.ok(nuevoNegocio);
    }
}
