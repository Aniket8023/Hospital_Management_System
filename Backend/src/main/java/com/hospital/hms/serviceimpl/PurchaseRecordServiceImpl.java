package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.inventory.PurchaseRecordDto;
import com.hospital.hms.entity.*;
import com.hospital.hms.repository.*;
import com.hospital.hms.service.PurchaseRecordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseRecordServiceImpl
        implements PurchaseRecordService {

    @Autowired
    private PurchaseRecordRepository
            purchaseRecordRepository;

    @Autowired
    private SupplierRepository
            supplierRepository;

    @Autowired
    private MedicineStockRepository
            medicineStockRepository;

    @Override
    public PurchaseRecord purchaseMedicine(
            PurchaseRecordDto dto) {

        Supplier supplier =
                supplierRepository
                        .findById(
                                dto.getSupplierId())
                        .orElseThrow();

        MedicineStock medicine =
                medicineStockRepository
                        .findById(
                                dto.getMedicineId())
                        .orElseThrow();

        medicine.setQuantity(
                medicine.getQuantity()
                        +
                        dto.getQuantityPurchased());

        medicineStockRepository
                .save(medicine);

        PurchaseRecord record =
                new PurchaseRecord();

        record.setSupplier(
                supplier);

        record.setMedicine(
                medicine);

        record.setQuantityPurchased(
                dto.getQuantityPurchased());

        record.setPurchasePrice(
                dto.getPurchasePrice());

        record.setPurchaseDate(
                LocalDate.now());

        return purchaseRecordRepository
                .save(record);
    }

    @Override
    public List<PurchaseRecord>
    getAllPurchases() {

        return purchaseRecordRepository
                .findAll();
    }
}