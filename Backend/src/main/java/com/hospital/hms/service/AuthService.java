package com.hospital.hms.service;

import com.hospital.hms.dto.LoginRequestDto;

public interface AuthService {

    String login(LoginRequestDto dto);

}