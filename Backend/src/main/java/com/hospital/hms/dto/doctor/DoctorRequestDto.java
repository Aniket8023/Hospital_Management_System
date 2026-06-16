package com.hospital.hms.dto.doctor;

import lombok.Data;

@Data
public class DoctorRequestDto {

    private String name;

    private String email;

    private String password;

    private String specialization;

    private String qualification;

    private Integer experience;
}