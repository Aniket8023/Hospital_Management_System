package com.hospital.hms.dto.dashboard;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponseDto {

    private Long totalPatients;

    private Long totalDoctors;

    private Long totalAppointments;

    private Long pendingAppointments;

    private Long completedAppointments;

    private Long cancelledAppointments;

    private Double totalRevenue;
}