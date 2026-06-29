package com.hospital.hms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {

            System.out.println("\n========== JWT FILTER ==========");
            System.out.println("Path : " + request.getServletPath());

            String authHeader =
                    request.getHeader("Authorization");

            System.out.println("Authorization Header : "
                    + authHeader);

            String token = null;
            String email = null;

            if (authHeader != null
                    && authHeader.startsWith("Bearer ")) {

                token = authHeader.substring(7);

                System.out.println("Token : " + token);

                email = jwtUtil.extractEmail(token);

                System.out.println("Email from Token : "
                        + email);
            }

            if (email != null
                    && SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    == null) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(email);

                System.out.println(
                        "UserDetails Username : "
                                + userDetails.getUsername());

                if (jwtUtil.validateToken(
                        token,
                        userDetails.getUsername())) {

                    String role =
                            jwtUtil.extractRole(token);

                    System.out.println(
                            "Role from Token : "
                                    + role);

                    UsernamePasswordAuthenticationToken
                            authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    List.of(
                                            new SimpleGrantedAuthority(
                                                    "ROLE_" + role)));

                    System.out.println(
                            "Authorities : "
                                    + authToken.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                    System.out.println(
                            "Authentication SET successfully.");
                } else {

                    System.out.println(
                            "Token validation FAILED.");
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT FILTER ERROR : "
                            + e.getMessage());

            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}