package com.example.back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.back.entity.Student;

@Repository
public interface  StudentRepository extends JpaRepository<Student, Long> {

    //buscar por caracteristicas
    Optional<List<Student>> findByFistNameOrSecondName(String fistName, String secondName);
    
}
