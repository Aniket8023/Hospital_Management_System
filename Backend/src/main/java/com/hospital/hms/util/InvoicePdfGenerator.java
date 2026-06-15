package com.hospital.hms.util;

import com.hospital.hms.entity.Bill;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.hospital.hms.entity.BillItem;

import java.io.ByteArrayOutputStream;

public class InvoicePdfGenerator {

    public static byte[] generatePdf(
            Bill bill)
            throws Exception {

        Document document =
                new Document();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter.getInstance(
                document,
                out);

        document.open();

        Font titleFont =
                new Font(
                        Font.FontFamily.HELVETICA,
                        20,
                        Font.BOLD);

        Paragraph title =
                new Paragraph(
                        "SHINDE HOSPITAL",
                        titleFont);

        title.setAlignment(
                Element.ALIGN_CENTER);

        document.add(title);

        document.add(
                new Paragraph(
                        "Hospital Invoice"));

        document.add(
                new Paragraph(
                        "--------------------------------"));

        document.add(
                new Paragraph(
                        "Invoice No : "
                                + bill.getId()));

        document.add(
                new Paragraph(
                        "Patient Name : "
                                + bill.getPatient()
                                .getFullName()));

        document.add(
                new Paragraph(
                        "Date : "
                                + bill.getBillDate()));

        document.add(
                new Paragraph(
                        "--------------------------------"));

        document.add(
                new Paragraph(
                        "Items"));

        document.add(
                new Paragraph(
                        "--------------------------------"));

        for(BillItem item :
                bill.getItems()) {

            document.add(
                    new Paragraph(
                            item.getItemName()
                                    + " | Qty : "
                                    + item.getQuantity()
                                    + " | Rate : ₹"
                                    + item.getUnitPrice()
                                    + " | Amount : ₹"
                                    + item.getAmount()));
        }

        document.add(
                new Paragraph(
                        "--------------------------------"));

        document.add(
                new Paragraph(
                        "Total Amount : ₹"
                                + bill.getTotalAmount()));

        document.add(
                new Paragraph(
                        "Payment Status : "
                                + bill.getPaymentStatus()));

        document.close();

        return out.toByteArray();
    }
}