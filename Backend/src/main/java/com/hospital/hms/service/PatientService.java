package com.hospital.hms.service;

import com.hospital.hms.entity.Patient;
import java.util.List;

public interface PatientService {

    List<Patient> getAllPatients();

    Patient getPatientById(
            Long id);

    List<Patient>
    searchPatientByName(
            String name);

    Patient searchPatientByMobile(
            String mobileNumber);

    Patient searchPatientByAadhar(
            String aadharNumber);

    Patient createPatient(
            Patient patient);

    Patient updatePatient(
            Long id,
            Patient patient);
}