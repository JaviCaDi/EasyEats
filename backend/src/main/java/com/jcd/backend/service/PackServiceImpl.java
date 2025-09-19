package com.jcd.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.Pack;
import com.jcd.backend.repository.NegocioRepository;
import com.jcd.backend.repository.PackRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class PackServiceImpl implements PackService {

    @Autowired
    private PackRepository packRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @Override
    public Pack crearPack(Long negocioId, String titulo, String descripcion, Double precio, Integer cantidad,
            MultipartFile imagen) throws IOException {
        var negocio = negocioRepository.findById(negocioId)
                .orElseThrow(() -> new RuntimeException("Negocio no encontrado"));

        Pack pack = new Pack();
        pack.setNegocio(negocio);
        pack.setTitulo(titulo);
        pack.setDescripcion(descripcion);
        pack.setPrecio(precio);
        pack.setCantidad(cantidad);
        pack.setActivo(true);

        // Manejo seguro de imagen
        if (imagen != null && !imagen.isEmpty()) {
            String imagePath = guardarImagen(imagen, "uploads/packs");
            pack.setImagenUrl(imagePath);
        }

        return packRepository.save(pack);
    }

    @Override
    public List<Pack> listarPorNegocio(Long negocioId) {
        return packRepository.findByNegocioId(negocioId);
    }

    @Override
    public Pack actualizarPack(Long id, String titulo, String descripcion, Double precio,
            Integer cantidad, MultipartFile imagen) throws IOException {
        Pack pack = packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        pack.setTitulo(titulo);
        pack.setDescripcion(descripcion);
        pack.setPrecio(precio);
        pack.setCantidad(cantidad);

        // Si se envía nueva imagen, la reemplaza
        if (imagen != null && !imagen.isEmpty()) {
            String imagePath = guardarImagen(imagen, "uploads/packs");
            pack.setImagenUrl(imagePath);
        }

        return packRepository.save(pack);
    }

    @Override
    public void eliminarPack(Long id) {
        if (!packRepository.existsById(id)) {
            throw new RuntimeException("Pack no encontrado");
        }
        packRepository.deleteById(id);
    }

    // 🔹 Método reutilizable para guardar imagen
    private String guardarImagen(MultipartFile imagen, String uploadDir) throws IOException {
        String nombreArchivo = imagen.getOriginalFilename();
        String extension = "";
        int lastDot = nombreArchivo.lastIndexOf('.');
        if (lastDot != -1) {
            extension = nombreArchivo.substring(lastDot);
        }

        String nombreUnico = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path destino = uploadPath.resolve(nombreUnico);
        Files.copy(imagen.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        return "/" + uploadDir + "/" + nombreUnico;
    }

    @Override
    public Pack obtenerPackPorId(Long id) {
        return packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));
    }

}
