package com.hospital.hms.repository;

import com.hospital.hms.entity.PrescriptionMedicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionMedicineRepository
        extends JpaRepository<PrescriptionMedicine, Long> {

    List<PrescriptionMedicine>
    findByPrescriptionId(
            Long prescriptionId);
}