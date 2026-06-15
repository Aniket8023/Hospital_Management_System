package com.hospital.hms.repository;

import com.hospital.hms.entity.MedicineStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MedicineStockRepository
        extends JpaRepository<
        MedicineStock,
        Long> {

    List<MedicineStock>
    findByMedicineNameContainingIgnoreCase(
            String medicineName);

    List<MedicineStock>
    findByQuantityLessThan(
            Integer quantity);

    List<MedicineStock>
    findByExpiryDateBefore(
            LocalDate date);
}