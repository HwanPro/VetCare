package com.example.back.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.UserBuyer;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;

@RestController
public class MercadoPagoController {

    @Value("${codigo.mercadoLibre}")
    private String mercadoLibreToken;

    @RequestMapping(value = "/api/mp", method = RequestMethod.POST)
    public String getList(@RequestBody UserBuyer userBuyer) {
        if (userBuyer == null) {
            return "error jsons :/";
        }
        String title = userBuyer.getTitle();
        int quantity = userBuyer.getQuantity();
        int price = userBuyer.getUnit_price();

        try {
            // Configuración del token de Mercado Pago
            MercadoPagoConfig.setAccessToken(mercadoLibreToken);

            // 1. Crear una preferencia de venta
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(title)
                    .quantity(quantity)
                    .unitPrice(new BigDecimal(price))
                    .currencyId("PEN") // Moneda: Soles Peruanos
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            // 2. Crear URLs de retorno
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://tu-sitio/success")
                    .pending("https://tu-sitio/pending")
                    .failure("https://tu-sitio/failure")
                    .build();

            // 3. Crear una preferencia que incluya ítems y URLs de retorno
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .build();

            // 4. Crear un cliente para Mercado Pago
            PreferenceClient client = new PreferenceClient();

            // 5. Crear una nueva preferencia y obtener la respuesta
            Preference  preference = client.create(preferenceRequest);

            return preference.getId(); // Retorna el ID de la preferencia
        } catch (MPException | MPApiException e) {
            return e.toString();
        }
    }
}
