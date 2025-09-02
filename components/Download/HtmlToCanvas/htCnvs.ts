import html2canvas from "html2canvas";

export async function downloadImage(htmlId: string, filename = "report.png") {
  const element = document.getElementById(htmlId);
  if (element) {
    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  }
}