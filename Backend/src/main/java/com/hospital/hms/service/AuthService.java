package com.hospital.hms.service;

import com.hospital.hms.dto.LoginRequestDto;
import com.hospital.hms.dto.LoginResponseDto;

public interface AuthService {

    LoginResponseDto login(
            LoginRequestDto dto);

}