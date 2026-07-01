package com.hospital.hms.util;

import com.hospital.hms.entity.Bill;
import com.hospital.hms.entity.BillItem;
import com.hospital.hms.enums.PaymentStatus;
import java.time.format.DateTimeFormatter;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;

import java.io.ByteArrayOutputStream;

public class InvoicePdfGenerator {

    private static final BaseColor NAVY_BLUE = new BaseColor(11, 44, 86);
    private static final BaseColor LIGHT_BLUE = new BaseColor(230, 239, 250);
    private static final BaseColor TEXT_GREY = new BaseColor(100, 100, 100);
    private static final BaseColor BORDER_GREY = new BaseColor(210, 210, 210);
    private static final BaseColor GREEN_PAID = new BaseColor(34, 139, 34);
    private static final BaseColor RED_PENDING = new BaseColor(178, 34, 34);

    public static byte[] generatePdf(Bill bill) throws Exception {
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        // 1. HEADER SECTION — Logo left, text centered
        PdfPTable headerTable = new PdfPTable(3);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1.5f, 4f, 1.5f});
        
        PdfPCell logoCell = new PdfPCell();
        logoCell.setBorder(PdfPCell.NO_BORDER);
        logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        try {
            java.net.URL logoUrl = InvoicePdfGenerator.class.getResource("/logo.png");
            if (logoUrl != null) {
                Image logoImg = Image.getInstance(logoUrl);
                logoImg.scaleToFit(80, 80);
                logoImg.setAlignment(Element.ALIGN_CENTER);
                logoCell.addElement(logoImg);
            }
        } catch (Exception e) {
            System.err.println("Could not load logo: " + e.getMessage());
        }
        headerTable.addCell(logoCell);
        
        PdfPCell textCell = new PdfPCell();
        textCell.setBorder(PdfPCell.NO_BORDER);
        textCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        
        Font hFont = new Font(Font.FontFamily.TIMES_ROMAN, 24, Font.BOLD, NAVY_BLUE);
        Paragraph p1 = new Paragraph("SHINDE HOSPITAL", hFont);
        p1.setAlignment(Element.ALIGN_CENTER);
        textCell.addElement(p1);
        
        Font subFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, NAVY_BLUE);
        Paragraph p2 = new Paragraph("ENT & General Healthcare", subFont);
        p2.setAlignment(Element.ALIGN_CENTER);
        p2.setSpacingBefore(2);
        textCell.addElement(p2);
        
        Font addrFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
        Paragraph p3 = new Paragraph("Pune, Maharashtra | Phone: +91 98765 43210", addrFont);
        p3.setAlignment(Element.ALIGN_CENTER);
        p3.setSpacingBefore(2);
        textCell.addElement(p3);
        
        headerTable.addCell(textCell);
        
        PdfPCell emptyCell = new PdfPCell();
        emptyCell.setBorder(PdfPCell.NO_BORDER);
        headerTable.addCell(emptyCell);
        
        document.add(headerTable);

        // Blue Divider Line
        LineSeparator ls = new LineSeparator(1.5f, 100, NAVY_BLUE, Element.ALIGN_CENTER, -5);
        document.add(new Chunk(ls));
        document.add(new Paragraph(" "));


        // 2. PATIENT, DOCTOR & BILLING METADATA (Two-column layout)
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setWidths(new float[]{1.1f, 0.9f});
        
        Font labelFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
        Font valFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, NAVY_BLUE);

        String invoiceNo = String.format("INV-%d-00%03d", 
                bill.getBillDate().getYear(), 
                bill.getId());
        String formattedDate = bill.getBillDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        String patientIdStr = String.format("PT-%d-00%03d", 
                bill.getBillDate().getYear(), 
                bill.getPatient().getId());

        // Doctor details
        String doctorName = "N/A";
        String doctorSpec = "N/A";
        Long doctorId = 0L;
        if (bill.getAppointment() != null && bill.getAppointment().getDoctor() != null) {
            doctorName = "Dr. " + bill.getAppointment().getDoctor().getUser().getName();
            doctorSpec = bill.getAppointment().getDoctor().getSpecialization();
            doctorId = bill.getAppointment().getDoctor().getId();
        }

        // Left Column (Billing Info)
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(PdfPCell.NO_BORDER);
        leftCell.setPaddingRight(10);
        
        leftCell.addElement(createInfoLine("Invoice No     :  ", invoiceNo, labelFont, valFont));
        leftCell.addElement(createInfoLine("Bill Date        :  ", formattedDate, labelFont, valFont));
        leftCell.addElement(createInfoLine("Patient Name  :  ", bill.getPatient().getFullName(), labelFont, valFont));
        leftCell.addElement(createInfoLine("Patient ID      :  ", patientIdStr, labelFont, valFont));
        leftCell.addElement(createInfoLine("Mobile No      :  ", bill.getPatient().getMobileNumber() != null ? bill.getPatient().getMobileNumber() : "N/A", labelFont, valFont));
        leftCell.addElement(createInfoLine("Address         :  ", bill.getPatient().getAddress() != null ? bill.getPatient().getAddress() : "N/A", labelFont, valFont));
        infoTable.addCell(leftCell);

        // Right Column (Doctor Info)
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(PdfPCell.NO_BORDER);
        rightCell.setPaddingLeft(10);

        rightCell.addElement(createInfoLine("Doctor Name  :  ", doctorName, labelFont, valFont));
        rightCell.addElement(createInfoLine("Specialization  :  ", doctorSpec, labelFont, valFont));
        infoTable.addCell(rightCell);

        document.add(infoTable);
        document.add(new Paragraph(" "));

        // Centered BILL DETAILS Section Header
        Font secHeaderFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, NAVY_BLUE);
        Paragraph billDetailsHeader = new Paragraph("BILL DETAILS", secHeaderFont);
        billDetailsHeader.setAlignment(Element.ALIGN_CENTER);
        billDetailsHeader.setSpacingAfter(10);
        document.add(billDetailsHeader);

        // 3. BILL ITEMS TABLE (6 Columns)
        PdfPTable itemTable = new PdfPTable(6);
        itemTable.setWidthPercentage(100);
        itemTable.setWidths(new float[]{0.8f, 2.7f, 3.5f, 1f, 1.2f, 1.3f});

        Font tblHeaderFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
        addTableHeaderCell(itemTable, "No.", tblHeaderFont);
        addTableHeaderCell(itemTable, "Item Name", tblHeaderFont);
        addTableHeaderCell(itemTable, "Description", tblHeaderFont);
        addTableHeaderCell(itemTable, "Qty", tblHeaderFont);
        addTableHeaderCell(itemTable, "Rate (\u20B9)", tblHeaderFont);
        addTableHeaderCell(itemTable, "Amount (\u20B9)", tblHeaderFont);

        Font contentFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
        int itemIndex = 1;
        for (BillItem item : bill.getItems()) {
            addTableCell(itemTable, String.valueOf(itemIndex++), contentFont, Element.ALIGN_CENTER);
            addTableCell(itemTable, item.getItemName(), contentFont, Element.ALIGN_LEFT);
            
            // Dynamic Description matching the mockups
            String description = "Medical Treatment/Service";
            String lowerName = item.getItemName().toLowerCase();
            if (lowerName.contains("consultation")) {
                description = "Doctor Consultation Charge";
            } else if (lowerName.contains("paracetamol") || lowerName.contains("vitamin") || lowerName.contains("azithromycin")) {
                description = "Tablet";
            } else if (lowerName.contains("medicine") || lowerName.contains("tab")) {
                description = "Tablet";
            }
            
            addTableCell(itemTable, description, contentFont, Element.ALIGN_LEFT);
            addTableCell(itemTable, String.valueOf(item.getQuantity()), contentFont, Element.ALIGN_CENTER);
            addTableCell(itemTable, String.format("%.2f", item.getUnitPrice()), contentFont, Element.ALIGN_RIGHT);
            addTableCell(itemTable, String.format("%.2f", item.getAmount()), contentFont, Element.ALIGN_RIGHT);
        }
        document.add(itemTable);
        document.add(new Paragraph(" "));

        // 4. SUMMARY BLOCK & SIGNATURES (Using nested tables)
        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(100);
        summaryTable.setWidths(new float[]{1.1f, 0.9f});
        summaryTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);

        // Left Side: Dotted cashier line
        PdfPCell summaryLeftCell = new PdfPCell();
        summaryLeftCell.setBorder(PdfPCell.NO_BORDER);
        summaryLeftCell.setVerticalAlignment(Element.ALIGN_BOTTOM);
        summaryLeftCell.setPaddingBottom(15);
        
        Paragraph dots = new Paragraph("..................................................", valFont);
        Paragraph cashierTitle = new Paragraph("Cashier / Receptionist", labelFont);
        summaryLeftCell.addElement(dots);
        summaryLeftCell.addElement(cashierTitle);
        summaryTable.addCell(summaryLeftCell);

        // Right Side: Totals, amount in words, and payment status
        PdfPCell summaryRightCell = new PdfPCell();
        summaryRightCell.setBorder(PdfPCell.NO_BORDER);
        
        // Setup nested sub-totals layout
        PdfPTable totalsTable = new PdfPTable(2);
        totalsTable.setWidthPercentage(100);
        totalsTable.setWidths(new float[]{1.3f, 1.2f});
        totalsTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);

        addSummaryRow(totalsTable, "Sub Total", String.format("\u20B9 %.2f", bill.getTotalAmount()), labelFont, valFont);
        addSummaryRow(totalsTable, "Discount", "\u20B9 0.00", labelFont, valFont);
        addSummaryRow(totalsTable, "Tax (0%)", "\u20B9 0.00", labelFont, valFont);
        
        // Line separator before Grand Total
        PdfPCell sepCell = new PdfPCell(new Paragraph("----------------------------------", valFont));
        sepCell.setColspan(2);
        sepCell.setBorder(PdfPCell.NO_BORDER);
        sepCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalsTable.addCell(sepCell);

        Font grandTotalLabelFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, NAVY_BLUE);
        Font grandTotalValFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, NAVY_BLUE);
        addSummaryRow(totalsTable, "Grand Total", String.format("\u20B9 %.2f", bill.getTotalAmount()), grandTotalLabelFont, grandTotalValFont);

        summaryRightCell.addElement(totalsTable);

        // Amount in words
        Paragraph inWords = new Paragraph();
        inWords.setSpacingBefore(8);
        inWords.setAlignment(Element.ALIGN_RIGHT);
        inWords.add(new Chunk("Amount In Words  :  ", labelFont));
        inWords.add(new Chunk(convertToWords(bill.getTotalAmount()), valFont));
        summaryRightCell.addElement(inWords);

        // Payment status
        Paragraph payStatus = new Paragraph();
        payStatus.setSpacingBefore(6);
        payStatus.setAlignment(Element.ALIGN_RIGHT);
        payStatus.add(new Chunk("Payment Status  :  ", labelFont));
        
        BaseColor statusColor = (bill.getPaymentStatus() == PaymentStatus.PAID) ? GREEN_PAID : RED_PENDING;
        Font statusFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, statusColor);
        payStatus.add(new Chunk(bill.getPaymentStatus().toString(), statusFont));
        summaryRightCell.addElement(payStatus);

        summaryTable.addCell(summaryRightCell);
        document.add(summaryTable);
        document.add(new Paragraph(" "));

        // 5. DOCTOR SIGNATURE (Right Aligned below summary)
        if (bill.getAppointment() != null && bill.getAppointment().getDoctor() != null) {
            PdfPTable sigTable = new PdfPTable(1);
            sigTable.setWidthPercentage(100);
            sigTable.getDefaultCell().setBorder(PdfPCell.NO_BORDER);

            PdfPCell sigCell = new PdfPCell();
            sigCell.setBorder(PdfPCell.NO_BORDER);
            sigCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            sigCell.setPaddingTop(15);

            Font cursiveFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.ITALIC, NAVY_BLUE);
            Font sigBoldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, NAVY_BLUE);
            Font sigRegFont = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, NAVY_BLUE);

            Image sigImage = null;
            try {
                java.net.URL sigUrl = InvoicePdfGenerator.class.getResource("/signature.png");
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
                Paragraph sigImg = new Paragraph(bill.getAppointment().getDoctor().getUser().getName(), cursiveFont);
                sigImg.setAlignment(Element.ALIGN_RIGHT);
                sigCell.addElement(sigImg);
            }

            Paragraph sigName = new Paragraph("Dr. " + bill.getAppointment().getDoctor().getUser().getName(), sigBoldFont);
            sigName.setAlignment(Element.ALIGN_RIGHT);
            sigName.setSpacingBefore(4);
            sigCell.addElement(sigName);

            String regNoStr = String.format("Reg. No. MMC-%d", 123450 + doctorId);
            Paragraph sigReg = new Paragraph(regNoStr, sigRegFont);
            sigReg.setAlignment(Element.ALIGN_RIGHT);
            sigCell.addElement(sigReg);

            sigTable.addCell(sigCell);
            document.add(sigTable);
        }

        // 6. FOOTER
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

    private static Paragraph createInfoLine(String label, String value, Font labelFont, Font valFont) {
        Paragraph p = new Paragraph();
        p.setSpacingBefore(4);
        p.add(new Chunk(label, labelFont));
        p.add(new Chunk(value != null ? value : "N/A", valFont));
        return p;
    }

    private static void addSummaryRow(PdfPTable table, String label, String value, Font labelFont, Font valFont) {
        PdfPCell lblCell = new PdfPCell(new Phrase(label + "   :", labelFont));
        lblCell.setBorder(PdfPCell.NO_BORDER);
        lblCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        lblCell.setPadding(2);
        table.addCell(lblCell);

        PdfPCell valCell = new PdfPCell(new Phrase(value, valFont));
        valCell.setBorder(PdfPCell.NO_BORDER);
        valCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valCell.setPadding(2);
        table.addCell(valCell);
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

    // Number to Words Converter Utility
    private static final String[] units = {
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] tens = {
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    public static String convertToWords(double amount) {
        if (amount == 0) return "Zero Rupees Only";
        long rupees = (long) amount;
        int paise = (int) Math.round((amount - rupees) * 100);
        
        String rupeePart = convertNumber((int) rupees) + " Rupees";
        String paisePart = paise > 0 ? " and " + convertNumber(paise) + " Paise" : "";
        
        return rupeePart + paisePart + " Only";
    }

    private static String convertNumber(int n) {
        if (n < 0) return "Minus " + convertNumber(-n);
        if (n < 20) return units[n];
        if (n < 100) return tens[n / 10] + ((n % 10 != 0) ? " " + units[n % 10] : "");
        if (n < 1000) return units[n / 100] + " Hundred" + ((n % 100 != 0) ? " and " + convertNumber(n % 100) : "");
        if (n < 100000) return convertNumber(n / 1000) + " Thousand" + ((n % 1000 != 0) ? " " + convertNumber(n % 1000) : "");
        if (n < 10000000) return convertNumber(n / 100000) + " Lakh" + ((n % 100000 != 0) ? " " + convertNumber(n % 100000) : "");
        return convertNumber(n / 10000000) + " Crore" + ((n % 10000000 != 0) ? " " + convertNumber(n % 10000000) : "");
    }
}