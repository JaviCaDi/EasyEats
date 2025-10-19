package com.jcd.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packs_disponibles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pack_id", nullable = false, unique = true)
    private Pack pack;

    @Column(name = "cantidad_disponible", nullable = false)
    private Integer cantidadDisponible;
}
