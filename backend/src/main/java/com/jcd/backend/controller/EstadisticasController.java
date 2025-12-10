package com.jcd.backend.controller;

import com.jcd.backend.service.EstadisticasService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estadisticas")
@RequiredArgsConstructor
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    @GetMapping("/{negocioId}/total-reservas")
    public Long totalReservas(@PathVariable Long negocioId) {
        return estadisticasService.totalReservas(negocioId);
    }

    @GetMapping("/{negocioId}/ingresos-hoy")
    public Double ingresosHoy(@PathVariable Long negocioId) {
        return estadisticasService.ingresosHoy(negocioId);
    }

    @GetMapping("/{negocioId}/ingresos-totales")
    public Double ingresosTotales(@PathVariable Long negocioId) {
        return estadisticasService.ingresosTotales(negocioId);
    }

    @GetMapping("/{negocioId}/promedio-reservas")
    public Double promedioReservas(@PathVariable Long negocioId) {
        return estadisticasService.promedioReservasDiarias(negocioId);
    }

    @GetMapping("/{negocioId}/top5packs")
    public List<Map<String, Object>> top5Packs(@PathVariable Long negocioId) {
        return estadisticasService.top5Packs(negocioId);
    }

    @GetMapping("/{negocioId}/cliente-popular")
    public Map<String, Object> clientePopular(@PathVariable Long negocioId) {
        return estadisticasService.clienteMasPopular(negocioId);
    }

    @GetMapping("/{negocioId}/reserva-reciente")
    public Map<String, Object> reservaReciente(@PathVariable Long negocioId) {
        return estadisticasService.reservaReciente(negocioId);
    }

    @GetMapping("/{negocioId}/pack-mayoringreso")
    public Map<String, Object> packMayorIngreso(@PathVariable Long negocioId) {
        return estadisticasService.packMayorIngreso(negocioId);
    }

    @GetMapping("/{negocioId}/ingresos-por-pack")
    public List<Map<String, Object>> ingresosPorPack(@PathVariable Long negocioId) {
        return estadisticasService.ingresosPorPack(negocioId);
    }

}
