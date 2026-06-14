package com.hospital.hms.controller;

import com.hospital.hms.dto.LoginRequestDto;
import com.hospital.hms.dto.LoginResponseDto;
import com.hospital.hms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(
            @RequestBody LoginRequestDto dto){

        return authService.login(dto);

    }
}
