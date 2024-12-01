package com.example.back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.MetPag;
import com.example.back.service.MetPagoService;

@RestController
@RequestMapping("/api/metpags")
public class MetPagoController {
    
    @Autowired
    private MetPagoService metPagoService;

    @GetMapping("/active")
    public ResponseEntity<List<MetPag>> getActiveMetPagos() {
        List<MetPag> activeMetPagos = metPagoService.getActiveMetPagos();
        return ResponseEntity.ok(activeMetPagos);
    }

}
