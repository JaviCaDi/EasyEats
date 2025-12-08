package com.jcd.backend.controller;

import com.jcd.backend.model.Reserva;
import com.jcd.backend.service.ReservaService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping("/{usuarioId}/{packId}")
    public Reserva hacerReserva(
            @PathVariable Long usuarioId,
            @PathVariable Long packId) {
        return reservaService.reservar(usuarioId, packId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Reserva> obtenerReservasUsuario(@PathVariable Long usuarioId) {
        return reservaService.obtenerReservasUsuario(usuarioId);
    }

    // Nuevo endpoint para validar QR
    @GetMapping("/validar/{codigoQr}")
    public ResponseEntity<?> validarQr(@PathVariable String codigoQr) {
        try {
            Reserva reserva = reservaService.validarCodigoQr(codigoQr);
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
