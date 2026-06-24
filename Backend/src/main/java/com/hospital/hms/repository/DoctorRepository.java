package com.hospital.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hospital.hms.entity.Doctor;

import java.util.Optional;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findFirstBy();
}