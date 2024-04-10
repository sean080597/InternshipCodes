package com.programming.technie.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@Entity
//@Table(name = "users")
public class CommonCard {

    private String cif;
    private String cardNumber;
    private String cvv;
}
