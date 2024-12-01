package com.example.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name="VC_TBRA")
public class Race {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long idRace;

    @ManyToOne(optional = false)
    @JoinColumn(name = "especie_id")
    private Especie especie;

    private String name;

    @Column(nullable = false, length = 1)
    private char status = '1'; // '1': Activo, '0': Inactivo

}
