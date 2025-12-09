package com.jcd.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jcd.backend.model.EstadoReserva;
import com.jcd.backend.model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioId(Long usuarioId);

    Optional<Reserva> findByCodigoQr(String codigoQr);

    List<Reserva> findByPack_Negocio_Id(Long negocioId);

    List<Reserva> findByPack_Negocio_IdAndEstado(Long negocioId, EstadoReserva estado);

}
