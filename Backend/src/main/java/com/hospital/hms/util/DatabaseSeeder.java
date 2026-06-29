package com.hospital.hms.util;

import com.hospital.hms.entity.User;
import com.hospital.hms.enums.Role;
import com.hospital.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@shindehospital.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@shindehospital.com");
            admin.setPassword("admin@123");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Seeded default admin user (admin@shindehospital.com / admin@123)");
        }
    }
}
