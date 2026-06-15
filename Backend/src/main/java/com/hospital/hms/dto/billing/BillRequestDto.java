package com.hospital.hms.dto.billing;

import lombok.Data;
import java.util.List;

@Data
public class BillRequestDto {

    private Long patientId;

    private Long appointmentId;

    private List<BillItemRequestDto>
            items;
}