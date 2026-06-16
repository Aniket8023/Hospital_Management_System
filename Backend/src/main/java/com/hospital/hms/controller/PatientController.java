package com.hospital.hms.controller;

import com.hospital.hms.entity.Patient;
import com.hospital.hms.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public List<Patient> getAllPatients() {

        return patientService.getAllPatients();

    }

    @GetMapping("/{id}")
    public Patient getPatientById(
            @PathVariable Long id){

        return patientService
                .getPatientById(id);
    }

    @GetMapping("/search/name")
    public List<Patient>
    searchByName(

            @RequestParam
            String name){

        return patientService
                .searchPatientByName(
                        name);
    }

    @GetMapping("/search/mobile")
    public Patient
    searchByMobile(

            @RequestParam
            String mobile){

        return patientService
                .searchPatientByMobile(
                        mobile);
    }

    @GetMapping("/search/aadhar")
    public Patient
    searchByAadhar(

            @RequestParam
            String aadhar){

        return patientService
                .searchPatientByAadhar(
                        aadhar);
    }
}