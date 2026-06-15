package com.hospital.hms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRecord {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Supplier supplier;

    @ManyToOne
    private MedicineStock medicine;

    private Integer quantityPurchased;

    private Double purchasePrice;

    private LocalDate purchaseDate;
}