package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.billing.BillRequestDto;
import com.hospital.hms.dto.billing.BillResponseDto;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.Bill;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.enums.PaymentStatus;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.BillItemRepository;
import com.hospital.hms.repository.BillRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.service.BillingService;
import com.hospital.hms.util.InvoicePdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hospital.hms.entity.BillItem;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillingServiceImpl
        implements BillingService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillItemRepository
            billItemRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public BillResponseDto generateBill(
            BillRequestDto dto) {

        Patient patient =
                patientRepository.findById(
                                dto.getPatientId())
                        .orElseThrow();

        Appointment appointment =
                appointmentRepository.findById(
                                dto.getAppointmentId())
                        .orElseThrow();

        double totalAmount = 0;

        for(var item : dto.getItems()) {

            totalAmount +=
                    item.getQuantity()
                            *
                            item.getUnitPrice();
        }

        Bill bill =
                new Bill();

        bill.setPatient(patient);

        bill.setAppointment(
                appointment);

        bill.setTotalAmount(
                totalAmount);

        bill.setPaymentStatus(
                PaymentStatus.PENDING);

        bill.setBillDate(
                LocalDate.now());

        bill =
                billRepository.save(
                        bill);

        for(var itemDto : dto.getItems()) {

            BillItem item =
                    new BillItem();

            item.setBill(
                    bill);

            item.setItemName(
                    itemDto.getItemName());

            item.setQuantity(
                    itemDto.getQuantity());

            item.setUnitPrice(
                    itemDto.getUnitPrice());

            item.setAmount(
                    itemDto.getQuantity()
                            *
                            itemDto.getUnitPrice());

            billItemRepository
                    .save(item);
        }

        return new BillResponseDto(
                bill.getId(),
                bill.getTotalAmount(),
                bill.getPaymentStatus());
    }

    @Override
    public Bill getBillById(
            Long billId) {

        return billRepository.findById(
                        billId)
                .orElseThrow();
    }

    @Override
    public List<Bill> getPatientBills(
            Long patientId) {

        return billRepository
                .findByPatientId(
                        patientId);
    }

    @Override
    public Bill updatePaymentStatus(
            Long billId,
            PaymentStatus paymentStatus) {

        Bill bill =
                billRepository.findById(
                                billId)
                        .orElseThrow();

        bill.setPaymentStatus(
                paymentStatus);

        return billRepository.save(
                bill);
    }

    @Override
    public byte[] generateInvoicePdf(
            Long billId)
            throws Exception {

        Bill bill =
                billRepository.findById(
                                billId)
                        .orElseThrow();

        return InvoicePdfGenerator
                .generatePdf(
                        bill);
    }
}