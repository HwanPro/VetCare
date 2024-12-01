package com.example.back.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name="VC_TBHC")
public class PetClinicalHistory {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHistory;

    @ManyToOne (optional = false)
    @JoinColumn(name = "pet_id", nullable=false)
    private Pet pet;

    @ManyToOne (optional = false)
    @JoinColumn(name = "service_id", nullable=false)
    private ServiceEntity serviceEntity;

    private LocalDate registrationDate;

    @Lob
    private String diagnostico;

    private String resultado;

    @Column(columnDefinition = "CHAR(1) DEFAULT '1'", nullable = false)
    private Character status;

}
