package com.hospital.hms.service;

import com.hospital.hms.dto.inventory.SupplierRequestDto;
import com.hospital.hms.entity.Supplier;

import java.util.List;

public interface SupplierService {

    Supplier addSupplier(
            SupplierRequestDto dto);

    List<Supplier>
    getAllSuppliers();

    Supplier getSupplierById(
            Long id);

    Supplier updateSupplier(
            Long id,
            SupplierRequestDto dto);

    void deleteSupplier(
            Long id);
}