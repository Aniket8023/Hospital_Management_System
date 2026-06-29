package com.hospital.hms.service;

import com.hospital.hms.dto.prescription.PrescriptionRequestDto;
import com.hospital.hms.entity.Prescription;

import java.util.List;

public interface PrescriptionService {

    Prescription createPrescription(
            PrescriptionRequestDto dto);

    Prescription getPrescriptionById(
            Long prescriptionId);

    List<Prescription>
    getPatientPrescriptionHistory(
            Long patientId);
    List<Prescription> getAllPrescriptions();

    byte[] generatePrescriptionPdf(
            Long prescriptionId)
            throws Exception;
}