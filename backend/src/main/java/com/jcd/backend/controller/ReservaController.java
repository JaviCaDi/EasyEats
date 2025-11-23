package com.jcd.backend.controller;

import com.jcd.backend.model.Reserva;
import com.jcd.backend.service.ReservaService;

import lombok.RequiredArgsConstructor;
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
            @PathVariable Long packId
    ) {
        return reservaService.reservar(usuarioId, packId);
    }
}
