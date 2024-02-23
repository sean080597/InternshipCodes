package com.programming.technie.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginReq {
    private String username;
    private String password;
}
