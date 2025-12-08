package com.jcd.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "pack_id")
    private Pack pack;

    private Double precioPagado;

    private LocalDateTime fechaReserva;

    private LocalDateTime fechaLimiteRecogida;

    private String codigoQr;

    private boolean recogido = false;

    @Enumerated(EnumType.STRING)
    private EstadoReserva estado = EstadoReserva.RESERVADA;
}
