/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPayroll } from "@/types/payroll";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Safe format money with ₦ and commas
const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "NGN 0.00";
  }
  return `NGN ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ✅ Convert image URL to Base64
async function loadImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generatePayslip(payroll: IPayroll): Promise<void> {
  if (!payroll) return;

  

  const brandColor = payroll.company?.branding?.primaryColor || "#030577";
  const doc = new jsPDF();

// 🔠 Capitalize first letter of each word
const capitalizeWords = (str: string | undefined | null): string => {
  if (!str) return "N/A";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


  // 1️⃣ Watermark (auto-scaled, centered, faint)
if (payroll.company?.branding?.displayName) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const text = payroll.company.branding.displayName.toUpperCase();

  doc.setFont("helvetica", "bold");

  // Start from a reasonable size
  let fontSize = 80;
  doc.setFontSize(fontSize);

  // Shrink until it fits nicely within page width
  while (doc.getTextWidth(text) > pageWidth * 0.8 && fontSize > 30) {
    fontSize -= 2;
    doc.setFontSize(fontSize);
  }

  doc.setTextColor(220, 220, 220); // light gray
  doc.text(text, pageWidth / 2, pageHeight / 2, {
    angle: 45,
    align: "center",
    opacity: 0.08, // faint background
  } as any);
}


  // 2️⃣ Company Logo & Name
  if (payroll.company?.branding?.logoUrl) {
    const img = await loadImage(payroll.company.branding.logoUrl);
    if (img) doc.addImage(img, "PNG", 15, 10, 30, 30);
  }

  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);

  // Company description
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(payroll.company?.branding?.description  || "", 50, 28);

  // Divider line
  doc.setDrawColor(brandColor);
  doc.setLineWidth(1.2);
  doc.line(15, 35, 195, 35);

  // 3️⃣ Payslip Header
  doc.setFontSize(16);
  doc.setTextColor(brandColor);
  doc.text(`Payslip - ${payroll.month}/${payroll.year}`, 15, 45);

  // 4️⃣ Employee Information
autoTable(doc, {
  startY: 50,
  head: [["Employee Information", ""]],
  body: [
    [
      "Full Name",
      `${capitalizeWords(payroll.user.firstName)} ${capitalizeWords(
        payroll.user.middleName || ""
      )} ${capitalizeWords(payroll.user.lastName)}`.trim(),
    ],
    ["Email", payroll.user.email || "N/A"],
    ["Department", capitalizeWords(payroll.user.department) || "N/A"],
    ["Status", capitalizeWords(payroll.user.status || payroll.status) || "N/A"],
  ],
  theme: "grid",
  headStyles: { fillColor: brandColor, textColor: "#FFFFFF" },
  bodyStyles: { textColor: "#000000" },
});


  // 5️⃣ Earnings
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Earnings", "Amount"]],
    body: [
      ["Basic Salary", formatCurrency(payroll.basicSalary)],
      ["Total Allowances", formatCurrency(payroll.totalAllowances)],
      ["Gross Salary", formatCurrency(payroll.grossSalary)],
    ],
    theme: "striped",
    headStyles: { fillColor: brandColor, textColor: "#FFFFFF" },
    bodyStyles: { textColor: "#000000" },
  });

  // 6️⃣ Deductions
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Deductions", "Amount"]],
    body: [
      ["Tax", formatCurrency(payroll.tax)],
      ["Pension", formatCurrency(payroll.pension)],
      ["Total Deductions", formatCurrency((payroll as any).deductions)],
    ],
    theme: "striped",
    headStyles: { fillColor: brandColor, textColor: "#FFFFFF" },
    bodyStyles: { textColor: "#000000" },
  });

  // 7️⃣ Net Salary Highlight
  const netSalaryY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 0);
  doc.text(`Net Salary: ${formatCurrency(payroll.netSalary)}`, 15, netSalaryY);

  // 8️⃣ Signature Section
  const yPos = netSalaryY + 25;
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`Authorized Signature: __________________________`, 15, yPos);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, yPos + 10);

  // 9️⃣ Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    "This is a system-generated payslip and does not require a signature.",
    105,
    285,
    { align: "center" }
  );

  // ✅ Save PDF
  doc.save(`Payslip_${payroll.user.firstName}_${payroll.month}_${payroll.year}.pdf`);
}
