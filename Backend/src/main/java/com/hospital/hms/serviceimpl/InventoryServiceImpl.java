package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.inventory.MedicineRequestDto;
import com.hospital.hms.entity.MedicineStock;
import com.hospital.hms.repository.MedicineStockRepository;
import com.hospital.hms.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryServiceImpl
        implements InventoryService {

    @Autowired
    private MedicineStockRepository
            medicineStockRepository;

    @Override
    public MedicineStock addMedicine(
            MedicineRequestDto dto) {

        MedicineStock medicine =
                new MedicineStock();

        medicine.setMedicineName(
                dto.getMedicineName());

        medicine.setCategory(
                dto.getCategory());

        medicine.setQuantity(
                dto.getQuantity());

        medicine.setPrice(
                dto.getPrice());

        medicine.setExpiryDate(
                dto.getExpiryDate());

        medicine.setManufacturer(
                dto.getManufacturer());

        return medicineStockRepository
                .save(medicine);
    }

    @Override
    public List<MedicineStock>
    getAllMedicines() {

        return medicineStockRepository
                .findAll();
    }

    @Override
    public MedicineStock
    getMedicineById(Long id) {

        return medicineStockRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine Not Found"));
    }

    @Override
    public MedicineStock updateMedicine(
            Long id,
            MedicineRequestDto dto) {

        MedicineStock medicine =
                medicineStockRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine Not Found"));

        medicine.setMedicineName(
                dto.getMedicineName());

        medicine.setCategory(
                dto.getCategory());

        medicine.setQuantity(
                dto.getQuantity());

        medicine.setPrice(
                dto.getPrice());

        medicine.setExpiryDate(
                dto.getExpiryDate());

        medicine.setManufacturer(
                dto.getManufacturer());

        return medicineStockRepository
                .save(medicine);
    }

    @Override
    public void deleteMedicine(
            Long id) {

        medicineStockRepository
                .deleteById(id);
    }

    @Override
    public List<MedicineStock>
    searchMedicine(
            String keyword) {

        return medicineStockRepository
                .findByMedicineNameContainingIgnoreCase(
                        keyword);
    }

    @Override
    public List<MedicineStock>
    getLowStockMedicines() {

        return medicineStockRepository
                .findByQuantityLessThan(10);
    }

    @Override
    public List<MedicineStock>
    getExpiryMedicines() {

        return medicineStockRepository
                .findByExpiryDateBefore(
                        LocalDate.now()
                                .plusDays(30));
    }
}