package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.schedule.ScheduleRequestDto;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.DoctorSchedule;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.DoctorScheduleRepository;
import com.hospital.hms.service.DoctorScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.hms.dto.schedule.SlotResponseDto;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.repository.AppointmentRepository;

import java.time.LocalTime;
import java.util.ArrayList;

import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorScheduleServiceImpl
        implements DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository
            doctorScheduleRepository;

    @Autowired
    private DoctorRepository
            doctorRepository;

    @Autowired
    private AppointmentRepository
            appointmentRepository;

    @Override
    public DoctorSchedule createSchedule(
            ScheduleRequestDto dto) {

        Doctor doctor =
                doctorRepository.findById(
                                dto.getDoctorId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor Not Found"));

        DoctorSchedule schedule =
                new DoctorSchedule();

        schedule.setDoctor(
                doctor);

        schedule.setScheduleDate(
                dto.getScheduleDate());

        schedule.setStartTime(
                dto.getStartTime());

        schedule.setEndTime(
                dto.getEndTime());

        schedule.setAvailable(
                true);

        return doctorScheduleRepository
                .save(schedule);
    }

    @Override
    public List<DoctorSchedule>
    getDoctorSchedule(
            Long doctorId,
            LocalDate date) {

        return doctorScheduleRepository
                .findByDoctorIdAndScheduleDate(
                        doctorId,
                        date);
    }

    @Override
    public List<SlotResponseDto>
    getAvailableSlots(
            Long doctorId,
            LocalDate date) {

        List<DoctorSchedule> schedules =
                doctorScheduleRepository
                        .findByDoctorIdAndScheduleDate(
                                doctorId,
                                date);

        List<Appointment> appointments =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDate(
                                doctorId,
                                date);

        List<SlotResponseDto> slots =
                new ArrayList<>();

        for(DoctorSchedule schedule
                : schedules){

            LocalTime current =
                    schedule.getStartTime();

            while(current.isBefore(
                    schedule.getEndTime())) {

                boolean available = true;

                for(Appointment appointment
                        : appointments){

                    if(appointment
                            .getAppointmentTime()
                            .equals(current)) {

                        available = false;
                        break;
                    }
                }

                slots.add(
                        new SlotResponseDto(
                                current.toString(),
                                available));

                current =
                        current.plusMinutes(
                                30);
            }
        }

        return slots;
    }
}