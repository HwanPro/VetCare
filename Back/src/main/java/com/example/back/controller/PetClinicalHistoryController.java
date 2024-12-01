package com.example.back.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.PetClinicalHistory;
import com.example.back.service.PetClinicalHistoryService;


@RestController
@RequestMapping("/api/pet-clinical-history")
public class PetClinicalHistoryController {
    
    @Autowired
    private PetClinicalHistoryService historyService;

    @GetMapping("/{petId}")
    public ResponseEntity<Page<PetClinicalHistory>> getHistoryByPetId(
            @PathVariable Long petId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Page<PetClinicalHistory> historyPage = historyService.getPaginatedHistoryByPetId(petId, page, size);
        return ResponseEntity.ok(historyPage);
    }

    @PutMapping("/{historyId}/block")
    public ResponseEntity<String> blockHistory(@PathVariable Long historyId) {
        boolean isBlocked = historyService.blockHistory(historyId);
        if (isBlocked) {
            return ResponseEntity.ok("Historia eliminada exitosamente.");
        } else {
            return ResponseEntity.status(400).body("Error eliminar.");
        }
    }

    @GetMapping("search/{historyId}")
    public ResponseEntity<?> getHistoryById(@PathVariable Long historyId) {
        Optional<PetClinicalHistory> history = historyService.getHistory(historyId);
        if (history.isPresent()) {
            return ResponseEntity.ok(history.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Historial no encontrada.");
        }
    }

    // Guardar un nuevo historial clínico
    @PostMapping
    public ResponseEntity<?> saveHistory(@RequestBody PetClinicalHistory history) {
        try {
            historyService.saveHistory(history);
            return ResponseEntity.status(HttpStatus.CREATED).body("Historial clínico creado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al guardar el historial clínico: " + e.getMessage());
        }
    }

    // Actualizar un historial clínico existente
    @PutMapping("/{idHistory}")
    public ResponseEntity<?> updateHistory(
            @PathVariable Long idHistory,
            @RequestBody PetClinicalHistory updatedHistory) {
        try {
            updatedHistory.setIdHistory(idHistory); // Asegurar que se actualice el historial correcto
            historyService.updateClinicalHistory(updatedHistory);
            return ResponseEntity.ok("Historial clínico actualizado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el historial clínico: " + e.getMessage());
        }
    }

}
