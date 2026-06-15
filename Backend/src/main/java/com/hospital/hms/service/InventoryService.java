package com.hospital.hms.service;

import com.hospital.hms.dto.inventory.MedicineRequestDto;
import com.hospital.hms.entity.MedicineStock;

import java.util.List;

public interface InventoryService {

    MedicineStock addMedicine(
            MedicineRequestDto dto);

    List<MedicineStock>
    getAllMedicines();

    MedicineStock getMedicineById(
            Long id);

    MedicineStock updateMedicine(
            Long id,
            MedicineRequestDto dto);

    void deleteMedicine(
            Long id);

    List<MedicineStock>
    searchMedicine(
            String keyword);

    List<MedicineStock>
    getLowStockMedicines();

    List<MedicineStock>
    getExpiryMedicines();
}