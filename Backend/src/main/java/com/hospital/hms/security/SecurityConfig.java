package com.hospital.hms.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain
    securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf ->
                        csrf.disable())

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(
                        auth -> auth

                                .requestMatchers(
                                        "/auth/**")
                                .permitAll()

                                // Public Appointment Booking
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/appointments")
                                .permitAll()

                                // Appointment Management
                                .requestMatchers(
                                        "/appointments/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "DOCTOR")

                                // ADMIN

                                .requestMatchers(
                                        "/dashboard/**")
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        "/inventory/**")
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        "/bills/**")
                                .hasRole("ADMIN")

                                // DOCTOR + ADMIN

                                .requestMatchers(
                                        "/patients/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "DOCTOR")

                                .requestMatchers("/doctor/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "DOCTOR")

                                .requestMatchers("/doctor-schedule/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "DOCTOR")

                                .requestMatchers(
                                        "/prescriptions/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "DOCTOR")

                                .requestMatchers(
                                        "/reports/**")
                                .hasAnyRole(
                                        "ADMIN",
                                        "DOCTOR")

                                .anyRequest()
                                .authenticated())

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager
    authenticationManager(
            AuthenticationConfiguration config)
            throws Exception {

        return config
                .getAuthenticationManager();
    }
}