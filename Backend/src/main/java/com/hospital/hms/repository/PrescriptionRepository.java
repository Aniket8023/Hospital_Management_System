package com.hospital.hms.repository;

import com.hospital.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    List<Prescription>
    findByPatientId(Long patientId);

    // NEW
    List<Prescription>
    findByPrescriptionDate(LocalDate date);
}