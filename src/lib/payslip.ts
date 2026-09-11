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

export function getPayslipMeta(key: string) {
  const parts = key.split("/");
  const year = parts[2] || "";
  const month = parts[3] || "";
  const period =
    months[month] && year ? `${months[month]} ${year}` : "-";

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const lastDay =
    yearNumber && monthNumber >= 1 && monthNumber <= 12
      ? new Date(yearNumber, monthNumber, 0)
      : null;

  return {
    year,
    month,
    period,
    dateLabel: lastDay
      ? lastDay.toLocaleDateString("es-PE")
      : "-",
  };
}
