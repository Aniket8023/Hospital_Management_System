package com.hospital.hms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    private String supplierName;

    private String contactPerson;

    private String mobileNumber;

    private String email;

    private String address;
}