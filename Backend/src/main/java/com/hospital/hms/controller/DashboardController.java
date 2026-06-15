package com.hospital.hms.controller;

import com.hospital.hms.dto.dashboard.DashboardResponseDto;
import com.hospital.hms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService
            dashboardService;

    @GetMapping
    public DashboardResponseDto
    getDashboard() {

        return dashboardService
                .getDashboardData();
    }
}