package com.hospital.hms.repository;

import com.hospital.hms.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository
        extends JpaRepository<
        Supplier,
        Long> {
}