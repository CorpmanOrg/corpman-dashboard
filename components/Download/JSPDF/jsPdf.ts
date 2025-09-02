import jsPDF from "jspdf";

export function downloadPDF(htmlId: string, filename = "report.pdf") {
  const doc = new jsPDF();
  const element = document.getElementById(htmlId);
  if (element) {
    doc.text(element.innerText, 10, 10);
    doc.save(filename);
  }
}