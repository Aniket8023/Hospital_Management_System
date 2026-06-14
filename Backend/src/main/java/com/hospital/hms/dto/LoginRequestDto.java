package com.hospital.hms.dto;

import lombok.Data;

@Data
public class LoginRequestDto {

    private String email;

    private String password;
}
