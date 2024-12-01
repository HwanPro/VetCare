package com.example.back.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.ServiceEntity;

import jakarta.transaction.Transactional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    
        @Query("SELECT s FROM ServiceEntity s WHERE " +
        "(:name IS NULL OR s.name LIKE %:name%) AND " +
        "(:categoryName IS NULL OR s.category.name LIKE %:categoryName%) AND " +
        "(:especieName IS NULL OR s.especie.name LIKE %:especieName%) AND " +
        "(:status IS NULL OR s.status = :status)")
        Page<ServiceEntity> searchServices(@Param("name") String name,
                                    @Param("categoryName") String categoryName,
                                    @Param("especieName") String especieName,
                                    @Param("status") Character status,
                                    Pageable pageable);

        Page<ServiceEntity> findByStatus(Character status, Pageable pageable);

        @Modifying
        @Transactional
        @Query("UPDATE ServiceEntity s SET s.status = '0' WHERE s.idService = :serviceId")
        int blockService(@Param("serviceId") Long serviceId);

        @Query("SELECT s FROM ServiceEntity s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
        List<ServiceEntity> findByNameContainingIgnoreCase(@Param("name") String name);
}
