package com.hospital.hms.service;

import com.hospital.hms.dto.schedule.ScheduleRequestDto;
import com.hospital.hms.dto.schedule.SlotResponseDto;
import com.hospital.hms.entity.DoctorSchedule;

import java.time.LocalDate;
import java.util.List;

public interface DoctorScheduleService {

    DoctorSchedule createSchedule(
            ScheduleRequestDto dto);

    List<DoctorSchedule>
    getDoctorSchedule(
            Long doctorId,
            LocalDate date);

    List<SlotResponseDto>
    getAvailableSlots(
            Long doctorId,
            LocalDate date);
}