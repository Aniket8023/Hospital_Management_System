package com.hospital.hms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicineStock {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    private String medicineName;

    private String category;

    private Integer quantity;

    private Double price;

    private LocalDate expiryDate;

    private String manufacturer;
}