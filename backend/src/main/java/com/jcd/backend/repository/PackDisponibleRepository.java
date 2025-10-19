package com.jcd.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jcd.backend.model.PackDisponible;

import java.util.Optional;

public interface PackDisponibleRepository extends JpaRepository<PackDisponible, Long> {
    Optional<PackDisponible> findByPackId(Long packId);
}
