package com.hospital.hms.controller;

import com.hospital.hms.dto.inventory.SupplierRequestDto;
import com.hospital.hms.entity.Supplier;
import com.hospital.hms.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService
            supplierService;

    @PostMapping
    public Supplier addSupplier(
            @RequestBody
            SupplierRequestDto dto) {

        return supplierService
                .addSupplier(dto);
    }

    @GetMapping
    public List<Supplier>
    getAllSuppliers() {

        return supplierService
                .getAllSuppliers();
    }

    @GetMapping("/{id}")
    public Supplier getSupplier(
            @PathVariable Long id) {

        return supplierService
                .getSupplierById(id);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(
            @PathVariable Long id,
            @RequestBody
            SupplierRequestDto dto) {

        return supplierService
                .updateSupplier(
                        id,
                        dto);
    }

    @DeleteMapping("/{id}")
    public String deleteSupplier(
            @PathVariable Long id) {

        supplierService
                .deleteSupplier(id);

        return "Supplier Deleted";
    }
}