package com.hospital.hms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.hms.entity.Patient;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    Optional<Patient>
    findByAadharNumber(
            String aadharNumber);

}
