package com.hospital.hms.dto.billing;

import lombok.Data;

@Data
public class BillItemRequestDto {

    private String itemName;

    private Integer quantity;

    private Double unitPrice;
}