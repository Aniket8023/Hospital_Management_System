package com.hospital.hms.service;

import com.hospital.hms.dto.doctor.DoctorRequestDto;
import com.hospital.hms.entity.Doctor;

import java.util.List;

public interface DoctorService {

    Doctor addDoctor(
            DoctorRequestDto dto);

    List<Doctor> getAllDoctors();

    Doctor getDoctorById(
            Long id);

    Doctor updateDoctor(
            Long id,
            DoctorRequestDto dto);

    void deleteDoctor(
            Long id);
}