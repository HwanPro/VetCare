package com.example.back.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.back.Util.JwtUtils;
import com.example.back.security.filters.JwtAuthorizationFilter;
import com.example.back.service.CustomUserDetailsService;

@Configuration
public class JwtSecurityConfig {

    
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtils jwtUtils;
    private final CorsConfigurationSource corsConfigurationSource;

    public JwtSecurityConfig(CustomUserDetailsService customUserDetailsService, JwtUtils jwtUtils,
    CorsConfigurationSource corsConfigurationSource) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtUtils = jwtUtils;
        this.corsConfigurationSource = corsConfigurationSource;
    }
    

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF porque estás usando JWT
            .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Usa la configuración global de CORS
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/employees/**").permitAll()
                .requestMatchers("/api/clients/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/especies/**").permitAll()
                .requestMatchers("/hitOpenaiApi/**").permitAll()
                .requestMatchers("/api/mp/**").permitAll()
                .requestMatchers("/api/metpags/**").permitAll()
                .requestMatchers("/api/pet-clinical-history/**").permitAll()
                .requestMatchers("/api/pets/**").permitAll()
                .requestMatchers("/api/quotes/**").permitAll()
                .requestMatchers("/api/races/**").permitAll()
                .requestMatchers("/api/dni/**").permitAll()
                .requestMatchers("/api/report/**").permitAll()
                .requestMatchers("/api/roles/**").permitAll()
                .requestMatchers("/api/services/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .anyRequest().authenticated() // Requerir autenticación para todo lo demás
            )
            .addFilterBefore(
                new JwtAuthorizationFilter(customUserDetailsService, jwtUtils),
                UsernamePasswordAuthenticationFilter.class
            );
    
        return http.build();
    }
    
    
    
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Para manejar contraseñas cifradas
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}