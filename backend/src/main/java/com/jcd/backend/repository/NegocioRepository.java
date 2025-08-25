package com.jcd.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jcd.backend.model.Negocio;

public interface NegocioRepository extends JpaRepository<Negocio, Long> {
}