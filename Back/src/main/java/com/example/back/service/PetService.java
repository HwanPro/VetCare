package com.example.back.service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.entity.Pet;
import com.example.back.entity.Race;
import com.example.back.entity.Client;
import com.example.back.repository.ClientRepository;
import com.example.back.repository.PetRepository;
import com.example.back.repository.RaceRepository;



@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private ClientRepository clientRepository;

    public Page<Pet> getPetsByStatus(Pageable pageable) {
        return petRepository.findByStatus('1', pageable);
    }

    public Optional<Pet> getPet(Long id) {
        return petRepository.findById(id);
    }

    public void updatePet(Pet updatedPet) {
    Optional<Pet> existingPetOpt = petRepository.findById(updatedPet.getIdPet());

    if (existingPetOpt.isPresent()) {
        Pet existingPet = existingPetOpt.get();

        // Actualizar campos simples
        existingPet.setName(updatedPet.getName());
        existingPet.setSex(updatedPet.getSex());
        existingPet.setWeight(updatedPet.getWeight());
        existingPet.setDateNac(updatedPet.getDateNac());
        existingPet.setComments(updatedPet.getComments());
        existingPet.setStatus(updatedPet.getStatus());
        existingPet.setDirImage(updatedPet.getDirImage());

        // Cargar y asignar Race si no es null
        if (updatedPet.getRace() != null && updatedPet.getRace().getIdRace() != null) {
            Optional<Race> raceOpt = raceRepository.findById(updatedPet.getRace().getIdRace());
            if (raceOpt.isPresent()) {
                existingPet.setRace(raceOpt.get());
            } else {
                throw new IllegalArgumentException("La raza especificada no existe");
            }
        }

        // Cargar y asignar Client si no es null
        if (updatedPet.getClient() != null && updatedPet.getClient().getIdClient() != null) {
            Optional<Client> clientOpt = clientRepository.findById(updatedPet.getClient().getIdClient());
            if (clientOpt.isPresent()) {
                existingPet.setClient(clientOpt.get());
            } else {
                throw new IllegalArgumentException("El cliente especificado no existe");
            }
        }

        // Guardar cambios
        petRepository.save(existingPet);
    } else {
        throw new IllegalArgumentException("La mascota con el ID proporcionado no existe");
    }
}


    public Page<Pet> searchPets(String dni, String raceName, String petName, Character status, Pageable pageable) {
        return petRepository.searchPets(dni, raceName, petName, status, pageable);
    }

    public void savePet(Pet pet) {
        petRepository.save(pet);
    }

    public boolean blockPet(Long petId) {
        int rowsUpdated = petRepository.blockPet(petId);
        return rowsUpdated > 0;
    }

    public Page<Pet> getActivePetsByClientId(Long clientId, Pageable pageable) {
        return petRepository.findActivePetsByClientId(clientId, pageable);
    }
    

    // Total de mascotas activas
    public long getTotalActivePets() {
        return petRepository.countTodayActivePets();
    }

    //id y name de pets por clientId
    public List<Map<String, Object>> getActivePetsForClient(Long clientId) {
        return petRepository.PetsActiveForClient(clientId);
    }

    public String getPetNameById(Long petId) {
    Optional<Pet> pet = petRepository.findById(petId);

    if (pet.isPresent()) {
        if (pet.get().getStatus()=='1') {
            return "Mascota: " + pet.get().getName();
        } else {
            return "Mascota muerta.";
        }
    } else {
        throw new NoSuchElementException("Mascota no encontrada.");
    }
}

}

