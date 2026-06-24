package com.hospital.hms.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/auth/**")
                        .permitAll()

                        .requestMatchers(
                                "/appointments",
                                "/appointments/**")
                        .hasAnyRole("ADMIN", "DOCTOR")

                        .requestMatchers(
                                "/appointments",
                                "/appointments/**")
                        .hasAnyRole("ADMIN", "DOCTOR")

                        .requestMatchers(
                                "/dashboard",
                                "/dashboard/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/inventory",
                                "/inventory/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/bills",
                                "/bills/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/patients",
                                "/patients/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR")

                        .requestMatchers(
                                "/doctor",
                                "/doctor/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR")

                        .requestMatchers(
                                "/doctor-schedule",
                                "/doctor-schedule/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/prescriptions")
                        .permitAll()

                        .requestMatchers(
                                "/prescriptions",
                                "/prescriptions/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR")

                        .requestMatchers(
                                "/reports",
                                "/reports/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DOCTOR")

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config)
            throws Exception {

        return config.getAuthenticationManager();
    }
}