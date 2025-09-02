export function downloadCSV<T>(rows: T[], columns: { label: string; id: keyof T }[], filename = "statements.csv") {
  const header = columns.map(col => col.label).join(",");
  const csvRows = rows.map(row =>
    columns.map(col => `"${row[col.id] ?? ""}"`).join(",")
  );
  const csv = [header, ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}