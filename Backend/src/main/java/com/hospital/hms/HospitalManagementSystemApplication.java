package com.hospital.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalManagementSystemApplication {

	public static void main(String[] args) {

		SpringApplication.run(HospitalManagementSystemApplication.class, args);
		System.out.println("🚀 Hospital Backend is Running on http://localhost:8080");
	}

}
