package com.hospital.hms.dto.prescription;

import lombok.Data;

@Data
public class MedicineDto {

    private String medicineName;

    private String dosage;

    private String duration;
}