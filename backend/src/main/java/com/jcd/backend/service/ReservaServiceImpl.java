package com.jcd.backend.service;

import com.jcd.backend.model.Pack;
import com.jcd.backend.model.Reserva;
import com.jcd.backend.model.Usuario;
import com.jcd.backend.repository.PackRepository;
import com.jcd.backend.repository.ReservaRepository;
import com.jcd.backend.repository.UsuarioRepository;
import com.jcd.backend.service.ReservaService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

        // 🔹 Restar saldo al usuario
        usuario.setSaldo(usuario.getSaldo() - pack.getPrecio());
        usuarioRepository.save(usuario);

        // 🔹 Restar unidad al pack
        pack.setCantidad(pack.getCantidad() - 1);
        packRepository.save(pack);

        // 🔹 Crear reserva
        Reserva reserva = new Reserva();
        reserva.setUsuarioId(usuarioId);
        reserva.setPackId(packId);
        reserva.setPrecioPagado(pack.getPrecio());
        reserva.setFechaReserva(LocalDateTime.now());

        // Código QR simple (se podrá mejorar)
        reserva.setCodigoQr("QR-" + System.currentTimeMillis());

        return reservaRepository.save(reserva);
    }
}
