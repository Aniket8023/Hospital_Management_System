package com.hospital.hms.controller;

import com.hospital.hms.dto.inventory.MedicineRequestDto;
import com.hospital.hms.entity.MedicineStock;
import com.hospital.hms.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public MedicineStock addMedicine(
            @RequestBody
            MedicineRequestDto dto){

        return inventoryService
                .addMedicine(dto);
    }

    @GetMapping
    public List<MedicineStock>
    getAllMedicines() {

        return inventoryService
                .getAllMedicines();
    }

    @GetMapping("/{id}")
    public MedicineStock
    getMedicineById(
            @PathVariable Long id) {

        return inventoryService
                .getMedicineById(id);
    }

    @PutMapping("/{id}")
    public MedicineStock
    updateMedicine(

            @PathVariable Long id,

            @RequestBody
            MedicineRequestDto dto) {

        return inventoryService
                .updateMedicine(
                        id,
                        dto);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(
            @PathVariable Long id) {

        inventoryService
                .deleteMedicine(id);

        return "Medicine Deleted Successfully";
    }

    @GetMapping("/search")
    public List<MedicineStock>
    searchMedicine(
            @RequestParam String keyword) {

        return inventoryService
                .searchMedicine(keyword);
    }

    @GetMapping("/low-stock")
    public List<MedicineStock>
    getLowStockMedicines() {

        return inventoryService
                .getLowStockMedicines();
    }

    @GetMapping("/expiry-alert")
    public List<MedicineStock>
    getExpiryMedicines() {

        return inventoryService
                .getExpiryMedicines();
    }
}