package com.example.back.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Pet;

import jakarta.transaction.Transactional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

        @Query("SELECT p FROM Pet p WHERE " +
        "(:dni IS NULL OR p.client.dni = :dni) AND " +
        "(:raceName IS NULL OR p.race.name LIKE %:raceName%) AND " +
        "(:petName IS NULL OR p.name LIKE %:petName%) AND " +
        "(:status IS NULL OR p.status = :status)")
        Page<Pet> searchPets(@Param("dni") String dni,
                @Param("raceName") String raceName,
                @Param("petName") String petName,
                @Param("status") Character status,
                Pageable pageable);

        Page<Pet> findByStatus(Character status, Pageable pageable);

        @Transactional
        @Modifying
        @Query("UPDATE Pet p SET p.status = '0' WHERE p.idPet = :petId")
        int blockPet(@Param("petId") Long petId);


        @Query("SELECT p FROM Pet p WHERE " +
                "p.client.idClient = :clientId AND " + 
                "p.status = '1'")
        Page<Pet> findActivePetsByClientId(@Param("clientId") Long clientId, Pageable pageable);

        
        // Total de pets activas de hoy
        @Query(value = "SELECT COUNT(*) FROM vc_tbpe WHERE status = '1'", nativeQuery = true)
        long countTodayActivePets();

        // id y nombre de los pets por client
        @Query(value = "SELECT id_pet AS id, name AS name FROM vc_tbpe WHERE status = '1' AND client_id = :clientId", nativeQuery = true)
        List<Map<String, Object>> PetsActiveForClient(@Param("clientId") Long clientId);

        @Query("SELECT p.name, p.status FROM Pet p WHERE p.id = :petId")
        Optional<Object[]> findPetNameAndStatusById(@Param("petId") Long petId);
}
