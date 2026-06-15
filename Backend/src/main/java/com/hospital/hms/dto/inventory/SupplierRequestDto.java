package com.hospital.hms.dto.inventory;

import lombok.Data;

@Data
public class SupplierRequestDto {

    private String supplierName;

    private String contactPerson;

    private String mobileNumber;

    private String email;

    private String address;
}