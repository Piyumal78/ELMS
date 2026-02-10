package lk.kn.elms.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lk.kn.elms.model.Inventory;
import lk.kn.elms.repository.InventoryRepository;
import lk.kn.elms.repository.RequestRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private RequestRepository requestRepository;

    // 1. Monthly Usage Report (PDF)
    public ByteArrayInputStream generateMonthlyUsagePdf() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);
            Paragraph title = new Paragraph("Monthly Lab Usage Report", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Table
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new int[] { 4, 3, 3 });

            // Headers
            addTableHeader(table, "Inventory Item");
            addTableHeader(table, "Category");
            addTableHeader(table, "Total Issued Qty");

            // Data
            List<Object[]> usageData = requestRepository.findMonthlyUsage();
            for (Object[] row : usageData) {
                Inventory item = (Inventory) row[0];
                Long count = (Long) row[1];

                table.addCell(item.getName());
                table.addCell(item.getCategory());
                table.addCell(String.valueOf(count));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(java.awt.Color.LIGHT_GRAY); // Using java.awt.Color
        header.setPadding(5);
        header.setPhrase(new Phrase(headerTitle));
        table.addCell(header);
    }

    // 2. Low Stock Report (Excel)
    public ByteArrayInputStream generateLowStockExcel() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Low Stock Items");

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = { "ID", "Item Name", "Category", "Current Quantity", "Min Stock", "Status" };
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data
            List<Inventory> lowStockItems = inventoryRepository.findItemsWithLowStock();

            int rowIdx = 1;
            for (Inventory item : lowStockItems) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.getId());
                row.createCell(1).setCellValue(item.getName());
                row.createCell(2).setCellValue(item.getCategory());
                row.createCell(3).setCellValue(item.getQuantity());
                row.createCell(4).setCellValue(item.getMinimumStock());
                row.createCell(5).setCellValue(item.getStatus());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 3. Damaged Items Report (PDF)
    public ByteArrayInputStream generateDamagedItemsPdf() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);
            Paragraph title = new Paragraph("Damaged Items Report", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new int[] { 3, 3, 2, 4 });

            addTableHeader(table, "Item Name");
            addTableHeader(table, "Category");
            addTableHeader(table, "Qty");
            addTableHeader(table, "Description"); // Maybe reason?

            // Fetch
            List<String> statuses = Arrays.asList("Damaged", "Under Maintenance", "Maintenance");
            List<Inventory> damagedItems = inventoryRepository.findByStatusIn(statuses);

            for (Inventory item : damagedItems) {
                table.addCell(item.getName());
                table.addCell(item.getCategory());
                table.addCell(String.valueOf(item.getQuantity())); // This is current qty. Likely 0 if damaged?
                // Or maybe this inventory row represents the damaged stock?
                // In ELMS usually there is 'Applied' stock vs 'Store'.
                // If status is Damaged, the whole row is likely damaged items.
                table.addCell(item.getDescription() != null ? item.getDescription() : "N/A");
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    // 4. All Inventory Report (PDF)
    public ByteArrayInputStream generateAllInventoryPdf() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);
            Paragraph title = new Paragraph("All Inventory Items Report", fontTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new int[] { 1, 3, 2, 2, 2 });

            addTableHeader(table, "ID");
            addTableHeader(table, "Item Name");
            addTableHeader(table, "Category");
            addTableHeader(table, "Qty");
            addTableHeader(table, "Status");

            List<Inventory> allItems = inventoryRepository.findAll();

            for (Inventory item : allItems) {
                table.addCell(String.valueOf(item.getId()));
                table.addCell(item.getName());
                table.addCell(item.getCategory());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(item.getStatus());
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
