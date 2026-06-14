package com.hospital.hms.controller;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private AppointmentService
            appointmentService;

    @GetMapping("/{doctorId}/appointments")
    public List<Appointment>
    getDoctorAppointments(
            @PathVariable Long doctorId){

        return appointmentService
                .getDoctorAppointments(
                        doctorId);
    }
}
