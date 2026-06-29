    package com.hospital.hms.entity;

    import jakarta.persistence.*;
    import lombok.*;

    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class Patient {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String fullName;

        private String mobileNumber;

        private String aadharNumber;

        private Integer age;

        private String gender;

        private String address;
    }