package com.example.back.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.Rol;
import com.example.back.service.RolService;

@RestController
@RequestMapping(path = "/api/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public List<Rol> getAll(){
        return rolService.getRoles();
    }

    @GetMapping("/{rolId}")
    public Optional<Rol> getById(@PathVariable("rolId") Long rolId){
        return rolService.getRol(rolId);
    }


    @PostMapping
    public void saveUpdate(@RequestBody Rol rol){
        rolService.saveOrUpdate(rol);
    }

    @DeleteMapping("/{rolId}")
    public void delete(@PathVariable("rolId") Long rolId){
        rolService.delete(rolId);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Rol>> getActiveRoles() {
        List<Rol> activeRoles = rolService.getActiveRoles();
        return ResponseEntity.ok(activeRoles);
    }
    
}
