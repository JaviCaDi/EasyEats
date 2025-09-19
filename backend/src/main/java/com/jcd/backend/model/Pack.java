package com.jcd.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Pack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "negocio_id", nullable = false)
    private Negocio negocio;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Double precio;

    private Integer cantidad;

    private String imagenUrl;

    private Boolean activo = true;
}
