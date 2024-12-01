package com.example.back.service;

import com.example.back.entity.ServiceEntity;
import com.example.back.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public Page<ServiceEntity> getServicesByStatus(Pageable pageable) {
        return serviceRepository.findByStatus('1', pageable);
    }

    public Optional<ServiceEntity> getService(Long id) {
        return serviceRepository.findById(id);
    }

    public void saveService(ServiceEntity serviceEntity) {
        serviceRepository.save(serviceEntity);
    }

    public void updateService(ServiceEntity updatedService) {
        Optional<ServiceEntity> existingServiceOpt = serviceRepository.findById(updatedService.getIdService());

        if (existingServiceOpt.isPresent()) {
            ServiceEntity existingService = existingServiceOpt.get();

            // Actualiza solo los campos necesarios
            existingService.setName(updatedService.getName());
            existingService.setDescription(updatedService.getDescription());
            existingService.setRecommendedAge(updatedService.getRecommendedAge());
            existingService.setRecommendedFrequency(updatedService.getRecommendedFrequency());
            existingService.setPrice(updatedService.getPrice());
            existingService.setDirImage(updatedService.getDirImage());
            existingService.setStatus(updatedService.getStatus());

            // Actualiza asociaciones
            if (updatedService.getCategory() != null) {
                existingService.setCategory(updatedService.getCategory());
            }
            if (updatedService.getEspecie() != null) {
                existingService.setEspecie(updatedService.getEspecie());
            }

            serviceRepository.save(existingService);
        } else {
            throw new IllegalArgumentException("El servicio con el ID proporcionado no existe");
        }
    }

    public Page<ServiceEntity> searchServices(String name, String categoryName, String especieName, Character status, Pageable pageable) {
        return serviceRepository.searchServices(name, categoryName, especieName, status, pageable);
    }

    public boolean blockService(Long serviceId) {
        int rowsAffected = serviceRepository.blockService(serviceId);

        if (rowsAffected > 0) {
            return true; // El servicio fue bloqueado exitosamente
        } else {
            throw new IllegalArgumentException("El servicio con ID " + serviceId + " no fue encontrado o ya estaba bloqueado.");
        }
    }

    public List<ServiceEntity> searchServicesByName(String name) {
        return serviceRepository.findByNameContainingIgnoreCase(name);
    }
}

