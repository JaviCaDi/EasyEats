package com.jcd.backend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jcd.backend.model.HorarioPack;
import com.jcd.backend.model.Pack;

public interface PackService {
        Pack crearPack(Long negocioId, String titulo, String descripcion, Double precio, Integer cantidad,
                        MultipartFile imagen) throws IOException;

        List<Pack> listarPorNegocio(Long negocioId);

        Pack actualizarPack(Long id, String titulo, String descripcion, Double precio, Integer cantidad,
                        MultipartFile imagen) throws IOException;

        void eliminarPack(Long id);

        Pack obtenerPackPorId(Long id);

        List<Pack> listarPacksDisponiblesPorNegocio(Long negocioId);

        Pack obtenerPackDisponiblePorId(Long id);

        List<HorarioPack> obtenerHorariosPorPack(Long packId);

        void actualizarHorariosPorPack(Long packId, List<HorarioPack> horarios);

}
