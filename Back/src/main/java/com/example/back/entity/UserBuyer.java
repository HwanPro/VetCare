package com.example.back.entity;

import lombok.Getter;
import lombok.Setter;

public class UserBuyer {

    @Getter @Setter
    private String Title;

    @Getter @Setter
    private int quantity;

    @Getter @Setter
    private int unit_price;
}
