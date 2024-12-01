package com.example.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    
        // Método para obtener roles con status 1
    @Query("SELECT r FROM Rol r WHERE r.status = '1'")
    List<Rol> findActiveRoles();

}
