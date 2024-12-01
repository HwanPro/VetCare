package com.example.back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="VC_TBEM")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmployee;

    @OneToOne (optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne (optional = false)
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @Column(length = 8, unique = true)
    private String dni;

    @Column(length = 5, unique = true)
    private String cmvp;

    @Column(nullable = false)
    private String firstName;

    private String preName;

    @Column(nullable = false)
    private String firstLastName;

    @Column(nullable = false)
    private String secondLastName;
    
    @Column(nullable = false)
    private String address;

    @Column(length = 9)
    private String cellphone;

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'UserFoto.png'")
    private String dirImage;

    @Column(columnDefinition = "CHAR(1) DEFAULT '1'")
    private Character status;
}