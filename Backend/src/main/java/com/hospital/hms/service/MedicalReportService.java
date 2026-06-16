package com.hospital.hms.service;

import com.hospital.hms.dto.report.MedicalReportRequestDto;
import com.hospital.hms.entity.MedicalReport;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MedicalReportService {

    MedicalReport uploadReport(
            MedicalReportRequestDto dto,
            MultipartFile file)
            throws Exception;

    List<MedicalReport>
    getPatientReports(
            Long patientId);

    MedicalReport getReportById(
            Long reportId);

    byte[] downloadReport(
            Long reportId)
            throws Exception;
}