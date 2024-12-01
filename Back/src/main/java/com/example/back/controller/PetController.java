package com.example.back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.back.entity.Pet;
import com.example.back.service.PetService;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;


@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public ResponseEntity<Page<Pet>> getPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets = petService.getPetsByStatus(pageable);
        return ResponseEntity.ok(pets);
    }

    

    @GetMapping("/{petId}")
    public ResponseEntity<?> getPetById(@PathVariable Long petId) {
        Optional<Pet> pet = petService.getPet(petId);
        if (pet.isPresent()) {
            return ResponseEntity.ok(pet.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mascota no encontrada.");
        }
    }

    //Pets de un cliente
    @GetMapping("/client")
    public ResponseEntity<Page<Pet>> getActivePetsByClientId(
            @RequestParam Long clientId,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets = petService.getActivePetsByClientId(clientId, pageable);
        return ResponseEntity.ok(pets);
    }

    @PutMapping("/update/{petId}")
    public ResponseEntity<String> updatePet(@PathVariable Long petId, @RequestBody Pet pet) {
        try {
            pet.setIdPet(petId);
            petService.updatePet(pet);
            return ResponseEntity.ok("Mascota actualizada exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la mascota.");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPets(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String raceName,
            @RequestParam(required = false) String petName,
            @RequestParam(required = false) Character status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets = petService.searchPets(dni, raceName, petName, status, pageable);

        if (pets.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron mascotas que coincidan con los criterios de búsqueda.",
                "totalPages", 0,
                "totalElements", 0
            ));
        }

        return ResponseEntity.ok(Map.of(
            "content", pets.getContent(),
            "message", "Mascotas encontradas con éxito.",
            "totalPages", pets.getTotalPages(),
            "totalElements", pets.getTotalElements()
        ));
    }


    @PostMapping
    public ResponseEntity<String> createPet(@RequestBody Pet pet) {
        try {
            petService.savePet(pet);
            return ResponseEntity.status(HttpStatus.CREATED).body("Mascota creada exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la mascota.");
        }
    }

    @PutMapping("/{petId}/block")
    public ResponseEntity<String> blockPet(@PathVariable Long petId) {
        boolean isBlocked = petService.blockPet(petId);
        if (isBlocked) {
            return ResponseEntity.ok("Mascota bloqueada exitosamente.");
        } else {
            return ResponseEntity.status(400).body("Error al bloquear la mascota.");
        }
    }

    // Endpoint para obtener el total de mascotas activas
    @GetMapping("/active/total")
    public ResponseEntity<Long> getTotalActivePets() {
        long totalActivePets = petService.getTotalActivePets();
        return ResponseEntity.ok(totalActivePets);
    }

    //obtener id y nombre de pets por client id
    @GetMapping("/{clientId}/active")
    public ResponseEntity<List<Map<String, Object>>> getActivePetsForClient(@PathVariable Long clientId) {
        List<Map<String, Object>> activePets = petService.getActivePetsForClient(clientId);
        return ResponseEntity.ok(activePets);
    }

    //buscar un pet por id(name y status)
    @GetMapping("/{petId}/status")
    public ResponseEntity<String> getPetStatus(@PathVariable Long petId) {
        try {
            String message = petService.getPetNameById(petId);
            return ResponseEntity.ok(message);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mascota no encontrada.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la solicitud.");
        }
    }
}
