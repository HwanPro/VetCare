package com.example.back.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.service.ReniecService;

@RestController
@RequestMapping("/api/dni")
public class ReniecController {

    private final ReniecService reniecService;

    public ReniecController(ReniecService reniecService) {
        this.reniecService = reniecService;
    }

    @GetMapping("/{dni}")
    public ResponseEntity<Map<String, String>> consultarDni(@PathVariable String dni) {
        try {
            // Llamar al servicio para obtener la respuesta procesada
            Map<String, String> response = reniecService.consultarDni(dni);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Manejo de errores personalizados
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Manejo de otros errores no previstos
            return ResponseEntity.status(500).body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }
}
