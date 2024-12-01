package com.example.back.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Especie;

@Repository
public interface EspecieRepository extends JpaRepository<Especie, Long> {
    
    @Query(value = "SELECT * FROM VC_TBES WHERE LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    List<Especie> findByNameContainingIgnoreCase(@Param("name") String name);

     // Buscar especies activas con paginación
     Page<Especie> findByStatus(char status, Pageable pageable);

}
