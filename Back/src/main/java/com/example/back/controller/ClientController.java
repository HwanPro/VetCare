package com.example.back.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.Client;
import com.example.back.service.ClientService;



@RestController
@RequestMapping("/api/clients")
public class ClientController {
    
    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<Page<Client>> getClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Client> clients = clientService.getClientsByStatus(pageable);
        return ResponseEntity.ok(clients);
    }   

    @GetMapping("/{clientId}")
    public Optional<Client> getById(@PathVariable("clientId") Long clientId){
        return clientService.getClient(clientId);
    }

    @PutMapping("/update/{clientId}")
    public ResponseEntity<String> updateClient(@PathVariable Long clientId, @RequestBody Client client) {
        try {
            client.setIdClient(clientId); // Asegúrate de establecer el ID del cliente
            clientService.updateClient(client);
            return ResponseEntity.ok("Cliente actualizado exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el cliente.");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchClients(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) Character status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Pageable pageable = PageRequest.of(page, size); // Configuración de paginación
        Page<Client> clients = clientService.searchClients(dni, name, lastName, status, pageable);

        if (clients.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron clientes que coincidan con los criterios de búsqueda.",
                "totalPages", 0,
                "totalElements", 0
            ));
        }

        return ResponseEntity.ok(Map.of(
            "content", clients.getContent(),
            "message", "Clientes encontrados con éxito.",
            "totalPages", clients.getTotalPages(),
            "totalElements", clients.getTotalElements()
        ));
    }

    @PutMapping("/{clientId}/block")
    public ResponseEntity<String> blockClient(@PathVariable Long clientId) {
        boolean isBlocked = clientService.blockClient(clientId);
        if (isBlocked) {
            return ResponseEntity.ok("Cliente Bloqueado exitosamente.");
        } else {
            return ResponseEntity.status(400).body("Error al bloquear al cliente.");
        }
    }

    @GetMapping("/findByDni")
    public ResponseEntity<?> findClientByDni(@RequestParam String dni) {
        Optional<Client> client = clientService.findByDni(dni);
        if (client.isPresent()) {
            return ResponseEntity.ok(client.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
        }
    }

    @PostMapping
    public ResponseEntity<Client> createClientWithUser(@RequestBody Client client) {
        try {
            // Llama al servicio para crear el cliente y su usuario
            Client savedClient = clientService.createClientWithUser(client);
            return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Manejo de errores de validación
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Manejo de errores generales
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{clientId}")
    public void delete(@PathVariable("clientId") Long clientId){
        clientService.delete(clientId);
    }

    @GetMapping("/firstname")
    public ResponseEntity<?> getFirstNameByDni(@RequestParam String dni) {
        String firstName = clientService.getFirstNameByDni(dni);
        if (firstName == null) {
            return ResponseEntity.ok(new String[0]); // Devuelve un arreglo vacío si no existe
        }
        return ResponseEntity.ok(new String[]{firstName}); // Devuelve el nombre en un arreglo
    }

    // Validar si el número de celular ya está en uso
    @GetMapping("/cellphone-exists")
    public ResponseEntity<Boolean> checkCellphoneExists(@RequestParam String cellphone) {
        boolean exists = clientService.cellphoneExists(cellphone);
        return ResponseEntity.ok(exists);
    }

    // Validar si el número de celular ya está en uso excluyendo un ID
    @GetMapping("/update/cellphone-exists")
    public ResponseEntity<Boolean> checkCellphoneExistsExcludingId(@RequestParam String cellphone, @RequestParam Long id) {
        boolean exists = clientService.cellphoneExistsExcludingId(cellphone, id);
        return ResponseEntity.ok(exists);
    }
    
    // Validar si el DNI ya está en uso excluyendo un ID
    @GetMapping("/update/dni-exists")
    public ResponseEntity<Boolean> checkDniExistsExcludingId(@RequestParam String dni, @RequestParam Long id) {
        boolean exists = clientService.dniExistsExcludingId(dni, id);
        return ResponseEntity.ok(exists);
    }

}
