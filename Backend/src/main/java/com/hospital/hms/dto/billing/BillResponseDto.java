package com.hospital.hms.dto.billing;

import com.hospital.hms.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BillResponseDto {

    private Long billId;

    private Double totalAmount;

    private PaymentStatus paymentStatus;
}