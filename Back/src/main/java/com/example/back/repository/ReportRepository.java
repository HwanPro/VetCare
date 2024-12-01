package com.example.back.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.back.entity.Quote;

public interface ReportRepository extends JpaRepository<Quote, Long> {

    @Query("SELECT q FROM Quote q WHERE " +
    "(:startDate IS NULL AND :endDate IS NULL OR " +
    " (:startDate IS NOT NULL AND :endDate IS NULL AND q.date >= :startDate) OR " +
    " (:startDate IS NULL AND :endDate IS NOT NULL AND q.date <= :endDate) OR " +
    " (:startDate IS NOT NULL AND :endDate IS NOT NULL AND q.date BETWEEN :startDate AND :endDate)) AND " +
    "(:status IS NULL OR q.status = :status) AND " +
    "(:statusPag IS NULL OR q.statusPag = :statusPag) AND " +
    "(:metPag IS NULL OR q.metPag.name LIKE %:metPag%) AND " +
    "(:species IS NULL OR q.pet.race.especie.name LIKE %:species%) AND " +
    "(:serviceName IS NULL OR q.service.name LIKE %:serviceName%) " +
    "ORDER BY q.date DESC")
    Page<Quote> getAppointmentReport(@Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate,
                               @Param("status") Character status,
                               @Param("statusPag") String statusPag,
                               @Param("metPag") String metPag,
                               @Param("species") String species,
                               @Param("serviceName") String serviceName,
                               Pageable pageable);

                               @Query("SELECT q FROM Quote q WHERE " +
                               "(:startDate IS NULL AND :endDate IS NULL OR " +
                               " (:startDate IS NOT NULL AND :endDate IS NULL AND q.date >= :startDate) OR " +
                               " (:startDate IS NULL AND :endDate IS NOT NULL AND q.date <= :endDate) OR " +
                               " (:startDate IS NOT NULL AND :endDate IS NOT NULL AND q.date BETWEEN :startDate AND :endDate)) AND " +
                               "(:status IS NULL OR q.status = :status) AND " +
                               "(:statusPag IS NULL OR q.statusPag = :statusPag) AND " +
                               "(:metPag IS NULL OR q.metPag.name LIKE %:metPag%) AND " +
                               "(:species IS NULL OR q.pet.race.especie.name LIKE %:species%) AND " +
                               "(:serviceName IS NULL OR q.service.name LIKE %:serviceName%) " +
                               "ORDER BY q.date DESC")
                               List<Quote> getDataReport(@Param("startDate") LocalDate startDate,
                                                          @Param("endDate") LocalDate endDate,
                                                          @Param("status") Character status,
                                                          @Param("statusPag") String statusPag,
                                                          @Param("metPag") String metPag,
                                                          @Param("species") String species,
                                                          @Param("serviceName") String serviceName
                                                          );
                           
    
}
