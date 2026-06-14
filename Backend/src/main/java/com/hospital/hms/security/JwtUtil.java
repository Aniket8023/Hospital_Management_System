package com.hospital.hms.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET =
            "hospital_management_secret_key_hospital_management_secret_key";

    public String generateToken(String email) {

        SecretKey key =
                Keys.hmacShaKeyFor(
                        SECRET.getBytes());

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000))
                .signWith(
                        key,
                        SignatureAlgorithm.HS256)
                .compact();
    }
}