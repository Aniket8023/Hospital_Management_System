package com.hospital.hms.controller;

import com.hospital.hms.dto.history.PatientHistoryDto;
import com.hospital.hms.service.PatientHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patient-history")
@CrossOrigin("*")
public class PatientHistoryController {

    @Autowired
    private PatientHistoryService
            patientHistoryService;

    @GetMapping("/{patientId}")
    public PatientHistoryDto getHistory(
            @PathVariable Long patientId) {

        return patientHistoryService
                .getPatientHistory(patientId);
    }
}