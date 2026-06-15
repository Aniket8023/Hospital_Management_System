package com.hospital.hms.dto.schedule;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleRequestDto {

    private Long doctorId;

    private LocalDate scheduleDate;

    private LocalTime startTime;

    private LocalTime endTime;
}