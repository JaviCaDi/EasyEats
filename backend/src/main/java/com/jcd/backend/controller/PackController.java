package com.jcd.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.Pack;
import com.jcd.backend.service.PackService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/packs")
@CrossOrigin(origins = "http://localhost:4200")
public class PackController {

    @Autowired
    private PackService packService;

    @PostMapping
    public ResponseEntity<Pack> crearPack(
            @RequestParam("negocioId") Long negocioId,
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") Double precio,
            @RequestParam("cantidad") Integer cantidad,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        Pack nuevoPack = packService.crearPack(negocioId, titulo, descripcion, precio, cantidad, imagen);
        return ResponseEntity.ok(nuevoPack);
    }

    @GetMapping("/negocio/{negocioId}")
    public ResponseEntity<List<Pack>> listarPorNegocio(@PathVariable Long negocioId) {
        return ResponseEntity.ok(packService.listarPorNegocio(negocioId));
    }

    // EDITAR pack
    @PutMapping("/{id}")
    public ResponseEntity<Pack> actualizarPack(
            @PathVariable Long id,
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") Double precio,
            @RequestParam("cantidad") Integer cantidad,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        Pack actualizado = packService.actualizarPack(id, titulo, descripcion, precio, cantidad, imagen);
        return ResponseEntity.ok(actualizado);
    }

    // ELIMINAR pack
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPack(@PathVariable Long id) {
        packService.eliminarPack(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pack> obtenerPackPorId(@PathVariable Long id) {
        Pack pack = packService.obtenerPackPorId(id);
        return ResponseEntity.ok(pack);
    }

}
