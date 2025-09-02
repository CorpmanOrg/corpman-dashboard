import jsPDF from "jspdf";

export function downloadPDF(rows: any[], columns?: { label: string; id: string }[], filename = "transactions.pdf") {
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(16);
  doc.text("Transactions Report", 14, y);
  y += 10;

  // Table header
  if (columns) {
    doc.setFontSize(12);
    columns.forEach((col, i) => {
      doc.text(col.label, 14 + i * 40, y);
    });
    y += 8;

    // Table rows
    rows.forEach((row) => {
      columns.forEach((col, i) => {
        doc.text(String(row[col.id] ?? ""), 14 + i * 40, y);
      });
      y += 8;
    });
  } else {
    // Fallback: just print JSON
    doc.setFontSize(10);
    doc.text(JSON.stringify(rows, null, 2), 14, y);
  }

  doc.save(filename);
}
