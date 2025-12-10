package com.jcd.backend.service;

import java.util.List;
import java.util.Map;

public interface EstadisticasService {

    Long totalReservas(Long negocioId);

    Double ingresosHoy(Long negocioId);

    Double ingresosTotales(Long negocioId);

    Double promedioReservasDiarias(Long negocioId);

    List<Map<String, Object>> top5Packs(Long negocioId);

    Map<String, Object> clienteMasPopular(Long negocioId);

    Map<String, Object> reservaReciente(Long negocioId);

    Map<String, Object> packMayorIngreso(Long negocioId);

    List<Map<String, Object>> ingresosPorPack(Long negocioId);

}
