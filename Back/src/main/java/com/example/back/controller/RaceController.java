package com.example.back.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.Race;
import com.example.back.service.RaceService;


@RestController
@RequestMapping("/api/races")
public class RaceController {
    @Autowired
    private RaceService raceService;

    @GetMapping("/search")
    public ResponseEntity<?> searchRaces(@RequestParam String name) {
        List<Race> races = raceService.searchRacesByName(name);
        if (races.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron razas que coincidan con el criterio de búsqueda."
            ));
        }
        return ResponseEntity.ok(Map.of(
            "content", races,
            "message", "Razas encontradas con éxito."
        ));
    }
        // Crear una nueva raza
    @PostMapping
    public Race createRace(@RequestBody Race race) {
        return raceService.createRace(race);
    }

    // Actualizar una raza existente
    @PutMapping("/{idRace}")
    public Race updateRace(@PathVariable Long idRace, @RequestBody Race race) {
        return raceService.updateRace(idRace, race);
    }

    // Obtener una raza por ID
    @GetMapping("/{idRace}")
    public Race getRaceById(@PathVariable Long idRace) {
        return raceService.getRaceById(idRace);
    }

    // Listar razas activas con paginación
    @GetMapping
    public Page<Race> listActiveRaces(Pageable pageable) {
        return raceService.listActiveRaces(pageable);
    }


    // Bloquear una raza
    @PatchMapping("/{idRace}/block")
    public void blockRace(@PathVariable Long idRace) {
        raceService.blockRace(idRace);
    }
}
