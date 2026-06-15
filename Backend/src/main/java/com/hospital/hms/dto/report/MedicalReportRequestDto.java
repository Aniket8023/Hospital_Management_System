package com.hospital.hms.dto.report;


import lombok.Data;

@Data
public class MedicalReportRequestDto {

    private Long patientId;

    private Long doctorId;

    private String reportName;

    private String reportType;
}
