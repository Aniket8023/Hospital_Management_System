package com.hospital.hms.dto.inventory;

import lombok.Data;

@Data
public class PurchaseRecordDto {

    private Long supplierId;

    private Long medicineId;

    private Integer quantityPurchased;

    private Double purchasePrice;
}