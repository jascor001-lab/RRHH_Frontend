import { getPayslipMeta } from "./payslip";

const months: Record<string, string> = {
  "01": "Enero",
  "02": "Febrero",
  "03": "Marzo",
  "04": "Abril",
  "05": "Mayo",
  "06": "Junio",
  "07": "Julio",
  "08": "Agosto",
  "09": "Septiembre",
  "10": "Octubre",
  "11": "Noviembre",
  "12": "Diciembre",
};

export function formatPayslipPeriod(year: string, month: string) {
  if (months[month] && year) {
    return `${months[month]} ${year}`;
  }

  return `${month}/${year}`;
}

export function formatViewDate(value?: string | Date) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export { getPayslipMeta };
