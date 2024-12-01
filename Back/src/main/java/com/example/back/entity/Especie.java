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
@Table(name="VC_TBES")
public class Especie {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idEspecie;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 1)
    private char status = '1';
}
