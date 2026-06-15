package com.hospital.hms.repository;

import com.hospital.hms.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BillRepository
        extends JpaRepository<Bill, Long> {

    List<Bill>
    findByPatientId(Long patientId);

    @Query("""
    SELECT COALESCE(
    SUM(b.totalAmount),0)
    FROM Bill b
    WHERE b.paymentStatus='PAID'
    """)
    Double getTotalRevenue();
}