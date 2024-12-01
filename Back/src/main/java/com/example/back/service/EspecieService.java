package com.example.back.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.entity.Especie;
import com.example.back.repository.EspecieRepository;

@Service
public class EspecieService {
    
    @Autowired
    private EspecieRepository especieRepository;

    public List<Especie> searchEspeciesByName(String name) {
        return especieRepository.findByNameContainingIgnoreCase(name);
    }

    // Crear una nueva especie
    public Especie createEspecie(Especie especie) {
        especie.setStatus('1'); // Aseguramos que la especie se cree como activa
        return especieRepository.save(especie);
    }

    // Actualizar una especie existente
    public Especie updateEspecie(Long idEspecie, Especie updatedEspecie) {
        Optional<Especie> especieOpt = especieRepository.findById(idEspecie);
        if (especieOpt.isEmpty()) {
            throw new RuntimeException("Especie no encontrada");
        }
        Especie especie = especieOpt.get();
        especie.setName(updatedEspecie.getName());
        return especieRepository.save(especie);
    }

    // Listar especies activas con paginación
    public Page<Especie> listActiveEspecies(Pageable pageable) {
        return especieRepository.findByStatus('1', pageable);
    }

    // Bloquear una especie (cambiar status a '0')
    public void blockEspecie(Long idEspecie) {
        Optional<Especie> especieOpt = especieRepository.findById(idEspecie);
        if (especieOpt.isEmpty()) {
            throw new RuntimeException("Especie no encontrada");
        }
        Especie especie = especieOpt.get();
        especie.setStatus('0'); // Cambia el estado a inactivo
        especieRepository.save(especie);
    }
     // Obtener una especie por ID
     public Especie getEspecieById(Long idEspecie) {
        Optional<Especie> especieOpt = especieRepository.findById(idEspecie);
        if (especieOpt.isEmpty()) {
            throw new RuntimeException("Especie no encontrada");
        }
        return especieOpt.get();
    }
}
