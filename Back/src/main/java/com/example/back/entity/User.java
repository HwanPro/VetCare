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
@Table(name = "VC_TBUS")
public class User {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idUser;


    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length=255)
    private String password;
    
    @Column(columnDefinition = "CHAR(1) DEFAULT '1'")
    private Character status;
}
