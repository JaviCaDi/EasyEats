package com.jcd.backend.service;

import java.util.List;
import com.jcd.backend.model.Reserva;

public interface ReservaService {

    Reserva reservar(Long usuarioId, Long packId);

    List<Reserva> obtenerReservasUsuario(Long usuarioId);

    // Nuevo método para validar QR
    Reserva validarCodigoQr(String codigoQr);
}
