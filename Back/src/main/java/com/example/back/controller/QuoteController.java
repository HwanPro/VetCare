package com.example.back.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.example.back.entity.Quote;
import com.example.back.service.QuoteService;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {
    
    @Autowired
    private QuoteService quoteService;

    @GetMapping
    public List<Quote> getAll(){
        return quoteService.getQuotes();
    }

    //obtener datos de una cita (id)
    @GetMapping("/{quoteId}")
    public Optional<Quote> getById(@PathVariable ("quoteId") Long quoteId){
        return quoteService.getQuote(quoteId);
    }

// Crear cita
    @PostMapping("/create")
    public ResponseEntity<String> createQuote(@RequestBody Quote quote) {
        try {
            // Intentar crear la cita
            Quote savedQuote = quoteService.createQuote(quote);

            // Responder con éxito si se guarda la cita
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Cita agregada correctamente con ID: " + savedQuote.getIdQuote());
        } catch (IllegalStateException e) {
            // Responder con un conflicto si se alcanza la capacidad máxima
            System.err.println("Error de disponibilidad: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            // Manejar errores generales inesperados
            System.err.println("Error al procesar la solicitud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la solicitud. Por favor, intente nuevamente.");
        }
    }


    //actualizar datos de cita
    @PutMapping("/update/{quoteId}")
    public ResponseEntity<String> updateQuote(@PathVariable Long quoteId, @RequestBody Quote updatedQuote) {
        try {
            quoteService.updateQuote(quoteId, updatedQuote);
            return ResponseEntity.ok("Cita actualizada exitosamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la cita.");
        }
    }

    //metodo paginacion y buscar citas
    @GetMapping("/search")
    public ResponseEntity<?> searchQuotes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Character status,
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) String serviceName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Quote> quotes = quoteService.searchQuotes(date, status, dni, serviceName, pageable);

        if (quotes.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "content", List.of(),
                "message", "No se encontraron citas con los criterios proporcionados."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "content", quotes.getContent(),
            "totalPages", quotes.getTotalPages(),
            "message", "Citas encontradas con éxito."
        ));
    }

    //Cancelar cita
    @PutMapping("/{quoteId}/cancel")
    public ResponseEntity<?> cancelQuote(@PathVariable Long quoteId) {
        try {
            quoteService.cancelQuote(quoteId);
            return ResponseEntity.ok("Cita cancelada con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //Confirmar que llego a la cita
    @PutMapping("/{quoteId}/confirm")
    public ResponseEntity<?> confirmQuote(@PathVariable Long quoteId) {
        try {
            quoteService.confirmQuote(quoteId);
            return ResponseEntity.ok("Cita confirmada con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    //confirmar pago

    @PutMapping("/{quoteId}/confirm-payment")
    public ResponseEntity<?> confirmPayment(@PathVariable Long quoteId) {
        try {
            quoteService.confirmPayment(quoteId);
            return ResponseEntity.ok("Pago confirmado con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    //citas de un cliente
    @GetMapping("/client")
    public ResponseEntity<Page<Quote>> getActiveQuotesByClientId(
            @RequestParam Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quote> quotes = quoteService.getActiveQuotesByClientId(clientId, pageable);
        return ResponseEntity.ok(quotes);
    }


    //Citas activas para el full Calendar del Empleado
    @GetMapping("/employee/calendar")
    public ResponseEntity<?> getActiveQuotes() {
        try {
            List<Map<String, Object>> activeQuotes = quoteService.getActiveQuotes();
            return ResponseEntity.ok(activeQuotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al recuperar las citas activas: " + e.getMessage());
        }
    }


    // Total de citas activas
    @GetMapping("/active/total")
    public ResponseEntity<Long> getTotalActiveQuotes() {
        long total = quoteService.getTotalActiveQuotes();
        return ResponseEntity.ok(total);
    }

    // Citas activas de hoy
    @GetMapping("/active/today")
    public ResponseEntity<Long> getTodayActiveQuotes() {
        long todayTotal = quoteService.getTodayActiveQuotes();
        return ResponseEntity.ok(todayTotal);
    }


    
    /*---------------------Cliente-------------------- */

    //Contenido para el citas del calendar
    @GetMapping("/{clientId}/active")
    public ResponseEntity<?> getActiveQuotesByClientId(@PathVariable Long clientId) {
        try {
            List<Map<String, Object>> activeQuotes = quoteService.getActiveQuotesByClientId(clientId);
            if (activeQuotes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontraron citas activas para el cliente con ID: " + clientId);
            }
            return ResponseEntity.ok(activeQuotes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al recuperar las citas activas: " + e.getMessage());
        }
    }


    // Total de citas activas para un cliente específico
    @GetMapping("/{clientId}/active/total")
    public ResponseEntity<Long> getTotalActiveQuotesByClientID(@PathVariable Long clientId) {
        long total = quoteService.getActiveQuotesByClientID(clientId);
        return ResponseEntity.ok(total);
    }

    // Total de citas activas de hoy para un cliente específico
    @GetMapping("/{clientId}/active/hoy")
    public ResponseEntity<Long> getTodayActiveQuotesByClientId(@PathVariable Long clientId) {
        long totalToday = quoteService.getTodayActiveQuotesByClientId(clientId);
        return ResponseEntity.ok(totalToday);
    }

}
