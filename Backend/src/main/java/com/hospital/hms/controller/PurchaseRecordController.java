package com.hospital.hms.controller;

import com.hospital.hms.dto.inventory.PurchaseRecordDto;
import com.hospital.hms.entity.PurchaseRecord;
import com.hospital.hms.service.PurchaseRecordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchases")
public class PurchaseRecordController {

    @Autowired
    private PurchaseRecordService
            purchaseRecordService;

    @PostMapping
    public PurchaseRecord purchaseMedicine(
            @RequestBody
            PurchaseRecordDto dto){

        return purchaseRecordService
                .purchaseMedicine(dto);
    }

    @GetMapping
    public List<PurchaseRecord>
    getAllPurchases(){

        return purchaseRecordService
                .getAllPurchases();
    }
}