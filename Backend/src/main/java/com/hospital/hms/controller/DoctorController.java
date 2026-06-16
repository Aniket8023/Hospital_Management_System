package com.hospital.hms.controller;

import com.hospital.hms.dto.doctor.DoctorRequestDto;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.service.AppointmentService;
import com.hospital.hms.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService
            doctorService;

    @Autowired
    private AppointmentService
            appointmentService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Doctor addDoctor(
            @RequestBody
            DoctorRequestDto dto){

        return doctorService
                .addDoctor(dto);
    }

    @GetMapping
    public List<Doctor>
    getAllDoctors(){

        return doctorService
                .getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(
            @PathVariable Long id){

        return doctorService
                .getDoctorById(id);
    }

    @GetMapping("/{doctorId}/appointments")
    public List<Appointment>
    getDoctorAppointments(
            @PathVariable Long doctorId){

        return appointmentService
                .getDoctorAppointments(
                        doctorId);
    }
}
