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

import com.example.back.entity.Especie;
import com.example.back.service.EspecieService;

@RestController
@RequestMapping("/api/especies")
public class EspecieController {

    @Autowired
    private EspecieService especieService;

    @GetMapping("/search")
    public ResponseEntity<?> searchEspecies(@RequestParam String name) {
        List<Especie> especies = especieService.searchEspeciesByName(name);
        if (especies.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron especies que coincidan con el criterio de búsqueda."
            ));
        }
        return ResponseEntity.ok(Map.of(
            "content", especies,
            "message", "Especies encontradas con éxito."
        ));
    }

    
    // Crear una nueva especie
    @PostMapping
    public Especie createEspecie(@RequestBody Especie especie) {
        return especieService.createEspecie(especie);
    }

    // Actualizar una especie existente
    @PutMapping("/{idEspecie}")
    public Especie updateEspecie(@PathVariable Long idEspecie, @RequestBody Especie especie) {
        return especieService.updateEspecie(idEspecie, especie);
    }

    // Obtener una especie por ID
    @GetMapping("/{idEspecie}")
    public Especie getEspecieById(@PathVariable Long idEspecie) {
        return especieService.getEspecieById(idEspecie);
    }

    // Listar especies activas con paginación
    @GetMapping
    public Page<Especie> listActiveEspecies(Pageable pageable) {
        return especieService.listActiveEspecies(pageable);
    }

    // Bloquear una especie
    @PatchMapping("/{idEspecie}/block")
    public void blockEspecie(@PathVariable Long idEspecie) {
        especieService.blockEspecie(idEspecie);
    }

}

