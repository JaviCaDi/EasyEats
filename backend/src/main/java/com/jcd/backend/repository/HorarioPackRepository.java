package com.jcd.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.jcd.backend.model.HorarioPack;

public interface HorarioPackRepository extends JpaRepository<HorarioPack, Long> {
    
    List<HorarioPack> findByPackId(Long packId);

    @Modifying
    @Transactional
    @Query("DELETE FROM HorarioPack h WHERE h.pack.id = :packId")
    void deleteByPackId(Long packId);
}
