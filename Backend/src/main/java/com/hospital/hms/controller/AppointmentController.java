package com.hospital.hms.controller;

import com.hospital.hms.dto.AppointmentStatusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hospital.hms.dto.AppointmentRequestDto;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.service.AppointmentService;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public Appointment bookAppointment(
            @RequestBody AppointmentRequestDto dto){

        return appointmentService
                .bookAppointment(dto);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService.getAllAppointments();

    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(
            @PathVariable Long id){

        return appointmentService
                .getAppointmentById(id);

    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(
            @PathVariable Long id,
            @RequestBody AppointmentStatusDto dto){

        return appointmentService
                .updateStatus(
                        id,
                        dto.getStatus());

    }

}