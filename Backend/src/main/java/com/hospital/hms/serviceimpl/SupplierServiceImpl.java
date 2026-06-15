package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.inventory.SupplierRequestDto;
import com.hospital.hms.entity.Supplier;
import com.hospital.hms.repository.SupplierRepository;
import com.hospital.hms.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierServiceImpl
        implements SupplierService {

    @Autowired
    private SupplierRepository
            supplierRepository;

    @Override
    public Supplier addSupplier(
            SupplierRequestDto dto) {

        Supplier supplier =
                new Supplier();

        supplier.setSupplierName(
                dto.getSupplierName());

        supplier.setContactPerson(
                dto.getContactPerson());

        supplier.setMobileNumber(
                dto.getMobileNumber());

        supplier.setEmail(
                dto.getEmail());

        supplier.setAddress(
                dto.getAddress());

        return supplierRepository
                .save(supplier);
    }

    @Override
    public List<Supplier>
    getAllSuppliers() {

        return supplierRepository
                .findAll();
    }

    @Override
    public Supplier getSupplierById(
            Long id) {

        return supplierRepository
                .findById(id)
                .orElseThrow();
    }

    @Override
    public Supplier updateSupplier(
            Long id,
            SupplierRequestDto dto) {

        Supplier supplier =
                supplierRepository
                        .findById(id)
                        .orElseThrow();

        supplier.setSupplierName(
                dto.getSupplierName());

        supplier.setContactPerson(
                dto.getContactPerson());

        supplier.setMobileNumber(
                dto.getMobileNumber());

        supplier.setEmail(
                dto.getEmail());

        supplier.setAddress(
                dto.getAddress());

        return supplierRepository
                .save(supplier);
    }

    @Override
    public void deleteSupplier(
            Long id) {

        supplierRepository
                .deleteById(id);
    }
}