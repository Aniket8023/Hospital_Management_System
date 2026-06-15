package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.dashboard.DashboardResponseDto;
import com.hospital.hms.enums.AppointmentStatus;
import com.hospital.hms.repository.*;
import com.hospital.hms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl
        implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository
            appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Override
    public DashboardResponseDto
    getDashboardData() {

        return new DashboardResponseDto(

                patientRepository.count(),

                doctorRepository.count(),

                appointmentRepository.count(),

                appointmentRepository
                        .countByStatus(
                                AppointmentStatus.PENDING),

                appointmentRepository
                        .countByStatus(
                                AppointmentStatus.COMPLETED),

                appointmentRepository
                        .countByStatus(
                                AppointmentStatus.CANCELLED),

                billRepository
                        .getTotalRevenue()
        );
    }
}