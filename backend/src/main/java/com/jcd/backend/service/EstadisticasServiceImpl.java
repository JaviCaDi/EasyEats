package com.jcd.backend.service;

import com.jcd.backend.model.Pack;
import com.jcd.backend.model.Reserva;
import com.jcd.backend.repository.PackRepository;
import com.jcd.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstadisticasServiceImpl implements EstadisticasService {

    private final ReservaRepository reservaRepository;
    private final PackRepository packRepository;

    @Override
    public Long totalReservas(Long negocioId) {
        return (long) reservaRepository.findByPack_Negocio_Id(negocioId).size();
    }

    @Override
    public Double ingresosHoy(Long negocioId) {
        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fin = LocalDateTime.now();

        return reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .filter(r -> r.getFechaReserva().isAfter(inicio) && r.getFechaReserva().isBefore(fin))
                .mapToDouble(Reserva::getPrecioPagado)
                .sum();
    }

    @Override
    public Double ingresosTotales(Long negocioId) {
        return reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .mapToDouble(Reserva::getPrecioPagado)
                .sum();
    }

    @Override
    public Double promedioReservasDiarias(Long negocioId) {
        List<Reserva> reservas = reservaRepository.findByPack_Negocio_Id(negocioId);
        LocalDateTime primeraFecha = reservas.stream()
                .map(Reserva::getFechaReserva)
                .min(LocalDateTime::compareTo)
                .orElse(LocalDateTime.now());
        long dias = ChronoUnit.DAYS.between(primeraFecha, LocalDateTime.now());
        if (dias == 0)
            dias = 1;
        return totalReservas(negocioId).doubleValue() / dias;
    }

    @Override
    public List<Map<String, Object>> top5Packs(Long negocioId) {
        Map<Pack, Long> conteo = reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .collect(Collectors.groupingBy(Reserva::getPack, Collectors.counting()));

        return conteo.entrySet().stream()
                .sorted(Map.Entry.<Pack, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nombre", e.getKey().getTitulo());
                    map.put("reservas", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> clienteMasPopular(Long negocioId) {
        Map<String, Long> conteo = reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .collect(Collectors.groupingBy(r -> r.getUsuario().getNombre(), Collectors.counting()));

        Optional<Map.Entry<String, Long>> max = conteo.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        Map<String, Object> result = new HashMap<>();
        if (max.isPresent()) {
            result.put("nombre", max.get().getKey());
            result.put("reservas", max.get().getValue());
        }
        return result;
    }

    @Override
    public Map<String, Object> reservaReciente(Long negocioId) {
        Optional<Reserva> reciente = reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .max(Comparator.comparing(Reserva::getFechaReserva));

        Map<String, Object> map = new HashMap<>();
        reciente.ifPresent(r -> {
            map.put("fecha", r.getFechaReserva().toString());
            map.put("cliente", r.getUsuario().getNombre());
            map.put("pack", r.getPack().getTitulo());
        });
        return map;
    }

    @Override
    public Map<String, Object> packMayorIngreso(Long negocioId) {
        Map<Pack, Double> ingresosPorPack = reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .collect(Collectors.groupingBy(Reserva::getPack, Collectors.summingDouble(Reserva::getPrecioPagado)));

        Optional<Map.Entry<Pack, Double>> max = ingresosPorPack.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        Map<String, Object> result = new HashMap<>();
        max.ifPresent(e -> {
            result.put("nombre", e.getKey().getTitulo());
            result.put("ingresos", e.getValue());
        });
        return result;
    }

    @Override
    public List<Map<String, Object>> ingresosPorPack(Long negocioId) {
        Map<Pack, Double> ingresos = reservaRepository.findByPack_Negocio_Id(negocioId).stream()
                .collect(Collectors.groupingBy(Reserva::getPack, Collectors.summingDouble(Reserva::getPrecioPagado)));

        return ingresos.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nombre", e.getKey().getTitulo());
                    map.put("ingresos", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

}
