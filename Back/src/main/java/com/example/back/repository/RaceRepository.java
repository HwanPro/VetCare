package com.example.back.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Race;

@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
    
    @Query("SELECT r FROM Race r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Race> findByNameContainingIgnoreCase(@Param("name") String name);


    // Buscar razas activas con paginación
    Page<Race> findByStatus(char status, Pageable pageable);

}
