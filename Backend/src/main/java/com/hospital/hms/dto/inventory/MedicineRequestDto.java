package com.hospital.hms.dto.inventory;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicineRequestDto {

    private String medicineName;

    private String category;

    private Integer quantity;

    private Double price;

    private LocalDate expiryDate;

    private String manufacturer;
}