import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatPayslipPeriod, formatViewDate } from "./payslipViews";

export type ReportSummaryRow = {
  dni: string;
  nombre?: string;
  year: string;
  month: string;
  firstViewAt?: string;
  lastViewAt?: string;
  viewCount: number;
  downloadCount: number;
};

export type ReportEventRow = {
  id: string;
  dni: string;
  nombre?: string;
  year: string;
  month: string;
  action: "view" | "download";
  viewedAt: string;
};

type ReportPdfInput = {
  year: string;
  month: string;
  search?: string;
  summary: ReportSummaryRow[];
  events: ReportEventRow[];
  totalEvents: number;
};

function drawHeader(doc: jsPDF, periodLabel: string, generatedAt: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(11, 46, 38);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFillColor(29, 185, 84);
  doc.rect(0, 36, pageWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Municipalidad de La Molina", 14, 14);

  doc.setFontSize(11);
  doc.text("MoliRecursos · Recursos Humanos", 14, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 230, 210);
  doc.text("Reporte de visualización de boletas", 14, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`Periodo: ${periodLabel}`, pageWidth - 14, 16, { align: "right" });
  doc.text(`Generado: ${generatedAt}`, pageWidth - 14, 22, { align: "right" });
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 110);
    doc.text(
      "Documento de respaldo institucional. Registro de acceso a boletas de pago.",
      14,
      pageHeight - 9,
    );
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 9, {
      align: "right",
    });
  }
}

export function downloadPayslipViewsReportPdf(input: ReportPdfInput) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const periodLabel = formatPayslipPeriod(input.year, input.month);
  const generatedAt = new Date().toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const workers = input.summary.length;
  const totalViews = input.summary.reduce((acc, row) => acc + row.viewCount, 0);
  const totalDownloads = input.summary.reduce(
    (acc, row) => acc + row.downloadCount,
    0,
  );

  drawHeader(doc, periodLabel, generatedAt);

  let y = 46;

  doc.setTextColor(20, 40, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Constancia de visualización de boletas", 14, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 90, 85);
  doc.text(
    "Resumen de trabajadores que visualizaron o descargaron su boleta en el periodo indicado.",
    14,
    y,
  );

  if (input.search?.trim()) {
    y += 5;
    doc.text(`Filtro aplicado: ${input.search.trim()}`, 14, y);
  }

  y += 8;

  const cards = [
    { label: "Trabajadores", value: String(workers) },
    { label: "Eventos", value: String(input.totalEvents) },
    { label: "Visualizaciones", value: String(totalViews) },
    { label: "Descargas", value: String(totalDownloads) },
  ];

  const cardWidth = 44;
  const gap = 4;
  cards.forEach((card, index) => {
    const x = 14 + index * (cardWidth + gap);
    doc.setFillColor(245, 250, 247);
    doc.setDrawColor(29, 185, 84);
    doc.roundedRect(x, y, cardWidth, 18, 2, 2, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(90, 110, 100);
    doc.text(card.label, x + 3, y + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(11, 46, 38);
    doc.text(card.value, x + 3, y + 13);
  });

  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 46, 38);
  doc.text("1. Resumen por trabajador", 14, y);

  autoTable(doc, {
    startY: y + 3,
    head: [
      [
        "DNI",
        "Nombre",
        "Periodo",
        "Primera vista",
        "Última vista",
        "Vistas",
        "Descargas",
      ],
    ],
    body:
      input.summary.length > 0
        ? input.summary.map((row) => [
            row.dni,
            row.nombre || "-",
            formatPayslipPeriod(row.year, row.month),
            formatViewDate(row.firstViewAt),
            formatViewDate(row.lastViewAt),
            String(row.viewCount),
            String(row.downloadCount),
          ])
        : [["-", "Sin registros para el periodo", "-", "-", "-", "0", "0"]],
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [40, 50, 45],
      lineColor: [220, 230, 225],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [11, 46, 38],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [246, 250, 248],
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 48 },
      2: { cellWidth: 28 },
      3: { cellWidth: 28 },
      4: { cellWidth: 28 },
      5: { cellWidth: 16, halign: "center" },
      6: { cellWidth: 20, halign: "center" },
    },
    margin: { left: 14, right: 14 },
  });

  const afterSummaryY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY || y + 20;

  let detailStartY = afterSummaryY + 12;

  if (detailStartY > 250) {
    doc.addPage();
    drawHeader(doc, periodLabel, generatedAt);
    detailStartY = 46;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 46, 38);
  doc.text("2. Detalle de eventos", 14, detailStartY);

  autoTable(doc, {
    startY: detailStartY + 3,
    head: [["Fecha y hora", "DNI", "Nombre", "Periodo", "Acción"]],
    body:
      input.events.length > 0
        ? input.events.map((row) => [
            formatViewDate(row.viewedAt),
            row.dni,
            row.nombre || "-",
            formatPayslipPeriod(row.year, row.month),
            row.action === "download" ? "Descarga" : "Visualización",
          ])
        : [["-", "-", "Sin eventos registrados", "-", "-"]],
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [40, 50, 45],
      lineColor: [220, 230, 225],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [20, 90, 70],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [246, 250, 248],
    },
    columnStyles: {
      0: { cellWidth: 34 },
      1: { cellWidth: 24 },
      2: { cellWidth: 58 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
    margin: { left: 14, right: 14, top: 42 },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        drawHeader(doc, periodLabel, generatedAt);
      }
    },
  });

  const afterEventsY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY || detailStartY + 20;

  let noteY = afterEventsY + 10;
  if (noteY > 265) {
    doc.addPage();
    drawHeader(doc, periodLabel, generatedAt);
    noteY = 46;
  }

  doc.setFillColor(245, 250, 247);
  doc.roundedRect(14, noteY, 182, 18, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(11, 46, 38);
  doc.text("Nota", 18, noteY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(70, 85, 80);
  doc.text(
    "Este reporte acredita los accesos registrados en el sistema MoliRecursos. Sirve como respaldo",
    18,
    noteY + 11,
  );
  doc.text(
    "institucional de que el trabajador visualizó o descargó su boleta de pago en la fecha indicada.",
    18,
    noteY + 15,
  );

  drawFooter(doc);

  const fileName = `reporte-visualizacion-boletas-${input.year}-${input.month}.pdf`;
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  // Descarga directa (si Chrome bloquea por HTTP, el usuario puede abrir el PDF)
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Abrir en pestaña nueva para que siempre se pueda ver/guardar
  window.open(url, "_blank", "noopener,noreferrer");

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
