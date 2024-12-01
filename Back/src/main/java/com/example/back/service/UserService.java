package com.example.back.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.back.Util.PasswordUtils;
import com.example.back.entity.User;
import com.example.back.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired

    public List<User>getUsers(){
        return userRepository.findAll();
    }

    public Optional<User> getUser(Long id){
        return userRepository.findById(id);
    }

    public void saveOrUpdate(User user) {
        if (user.getPassword() != null) {
            // Encriptar la contraseña antes de guardar
            user.setPassword(PasswordUtils.encryptPassword(user.getPassword()));
        }
        userRepository.save(user);
    }
    public void delete(Long id){
        userRepository.deleteById(id);
    }
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

}
