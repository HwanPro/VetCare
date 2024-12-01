package com.example.back.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReniecService {

    private final RestTemplate reniecRestTemplate;

    @Value("${reniec.api.url}")
    private String reniecApiUrl;

    public ReniecService(@Qualifier("reniecRestTemplate") RestTemplate reniecRestTemplate) {
        this.reniecRestTemplate = reniecRestTemplate;
    }

    public Map<String, String> consultarDni(String dni) {
        String url = reniecApiUrl + "?numero=" + dni;

        // Realiza la solicitud a la API de RENIEC
        ResponseEntity<Map<String, Object>> response = reniecRestTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> apiResponse = response.getBody();

        if (apiResponse != null && apiResponse.containsKey("nombres")) {
            // Procesar los nombres
            String nombres = (String) apiResponse.get("nombres");
            String[] nombresDivididos = nombres.split(" ");

            // Extraer primer nombre y prenombres
            String primerNombre = capitalizeFirstLetter(nombresDivididos[0]);
            String preNombres = nombresDivididos.length > 1
                    ? capitalizeFirstLetter(String.join(" ", Arrays.copyOfRange(nombresDivididos, 1, nombresDivididos.length)))
                    : "";

            // Crear respuesta personalizada
            Map<String, String> processedResponse = new HashMap<>();
            processedResponse.put("primerNombre", primerNombre);
            processedResponse.put("preNombres", preNombres);
            processedResponse.put("apellidoPaterno", capitalizeFirstLetter((String) apiResponse.get("apellidoPaterno")));
            processedResponse.put("apellidoMaterno", capitalizeFirstLetter((String) apiResponse.get("apellidoMaterno")));
            processedResponse.put("numeroDocumento", (String) apiResponse.get("numeroDocumento"));

            return processedResponse;
        } else {
            throw new RuntimeException("No se encontraron datos para el DNI proporcionado.");
        }
    }

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }
}
