package com.hospital.hms.repository;

import com.hospital.hms.entity.PurchaseRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRecordRepository
        extends JpaRepository<
        PurchaseRecord,
        Long> {
}