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
@Table(name ="VC_TBSE")
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long idService;

    @ManyToOne(optional=false)
    @JoinColumn(name = "especie_id")
    private Especie especie;

    @ManyToOne(optional=false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String recommendedAge;

    @Column(nullable = false)
    private String recommendedFrequency;

    @Column(nullable = false)
    private double price;

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'ServiceFoto.png'", nullable=false)
    private String dirImage;

    @Column(columnDefinition = "CHAR(1) DEFAULT '1'", nullable=false)
    private Character status;
}
