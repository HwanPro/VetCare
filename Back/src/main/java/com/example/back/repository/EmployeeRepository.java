package com.example.back.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Employee;

import jakarta.transaction.Transactional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e WHERE " +
            "(:dni IS NULL OR e.dni LIKE %:dni%) AND " +
            "(:status IS NULL OR e.status = :status) AND " +
            "(:role IS NULL OR e.rol.name LIKE %:role%) AND " +
            "(:name IS NULL OR (e.firstName LIKE %:name% OR e.preName LIKE %:name%))")
    Page<Employee> searchEmployees(
            @Param("dni") String dni,
            @Param("status") Character status,
            @Param("role") String role,
            @Param("name") String name,
            Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Employee e SET e.status = '0' WHERE e.id = :employeeId")
    int blockEmployee(@Param("employeeId") Long employeeId);

    Optional<Employee> findByUser_IdUser(Long userId); 


    boolean existsByDni(String dni);

    boolean existsByCellphone(String cellphone);

    boolean existsByCmvp(String cmvp);

        @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
        "FROM Employee e WHERE e.cellphone = :cellphone AND e.idEmployee != :id")
        boolean existsByCellphoneAndNotId(@Param("cellphone") String cellphone, @Param("id") Long id);

        @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
        "FROM Employee e WHERE e.cmvp = :cmvp AND e.idEmployee != :id")
        boolean existsByCmvpAndNotId(@Param("cmvp") String cmvp, @Param("id") Long id);

}
