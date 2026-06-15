package com.hospital.hms.service;

import com.hospital.hms.dto.billing.BillRequestDto;
import com.hospital.hms.dto.billing.BillResponseDto;
import com.hospital.hms.entity.Bill;
import com.hospital.hms.enums.PaymentStatus;

import java.util.List;

public interface BillingService {

    BillResponseDto generateBill(
            BillRequestDto dto);

    Bill getBillById(
            Long billId);

    List<Bill> getPatientBills(
            Long patientId);

    Bill updatePaymentStatus(
            Long billId,
            PaymentStatus paymentStatus);

    byte[] generateInvoicePdf(
            Long billId)
            throws Exception;
}