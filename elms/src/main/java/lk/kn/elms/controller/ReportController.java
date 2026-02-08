package lk.kn.elms.controller;

import lk.kn.elms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/elms/api/reports")
@CrossOrigin(origins = "*") // Allow React to access
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/usage/pdf")
    public ResponseEntity<InputStreamResource> downloadMonthlyUsageReport() {
        ByteArrayInputStream in = reportService.generateMonthlyUsagePdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=monthly-usage-report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }

    @GetMapping("/low-stock/excel")
    public ResponseEntity<InputStreamResource> downloadLowStockReport() {
        ByteArrayInputStream in = reportService.generateLowStockExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=low-stock-report.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/damaged/pdf")
    public ResponseEntity<InputStreamResource> downloadDamagedItemsReport() {
        ByteArrayInputStream in = reportService.generateDamagedItemsPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=damaged-items-report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }

    @GetMapping("/inventory/pdf")
    public ResponseEntity<InputStreamResource> downloadAllInventoryReport() {
        ByteArrayInputStream in = reportService.generateAllInventoryPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=all-inventory-report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
