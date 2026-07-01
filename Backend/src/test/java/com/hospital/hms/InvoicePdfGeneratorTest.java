package com.hospital.hms;

import com.hospital.hms.entity.*;
import com.hospital.hms.enums.PaymentStatus;
import com.hospital.hms.util.InvoicePdfGenerator;
import org.junit.jupiter.api.Test;

import java.io.FileOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class InvoicePdfGeneratorTest {

    @Test
    public void testGeneratePdf() throws Exception {
        Bill bill = new Bill();
        bill.setId(1L);
        bill.setBillDate(LocalDate.of(2026, 7, 1));
        bill.setTotalAmount(700.0);
        bill.setPaymentStatus(PaymentStatus.PAID);

        Patient patient = new Patient();
        patient.setId(12L);
        patient.setFullName("Rahul Sharma");
        patient.setMobileNumber("9876543210");
        patient.setAddress("Pune, Maharashtra");
        bill.setPatient(patient);

        User docUser = new User();
        docUser.setName("Akshay Patil");

        Doctor doctor = new Doctor();
        doctor.setId(1L);
        doctor.setUser(docUser);
        doctor.setSpecialization("ENT Specialist");

        Appointment appointment = new Appointment();
        appointment.setId(45L);
        appointment.setDoctor(doctor);
        bill.setAppointment(appointment);

        List<BillItem> items = new ArrayList<>();
        BillItem item1 = new BillItem();
        item1.setId(1L);
        item1.setItemName("Consultation Fee");
        item1.setQuantity(1);
        item1.setUnitPrice(500.0);
        item1.setAmount(500.0);
        items.add(item1);

        BillItem item2 = new BillItem();
        item2.setId(2L);
        item2.setItemName("Paracetamol 500mg");
        item2.setQuantity(2);
        item2.setUnitPrice(50.0);
        item2.setAmount(100.0);
        items.add(item2);

        BillItem item3 = new BillItem();
        item3.setId(3L);
        item3.setItemName("Vitamin C");
        item3.setQuantity(1);
        item3.setUnitPrice(100.0);
        item3.setAmount(100.0);
        items.add(item3);

        bill.setItems(items);

        byte[] pdfBytes = InvoicePdfGenerator.generatePdf(bill);

        try (FileOutputStream fos = new FileOutputStream("target/generated_invoice_test.pdf")) {
            fos.write(pdfBytes);
        }
        System.out.println("Generated PDF at target/generated_invoice_test.pdf");
    }
}
