package com.hospital.hms.repository;

import com.hospital.hms.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalReportRepository
        extends JpaRepository<
                MedicalReport,
                Long> {

    List<MedicalReport>
    findByPatientId(
            Long patientId);
}
