package com.hospital.hms.repository;

import com.hospital.hms.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DoctorScheduleRepository
        extends JpaRepository<
        DoctorSchedule,
        Long> {

    List<DoctorSchedule>
    findByDoctorIdAndScheduleDate(
            Long doctorId,
            LocalDate date);
}