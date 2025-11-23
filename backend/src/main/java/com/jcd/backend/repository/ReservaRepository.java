package com.jcd.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jcd.backend.model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);
}
