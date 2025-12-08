package com.jcd.backend.service;

import com.jcd.backend.model.Pack;
import com.jcd.backend.model.Reserva;
import com.jcd.backend.model.Usuario;
import com.jcd.backend.model.EstadoReserva;
import com.jcd.backend.repository.PackRepository;
import com.jcd.backend.repository.ReservaRepository;
import com.jcd.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final PackRepository packRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public Reserva reservar(Long usuarioId, Long packId) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new RuntimeException("Pack no encontrado"));

        if (pack.getCantidad() <= 0) {
            throw new RuntimeException("No hay unidades disponibles");
        }

        if (usuario.getSaldo() < pack.getPrecio()) {
            throw new RuntimeException("Saldo insuficiente");
        }

        // Descontar saldo
        usuario.setSaldo(usuario.getSaldo() - pack.getPrecio());
        usuarioRepository.save(usuario);

        // Reducir stock
        pack.setCantidad(pack.getCantidad() - 1);
        packRepository.save(pack);

        // Crear reserva
        Reserva reserva = new Reserva();
        reserva.setUsuario(usuario);
        reserva.setPack(pack);
        reserva.setPrecioPagado(pack.getPrecio());
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setFechaLimiteRecogida(LocalDateTime.now().plusHours(4));
        reserva.setCodigoQr("QR-" + UUID.randomUUID());
        reserva.setRecogido(false);
        reserva.setEstado(EstadoReserva.RESERVADA);

        return reservaRepository.save(reserva);
        //QUE SEA CON TRANSACCIONES
    }

    @Override
    public List<Reserva> obtenerReservasUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Reserva validarCodigoQr(String codigoQr) {
        Reserva reserva = reservaRepository.findByCodigoQr(codigoQr)
                .orElseThrow(() -> new RuntimeException("QR no válido"));

        if (reserva.isRecogido()) {
            throw new RuntimeException("La reserva ya fue recogida");
        }

        reserva.setRecogido(true);
        reserva.setEstado(EstadoReserva.RECOGIDA); // <-- ENUM CORRECTO

        return reservaRepository.save(reserva);
    }
}
