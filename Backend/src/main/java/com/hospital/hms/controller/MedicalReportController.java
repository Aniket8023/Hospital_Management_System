package com.hospital.hms.controller;

import com.hospital.hms.dto.report.MedicalReportRequestDto;
import com.hospital.hms.entity.MedicalReport;
import com.hospital.hms.service.MedicalReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class MedicalReportController {

    @Autowired
    private MedicalReportService
            medicalReportService;

    @PostMapping("/upload")
    public MedicalReport uploadReport(

            @RequestParam Long patientId,

            @RequestParam Long doctorId,

            @RequestParam String reportName,

            @RequestParam String reportType,

            @RequestParam MultipartFile file)

            throws Exception {

        MedicalReportRequestDto dto =
                new MedicalReportRequestDto();

        dto.setPatientId(patientId);

        dto.setDoctorId(doctorId);

        dto.setReportName(reportName);

        dto.setReportType(reportType);

        return medicalReportService
                .uploadReport(
                        dto,
                        file);
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalReport>
    getPatientReports(
            @PathVariable Long patientId){

        return medicalReportService
                .getPatientReports(
                        patientId);
    }

    @GetMapping("/{reportId}")
    public MedicalReport getReport(
            @PathVariable Long reportId){

        return medicalReportService
                .getReportById(
                        reportId);
    }
}