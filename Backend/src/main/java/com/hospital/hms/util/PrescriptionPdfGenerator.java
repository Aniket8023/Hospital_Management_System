package com.hospital.hms.util;

import com.hospital.hms.entity.Prescription;
import com.hospital.hms.entity.PrescriptionMedicine;
import java.util.List;
import java.time.format.DateTimeFormatter;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;

import java.io.ByteArrayOutputStream;

public class PrescriptionPdfGenerator {

    private static final BaseColor NAVY_BLUE = new BaseColor(11, 44, 86);
    private static final BaseColor LIGHT_BLUE = new BaseColor(230, 239, 250);
    private static final BaseColor TEXT_GREY = new BaseColor(100, 100, 100);
    private static final BaseColor BORDER_GREY = new BaseColor(210, 210, 210);

    public static byte[] generatePdf(
            Prescription prescription,
            List<PrescriptionMedicine> medicines)
            throws Exception {

        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        // 1. HEADER SECTION — full landscape logo centered
        Image logoImg = null;
        try {
            java.net.URL logoUrl = PrescriptionPdfGenerator.class.getResource("/logo.png");
            if (logoUrl != null) {
                logoImg = Image.getInstance(logoUrl);
                // 1024x682 aspect ratio ~1.5 — scaleToFit(250,85) → height-limited: 127×85 pts
                logoImg.scaleToFit(250, 85);
                logoImg.setAlignment(Element.ALIGN_CENTER);
                document.add(logoImg);
            }
        } catch (Exception e) {
            System.err.println("Could not load logo: " + e.getMessage());
        }

        if (logoImg == null) {
            Font fallbackFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, NAVY_BLUE);
            Paragraph fallback = new Paragraph("SHINDE ENT HOSPITAL", fallbackFont);
            fallback.setAlignment(Element.ALIGN_CENTER);
            document.add(fallback);
        }

        // Blue Divider Line
        LineSeparator ls = new LineSeparator(1.5f, 100, NAVY_BLUE, Element.ALIGN_CENTER, -5);
        document.add(new Chunk(ls));
        document.add(new Paragraph(" "));


