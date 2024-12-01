package com.example.back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.Util.JwtUtils;
import com.example.back.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
    
        try {
            Map<String, Object> userInfo = authService.authenticate(email, password);
            String role = (String) userInfo.get("type"); // Obtén el tipo de usuario (CLIENT o EMPLOYEE)
            String token = jwtUtils.generateToken(email, role); // Llama al método con el rol
    
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userInfo
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
