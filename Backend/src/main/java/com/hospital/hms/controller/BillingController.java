package com.hospital.hms.controller;

import com.hospital.hms.dto.billing.BillRequestDto;
import com.hospital.hms.dto.billing.BillResponseDto;
import com.hospital.hms.dto.billing.PaymentStatusUpdateDto;
import com.hospital.hms.entity.Bill;
import com.hospital.hms.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping
    public BillResponseDto generateBill(
            @RequestBody
            BillRequestDto dto){

        return billingService
                .generateBill(dto);
    }

    @GetMapping("/{id}")
    public Bill getBill(
            @PathVariable Long id){

        return billingService
                .getBillById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<Bill>
    getPatientBills(
            @PathVariable Long patientId){

        return billingService
                .getPatientBills(
                        patientId);
    }

    @PutMapping("/{billId}/payment")
    public Bill updatePaymentStatus(

            @PathVariable Long billId,

            @RequestBody
            PaymentStatusUpdateDto dto){

        return billingService
                .updatePaymentStatus(
                        billId,
                        dto.getPaymentStatus());
    }


    @GetMapping("/{billId}/pdf")
    public ResponseEntity<byte[]>
    downloadInvoicePdf(
            @PathVariable Long billId)
            throws Exception {

        byte[] pdf =
                billingService
                        .generateInvoicePdf(
                                billId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice.pdf")
                .contentType(
                        MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}