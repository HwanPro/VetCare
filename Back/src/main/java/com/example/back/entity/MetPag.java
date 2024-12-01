package com.example.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="VC_TBMP")
public class MetPag {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idMetPag;

    private String name;

    private String description;

   @Column(columnDefinition = "VARCHAR(255) DEFAULT 'MetPago.png'")
    private String dirImage;

    @Column(columnDefinition = "CHAR(1) DEFAULT '1'")
    private Character status;
}
