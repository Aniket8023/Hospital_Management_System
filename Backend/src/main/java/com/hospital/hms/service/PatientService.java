package com.hospital.hms.service;

import com.hospital.hms.entity.Patient;
import java.util.List;

public interface PatientService {

    List<Patient> getAllPatients();

    Patient getPatientById(
            Long id);

}