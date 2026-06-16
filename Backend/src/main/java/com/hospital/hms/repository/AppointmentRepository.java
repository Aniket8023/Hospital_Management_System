package com.hospital.hms.repository;

import com.hospital.hms.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.hms.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment>
    findByDoctorId(Long doctorId);

    List<Appointment>
    findByAppointmentDate(
            LocalDate appointmentDate);

    List<Appointment>
    findByStatus(
            AppointmentStatus status);

    Long countByStatus(
            AppointmentStatus status);

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime);

    List<Appointment>
    findByDoctorIdAndAppointmentDate(
            Long doctorId,
            LocalDate appointmentDate);
}