package com.example.back.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back.entity.Rol;
import com.example.back.repository.RolRepository;



@Service
public class RolService {
    @Autowired
    RolRepository rolRepository;

    
    public List<Rol> getRoles(){
        return rolRepository.findAll();
    }

    //buscar por id
    public Optional<Rol> getRol(Long id){
        return rolRepository.findById(id);
    }

    public void saveOrUpdate(Rol rol){
        rolRepository.save(rol);
    }

    public void delete(Long id){
        rolRepository.deleteById(id);
    }

    public List<Rol> getActiveRoles() {
        return rolRepository.findActiveRoles();
    }
}
