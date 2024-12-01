package com.example.back.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Quote;

import jakarta.transaction.Transactional;


@Repository
public interface QuoteRepository extends JpaRepository<Quote,Long>{
    
    @Query("SELECT q FROM Quote q WHERE " +
           "(:date IS NULL OR q.date = :date) AND " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:dni IS NULL OR q.pet.client.dni LIKE %:dni%) AND " +
           "(:serviceName IS NULL OR q.service.name LIKE %:serviceName%)")
    Page<Quote> searchQuotes(@Param("date") LocalDate date,
                             @Param("status") Character status,
                             @Param("dni") String dni,
                             @Param("serviceName") String serviceName,
                             Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Quote q SET q.status = '0' WHERE q.idQuote = :quoteId")
    int cancelQuote(@Param("quoteId") Long quoteId);

    @Transactional
    @Modifying
    @Query("UPDATE Quote q SET q.status = '3' WHERE q.idQuote = :quoteId")
    int confirmQuote(@Param("quoteId") Long quoteId);

    @Transactional
    @Modifying
    @Query("UPDATE Quote q SET q.statusPag = '2' WHERE q.idQuote = :quoteId")
    int confirmPayment(@Param("quoteId") Long quoteId);



    @Query("SELECT q FROM Quote q WHERE " +
            "q.pet.client.idClient = :clientId AND " + 
            "q.status = '1' ORDER BY q.date ASC")
    Page<Quote> findActiveQuotesByClientId(@Param("clientId") Long clientId, Pageable pageable);


    @Query(value = "SELECT q.id_quote AS idQuote, q.hour AS hour, q.date AS date, q.status AS status, " +
               "q.status_pag AS statusPag, p.name AS petName, s.name AS serviceName, " +
               "c.first_name AS clientFirstName, c.first_last_name AS clientFirstLastName " +
               "FROM vc_tbqu q " +
               "JOIN vc_tbpe p ON q.pet_id = p.id_pet " +
               "JOIN vc_tbse s ON q.service_id = s.id_service " +
               "JOIN vc_tbcl c ON p.client_id = c.id_client " +
               "WHERE q.status = :status", nativeQuery = true)
    List<Map<String, Object>> findActiveQuotes(@Param("status") String status);

    // Total de citas activas
    @Query(value = "SELECT COUNT(*) FROM vc_tbqu WHERE status = '1'", nativeQuery = true)
    long countActiveQuotes();

    // Total de citas activas de hoy
    @Query(value = "SELECT COUNT(*) FROM vc_tbqu WHERE status = '1' AND date = CURRENT_DATE", nativeQuery = true)
    long countTodayActiveQuotes();

    /*---------------------Cliente-------------------- */

    //Contenido para el citas del calendar
    @Query(value = "SELECT q.id_quote AS idQuote, q.hour AS hour, q.date AS date, q.status AS status, q.status_pag AS statusPag, p.name AS petName, s.name AS serviceName FROM vc_tbqu q JOIN vc_tbpe p ON q.pet_id = p.id_pet JOIN vc_tbse s ON q.service_id = s.id_service WHERE q.status = '1' AND p.client_id = :clientId", nativeQuery = true)
        List<Map<String, Object>> findActiveQuotesByClientId(@Param("clientId") Long clientId);

        // Total de citas activas para un cliente específico
    @Query(value = "SELECT COUNT(*) FROM vc_tbqu q JOIN vc_tbpe p ON q.pet_id = p.id_pet WHERE q.status = '1' AND p.client_id = :clientId", nativeQuery = true)
    long countActiveQuotesByClientId(@Param("clientId") Long clientId);

    // Total de citas activas de hoy para un cliente específico
    @Query(value = "SELECT COUNT(*) FROM vc_tbqu q JOIN vc_tbpe p ON q.pet_id = p.id_pet WHERE q.status = '1' AND q.date = CURRENT_DATE AND p.client_id = :clientId", nativeQuery = true)
    long countTodayActiveQuotesByClientId(@Param("clientId") Long clientId);



    //VALIDAR DISPONIBILIDAD DE UNA CITA

    @Query("SELECT CASE WHEN (SELECT COUNT(q) " +
       "                FROM Quote q " +
       "                JOIN q.service s " +
       "                WHERE s.category.idCategory = " +
       "                      (SELECT s2.category.idCategory " +
       "                       FROM ServiceEntity s2 " +
       "                       WHERE s2.idService = :serviceId) " +
       "                AND q.date = :date " +
       "                AND q.hour = :hour " +
       "                AND q.status = '1') < " +
       "       (SELECT c.capacity " +
       "        FROM Category c " +
       "        JOIN ServiceEntity s3 ON s3.category.idCategory = c.idCategory " +
       "        WHERE s3.idService = :serviceId) " +
       "THEN true ELSE false END")
    Boolean isCategoryAvailableForService(@Param("serviceId") Long serviceId,
                                        @Param("date") LocalDate date,
                                        @Param("hour") LocalTime hour);


}
