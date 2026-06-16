package com.hospital.hms.serviceimpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.hms.dto.AppointmentRequestDto;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.enums.AppointmentStatus;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Appointment bookAppointment(
            AppointmentRequestDto dto) {

        // 1. Check Patient Exists

        Optional<Patient> optionalPatient =
                patientRepository.findByAadharNumber(
                        dto.getAadharNumber());

        Patient patient;

        if (optionalPatient.isPresent()) {

            patient = optionalPatient.get();

        } else {

            // Create New Patient

            patient = new Patient();

            patient.setFullName(
                    dto.getFullName());

            patient.setMobileNumber(
                    dto.getMobileNumber());

            patient.setAadharNumber(
                    dto.getAadharNumber());

            patient.setAge(
                    dto.getAge());

            patient.setGender(
                    dto.getGender());

            patient.setAddress(
                    dto.getAddress());

            patient =
                    patientRepository.save(patient);
        }

        // 2. Get Doctor
        Doctor doctor =
                doctorRepository
                        .findFirstBy()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor Not Found"));

        boolean alreadyBooked =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                                doctor.getId(),
                                dto.getAppointmentDate(),
                                dto.getAppointmentTime());

        if(alreadyBooked){

            throw new RuntimeException(
                    "This slot is already booked");
        }

        // 3. Create Appointment

        Appointment appointment =
                new Appointment();

        appointment.setPatient(patient);

        appointment.setDoctor(doctor);

        appointment.setAppointmentDate(
                dto.getAppointmentDate());

        appointment.setAppointmentTime(
                dto.getAppointmentTime());

        appointment.setProblemDescription(
                dto.getProblemDescription());

        appointment.setStatus(
                AppointmentStatus.PENDING);

        // 4. Save Appointment

        return appointmentRepository.save(
                appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();

    }

    @Override
    public Appointment getAppointmentById(Long id) {

        return appointmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Appointment Not Found"));

    }

    @Override
    public Appointment updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus status) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment Not Found"));

        appointment.setStatus(status);

        return appointmentRepository.save(
                appointment);
    }

    @Override
    public List<Appointment>
    getDoctorAppointments(
            Long doctorId) {

        return appointmentRepository
                .findByDoctorId(
                        doctorId);
    }

    @Override
    public List<Appointment>
    getTodayAppointments() {

        return appointmentRepository
                .findByAppointmentDate(
                        LocalDate.now());
    }

    @Override
    public List<Appointment>
    getAppointmentsByDate(
            LocalDate date) {

        return appointmentRepository
                .findByAppointmentDate(
                        date);
    }

    @Override
    public List<Appointment>
    getAppointmentsByStatus(
            AppointmentStatus status) {

        return appointmentRepository
                .findByStatus(
                        status);
    }
}