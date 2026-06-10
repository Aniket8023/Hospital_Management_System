package com.hospital.hms.serviceimpl;

import org.springframework.stereotype.Service;

import com.hospital.hms.dto.LoginRequestDto;
import com.hospital.hms.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public String login(LoginRequestDto dto) {

        // Login Logic

        return "Login Success";
    }
}