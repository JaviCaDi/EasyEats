package com.jcd.backend.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.HorarioPack;
import com.jcd.backend.model.Pack;
import com.jcd.backend.model.PackDisponible;
import com.jcd.backend.repository.HorarioPackRepository;
import com.jcd.backend.repository.NegocioRepository;
import com.jcd.backend.repository.PackDisponibleRepository;
import com.jcd.backend.repository.PackRepository;

@Service
public class PackServiceImpl implements PackService {

    @Autowired
    private PackRepository packRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private PackDisponibleRepository packDisponibleRepository;

    @Autowired
    private HorarioPackRepository horarioPackRepository;

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

        // Guardar imagen si se proporciona
        if (imagen != null && !imagen.isEmpty()) {
            String imagePath = guardarImagen(imagen, "uploads/packs");
            pack.setImagenUrl(imagePath);
        }

        // Guardar el pack
        Pack packGuardado = packRepository.save(pack);

        // 🔹 Crear también su registro en packs_disponibles
        PackDisponible packDisponible = new PackDisponible();
        packDisponible.setPack(packGuardado);
        packDisponible.setCantidadDisponible(cantidad);
        packDisponibleRepository.save(packDisponible);

        return packGuardado;
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

        Pack actualizado = packRepository.save(pack);

        // 🔹 Actualizar también la cantidad disponible
        Optional<PackDisponible> optDisponible = packDisponibleRepository.findByPackId(actualizado.getId());
        if (optDisponible.isPresent()) {
            PackDisponible disponible = optDisponible.get();
            disponible.setCantidadDisponible(cantidad);
            packDisponibleRepository.save(disponible);
        } else {
            // En caso de que no exista (raro), se crea uno nuevo
            PackDisponible nuevoDisponible = new PackDisponible();
            nuevoDisponible.setPack(actualizado);
            nuevoDisponible.setCantidadDisponible(cantidad);
            packDisponibleRepository.save(nuevoDisponible);
        }

        return actualizado;
    }

    @Override
    public void eliminarPack(Long id) {
        // Primero eliminamos el registro en packs_disponibles
        packDisponibleRepository.findByPackId(id)
                .ifPresent(pd -> packDisponibleRepository.delete(pd));

        if (!packRepository.existsById(id)) {
            throw new RuntimeException("Pack no encontrado");
        }

        packRepository.deleteById(id);
    }

    @Override
    public Pack obtenerPackPorId(Long id) {
        return packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));
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
    public List<Pack> listarPacksDisponiblesPorNegocio(Long negocioId) {
        List<Pack> packs = packRepository.findByNegocioId(negocioId);

        // 🔹 Recorremos cada pack y actualizamos su "cantidad" con la
        // cantidadDisponible real
        for (Pack pack : packs) {
            packDisponibleRepository.findByPackId(pack.getId())
                    .ifPresent(pd -> pack.setCantidad(pd.getCantidadDisponible()));
        }

        return packs;
    }

    @Override
    public Pack obtenerPackDisponiblePorId(Long id) {
        Pack pack = packRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        packDisponibleRepository.findByPackId(id)
                .ifPresent(pd -> pack.setCantidad(pd.getCantidadDisponible()));

        return pack;
    }

    // 🔹 Obtener horarios por pack
    @Override
    public List<HorarioPack> obtenerHorariosPorPack(Long packId) {
        return horarioPackRepository.findByPackId(packId);
    }

    // 🔹 Actualizar horarios por pack
    @Override
    public void actualizarHorariosPorPack(Long packId, List<HorarioPack> horarios) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        // Primero eliminamos los horarios anteriores
        horarioPackRepository.deleteByPackId(packId);

        // Guardamos los nuevos
        for (HorarioPack horario : horarios) {
            horario.setId(null); // asegurar que sean nuevos registros
            horario.setPack(pack);
            horarioPackRepository.save(horario);
        }
    }

}
