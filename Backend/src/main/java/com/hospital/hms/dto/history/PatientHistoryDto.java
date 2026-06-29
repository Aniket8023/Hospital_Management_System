package com.hospital.hms.dto.history;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.MedicalReport;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.entity.Prescription;
import lombok.Data;

import java.util.List;

@Data
public class PatientHistoryDto {

    private Patient patient;

    private List<Appointment> appointments;

    private List<Prescription> prescriptions;

    private List<MedicalReport> reports;
}