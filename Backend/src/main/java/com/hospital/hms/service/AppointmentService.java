package com.hospital.hms.service;

import com.hospital.hms.dto.AppointmentRequestDto;
import com.hospital.hms.entity.Appointment;

import java.util.List;

public interface AppointmentService {

    Appointment bookAppointment(
            AppointmentRequestDto dto);

    List<Appointment> getAllAppointments();

    Appointment getAppointmentById(Long id);

    Appointment updateStatus(
            Long id,
            String status);

}