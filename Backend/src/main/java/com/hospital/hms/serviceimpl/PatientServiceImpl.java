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

    @Override
    public List<Patient>
    searchPatientByName(
            String name) {

        return patientRepository
                .findByFullNameContainingIgnoreCase(
                        name);
    }

    @Override
    public Patient searchPatientByMobile(
            String mobileNumber) {

        return patientRepository
                .findByMobileNumber(
                        mobileNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient Not Found"));
    }

    @Override
    public Patient searchPatientByAadhar(
            String aadharNumber) {

        return patientRepository
                .findByAadharNumber(
                        aadharNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient Not Found"));
    }

    @Override
    public Patient createPatient(
            Patient patient) {

        return patientRepository
                .save(patient);
    }

    @Override
    public Patient updatePatient(
            Long id,
            Patient updatedPatient) {

        Patient patient =
                patientRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient Not Found"));

        patient.setFullName(
                updatedPatient.getFullName());

        patient.setMobileNumber(
                updatedPatient.getMobileNumber());

        patient.setAadharNumber(
                updatedPatient.getAadharNumber());

        patient.setAge(
                updatedPatient.getAge());

        patient.setGender(
                updatedPatient.getGender());

        patient.setAddress(
                updatedPatient.getAddress());

        return patientRepository
                .save(patient);
    }

}