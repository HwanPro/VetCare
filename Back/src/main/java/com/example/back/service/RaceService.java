package com.example.back.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.entity.Especie;
import com.example.back.entity.Race;
import com.example.back.repository.RaceRepository;

@Service
public class RaceService {
     @Autowired
    private RaceRepository raceRepository;

    public List<Race> searchRacesByName(String name) {
        return raceRepository.findByNameContainingIgnoreCase(name);
    }

    // Crear una nueva raza
    public Race createRace(Race race) {
        race.setStatus('1'); // Aseguramos que la raza se cree como activa
        return raceRepository.save(race);
    }

    // Actualizar una raza existente
    public Race updateRace(Long idRace, Race updatedRace) {
        Optional<Race> raceOpt = raceRepository.findById(idRace);
        if (raceOpt.isEmpty()) {
            throw new RuntimeException("Raza no encontrada");
        }
        Race race = raceOpt.get();
        race.setName(updatedRace.getName());
        race.setEspecie(updatedRace.getEspecie());
        return raceRepository.save(race);
    }

    // Obtener una raza por ID
    public Race getRaceById(Long idRace) {
        Optional<Race> raceOpt = raceRepository.findById(idRace);
        if (raceOpt.isEmpty()) {
            throw new RuntimeException("Raza no encontrada");
        }
        return raceOpt.get();
    }

    // Listar razas activas con paginación
    public Page<Race> listActiveRaces(Pageable pageable) {
        return raceRepository.findByStatus('1', pageable);
    }


    // Bloquear una raza (cambiar status a '0')
    public void blockRace(Long idRace) {
        Optional<Race> raceOpt = raceRepository.findById(idRace);
        if (raceOpt.isEmpty()) {
            throw new RuntimeException("Raza no encontrada");
        }
        Race race = raceOpt.get();
        race.setStatus('0'); // Cambia el estado a inactivo
        raceRepository.save(race);
    }
}
