package com.hospital.hms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDto {


    private String fullName;

    private String mobileNumber;

    private String aadharNumber;

    private Integer age;

    private String gender;

    private String address;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String problemDescription;
}