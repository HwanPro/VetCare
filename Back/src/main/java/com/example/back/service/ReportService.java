package com.example.back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.repository.ReportRepository;

import java.time.LocalDate;
import java.util.List;

import com.example.back.entity.Quote;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Page<Quote> getAppointmentReport(LocalDate startDate, 
                                            LocalDate endDate, 
                                            Character status, 
                                            String statusPag, 
                                            String metPag, 
                                            String species, 
                                            String serviceName, 
                                            Pageable pageable) {
        return reportRepository.getAppointmentReport(startDate, endDate, status, statusPag, metPag, species, serviceName, pageable);
    }

    public List<Quote> getDataReport(LocalDate startDate, 
                                            LocalDate endDate, 
                                            Character status, 
                                            String statusPag, 
                                            String metPag, 
                                            String species, 
                                            String serviceName
                                            ) {
        return reportRepository.getDataReport(startDate, endDate, status, statusPag, metPag, species, serviceName);
    }

}


