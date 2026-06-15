package com.hospital.hms.service;

import com.hospital.hms.dto.inventory.PurchaseRecordDto;
import com.hospital.hms.entity.PurchaseRecord;

import java.util.List;

public interface PurchaseRecordService {

    PurchaseRecord purchaseMedicine(
            PurchaseRecordDto dto);

    List<PurchaseRecord>
    getAllPurchases();
}