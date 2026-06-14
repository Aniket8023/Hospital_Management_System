package com.hospital.hms.util;

import com.hospital.hms.entity.Prescription;
import com.hospital.hms.entity.PrescriptionMedicine;
import java.util.List;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;


import java.io.ByteArrayOutputStream;

public class PrescriptionPdfGenerator {

    public static byte[] generatePdf(
            Prescription prescription,
            List<PrescriptionMedicine> medicines)
            throws Exception {

        Document document =
                new Document();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter.getInstance(
                document,
                out);

        document.open();

        Font hospitalFont =
                new Font(
                        Font.FontFamily.HELVETICA,
                        20,
                        Font.BOLD);

        Paragraph hospitalName =
                new Paragraph(
                        "SHINDE HOSPITAL",
                        hospitalFont);

        hospitalName.setAlignment(
                Element.ALIGN_CENTER);

        document.add(hospitalName);

        document.add(
                new Paragraph(
                        "ENT & General Healthcare"));

        document.add(
                new Paragraph(
                        "------------------------------------------------"));

        document.add(
                new Paragraph(
                        "Patient Name : "
                                + prescription
                                .getPatient()
                                .getFullName()));

        document.add(
                new Paragraph(
                        "Age : "
                                + prescription
                                .getPatient()
                                .getAge()));

        document.add(
                new Paragraph(
                        "Gender : "
                                + prescription
                                .getPatient()
                                .getGender()));

        document.add(
                new Paragraph(
                        "Doctor : "
                                + prescription
                                .getDoctor()
                                .getUser()
                                .getName()));

        document.add(
                new Paragraph(
                        "Specialization : "
                                + prescription
                                .getDoctor()
                                .getSpecialization()));

        document.add(
                new Paragraph(
                        "Date: "
                                + prescription
                                .getPrescriptionDate()));

        document.add(
                new Paragraph(" "));

        document.add(
                new Paragraph(
                        " "));

        document.add(
                new Paragraph(
                        "DIAGNOSIS"));

        document.add(
                new Paragraph(
                        " "));

        document.add(
                new Paragraph(
                        "MEDICINES"));

        document.add(
                new Paragraph(
                        prescription
                                .getDiagnosis()));

        for(int i = 0;
            i < medicines.size();
            i++) {

            PrescriptionMedicine med =
                    medicines.get(i);

            document.add(
                    new Paragraph(
                            (i + 1)
                                    + ". "
                                    + med.getMedicineName()));

            document.add(
                    new Paragraph(
                            "Dosage : "
                                    + med.getDosage()));

            document.add(
                    new Paragraph(
                            "Duration : "
                                    + med.getDuration()));

            document.add(
                    new Paragraph(
                            " "));
        }

        document.add(
                new Paragraph(
                        "ADVICE"));

        document.add(
                new Paragraph(
                        prescription
                                .getAdvice()));

        document.add(
                new Paragraph(
                        "\n\n"));

        document.add(
                new Paragraph(
                        "Doctor Signature"));

        document.add(
                new Paragraph(
                        prescription
                                .getDoctor()
                                .getUser()
                                .getName()));

        document.close();

        return out.toByteArray();
    }
}