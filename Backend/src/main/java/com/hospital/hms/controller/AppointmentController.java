package com.hospital.hms.controller;

import com.hospital.hms.enums.AppointmentStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hospital.hms.dto.AppointmentRequestDto;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.service.AppointmentService;

import java.time.LocalDate;
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
            @RequestParam AppointmentStatus status){

        return appointmentService
                .updateAppointmentStatus(
                        id,
                        status);
    }

    @GetMapping("/today")
    public List<Appointment>
    getTodayAppointments(){

        return appointmentService
                .getTodayAppointments();
    }

    @GetMapping("/date")
    public List<Appointment>
    getAppointmentsByDate(

            @RequestParam
            LocalDate date){

        return appointmentService
                .getAppointmentsByDate(
                        date);
    }

    @GetMapping("/status")
    public List<Appointment>
    getAppointmentsByStatus(

            @RequestParam
            AppointmentStatus status){

        return appointmentService
                .getAppointmentsByStatus(
                        status);
    }
    @PutMapping("/{id}")
    public Appointment updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequestDto dto) {

        return appointmentService
                .updateAppointment(id, dto);
    }
    @DeleteMapping("/{id}")
    public void deleteAppointment(
            @PathVariable Long id) {

        appointmentService
                .deleteAppointment(id);
    }
}