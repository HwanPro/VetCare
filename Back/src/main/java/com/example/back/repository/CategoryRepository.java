package com.example.back.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
    
    @Query(value = "SELECT * FROM VC_TBCA WHERE LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    List<Category> findByNameContainingIgnoreCase(@Param("name") String name);

     // Buscar categorías activas con paginación
     Page<Category> findByStatus(char status, Pageable pageable);
    
}
