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

    private Long usuarioId;
    private Long packId;
    private Double precioPagado;

    private LocalDateTime fechaReserva;

    private String codigoQr;
}
