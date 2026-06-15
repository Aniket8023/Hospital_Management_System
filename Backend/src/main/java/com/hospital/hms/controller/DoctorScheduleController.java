package com.hospital.hms.controller;

import com.hospital.hms.dto.schedule.ScheduleRequestDto;
import com.hospital.hms.dto.schedule.SlotResponseDto;
import com.hospital.hms.entity.DoctorSchedule;
import com.hospital.hms.service.DoctorScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/doctor-schedule")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService
            doctorScheduleService;

    @PostMapping
    public DoctorSchedule createSchedule(
            @RequestBody
            ScheduleRequestDto dto){

        return doctorScheduleService
                .createSchedule(dto);
    }

    @GetMapping
    public List<DoctorSchedule>
    getDoctorSchedule(

            @RequestParam
            Long doctorId,

            @RequestParam
            LocalDate date){

        return doctorScheduleService
                .getDoctorSchedule(
                        doctorId,
                        date);
    }

    @GetMapping("/slots")
    public List<SlotResponseDto>
    getAvailableSlots(

            @RequestParam
            Long doctorId,

            @RequestParam
            LocalDate date){

        return doctorScheduleService
                .getAvailableSlots(
                        doctorId,
                        date);
    }
}