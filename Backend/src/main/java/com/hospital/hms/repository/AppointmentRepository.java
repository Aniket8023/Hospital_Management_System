package com.hospital.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.hms.entity.Appointment;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment>
    findByDoctorId(Long doctorId);


}