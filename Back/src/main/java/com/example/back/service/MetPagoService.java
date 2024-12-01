package com.example.back.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back.entity.MetPag;
import com.example.back.repository.MetPagoRepository;

@Service
public class MetPagoService {
    
    @Autowired
    private MetPagoRepository metPagoRepository;

    public List<MetPag> getActiveMetPagos() {
        return metPagoRepository.findByStatus('1');
    }

}
