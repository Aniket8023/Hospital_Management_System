package com.hospital.hms.dto.billing;

import com.hospital.hms.enums.PaymentStatus;
import lombok.Data;

@Data
public class PaymentStatusUpdateDto {

    private PaymentStatus paymentStatus;
}