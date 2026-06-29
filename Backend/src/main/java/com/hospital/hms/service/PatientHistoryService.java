package com.hospital.hms.service;

import com.hospital.hms.dto.history.PatientHistoryDto;

public interface PatientHistoryService {

    PatientHistoryDto getPatientHistory(
            Long patientId);
}