        // 2. PRESCRIPTION METADATA (Right-aligned ID & Date)
        Font metaFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, NAVY_BLUE);
        Font metaBoldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);

        String prescriptionNo = String.format("PRES-%d-00%03d", 
                prescription.getPrescriptionDate().getYear(), 
                prescription.getId());
        String formattedDate = prescription.getPrescriptionDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

        PdfPTable metaTable = new PdfPTable(1);
        metaTable.setWidthPercentage(100);
        metaTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
        
        Paragraph pNo = new Paragraph();
        pNo.add(new Chunk("Prescription No : ", metaBoldFont));
        pNo.add(new Chunk(prescriptionNo, metaFont));
        pNo.setAlignment(Element.ALIGN_RIGHT);

        Paragraph pDate = new Paragraph();
        pDate.add(new Chunk("Date                  : ", metaBoldFont));
        pDate.add(new Chunk(formattedDate, metaFont));
        pDate.setAlignment(Element.ALIGN_RIGHT);
        pDate.setSpacingBefore(2);

        metaTable.addCell(new PdfPCell(pNo) {{ setBorder(PdfPCell.NO_BORDER); }});
        metaTable.addCell(new PdfPCell(pDate) {{ setBorder(PdfPCell.NO_BORDER); }});
        document.add(metaTable);
        document.add(new Paragraph(" "));

        // 3. PATIENT & DOCTOR INFO (Two-column layout)
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setWidths(new float[]{1f, 1f});
        
        Font labelFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
        Font valFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, NAVY_BLUE);

        // Left Column (Patient)
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(PdfPCell.NO_BORDER);
        leftCell.setPaddingRight(10);
        
        Paragraph pName = new Paragraph();
        pName.add(new Chunk("Patient Name  :  ", labelFont));
        pName.add(new Chunk(prescription.getPatient().getFullName(), valFont));
        leftCell.addElement(pName);

        Paragraph pAgeGender = new Paragraph();
        pAgeGender.setSpacingBefore(4);
        pAgeGender.add(new Chunk("Age / Gender  :  ", labelFont));
        pAgeGender.add(new Chunk(String.format("%d / %s", prescription.getPatient().getAge(), prescription.getPatient().getGender()), valFont));
        leftCell.addElement(pAgeGender);

        Paragraph pMobile = new Paragraph();
        pMobile.setSpacingBefore(4);
        pMobile.add(new Chunk("Mobile             :  ", labelFont));
        pMobile.add(new Chunk(prescription.getPatient().getMobileNumber() != null ? prescription.getPatient().getMobileNumber() : "N/A", valFont));
        leftCell.addElement(pMobile);
        infoTable.addCell(leftCell);

        // Right Column (Doctor)
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(PdfPCell.NO_BORDER);
        rightCell.setPaddingLeft(10);

        Paragraph dName = new Paragraph();
        dName.add(new Chunk("Doctor             :  ", labelFont));
        dName.add(new Chunk("Dr. " + prescription.getDoctor().getUser().getName(), valFont));
        rightCell.addElement(dName);

        Paragraph dSpec = new Paragraph();
        dSpec.setSpacingBefore(4);
        dSpec.add(new Chunk("Specialization  :  ", labelFont));
        dSpec.add(new Chunk(prescription.getDoctor().getSpecialization(), valFont));
        rightCell.addElement(dSpec);
        infoTable.addCell(rightCell);

        document.add(infoTable);
        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        // Helper method to write styled Section Header Banners
        addSectionHeader(document, "DIAGNOSIS");
        
        Font contentFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
        Paragraph diagDesc = new Paragraph(prescription.getDiagnosis(), contentFont);
        diagDesc.setSpacingBefore(6);
        diagDesc.setSpacingAfter(15);
        diagDesc.setIndentationLeft(8);
        document.add(diagDesc);

        addSectionHeader(document, "MEDICINES");

        // Medicines Table
        PdfPTable medTable = new PdfPTable(4);
        medTable.setWidthPercentage(100);
        medTable.setWidths(new float[]{1f, 4f, 3f, 2f});
        medTable.setSpacingBefore(8);
        medTable.setSpacingAfter(15);

        // Table Header
        Font tblHeaderFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
        addTableHeaderCell(medTable, "Sr. No.", tblHeaderFont);
        addTableHeaderCell(medTable, "Medicine Name", tblHeaderFont);
        addTableHeaderCell(medTable, "Dosage (Morning/Afternoon/Night)", tblHeaderFont);
        addTableHeaderCell(medTable, "Duration", tblHeaderFont);

        // Table Body
        for (int i = 0; i < medicines.size(); i++) {
            PrescriptionMedicine med = medicines.get(i);
            addTableCell(medTable, String.valueOf(i + 1), contentFont, Element.ALIGN_CENTER);
            addTableCell(medTable, med.getMedicineName(), contentFont, Element.ALIGN_LEFT);
            addTableCell(medTable, formatDosage(med.getDosage()), contentFont, Element.ALIGN_CENTER);
            addTableCell(medTable, med.getDuration(), contentFont, Element.ALIGN_CENTER);
        }
        document.add(medTable);

        addSectionHeader(document, "ADVICE");
        
        if (prescription.getAdvice() != null && !prescription.getAdvice().trim().isEmpty()) {
            String[] advices = prescription.getAdvice().split("\n");
            for (String advice : advices) {
                if (advice.trim().isEmpty()) continue;
                Paragraph bullet = new Paragraph("• " + advice.trim(), contentFont);
                bullet.setSpacingBefore(3);
                bullet.setIndentationLeft(12);
                document.add(bullet);
            }
        } else {
            Paragraph bullet = new Paragraph("• No special advice.", contentFont);
            bullet.setSpacingBefore(3);
            bullet.setIndentationLeft(12);
            document.add(bullet);
        }
        
        document.add(new Paragraph(" "));

        // 4. SIGNATURE BLOCK (Right aligned)
        PdfPTable sigTable = new PdfPTable(1);
        sigTable.setWidthPercentage(100);
        sigTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);
        
        PdfPCell sigCell = new PdfPCell();
        sigCell.setBorder(PdfPCell.NO_BORDER);
        sigCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        sigCell.setPaddingTop(30);

        Font cursiveFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.ITALIC, NAVY_BLUE);
        Font sigBoldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
        Font sigRegFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, NAVY_BLUE);

        String docName = "Dr. " + prescription.getDoctor().getUser().getName();
        
        Image sigImage = null;
        try {
            java.net.URL sigUrl = PrescriptionPdfGenerator.class.getResource("/signature.png");
            if (sigUrl != null) {
                sigImage = Image.getInstance(sigUrl);
                sigImage.scaleToFit(100, 45);
                sigImage.setAlignment(Element.ALIGN_RIGHT);
            }
        } catch (Exception e) {
            System.err.println("Could not load signature image from resources: " + e.getMessage());
        }

        if (sigImage != null) {
            sigCell.addElement(sigImage);
        } else {
            Paragraph sigImg = new Paragraph(prescription.getDoctor().getUser().getName(), cursiveFont);
            sigImg.setAlignment(Element.ALIGN_RIGHT);
            sigCell.addElement(sigImg);
        }

        Paragraph sigName = new Paragraph(docName, sigBoldFont);
        sigName.setAlignment(Element.ALIGN_RIGHT);
        sigName.setSpacingBefore(4);
        sigCell.addElement(sigName);

        Paragraph sigSpec = new Paragraph(prescription.getDoctor().getSpecialization(), sigRegFont);
        sigSpec.setAlignment(Element.ALIGN_RIGHT);
        sigCell.addElement(sigSpec);

        String regNoStr = String.format("Reg. No. MMC-%d", 123450 + prescription.getDoctor().getId());
        Paragraph sigReg = new Paragraph(regNoStr, sigRegFont);
        sigReg.setAlignment(Element.ALIGN_RIGHT);
        sigCell.addElement(sigReg);

        sigTable.addCell(sigCell);
        document.add(sigTable);

        // 5. FOOTER
        document.add(new Paragraph(" "));
        document.add(new Chunk(new LineSeparator(1f, 100, NAVY_BLUE, Element.ALIGN_CENTER, -5)));
        
        Paragraph footerMsg = new Paragraph("Thank you for visiting Shinde Hospital. We wish you good health!", 
                new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, TEXT_GREY));
        footerMsg.setAlignment(Element.ALIGN_CENTER);
        footerMsg.setSpacingBefore(5);
        document.add(footerMsg);

        document.close();

        return out.toByteArray();
    }

    private static void addSectionHeader(Document doc, String title) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        
        Font font = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
        
        PdfPCell cell = new PdfPCell(new Phrase(title, font));
        cell.setBackgroundColor(LIGHT_BLUE);
        cell.setBorder(PdfPCell.NO_BORDER);
        cell.setPaddingTop(5);
        cell.setPaddingBottom(5);
        cell.setPaddingLeft(8);
        
        table.addCell(cell);
        doc.add(table);
    }

    private static void addTableHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(LIGHT_BLUE);
        cell.setBorderColor(BORDER_GREY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(6);
        table.addCell(cell);
    }

    private static void addTableCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setBorderColor(BORDER_GREY);
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(6);
        table.addCell(cell);
    }

    /**
     * Converts "1-0-1" style dosage into human-readable label.
     * e.g. "1-0-1" → "Morning / Night"
     *      "1-1-1" → "Morning / Afternoon / Night"
     *      "0-1-0" → "Afternoon"
     */
    private static String formatDosage(String dosage) {
        if (dosage == null || dosage.isEmpty()) return "—";
        String[] parts = dosage.split("-");
        if (parts.length < 3) return dosage; // fallback if already human-readable
        StringBuilder sb = new StringBuilder();
        String[] labels = {"Morning", "Afternoon", "Night"};
        for (int i = 0; i < 3; i++) {
            if ("1".equals(parts[i].trim())) {
                if (sb.length() > 0) sb.append(" / ");
                sb.append(labels[i]);
            }
        }
        return sb.length() > 0 ? sb.toString() : "—";
    }
}