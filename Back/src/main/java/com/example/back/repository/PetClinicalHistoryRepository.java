package com.example.back.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.PetClinicalHistory;

import jakarta.transaction.Transactional;

@Repository
public interface PetClinicalHistoryRepository extends JpaRepository<PetClinicalHistory, Long> {

    @Query("SELECT p FROM PetClinicalHistory p " +
            "WHERE p.pet.id = :petId AND p.status <> '0' " +
            "ORDER BY p.status ASC, p.registrationDate DESC")
    Page<PetClinicalHistory> findActiveHistoryByPetId(
            @Param("petId") Long petId,
            Pageable pageable
    );

        @Transactional
        @Modifying
        @Query("UPDATE PetClinicalHistory p SET p.status = '0' WHERE p.idHistory = :historyId")
        int blockPet(@Param("historyId") Long historyId);

}