package com.jcd.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jcd.backend.model.Pack;

public interface PackRepository extends JpaRepository<Pack, Long> {
    List<Pack> findByNegocioId(Long negocioId);
}
