package com.hospital.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.hms.entity.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

}