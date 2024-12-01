package com.example.back.controller;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.entity.Quote;
import com.example.back.service.ReportService;

@RestController
@RequestMapping("/api/report")
public class ReportController {
    
    @Autowired
    private ReportService reportService;

    @GetMapping("/search")
    public ResponseEntity<Page<Quote>> getAppointmentReport(
            @RequestParam(value = "startDate", required = false) String startDateStr,
            @RequestParam(value = "endDate", required = false) String endDateStr,
            @RequestParam(value = "status", required = false) Character status,
            @RequestParam(value = "statusPag", required = false) String statusPag,
            @RequestParam(value = "metPag", required = false) String metPag,
            @RequestParam(value = "species", required = false) String species,
            @RequestParam(value = "serviceName", required = false) String serviceName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        LocalDate startDate = (startDateStr != null) ? LocalDate.parse(startDateStr) : null;
        LocalDate endDate = (endDateStr != null) ? LocalDate.parse(endDateStr) : null;

        Pageable pageable = PageRequest.of(page, size);

        Page<Quote> report = reportService.getAppointmentReport(
                startDate, endDate, status, statusPag, metPag, species, serviceName, pageable);

        return ResponseEntity.ok(report);
    }


    @GetMapping("/generate-report")
    public ResponseEntity<byte[]> getDataReport(
            @RequestParam(value = "startDate", required = false) String startDateStr,
            @RequestParam(value = "endDate", required = false) String endDateStr,
            @RequestParam(value = "status", required = false) Character status,
            @RequestParam(value = "statusPag", required = false) String statusPag,
            @RequestParam(value = "metPag", required = false) String metPag,
            @RequestParam(value = "species", required = false) String species,
            @RequestParam(value = "serviceName", required = false) String serviceName) {

        LocalDate startDate = (startDateStr != null) ? LocalDate.parse(startDateStr) : null;
        LocalDate endDate = (endDateStr != null) ? LocalDate.parse(endDateStr) : null;

        List<Quote> filteredQuotes = reportService.getDataReport(
                startDate, endDate, status, statusPag, metPag, species, serviceName);

        try (Workbook workbook = new XSSFWorkbook()) {
            String currentDate = LocalDate.now().toString(); 
            String sheetName = currentDate + "_RptCitas"; 
            Sheet sheet = workbook.createSheet(sheetName);

            // Crear estilos para el encabezado
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Crear estilo para el resumen
            CellStyle summaryStyle = workbook.createCellStyle();
            Font summaryFont = workbook.createFont();
            summaryFont.setBold(false);
            summaryFont.setFontHeightInPoints((short) 11);
            summaryStyle.setFont(summaryFont);
            summaryStyle.setAlignment(HorizontalAlignment.LEFT);
            summaryStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Generar resumen dinámico
            StringBuilder resumen = new StringBuilder("RESUMEN: Este es el reporte de las citas");
            boolean hasFilters = false;

            if (status != null) {
                hasFilters = true;
                switch (status) {
                    case '1': resumen.append(" pendientes"); break;
                    case '0': resumen.append(" canceladas"); break;
                    case '2': resumen.append(" vencidas"); break;
                    case '3': resumen.append(" confirmadas"); break;
                }
            }
            if (startDate != null) {
                hasFilters = true;
                resumen.append(" desde ").append(startDate.toString());
            }
            if (endDate != null) {
                hasFilters = true;
                resumen.append(" hasta ").append(endDate.toString());
            }
            if (metPag != null && !metPag.isEmpty()) {
                hasFilters = true;
                resumen.append(", utilizando el método de pago: ").append(metPag);
            }
            if (statusPag != null && !statusPag.isEmpty()) {
                hasFilters = true;
                resumen.append(", con estado de pago: ");
                if (statusPag.equals("1")) {
                    resumen.append("Pendiente");
                } else if (statusPag.equals("2")) {
                    resumen.append("Pagado");
                }
            }
            if (species != null && !species.isEmpty()) {
                hasFilters = true;
                resumen.append(", para la especie: ").append(species);
            }
            if (serviceName != null && !serviceName.isEmpty()) {
                hasFilters = true;
                resumen.append(", del servicio: ").append(serviceName);
            }

            if (!hasFilters) {
                resumen.append(" sin filtros, incluye todas las citas.");
            } else {
                resumen.append(".");
            }

            Row summaryRow = sheet.createRow(0);
            Cell summaryCell = summaryRow.createCell(0);
            summaryCell.setCellValue(resumen.toString());
            summaryCell.setCellStyle(summaryStyle);

            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 8)); // Fusiona desde la columna 0 hasta 8

            // Crear encabezado
            Row headerRow = sheet.createRow(2); // Fila 2 después del resumen
            String[] headers = {"ID", "Cliente", "Mascota", "Especie", "Fecha", "Servicio", "Método Pago", "Estado Pago", "Estado"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Llenar datos
            int rowNum = 3; // Inicia después del encabezado
            for (Quote quote : filteredQuotes) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(quote.getIdQuote());
                row.createCell(1).setCellValue(
                        quote.getPet().getClient().getFirstName() + " " +
                        quote.getPet().getClient().getPreName() + " " +
                        quote.getPet().getClient().getFirstLastName() + " " +
                        quote.getPet().getClient().getSecondLastName()
                );
                row.createCell(2).setCellValue(quote.getPet().getName());
                row.createCell(3).setCellValue(quote.getPet().getRace().getEspecie().getName());
                row.createCell(4).setCellValue(quote.getDate().toString());
                row.createCell(5).setCellValue(quote.getService().getName());
                row.createCell(6).setCellValue(quote.getMetPag().getName());
                row.createCell(7).setCellValue(quote.getStatusPag().equals("1") ? "Pendiente" : "Pagado");
                row.createCell(8).setCellValue(quote.getStatus().equals('1') ? "En espera" :
                        quote.getStatus().equals('0') ? "Cancelado" :
                                quote.getStatus().equals('2') ? "Vencido" : "Confirmado");
            }

            // Ajustar tamaño de columnas excepto ID
            for (int i = 1; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            sheet.setColumnWidth(0, 256 * 10); // Fija el ancho de la columna ID

            // Escribir el archivo Excel a un flujo de salida
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            // Configurar la respuesta HTTP
            HttpHeaders headersResponse = new HttpHeaders();
            headersResponse.add("Content-Disposition", "attachment; filename=reporte-citas.xlsx");
            return ResponseEntity.ok()
                    .headers(headersResponse)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
