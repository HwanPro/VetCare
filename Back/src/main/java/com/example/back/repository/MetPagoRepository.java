package com.example.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.back.entity.MetPag;

@Repository
public interface MetPagoRepository extends JpaRepository<MetPag, Long> {
    
    List<MetPag> findByStatus(Character status);
}
