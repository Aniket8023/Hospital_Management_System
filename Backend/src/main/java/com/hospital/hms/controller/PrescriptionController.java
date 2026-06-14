package com.hospital.hms.controller;

import com.hospital.hms.dto.prescription.PrescriptionRequestDto;
import com.hospital.hms.entity.Prescription;
import com.hospital.hms.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService
            prescriptionService;

    @PostMapping
    public Prescription createPrescription(
            @RequestBody
            PrescriptionRequestDto dto){

        return prescriptionService
                .createPrescription(dto);
    }

    @GetMapping("/{id}")
    public Prescription getPrescription(
            @PathVariable Long id){

        return prescriptionService
                .getPrescriptionById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<Prescription>
    getPatientHistory(
            @PathVariable Long patientId){

        return prescriptionService
                .getPatientPrescriptionHistory(
                        patientId);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]>
    downloadPrescriptionPdf(
            @PathVariable Long id)
            throws Exception {

        byte[] pdf =
                prescriptionService
                        .generatePrescriptionPdf(
                                id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=prescription.pdf")
                .contentType(
                        MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}