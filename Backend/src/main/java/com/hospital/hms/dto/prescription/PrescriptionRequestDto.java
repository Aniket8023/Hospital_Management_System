package com.hospital.hms.dto.prescription;

import lombok.Data;
import java.util.List;

@Data
public class PrescriptionRequestDto {

    private Long patientId;

    private Long doctorId;

    private Long appointmentId;

    private String diagnosis;

    private String advice;

    private List<MedicineDto> medicines;
}