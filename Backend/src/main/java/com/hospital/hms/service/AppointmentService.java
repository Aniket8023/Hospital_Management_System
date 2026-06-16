package com.hospital.hms.service;

import com.hospital.hms.dto.AppointmentRequestDto;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.enums.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {

    Appointment bookAppointment(
            AppointmentRequestDto dto);

    List<Appointment> getAllAppointments();

    Appointment getAppointmentById(Long id);

    Appointment updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus status);

    List<Appointment>
    getDoctorAppointments(
            Long doctorId);


    List<Appointment>
    getTodayAppointments();

    List<Appointment>
    getAppointmentsByDate(
            LocalDate date);

    List<Appointment>
    getAppointmentsByStatus(
            AppointmentStatus status);

}