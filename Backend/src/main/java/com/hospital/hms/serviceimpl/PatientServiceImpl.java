package com.hospital.hms.serviceimpl;

import com.hospital.hms.entity.Patient;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientServiceImpl
        implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public List<Patient> getAllPatients() {

        return patientRepository.findAll();

    }

    @Override
    public Patient getPatientById(Long id) {

        return patientRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient Not Found"));
    }


}