package com.example.back.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.entity.Pet;
import com.example.back.entity.PetClinicalHistory;
import com.example.back.entity.ServiceEntity;
import com.example.back.repository.PetClinicalHistoryRepository;
import com.example.back.repository.PetRepository;
import com.example.back.repository.ServiceRepository;

@Service
public class PetClinicalHistoryService {
    @Autowired
    private PetClinicalHistoryRepository historyRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ServiceRepository serviceRepository;    


    public Page<PetClinicalHistory> getPaginatedHistoryByPetId(Long petId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return historyRepository.findActiveHistoryByPetId(petId, pageable);
    }

    public boolean blockHistory(Long historyId) {
        int rowsUpdated = historyRepository.blockPet(historyId);
        return rowsUpdated > 0;
    }

    public Optional<PetClinicalHistory> getHistory(Long id) {
        return historyRepository.findById(id);
    }


    public void updateClinicalHistory(PetClinicalHistory updatedHistory) {
    Optional<PetClinicalHistory> existingHistoryOpt = historyRepository.findById(updatedHistory.getIdHistory());

        if (existingHistoryOpt.isPresent()) {
            PetClinicalHistory existingHistory = existingHistoryOpt.get();

            // Actualizar campos simples
            existingHistory.setDiagnostico(updatedHistory.getDiagnostico());
            existingHistory.setResultado(updatedHistory.getResultado());
            existingHistory.setRegistrationDate(updatedHistory.getRegistrationDate());
            existingHistory.setStatus(updatedHistory.getStatus());

            // Cargar y asignar Pet si no es null
            if (updatedHistory.getPet() != null && updatedHistory.getPet().getIdPet() != null) {
                Optional<Pet> petOpt = petRepository.findById(updatedHistory.getPet().getIdPet());
                if (petOpt.isPresent()) {
                    existingHistory.setPet(petOpt.get());
                } else {
                    throw new IllegalArgumentException("La mascota especificada no existe");
                }
            }

            // Cargar y asignar ServiceEntity si no es null
            if (updatedHistory.getServiceEntity() != null && updatedHistory.getServiceEntity().getIdService() != null) {
                Optional<ServiceEntity> serviceOpt = serviceRepository.findById(updatedHistory.getServiceEntity().getIdService());
                if (serviceOpt.isPresent()) {
                    existingHistory.setServiceEntity(serviceOpt.get());
                } else {
                    throw new IllegalArgumentException("El servicio especificado no existe");
                }
            }

            // Guardar cambios
            historyRepository.save(existingHistory);
        } else {
            throw new IllegalArgumentException("El historial clínico con el ID proporcionado no existe");
        }
    }

    public void saveHistory(PetClinicalHistory history) {
        // Verifica y carga la mascota desde la base de datos
        Pet pet = petRepository.findById(history.getPet().getIdPet())
                .orElseThrow(() -> new IllegalArgumentException("La mascota especificada no existe"));

        // Verifica y carga el servicio desde la base de datos
        ServiceEntity serviceEntity = serviceRepository.findById(history.getServiceEntity().getIdService())
                .orElseThrow(() -> new IllegalArgumentException("El servicio especificado no existe"));

        // Asocia las entidades cargadas al historial
        history.setPet(pet);
        history.setServiceEntity(serviceEntity);

        // Guarda el historial clínico
        historyRepository.save(history);
    }

}
