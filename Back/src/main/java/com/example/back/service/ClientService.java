package com.example.back.service;

import java.util.Optional; // Clase correcta para la paginación

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.back.entity.Client;
import com.example.back.entity.User;
import com.example.back.repository.ClientRepository;
import com.example.back.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;



@Service
public class ClientService {
    

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<Client> getClientsByStatus(Pageable pageable) {
        return clientRepository.findByStatus('1', pageable);
    }   

    public Optional<Client> getClient(Long id){
        return clientRepository.findById(id);
    }

    public void updateClient(Client updatedClient) {
        // Busca el cliente existente
        Optional<Client> existingClientOpt = clientRepository.findById(updatedClient.getIdClient());

        if (existingClientOpt.isPresent()) {
            Client existingClient = existingClientOpt.get();

            // Actualiza solo los campos necesarios
            existingClient.setDni(updatedClient.getDni());
            existingClient.setFirstName(updatedClient.getFirstName());
            existingClient.setPreName(updatedClient.getPreName());
            existingClient.setFirstLastName(updatedClient.getFirstLastName());
            existingClient.setSecondLastName(updatedClient.getSecondLastName());
            existingClient.setAddress(updatedClient.getAddress());
            existingClient.setCellphone(updatedClient.getCellphone());
            existingClient.setStatus(updatedClient.getStatus());

            // Mantén el usuario actual si no se envió un nuevo usuario
            if (updatedClient.getUser() != null) {
                existingClient.setUser(updatedClient.getUser());
            }

            // Guarda los cambios en la base de datos
            clientRepository.save(existingClient);
        } else {
            throw new IllegalArgumentException("El cliente con el ID proporcionado no existe");
        }
    }

    //buscar cliente
    public Page<Client> searchClients(String dni, String name, String lastName, Character status, Pageable pageable) {
        return clientRepository.searchClients(dni, name, lastName, status, pageable);
    }
    public boolean blockClient(Long clientId) {
        int rowsUpdated = clientRepository.blockClient(clientId);
        return rowsUpdated > 0;
    }

    public void delete(Long id){
        clientRepository.deleteById(id);
    }
    
    @Transactional
    public Client createClientWithUser(Client client) {
        // Verifica si el cliente tiene un User asociado en el JSON
        if (client.getUser() != null) {
            // Encripta la contraseña antes de guardar el usuario
            String plainPassword = client.getUser().getPassword();
            String encryptedPassword = passwordEncoder.encode(plainPassword);
            client.getUser().setPassword(encryptedPassword);

            // Guarda el User primero
            User savedUser = userRepository.save(client.getUser());
            client.setUser(savedUser);
        }

        // Guarda el cliente
        return clientRepository.save(client);
    }


    public Optional<Client> findByDni(String dni) {
        return clientRepository.findByDni(dni);
    }    

    public String getFirstNameByDni(String dni) {
        String firstName = clientRepository.findFirstNameByDni(dni);
        
        if (firstName == null ) {
            return null; // Indica que no existe
        }
        return firstName;
    }   

    // Validar si el número de celular ya está en uso
    public boolean cellphoneExists(String cellphone) {
        return clientRepository.existsByCellphone(cellphone);
    }

    // Validar si el número de celular ya está en uso excluyendo un ID
    public boolean cellphoneExistsExcludingId(String cellphone, Long id) {
        return clientRepository.existsByCellphoneAndNotId(cellphone, id);
    }

    // Validar si el DNI ya está en uso excluyendo un ID
    public boolean dniExistsExcludingId(String dni, Long id) {
        return clientRepository.existsByDniAndNotId(dni, id);
    }

}
