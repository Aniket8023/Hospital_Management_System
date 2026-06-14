package com.hospital.hms.serviceimpl;

import com.hospital.hms.dto.prescription.PrescriptionRequestDto;
import com.hospital.hms.entity.*;
import com.hospital.hms.repository.*;
import com.hospital.hms.service.PrescriptionService;
import com.hospital.hms.util.PrescriptionPdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionServiceImpl
        implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PrescriptionMedicineRepository
            prescriptionMedicineRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public Prescription createPrescription(
            PrescriptionRequestDto dto) {

        Patient patient =
                patientRepository.findById(
                                dto.getPatientId())
                        .orElseThrow();

        Doctor doctor =
                doctorRepository.findById(
                                dto.getDoctorId())
                        .orElseThrow();

        Appointment appointment =
                appointmentRepository.findById(
                                dto.getAppointmentId())
                        .orElseThrow();

        Prescription prescription =
                new Prescription();

        prescription.setPatient(patient);

        prescription.setDoctor(doctor);

        prescription.setAppointment(
                appointment);

        prescription.setDiagnosis(
                dto.getDiagnosis());

        prescription.setAdvice(
                dto.getAdvice());

        prescription.setPrescriptionDate(
                java.time.LocalDate.now());

        prescription =
                prescriptionRepository.save(
                        prescription);

        for(var medicine :
                dto.getMedicines()) {

            PrescriptionMedicine pm =
                    new PrescriptionMedicine();

            pm.setPrescription(
                    prescription);

            pm.setMedicineName(
                    medicine.getMedicineName());

            pm.setDosage(
                    medicine.getDosage());

            pm.setDuration(
                    medicine.getDuration());

            prescriptionMedicineRepository
                    .save(pm);
        }

        return prescription;
    }

    @Override
    public Prescription getPrescriptionById(
            Long prescriptionId) {

        return prescriptionRepository
                .findById(prescriptionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Prescription Not Found"));
    }

    @Override
    public List<Prescription> getPatientPrescriptionHistory(
            Long patientId) {

        return prescriptionRepository
                .findByPatientId(patientId);

    }

    @Override
    public byte[] generatePrescriptionPdf(
            Long prescriptionId)
            throws Exception {

        Prescription prescription =
                prescriptionRepository
                        .findById(
                                prescriptionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prescription Not Found"));

        List<PrescriptionMedicine>
                medicines =
                prescriptionMedicineRepository
                        .findByPrescriptionId(
                                prescriptionId);

        return PrescriptionPdfGenerator
                .generatePdf(
                        prescription,
                        medicines);
    }
}