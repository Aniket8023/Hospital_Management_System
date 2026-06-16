package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.doctor.DoctorRequestDto;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.User;
import com.hospital.hms.enums.Role;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.UserRepository;
import com.hospital.hms.service.DoctorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl
        implements DoctorService {

    @Autowired
    private DoctorRepository
            doctorRepository;

    @Autowired
    private UserRepository
            userRepository;

    @Override
    public Doctor addDoctor(
            DoctorRequestDto dto) {

        User user =
                new User();

        user.setName(
                dto.getName());

        user.setEmail(
                dto.getEmail());

        user.setPassword(
                dto.getPassword());

        user.setRole(
                Role.DOCTOR);

        user =
                userRepository.save(
                        user);

        Doctor doctor =
                new Doctor();

        doctor.setUser(user);

        doctor.setSpecialization(
                dto.getSpecialization());

        doctor.setQualification(
                dto.getQualification());

        doctor.setExperience(
                dto.getExperience());

        return doctorRepository
                .save(doctor);
    }

    @Override
    public List<Doctor>
    getAllDoctors() {

        return doctorRepository
                .findAll();
    }

    @Override
    public Doctor getDoctorById(
            Long id) {

        return doctorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor Not Found"));
    }
}