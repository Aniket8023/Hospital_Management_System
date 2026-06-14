package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.LoginResponseDto;
import com.hospital.hms.entity.User;
import com.hospital.hms.repository.UserRepository;
import com.hospital.hms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.hms.dto.LoginRequestDto;
import com.hospital.hms.service.AuthService;

@Service
public class AuthServiceImpl
        implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponseDto login(
            LoginRequestDto dto) {

        User user =
                userRepository.findByEmail(
                                dto.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        if(!user.getPassword()
                .equals(dto.getPassword())) {

            throw new RuntimeException(
                    "Invalid Password");
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail());

        return new LoginResponseDto(
                token,
                user.getRole().name());
    }
}