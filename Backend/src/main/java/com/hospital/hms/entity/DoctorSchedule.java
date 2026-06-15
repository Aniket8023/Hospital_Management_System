package com.hospital.hms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSchedule {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

    private LocalDate scheduleDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Boolean available;
}