package com.example.back.controller;

import java.util.List;

import com.example.back.entity.ServiceEntity;
import com.example.back.service.ServiceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<Page<ServiceEntity>> getServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceEntity> services = serviceService.getServicesByStatus(pageable);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable Long serviceId) {
        Optional<ServiceEntity> service = serviceService.getService(serviceId);
        return service.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createService(@RequestBody ServiceEntity serviceEntity) {
        try {
            serviceService.saveService(serviceEntity);
            return ResponseEntity.status(HttpStatus.CREATED).body("Servicio creado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el servicio.");
        }
    }

    @PutMapping("/update/{serviceId}")
    public ResponseEntity<String> updateService(@PathVariable Long serviceId, @RequestBody ServiceEntity serviceEntity) {
        try {
            serviceEntity.setIdService(serviceId);
            serviceService.updateService(serviceEntity);
            return ResponseEntity.ok("Servicio actualizado exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el servicio.");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchServices(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String especieName,
            @RequestParam(required = false) Character status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceEntity> services = serviceService.searchServices(name, categoryName, especieName, status, pageable);

        if (services.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "content", List.of(),
                    "message", "No se encontraron servicios que coincidan con los criterios de búsqueda.",
                    "totalPages", 0,
                    "totalElements", 0
            ));
        }

        return ResponseEntity.ok(Map.of(
                "content", services.getContent(),
                "message", "Servicios encontrados con éxito.",
                "totalPages", services.getTotalPages(),
                "totalElements", services.getTotalElements()
        ));
    }

    @PutMapping("/{serviceId}/block")
    public ResponseEntity<String> blockService(@PathVariable Long serviceId) {
        try {
            boolean isBlocked = serviceService.blockService(serviceId);
            if (isBlocked) {
                return ResponseEntity.ok("Servicio bloqueado exitosamente.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Servicio no encontrado o ya bloqueado.");
            }
        } catch (Exception e) {
            // Log de error detallado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al bloquear el servicio: " + e.getMessage());
        }
    }


    @GetMapping("/searchName")
    public ResponseEntity<?> searchServices(@RequestParam String name) {
        List<ServiceEntity> services = serviceService.searchServicesByName(name);
        if (services.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron servicios que coincidan con el criterio de búsqueda."
            ));
        }
        return ResponseEntity.ok(Map.of(
            "content", services,
            "message", "Servicio encontrado con éxito."
        ));
    }
}
