package com.jcd.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "horario_pack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioPack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hora_inicio", nullable = false)
    private String horaInicio; // formato HH:mm

    @Column(name = "hora_fin", nullable = false)
    private String horaFin;

    @ManyToOne
    @JoinColumn(name = "pack_id", nullable = false)
    private Pack pack;
}
