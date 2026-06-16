package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.report.MedicalReportRequestDto;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.MedicalReport;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.MedicalReportRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.MedicalReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;

@Service
public class MedicalReportServiceImpl
        implements MedicalReportService {

    @Autowired
    private MedicalReportRepository
            medicalReportRepository;

    @Autowired
    private PatientRepository
            patientRepository;

    @Autowired
    private DoctorRepository
            doctorRepository;

    @Override
    public MedicalReport uploadReport(
            MedicalReportRequestDto dto,
            MultipartFile file)
            throws Exception {

        Patient patient =
                patientRepository.findById(
                                dto.getPatientId())
                        .orElseThrow();

        Doctor doctor =
                doctorRepository.findById(
                                dto.getDoctorId())
                        .orElseThrow();

        String uploadDir =
                System.getProperty("user.dir")
                        + File.separator
                        + "uploads"
                        + File.separator
                        + "reports";

        Path uploadPath =
                Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName =
                file.getOriginalFilename();

        Path filePath =
                uploadPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);



        MedicalReport report =
                new MedicalReport();

        report.setPatient(patient);

        report.setDoctor(doctor);

        report.setReportName(
                dto.getReportName());

        report.setReportType(
                dto.getReportType());

        report.setFilePath(
                filePath.toString());

        report.setUploadDate(
                LocalDate.now());



        return medicalReportRepository
                .save(report);
    }

    @Override
    public List<MedicalReport>
    getPatientReports(
            Long patientId) {

        return medicalReportRepository
                .findByPatientId(
                        patientId);
    }

    @Override
    public MedicalReport getReportById(
            Long reportId) {

        return medicalReportRepository
                .findById(reportId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Report Not Found"));
    }

    @Override
    public byte[] downloadReport(
            Long reportId)
            throws Exception {

        MedicalReport report =
                medicalReportRepository
                        .findById(reportId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Report Not Found"));

        Path path =
                Paths.get(
                        report.getFilePath());

        return Files.readAllBytes(
                path);
    }
}