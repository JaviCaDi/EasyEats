package com.jcd.backend.service;

import com.jcd.backend.model.Reserva;

public interface ReservaService {

    Reserva reservar(Long usuarioId, Long packId);
}
