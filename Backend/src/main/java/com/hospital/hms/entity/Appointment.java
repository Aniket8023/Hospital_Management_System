package com.hospital.hms.entity;

import com.hospital.hms.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JsonIgnoreProperties({
            "appointments",
            "prescriptions",
            "bills"
    })
    private Patient patient;

    @ManyToOne
    @JsonIgnoreProperties({
            "user"
    })
    private Doctor doctor;
    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String problemDescription;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
}