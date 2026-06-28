package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.history.PatientHistoryDto;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.MedicalReportRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.repository.PrescriptionRepository;
import com.hospital.hms.service.PatientHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientHistoryServiceImpl
        implements PatientHistoryService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Override
    public PatientHistoryDto getPatientHistory(
            Long patientId) {

        Patient patient =
                patientRepository.findById(patientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient Not Found"));

        PatientHistoryDto dto =
                new PatientHistoryDto();

        dto.setPatient(patient);

        dto.setAppointments(
                appointmentRepository
                        .findByPatientId(patientId));

        dto.setPrescriptions(
                prescriptionRepository
                        .findByPatientId(patientId));

        dto.setReports(
                medicalReportRepository
                        .findByPatientId(patientId));

        return dto;
    }
}