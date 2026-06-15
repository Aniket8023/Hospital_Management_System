package com.hospital.hms.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SlotResponseDto {

    private String slotTime;

    private Boolean available;
}