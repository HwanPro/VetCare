package com.example.back.entity;

import java.util.Date;

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
@Table(name="VC_TBPE")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPet;

    @ManyToOne (optional = false)
    @JoinColumn(name = "race_id")
    private Race race;

    @ManyToOne (optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String sex;

    @Column(nullable = false)
    private String weight;

    @Column(nullable = false)
    private Date dateNac;

    private String comments;

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'PetFoto.png'", nullable=false)
    private String dirImage;

    @Column(columnDefinition = "CHAR(1) DEFAULT '1'", nullable=false)
    private Character status;

}
