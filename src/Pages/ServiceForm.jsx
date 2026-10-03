// import React, { useState, useRef, useEffect } from "react";

// import {
//   Form,
//   Input,
//   Button,
//   Checkbox,
//   InputNumber,
//   Tooltip,
//   Avatar,
//   Dropdown,
//   Table,
//   notification,
//   Space,
//   AutoComplete,
//   Select,
//   Modal,
// } from "antd";

// import {
//   MailOutlined,
//   LogoutOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DownloadOutlined,
//   SearchOutlined,
//   ReloadOutlined,
//   ClearOutlined,
// } from "@ant-design/icons";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "antd/dist/reset.css";
// import SignatureCanvas from "react-signature-canvas";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import HaitianLogo from "../Images/HaitianLogo.png";
// import "./../App.css";

// // ============================================================
// // TECHNICIAN OPTIONS
// // Same technician options used in Code 1
// // ============================================================

// const technicianOptions = [
//   "Palani",
//   "Sampath",
//   "Karpagaraj",
//   "Balaji",
//   "Eswar",
//   "Ganesh",
//   "Sunderesh",
// ];

// // ============================================================
// // GOOGLE APPS SCRIPT DEPLOYMENT
// // This must be the deployment containing getAllCustomerData.
// // ============================================================
// const GAS_URL =
//   "https://script.google.com/macros/s/AKfycbx49Lwedkww7kzgqjcPrbb-ww2Lmns2P7QrIpGFxM_9X-trWmtcA8mdUaOk3mEP1wfpyg/exec";

// // ============================================================
// // PDF GENERATION - V2
// // Fixed 2-page A4 layout based on the supplied Haitian reference.
// // ============================================================

// const PDF_BLUE = "#24567D";
// const PDF_LIGHT_BLUE = "#DCEAF5";
// const PDF_PALE_BLUE = "#F1F6FA";
// const PDF_BORDER = "#B8C8D3";
// const PDF_TEXT = "#111111";

// const pdfSafe = (value) => {
//   if (value === null || value === undefined) return "";
//   if (Array.isArray(value)) return value.join(", ");
//   return String(value);
// };

// // Parts-table PDF values:
// // Keep the row visible even when the user has not entered anything.
// const pdfPartSafe = (value) => {
//   const text = pdfSafe(value).trim();
//   return text || "-";
// };

// const pdfSelected = (selected, key) => {
//   if (!Array.isArray(selected)) return false;
//   return selected.includes(key);
// };

// const pdfHeader = (doc, reportNumber) => {
//   const pageWidth = doc.internal.pageSize.getWidth();

//   // ============================================================
//   // PREVIOUS PROJECT HEADER
//   // ============================================================

//   const haitianLogoWidth = 52;
//   const haitianLogoHeight = 17;

//   doc.addImage(HaitianLogo, "PNG", 10, 1, haitianLogoWidth, haitianLogoHeight);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(11);
//   doc.setTextColor("#0C3C74");
//   doc.text("Service Report", pageWidth - 60, 9);

//   doc.setTextColor(255, 0, 0);
//   doc.text("No.", 150, 14.5);

//   doc.text(pdfSafe(reportNumber) || "N/A", 157, 14.5);

//   doc.setDrawColor(12, 60, 116);
//   doc.setLineWidth(0.5);
//   doc.line(0, 18, pageWidth, 18);

//   doc.setTextColor(PDF_TEXT);
// };

// const pdfFooter = (doc, pageNumber, totalPages) => {
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const pageWidth = doc.internal.pageSize.getWidth();

//   const footerY = pageHeight - 14;
//   const centerX = pageWidth / 2;

//   doc.setTextColor("#0C3C74");

//   // Footer separator line
//   const lineY = footerY - 3;
//   doc.setDrawColor(12, 60, 116);
//   doc.setLineWidth(0.5);
//   doc.line(10, lineY, pageWidth - 10, lineY);

//   // Company name
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(13);
//   doc.text("Haitian Middle East LLC", centerX, footerY + 1.5, {
//     align: "center",
//   });

//   // Address
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.text(
//     "Umm El Thoub, Umm Al Quwain, United Arab Emirates",
//     centerX,
//     footerY + 6,
//     {
//       align: "center",
//     },
//   );

//   // Contact information
//   doc.text(
//     "Tel: +971 688 457 78  Mob: +971 58 555 7475  Email: ask@haitianme.com  Web: www.haitianme.com",
//     centerX - 3,
//     footerY + 11,
//     {
//       align: "center",
//     },
//   );

//   // ============================================================
//   // PAGE NUMBER - RIGHT END OF FOOTER
//   // ============================================================

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);
//   doc.setTextColor("#555555");

//   doc.text(
//     `Page ${pageNumber} of ${totalPages}`,
//     pageWidth - 10,
//     footerY + 11,
//     {
//       align: "right",
//     },
//   );

//   doc.setTextColor(PDF_TEXT);
// };

// const pdfSection = (doc, title, y, margin = 13) => {
//   const w = doc.internal.pageSize.getWidth();
//   doc.setFillColor(PDF_BLUE);
//   doc.rect(margin, y, w - margin * 2, 6.8, "F");

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(10);
//   doc.setTextColor("#FFFFFF");
//   doc.text(title, margin + 2.8, y + 4.55);

//   return y + 8.2;
// };

// const pdfFieldCompact = (doc, label, value, x, y, width, height = 10.5) => {
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);
//   doc.text(label, x, y + 4);

//   doc.setDrawColor("#9FB6C7");
//   doc.setLineWidth(0.28);
//   doc.line(x, y + height, x + width, y + height);

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   const valueText = pdfSafe(value);
//   const lines = doc.splitTextToSize(valueText, width - 2);

//   if (lines.length) {
//     doc.text(lines.slice(0, 2), x, y + 7.1);
//   }
// };

// const pdfFieldCompactWithMoreGap = (
//   doc,
//   label,
//   value,
//   x,
//   y,
//   width,
//   height = 9.5,
// ) => {
//   // ------------------------------------------------------------
//   // LABEL
//   // ------------------------------------------------------------

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);

//   doc.text(label, x, y + 2.4);

//   // ------------------------------------------------------------
//   // BOTTOM LINE
//   // ------------------------------------------------------------

//   doc.setDrawColor("#9FB6C7");
//   doc.setLineWidth(0.28);

//   doc.line(x, y + height, x + width, y + height);

//   // ------------------------------------------------------------
//   // VALUE
//   // ------------------------------------------------------------

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   const valueText = pdfSafe(value);

//   const lines = doc.splitTextToSize(valueText, width - 2);

//   if (lines.length) {
//     doc.text(lines.slice(0, 2), x, y + 8.2);
//   }
// };

// const pdfTextArea = (doc, value, x, y, width, height) => {
//   doc.setDrawColor(PDF_BORDER);
//   doc.setLineWidth(0.28);
//   doc.rect(x, y, width, height, "S");

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   const lines = doc.splitTextToSize(pdfSafe(value), width - 4);
//   const maxLines = Math.max(1, Math.floor((height - 4) / 3.3));
//   doc.text(lines.slice(0, maxLines), x + 2, y + 5);
// };

// const pdfCheckbox = (doc, x, y, isChecked, label, fontSize = 9) => {
//   const checkboxSize = 4;

//   // Checkbox
//   doc.setDrawColor(PDF_BLUE);
//   doc.setLineWidth(0.3);

//   doc.rect(x, y, checkboxSize, checkboxSize);

//   // Checkmark
//   if (isChecked) {
//     doc.setFont("Zapfdingbats", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(0, 0, 0);

//     doc.text("4", x + 0.6, y + 3.5);

//     // Always return to Helvetica
//     doc.setFont("helvetica", "normal");
//   }

//   // Label
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(fontSize);
//   doc.setTextColor(PDF_TEXT);

//   doc.text(pdfSafe(label), x + checkboxSize + 1.5, y + 3.4);
// };

// const pdfSignature = (doc, x, y, width, title, name, date, signature) => {
//   // ============================================================
//   // TITLE
//   // ============================================================

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);

//   doc.text(title, x + width / 2, y, { align: "center" });

//   // ============================================================
//   // NAME
//   // ============================================================

//   doc.setFillColor(PDF_LIGHT_BLUE);
//   doc.setDrawColor(PDF_BORDER);

//   // Name box
//   doc.rect(x, y + 3, width, 5, "FD");

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   doc.text(pdfSafe(name), x + 1, y + 6.5);

//   // Name label
//   doc.setFontSize(9);
//   doc.setTextColor("#555555");

//   doc.text("Name", x, y + 12);

//   // ============================================================
//   // DATE
//   // ============================================================

//   doc.setFillColor(PDF_LIGHT_BLUE);

//   doc.rect(x, y + 16, width, 5, "FD");

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   doc.text(pdfSafe(date), x + 1, y + 19.5);

//   // Date label
//   doc.setFontSize(9);
//   doc.setTextColor("#555555");

//   doc.text("Date", x, y + 24.5);

//   // ============================================================
//   // SIGNATURE BOX
//   // ============================================================

//   doc.setFillColor("#FFFFFF");
//   doc.setDrawColor(PDF_BORDER);

//   const signatureBoxY = y + 28;
//   const signatureBoxHeight = 25;

//   doc.rect(x, signatureBoxY, width, signatureBoxHeight, "FD");

//   // ============================================================
//   // SIGNATURE IMAGE
//   // Keep completely inside the signature box
//   // ============================================================

//   if (signature) {
//     try {
//       const signaturePaddingX = 1;
//       const signaturePaddingY = 1;

//       doc.addImage(
//         signature,
//         "PNG",
//         x + signaturePaddingX,
//         signatureBoxY + signaturePaddingY,
//         width - signaturePaddingX * 2,
//         signatureBoxHeight - signaturePaddingY * 2,
//       );
//     } catch (error) {
//       console.warn("Unable to place signature:", error);
//     }
//   }

//   // ============================================================
//   // SIGNATURE / STAMP LABEL
//   // ============================================================

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor("#555555");

//   doc.text("Signature / Stamp", x, y + 56);
// };

// const initializeZapfDingbats = (doc) => {
//   // Initialize ZapfDingbats once before the first real checkmark
//   doc.setFont("Zapfdingbats", "normal");
//   doc.setFontSize(1);
//   doc.setTextColor(255, 255, 255);

//   // Draw outside the visible page
//   doc.text("4", -10, -10);

//   // Return to Helvetica
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);
// };

// const generateServiceReportPDF = async (
//   values,
//   reportNumber,
//   signatureTechnician,
//   signatureManager,
//   signatureCustomer,
// ) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//     compress: true,
//   });
//   initializeZapfDingbats(doc);
//   // ============================================================
//   // A4 PAGE SETUP
//   // ============================================================

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const margin = 10;
//   const contentWidth = pageWidth - margin * 2;

//   // Equal left/right columns
//   const columnGap = 14;

//   const columnWidth = (contentWidth - columnGap) / 2;

//   const rightX = margin + columnWidth + columnGap;

//   // ============================================================
//   // PAGE 1
//   // ============================================================

//   pdfHeader(doc, reportNumber);

//   // ============================================================
//   // PAGE 1 CONTENT START
//   // ============================================================

//   // Keep the original starting Y position so the existing
//   // PDF section layout remains unchanged.
//   let y = 29;

//   // ============================================================
//   // PAGE 1 FIELD HELPER
//   // ============================================================
//   //
//   // IMPORTANT:
//   // Both left and right fields use exactly the same height.
//   // This prevents the horizontal lines from becoming misaligned.
//   //
//   // ============================================================

//   const pdfFieldPage1 = (doc, label, value, x, fieldY, width) => {
//     const fieldHeight = 10.5;

//     // ----------------------------------------------------------
//     // LABEL
//     // ----------------------------------------------------------

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(9);
//     doc.setTextColor(PDF_BLUE);

//     doc.text(pdfSafe(label), x, fieldY + 2.7);

//     // ----------------------------------------------------------
//     // VALUE
//     // ----------------------------------------------------------

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(PDF_TEXT);

//     const valueText = pdfSafe(value);

//     const valueLines = doc.splitTextToSize(valueText, width - 2);

//     if (valueLines.length > 0) {
//       doc.text(valueLines[0], x, fieldY + 8);
//     }

//     // ----------------------------------------------------------
//     // BOTTOM LINE
//     // ----------------------------------------------------------
//     //
//     // EXACT SAME Y POSITION FOR EVERY FIELD
//     //
//     // ----------------------------------------------------------

//     doc.setDrawColor("#9FB6C7");
//     doc.setLineWidth(0.25);

//     doc.line(x, fieldY + 9, x + width, fieldY + 9);
//   };

//   // ============================================================
//   // PAGE 1 TEXT AREA HELPER
//   // ============================================================

//   const pdfTextAreaPage1 = (doc, value, x, textY, width, height) => {
//     doc.setDrawColor(PDF_BORDER);
//     doc.setLineWidth(0.28);

//     doc.rect(x, textY, width, height, "S");

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(PDF_TEXT);

//     const lines = doc.splitTextToSize(pdfSafe(value), width - 5);

//     const lineHeight = 3.5;

//     const maxLines = Math.max(1, Math.floor((height - 4) / lineHeight));

//     doc.text(lines.slice(0, maxLines), x + 2.5, textY + 5);
//   };

//   // ============================================================
//   // 1. CUSTOMER & VISIT INFORMATION
//   // ============================================================

//   y = 21;

//   y = pdfSection(doc, "1. CUSTOMER & VISIT INFORMATION", y, margin);

//   // Space below section heading
//   y += 2;

//   const customerRows = [
//     ["Customer", values.customer, "Service Date", values.serviceDate],

//     [
//       "Site / Location",
//       values.siteLocation,
//       "Contact Person",
//       values.contactPerson,
//     ],

//     [
//       "Contact No.",
//       values.contactNo,
//       "Technician",
//       Array.isArray(values.technician)
//         ? values.technician.join(", ")
//         : values.technician,
//     ],

//     [
//       "Arrival Time",
//       values.arrivalTime,
//       "Completion Time",
//       values.completionTime,
//     ],

//     [
//       "Total Working Hours",
//       values.totalWorkingHours,
//       "Service Visit Ref.",
//       values.serviceVisitRef,
//     ],
//   ];

//   customerRows.forEach((row) => {
//     // LEFT FIELD
//     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

//     // RIGHT FIELD
//     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

//     // Equal row spacing
//     y += 11.5;
//   });

//   // ============================================================
//   // SPACE BETWEEN SECTION 1 AND SECTION 2
//   // ============================================================

//   y += 3;

//   // ============================================================
//   // 2. MACHINE INFORMATION
//   // ============================================================

//   y = pdfSection(doc, "2. MACHINE INFORMATION", y, margin);

//   y += 2;

//   const machineRows = [
//     ["Machine Model", values.machineModel, "Serial No.", values.serialNo],

//     [
//       "Installation year",
//       values.installationYear,
//       "Machine Running Hours",
//       values.machineRunningHours,
//     ],

//     [
//       "Controller",
//       values.softwareVersion,
//       "Warranty Status",
//       values.warrantyStatus,
//     ],
//   ];

//   machineRows.forEach((row) => {
//     // LEFT FIELD
//     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

//     // RIGHT FIELD
//     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

//     // Equal row spacing
//     y += 11.5;
//   });

//   // ============================================================
//   // SPACE BETWEEN SECTION 2 AND SECTION 3
//   // ============================================================

//   y += 3;

//   // ============================================================
//   // 3. SERVICE CATEGORY
//   // ============================================================

//   y = pdfSection(doc, "3. SERVICE CATEGORY", y, margin);

//   y += 2;

//   const serviceCategories = [
//     ["installation", "Installation / Commissioning"],

//     ["breakdown", "Breakdown / Defect"],

//     ["preventive", "Preventive Maintenance"],

//     ["corrective", "Corrective Maintenance"],

//     ["inspection", "Inspection"],

//     ["customerVisit", "Customer Visit"],

//     ["software", "Software / Program"],

//     ["other", "Other"],
//   ];

//   const serviceXs = [margin, margin + 50, margin + 90, margin + 135];

//   serviceCategories.forEach(([key, label], index) => {
//     const row = Math.floor(index / 4);

//     const x = serviceXs[index % 4];

//     pdfCheckbox(
//       doc,
//       x,
//       y + row * 6.5,
//       pdfSelected(values.serviceCategory, key),
//       label,
//       9,
//     );
//   });

//   // Space after Section 3
//   y += 17;

//   // ============================================================
//   // 4. CUSTOMER COMPLAINT
//   // ============================================================

//   y = pdfSection(doc, "4. CUSTOMER COMPLAINT / REPORTED PROBLEM", y, margin);

//   y += 1.5;

//   pdfTextAreaPage1(doc, values.customerComplaint, margin, y, contentWidth, 20);

//   // ============================================================
//   // SPACE BETWEEN SECTION 4 AND SECTION 5
//   // ============================================================

//   y += 25;

//   // ============================================================
//   // 5. TECHNICIAN DIAGNOSIS
//   // ============================================================

//   y = pdfSection(doc, "5. TECHNICIAN DIAGNOSIS / ROOT CAUSE", y, margin);

//   y += 1.5;

//   pdfTextAreaPage1(
//     doc,
//     values.technicianDiagnosis,
//     margin,
//     y,
//     contentWidth,
//     20,
//   );

//   // ============================================================
//   // SPACE BETWEEN SECTION 5 AND SECTION 6
//   // ============================================================

//   y += 25;

//   // ============================================================
//   // 6. WORK PERFORMED
//   // ============================================================

//   y = pdfSection(doc, "6. WORK PERFORMED / CORRECTIVE ACTION", y, margin);

//   y += 1.5;

//   pdfTextAreaPage1(doc, values.workPerformed, margin, y, contentWidth, 20);

//   // ============================================================
//   // PAGE 2
//   // ============================================================

//   doc.addPage();
//   initializeZapfDingbats(doc);

//   pdfHeader(doc, reportNumber);

//   y = 20;

//   // ============================================================
//   // 7. MACHINE TRIAL & FINAL STATUS
//   // ============================================================

//   y = pdfSection(doc, "7. MACHINE TRIAL & FINAL STATUS", y, margin);

//   y += 2;

//   const trialStatuses = [
//     ["machineTestedSuccessfully", "Machine tested successfully"],

//     ["machineRunningNormally", "Machine running normally"],

//     ["runningWithObservation", "Running with observation"],

//     ["machineStopped", "Machine stopped - further action required"],

//     ["customerAdvised", "Customer advised / awaiting action"],
//   ];

//   // ============================================================
//   // SECTION 7 OPTIONS
//   // 2 ROWS
//   // SAME FONT SIZE AS PAGE 1 CHECKPOINT OPTIONS
//   // ============================================================

//   const trialOptionPositions = [
//     // ROW 1
//     {
//       x: margin,
//       row: 0,
//     },
//     {
//       x: margin + 70,
//       row: 0,
//     },
//     {
//       x: margin + 133,
//       row: 0,
//     },

//     // ROW 2
//     {
//       x: margin,
//       row: 1,
//     },
//     {
//       x: margin + 70,
//       row: 1,
//     },
//   ];

//   trialStatuses.forEach(([key, label], index) => {
//     const position = trialOptionPositions[index];

//     pdfCheckbox(
//       doc,
//       position.x,
//       y + position.row * 6,
//       pdfSelected(values.machineTrialStatus, key),
//       label,
//       9,
//     );
//   });

//   y += 14;

//   pdfFieldCompactWithMoreGap(
//     doc,
//     "Trial Duration",
//     values.trialDuration,
//     margin,
//     y,
//     columnWidth,
//     9.5,
//   );

//   pdfFieldCompactWithMoreGap(
//     doc,
//     "Cycle Time",
//     values.cycleTime,
//     rightX,
//     y,
//     columnWidth,
//     9.5,
//   );

//   y += 12;

//   pdfFieldCompactWithMoreGap(
//     doc,
//     "Product / Material",
//     values.productMaterial,
//     margin,
//     y - 0.5,
//     contentWidth,
//     9.5,
//   );

//   y += 12;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);

//   doc.text("Trial / Status Remarks", margin, y + 2);

//   pdfTextArea(doc, values.trialStatusRemarks, margin, y + 4, contentWidth, 12);

//   y += 19;

//   // ============================================================
//   // 8. PARTS USED / RECOMMENDED
//   // ============================================================

//   y = pdfSection(doc, "8. PARTS USED / RECOMMENDED", y, margin);

//   const parts = Array.isArray(values.parts) ? values.parts : [];

//   // Always show at least 3 part rows in the PDF.
//   // Empty cells are displayed as "-".
//   const normalizedParts = [...parts];

//   while (normalizedParts.length < 3) {
//     normalizedParts.push({
//       partNo: "",
//       description: "",
//       qty: "",
//       usedRecommended: "",
//       remarks: "",
//     });
//   }

//   const partRows = normalizedParts.map((part) => [
//     pdfPartSafe(part?.partNo),
//     pdfPartSafe(part?.description),
//     pdfPartSafe(part?.qty),
//     pdfPartSafe(part?.usedRecommended),
//     pdfPartSafe(part?.remarks),
//   ]);

//   autoTable(doc, {
//     startY: y + 1,

//     margin: {
//       left: margin,
//       right: margin,
//     },

//     tableWidth: contentWidth,

//     head: [["Part No.", "Description", "Qty", "Used / Recommended", "Remarks"]],

//     body: partRows,

//     theme: "grid",

//     styles: {
//       font: "helvetica",
//       fontSize: 7.5,
//       cellPadding: 1.6,
//       lineColor: "#B8C8D3",
//       lineWidth: 0.25,
//       textColor: PDF_TEXT,
//       valign: "middle",
//       minCellHeight: 6.5,
//     },

//     headStyles: {
//       fillColor: [216, 231, 243],
//       textColor: [31, 78, 121],
//       fontStyle: "bold",
//       fontSize: 9,
//       cellPadding: 1.7,
//     },

//    columnStyles: {
//       0: {
//         cellWidth: 40,
//       },

//       1: {
//         cellWidth: 47,
//       },

//       2: {
//         cellWidth: 12,
//       },

//       3: {
//         cellWidth: 46.5,
//       },

//       4: {
//         cellWidth: 46.5,
//       },
//     },
//   });

//   y = doc.lastAutoTable.finalY + 4;

//   // ============================================================
//   // 9. FURTHER ACTION REQUIRED
//   // ============================================================

//   y = pdfSection(doc, "9. FURTHER ACTION REQUIRED", y, margin);

//   y += 2;

//   const furtherActions = [
//     ["noFurtherAction", "No further action required"],

//     ["partsRequired", "Parts required"],

//     ["followUpVisit", "Follow-up visit required"],

//     ["customerAction", "Customer action required"],

//     [
//       "technicalSupportChina",
//       "Technical / spare support required from Haitian China",
//     ],
//   ];

//   // ============================================================
//   // SECTION 9 OPTIONS
//   // 2 ROWS
//   // ROW 1 = 3 OPTIONS
//   // ROW 2 = 2 OPTIONS
//   // ============================================================

//   const furtherActionPositions = [
//     // ROW 1
//     {
//       x: margin,
//       row: 0,
//     },
//     {
//       x: margin + 65,
//       row: 0,
//     },
//     {
//       x: margin + 130,
//       row: 0,
//     },

//     // ROW 2
//     {
//       x: margin,
//       row: 1,
//     },
//     {
//       x: margin + 65,
//       row: 1,
//     },
//   ];

//   furtherActions.forEach(([key, label], index) => {
//     const position = furtherActionPositions[index];

//     pdfCheckbox(
//       doc,
//       position.x,
//       y + position.row * 7,
//       pdfSelected(values.furtherAction, key),
//       label,
//       9,
//     );
//   });

//   y += 15;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);

//   doc.text("Required Action / Follow-up", margin, y + 2);

//   pdfTextArea(
//     doc,
//     values.requiredActionFollowUp,
//     margin,
//     y + 4,
//     contentWidth,
//     12,
//   );

//   y += 19;

//   // ============================================================
//   // 10. SERVICE COMMERCIAL CLASSIFICATION
//   // ============================================================

//   y = pdfSection(doc, "10. SERVICE COMMERCIAL CLASSIFICATION", y, margin);

//   y += 2;

//   const commercial = [
//     ["focCommissioning", "F.O.C. Commissioning"],

//     ["focMaintenance", "F.O.C. Maintenance"],

//     ["warrantyService", "Warranty Service"],

//     ["chargeableMaintenance", "Chargeable Maintenance"],

//     ["customerVisitService", "Customer Visit (Service)"],

//     ["serviceContract", "Service Contract"],

//     ["goodwill", "Goodwill"],

//     ["chargeableCommissioning", "Chargeable commissioning"],
//   ];

//   commercial.forEach(([key, label], index) => {
//     const row = Math.floor(index / 4);

//     const x = margin + (index % 4) * 45;

//     pdfCheckbox(
//       doc,
//       x,
//       y + row * 7.5,
//       pdfSelected(values.serviceCommercialClassification, key),
//       label,
//       9,
//     );
//   });

//   y += 17;

//   // ============================================================
//   // 11. CUSTOMER ACKNOWLEDGEMENT
//   // ============================================================

//   y = pdfSection(doc, "11. CUSTOMER ACKNOWLEDGEMENT", y, margin);

//   doc.setFillColor("#F1F6FA");

//   doc.rect(margin, y + 1, contentWidth, 8, "F");

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   const acknowledgement =
//     "I acknowledge that the above service work has been carried out and the machine status / further action has been explained to us.";

//   const ackLines = doc.splitTextToSize(acknowledgement, contentWidth - 6);

//   doc.text(ackLines.slice(0, 2), margin + 1.5, y + 6.2);

//   y += 15;

//   // ============================================================
//   // SIGNATURES
//   // ============================================================

//   const sigGap = 6;

//   const sigWidth = (contentWidth - sigGap * 2) / 3;

//   // ------------------------------------------------------------
//   // TECHNICIAN
//   // ------------------------------------------------------------

//   pdfSignature(
//     doc,
//     margin,
//     y,
//     sigWidth,
//     "Service Technician",
//     values.technicianName,
//     values.technicianDate,
//     signatureTechnician,
//   );

//   // ------------------------------------------------------------
//   // MANAGER
//   // ------------------------------------------------------------

//   pdfSignature(
//     doc,
//     margin + sigWidth + sigGap,
//     y,
//     sigWidth,
//     "Service Manager",
//     values.managerName,
//     values.managerDate,
//     signatureManager,
//   );

//   // ------------------------------------------------------------
//   // CUSTOMER
//   // ------------------------------------------------------------

//   pdfSignature(
//     doc,
//     margin + (sigWidth + sigGap) * 2,
//     y,
//     sigWidth,
//     "Customer",
//     values.customerName,
//     values.customerDate,
//     signatureCustomer,
//   );

//   // ============================================================
//   // SAVE PDF
//   // ============================================================

//   const filenameCustomer =
//     pdfSafe(values.customer)
//       .trim()
//       .replace(/[^\w\s-]+/g, "")
//       .replace(/\s+/g, " ") || "Customer";

//   const filenameSRN =
//     pdfSafe(reportNumber)
//       .trim()
//       .replace(/[^\w-]+/g, "_") || "SRN";

//   const fileName = `HT Service Report ${filenameCustomer} ${filenameSRN}.pdf`;

//   // Return the PDF as a data URI so it can be uploaded to
//   // Google Apps Script and saved in the configured Google Drive folder.
//   // The actual browser download is still performed after the Drive
//   // upload succeeds, preserving the existing download behavior.
//   // ============================================================
//   // ADD PREVIOUS PROJECT FOOTER TO EVERY PDF PAGE
//   // ============================================================

//   const totalPages = doc.getNumberOfPages();

//   for (let page = 1; page <= totalPages; page += 1) {
//     doc.setPage(page);
//     pdfFooter(doc, page, totalPages);
//   }

//   const pdfBase64 = doc.output("datauristring");

//   return {
//     fileName,
//     pdfBase64,
//     doc,
//     reportNumber: String(reportNumber || "").trim(),
//   };
// };

// const generateEditServiceReportPDF = async (
//   values,
//   reportNumber,
//   signatureTechnician,
//   signatureManager,
//   signatureCustomer,
// ) => {
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//     compress: true,
//   });
//   initializeZapfDingbats(doc);
//   // ============================================================
//   // A4 PAGE SETUP
//   // ============================================================

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const margin = 10;
//   const contentWidth = pageWidth - margin * 2;

//   // Equal left/right columns
//   const columnGap = 14;

//   const columnWidth = (contentWidth - columnGap) / 2;

//   const rightX = margin + columnWidth + columnGap;

//   // ============================================================
//   // PAGE 1
//   // ============================================================

//   pdfHeader(doc, reportNumber);

//   // ============================================================
//   // PAGE 1 CONTENT START
//   // ============================================================

//   // Keep the original starting Y position so the existing
//   // PDF section layout remains unchanged.
//   let y = 29;

//   // ============================================================
//   // PAGE 1 FIELD HELPER
//   // ============================================================
//   //
//   // IMPORTANT:
//   // Both left and right fields use exactly the same height.
//   // This prevents the horizontal lines from becoming misaligned.
//   //
//   // ============================================================

//   const pdfFieldPage1 = (doc, label, value, x, fieldY, width) => {
//     const fieldHeight = 10.5;

//     // ----------------------------------------------------------
//     // LABEL
//     // ----------------------------------------------------------

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(9);
//     doc.setTextColor(PDF_BLUE);

//     doc.text(pdfSafe(label), x, fieldY + 2.7);

//     // ----------------------------------------------------------
//     // VALUE
//     // ----------------------------------------------------------

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(PDF_TEXT);

//     const valueText = pdfSafe(value);

//     const valueLines = doc.splitTextToSize(valueText, width - 2);

//     if (valueLines.length > 0) {
//       doc.text(valueLines[0], x, fieldY + 8);
//     }

//     // ----------------------------------------------------------
//     // BOTTOM LINE
//     // ----------------------------------------------------------
//     //
//     // EXACT SAME Y POSITION FOR EVERY FIELD
//     //
//     // ----------------------------------------------------------

//     doc.setDrawColor("#9FB6C7");
//     doc.setLineWidth(0.25);

//     doc.line(x, fieldY + 9, x + width, fieldY + 9);
//   };

//   // ============================================================
//   // PAGE 1 TEXT AREA HELPER
//   // ============================================================

//   const pdfTextAreaPage1 = (doc, value, x, textY, width, height) => {
//     doc.setDrawColor(PDF_BORDER);
//     doc.setLineWidth(0.28);

//     doc.rect(x, textY, width, height, "S");

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(PDF_TEXT);

//     const lines = doc.splitTextToSize(pdfSafe(value), width - 5);

//     const lineHeight = 3.5;

//     const maxLines = Math.max(1, Math.floor((height - 4) / lineHeight));

//     doc.text(lines.slice(0, maxLines), x + 2.5, textY + 5);
//   };

//   // ============================================================
//   // 1. CUSTOMER & VISIT INFORMATION
//   // ============================================================

//   y = 21;

//   y = pdfSection(doc, "1. CUSTOMER & VISIT INFORMATION", y, margin);

//   // Space below section heading
//   y += 2;

//   const customerRows = [
//     ["Customer", values.customer, "Service Date", values.serviceDate],

//     [
//       "Site / Location",
//       values.siteLocation,
//       "Contact Person",
//       values.contactPerson,
//     ],

//     [
//       "Contact No.",
//       values.contactNo,
//       "Technician",
//       Array.isArray(values.technician)
//         ? values.technician.join(", ")
//         : values.technician,
//     ],

//     [
//       "Arrival Time",
//       values.arrivalTime,
//       "Completion Time",
//       values.completionTime,
//     ],

//     [
//       "Total Working Hours",
//       values.totalWorkingHours,
//       "Service Visit Ref.",
//       values.serviceVisitRef,
//     ],
//   ];

//   customerRows.forEach((row) => {
//     // LEFT FIELD
//     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

//     // RIGHT FIELD
//     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

//     // Equal row spacing
//     y += 11.5;
//   });

//   // ============================================================
//   // SPACE BETWEEN SECTION 1 AND SECTION 2
//   // ============================================================

//   y += 3;

//   // ============================================================
//   // 2. MACHINE INFORMATION
//   // ============================================================

//   y = pdfSection(doc, "2. MACHINE INFORMATION", y, margin);

//   y += 2;

//   const machineRows = [
//     ["Machine Model", values.machineModel, "Serial No.", values.serialNo],

//     [
//       "Installation year",
//       values.installationYear,
//       "Machine Running Hours",
//       values.machineRunningHours,
//     ],

//     [
//       "Controller",
//       values.softwareVersion,
//       "Warranty Status",
//       values.warrantyStatus,
//     ],
//   ];

//   machineRows.forEach((row) => {
//     // LEFT FIELD
//     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

//     // RIGHT FIELD
//     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

//     // Equal row spacing
//     y += 11.5;
//   });

//   // ============================================================
//   // SPACE BETWEEN SECTION 2 AND SECTION 3
//   // ============================================================

//   y += 3;

//   // ============================================================
//   // 3. SERVICE CATEGORY
//   // ============================================================

//   y = pdfSection(doc, "3. SERVICE CATEGORY", y, margin);

//   y += 2;

//   const serviceCategories = [
//     ["installation", "Installation / Commissioning"],

//     ["breakdown", "Breakdown / Defect"],

//     ["preventive", "Preventive Maintenance"],

//     ["corrective", "Corrective Maintenance"],

//     ["inspection", "Inspection"],

//     ["customerVisit", "Customer Visit"],

//     ["software", "Software / Program"],

//     ["other", "Other"],
//   ];

//   const serviceXs = [margin, margin + 50, margin + 90, margin + 135];

//   serviceCategories.forEach(([key, label], index) => {
//     const row = Math.floor(index / 4);

//     const x = serviceXs[index % 4];

//     pdfCheckbox(
//       doc,
//       x,
//       y + row * 6.5,
//       pdfSelected(values.serviceCategory, key),
//       label,
//       9,
//     );
//   });

//   // Space after Section 3
//   y += 17;

//   // ============================================================
//   // 4. CUSTOMER COMPLAINT
//   // ============================================================

//   y = pdfSection(doc, "4. CUSTOMER COMPLAINT / REPORTED PROBLEM", y, margin);

//   y += 1.5;

//   pdfTextAreaPage1(doc, values.customerComplaint, margin, y, contentWidth, 20);

//   // ============================================================
//   // SPACE BETWEEN SECTION 4 AND SECTION 5
//   // ============================================================

//   y += 25;

//   // ============================================================
//   // 5. TECHNICIAN DIAGNOSIS
//   // ============================================================

//   y = pdfSection(doc, "5. TECHNICIAN DIAGNOSIS / ROOT CAUSE", y, margin);

//   y += 1.5;

//   pdfTextAreaPage1(
//     doc,
//     values.technicianDiagnosis,
//     margin,
//     y,
//     contentWidth,
//     20,
//   );

//   // ============================================================
//   // SPACE BETWEEN SECTION 5 AND SECTION 6
//   // ============================================================

//   y += 25;

//   // ============================================================
//   // 6. WORK PERFORMED
//   // ============================================================

//   y = pdfSection(doc, "6. WORK PERFORMED / CORRECTIVE ACTION", y, margin);

//   y += 1.5;

//   pdfTextAreaPage1(doc, values.workPerformed, margin, y, contentWidth, 20);

//   // ============================================================
//   // PAGE 2
//   // ============================================================

//   doc.addPage();
//   initializeZapfDingbats(doc);

//   pdfHeader(doc, reportNumber);

//   y = 20;

//   // ============================================================
//   // 7. MACHINE TRIAL & FINAL STATUS
//   // ============================================================

//   y = pdfSection(doc, "7. MACHINE TRIAL & FINAL STATUS", y, margin);

//   y += 2;

//   const trialStatuses = [
//     ["machineTestedSuccessfully", "Machine tested successfully"],

//     ["machineRunningNormally", "Machine running normally"],

//     ["runningWithObservation", "Running with observation"],

//     ["machineStopped", "Machine stopped - further action required"],

//     ["customerAdvised", "Customer advised / awaiting action"],
//   ];

//   // ============================================================
//   // SECTION 7 OPTIONS
//   // 2 ROWS
//   // SAME FONT SIZE AS PAGE 1 CHECKPOINT OPTIONS
//   // ============================================================

//   const trialOptionPositions = [
//     // ROW 1
//     {
//       x: margin,
//       row: 0,
//     },
//     {
//       x: margin + 70,
//       row: 0,
//     },
//     {
//       x: margin + 133,
//       row: 0,
//     },

//     // ROW 2
//     {
//       x: margin,
//       row: 1,
//     },
//     {
//       x: margin + 70,
//       row: 1,
//     },
//   ];

//   trialStatuses.forEach(([key, label], index) => {
//     const position = trialOptionPositions[index];

//     pdfCheckbox(
//       doc,
//       position.x,
//       y + position.row * 6,
//       pdfSelected(values.machineTrialStatus, key),
//       label,
//       9,
//     );
//   });

//   y += 14;

//   pdfFieldCompactWithMoreGap(
//     doc,
//     "Trial Duration",
//     values.trialDuration,
//     margin,
//     y,
//     columnWidth,
//     9.5,
//   );

//   pdfFieldCompactWithMoreGap(
//     doc,
//     "Cycle Time",
//     values.cycleTime,
//     rightX,
//     y,
//     columnWidth,
//     9.5,
//   );

//   y += 12;

//   pdfFieldCompactWithMoreGap(
//     doc,
//     "Product / Material",
//     values.productMaterial,
//     margin,
//     y - 0.5,
//     contentWidth,
//     9.5,
//   );

//   y += 12;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);

//   doc.text("Trial / Status Remarks", margin, y + 2);

//   pdfTextArea(doc, values.trialStatusRemarks, margin, y + 4, contentWidth, 12);

//   y += 19;

//   // ============================================================
//   // 8. PARTS USED / RECOMMENDED
//   // ============================================================

//   y = pdfSection(doc, "8. PARTS USED / RECOMMENDED", y, margin);

//   const parts = Array.isArray(values.parts) ? values.parts : [];

//   // Always show at least 3 part rows in the PDF.
//   // Empty cells are displayed as "-".
//   const normalizedParts = [...parts];

//   while (normalizedParts.length < 3) {
//     normalizedParts.push({
//       partNo: "",
//       description: "",
//       qty: "",
//       usedRecommended: "",
//       remarks: "",
//     });
//   }

//   const partRows = normalizedParts.map((part) => [
//     pdfPartSafe(part?.partNo),
//     pdfPartSafe(part?.description),
//     pdfPartSafe(part?.qty),
//     pdfPartSafe(part?.usedRecommended),
//     pdfPartSafe(part?.remarks),
//   ]);

//   autoTable(doc, {
//     startY: y + 1,

//     margin: {
//       left: margin,
//       right: margin,
//     },

//     tableWidth: contentWidth,

//     head: [["Part No.", "Description", "Qty", "Used / Recommended", "Remarks"]],

//     body: partRows,

//     theme: "grid",

//     styles: {
//       font: "helvetica",
//       fontSize: 7.5,
//       cellPadding: 1.6,
//       lineColor: "#B8C8D3",
//       lineWidth: 0.25,
//       textColor: PDF_TEXT,
//       valign: "middle",
//       minCellHeight: 6.5,
//     },

//     headStyles: {
//       fillColor: [216, 231, 243],
//       textColor: [31, 78, 121],
//       fontStyle: "bold",
//       fontSize: 9,
//       cellPadding: 1.7,
//     },

//    columnStyles: {
//       0: {
//         cellWidth: 40,
//       },

//       1: {
//         cellWidth: 47,
//       },

//       2: {
//         cellWidth: 12,
//       },

//       3: {
//         cellWidth: 46.5,
//       },

//       4: {
//         cellWidth: 46.5,
//       },
//     },
//   });

//   y = doc.lastAutoTable.finalY + 4;

//   // ============================================================
//   // 9. FURTHER ACTION REQUIRED
//   // ============================================================

//   y = pdfSection(doc, "9. FURTHER ACTION REQUIRED", y, margin);

//   y += 2;

//   const furtherActions = [
//     ["noFurtherAction", "No further action required"],

//     ["partsRequired", "Parts required"],

//     ["followUpVisit", "Follow-up visit required"],

//     ["customerAction", "Customer action required"],

//     [
//       "technicalSupportChina",
//       "Technical / spare support required from Haitian China",
//     ],
//   ];

//   // ============================================================
//   // SECTION 9 OPTIONS
//   // 2 ROWS
//   // ROW 1 = 3 OPTIONS
//   // ROW 2 = 2 OPTIONS
//   // ============================================================

//   const furtherActionPositions = [
//     // ROW 1
//     {
//       x: margin,
//       row: 0,
//     },
//     {
//       x: margin + 65,
//       row: 0,
//     },
//     {
//       x: margin + 130,
//       row: 0,
//     },

//     // ROW 2
//     {
//       x: margin,
//       row: 1,
//     },
//     {
//       x: margin + 65,
//       row: 1,
//     },
//   ];

//   furtherActions.forEach(([key, label], index) => {
//     const position = furtherActionPositions[index];

//     pdfCheckbox(
//       doc,
//       position.x,
//       y + position.row * 7,
//       pdfSelected(values.furtherAction, key),
//       label,
//       9,
//     );
//   });

//   y += 15;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_BLUE);

//   doc.text("Required Action / Follow-up", margin, y + 2);

//   pdfTextArea(
//     doc,
//     values.requiredActionFollowUp,
//     margin,
//     y + 4,
//     contentWidth,
//     12,
//   );

//   y += 19;

//   // ============================================================
//   // 10. SERVICE COMMERCIAL CLASSIFICATION
//   // ============================================================

//   y = pdfSection(doc, "10. SERVICE COMMERCIAL CLASSIFICATION", y, margin);

//   y += 2;

//   const commercial = [
//     ["focCommissioning", "F.O.C. Commissioning"],

//     ["focMaintenance", "F.O.C. Maintenance"],

//     ["warrantyService", "Warranty Service"],

//     ["chargeableMaintenance", "Chargeable Maintenance"],

//     ["customerVisitService", "Customer Visit (Service)"],

//     ["serviceContract", "Service Contract"],

//     ["goodwill", "Goodwill"],

//     ["chargeableCommissioning", "Chargeable commissioning"],
//   ];

//   commercial.forEach(([key, label], index) => {
//     const row = Math.floor(index / 4);

//     const x = margin + (index % 4) * 45;

//     pdfCheckbox(
//       doc,
//       x,
//       y + row * 7.5,
//       pdfSelected(values.serviceCommercialClassification, key),
//       label,
//       9,
//     );
//   });

//   y += 17;

//   // ============================================================
//   // 11. CUSTOMER ACKNOWLEDGEMENT
//   // ============================================================

//   y = pdfSection(doc, "11. CUSTOMER ACKNOWLEDGEMENT", y, margin);

//   doc.setFillColor("#F1F6FA");

//   doc.rect(margin, y + 1, contentWidth, 8, "F");

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(9);
//   doc.setTextColor(PDF_TEXT);

//   const acknowledgement =
//     "I acknowledge that the above service work has been carried out and the machine status / further action has been explained to us.";

//   const ackLines = doc.splitTextToSize(acknowledgement, contentWidth - 6);

//   doc.text(ackLines.slice(0, 2), margin + 1.5, y + 6.2);

//   y += 15;

//   // ============================================================
//   // SIGNATURES
//   // ============================================================

//   const sigGap = 6;

//   const sigWidth = (contentWidth - sigGap * 2) / 3;

//   // ------------------------------------------------------------
//   // TECHNICIAN
//   // ------------------------------------------------------------

//   pdfSignature(
//     doc,
//     margin,
//     y,
//     sigWidth,
//     "Service Technician",
//     values.technicianName,
//     values.technicianDate,
//     signatureTechnician,
//   );

//   // ------------------------------------------------------------
//   // MANAGER
//   // ------------------------------------------------------------

//   pdfSignature(
//     doc,
//     margin + sigWidth + sigGap,
//     y,
//     sigWidth,
//     "Service Manager",
//     values.managerName,
//     values.managerDate,
//     signatureManager,
//   );

//   // ------------------------------------------------------------
//   // CUSTOMER
//   // ------------------------------------------------------------

//   pdfSignature(
//     doc,
//     margin + (sigWidth + sigGap) * 2,
//     y,
//     sigWidth,
//     "Customer",
//     values.customerName,
//     values.customerDate,
//     signatureCustomer,
//   );

//   // ============================================================
//   // SAVE PDF
//   // ============================================================

//   const filenameCustomer =
//     pdfSafe(values.customer)
//       .trim()
//       .replace(/[^\w\s-]+/g, "")
//       .replace(/\s+/g, " ") || "Customer";

//   const filenameSRN =
//     pdfSafe(reportNumber)
//       .trim()
//       .replace(/[^\w-]+/g, "_") || "SRN";

//   const fileName = `HT Service Report ${filenameCustomer} ${filenameSRN}.pdf`;

//   // Return the PDF as a data URI so it can be uploaded to
//   // Google Apps Script and saved in the configured Google Drive folder.
//   // The actual browser download is still performed after the Drive
//   // upload succeeds, preserving the existing download behavior.
//   // ============================================================
//   // ADD PREVIOUS PROJECT FOOTER TO EVERY PDF PAGE
//   // ============================================================

//   const totalPages = doc.getNumberOfPages();

//   for (let page = 1; page <= totalPages; page += 1) {
//     doc.setPage(page);
//     pdfFooter(doc, page, totalPages);
//   }

//   const pdfBase64 = doc.output("datauristring");

//   return {
//     fileName,
//     pdfBase64,
//     doc,
//     reportNumber: String(reportNumber || "").trim(),
//   };
// };

// const ViewSectionTitle = ({ title }) => (
//   <div
//     style={{
//       background: "#0D3884",
//       color: "#FFFFFF",
//       fontWeight: 700,
//       fontSize: "15px",
//       padding: "9px 14px",
//       borderRadius: "5px",
//       margin: "22px 0 14px",
//       letterSpacing: "0.2px",
//     }}
//   >
//     {title}
//   </div>
// );

// const ViewField = ({
//   label,
//   name,
//   span = "col-md-6",
//   viewForm,
//   textarea = false,
// }) => (
//   <div className={span}>
//     <Form.Item
//       label={
//         <span
//           style={{
//             fontWeight: 600,
//             color: "#0D3884",
//           }}
//         >
//           {label}
//         </span>
//       }
//       name={name}
//     >
//       {textarea ? (
//         <Input.TextArea
//           readOnly
//           autoSize={{
//             minRows: 2,
//             maxRows: 4,
//           }}
//           style={{
//             background: "#FAFAFA",
//             color: "#222",
//             borderColor: "#D9E2EA",
//           }}
//         />
//       ) : (
//         <Input
//           readOnly
//           size="large"
//           style={{
//             background: "#FAFAFA",
//             color: "#222",
//             borderColor: "#D9E2EA",
//           }}
//         />
//       )}
//     </Form.Item>
//   </div>
// );

// const ViewLargeText = ({ name, viewForm }) => (
//   <Form.Item name={name}>
//     <Input.TextArea
//       readOnly
//       autoSize={{
//         minRows: 4,
//         maxRows: 8,
//       }}
//       style={{
//         background: "#FAFAFA",
//         color: "#222",
//         borderColor: "#D9E2EA",
//         lineHeight: 1.6,
//       }}
//     />
//   </Form.Item>
// );

// const ViewSignatureCard = ({ title, name, date, signature }) => (
//   <div className="col-12 col-md-6 col-xl-4 mb-4">
//     <div
//       style={{
//         border: "1px solid #B8C8D3",
//         borderRadius: "7px",
//         overflow: "hidden",
//         height: "100%",
//         background: "#FFFFFF",
//       }}
//     >
//       <div
//         style={{
//           background: "#F1F6FA",
//           color: "#0D3884",
//           fontWeight: 700,
//           padding: "9px 12px",
//           borderBottom: "1px solid #B8C8D3",
//           textAlign: "center",
//         }}
//       >
//         {title}
//       </div>

//       <div style={{ padding: "12px" }}>
//         <div
//           style={{
//             fontSize: "12px",
//             color: "#666",
//             marginBottom: "3px",
//           }}
//         >
//           Name
//         </div>

//         <div
//           style={{
//             borderBottom: "1px solid #D9E2EA",
//             paddingBottom: "6px",
//             marginBottom: "12px",
//             minHeight: "28px",
//           }}
//         >
//           {name || "-"}
//         </div>

//         <div
//           style={{
//             fontSize: "12px",
//             color: "#666",
//             marginBottom: "3px",
//           }}
//         >
//           Date
//         </div>

//         <div
//           style={{
//             borderBottom: "1px solid #D9E2EA",
//             paddingBottom: "6px",
//             marginBottom: "12px",
//             minHeight: "28px",
//           }}
//         >
//           {date || "-"}
//         </div>

//         {/* <div
//           style={{
//             fontSize: "12px",
//             color: "#666",
//             marginBottom: "5px",
//           }}
//         >
//           Signature / Stamp
//         </div>

//         <div
//           style={{
//             height: "130px",
//             border: "1px solid #D9E2EA",
//             borderRadius: "4px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             background: "#FFFFFF",
//           }}
//         >
//           {signature ? (
//             <img
//               src={signature}
//               alt={`${title} signature`}
//               style={{
//                 maxWidth: "95%",
//                 maxHeight: "120px",
//                 objectFit: "contain",
//               }}
//             />
//           ) : (
//             <span
//               style={{
//                 color: "#999",
//                 fontSize: "13px",
//               }}
//             >
//               No signature available
//             </span>
//           )}
//         </div> */}
//       </div>
//     </div>
//   </div>
// );

// // ============================================================
// // SERVICE FORM
// // ============================================================

// export default function ServiceForm({ onLogout, user }) {
//   const [form] = Form.useForm();
//   const [viewForm] = Form.useForm();
//   const [editForm] = Form.useForm();
//   const [open, setOpen] = useState(false);
//   const { TextArea } = Input;
//   const [canvasSize, setCanvasSize] = useState({
//     width: 0,
//     height: 0,
//   });

//   const [signatureTechnician, setSignatureTechnician] = useState("");
//   const [signatureManager, setSignatureManager] = useState("");
//   const [signatureCustomer, setSignatureCustomer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serviceReportNumber, setServiceReportNumber] = useState("");
//   const [srnLoading, setSrnLoading] = useState(true);
//   const [customerOptions, setCustomerOptions] = useState([]);
//   const [customerDataList, setCustomerDataList] = useState([]);
//   const [address, setAddress] = useState("");
//   const [serialNumber, setSerialNumber] = useState("");
//   const [selectedTechnicians, setSelectedTechnicians] = useState([]);

//   // ============================================================
//   // NEW SERVICE REPORT - PARTS TABLE STATE
//   // Keep the Parts table values in explicit React state.
//   // This prevents Ant Design Table/Form rendering from losing or
//   // shifting the entered Part No., Description, Used/Recommended,
//   // and Remarks values before the PDF is generated.
//   // ============================================================
//   const [partsFormData, setPartsFormData] = useState([
//     {
//       key: 0,
//       partNo: "",
//       description: "",
//       qty: "",
//       usedRecommended: "",
//       remarks: "",
//     },
//     {
//       key: 1,
//       partNo: "",
//       description: "",
//       qty: "",
//       usedRecommended: "",
//       remarks: "",
//     },
//     {
//       key: 2,
//       partNo: "",
//       description: "",
//       qty: "",
//       usedRecommended: "",
//       remarks: "",
//     },
//   ]);

//   const updatePartsFormData = (rowIndex, field, value) => {
//     let limitedValue = value;

//     if (field === "partNo") {
//       limitedValue = value.slice(0, 25);
//     } else if (
//       field === "description"
//     ) {
//       limitedValue = value.slice(0, 25);
//     } else if (field === "usedRecommended" || field === "remarks") {
//       limitedValue = value.slice(0, 25);
//     }

//     setPartsFormData((previous) =>
//       previous.map((row, index) =>
//         index === rowIndex
//           ? {
//               ...row,
//               [field]: limitedValue,
//             }
//           : row,
//       ),
//     );
//   };

//   const [isTechnicianSignSaved, setIsTechnicianSignSaved] = useState(false);
//   const [isManagerSignSaved, setIsManagerSignSaved] = useState(false);
//   const [isCustomerSignSaved, setIsCustomerSignSaved] = useState(false);

//   const [reportData, setReportData] = useState([]);
//   const [reportTableLoading, setReportTableLoading] = useState(false);

//   // ============================================================
//   // SERVICE REPORT TABLE UI STATE
//   // ============================================================
//   const [reportTableSearch, setReportTableSearch] = useState("");
//   const [reportTablePageSize, setReportTablePageSize] = useState(10);
//   const [viewReport, setViewReport] = useState(null);
//   const [editReport, setEditReport] = useState(null);
//   const [viewPartsData, setViewPartsData] = useState([]);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [pdfDownloadLoading, setPdfDownloadLoading] = useState(false);
//   const [editPartsData, setEditPartsData] = useState([]);
//   const [editSaveLoading, setEditSaveLoading] = useState(false);
//   const [editSignatureTechnician, setEditSignatureTechnician] = useState("");
//   const [editSignatureManager, setEditSignatureManager] = useState("");
//   const [editSignatureCustomer, setEditSignatureCustomer] = useState("");
//   const [isEditTechnicianSignSaved, setIsEditTechnicianSignSaved] =
//     useState(false);
//   const [isEditManagerSignSaved, setIsEditManagerSignSaved] = useState(false);
//   const [isEditCustomerSignSaved, setIsEditCustomerSignSaved] = useState(false);

//   const sigTechnician = useRef();
//   const sigManager = useRef();
//   const sigCustomer = useRef();
//   const editSigTechnician = useRef();
//   const editSigManager = useRef();
//   const editSigCustomer = useRef();

//   const updateCanvasSize = () => {
//     setCanvasSize({ width: window.innerWidth < 768 ? 300 : 400, height: 200 });
//   };

//   const fetchServiceReports = async () => {
//     setReportTableLoading(true);

//     try {
//       const response = await fetch(
//         `${GAS_URL}?action=getServiceReports&_=${Date.now()}`,
//         {
//           cache: "no-store",
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Server returned ${response.status}`);
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || "Failed to fetch service reports");
//       }

//       setReportData(Array.isArray(result.reports) ? result.reports : []);
//     } catch (error) {
//       console.error("Failed to fetch service reports:", error);

//       notification.error({
//         message: "Error",
//         description: error.message || "Failed to load service reports.",
//         placement: "bottomRight",
//       });

//       setReportData([]);
//     } finally {
//       setReportTableLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServiceReports();
//   }, []);

//   const downloadServiceReportPDFByNumber = async (
//     reportNumber,
//     fileName = "",
//   ) => {
//     const normalizedReportNumber = String(reportNumber || "").trim();

//     if (!normalizedReportNumber) {
//       throw new Error("Service Report Number is missing.");
//     }

//     const formData = new URLSearchParams();
//     formData.append("action", "downloadPdf");
//     formData.append("serviceReportNumber", normalizedReportNumber);

//     // If the caller already knows the exact PDF filename, send it.
//     // This is used by the edit flow and prevents filename mismatches.
//     const normalizedFileName = String(fileName || "").trim();

//     if (normalizedFileName) {
//       formData.append("fileName", normalizedFileName);
//     }

//     const response = await fetch(GAS_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: formData.toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`PDF server returned ${response.status}`);
//     }

//     const result = await response.json();

//     if (!result.success || !result.pdfBase64) {
//       throw new Error(
//         result.message ||
//           `PDF not found for Service Report ${normalizedReportNumber}`,
//       );
//     }

//     const binaryString = window.atob(result.pdfBase64);
//     const bytes = new Uint8Array(binaryString.length);

//     for (let i = 0; i < binaryString.length; i += 1) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }

//     const blob = new Blob([bytes], {
//       type: result.mimeType || "application/pdf",
//     });

//     const downloadUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = downloadUrl;
//     link.download =
//       result.fileName || `Haitian_Service_Report_${normalizedReportNumber}.pdf`;

//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     // Give the browser a moment to start the download before releasing
//     // the object URL. This is more reliable on Chrome/Edge.
//     window.setTimeout(() => {
//       window.URL.revokeObjectURL(downloadUrl);
//     }, 1000);

//     return result;
//   };

//   const downloadServiceReportPDF = async () => {
//     const reportNumber = String(
//       viewReport?.["Service Report Number"] || "",
//     ).trim();

//     if (!reportNumber) {
//       notification.error({
//         message: "Download Failed",
//         description: "Service Report Number is missing.",
//         placement: "bottomRight",
//       });
//       return;
//     }

//     setPdfDownloadLoading(true);

//     try {
//       await downloadServiceReportPDFByNumber(reportNumber);

//       notification.success({
//         message: "PDF Downloaded",
//         description: `Service Report ${reportNumber} PDF downloaded successfully.`,
//         placement: "bottomRight",
//       });
//     } catch (error) {
//       console.error("Service report PDF download error:", error);

//       notification.error({
//         message: "PDF Download Failed",
//         description:
//           error?.message ||
//           `Unable to download PDF for Service Report ${reportNumber}.`,
//         placement: "bottomRight",
//       });
//     } finally {
//       setPdfDownloadLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!viewReport || !viewModalOpen) {
//       return;
//     }

//     // ============================================================
//     // HELPER
//     // Converts JSON-string values from Google Sheet
//     // back into arrays for Ant Design Checkbox.Group
//     // ============================================================

//     const parseArray = (value) => {
//       if (Array.isArray(value)) {
//         return value;
//       }

//       if (!value) {
//         return [];
//       }

//       try {
//         const parsed = JSON.parse(value);

//         return Array.isArray(parsed) ? parsed : [];
//       } catch (error) {
//         console.warn("Unable to parse checkbox value:", value);

//         return [];
//       }
//     };

//     // ============================================================
//     // PARSE SAVED JSON VALUES
//     // ============================================================

//     const serviceCategory = parseArray(viewReport["serviceCategory"]);

//     const machineTrialStatus =
//       parseArray(viewReport["machineTrialStatus"]).length > 0
//         ? parseArray(viewReport["machineTrialStatus"])
//         : [
//             viewReport["Machine tested successfully"] === "Yes"
//               ? "machineTestedSuccessfully"
//               : null,

//             viewReport["Machine running normally"] === "Yes"
//               ? "machineRunningNormally"
//               : null,

//             viewReport["Running with observation"] === "Yes"
//               ? "runningWithObservation"
//               : null,

//             viewReport["Machine stopped - further action required"] === "Yes"
//               ? "machineStopped"
//               : null,

//             viewReport["Customer advised / awaiting action"] === "Yes"
//               ? "customerAdvised"
//               : null,
//           ].filter(Boolean);

//     const furtherAction =
//       parseArray(viewReport["furtherAction"]).length > 0
//         ? parseArray(viewReport["furtherAction"])
//         : [
//             viewReport["No further action required"] === "Yes"
//               ? "noFurtherAction"
//               : null,

//             viewReport["Parts required"] === "Yes" ? "partsRequired" : null,

//             viewReport["Follow-up visit required"] === "Yes"
//               ? "followUpVisit"
//               : null,

//             viewReport["Customer action required"] === "Yes"
//               ? "customerAction"
//               : null,

//             (viewReport["Technical support required from Haitian China"] ||
//               viewReport[
//                 "Technical / spare support required from Haitian China"
//               ] ||
//               "") === "Yes"
//               ? "technicalSupportChina"
//               : null,
//           ].filter(Boolean);

//     const serviceCommercialClassification =
//       parseArray(viewReport["serviceCommercialClassification"]).length > 0
//         ? parseArray(viewReport["serviceCommercialClassification"])
//         : [
//             viewReport["F.O.C. Commissioning"] === "Yes"
//               ? "focCommissioning"
//               : null,

//             viewReport["F.O.C. Maintenance"] === "Yes"
//               ? "focMaintenance"
//               : null,

//             viewReport["Warranty Service"] === "Yes" ? "warrantyService" : null,

//             viewReport["Chargeable Maintenance"] === "Yes"
//               ? "chargeableMaintenance"
//               : null,

//             viewReport["Customer Visit (Service)"] === "Yes"
//               ? "customerVisitService"
//               : null,

//             viewReport["Service Contract"] === "Yes" ? "serviceContract" : null,

//             viewReport["Goodwill"] === "Yes" ? "goodwill" : null,
//           ].filter(Boolean);

//     // ============================================================
//     // PARTS
//     // ============================================================

//     let parts = [];

//     if (Array.isArray(viewReport.parts)) {
//       parts = viewReport.parts.map((part, index) => ({
//         key: index,

//         "Part No.": part["Part No."] || part.partNo || "",

//         Description: part["Description"] || part.description || "",

//         Qty: part["Qty"] || part.qty || "",

//         "Used / Recommended":
//           part["Used / Recommended"] || part.usedRecommended || "",

//         Remarks: part["Remarks"] || part.remarks || "",
//       }));
//     } else {
//       // Fallback in case backend returns only one row
//       if (
//         viewReport["Part No."] ||
//         viewReport["Description"] ||
//         viewReport["Qty"] ||
//         viewReport["Used / Recommended"] ||
//         viewReport["Remarks"]
//       ) {
//         parts = [
//           {
//             key: 0,

//             "Part No.": viewReport["Part No."] || "",

//             Description: viewReport["Description"] || "",

//             Qty: viewReport["Qty"] || "",

//             "Used / Recommended": viewReport["Used / Recommended"] || "",

//             Remarks: viewReport["Remarks"] || "",
//           },
//         ];
//       }
//     }

//     // ============================================================
//     // SET PARTS
//     // ============================================================

//     setViewPartsData(parts);

//     // ============================================================
//     // SET ALL FORM VALUES
//     // ============================================================

//     viewForm.setFieldsValue({
//       // ==========================================================
//       // 1. CUSTOMER & VISIT INFORMATION
//       // ==========================================================

//       serviceReportNumber: viewReport["Service Report Number"] || "",

//       customer: viewReport["Customer"] || "",

//       serviceDate: viewReport["Service Date"] || "",

//       siteLocation: viewReport["Site / Location"] || "",

//       contactPerson: viewReport["Contact Person"] || "",

//       contactNo: viewReport["Contact No."] || "",

//       technician: viewReport["Technician"] || "",

//       arrivalTime: viewReport["Arrival Time"] || "",

//       completionTime: viewReport["Completion Time"] || "",

//       totalWorkingHours: viewReport["Total Working Hours"] || "",

//       serviceVisitRef: viewReport["Service Visit Ref."] || "",

//       // ==========================================================
//       // 2. MACHINE INFORMATION
//       // ==========================================================

//       machineModel: viewReport["Machine Model"] || "",

//       serialNo: viewReport["Serial No."] || "",

//       installationYear:
//         viewReport["Installation year"] ||
//         viewReport["Installation Date"] ||
//         "",

//       machineRunningHours: viewReport["Machine Running Hours"] || "",

//       controllerSoftwareVersion:
//         viewReport["Controller"] ||
//         viewReport["Controller / Software version"] ||
//         viewReport["Controller / Software Version"] ||
//         "",

//       warrantyStatus: viewReport["Warranty Status"] || "",

//       // ==========================================================
//       // 3. SERVICE CATEGORY
//       // ==========================================================

//       serviceCategory:
//         // Current format
//         serviceCategory.length > 0
//           ? serviceCategory
//           : // Fallback for old Yes/No column format
//             [
//               viewReport["Installation / Commissioning"] === "Yes"
//                 ? "installation"
//                 : null,

//               viewReport["Breakdown / Defect"] === "Yes" ? "breakdown" : null,

//               viewReport["Preventive Maintenance"] === "Yes"
//                 ? "preventive"
//                 : null,

//               viewReport["Corrective Maintenance"] === "Yes"
//                 ? "corrective"
//                 : null,

//               viewReport["Inspection"] === "Yes" ? "inspection" : null,

//               viewReport["Customer Visit"] === "Yes" ? "customerVisit" : null,

//               viewReport["Software / Program"] === "Yes" ? "software" : null,

//               viewReport["Other"] === "Yes" ? "other" : null,
//             ].filter(Boolean),

//       // ==========================================================
//       // 4. CUSTOMER COMPLAINT
//       // ==========================================================

//       customerComplaint:
//         viewReport["Customer Complaint"] ||
//         viewReport["Customer complaint / reported problem"] ||
//         viewReport["Customer Complaint / Reported Problem"] ||
//         "",

//       // ==========================================================
//       // 5. TECHNICIAN DIAGNOSIS
//       // ==========================================================

//       diagnosis:
//         viewReport["Technician Diagnosis"] ||
//         viewReport["Technician diagnosis/root cause"] ||
//         viewReport["Technician Diagnosis / Root Cause"] ||
//         "",

//       // ==========================================================
//       // 6. WORK PERFORMED
//       // ==========================================================

//       workPerformed:
//         viewReport["Work Performed"] ||
//         viewReport["Work performed / corrective action"] ||
//         viewReport["Work Performed / Corrective Action"] ||
//         "",

//       // ==========================================================
//       // 7. MACHINE TRIAL & FINAL STATUS
//       // ==========================================================

//       machineTrialStatus: machineTrialStatus,
//       trialDuration: viewReport["Trial Duration"] || "",

//       cycleTime: viewReport["Cycle Time"] || "",

//       productMaterial: viewReport["Product / Material"] || "",

//       trialStatusRemarks: viewReport["Trial / Status Remarks"] || "",

//       // ==========================================================
//       // 9. FURTHER ACTION REQUIRED
//       // ==========================================================

//       furtherAction: furtherAction,

//       requiredActionFollowUp:
//         viewReport["Required Action / Follow-up"] ||
//         viewReport["Required Action / Follow-Up"] ||
//         "",

//       // ==========================================================
//       // 10. COMMERCIAL CLASSIFICATION
//       // ==========================================================

//       serviceCommercialClassification: serviceCommercialClassification,

//       // ==========================================================
//       // 11. CUSTOMER ACKNOWLEDGEMENT
//       // ==========================================================

//       technicianName:
//         viewReport["Technician Name"] ||
//         viewReport["Service Technician Name"] ||
//         "",

//       technicianDate:
//         viewReport["Technician Date"] ||
//         viewReport["Service Technician Date"] ||
//         "",

//       managerName:
//         viewReport["Manager Name"] || viewReport["Service Manager Name"] || "",

//       managerDate:
//         viewReport["Manager Date"] || viewReport["Service Manager Date"] || "",

//       customerName: viewReport["Customer Name"] || "",

//       customerDate: viewReport["Customer Date"] || "",
//     });

//     // ============================================================
//     // SIGNATURES
//     // ============================================================

//     setTimeout(() => {
//       // setViewSignatureData({
//       //   technician:
//       //     viewReport["Technician Signature"] ||
//       //     viewReport["signatureTechnician"] ||
//       //     "",
//       //   manager:
//       //     viewReport["Manager Signature"] ||
//       //     viewReport["signatureManager"] ||
//       //     "",
//       //   customer:
//       //     viewReport["Customer Signature"] ||
//       //     viewReport["signatureCustomer"] ||
//       //     "",
//       // });
//     }, 0);
//   }, [viewReport, viewModalOpen, viewForm]);

//   // ============================================================
//   // EDIT MODAL HELPERS
//   // ============================================================

//   const parseEditArray = (value) => {
//     if (Array.isArray(value)) return value;
//     if (!value) return [];
//     try {
//       const parsed = JSON.parse(value);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (!editReport || !editModalOpen) return;

//     const serviceCategory = parseEditArray(editReport["serviceCategory"]).length
//       ? parseEditArray(editReport["serviceCategory"])
//       : [
//           editReport["Installation / Commissioning"] === "Yes"
//             ? "installation"
//             : null,
//           editReport["Breakdown / Defect"] === "Yes" ? "breakdown" : null,
//           editReport["Preventive Maintenance"] === "Yes" ? "preventive" : null,
//           editReport["Corrective Maintenance"] === "Yes" ? "corrective" : null,
//           editReport["Inspection"] === "Yes" ? "inspection" : null,
//           editReport["Customer Visit"] === "Yes" ? "customerVisit" : null,
//           editReport["Software / Program"] === "Yes" ? "software" : null,
//           editReport["Other"] === "Yes" ? "other" : null,
//         ].filter(Boolean);

//     const machineTrialStatus = parseEditArray(editReport["machineTrialStatus"])
//       .length
//       ? parseEditArray(editReport["machineTrialStatus"])
//       : [
//           editReport["Machine tested successfully"] === "Yes"
//             ? "machineTestedSuccessfully"
//             : null,
//           editReport["Machine running normally"] === "Yes"
//             ? "machineRunningNormally"
//             : null,
//           editReport["Running with observation"] === "Yes"
//             ? "runningWithObservation"
//             : null,
//           editReport["Machine stopped - further action required"] === "Yes"
//             ? "machineStopped"
//             : null,
//           editReport["Customer advised / awaiting action"] === "Yes"
//             ? "customerAdvised"
//             : null,
//         ].filter(Boolean);

//     const furtherAction = parseEditArray(editReport["furtherAction"]).length
//       ? parseEditArray(editReport["furtherAction"])
//       : [
//           editReport["No further action required"] === "Yes"
//             ? "noFurtherAction"
//             : null,
//           editReport["Parts required"] === "Yes" ? "partsRequired" : null,
//           editReport["Follow-up visit required"] === "Yes"
//             ? "followUpVisit"
//             : null,
//           editReport["Customer action required"] === "Yes"
//             ? "customerAction"
//             : null,
//           (editReport["Technical support required from Haitian China"] ||
//             editReport[
//               "Technical / spare support required from Haitian China"
//             ] ||
//             "") === "Yes"
//             ? "technicalSupportChina"
//             : null,
//         ].filter(Boolean);

//     const commercial = parseEditArray(
//       editReport["serviceCommercialClassification"],
//     ).length
//       ? parseEditArray(editReport["serviceCommercialClassification"])
//       : [
//           editReport["F.O.C. Commissioning"] === "Yes"
//             ? "focCommissioning"
//             : null,
//           editReport["F.O.C. Maintenance"] === "Yes" ? "focMaintenance" : null,
//           editReport["Warranty Service"] === "Yes" ? "warrantyService" : null,
//           editReport["Chargeable Maintenance"] === "Yes"
//             ? "chargeableMaintenance"
//             : null,
//           editReport["Customer Visit (Service)"] === "Yes"
//             ? "customerVisitService"
//             : null,
//           editReport["Service Contract"] === "Yes" ? "serviceContract" : null,
//           editReport["Goodwill"] === "Yes" ? "goodwill" : null,
//           editReport["Chargeable commissioning"] === "Yes"
//             ? "chargeableCommissioning"
//             : null,
//         ].filter(Boolean);

//     const technicians = String(editReport["Technician"] || "")
//       .split(",")
//       .map((x) => x.trim())
//       .filter(Boolean);

//     const existingParts =
//       Array.isArray(editReport.parts) && editReport.parts.length
//         ? editReport.parts.map((part, index) => ({
//             key: index,
//             partNo: part.partNo ?? part["Part No."] ?? "",
//             description: part.description ?? part["Description"] ?? "",
//             qty: part.qty ?? part["Qty"] ?? "",
//             usedRecommended:
//               part.usedRecommended ?? part["Used / Recommended"] ?? "",
//             remarks: part.remarks ?? part["Remarks"] ?? "",
//           }))
//         : [
//             {
//               key: 0,
//               partNo: editReport["Part No."] || "",
//               description: editReport["Description"] || "",
//               qty: editReport["Qty"] || "",
//               usedRecommended: editReport["Used / Recommended"] || "",
//               remarks: editReport["Remarks"] || "",
//             },
//           ];

//     // Always show at least 3 rows.
//     // Existing rows are preserved; empty rows are added only when needed.
//     const parts = [...existingParts];

//     while (parts.length < 3) {
//       parts.push({
//         key: parts.length,
//         partNo: "",
//         description: "",
//         qty: "",
//         usedRecommended: "",
//         remarks: "",
//       });
//     }

//     setEditPartsData(parts);
//     editForm.setFieldsValue({
//       serviceReportNumber: editReport["Service Report Number"] || "",
//       customer: editReport["Customer"] || "",
//       serviceDate: editReport["Service Date"] || "",
//       siteLocation: editReport["Site / Location"] || "",
//       contactPerson: editReport["Contact Person"] || "",
//       contactNo: editReport["Contact No."] || "",
//       technician: technicians,
//       arrivalTime: editReport["Arrival Time"] || "",
//       completionTime: editReport["Completion Time"] || "",
//       totalWorkingHours: editReport["Total Working Hours"] || "",
//       serviceVisitRef: editReport["Service Visit Ref."] || "",
//       machineModel: editReport["Machine Model"] || "",
//       serialNo: editReport["Serial No."] || "",
//       installationYear:
//         editReport["Installation year"] ||
//         editReport["Installation Date"] ||
//         "",
//       machineRunningHours: editReport["Machine Running Hours"] || "",
//       softwareVersion:
//         editReport["Controller"] ||
//         editReport["Controller / Software version"] ||
//         editReport["Controller / Software Version"] ||
//         "",
//       warrantyStatus: editReport["Warranty Status"] || "",
//       serviceCategory,
//       customerComplaint:
//         editReport["Customer complaint / reported problem"] || "",
//       technicianDiagnosis:
//         editReport["Technician diagnosis/root cause"] ||
//         editReport["Technician Diagnosis / Root Cause"] ||
//         "",
//       workPerformed:
//         editReport["Work performed / corrective action"] ||
//         editReport["Work Performed / Corrective Action"] ||
//         "",
//       machineTrialStatus,
//       trialDuration: editReport["Trial Duration"] || "",
//       cycleTime: editReport["Cycle Time"] || "",
//       productMaterial: editReport["Product / Material"] || "",
//       trialStatusRemarks: editReport["Trial / Status Remarks"] || "",
//       furtherAction,
//       requiredActionFollowUp:
//         editReport["Required Action / Follow-up"] ||
//         editReport["Required Action / Follow-Up"] ||
//         "",
//       serviceCommercialClassification: commercial,
//       technicianName:
//         editReport["Service Technician Name"] ||
//         editReport["Technician Name"] ||
//         "",
//       technicianDate:
//         editReport["Service Technician Date"] ||
//         editReport["Technician Date"] ||
//         "",
//       managerName:
//         editReport["Service Manager Name"] || editReport["Manager Name"] || "",
//       managerDate:
//         editReport["Service Manager Date"] || editReport["Manager Date"] || "",
//       customerName: editReport["Customer Name"] || "",
//       customerDate: editReport["Customer Date"] || "",
//     });

//     // Every edit must be re-signed. Existing signature data is not
//     // exposed by the current backend, so the user must draw all 3.
//     setEditSignatureTechnician("");
//     setEditSignatureManager("");
//     setEditSignatureCustomer("");
//     setIsEditTechnicianSignSaved(false);
//     setIsEditManagerSignSaved(false);
//     setIsEditCustomerSignSaved(false);

//     setTimeout(() => {
//       [editSigTechnician, editSigManager, editSigCustomer].forEach((ref) => {
//         if (ref.current) ref.current.clear();
//       });
//     }, 50);
//   }, [editReport, editModalOpen]);

//   // ============================================================
//   // EDIT FORM - PARTS INPUT LIMITS
//   // Same limits as the New Service Report form
//   // Part No. = 22, Description = 25, Used / Recommended = 25, Remarks = 25
//   // ============================================================
//   const updateEditPart = (key, field, value) => {
//     let limitedValue = typeof value === "string" ? value : "";

//     if (field === "partNo") {
//       limitedValue = limitedValue.slice(0, 22);
//     } else if (field === "description") {
//       limitedValue = limitedValue.slice(0, 25);
//     } else if (field === "usedRecommended" || field === "remarks") {
//       limitedValue = limitedValue.slice(0, 25);
//     }

//     setEditPartsData((current) =>
//       current.map((part) =>
//         part.key === key
//           ? { ...part, [field]: limitedValue }
//           : part,
//       ),
//     );
//   };

//   const addEditPart = () => {
//     setEditPartsData((current) => [
//       ...current,
//       {
//         key: Date.now(),
//         partNo: "",
//         description: "",
//         qty: "",
//         usedRecommended: "",
//         remarks: "",
//       },
//     ]);
//   };

//   const removeEditPart = (key) => {
//     setEditPartsData((current) => {
//       const next = current.filter((part) => part.key !== key);
//       return next.length
//         ? next
//         : [
//             {
//               key: Date.now(),
//               partNo: "",
//               description: "",
//               qty: "",
//               usedRecommended: "",
//               remarks: "",
//             },
//           ];
//     });
//   };

//   const closeEditModal = (force = false) => {
//     if (editSaveLoading && !force) return;
//     setEditModalOpen(false);
//     setEditReport(null);
//     setEditPartsData([]);
//     editForm.resetFields();
//     setEditSignatureTechnician("");
//     setEditSignatureManager("");
//     setEditSignatureCustomer("");
//     setIsEditTechnicianSignSaved(false);
//     setIsEditManagerSignSaved(false);
//     setIsEditCustomerSignSaved(false);
//     [editSigTechnician, editSigManager, editSigCustomer].forEach((ref) => {
//       if (ref.current) ref.current.clear();
//     });
//   };

//   const saveEditSignature = (type) => {
//     const config = {
//       technician: {
//         ref: editSigTechnician,
//         setSignature: setEditSignatureTechnician,
//         setSaved: setIsEditTechnicianSignSaved,
//         label: "Technician",
//       },
//       manager: {
//         ref: editSigManager,
//         setSignature: setEditSignatureManager,
//         setSaved: setIsEditManagerSignSaved,
//         label: "Manager",
//       },
//       customer: {
//         ref: editSigCustomer,
//         setSignature: setEditSignatureCustomer,
//         setSaved: setIsEditCustomerSignSaved,
//         label: "Customer",
//       },
//     }[type];

//     if (config?.ref.current && !config.ref.current.isEmpty()) {
//       config.setSignature(
//         config.ref.current.getCanvas().toDataURL("image/png"),
//       );
//       config.setSaved(true);
//       notification.success({
//         message: "Signature Saved",
//         description: `${config.label} signature saved successfully.`,
//         placement: "bottomRight",
//       });
//     } else {
//       notification.error({
//         message: `${config?.label || "Signature"} Signature Required`,
//         description: `Please draw the ${String(type).toLowerCase()} signature before saving.`,
//         placement: "bottomRight",
//       });
//     }
//   };

//   const clearEditSignature = (type) => {
//     const config = {
//       technician: {
//         ref: editSigTechnician,
//         setSignature: setEditSignatureTechnician,
//         setSaved: setIsEditTechnicianSignSaved,
//       },
//       manager: {
//         ref: editSigManager,
//         setSignature: setEditSignatureManager,
//         setSaved: setIsEditManagerSignSaved,
//       },
//       customer: {
//         ref: editSigCustomer,
//         setSignature: setEditSignatureCustomer,
//         setSaved: setIsEditCustomerSignSaved,
//       },
//     }[type];

//     if (config?.ref.current) config.ref.current.clear();
//     config?.setSignature("");
//     config?.setSaved(false);
//   };

//   const uploadEditedServiceReportPDF = async (pdfResult) => {
//     const formData = new URLSearchParams();
//     formData.append("action", "uploadPdf");
//     formData.append("fileName", pdfResult.fileName);
//     formData.append("pdfBase64", pdfResult.pdfBase64);
//     formData.append("replaceExisting", "true");

//     // Send the SRN so Apps Script can replace any previous PDF
//     // belonging to this same service report, even if the customer
//     // name changed during the edit.
//     formData.append(
//       "serviceReportNumber",
//       String(pdfResult.reportNumber || ""),
//     );

//     const response = await fetch(GAS_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: formData.toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`PDF upload server returned ${response.status}`);
//     }

//     const result = await response.json();

//     if (!result.success) {
//       throw new Error(result.message || "Failed to upload updated PDF");
//     }

//     return result;
//   };

//   const handleEditSave = async () => {
//     if (editSaveLoading) return;

//     try {
//       const values = await editForm.validateFields();

//       const signaturesReady =
//         isEditTechnicianSignSaved &&
//         Boolean(editSignatureTechnician) &&
//         editSigTechnician.current &&
//         !editSigTechnician.current.isEmpty() &&
//         isEditManagerSignSaved &&
//         Boolean(editSignatureManager) &&
//         editSigManager.current &&
//         !editSigManager.current.isEmpty() &&
//         isEditCustomerSignSaved &&
//         Boolean(editSignatureCustomer) &&
//         editSigCustomer.current &&
//         !editSigCustomer.current.isEmpty();

//       if (!signaturesReady) {
//         notification.error({
//           message: "All Signatures Required",
//           description:
//             "Please draw and save the Technician, Manager, and Customer signatures before submitting the edit.",
//           placement: "bottomRight",
//         });
//         return;
//       }

//       if (!navigator.onLine) {
//         notification.error({
//           message: "No Internet Connection",
//           description: "Please check your internet and try again.",
//           placement: "bottomRight",
//         });
//         return;
//       }

//       const reportNumber =
//         values.serviceReportNumber ||
//         editReport?.["Service Report Number"] ||
//         "";

//       if (!reportNumber) {
//         throw new Error("Service Report Number is missing.");
//       }

//       setEditSaveLoading(true);

//       // IMPORTANT:
//       // Do NOT filter out empty rows.
//       // The backend must receive all 3 default rows so they remain
//       // stored even when the user clears every input.
//       const parts = editPartsData.map((part) => ({
//         partNo: String(part?.partNo ?? "").trim(),
//         description: String(part?.description ?? "").trim(),
//         qty: String(part?.qty ?? "").trim(),
//         usedRecommended: String(part?.usedRecommended ?? "").trim(),
//         remarks: String(part?.remarks ?? "").trim(),
//       }));

//       // Safety: always send at least 3 rows.
//       while (parts.length < 3) {
//         parts.push({
//           partNo: "",
//           description: "",
//           qty: "",
//           usedRecommended: "",
//           remarks: "",
//         });
//       }

//       const payload = {
//         action: "updateReport",
//         serviceReportNumber: String(reportNumber),
//         customer: values.customer || "",
//         serviceDate: values.serviceDate || "",
//         siteLocation: values.siteLocation || "",
//         contactPerson: values.contactPerson || "",
//         contactNo: values.contactNo || "",
//         technician: Array.isArray(values.technician)
//           ? values.technician.join(", ")
//           : values.technician || "",
//         arrivalTime: values.arrivalTime || "",
//         completionTime: values.completionTime || "",
//         totalWorkingHours: values.totalWorkingHours ?? "",
//         serviceVisitRef: values.serviceVisitRef || "",
//         machineModel: values.machineModel || "",
//         serialNo: values.serialNo || "",
//         installationYear: values.installationYear || "",
//         machineRunningHours: values.machineRunningHours ?? "",
//         softwareVersion: values.softwareVersion || "",
//         warrantyStatus: values.warrantyStatus || "",
//         serviceCategory: JSON.stringify(values.serviceCategory || []),
//         customerComplaint: values.customerComplaint || "",
//         technicianDiagnosis: values.technicianDiagnosis || "",
//         workPerformed: values.workPerformed || "",
//         machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),
//         trialDuration: values.trialDuration || "",
//         cycleTime: values.cycleTime || "",
//         productMaterial: values.productMaterial || "",
//         trialStatusRemarks: values.trialStatusRemarks || "",
//         parts: JSON.stringify(parts),
//         furtherAction: JSON.stringify(values.furtherAction || []),
//         requiredActionFollowUp: values.requiredActionFollowUp || "",
//         serviceCommercialClassification: JSON.stringify(
//           values.serviceCommercialClassification || [],
//         ),
//         technicianName: values.technicianName || "",
//         technicianDate: values.technicianDate || "",
//         managerName: values.managerName || "",
//         managerDate: values.managerDate || "",
//         customerName: values.customerName || "",
//         customerDate: values.customerDate || "",
//         // Included for API compatibility; signatures are used for the PDF.
//         signatureTechnician: editSignatureTechnician,
//         signatureManager: editSignatureManager,
//         signatureCustomer: editSignatureCustomer,
//         userEmail: user?.email || "",
//       };

//       const formData = new URLSearchParams();
//       Object.entries(payload).forEach(([key, value]) => {
//         formData.append(
//           key,
//           value === null || value === undefined ? "" : String(value),
//         );
//       });

//       const response = await fetch(GAS_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: formData.toString(),
//       });

//       if (!response.ok) {
//         throw new Error(`Server returned ${response.status}`);
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || "Failed to update service report");
//       }

//       // Generate the new PDF only after the sheet update succeeds.
//       const pdfValues = {
//         ...values,
//         parts,
//       };

//       const pdfResult = await generateEditServiceReportPDF(
//         pdfValues,
//         String(reportNumber),
//         editSignatureTechnician,
//         editSignatureManager,
//         editSignatureCustomer,
//       );

//       await uploadEditedServiceReportPDF(pdfResult);

//       // Download the exact PDF that was just uploaded.
//       // Passing the filename avoids the old/new filename mismatch.
//       await downloadServiceReportPDFByNumber(
//         String(reportNumber),
//         pdfResult.fileName,
//       );

//       notification.success({
//         message: "Report Updated",
//         description: `Service Report ${reportNumber} was updated and its PDF was regenerated successfully.`,
//         placement: "bottomRight",
//       });

//       closeEditModal(true);
//       await fetchServiceReports();
//     } catch (error) {
//       console.error("Edit service report error:", error);

//       notification.error({
//         message: "Update Failed",
//         description: error?.message || "Unable to update the service report.",
//         placement: "bottomRight",
//       });
//     } finally {
//       setEditSaveLoading(false);
//     }
//   };

//   // ============================================================
//   // SERVICE REPORT TABLE HELPERS
//   // ============================================================

//   const getServiceReportNumber = (record) => {
//     const raw = record?.["Service Report Number"];
//     const numeric = Number(String(raw ?? "").replace(/[^0-9.-]/g, ""));
//     return Number.isFinite(numeric) ? numeric : -Infinity;
//   };

//   const getReportSearchText = (record) =>
//     Object.values(record || {})
//       .map((value) => {
//         if (Array.isArray(value)) return value.join(" ");
//         if (value === null || value === undefined) return "";
//         return String(value);
//       })
//       .join(" ")
//       .toLowerCase();

//   // ============================================================
//   // REPORT TABLE FIELD HELPER
//   // ============================================================
//   // The backend/Google Sheet can contain these three fields under
//   // different header names depending on the version of the report.
//   // Always check every supported name before displaying "-".
//   // ============================================================

//   const getReportField = (record, fieldNames) => {
//     if (!record || !Array.isArray(fieldNames)) return "";

//     for (const fieldName of fieldNames) {
//       const value = record?.[fieldName];

//       if (value !== null && value !== undefined) {
//         const text = String(value).trim();

//         if (text !== "") {
//           return text;
//         }
//       }
//     }

//     return "";
//   };

//   const getCustomerComplaint = (record) =>
//     getReportField(record, [
//       "Customer Complaint",
//       "Customer complaint / reported problem",
//       "Customer Complaint / Reported Problem",
//       "customerComplaint",
//     ]);

//   const getTechnicianDiagnosis = (record) =>
//     getReportField(record, [
//       "Technician Diagnosis",
//       "Technician diagnosis/root cause",
//       "Technician Diagnosis / Root Cause",
//       "technicianDiagnosis",
//       "diagnosis",
//     ]);

//   const getWorkPerformed = (record) =>
//     getReportField(record, [
//       "Work Performed",
//       "Work performed / corrective action",
//       "Work Performed / Corrective Action",
//       "workPerformed",
//     ]);

//   const filteredAndSortedReportData = [...reportData]
//     .filter((record) => {
//       const query = reportTableSearch.trim().toLowerCase();
//       if (!query) return true;
//       return getReportSearchText(record).includes(query);
//     })
//     .sort((a, b) => getServiceReportNumber(b) - getServiceReportNumber(a));

//   const reportTableColumns = [
//     {
//       title: "Service Report",
//       dataIndex: "Service Report Number",
//       key: "serviceReportNumber",
//       fixed: "left",
//       width: 150,
//       sorter: (a, b) => getServiceReportNumber(a) - getServiceReportNumber(b),
//       defaultSortOrder: "descend",
//       render: (value) => (
//         <div className="service-report-number-cell">
//           <span className="service-report-number-badge">
//             {value || "-"}
//           </span>
//         </div>
//       ),
//     },

//     {
//       title: "Customer",
//       dataIndex: "Customer",
//       key: "customer",
//       width: 190,
//       ellipsis: true,
//     },

//     {
//       title: "Service Date",
//       dataIndex: "Service Date",
//       key: "serviceDate",
//       width: 125,
//       sorter: (a, b) =>
//         String(a?.["Service Date"] || "").localeCompare(
//           String(b?.["Service Date"] || ""),
//         ),
//       render: (date) => date || "-",
//     },

//     {
//       title: "Site / Location",
//       dataIndex: "Site / Location",
//       key: "siteLocation",
//       width: 210,
//       ellipsis: true,
//     },

//     {
//       title: "Contact Person",
//       dataIndex: "Contact Person",
//       key: "contactPerson",
//       width: 170,
//       ellipsis: true,
//     },

//     {
//       title: "Contact No.",
//       dataIndex: "Contact No.",
//       key: "contactNo",
//       width: 145,
//       ellipsis: true,
//     },

//     {
//       title: "Technician",
//       dataIndex: "Technician",
//       key: "technician",
//       width: 150,
//       ellipsis: true,
//     },

//     {
//       title: "Arrival",
//       dataIndex: "Arrival Time",
//       key: "arrivalTime",
//       width: 105,
//       render: (time) => time || "-",
//     },

//     {
//       title: "Completion",
//       dataIndex: "Completion Time",
//       key: "completionTime",
//       width: 110,
//       render: (time) => time || "-",
//     },

//     {
//       title: "Working Hours",
//       dataIndex: "Total Working Hours",
//       key: "totalWorkingHours",
//       width: 130,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Visit Ref.",
//       dataIndex: "Service Visit Ref.",
//       key: "serviceVisitRef",
//       width: 150,
//       ellipsis: true,
//     },

//     {
//       title: "Machine Model",
//       dataIndex: "Machine Model",
//       key: "machineModel",
//       width: 170,
//       ellipsis: true,
//     },

//     {
//       title: "Serial No.",
//       dataIndex: "Serial No.",
//       key: "serialNo",
//       width: 165,
//       ellipsis: true,
//     },

//     {
//       title: "Installation Year",
//       dataIndex: "Installation year",
//       key: "installationYear",
//       width: 135,
//       render: (_, record) =>
//         record?.["Installation year"] ||
//         record?.["Installation Date"] ||
//         "-",
//     },

//     {
//       title: "Running Hours",
//       dataIndex: "Machine Running Hours",
//       key: "machineRunningHours",
//       width: 135,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Controller",
//       dataIndex: "Controller",
//       key: "controller",
//       width: 160,
//       ellipsis: true,
//       render: (_, record) =>
//         record?.["Controller"] ||
//         record?.["Controller / Software version"] ||
//         record?.["Controller / Software Version"] ||
//         "-",
//     },

//     {
//       title: "Warranty",
//       dataIndex: "Warranty Status",
//       key: "warrantyStatus",
//       width: 125,
//       ellipsis: true,
//     },

//     {
//       title: "Customer Complaint",
//       dataIndex: "Customer Complaint",
//       key: "customerComplaint",
//       width: 240,
//       ellipsis: true,
//       render: (_, record) => getCustomerComplaint(record) || "-",
//     },

//     {
//       title: "Technician Diagnosis",
//       dataIndex: "Technician Diagnosis",
//       key: "technicianDiagnosis",
//       width: 240,
//       ellipsis: true,
//       render: (_, record) => getTechnicianDiagnosis(record) || "-",
//     },

//     {
//       title: "Work Performed",
//       dataIndex: "Work Performed",
//       key: "workPerformed",
//       width: 240,
//       ellipsis: true,
//       render: (_, record) => getWorkPerformed(record) || "-",
//     },

//     {
//       title: "Trial Duration",
//       dataIndex: "Trial Duration",
//       key: "trialDuration",
//       width: 125,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Cycle Time",
//       dataIndex: "Cycle Time",
//       key: "cycleTime",
//       width: 115,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Product / Material",
//       dataIndex: "Product / Material",
//       key: "productMaterial",
//       width: 180,
//       ellipsis: true,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Trial / Status Remarks",
//       dataIndex: "Trial / Status Remarks",
//       key: "trialStatusRemarks",
//       width: 240,
//       ellipsis: true,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Part No.",
//       dataIndex: "Part No.",
//       key: "partNo",
//       width: 180,
//       ellipsis: true,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Part Description",
//       dataIndex: "Description",
//       key: "partDescription",
//       width: 180,
//       ellipsis: true,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Qty",
//       dataIndex: "Qty",
//       key: "qty",
//       width: 80,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Used / Recommended",
//       dataIndex: "Used / Recommended",
//       key: "usedRecommended",
//       width: 180,
//       ellipsis: true,
//       render: (value) => value || "-",
//     },

//     {
//       title: "Part Remarks",
//       dataIndex: "Remarks",
//       key: "partRemarks",
//       width: 180,
//       ellipsis: true,
//       render: (value) => value || "-",
//     },

//     // {
//     //   title: "Further Action",
//     //   dataIndex: "Further Action Required",
//     //   key: "furtherAction",
//     //   width: 220,
//     //   ellipsis: true,
//     //   render: (value) => value || "-",
//     // },

//     // {
//     //   title: "Commercial Classification",
//     //   dataIndex: "Service Commercial Classification",
//     //   key: "commercialClassification",
//     //   width: 220,
//     //   ellipsis: true,
//     //   render: (value) => value || "-",
//     // },

//     {
//       title: "Actions",
//       key: "action",
//       fixed: "right",
//       width: 210,
//       render: (_, record) => (
//         <div className="service-report-table-actions">
//           <Button
//             className="service-report-view-action"
//             icon={<EyeOutlined />}
//             onClick={() => {
//               setViewReport(record);
//               setViewModalOpen(true);
//             }}
//           >
//             View
//           </Button>

//           <Button
//             className="service-report-edit-action"
//             icon={<EditOutlined />}
//             onClick={() => {
//               setEditReport(record);
//               setEditModalOpen(true);
//             }}
//           >
//             Edit
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   // ============================================================
//   // CUSTOMER DATA HELPERS
//   // Supports both the actual Form Data sheet headers and the
//   // older/canonical customer headers used by Code 1.
//   // ============================================================

//   const getCustomerName = (item) =>
//     String(item?.["Customer"] || item?.["Customer Name"] || "").trim();

//   const getCustomerAddress = (item) =>
//     String(item?.["Site / Location"] || item?.["Address"] || "").trim();

//   const getCustomerContact = (item) =>
//     String(item?.["Contact Person"] || item?.["Contact"] || "").trim();

//   const getCustomerTelephone = (item) =>
//     String(item?.["Contact No."] || item?.["Telephone"] || "").trim();

//   const getCustomerMachineModel = (item) =>
//     String(item?.["Machine Model"] || item?.["Machine Type"] || "").trim();

//   const getCustomerSerialNumber = (item) =>
//     String(item?.["Serial No."] || item?.["Serial Number"] || "").trim();

//   const getCustomerInstallationYear = (item) =>
//     String(
//       item?.["Installation year"] || item?.["Installation Date"] || "",
//     ).trim();

//   // ============================================================
//   // LOAD CUSTOMER DATA
//   // ============================================================

//   useEffect(() => {
//     loadAllCustomerData();
//   }, []);

//   const loadAllCustomerData = async () => {
//     try {
//       console.log("Loading customer data...");
//       console.log("Customer API URL:", `${GAS_URL}?action=getAllCustomerData`);

//       const response = await fetch(`${GAS_URL}?action=getAllCustomerData`, {
//         method: "GET",
//         cache: "no-store",
//       });

//       if (!response.ok) {
//         throw new Error(`Customer data server returned ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("Customer API response:", result);

//       if (!result.success) {
//         throw new Error(result.message || "Customer data request failed");
//       }

//       const allData = Array.isArray(result.customers) ? result.customers : [];

//       console.log("Customer rows received:", allData.length);
//       console.log("Customer rows:", allData);

//       // Normalize the returned rows so the frontend works whether
//       // the backend sends "Customer" or "Customer Name" and the
//       // actual sheet field names or the canonical Code-1 names.
//       const normalizedData = allData
//         .map((item) => ({
//           ...item,
//           Customer: getCustomerName(item),
//           "Customer Name": getCustomerName(item),
//           "Site / Location": getCustomerAddress(item),
//           Address: getCustomerAddress(item),
//           "Contact Person": getCustomerContact(item),
//           Contact: getCustomerContact(item),
//           "Contact No.": getCustomerTelephone(item),
//           Telephone: getCustomerTelephone(item),
//           "Machine Model": getCustomerMachineModel(item),
//           "Machine Type": getCustomerMachineModel(item),
//           "Serial No.": getCustomerSerialNumber(item),
//           "Serial Number": getCustomerSerialNumber(item),
//           "Installation year": getCustomerInstallationYear(item),
//           "Installation Date": getCustomerInstallationYear(item),
//         }))
//         .filter((item) => getCustomerName(item) !== "");

//       // Keep the latest row for each customer. The backend returns
//       // sheet rows in their normal order, so iterating backwards
//       // gives the newest occurrence first.
//       const seen = new Map();

//       for (let i = normalizedData.length - 1; i >= 0; i--) {
//         const item = normalizedData[i];
//         const name = getCustomerName(item);
//         const key = name.toLowerCase();

//         if (name && !seen.has(key)) {
//           seen.set(key, item);
//         }
//       }

//       const uniqueSorted = Array.from(seen.values()).sort((a, b) =>
//         getCustomerName(a).localeCompare(getCustomerName(b)),
//       );

//       setCustomerDataList(uniqueSorted);
//       setCustomerOptions(
//         uniqueSorted.map((customer) => getCustomerName(customer)),
//       );

//       console.log(
//         "Unique customers:",
//         uniqueSorted.map((customer) => getCustomerName(customer)),
//       );
//     } catch (error) {
//       console.error("Failed to load customer data:", error);
//       setCustomerDataList([]);
//       setCustomerOptions([]);
//     }
//   };

//   // ============================================================
//   // CUSTOMER SEARCH
//   // ============================================================

//   const handleCustomerSearch = (value) => {
//     const searchValue = String(value || "")
//       .trim()
//       .toLowerCase();

//     const filtered = customerDataList
//       .map((item) => getCustomerName(item))
//       .filter((name) => name !== "")
//       .filter(
//         (name, index, self) =>
//           self.findIndex(
//             (other) => other.toLowerCase().trim() === name.toLowerCase().trim(),
//           ) === index,
//       )
//       .filter((name) => name.toLowerCase().includes(searchValue))
//       .sort((a, b) => a.localeCompare(b));

//     setCustomerOptions(filtered);
//   };

//   // ============================================================
//   // CUSTOMER CHANGE / AUTO PREFILL
//   // ============================================================

//   const clearCustomerAutofill = () => {
//     form.setFieldsValue({
//       siteLocation: "",
//       contactPerson: "",
//       contactNo: "",
//       machineModel: "",
//       serialNo: "",
//       installationYear: "",
//     });

//     setAddress("");
//     setSerialNumber("");
//   };

//   const handleCustomerChange = (value) => {
//     const customerValue = typeof value === "string" ? value.trim() : "";

//     form.setFieldsValue({
//       customer: value || "",
//     });

//     // Clear only when the customer field is actually emptied.
//     // Do NOT clear the previous data while the user is typing a
//     // partial customer name such as "P" or "HA".
//     if (!customerValue) {
//       clearCustomerAutofill();
//       return;
//     }

//     const matched = customerDataList.find(
//       (customer) =>
//         getCustomerName(customer).toLowerCase() === customerValue.toLowerCase(),
//     );

//     if (!matched) {
//       // Partial typing is allowed. Autofill happens only after an
//       // exact customer name is selected/entered.
//       return;
//     }

//     const customerName = getCustomerName(matched);
//     const addressValue = getCustomerAddress(matched);
//     const contactValue = getCustomerContact(matched);
//     const telephoneValue = getCustomerTelephone(matched);
//     const machineModelValue = getCustomerMachineModel(matched);
//     const serialValue = getCustomerSerialNumber(matched);
//     const installationYearValue = getCustomerInstallationYear(matched);

//     form.setFieldsValue({
//       customer: customerName,
//       siteLocation: addressValue,
//       contactPerson: contactValue,
//       contactNo: telephoneValue,
//       machineModel: machineModelValue,
//       serialNo: serialValue,
//       installationYear: installationYearValue,
//     });

//     setAddress(addressValue);
//     setSerialNumber(serialValue);

//     console.log("Customer selected:", matched);
//   };

//   const handleTechChange = (value) => {
//     if (value.length <= 5) {
//       setSelectedTechnicians(value);
//       form.setFieldsValue({ technician: value });
//     }
//   };

//   useEffect(() => {
//     updateCanvasSize();
//     window.addEventListener("resize", updateCanvasSize);
//     return () => window.removeEventListener("resize", updateCanvasSize);
//   }, []);

//   useEffect(() => {
//     fetchNextServiceReportNumber();
//   }, []);

//   // ============================================================
//   // TEXT LIMIT UTILITY
//   // Maximum: 3 lines and 512 characters
//   // ============================================================
//   const enforceSectionTextLimit = (value) => {
//     const input = typeof value === "string" ? value : "";

//     // First limit to 3 explicit lines
//     const lines = input.split("\n").slice(0, 3);

//     let limited = lines.join("\n");

//     // Then limit total characters to 512
//     if (limited.length > 512) {
//       limited = limited.substring(0, 512);
//     }

//     return limited;
//   };

//   const enforceProductMaterialLimit = (value) => {
//     const input = typeof value === "string" ? value : "";

//     // Restrict to 1 line
//     let limited = input.split("\n")[0];

//     // Restrict to 90 characters
//     if (limited.length > 100) {
//       limited = limited.substring(0, 100);
//     }

//     return limited;
//   };

//   const handleProductMaterialChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceProductMaterialLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Product Material is limited to 1 line and 100 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     form.setFieldsValue({
//       productMaterial: limited,
//     });
//   };

//   const handleRequiredActionFollowUpChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceSectionTextLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Required Action / Follow-up is limited to 3 lines and 512 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     form.setFieldsValue({
//       requiredActionFollowUp: limited,
//     });
//   };

//   const handleTrialStatusRemarksChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceSectionTextLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Trial / Status Remarks is limited to 3 lines and 512 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     form.setFieldsValue({
//       trialStatusRemarks: limited,
//     });
//   };

//   const handleCustomerComplaintChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceSectionTextLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Customer complaint is limited to 3 lines and 512 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     form.setFieldsValue({
//       customerComplaint: limited,
//     });
//   };

//   const handleTechnicianDiagnosisChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceSectionTextLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Technician diagnosis is limited to 3 lines and 512 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     form.setFieldsValue({
//       technicianDiagnosis: limited,
//     });
//   };

//   const handleWorkPerformedChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceSectionTextLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Work performed is limited to 3 lines and 512 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     form.setFieldsValue({
//       workPerformed: limited,
//     });
//   };

//   // ============================================================
//   // EDIT FORM - TEXT INPUT LIMITS
//   // Same limits as the New Service Report form
//   // ============================================================
//   const handleEditSectionTextChange = (fieldName, fieldLabel, e) => {
//     const input = e.target.value;
//     const limited = enforceSectionTextLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description: `${fieldLabel} is limited to 3 lines and 512 characters. Excess text was removed.`,
//         placement: "bottomRight",
//       });
//     }

//     editForm.setFieldsValue({
//       [fieldName]: limited,
//     });
//   };

//   const handleEditProductMaterialChange = (e) => {
//     const input = e.target.value;
//     const limited = enforceProductMaterialLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Product Material is limited to 1 line and 100 characters. Excess text was removed.",
//         placement: "bottomRight",
//       });
//     }

//     editForm.setFieldsValue({
//       productMaterial: limited,
//     });
//   };

//   const formatDDMMYYYY = (value = "") => {
//     // remove everything except numbers
//     let digits = value.replace(/\D/g, "").slice(0, 8);

//     if (digits.length >= 5) {
//       return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
//     }

//     if (digits.length >= 3) {
//       return `${digits.slice(0, 2)}-${digits.slice(2)}`;
//     }

//     return digits;
//   };

//   // ============================================================
//   // PARTS TABLE DATA SOURCE
//   // ============================================================

//   const partsDataSource = [
//     {
//       key: 0,
//     },
//     {
//       key: 1,
//     },
//     {
//       key: 2,
//     },
//   ];

//   // ============================================================
//   // PARTS TABLE COLUMNS
//   // ============================================================

//   const partsColumns = [
//     {
//       title: "Part No.",
//       dataIndex: "partNo",
//       key: "partNo",
//       width: "17%",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Input
//             placeholder="Part No."
//             maxLength={22}
//             showCount
//             value={partsFormData[record.key]?.partNo || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "partNo", e.target.value)
//             }
//           />
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       width: "34%",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Input
//             placeholder="Description"
//             maxLength={25}
//             showCount
//             value={partsFormData[record.key]?.description || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "description", e.target.value)
//             }
//           />
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Qty",
//       dataIndex: "qty",
//       key: "qty",
//       width: "9%",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Input
//             style={{ width: "100%" }}
//             placeholder="Qty"
//             value={partsFormData[record.key]?.qty || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "qty", e.target.value)
//             }
//           />
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Used / Recommended",
//       dataIndex: "usedRecommended",
//       key: "usedRecommended",
//       width: "26%",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Input
//             placeholder="Used / Recommended"
//             maxLength={25}
//             showCount
//             value={partsFormData[record.key]?.usedRecommended || ""}
//             onChange={(e) =>
//               updatePartsFormData(
//                 record.key,
//                 "usedRecommended",
//                 e.target.value,
//               )
//             }
//           />
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Remarks",
//       dataIndex: "remarks",
//       key: "remarks",
//       width: "14%",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Input
//             placeholder="Remarks"
//             maxLength={25}
//             showCount
//             value={partsFormData[record.key]?.remarks || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "remarks", e.target.value)
//             }
//           />
//         </Form.Item>
//       ),
//     },
//   ];

//   const fetchNextServiceReportNumber = async () => {
//     try {
//       setSrnLoading(true);

//       const response = await fetch(
//         `${GAS_URL}?action=getNextServiceReportNumber`,
//       );

//       if (!response.ok) {
//         throw new Error(`Server returned ${response.status}`);
//       }

//       const result = await response.json();

//       console.log("Next SRN response:", result);

//       if (!result.success) {
//         throw new Error(
//           result.message || "Failed to fetch service report number",
//         );
//       }

//       const nextSRN = result.serviceReportNumber ?? result.srn;

//       if (nextSRN === undefined || nextSRN === null) {
//         throw new Error("Service report number was not received");
//       }

//       setServiceReportNumber(String(nextSRN));
//     } catch (error) {
//       console.error("Fetch SRN error:", error);

//       notification.error({
//         message: "SRN Error",
//         description: error.message || "Unable to fetch service report number.",
//         placement: "bottomRight",
//       });
//     } finally {
//       setSrnLoading(false);
//     }
//   };

//   const saveTechnicianSignature = () => {
//     if (sigTechnician.current && !sigTechnician.current.isEmpty()) {
//       setSignatureTechnician(
//         sigTechnician.current.getCanvas().toDataURL("image/png"),
//       );

//       setIsTechnicianSignSaved(true);

//       notification.success({
//         message: "Success",
//         description: "Technician signature saved successfully!",
//         placement: "bottomRight",
//       });
//     } else {
//       notification.error({
//         message: "Error",
//         description: "Please draw the technician signature before saving.",
//         placement: "bottomRight",
//       });
//     }
//   };

//   const clearTechnicianSignature = () => {
//     if (sigTechnician.current && !sigTechnician.current.isEmpty()) {
//       sigTechnician.current.clear();

//       setSignatureTechnician("");
//       setIsTechnicianSignSaved(false);

//       notification.success({
//         message: "Success",
//         description: "Technician signature cleared successfully!",
//         placement: "bottomRight",
//       });
//     } else {
//       notification.warning({
//         message: "Warning",
//         description: "No technician signature found to clear.",
//         placement: "bottomRight",
//       });
//     }
//   };

//   const saveManagerSignature = () => {
//     if (sigManager.current && !sigManager.current.isEmpty()) {
//       setSignatureManager(
//         sigManager.current.getCanvas().toDataURL("image/png"),
//       );

//       setIsManagerSignSaved(true);

//       notification.success({
//         message: "Success",
//         description: "Manager signature saved successfully!",
//         placement: "bottomRight",
//       });
//     } else {
//       notification.error({
//         message: "Error",
//         description: "Please draw the manager signature before saving.",
//         placement: "bottomRight",
//       });
//     }
//   };

//   const clearManagerSignature = () => {
//     if (sigManager.current && !sigManager.current.isEmpty()) {
//       sigManager.current.clear();

//       setSignatureManager("");
//       setIsManagerSignSaved(false);

//       notification.success({
//         message: "Success",
//         description: "Manager signature cleared successfully!",
//         placement: "bottomRight",
//       });
//     } else {
//       notification.warning({
//         message: "Warning",
//         description: "No manager signature found to clear.",
//         placement: "bottomRight",
//       });
//     }
//   };

//   const saveCustomerSignature = () => {
//     if (sigCustomer.current && !sigCustomer.current.isEmpty()) {
//       setSignatureCustomer(
//         sigCustomer.current.getCanvas().toDataURL("image/png"),
//       );

//       setIsCustomerSignSaved(true);

//       notification.success({
//         message: "Success",
//         description: "Customer signature saved successfully!",
//         placement: "bottomRight",
//       });
//     } else {
//       notification.error({
//         message: "Error",
//         description: "Please draw the customer signature before saving.",
//         placement: "bottomRight",
//       });
//     }
//   };

//   const clearCustomerSignature = () => {
//     if (sigCustomer.current && !sigCustomer.current.isEmpty()) {
//       sigCustomer.current.clear();

//       setSignatureCustomer("");
//       setIsCustomerSignSaved(false);

//       notification.success({
//         message: "Success",
//         description: "Customer signature cleared successfully!",
//         placement: "bottomRight",
//       });
//     } else {
//       notification.warning({
//         message: "Warning",
//         description: "No customer signature found to clear.",
//         placement: "bottomRight",
//       });
//     }
//   };

//   // ==========================================================
//   // FORM SUBMIT
//   // ==========================================================

// //   const handleSubmit = async (values) => {
// //     console.log(values);

// //     // ========================================================
// //     // PREVENT DOUBLE SUBMISSION
// //     // ========================================================

// //     if (loading) {
// //       return;
// //     }

// //     // ========================================================
// //     // SIGNATURE VALIDATION
// //     // ========================================================

// //     const technicianSignatureReady =
// //       isTechnicianSignSaved &&
// //       Boolean(signatureTechnician) &&
// //       sigTechnician.current &&
// //       !sigTechnician.current.isEmpty();

// //     const managerSignatureReady =
// //       isManagerSignSaved &&
// //       Boolean(signatureManager) &&
// //       sigManager.current &&
// //       !sigManager.current.isEmpty();

// //     const customerSignatureReady =
// //       isCustomerSignSaved &&
// //       Boolean(signatureCustomer) &&
// //       sigCustomer.current &&
// //       !sigCustomer.current.isEmpty();

// //     // --------------------------------------------------------
// //     // TECHNICIAN SIGNATURE
// //     // --------------------------------------------------------

// //     if (!technicianSignatureReady) {
// //       notification.error({
// //         message: "Technician Signature Required",
// //         description:
// //           "Please draw the technician signature and click Save Signature before submitting the report.",
// //         placement: "bottomRight",
// //       });

// //       return;
// //     }

// //     // --------------------------------------------------------
// //     // MANAGER SIGNATURE
// //     // --------------------------------------------------------

// //     if (!managerSignatureReady) {
// //       notification.error({
// //         message: "Manager Signature Required",
// //         description:
// //           "Please draw the manager signature and click Save Signature before submitting the report.",
// //         placement: "bottomRight",
// //       });

// //       return;
// //     }

// //     // --------------------------------------------------------
// //     // CUSTOMER SIGNATURE
// //     // --------------------------------------------------------

// //     if (!customerSignatureReady) {
// //       notification.error({
// //         message: "Customer Signature Required",
// //         description:
// //           "Please draw the customer signature and click Save Signature before submitting the report.",
// //         placement: "bottomRight",
// //       });

// //       return;
// //     }

// //     // ========================================================
// //     // MAIN SUBMISSION
// //     // ========================================================

// //     try {
// //       // ======================================================
// //       // INTERNET CHECK
// //       // ======================================================

// //       if (!navigator.onLine) {
// //         notification.error({
// //           message: "No Internet Connection",
// //           description: "Please check your internet and try again.",
// //           placement: "bottomRight",
// //         });

// //         return;
// //       }

// //       // ======================================================
// //       // START LOADING
// //       // ======================================================

// //       setLoading(true);

// //       // ========================================================
// //       // PARTS
// //       // ========================================================

// //       // ========================================================
// //       // PARTS
// //       // IMPORTANT: use the controlled Parts table state as the
// //       // single source of truth for saving and PDF generation.
// //       // ========================================================

// //       const parts = partsFormData.map((part) => ({
// //         partNo: String(part?.partNo ?? "").trim(),
// //         description: String(part?.description ?? "").trim(),
// //         qty: String(part?.qty ?? "").trim(),
// //         usedRecommended: String(part?.usedRecommended ?? "").trim(),
// //         remarks: String(part?.remarks ?? "").trim(),
// //       }));

// //       // Always keep all 3 default rows.
// //       while (parts.length < 3) {
// //         parts.push({
// //           partNo: "",
// //           description: "",
// //           qty: "",
// //           usedRecommended: "",
// //           remarks: "",
// //         });
// //       }

// //       // ========================================================
// //       // PAYLOAD
// //       // ========================================================

// //       const payload = {
// //         action: "saveReport",

// //         // ======================================================
// //         // CUSTOMER & VISIT
// //         // ======================================================

// //         customer: values.customer || "",
// //         serviceDate: values.serviceDate || "",
// //         siteLocation: values.siteLocation || "",
// //         contactPerson: values.contactPerson || "",
// //         contactNo: values.contactNo || "",
// //         technician: Array.isArray(values.technician)
// //           ? values.technician.join(", ")
// //           : values.technician || "",
// //         arrivalTime: values.arrivalTime || "",
// //         completionTime: values.completionTime || "",
// //         totalWorkingHours: values.totalWorkingHours ?? "",
// //         serviceVisitRef: values.serviceVisitRef || "",

// //         // ======================================================
// //         // MACHINE
// //         // ======================================================

// //         machineModel: values.machineModel || "",
// //         serialNo: values.serialNo || "",
// //         installationYear: values.installationYear || "",
// //         machineRunningHours: values.machineRunningHours ?? "",
// //         softwareVersion: values.softwareVersion || "",
// //         warrantyStatus: values.warrantyStatus || "",

// //         // ======================================================
// //         // SERVICE CATEGORY
// //         // ======================================================

// //         serviceCategory: JSON.stringify(values.serviceCategory || []),

// //         // ======================================================
// //         // COMPLAINT / DIAGNOSIS / WORK
// //         // ======================================================

// //         customerComplaint: values.customerComplaint || "",

// //         technicianDiagnosis: values.technicianDiagnosis || "",

// //         workPerformed: values.workPerformed || "",

// //         // ======================================================
// //         // MACHINE TRIAL
// //         // ======================================================

// //         machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),

// //         trialDuration: values.trialDuration || "",

// //         cycleTime: values.cycleTime || "",

// //         productMaterial: values.productMaterial || "",

// //         trialStatusRemarks: values.trialStatusRemarks || "",

// //         // ======================================================
// //         // PARTS
// //         // ======================================================

// //         parts: JSON.stringify(parts),

// //         // ======================================================
// //         // FURTHER ACTION
// //         // ======================================================

// //         furtherAction: JSON.stringify(values.furtherAction || []),

// //         requiredActionFollowUp: values.requiredActionFollowUp || "",

// //         // ======================================================
// //         // COMMERCIAL
// //         // ======================================================

// //         serviceCommercialClassification: JSON.stringify(
// //           values.serviceCommercialClassification || [],
// //         ),

// //         // ======================================================
// //         // CUSTOMER ACKNOWLEDGEMENT
// //         // ======================================================

// //         technicianName: values.technicianName || "",

// //         technicianDate: values.technicianDate || "",

// //         managerName: values.managerName || "",

// //         managerDate: values.managerDate || "",

// //         customerName: values.customerName || "",

// //         customerDate: values.customerDate || "",

// //         // ======================================================
// //         // SIGNATURES
// //         // ======================================================

// //         signatureTechnician: signatureTechnician || "",

// //         signatureManager: signatureManager || "",

// //         signatureCustomer: signatureCustomer || "",

// //         // ======================================================
// //         // LOGIN USER
// //         // ======================================================

// //         userEmail: user?.email || "",
// //       };

// //       // ========================================================
// //       // DEBUG - CHECK SIGNATURES BEFORE SUBMISSION
// //       // ========================================================

// //       console.log("Technician signature saved:", isTechnicianSignSaved);
// //       console.log("Manager signature saved:", isManagerSignSaved);
// //       console.log("Customer signature saved:", isCustomerSignSaved);

// //       console.log(
// //         "Technician signature data:",
// //         signatureTechnician ? "AVAILABLE" : "EMPTY",
// //       );

// //       console.log(
// //         "Manager signature data:",
// //         signatureManager ? "AVAILABLE" : "EMPTY",
// //       );

// //       console.log(
// //         "Customer signature data:",
// //         signatureCustomer ? "AVAILABLE" : "EMPTY",
// //       );

// //       // ========================================================
// //       // CREATE FORM DATA
// //       // ========================================================

// //       const formData = new URLSearchParams();

// //       Object.entries(payload).forEach(([key, value]) => {
// //         formData.append(
// //           key,
// //           value === null || value === undefined ? "" : String(value),
// //         );
// //       });

// //       // ========================================================
// //       // SEND TO GOOGLE APPS SCRIPT
// //       // ========================================================

// //       const response = await fetch(GAS_URL, {
// //         method: "POST",

// //         headers: {
// //           "Content-Type": "application/x-www-form-urlencoded",
// //         },

// //         body: formData.toString(),
// //       });

// //       // ========================================================
// //       // SERVER RESPONSE CHECK
// //       // ========================================================

// //       if (!response.ok) {
// //         throw new Error(`Server returned ${response.status}`);
// //       }

// //       const result = await response.json();

// //       console.log("Backend response:", result);

// //       // ========================================================
// //       // BACKEND SUCCESS CHECK
// //       // ========================================================

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to save service report");
// //       }

// //       // ========================================================
// //       // GET SAVED REPORT NUMBER
// //       // ========================================================

// //       const savedReportNumber = result.serviceReportNumber ?? result.srn ?? "";

// //       // ========================================================
// //       // SUCCESS MESSAGE
// //       // ========================================================

// //       notification.success({
// //         message: "Success",

// //         description: savedReportNumber
// //           ? `Service report ${savedReportNumber} saved successfully.`
// //           : "Service report saved successfully.",

// //         placement: "bottomRight",
// //       });

// //       // ========================================================
// //       // GENERATE PDF AFTER SUCCESSFUL SAVE
// //       // The PDF is generated only after the backend confirms
// //       // that the service report was saved successfully.
// //       // If PDF generation fails, the saved report remains safe.
// //       // ========================================================

// //       try {
// //         // ======================================================
// //         // GENERATE PDF
// //         // ======================================================

// //         // Use exactly the same Parts array that was sent to the backend.
// //         // Do not rely on values.parts here because the Parts table is
// //         // controlled independently from the Ant Design form.
// //         const pdfValues = {
// //           ...values,
// //           parts,
// //         };

// //         const pdfResult = await generateServiceReportPDF(
// //           pdfValues,
// //           savedReportNumber || serviceReportNumber,
// //           signatureTechnician,
// //           signatureManager,
// //           signatureCustomer,
// //         );

// //         // ======================================================
// //         // UPLOAD PDF TO GOOGLE DRIVE THROUGH APPS SCRIPT
// //         // ======================================================

// //         const pdfFormData = new URLSearchParams();

// //         pdfFormData.append("action", "uploadPdf");
// //         pdfFormData.append("fileName", pdfResult.fileName);
// //         pdfFormData.append("pdfBase64", pdfResult.pdfBase64);

// //         const pdfUploadResponse = await fetch(GAS_URL, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/x-www-form-urlencoded",
// //           },
// //           body: pdfFormData.toString(),
// //         });

// //         if (!pdfUploadResponse.ok) {
// //           throw new Error(
// //             `PDF upload server returned ${pdfUploadResponse.status}`,
// //           );
// //         }

// //         const pdfUploadResult = await pdfUploadResponse.json();

// //         console.log("PDF upload response:", pdfUploadResult);

// //         if (!pdfUploadResult.success) {
// //           throw new Error(
// //             pdfUploadResult.message || "Failed to upload PDF to Google Drive",
// //           );
// //         }

// //         // ======================================================
// //         // DOWNLOAD THE SAME PDF LOCALLY
// //         // This preserves the previous application behavior.
// //         // ======================================================

// //         pdfResult.doc.save(pdfResult.fileName);

// //         console.log(
// //           "PDF saved to Google Drive:",
// //           pdfUploadResult.fileUrl || pdfUploadResult.fileId,
// //         );

// //         notification.success({
// //           message: "PDF Generated & Uploaded",
// //           description: `Service report PDF ${pdfResult.fileName} was saved to Google Drive successfully.`,
// //           placement: "bottomRight",
// //         });
// //       } catch (pdfError) {
// //         console.error("PDF generation/upload error:", pdfError);

// //         notification.warning({
// //           message: "Report Saved, But PDF Upload Failed",
// //           description: `The service report was saved successfully, but the PDF step failed: ${
// //             pdfError?.message || "Unknown PDF error"
// //           }`,
// //           placement: "bottomRight",
// //           duration: 8,
// //         });
// //       }

// //       // ========================================================
// //       // RESET FORM
// //       // ========================================================

// //       // form.resetFields();
// //       // setSelectedTechnicians([]);

// //       // ========================================================
// //       // CLEAR TECHNICIAN SIGNATURE
// //       // ========================================================

// //       // if (sigTechnician.current) {
// //       //   sigTechnician.current.clear();
// //       // }

// //       // setSignatureTechnician("");

// //       // setIsTechnicianSignSaved(false);

// //       // ========================================================
// //       // CLEAR MANAGER SIGNATURE
// //       // ========================================================

// //       // if (sigManager.current) {
// //       //   sigManager.current.clear();
// //       // }

// //       // setSignatureManager("");

// //       // setIsManagerSignSaved(false);

// //       // ========================================================
// //       // CLEAR CUSTOMER SIGNATURE
// //       // ========================================================

// //       // if (sigCustomer.current) {
// //       //   sigCustomer.current.clear();
// //       // }

// //       // setSignatureCustomer("");

// //       // setIsCustomerSignSaved(false);

// //       await fetchServiceReports();

// //       // ========================================================
// //       // FETCH NEXT SERVICE REPORT NUMBER
// //       // ========================================================

// //       try {
// //         const srnResponse = await fetch(
// //           `${GAS_URL}?action=getNextServiceReportNumber`,
// //         );

// //         if (!srnResponse.ok) {
// //           throw new Error(`SRN server returned ${srnResponse.status}`);
// //         }

// //         const srnResult = await srnResponse.json();

// //         console.log("Next Service Report Number:", srnResult);

// //         if (!srnResult.success) {
// //           throw new Error(
// //             srnResult.message || "Failed to fetch next service report number",
// //           );
// //         }

// //         const nextSRN = srnResult.serviceReportNumber ?? srnResult.srn ?? "";

// //         if (nextSRN !== "") {
// //           setServiceReportNumber(String(nextSRN));
// //         }
// //       } catch (srnError) {
// //         console.error("Failed to fetch next SRN:", srnError);

// //         // Do not show the main submission as failed
// //         // because the report itself was already saved.
// //         notification.warning({
// //           message: "Report Saved, But SRN Refresh Failed",

// //           description:
// //             "The report was saved successfully, but the next Service Report Number could not be loaded. Please refresh the page.",

// //           placement: "bottomRight",
// //         });
// //       }
// //     } catch (error) {
// //       // ========================================================
// //       // ERROR
// //       // ========================================================

// //       console.error("Save report error:", error);

// //       notification.error({
// //         message: "Error",

// //         description: error.message || "Failed to save service report.",

// //         placement: "bottomRight",
// //       });
// //     } finally {
// //       // ========================================================
// //       // STOP LOADING
// //       // ========================================================

// //       setLoading(false);
// //     }
// //   };

// // ==========================================================
// // FORM SUBMIT
// // ==========================================================

// const handleSubmit = async (values) => {
//   console.log(values);

//   // ========================================================
//   // PREVENT DOUBLE SUBMISSION
//   // ========================================================

//   if (loading) {
//     return;
//   }

//   // ========================================================
//   // SIGNATURE VALIDATION
//   // ========================================================

//   const technicianSignatureReady =
//     isTechnicianSignSaved &&
//     Boolean(signatureTechnician) &&
//     sigTechnician.current &&
//     !sigTechnician.current.isEmpty();

//   const managerSignatureReady =
//     isManagerSignSaved &&
//     Boolean(signatureManager) &&
//     sigManager.current &&
//     !sigManager.current.isEmpty();

//   const customerSignatureReady =
//     isCustomerSignSaved &&
//     Boolean(signatureCustomer) &&
//     sigCustomer.current &&
//     !sigCustomer.current.isEmpty();

//   // --------------------------------------------------------
//   // TECHNICIAN SIGNATURE
//   // --------------------------------------------------------

//   if (!technicianSignatureReady) {
//     notification.error({
//       message: "Technician Signature Required",
//       description:
//         "Please draw the technician signature and click Save Signature before submitting the report.",
//       placement: "bottomRight",
//     });

//     return;
//   }

//   // --------------------------------------------------------
//   // MANAGER SIGNATURE
//   // --------------------------------------------------------

//   if (!managerSignatureReady) {
//     notification.error({
//       message: "Manager Signature Required",
//       description:
//         "Please draw the manager signature and click Save Signature before submitting the report.",
//       placement: "bottomRight",
//     });

//     return;
//   }

//   // --------------------------------------------------------
//   // CUSTOMER SIGNATURE
//   // --------------------------------------------------------

//   if (!customerSignatureReady) {
//     notification.error({
//       message: "Customer Signature Required",
//       description:
//         "Please draw the customer signature and click Save Signature before submitting the report.",
//       placement: "bottomRight",
//     });

//     return;
//   }

//   // ========================================================
//   // MAIN SUBMISSION
//   // ========================================================

//   try {
//     // ======================================================
//     // INTERNET CHECK
//     // ======================================================

//     if (!navigator.onLine) {
//       notification.error({
//         message: "No Internet Connection",
//         description: "Please check your internet and try again.",
//         placement: "bottomRight",
//       });

//       return;
//     }

//     // ======================================================
//     // START LOADING
//     // ======================================================

//     setLoading(true);

//     // ======================================================
//     // PARTS
//     // IMPORTANT: use the controlled Parts table state as
//     // the single source of truth for saving and PDF generation.
//     // ======================================================

//     const parts = partsFormData.map((part) => ({
//       partNo: String(part?.partNo ?? "").trim(),
//       description: String(part?.description ?? "").trim(),
//       qty: String(part?.qty ?? "").trim(),
//       usedRecommended: String(part?.usedRecommended ?? "").trim(),
//       remarks: String(part?.remarks ?? "").trim(),
//     }));

//     // Always keep all 3 default rows.
//     while (parts.length < 3) {
//       parts.push({
//         partNo: "",
//         description: "",
//         qty: "",
//         usedRecommended: "",
//         remarks: "",
//       });
//     }

//     // ========================================================
//     // PAYLOAD
//     // ========================================================

//     const payload = {
//       action: "saveReport",

//       // ======================================================
//       // CUSTOMER & VISIT
//       // ======================================================

//       customer: values.customer || "",
//       serviceDate: values.serviceDate || "",
//       siteLocation: values.siteLocation || "",
//       contactPerson: values.contactPerson || "",
//       contactNo: values.contactNo || "",

//       technician: Array.isArray(values.technician)
//         ? values.technician.join(", ")
//         : values.technician || "",

//       arrivalTime: values.arrivalTime || "",
//       completionTime: values.completionTime || "",
//       totalWorkingHours: values.totalWorkingHours ?? "",
//       serviceVisitRef: values.serviceVisitRef || "",

//       // ======================================================
//       // MACHINE
//       // ======================================================

//       machineModel: values.machineModel || "",
//       serialNo: values.serialNo || "",
//       installationYear: values.installationYear || "",
//       machineRunningHours: values.machineRunningHours ?? "",
//       softwareVersion: values.softwareVersion || "",
//       warrantyStatus: values.warrantyStatus || "",

//       // ======================================================
//       // SERVICE CATEGORY
//       // ======================================================

//       serviceCategory: JSON.stringify(values.serviceCategory || []),

//       // ======================================================
//       // COMPLAINT / DIAGNOSIS / WORK
//       // ======================================================

//       customerComplaint: values.customerComplaint || "",

//       technicianDiagnosis: values.technicianDiagnosis || "",

//       workPerformed: values.workPerformed || "",

//       // ======================================================
//       // MACHINE TRIAL
//       // ======================================================

//       machineTrialStatus: JSON.stringify(
//         values.machineTrialStatus || [],
//       ),

//       trialDuration: values.trialDuration || "",

//       cycleTime: values.cycleTime || "",

//       productMaterial: values.productMaterial || "",

//       trialStatusRemarks: values.trialStatusRemarks || "",

//       // ======================================================
//       // PARTS
//       // ======================================================

//       parts: JSON.stringify(parts),

//       // ======================================================
//       // FURTHER ACTION
//       // ======================================================

//       furtherAction: JSON.stringify(values.furtherAction || []),

//       requiredActionFollowUp:
//         values.requiredActionFollowUp || "",

//       // ======================================================
//       // COMMERCIAL
//       // ======================================================

//       serviceCommercialClassification: JSON.stringify(
//         values.serviceCommercialClassification || [],
//       ),

//       // ======================================================
//       // CUSTOMER ACKNOWLEDGEMENT
//       // ======================================================

//       technicianName: values.technicianName || "",
//       technicianDate: values.technicianDate || "",

//       managerName: values.managerName || "",
//       managerDate: values.managerDate || "",

//       customerName: values.customerName || "",
//       customerDate: values.customerDate || "",

//       // ======================================================
//       // SIGNATURES
//       // ======================================================

//       signatureTechnician: signatureTechnician || "",
//       signatureManager: signatureManager || "",
//       signatureCustomer: signatureCustomer || "",

//       // ======================================================
//       // LOGIN USER
//       // ======================================================

//       userEmail: user?.email || "",
//     };

//     // ========================================================
//     // DEBUG - CHECK SIGNATURES BEFORE SUBMISSION
//     // ========================================================

//     console.log(
//       "Technician signature saved:",
//       isTechnicianSignSaved,
//     );

//     console.log(
//       "Manager signature saved:",
//       isManagerSignSaved,
//     );

//     console.log(
//       "Customer signature saved:",
//       isCustomerSignSaved,
//     );

//     console.log(
//       "Technician signature data:",
//       signatureTechnician ? "AVAILABLE" : "EMPTY",
//     );

//     console.log(
//       "Manager signature data:",
//       signatureManager ? "AVAILABLE" : "EMPTY",
//     );

//     console.log(
//       "Customer signature data:",
//       signatureCustomer ? "AVAILABLE" : "EMPTY",
//     );

//     // ========================================================
//     // CREATE FORM DATA
//     // ========================================================

//     const formData = new URLSearchParams();

//     Object.entries(payload).forEach(([key, value]) => {
//       formData.append(
//         key,
//         value === null || value === undefined
//           ? ""
//           : String(value),
//       );
//     });

//     // ========================================================
//     // SEND TO GOOGLE APPS SCRIPT
//     // ========================================================

//     const response = await fetch(GAS_URL, {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },

//       body: formData.toString(),
//     });

//     // ========================================================
//     // SERVER RESPONSE CHECK
//     // ========================================================

//     if (!response.ok) {
//       throw new Error(`Server returned ${response.status}`);
//     }

//     const result = await response.json();

//     console.log("Backend response:", result);

//     // ========================================================
//     // BACKEND SUCCESS CHECK
//     // ========================================================

//     if (!result.success) {
//       throw new Error(
//         result.message || "Failed to save service report",
//       );
//     }

//     // ========================================================
//     // GET SAVED REPORT NUMBER
//     // ========================================================

//     const savedReportNumber =
//       result.serviceReportNumber ??
//       result.srn ??
//       "";

//     // ========================================================
//     // SUCCESS MESSAGE
//     // ========================================================

//     notification.success({
//       message: "Success",

//       description: savedReportNumber
//         ? `Service report ${savedReportNumber} saved successfully.`
//         : "Service report saved successfully.",

//       placement: "bottomRight",
//     });

//     // ========================================================
//     // GENERATE PDF AFTER SUCCESSFUL SAVE
//     // ========================================================

//     try {
//       // ======================================================
//       // GENERATE PDF
//       // ======================================================

//       // IMPORTANT:
//       // Generate the PDF BEFORE clearing the form.
//       // This ensures the submitted values and signatures
//       // are still available for the PDF.

//       const pdfValues = {
//         ...values,
//         parts,
//       };

//       const pdfResult = await generateServiceReportPDF(
//         pdfValues,
//         savedReportNumber || serviceReportNumber,
//         signatureTechnician,
//         signatureManager,
//         signatureCustomer,
//       );

//       // ======================================================
//       // UPLOAD PDF TO GOOGLE DRIVE THROUGH APPS SCRIPT
//       // ======================================================

//       const pdfFormData = new URLSearchParams();

//       pdfFormData.append(
//         "action",
//         "uploadPdf",
//       );

//       pdfFormData.append(
//         "fileName",
//         pdfResult.fileName,
//       );

//       pdfFormData.append(
//         "pdfBase64",
//         pdfResult.pdfBase64,
//       );

//       const pdfUploadResponse = await fetch(GAS_URL, {
//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded",
//         },

//         body: pdfFormData.toString(),
//       });

//       if (!pdfUploadResponse.ok) {
//         throw new Error(
//           `PDF upload server returned ${pdfUploadResponse.status}`,
//         );
//       }

//       const pdfUploadResult =
//         await pdfUploadResponse.json();

//       console.log(
//         "PDF upload response:",
//         pdfUploadResult,
//       );

//       if (!pdfUploadResult.success) {
//         throw new Error(
//           pdfUploadResult.message ||
//             "Failed to upload PDF to Google Drive",
//         );
//       }

//       // ======================================================
//       // DOWNLOAD THE SAME PDF LOCALLY
//       // ======================================================

//       pdfResult.doc.save(pdfResult.fileName);

//       console.log(
//         "PDF saved to Google Drive:",
//         pdfUploadResult.fileUrl ||
//           pdfUploadResult.fileId,
//       );

//       notification.success({
//         message: "PDF Generated & Uploaded",

//         description: `Service report PDF ${pdfResult.fileName} was saved to Google Drive successfully.`,

//         placement: "bottomRight",
//       });
//     } catch (pdfError) {
//       // ======================================================
//       // PDF ERROR
//       // ======================================================

//       console.error(
//         "PDF generation/upload error:",
//         pdfError,
//       );

//       notification.warning({
//         message: "Report Saved, But PDF Upload Failed",

//         description: `The service report was saved successfully, but the PDF step failed: ${
//           pdfError?.message || "Unknown PDF error"
//         }`,

//         placement: "bottomRight",

//         duration: 8,
//       });
//     }

//     // ========================================================
//     // RESET NEW REPORT FORM
//     // ========================================================
//     //
//     // IMPORTANT:
//     // This section runs ONLY after the backend has confirmed
//     // successful saving.
//     //
//     // The PDF has also already been generated using the
//     // original values before the form is cleared.
//     // ========================================================

//     // --------------------------------------------------------
//     // RESET ALL ANT DESIGN FORM FIELDS
//     // --------------------------------------------------------

//     form.resetFields();

//     // --------------------------------------------------------
//     // RESET SELECTED TECHNICIANS
//     // --------------------------------------------------------

//     setSelectedTechnicians([]);

//     // --------------------------------------------------------
//     // RESET CUSTOMER/AUTOFILL STATE
//     // --------------------------------------------------------

//     setAddress("");

//     setSerialNumber("");

//     // --------------------------------------------------------
//     // RESET PARTS TABLE
//     // --------------------------------------------------------

//     setPartsFormData([
//       {
//         key: 0,
//         partNo: "",
//         description: "",
//         qty: "",
//         usedRecommended: "",
//         remarks: "",
//       },
//       {
//         key: 1,
//         partNo: "",
//         description: "",
//         qty: "",
//         usedRecommended: "",
//         remarks: "",
//       },
//       {
//         key: 2,
//         partNo: "",
//         description: "",
//         qty: "",
//         usedRecommended: "",
//         remarks: "",
//       },
//     ]);

//     // --------------------------------------------------------
//     // CLEAR TECHNICIAN SIGNATURE
//     // --------------------------------------------------------

//     if (sigTechnician.current) {
//       sigTechnician.current.clear();
//     }

//     setSignatureTechnician("");

//     setIsTechnicianSignSaved(false);

//     // --------------------------------------------------------
//     // CLEAR MANAGER SIGNATURE
//     // --------------------------------------------------------

//     if (sigManager.current) {
//       sigManager.current.clear();
//     }

//     setSignatureManager("");

//     setIsManagerSignSaved(false);

//     // --------------------------------------------------------
//     // CLEAR CUSTOMER SIGNATURE
//     // --------------------------------------------------------

//     if (sigCustomer.current) {
//       sigCustomer.current.clear();
//     }

//     setSignatureCustomer("");

//     setIsCustomerSignSaved(false);

//     // ========================================================
//     // REFRESH SERVICE REPORT TABLE
//     // ========================================================

//     await fetchServiceReports();

//     // ========================================================
//     // FETCH NEXT SERVICE REPORT NUMBER
//     // ========================================================

//     try {
//       const srnResponse = await fetch(
//         `${GAS_URL}?action=getNextServiceReportNumber`,
//       );

//       if (!srnResponse.ok) {
//         throw new Error(
//           `SRN server returned ${srnResponse.status}`,
//         );
//       }

//       const srnResult = await srnResponse.json();

//       console.log(
//         "Next Service Report Number:",
//         srnResult,
//       );

//       if (!srnResult.success) {
//         throw new Error(
//           srnResult.message ||
//             "Failed to fetch next service report number",
//         );
//       }

//       const nextSRN =
//         srnResult.serviceReportNumber ??
//         srnResult.srn ??
//         "";

//       if (nextSRN !== "") {
//         setServiceReportNumber(
//           String(nextSRN),
//         );
//       }
//     } catch (srnError) {
//       console.error(
//         "Failed to fetch next SRN:",
//         srnError,
//       );

//       // Do not show the main submission as failed
//       // because the report itself was already saved.

//       notification.warning({
//         message:
//           "Report Saved, But SRN Refresh Failed",

//         description:
//           "The report was saved successfully, but the next Service Report Number could not be loaded. Please refresh the page.",

//         placement: "bottomRight",
//       });
//     }
//   } catch (error) {
//     // ========================================================
//     // ERROR
//     // ========================================================

//     console.error(
//       "Save report error:",
//       error,
//     );

//     notification.error({
//       message: "Error",

//       description:
//         error.message ||
//         "Failed to save service report.",

//       placement: "bottomRight",
//     });
//   } finally {
//     // ========================================================
//     // STOP LOADING
//     // ========================================================

//     setLoading(false);
//   }
// };

//   // ==========================================================
//   // REQUIRED FIELD RULE
//   // ==========================================================

//   const requiredRule = (fieldName) => [
//     {
//       required: true,
//       message: `Please enter ${fieldName}`,
//     },
//   ];

//   // ==========================================================
//   // DATE VALIDATION
//   // DD-MM-YYYY
//   // ==========================================================

//   const dateRule = (fieldName) => [
//     {
//       required: true,
//       message: `Please enter ${fieldName}`,
//     },
//     {
//       pattern: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
//       message: "Please enter date in DD-MM-YYYY format",
//     },
//   ];

//   // ==========================================================
//   // TIME VALIDATION
//   // HH:MM
//   // ==========================================================

//   const timeRule = (fieldName) => [
//     {
//       required: true,
//       message: `Please enter ${fieldName}`,
//     },
//     {
//       pattern: /^([01]\d|2[0-3]):([0-5]\d)$/,
//       message: "Please enter time in HH:MM (24 hr) format",
//     },
//   ];

//   const formatHHMM = (value = "") => {
//     // Remove everything except numbers
//     let digits = value.replace(/\D/g, "").slice(0, 4);

//     // Automatically add colon after HH
//     if (digits.length >= 3) {
//       return `${digits.slice(0, 2)}:${digits.slice(2)}`;
//     }

//     return digits;
//   };

//   // ==========================================================
//   // CONTACT NUMBER VALIDATION
//   // ==========================================================

//   const contactNumberRule = [
//     {
//       required: true,
//       message: "Please enter contact number",
//     },
//     {
//       pattern: /^[0-9+\-\s()]+$/,
//       message: "Please enter a valid contact number",
//     },
//   ];

//   // ==========================================================
//   // RETURN
//   // ==========================================================

//   return (
//     <div className="service-form-page">
//       {/* ====================================================== */}
//       {/* HEADER */}
//       {/* ====================================================== */}

//       <div className="service-form-header">
//         {/* ================================================== */}
//         {/* HAITIAN LOGO */}
//         {/* ================================================== */}

//         <div className="service-form-header-logo-wrap">
//           <img
//             src={HaitianLogo}
//             alt="Haitian Logo"
//             className="img-fluid service-form-header-logo"
//           />
//         </div>

//         {/* ================================================== */}
//         {/* SERVICE REPORT NUMBER */}
//         {/* EXACT CENTER OF PAGE */}
//         {/* ================================================== */}

//         <div className="service-form-header-number">
//           <p
//             style={{
//               margin: 0,
//               padding: 0,
//               color: "#0D3884",
//               fontWeight: "bold",
//               fontSize: "20px",
//               whiteSpace: "normal",
//             }}
//           >
//             Service Report No:{" "}
//             {srnLoading ? "Loading..." : serviceReportNumber || "---"}
//           </p>
//         </div>

//         {/* ================================================== */}
//         {/* USER AVATAR */}
//         {/* ================================================== */}

//         <div className="service-form-header-user">
//           <Dropdown
//             placement="bottomRight"
//             open={open}
//             onOpenChange={(flag) => setOpen(flag)}
//             trigger={["click"]}
//             dropdownRender={() => {
//               const email = user?.email || "";

//               const username = email.split("@")[0] || "User";

//               const initials =
//                 user?.name?.substring(0, 2).toUpperCase() ||
//                 email.substring(0, 2).toUpperCase() ||
//                 "US";

//               return (
//                 <div
//                   style={{
//                     minWidth: 250,
//                     borderRadius: 12,
//                     overflow: "hidden",
//                     backgroundColor: "#fff",
//                     boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//                   }}
//                 >
//                   {/* ======================================== */}
//                   {/* DROPDOWN HEADER */}
//                   {/* ======================================== */}

//                   <div
//                     style={{
//                       backgroundColor: "#0D3884",
//                       color: "#fff",
//                       display: "flex",
//                       alignItems: "center",
//                       padding: "16px",
//                     }}
//                   >
//                     <Avatar
//                       size={48}
//                       style={{
//                         backgroundColor: "transparent",
//                         border: "2px solid #fff",
//                         color: "#fff",
//                         fontWeight: "bold",
//                         marginRight: 12,
//                       }}
//                     >
//                       {initials}
//                     </Avatar>

//                     <div>
//                       <div
//                         style={{
//                           fontSize: 12,
//                           opacity: 0.9,
//                         }}
//                       >
//                         Welcome back
//                       </div>

//                       <Tooltip title={username}>
//                         <div
//                           style={{
//                             fontWeight: 600,
//                             fontSize: 16,
//                             maxWidth: 150,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {username}
//                         </div>
//                       </Tooltip>
//                     </div>
//                   </div>

//                   {/* ======================================== */}
//                   {/* DROPDOWN BODY */}
//                   {/* ======================================== */}

//                   <div
//                     style={{
//                       backgroundColor: "#fff",
//                       padding: "16px",
//                     }}
//                   >
//                     {/* EMAIL */}

//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: 16,
//                       }}
//                     >
//                       <MailOutlined
//                         style={{
//                           marginRight: 8,
//                           color: "#444",
//                         }}
//                       />

//                       <Tooltip title={email}>
//                         <span
//                           style={{
//                             fontSize: 14,
//                             maxWidth: 160,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                             display: "inline-block",
//                           }}
//                         >
//                           {email}
//                         </span>
//                       </Tooltip>
//                     </div>

//                     {/* LOGOUT BUTTON */}

//                     <Button
//                       type="primary"
//                       danger
//                       block
//                       icon={<LogoutOutlined />}
//                       onClick={() => {
//                         setOpen(false);

//                         if (onLogout) {
//                           onLogout();
//                         }
//                       }}
//                       style={{
//                         borderRadius: 8,
//                         fontWeight: 500,
//                       }}
//                     >
//                       Logout
//                     </Button>
//                   </div>
//                 </div>
//               );
//             }}
//           >
//             {/* MAIN AVATAR */}

//             <Avatar
//               size="large"
//               style={{
//                 backgroundColor: "#0D3884",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//                 userSelect: "none",
//               }}
//             >
//               {user?.name?.substring(0, 2).toUpperCase() ||
//                 user?.email?.substring(0, 2).toUpperCase() ||
//                 "US"}
//             </Avatar>
//           </Dropdown>
//         </div>
//       </div>

//       {/* ====================================================== */}
//       {/* FORM */}
//       {/* ====================================================== */}

//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         requiredMark={true}
//       >
//         {/* ==================================================== */}
//         {/* 1. CUSTOMER & VISIT INFORMATION */}
//         {/* ==================================================== */}

//         <SectionTitle title="1. CUSTOMER & VISIT INFORMATION" />

//         <div className="row">
//           {/* ================================================= */}
//           {/* CUSTOMER */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Customer"
//               name="customer"
//               rules={requiredRule("customer")}
//             >
//               <AutoComplete
//                 allowClear
//                 showSearch
//                 placeholder="Type or select customer name"
//                 onSearch={handleCustomerSearch}
//                 onChange={handleCustomerChange}
//                 onSelect={(value) => handleCustomerChange(value)}
//                 options={customerOptions.map((name) => ({
//                   label: name,
//                   value: name,
//                 }))}
//                 filterOption={(inputValue, option) =>
//                   String(option?.value || "")
//                     .toLowerCase()
//                     .includes(String(inputValue || "").toLowerCase())
//                 }
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* SERVICE DATE */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Service Date"
//               name="serviceDate"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter service date",
//                 },
//                 {
//                   pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                   message: "Enter date in DD-MM-YYYY format",
//                 },
//               ]}
//             >
//               <Input
//                 placeholder="DD-MM-YYYY"
//                 value={form.getFieldValue("serviceDate") || ""}
//                 onChange={(e) => {
//                   const formatted = formatDDMMYYYY(e.target.value);

//                   form.setFieldsValue({
//                     serviceDate: formatted,
//                   });
//                 }}
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* SITE / LOCATION */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Site / Location"
//               name="siteLocation"
//               rules={requiredRule("site / location")}
//             >
//               <Input size="large" placeholder="Enter site / location" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* CONTACT PERSON */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Contact Person"
//               name="contactPerson"
//               rules={requiredRule("contact person")}
//             >
//               <Input size="large" placeholder="Enter contact person" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* CONTACT NUMBER */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Contact No."
//               name="contactNo"
//               rules={contactNumberRule}
//             >
//               <Input size="large" placeholder="Enter contact number" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* TECHNICIAN */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Technician"
//               name="technician"
//               rules={requiredRule("technician")}
//             >
//               <Select
//                 mode="multiple"
//                 size="large"
//                 placeholder="Select up to 5 technicians"
//                 value={selectedTechnicians}
//                 onChange={handleTechChange}
//                 maxTagCount="responsive"
//                 optionFilterProp="label"
//                 style={{ width: "100%" }}
//                 options={technicianOptions.map((technician) => ({
//                   label: technician,
//                   value: technician,
//                   disabled:
//                     selectedTechnicians.length >= 5 &&
//                     !selectedTechnicians.includes(technician),
//                 }))}
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* ARRIVAL TIME */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Arrival Time"
//               name="arrivalTime"
//               rules={timeRule("arrival time")}
//             >
//               <Input
//                 size="large"
//                 placeholder="HH:MM"
//                 maxLength={5}
//                 inputMode="numeric"
//                 onChange={(e) => {
//                   const formatted = formatHHMM(e.target.value);

//                   form.setFieldsValue({
//                     arrivalTime: formatted,
//                   });
//                 }}
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* COMPLETION TIME */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Completion Time"
//               name="completionTime"
//               rules={timeRule("completion time")}
//             >
//               <Input
//                 size="large"
//                 placeholder="HH:MM"
//                 maxLength={5}
//                 inputMode="numeric"
//                 onChange={(e) => {
//                   const formatted = formatHHMM(e.target.value);

//                   form.setFieldsValue({
//                     completionTime: formatted,
//                   });
//                 }}
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* TOTAL WORKING HOURS */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Total Working Hours"
//               name="totalWorkingHours"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter total working hours",
//                 },
//               ]}
//             >
//               <Input
//                 size="large"
//                 style={{
//                   width: "100%",
//                 }}
//                 placeholder="Enter total working hours"
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* SERVICE VISIT REF */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Service Visit Ref."
//               name="serviceVisitRef"
//               rules={requiredRule("service visit reference")}
//             >
//               <Input size="large" placeholder="Enter service visit reference" />
//             </Form.Item>
//           </div>
//         </div>

//         {/* ==================================================== */}
//         {/* 2. MACHINE INFORMATION */}
//         {/* ==================================================== */}

//         <SectionTitle title="2. MACHINE INFORMATION" />

//         <div className="row">
//           {/* ================================================= */}
//           {/* MACHINE MODEL */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Machine Model"
//               name="machineModel"
//               rules={requiredRule("machine model")}
//             >
//               <Input size="large" placeholder="Enter machine model" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* SERIAL NUMBER */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Serial No."
//               name="serialNo"
//               rules={requiredRule("serial number")}
//             >
//               <Input size="large" placeholder="Enter serial number" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* INSTALLATION DATE */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Installation Year"
//               name="installationYear"
//               rules={requiredRule("installation year")}
//             >
//               <Input size="large" placeholder="Enter installation year" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* MACHINE RUNNING HOURS */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item label="Machine Running Hours" name="machineRunningHours">
//               <Input
//                 size="large"
//                 min={0}
//                 style={{
//                   width: "100%",
//                 }}
//                 placeholder="Enter machine running hours"
//               />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* CONTROLLER / SOFTWARE VERSION */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Controller"
//               name="softwareVersion"
//               rules={requiredRule("controller")}
//             >
//               <Input size="large" placeholder="Enter controller" />
//             </Form.Item>
//           </div>

//           {/* ================================================= */}
//           {/* WARRANTY STATUS */}
//           {/* ================================================= */}

//           <div className="col-md-6">
//             <Form.Item
//               label="Warranty Status"
//               name="warrantyStatus"
//               rules={requiredRule("warranty status")}
//             >
//               <Input size="large" placeholder="Enter warranty status" />
//             </Form.Item>
//           </div>
//         </div>

//         {/* ==================================================== */}
//         {/* 3. SERVICE CATEGORY */}
//         {/* ==================================================== */}

//         <SectionTitle title="3. SERVICE CATEGORY" />

//         <Form.Item
//           name="serviceCategory"
//           rules={[
//             {
//               required: true,
//               type: "array",
//               min: 1,
//               message: "Please select at least one service category",
//             },
//           ]}
//         >
//           <Checkbox.Group style={{ width: "100%" }}>
//             <div className="service-category-options">
//               <Checkbox value="installation">
//                 Installation / Commissioning
//               </Checkbox>

//               <Checkbox value="breakdown">Breakdown / Defect</Checkbox>

//               <Checkbox value="preventive">Preventive Maintenance</Checkbox>

//               <Checkbox value="corrective">Corrective Maintenance</Checkbox>

//               <Checkbox value="inspection">Inspection</Checkbox>

//               <Checkbox value="customerVisit">Customer Visit</Checkbox>

//               <Checkbox value="software">Software / Program</Checkbox>

//               <Checkbox value="other">Other</Checkbox>
//             </div>
//           </Checkbox.Group>
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 4. CUSTOMER COMPLAINT / REPORTED PROBLEM */}
//         {/* ==================================================== */}

//         <SectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

//         <Form.Item
//           name="customerComplaint"
//           rules={[
//             {
//               required: true,
//               message: "Please enter customer complaint / reported problem",
//             },
//           ]}
//         >
//           <TextArea
//             rows={3}
//             maxLength={512}
//             showCount
//             placeholder="Enter customer complaint / reported problem"
//             onChange={handleCustomerComplaintChange}
//           />
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 5. TECHNICIAN DIAGNOSIS / ROOT CAUSE */}
//         {/* ==================================================== */}

//         <SectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

//         <Form.Item
//           name="technicianDiagnosis"
//           rules={[
//             {
//               required: true,
//               message: "Please enter technician diagnosis / root cause",
//             },
//           ]}
//         >
//           <TextArea
//             rows={3}
//             maxLength={512}
//             showCount
//             placeholder="Enter technician diagnosis / root cause"
//             onChange={handleTechnicianDiagnosisChange}
//           />
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 6. WORK PERFORMED / CORRECTIVE ACTION */}
//         {/* ==================================================== */}

//         <SectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

//         <Form.Item
//           name="workPerformed"
//           rules={[
//             {
//               required: true,
//               message: "Please enter work performed / corrective action",
//             },
//           ]}
//         >
//           <TextArea
//             rows={3}
//             maxLength={512}
//             showCount
//             placeholder="Enter work performed / corrective action"
//             onChange={handleWorkPerformedChange}
//           />
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 7. MACHINE TRIAL & FINAL STATUS */}
//         {/* ==================================================== */}

//         <SectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />

//         {/* MACHINE STATUS CHECKBOXES */}

//         {/* MACHINE TRIAL STATUS */}

//         <Form.Item
//           name="machineTrialStatus"
//           rules={[
//             {
//               required: true,
//               type: "array",
//               min: 1,
//               message: "Please select machine trial status",
//             },
//           ]}
//         >
//           <Checkbox.Group style={{ width: "100%" }}>
//             <div className="machine-trial-options">
//               <Checkbox value="machineTestedSuccessfully">
//                 Machine tested successfully
//               </Checkbox>

//               <Checkbox value="machineRunningNormally">
//                 Machine running normally
//               </Checkbox>

//               <Checkbox value="runningWithObservation">
//                 Running with observation
//               </Checkbox>

//               <Checkbox value="machineStopped">
//                 Machine stopped - further action required
//               </Checkbox>

//               <Checkbox value="customerAdvised">
//                 Customer advised / awaiting action
//               </Checkbox>
//             </div>
//           </Checkbox.Group>
//         </Form.Item>

//         {/* TRIAL DURATION / CYCLE TIME */}

//         <div className="row">
//           {/* TRIAL DURATION */}
//           <div className="col-md-6">
//             <Form.Item
//               label="Trial Duration"
//               name="trialDuration"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter trial duration",
//                 },
//               ]}
//             >
//               <Input placeholder="Enter trial duration" />
//             </Form.Item>
//           </div>

//           {/* CYCLE TIME */}
//           <div className="col-md-6">
//             <Form.Item
//               label="Cycle Time"
//               name="cycleTime"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter cycle time",
//                 },
//               ]}
//             >
//               <Input placeholder="Enter cycle time" />
//             </Form.Item>
//           </div>
//         </div>

//         {/* PRODUCT / MATERIAL / FINAL REMARKS */}

//         <div className="row">
//           {/* PRODUCT / MATERIAL */}
//           <div className="col-md-12">
//             <Form.Item
//               label="Product / Material"
//               name="productMaterial"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter product / material",
//                 },
//               ]}
//             >
//               <Input
//                 maxLength={100}
//                 showCount
//                 placeholder="Enter product material"
//                 onChange={handleProductMaterialChange}
//               />{" "}
//             </Form.Item>
//           </div>
//         </div>

//         {/* TRIAL / STATUS REMARKS */}

//         <Form.Item
//           label="Trial / Status Remarks"
//           name="trialStatusRemarks"
//           rules={[
//             {
//               required: true,
//               message: "Please enter trial / status remarks",
//             },
//           ]}
//         >
//           <TextArea
//             rows={3}
//             maxLength={512}
//             showCount
//             placeholder="Enter trial / status remarks"
//             onChange={handleTrialStatusRemarksChange}
//           />{" "}
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 8. PARTS USED / RECOMMENDED */}
//         {/* ==================================================== */}

//         <SectionTitle title="8. PARTS USED / RECOMMENDED" />

//         <div className="parts-table-responsive">
//           <Table
//             bordered
//             pagination={false}
//             size="small"
//             columns={partsColumns}
//             dataSource={partsDataSource}
//             scroll={{ x: 850 }}
//           />
//         </div>

//         {/* ==================================================== */}
//         {/* 9. FURTHER ACTION REQUIRED */}
//         {/* ==================================================== */}

//         <SectionTitle title="9. FURTHER ACTION REQUIRED" />

//         <Form.Item
//           name="furtherAction"
//           rules={[
//             {
//               required: true,
//               type: "array",
//               min: 1,
//               message: "Please select at least one further action",
//             },
//           ]}
//         >
//           <Checkbox.Group style={{ width: "100%" }}>
//             <div className="further-action-options">
//               <Checkbox value="noFurtherAction">
//                 No further action required
//               </Checkbox>

//               <Checkbox value="partsRequired">Parts required</Checkbox>

//               <Checkbox value="followUpVisit">
//                 Follow-up visit required
//               </Checkbox>

//               <Checkbox value="customerAction">
//                 Customer action required
//               </Checkbox>

//               <Checkbox value="technicalSupportChina">
//                 Technical / spare support required from Haitian China
//               </Checkbox>
//             </div>
//           </Checkbox.Group>
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* REQUIRED ACTION / FOLLOW-UP */}
//         {/* ==================================================== */}

//         <Form.Item
//           label="Required Action / Follow-up"
//           name="requiredActionFollowUp"
//           rules={[
//             {
//               required: true,
//               message: "Please enter required action / follow-up",
//             },
//           ]}
//         >
//           <TextArea
//             rows={3}
//             maxLength={512}
//             showCount
//             placeholder="Enter required action / follow-up"
//             onChange={handleRequiredActionFollowUpChange}
//           />{" "}
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 10. SERVICE COMMERCIAL CLASSIFICATION */}
//         {/* ==================================================== */}

//         <SectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />

//         <Form.Item
//           name="serviceCommercialClassification"
//           rules={[
//             {
//               required: true,
//               type: "array",
//               min: 1,
//               message: "Please select at least one classification",
//             },
//           ]}
//         >
//           <Checkbox.Group style={{ width: "100%" }}>
//             <div className="commercial-classification-options">
//               <Checkbox value="focCommissioning">F.O.C. Commissioning</Checkbox>

//               <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>

//               <Checkbox value="warrantyService">Warranty Service</Checkbox>

//               <Checkbox value="chargeableMaintenance">
//                 Chargeable Maintenance
//               </Checkbox>

//               <Checkbox value="customerVisitService">
//                 Customer Visit (Service)
//               </Checkbox>

//               <Checkbox value="serviceContract">Service Contract</Checkbox>

//               <Checkbox value="goodwill">Goodwill</Checkbox>
//               <Checkbox value="chargeableCommissioning">
//                 Chargeable commissioning
//               </Checkbox>
//             </div>
//           </Checkbox.Group>
//         </Form.Item>

//         {/* ==================================================== */}
//         {/* 11. CUSTOMER ACKNOWLEDGEMENT */}
//         {/* ==================================================== */}

//         <SectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />

//         <div
//           style={{
//             fontSize: "16px",
//           }}
//         >
//           I acknowledge that the above service work has been carried out and the
//           machine status / further action has been explained to me.
//         </div>

//         <div className="row mt-2">
//           {/* ================= SERVICE TECHNICIAN ================= */}

//           <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
//             <Form.Item
//               label={
//                 <span className="signature-label">
//                   Signature of Service Technician
//                 </span>
//               }
//               required
//             >
//               {" "}
//               <Form.Item
//                 label="Name"
//                 name="technicianName"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter technician name",
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <SignatureCanvas
//                 ref={sigTechnician}
//                 penColor="black"
//                 onBegin={() => {
//                   setIsTechnicianSignSaved(false);
//                 }}
//                 canvasProps={{
//                   width: canvasSize.width,
//                   height: canvasSize.height,
//                   className: "signatureborder",
//                 }}
//               />
//               <div className="d-flex justify-content-start gap-2 mt-3">
//                 <Button
//                   className="haitianbutton"
//                   onClick={saveTechnicianSignature}
//                 >
//                   Save Signature
//                 </Button>

//                 <Button
//                   className="dangerbutton"
//                   onClick={clearTechnicianSignature}
//                 >
//                   Clear
//                 </Button>
//               </div>
//               <Form.Item
//                 label="Date"
//                 name="technicianDate"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter date",
//                   },
//                   {
//                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                     message: "Enter date in DD-MM-YYYY format",
//                   },
//                 ]}
//                 className="mt-2"
//               >
//                 <Input
//                   placeholder="DD-MM-YYYY"
//                   value={form.getFieldValue("technicianDate") || ""}
//                   onChange={(e) => {
//                     const formatted = formatDDMMYYYY(e.target.value);

//                     form.setFieldsValue({
//                       technicianDate: formatted,
//                     });
//                   }}
//                 />
//               </Form.Item>
//             </Form.Item>
//           </div>

//           {/* ================= SERVICE MANAGER ================= */}

//           <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
//             <Form.Item
//               label={
//                 <span className="signature-label">
//                   Signature of Service Manager
//                 </span>
//               }
//               required
//             >
//               {" "}
//               <Form.Item
//                 label="Name"
//                 name="managerName"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter manager name",
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <SignatureCanvas
//                 ref={sigManager}
//                 penColor="black"
//                 canvasProps={{
//                   width: canvasSize.width,
//                   height: canvasSize.height,
//                   className: "signatureborder",
//                 }}
//                 onBegin={() => {
//                   setIsManagerSignSaved(false);
//                 }}
//               />
//               <div className="d-flex justify-content-start gap-2 mt-3">
//                 <Button
//                   className="haitianbutton"
//                   onClick={saveManagerSignature}
//                 >
//                   Save Signature
//                 </Button>

//                 <Button
//                   className="dangerbutton"
//                   onClick={clearManagerSignature}
//                 >
//                   Clear
//                 </Button>
//               </div>
//               <Form.Item
//                 label="Date"
//                 name="managerDate"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter date",
//                   },
//                   {
//                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                     message: "Enter date in DD-MM-YYYY format",
//                   },
//                 ]}
//                 className="mt-2"
//               >
//                 <Input
//                   placeholder="DD-MM-YYYY"
//                   value={form.getFieldValue("managerDate") || ""}
//                   onChange={(e) => {
//                     const formatted = formatDDMMYYYY(e.target.value);

//                     form.setFieldsValue({
//                       managerDate: formatted,
//                     });
//                   }}
//                 />
//               </Form.Item>
//             </Form.Item>
//           </div>

//           {/* ================= CUSTOMER ================= */}

//           <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
//             <Form.Item
//               label={
//                 <span className="signature-label">Customer Signature</span>
//               }
//               required
//             >
//               {" "}
//               <Form.Item
//                 label="Name"
//                 name="customerName"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter customer name",
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <SignatureCanvas
//                 ref={sigCustomer}
//                 penColor="black"
//                 onBegin={() => {
//                   setIsCustomerSignSaved(false);
//                 }}
//                 canvasProps={{
//                   width: canvasSize.width,
//                   height: canvasSize.height,
//                   className: "signatureborder",
//                 }}
//               />
//               <div className="d-flex justify-content-start gap-2 mt-3">
//                 <Button
//                   className="haitianbutton"
//                   onClick={saveCustomerSignature}
//                 >
//                   Save Signature
//                 </Button>

//                 <Button
//                   className="dangerbutton"
//                   onClick={clearCustomerSignature}
//                 >
//                   Clear
//                 </Button>
//               </div>
//               <Form.Item
//                 label="Date"
//                 name="customerDate"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter date",
//                   },
//                   {
//                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                     message: "Enter date in DD-MM-YYYY format",
//                   },
//                 ]}
//                 className="mt-2"
//               >
//                 <Input
//                   placeholder="DD-MM-YYYY"
//                   value={form.getFieldValue("customerDate") || ""}
//                   onChange={(e) => {
//                     const formatted = formatDDMMYYYY(e.target.value);

//                     form.setFieldsValue({
//                       customerDate: formatted,
//                     });
//                   }}
//                 />
//               </Form.Item>
//             </Form.Item>
//           </div>
//         </div>
//         {/* ==================================================== */}
//         {/* SAVE BUTTON */}
//         {/* ==================================================== */}

//         <div className="save-report-container">
//           <Button
//             type="primary"
//             htmlType="submit"
//             className="save-report-button"
//             loading={loading}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit Report"}
//           </Button>
//         </div>
//       </Form>

//       {/* ========================================================== */}
//       {/* FETCHED SERVICE REPORTS                                   */}
//       {/* ========================================================== */}

//       <div className="fetched-service-reports-section mt-5 pt-5">
//         <div className="fetched-service-reports-card">
//           <div className="fetched-service-reports-heading">
//             <div className="fetched-service-reports-heading-main">
//               <div className="fetched-service-reports-heading-icon">
//                 <DownloadOutlined />
//               </div>

//               <div>
//                 <div className="fetched-service-reports-title">
//                   SERVICE REPORT RECORD DATA
//                 </div>
//                 <div className="fetched-service-reports-subtitle">
//                   Latest service reports are displayed first
//                 </div>
//               </div>
//             </div>

//             <div className="fetched-service-reports-count">
//               <span className="fetched-service-reports-count-label">
//                 {reportTableSearch.trim() ? "MATCHING RECORDS" : "TOTAL RECORDS"}
//               </span>
//               <strong>{filteredAndSortedReportData.length}</strong>
//             </div>
//           </div>

//           <div className="fetched-service-reports-toolbar">
//             <div className="service-report-search-wrap">
//               <SearchOutlined className="service-report-search-icon" />
//               <Input
//                 value={reportTableSearch}
//                 onChange={(event) => setReportTableSearch(event.target.value)}
//                 placeholder="Search report no., customer, technician, machine, serial no., location..."
//                 allowClear
//                 className="service-report-search-input"
//               />
//             </div>

//             <div className="service-report-toolbar-actions">
//               <div className="service-report-page-size">
//                 <span>Rows</span>
//                 <Select
//                   value={reportTablePageSize}
//                   onChange={setReportTablePageSize}
//                   options={[
//                     { value: 10, label: "10" },
//                     { value: 20, label: "20" },
//                     { value: 50, label: "50" },
//                     { value: 100, label: "100" },
//                   ]}
//                 />
//               </div>

//               <Button
//                 className="service-report-refresh-button"
//                 icon={<ReloadOutlined />}
//                 loading={reportTableLoading}
//                 onClick={fetchServiceReports}
//               >
//                 Refresh
//               </Button>

//               {reportTableSearch && (
//                 <Button
//                   className="service-report-clear-button"
//                   icon={<ClearOutlined />}
//                   onClick={() => setReportTableSearch("")}
//                 >
//                   Clear
//                 </Button>
//               )}
//             </div>
//           </div>

   

//           <div className="fetched-service-reports-table">
//             <Table
//               dataSource={filteredAndSortedReportData}
//               loading={reportTableLoading}
//               columns={reportTableColumns}
//               rowKey={(record) =>
//                 String(record["Service Report Number"] || record.rowIndex)
//               }
//               scroll={{ x: 3900 }}
//               sticky={{ offsetHeader: 0 }}
//               pagination={{
//                 pageSize: reportTablePageSize,
//                 showSizeChanger: false,
//                 showQuickJumper: true,
//                 showTotal: (total, range) =>
//                   `${range[0]}-${range[1]} of ${total} records`,
//                 position: ["bottomCenter"],
//               }}
//               size="middle"
//               bordered={false}
//               rowClassName={(_, index) =>
//                 index % 2 === 0
//                   ? "service-report-table-row-even"
//                   : "service-report-table-row-odd"
//               }
//               showSorterTooltip={{
//                 target: "sorter-icon",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       <Modal
//         className="service-report-view-modal"
//         width="calc(100vw - 24px)"
//         style={{
//           top: 10,
//           maxWidth: "1250px",
//         }}
//         open={editModalOpen}
//         onCancel={closeEditModal}
//         footer={null}
//         destroyOnHidden
//         maskClosable={!editSaveLoading}
//         closable={!editSaveLoading}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             paddingBottom: "12px",
//             borderBottom: "2px solid #0D3884",
//             marginBottom: "18px",
//           }}
//         >
//           <img
//             src={HaitianLogo}
//             alt="HaitianLogo"
//             style={{
//               maxWidth: "300px",
//               maxHeight: "70px",
//               objectFit: "contain",
//             }}
//           />
//           <h2
//             style={{
//               margin: "8px 0 0",
//               color: "#0D3884",
//               fontWeight: 700,
//             }}
//           >
//             EDIT SERVICE REPORT
//           </h2>
//           <div
//             style={{
//               marginTop: 8,
//               display: "inline-block",
//               padding: "6px 18px",
//               background: "#F1F6FA",
//               border: "1px solid #D9E2EA",
//               borderRadius: 6,
//               fontWeight: 600,
//             }}
//           >
//             Service Report Number:{" "}
//             {editForm.getFieldValue("serviceReportNumber") ||
//               editReport?.["Service Report Number"] ||
//               ""}
//           </div>
//         </div>

//         <Form
//           form={editForm}
//           layout="vertical"
//           requiredMark
//           onFinish={handleEditSave}
//         >
//           <SectionTitle title="1. CUSTOMER & VISIT INFORMATION" />
//           <div className="row">
//             <div className="col-md-6">
//               <Form.Item
//                 label="Customer"
//                 name="customer"
//                 rules={requiredRule("customer")}
//               >
//                 <AutoComplete
//                   allowClear
//                   showSearch
//                   placeholder="Type or select customer name"
//                   options={customerOptions.map((name) => ({
//                     label: name,
//                     value: name,
//                   }))}
//                   filterOption={(inputValue, option) =>
//                     String(option?.value || "")
//                       .toLowerCase()
//                       .includes(String(inputValue || "").toLowerCase())
//                   }
//                 />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Service Date"
//                 name="serviceDate"
//                 rules={[
//                   { required: true, message: "Please enter service date" },
//                   {
//                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                     message: "Enter date in DD-MM-YYYY format",
//                   },
//                 ]}
//               >
//                 <Input placeholder="DD-MM-YYYY" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Site / Location"
//                 name="siteLocation"
//                 rules={requiredRule("site / location")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Contact Person"
//                 name="contactPerson"
//                 rules={requiredRule("contact person")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Contact No."
//                 name="contactNo"
//                 rules={contactNumberRule}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Technician"
//                 name="technician"
//                 rules={requiredRule("technician")}
//               >
//                 <Select
//                   mode="multiple"
//                   size="large"
//                   maxTagCount="responsive"
//                   optionFilterProp="label"
//                   options={technicianOptions.map((technician) => ({
//                     label: technician,
//                     value: technician,
//                   }))}
//                 />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Arrival Time"
//                 name="arrivalTime"
//                 rules={timeRule("arrival time")}
//               >
//                 <Input placeholder="HH:MM" maxLength={5} />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Completion Time"
//                 name="completionTime"
//                 rules={timeRule("completion time")}
//               >
//                 <Input placeholder="HH:MM" maxLength={5} />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Total Working Hours"
//                 name="totalWorkingHours"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter total working hours",
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Service Visit Ref."
//                 name="serviceVisitRef"
//                 rules={requiredRule("service visit reference")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//           </div>

//           <SectionTitle title="2. MACHINE INFORMATION" />
//           <div className="row">
//             <div className="col-md-6">
//               <Form.Item
//                 label="Machine Model"
//                 name="machineModel"
//                 rules={requiredRule("machine model")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Serial No."
//                 name="serialNo"
//                 rules={requiredRule("serial number")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Installation Year"
//                 name="installationYear"
//                 rules={requiredRule("installation year")}
//               >
//                 <Input size="large" placeholder="Enter installation year" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Machine Running Hours"
//                 name="machineRunningHours"
//               >
//                 <Input />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Controller"
//                 name="softwareVersion"
//                 rules={requiredRule("controller")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Warranty Status"
//                 name="warrantyStatus"
//                 rules={requiredRule("warranty status")}
//               >
//                 <Input size="large" />
//               </Form.Item>
//             </div>
//           </div>

//           <SectionTitle title="3. SERVICE CATEGORY" />
//           <Form.Item
//             name="serviceCategory"
//             rules={[
//               {
//                 required: true,
//                 type: "array",
//                 min: 1,
//                 message: "Please select at least one service category",
//               },
//             ]}
//           >
//             <Checkbox.Group style={{ width: "100%" }}>
//               <div
//                 className="view-checkbox-options"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="installation">
//                   Installation / Commissioning
//                 </Checkbox>
//                 <Checkbox value="breakdown">Breakdown / Defect</Checkbox>
//                 <Checkbox value="preventive">Preventive Maintenance</Checkbox>
//                 <Checkbox value="corrective">Corrective Maintenance</Checkbox>
//                 <Checkbox value="inspection">Inspection</Checkbox>
//                 <Checkbox value="customerVisit">Customer Visit</Checkbox>
//                 <Checkbox value="software">Software / Program</Checkbox>
//                 <Checkbox value="other">Other</Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           <SectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />
//           <Form.Item
//             name="customerComplaint"
//             rules={requiredRule("customer complaint / reported problem")}
//           >
//             <TextArea
//               rows={3}
//               maxLength={512}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "customerComplaint",
//                   "Customer complaint",
//                   e,
//                 )
//               }
//             />
//           </Form.Item>

//           <SectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />
//           <Form.Item
//             name="technicianDiagnosis"
//             rules={requiredRule("technician diagnosis / root cause")}
//           >
//             <TextArea
//               rows={3}
//               maxLength={512}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "technicianDiagnosis",
//                   "Technician diagnosis",
//                   e,
//                 )
//               }
//             />
//           </Form.Item>

//           <SectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />
//           <Form.Item
//             name="workPerformed"
//             rules={requiredRule("work performed / corrective action")}
//           >
//             <TextArea
//               rows={3}
//               maxLength={512}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "workPerformed",
//                   "Work performed",
//                   e,
//                 )
//               }
//             />
//           </Form.Item>

//           <SectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />
//           <Form.Item
//             name="machineTrialStatus"
//             rules={[
//               {
//                 required: true,
//                 type: "array",
//                 min: 1,
//                 message:
//                   "Please select at least one machine trial/final status",
//               },
//             ]}
//           >
//             <Checkbox.Group style={{ width: "100%" }}>
//               <div
//                 className="view-checkbox-options"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="machineTestedSuccessfully">
//                   Machine tested successfully
//                 </Checkbox>
//                 <Checkbox value="machineRunningNormally">
//                   Machine running normally
//                 </Checkbox>
//                 <Checkbox value="runningWithObservation">
//                   Running with observation
//                 </Checkbox>
//                 <Checkbox value="machineStopped">
//                   Machine stopped - further action required
//                 </Checkbox>
//                 <Checkbox value="customerAdvised">
//                   Customer advised / awaiting action
//                 </Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           <div className="row">
//             <div className="col-md-6">
//               <Form.Item
//                 label="Trial Duration"
//                 name="trialDuration"
//                 rules={requiredRule("trial duration")}
//               >
//                 <Input />
//               </Form.Item>
//             </div>
//             <div className="col-md-6">
//               <Form.Item
//                 label="Cycle Time"
//                 name="cycleTime"
//                 rules={requiredRule("cycle time")}
//               >
//                 <Input />
//               </Form.Item>
//             </div>
//             <div className="col-md-12">
//               <Form.Item
//                 label="Product / Material"
//                 name="productMaterial"
//                 rules={requiredRule("product / material")}
//               >
//                 <Input
//                   maxLength={100}
//                   showCount
//                   onChange={handleEditProductMaterialChange}
//                 />
//               </Form.Item>
//             </div>
//           </div>
//           <Form.Item
//             name="trialStatusRemarks"
//             rules={requiredRule("trial / status remarks")}
//           >
//             <TextArea
//               rows={3}
//               maxLength={512}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "trialStatusRemarks",
//                   "Trial / Status Remarks",
//                   e,
//                 )
//               }
//             />
//           </Form.Item>

//           <SectionTitle title="8. PARTS USED / RECOMMENDED" />
//           <Table
//             bordered
//             pagination={false}
//             size="middle"
//             rowKey={(record) => record.key}
//             dataSource={editPartsData}
//             scroll={{ x: "max-content" }}
//             columns={[
//               {
//                 title: "Part No.",
//                 dataIndex: "partNo",
//                 render: (_, record) => (
//                   <Input
//                     value={record.partNo}
//                     maxLength={22}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(record.key, "partNo", e.target.value)
//                     }
//                   />
//                 ),
//               },
//               {
//                 title: "Description",
//                 dataIndex: "description",
//                 render: (_, record) => (
//                   <Input
//                     value={record.description}
//                     maxLength={25}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(record.key, "description", e.target.value)
//                     }
//                   />
//                 ),
//               },
//               {
//                 title: "Qty",
//                 dataIndex: "qty",
//                 width: 90,
//                 render: (_, record) => (
//                   <Input
//                     value={record.qty}
//                     onChange={(e) =>
//                       updateEditPart(record.key, "qty", e.target.value)
//                     }
//                   />
//                 ),
//               },
//               {
//                 title: "Used / Recommended",
//                 dataIndex: "usedRecommended",
//                 render: (_, record) => (
//                   <Input
//                     value={record.usedRecommended}
//                     maxLength={25}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(
//                         record.key,
//                         "usedRecommended",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 ),
//               },
//               {
//                 title: "Remarks",
//                 dataIndex: "remarks",
//                 render: (_, record) => (
//                   <Input
//                     value={record.remarks}
//                     maxLength={25}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(record.key, "remarks", e.target.value)
//                     }
//                   />
//                 ),
//               },
//               // {
//               //   title: "Action",
//               //   width: 100,
//               //   render: (_, record) => (
//               //     <Button danger onClick={() => removeEditPart(record.key)}>
//               //       Remove
//               //     </Button>
//               //   ),
//               // },
//             ]}
//           />
//           {/* <div style={{ marginTop: 10, marginBottom: 8 }}>
//             <Button type="dashed" onClick={addEditPart}>
//               + Add Part
//             </Button>
//           </div> */}

//           <SectionTitle title="9. FURTHER ACTION REQUIRED" />
//           <Form.Item
//             name="furtherAction"
//             rules={[
//               {
//                 required: true,
//                 type: "array",
//                 min: 1,
//                 message: "Please select at least one further action",
//               },
//             ]}
//           >
//             <Checkbox.Group style={{ width: "100%" }}>
//               <div
//                 className="view-checkbox-options"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="noFurtherAction">
//                   No further action required
//                 </Checkbox>
//                 <Checkbox value="partsRequired">Parts required</Checkbox>
//                 <Checkbox value="followUpVisit">
//                   Follow-up visit required
//                 </Checkbox>
//                 <Checkbox value="customerAction">
//                   Customer action required
//                 </Checkbox>
//                 <Checkbox value="technicalSupportChina">
//                   Technical / spare support required from Haitian China
//                 </Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>
//           <Form.Item
//             name="requiredActionFollowUp"
//             rules={requiredRule("required action / follow-up")}
//           >
//             <TextArea
//               rows={3}
//               maxLength={512}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "requiredActionFollowUp",
//                   "Required Action / Follow-up",
//                   e,
//                 )
//               }
//             />
//           </Form.Item>

//           <SectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />
//           <Form.Item
//             name="serviceCommercialClassification"
//             rules={[
//               {
//                 required: true,
//                 type: "array",
//                 min: 1,
//                 message: "Please select at least one commercial classification",
//               },
//             ]}
//           >
//             <Checkbox.Group style={{ width: "100%" }}>
//               <div
//                 className="view-checkbox-options"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="focCommissioning">
//                   F.O.C. Commissioning
//                 </Checkbox>
//                 <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>
//                 <Checkbox value="warrantyService">Warranty Service</Checkbox>
//                 <Checkbox value="chargeableMaintenance">
//                   Chargeable Maintenance
//                 </Checkbox>
//                 <Checkbox value="customerVisitService">
//                   Customer Visit (Service)
//                 </Checkbox>
//                 <Checkbox value="serviceContract">Service Contract</Checkbox>
//                 <Checkbox value="goodwill">Goodwill</Checkbox>
//                 <Checkbox value="chargeableCommissioning">
//                   Chargeable commissioning
//                 </Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           <SectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />
//           <div
//             style={{
//               background: "#F1F6FA",
//               border: "1px solid #D9E2EA",
//               borderRadius: 6,
//               padding: "14px 16px",
//               marginBottom: 20,
//               fontSize: 15,
//               lineHeight: 1.6,
//             }}
//           >
//             I acknowledge that the above service work has been carried out and
//             the machine status / further action has been explained to me.
//           </div>

//           <div className="row mt-2">
//             {/* ================= SERVICE TECHNICIAN ================= */}
//             <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
//               <Form.Item
//                 label={
//                   <span className="signature-label">
//                     Signature of Service Technician
//                   </span>
//                 }
//                 required
//               >
//                 {" "}
//                 <Form.Item
//                   label="Name"
//                   name="technicianName"
//                   rules={requiredRule("service technician name")}
//                 >
//                   <Input />
//                 </Form.Item>
//                 <SignatureCanvas
//                   ref={editSigTechnician}
//                   penColor="black"
//                   onBegin={() => {
//                     setIsEditTechnicianSignSaved(false);
//                   }}
//                   canvasProps={{
//                     width: canvasSize.width,
//                     height: canvasSize.height,
//                     className: "signatureborder",
//                   }}
//                 />
//                 <div className="d-flex justify-content-start gap-2 mt-3">
//                   <Button
//                     className="haitianbutton"
//                     onClick={() => saveEditSignature("technician")}
//                   >
//                     Save Signature
//                   </Button>
//                   <Button
//                     className="dangerbutton"
//                     onClick={() => clearEditSignature("technician")}
//                   >
//                     Clear
//                   </Button>
//                 </div>
//                 <Form.Item
//                   label="Date"
//                   name="technicianDate"
//                   rules={[
//                     { required: true, message: "Please enter date" },
//                     {
//                       pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                       message: "Enter date in DD-MM-YYYY format",
//                     },
//                   ]}
//                   className="mt-2"
//                 >
//                   <Input
//                     placeholder="DD-MM-YYYY"
//                     onChange={(e) => {
//                       editForm.setFieldsValue({
//                         technicianDate: formatDDMMYYYY(e.target.value),
//                       });
//                     }}
//                   />
//                 </Form.Item>
//               </Form.Item>
//             </div>

//             {/* ================= SERVICE MANAGER ================= */}
//             <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
//               <Form.Item
//                 label={
//                   <span className="signature-label">
//                     Signature of Service Manager
//                   </span>
//                 }
//                 required
//               >
//                 {" "}
//                 <Form.Item
//                   label="Name"
//                   name="managerName"
//                   rules={requiredRule("service manager name")}
//                 >
//                   <Input />
//                 </Form.Item>
//                 <SignatureCanvas
//                   ref={editSigManager}
//                   penColor="black"
//                   onBegin={() => {
//                     setIsEditManagerSignSaved(false);
//                   }}
//                   canvasProps={{
//                     width: canvasSize.width,
//                     height: canvasSize.height,
//                     className: "signatureborder",
//                   }}
//                 />
//                 <div className="d-flex justify-content-start gap-2 mt-3">
//                   <Button
//                     className="haitianbutton"
//                     onClick={() => saveEditSignature("manager")}
//                   >
//                     Save Signature
//                   </Button>
//                   <Button
//                     className="dangerbutton"
//                     onClick={() => clearEditSignature("manager")}
//                   >
//                     Clear
//                   </Button>
//                 </div>
//                 <Form.Item
//                   label="Date"
//                   name="managerDate"
//                   rules={[
//                     { required: true, message: "Please enter date" },
//                     {
//                       pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                       message: "Enter date in DD-MM-YYYY format",
//                     },
//                   ]}
//                   className="mt-2"
//                 >
//                   <Input
//                     placeholder="DD-MM-YYYY"
//                     onChange={(e) => {
//                       editForm.setFieldsValue({
//                         managerDate: formatDDMMYYYY(e.target.value),
//                       });
//                     }}
//                   />
//                 </Form.Item>
//               </Form.Item>
//             </div>

//             {/* ================= CUSTOMER ================= */}
//             <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
//               <Form.Item
//                 label={
//                   <span className="signature-label">Customer Signature</span>
//                 }
//                 required
//               >
//                 {" "}
//                 <Form.Item
//                   label="Name"
//                   name="customerName"
//                   rules={requiredRule("customer name")}
//                 >
//                   <Input />
//                 </Form.Item>
//                 <SignatureCanvas
//                   ref={editSigCustomer}
//                   penColor="black"
//                   onBegin={() => {
//                     setIsEditCustomerSignSaved(false);
//                   }}
//                   canvasProps={{
//                     width: canvasSize.width,
//                     height: canvasSize.height,
//                     className: "signatureborder",
//                   }}
//                 />
//                 <div className="d-flex justify-content-start gap-2 mt-3">
//                   <Button
//                     className="haitianbutton"
//                     onClick={() => saveEditSignature("customer")}
//                   >
//                     Save Signature
//                   </Button>
//                   <Button
//                     className="dangerbutton"
//                     onClick={() => clearEditSignature("customer")}
//                   >
//                     Clear
//                   </Button>
//                 </div>
//                 <Form.Item
//                   label="Date"
//                   name="customerDate"
//                   rules={[
//                     { required: true, message: "Please enter date" },
//                     {
//                       pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
//                       message: "Enter date in DD-MM-YYYY format",
//                     },
//                   ]}
//                   className="mt-2"
//                 >
//                   <Input
//                     placeholder="DD-MM-YYYY"
//                     onChange={(e) => {
//                       editForm.setFieldsValue({
//                         customerDate: formatDDMMYYYY(e.target.value),
//                       });
//                     }}
//                   />
//                 </Form.Item>
//               </Form.Item>
//             </div>
//           </div>

//           <div className="edit-form-actions">
//             <Button
//               className="edit-cancel-button"
//               size="large"
//               onClick={closeEditModal}
//               disabled={editSaveLoading}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="edit-save-button"
//               type="primary"
//               size="large"
//               loading={editSaveLoading}
//               onClick={handleEditSave}
//             >
//               {editSaveLoading
//                 ? "Updating & Generating PDF..."
//                 : "Save Changes"}
//             </Button>
//           </div>
//         </Form>
//       </Modal>

//       <Modal
//         className="service-report-view-modal"
//         width="calc(100vw - 24px)"
//         style={{
//           top: 10,
//           maxWidth: "1250px",
//         }}
//         open={viewModalOpen}
//         onCancel={() => {
//           setViewModalOpen(false);
//           setViewReport(null);
//           setViewPartsData([]);
//           viewForm.resetFields();
//         }}
//         footer={null}
//         destroyOnHidden
//       >
//         {/* ============================================================
//       HEADER
//   ============================================================ */}

//         <div
//           style={{
//             textAlign: "center",
//             paddingBottom: "12px",
//             borderBottom: "2px solid #0D3884",
//             marginBottom: "18px",
//           }}
//         >
//           <img
//             src={HaitianLogo}
//             alt="HaitianLogo"
//             style={{
//               maxWidth: "300px",
//               maxHeight: "70px",
//               objectFit: "contain",
//             }}
//           />

//           <h2
//             style={{
//               color: "#0D3884",
//               fontWeight: 700,
//               margin: "10px 0 0",
//               fontSize: "24px",
//             }}
//           >
//             VIEW SERVICE REPORT
//           </h2>

//           <div
//             style={{
//               color: "#666",
//               fontSize: "14px",
//               marginTop: "4px",
//             }}
//           >
//             Service Report Record
//           </div>
//         </div>

//         <Form form={viewForm} layout="vertical">
//           {/* ==========================================================
//         REPORT NUMBER + DOWNLOAD PDF
//     ========================================================== */}

//           <div
//             style={{
//               background: "#F1F6FA",
//               border: "1px solid #B8C8D3",
//               borderRadius: "6px",
//               padding: "12px 16px",
//               marginBottom: "18px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-end",
//                 justifyContent: "space-between",
//                 gap: "16px",
//                 flexWrap: "wrap",
//               }}
//             >
//               {/* ======================================================
//             SERVICE REPORT NUMBER
//         ====================================================== */}

//               <div
//                 style={{
//                   flex: 1,
//                   minWidth: "250px",
//                 }}
//               >
//                 <Form.Item
//                   label={
//                     <strong style={{ color: "#0D3884" }}>
//                       Service Report Number
//                     </strong>
//                   }
//                   name="serviceReportNumber"
//                   style={{
//                     marginBottom: 0,
//                   }}
//                 >
//                   <Input
//                     readOnly
//                     size="large"
//                     style={{
//                       fontWeight: 700,
//                       color: "#0D3884",
//                       background: "#FFFFFF",
//                     }}
//                   />
//                 </Form.Item>
//               </div>

//               {/* ======================================================
//             DOWNLOAD PDF
//         ====================================================== */}

//               <Button
//                 type="primary"
//                 size="large"
//                 icon={<DownloadOutlined />}
//                 loading={pdfDownloadLoading}
//                 onClick={downloadServiceReportPDF}
//                 style={{
//                   background: "#0D3884",
//                   borderColor: "#0D3884",
//                   fontWeight: 600,
//                   minHeight: "40px",
//                   flexShrink: 0,
//                 }}
//               >
//                 {pdfDownloadLoading ? "Downloading..." : "Download PDF"}
//               </Button>
//             </div>
//           </div>

//           {/* ==========================================================
//         SECTION 1
//     ========================================================== */}

//           <ViewSectionTitle title="1. CUSTOMER & VISIT INFORMATION" />

//           <div className="row">
//             <ViewField
//               label="Customer"
//               name="customer"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Service Date"
//               name="serviceDate"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Site / Location"
//               name="siteLocation"
//               span="col-md-6"
//               textarea
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Contact Person"
//               name="contactPerson"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Contact No."
//               name="contactNo"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Technician"
//               name="technician"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Arrival Time"
//               name="arrivalTime"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Completion Time"
//               name="completionTime"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Total Working Hours"
//               name="totalWorkingHours"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Service Visit Ref."
//               name="serviceVisitRef"
//               span="col-md-6"
//               viewForm={viewForm}
//             />
//           </div>

//           {/* ==========================================================
//         SECTION 2
//     ========================================================== */}

//           <ViewSectionTitle title="2. MACHINE INFORMATION" />

//           <div className="row">
//             <ViewField
//               label="Machine Model"
//               name="machineModel"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Serial No."
//               name="serialNo"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Installation Year"
//               name="installationYear"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Machine Running Hours"
//               name="machineRunningHours"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Controller"
//               name="controllerSoftwareVersion"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Warranty Status"
//               name="warrantyStatus"
//               span="col-md-6"
//               viewForm={viewForm}
//             />
//           </div>

//           {/* ==========================================================
//         SECTION 3
//     ========================================================== */}

//           <ViewSectionTitle title="3. SERVICE CATEGORY" />

//           <Form.Item
//             name="serviceCategory"
//             style={{
//               marginBottom: 20,
//             }}
//           >
//             <Checkbox.Group
//               className="view-checkbox-group"
//               style={{
//                 width: "100%",
//                 pointerEvents: "none",
//               }}
//             >
//               <div
//                 className="view-checkbox-options"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="installation">
//                   Installation / Commissioning
//                 </Checkbox>

//                 <Checkbox value="breakdown">Breakdown / Defect</Checkbox>

//                 <Checkbox value="preventive">Preventive Maintenance</Checkbox>

//                 <Checkbox value="corrective">Corrective Maintenance</Checkbox>

//                 <Checkbox value="inspection">Inspection</Checkbox>

//                 <Checkbox value="customerVisit">Customer Visit</Checkbox>

//                 <Checkbox value="software">Software / Program</Checkbox>

//                 <Checkbox value="other">Other</Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           {/* ==========================================================
//         SECTION 4
//     ========================================================== */}

//           <ViewSectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

//           <ViewLargeText name="customerComplaint" viewForm={viewForm} />

//           {/* ==========================================================
//         SECTION 5
//     ========================================================== */}

//           <ViewSectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

//           <ViewLargeText name="diagnosis" viewForm={viewForm} />

//           {/* ==========================================================
//         SECTION 6
//     ========================================================== */}

//           <ViewSectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

//           <ViewLargeText name="workPerformed" viewForm={viewForm} />

//           {/* ==========================================================
//         SECTION 7
//     ========================================================== */}

//           <ViewSectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />

//           <Form.Item
//             name="machineTrialStatus"
//             style={{
//               marginBottom: 18,
//             }}
//           >
//             <Checkbox.Group
//               className="view-checkbox-group"
//               style={{
//                 width: "100%",
//                 pointerEvents: "none",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="machineTestedSuccessfully">
//                   Machine tested successfully
//                 </Checkbox>

//                 <Checkbox value="machineRunningNormally">
//                   Machine running normally
//                 </Checkbox>

//                 <Checkbox value="runningWithObservation">
//                   Running with observation
//                 </Checkbox>

//                 <Checkbox value="machineStopped">
//                   Machine stopped - further action required
//                 </Checkbox>

//                 <Checkbox value="customerAdvised">
//                   Customer advised / awaiting action
//                 </Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           <div className="row">
//             <ViewField
//               label="Trial Duration"
//               name="trialDuration"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Cycle Time"
//               name="cycleTime"
//               span="col-md-6"
//               viewForm={viewForm}
//             />

//             <ViewField
//               label="Product / Material"
//               name="productMaterial"
//               span="col-md-12"
//               viewForm={viewForm}
//             />
//           </div>

//           <ViewLargeText name="trialStatusRemarks" viewForm={viewForm} />

//           {/* ==========================================================
//         SECTION 8
//     ========================================================== */}

//           <ViewSectionTitle title="8. PARTS USED / RECOMMENDED" />

//           <div className="view-parts-table-responsive">
//             <Table
//               bordered
//               pagination={false}
//               size="middle"
//               rowKey={(record) => record.key}
//               dataSource={viewPartsData}
//               columns={[
//                 {
//                   title: "Part No.",
//                   dataIndex: "Part No.",
//                   key: "Part No.",
//                 },

//                 {
//                   title: "Description",
//                   dataIndex: "Description",
//                   key: "Description",
//                 },

//                 {
//                   title: "Qty",
//                   dataIndex: "Qty",
//                   key: "Qty",
//                 },

//                 {
//                   title: "Used / Recommended",
//                   dataIndex: "Used / Recommended",
//                   key: "Used / Recommended",
//                 },

//                 {
//                   title: "Remarks",
//                   dataIndex: "Remarks",
//                   key: "Remarks",
//                 },
//               ]}
//               locale={{
//                 emptyText: "No parts recorded",
//               }}
//             />
//           </div>

//           {/* ==========================================================
//         SECTION 9
//     ========================================================== */}

//           <ViewSectionTitle title="9. FURTHER ACTION REQUIRED" />

//           <Form.Item
//             name="furtherAction"
//             style={{
//               marginBottom: 18,
//             }}
//           >
//             <Checkbox.Group
//               className="view-checkbox-group"
//               style={{
//                 width: "100%",
//                 pointerEvents: "none",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="noFurtherAction">
//                   No further action required
//                 </Checkbox>

//                 <Checkbox value="partsRequired">Parts required</Checkbox>

//                 <Checkbox value="followUpVisit">
//                   Follow-up visit required
//                 </Checkbox>

//                 <Checkbox value="customerAction">
//                   Customer action required
//                 </Checkbox>

//                 <Checkbox value="technicalSupportChina">
//                   Technical / spare support required from Haitian China
//                 </Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           <ViewLargeText name="requiredActionFollowUp" viewForm={viewForm} />

//           {/* ==========================================================
//         SECTION 10
//     ========================================================== */}

//           <ViewSectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />

//           <Form.Item
//             name="serviceCommercialClassification"
//             style={{
//               marginBottom: 20,
//             }}
//           >
//             <Checkbox.Group
//               className="view-checkbox-group"
//               style={{
//                 width: "100%",
//                 pointerEvents: "none",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//                   gap: "12px 20px",
//                   padding: "12px",
//                   background: "#F8FAFC",
//                   border: "1px solid #D9E2EA",
//                   borderRadius: "6px",
//                 }}
//               >
//                 <Checkbox value="focCommissioning">
//                   F.O.C. Commissioning
//                 </Checkbox>

//                 <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>

//                 <Checkbox value="warrantyService">Warranty Service</Checkbox>

//                 <Checkbox value="chargeableMaintenance">
//                   Chargeable Maintenance
//                 </Checkbox>

//                 <Checkbox value="customerVisitService">
//                   Customer Visit (Service)
//                 </Checkbox>

//                 <Checkbox value="serviceContract">Service Contract</Checkbox>

//                 <Checkbox value="goodwill">Goodwill</Checkbox>

//                 <Checkbox value="chargeableCommissioning">
//                   Chargeable commissioning
//                 </Checkbox>
//               </div>
//             </Checkbox.Group>
//           </Form.Item>

//           {/* ==========================================================
//         SECTION 11
//     ========================================================== */}

//           <ViewSectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />

//           <div
//             style={{
//               background: "#F1F6FA",
//               border: "1px solid #D9E2EA",
//               borderRadius: "6px",
//               padding: "14px 16px",
//               marginBottom: "20px",
//               fontSize: "15px",
//               lineHeight: "1.6",
//             }}
//           >
//             I acknowledge that the above service work has been carried out and
//             the machine status / further action has been explained to me.
//           </div>

//           {/* ==========================================================
//         SIGNATURES
//     ========================================================== */}

//           <div className="row">
//             {/* TECHNICIAN */}

//             <ViewSignatureCard
//               title="Service Technician"
//               name={viewForm.getFieldValue("technicianName")}
//               date={viewForm.getFieldValue("technicianDate")}
//               // signature={viewReport?.["Technician Signature"]}
//             />

//             {/* MANAGER */}

//             <ViewSignatureCard
//               title="Service Manager"
//               name={viewForm.getFieldValue("managerName")}
//               date={viewForm.getFieldValue("managerDate")}
//               // signature={viewReport?.["Manager Signature"]}
//             />

//             {/* CUSTOMER */}

//             <ViewSignatureCard
//               title="Customer"
//               name={viewForm.getFieldValue("customerName")}
//               date={viewForm.getFieldValue("customerDate")}
//               // signature={viewReport?.["Customer Signature"]}
//             />
//           </div>

//           {/* ==========================================================
//         CLOSE
//     ========================================================== */}

//           <div
//             style={{
//               textAlign: "center",
//               marginTop: "28px",
//               paddingTop: "18px",
//               borderTop: "1px solid #D9E2EA",
//             }}
//           >
//             <Button
//               size="large"
//               className="view-close-button"
//               onClick={() => {
//                 setViewModalOpen(false);
//                 setViewReport(null);
//                 setViewPartsData([]);
//                 viewForm.resetFields();
//               }}
//             >
//               Close Report
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// // ============================================================
// // SECTION TITLE
// // ============================================================

// function SectionTitle({ title }) {
//   return (
//     <div
//       style={{
//         width: "100%",
//         backgroundColor: "#0d3884",
//         color: "#FFFFFF",
//         fontSize: "16px",
//         fontWeight: 600,
//         padding: "9px 14px",
//         marginTop: "20px",
//         marginBottom: "16px",
//         borderRadius: 0,
//       }}
//     >
//       {title}
//     </div>
//   );
// }


  // import React, { useState, useRef, useEffect } from "react";

  // import {
  //   Form,
  //   Input,
  //   Button,
  //   Checkbox,
  //   InputNumber,
  //   Tooltip,
  //   Avatar,
  //   Dropdown,
  //   Table,
  //   notification,
  //   Space,
  //   AutoComplete,
  //   Select,
  //   Modal,
  // } from "antd";

  // import {
  //   MailOutlined,
  //   LogoutOutlined,
  //   EyeOutlined,
  //   EditOutlined,
  //   DownloadOutlined,
  //   SearchOutlined,
  //   ReloadOutlined,
  //   ClearOutlined,
  // } from "@ant-design/icons";

  // import "bootstrap/dist/css/bootstrap.min.css";
  // import "antd/dist/reset.css";
  // import SignatureCanvas from "react-signature-canvas";
  // import { jsPDF } from "jspdf";
  // import autoTable from "jspdf-autotable";
  // import HaitianLogo from "../Images/HaitianLogo.png";
  // import "./../App.css";

  // // ============================================================
  // // TECHNICIAN OPTIONS
  // // Same technician options used in Code 1
  // // ============================================================

  // const technicianOptions = [
  //   "Palani",
  //   "Sampath",
  //   "Karpagaraj",
  //   "Balaji",
  //   "Eswar",
  //   "Ganesh",
  //   "Sunderesh",
  // ];

  // // ============================================================
  // // GOOGLE APPS SCRIPT DEPLOYMENT
  // // This must be the deployment containing getAllCustomerData.
  // // ============================================================
  // const GAS_URL =
  //   "https://script.google.com/macros/s/AKfycbyBfzpDXdIjPjdU5_XNOTKnSONqHclSjFE3NoN1J8rvTQ43gj3eS-VPCDbf-IKRx4TS/exec";

  // // ============================================================
  // // PDF GENERATION - V2
  // // Fixed 2-page A4 layout based on the supplied Haitian reference.
  // // ============================================================

  // const PDF_BLUE = "#24567D";
  // const PDF_LIGHT_BLUE = "#DCEAF5";
  // const PDF_PALE_BLUE = "#F1F6FA";
  // const PDF_BORDER = "#B8C8D3";
  // const PDF_TEXT = "#111111";

  // const pdfSafe = (value) => {
  //   if (value === null || value === undefined) return "";
  //   if (Array.isArray(value)) return value.join(", ");
  //   return String(value);
  // };

  // // Parts-table PDF values:
  // // Keep the row visible even when the user has not entered anything.
  // const pdfPartSafe = (value) => {
  //   const text = pdfSafe(value).trim();
  //   return text || "-";
  // };

  // const pdfSelected = (selected, key) => {
  //   if (!Array.isArray(selected)) return false;
  //   return selected.includes(key);
  // };

  // const pdfHeader = (doc, reportNumber) => {
  //   const pageWidth = doc.internal.pageSize.getWidth();

  //   // ============================================================
  //   // PREVIOUS PROJECT HEADER
  //   // ============================================================

  //   const haitianLogoWidth = 52;
  //   const haitianLogoHeight = 17;

  //   doc.addImage(HaitianLogo, "PNG", 10, 1, haitianLogoWidth, haitianLogoHeight);

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(11);
  //   doc.setTextColor("#0C3C74");
  //   doc.text("Service Report", pageWidth - 60, 9);

  //   doc.setTextColor(255, 0, 0);
  //   doc.text("No.", 150, 14.5);

  //   doc.text(pdfSafe(reportNumber) || "N/A", 157, 14.5);

  //   doc.setDrawColor(12, 60, 116);
  //   doc.setLineWidth(0.5);
  //   doc.line(0, 18, pageWidth, 18);

  //   doc.setTextColor(PDF_TEXT);
  // };

  // const pdfFooter = (doc, pageNumber, totalPages) => {
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   const pageWidth = doc.internal.pageSize.getWidth();

  //   const footerY = pageHeight - 14;
  //   const centerX = pageWidth / 2;

  //   doc.setTextColor("#0C3C74");

  //   // Footer separator line
  //   const lineY = footerY - 3;
  //   doc.setDrawColor(12, 60, 116);
  //   doc.setLineWidth(0.5);
  //   doc.line(10, lineY, pageWidth - 10, lineY);

  //   // Company name
  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(13);
  //   doc.text("Haitian Middle East LLC", centerX, footerY + 1.5, {
  //     align: "center",
  //   });

  //   // Address
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.text(
  //     "Umm El Thoub, Umm Al Quwain, United Arab Emirates",
  //     centerX,
  //     footerY + 6,
  //     {
  //       align: "center",
  //     },
  //   );

  //   // Contact information
  //   doc.text(
  //     "Tel: +971 688 457 78  Mob: +971 58 555 7475  Email: ask@haitianme.com  Web: www.haitianme.com",
  //     centerX - 3,
  //     footerY + 11,
  //     {
  //       align: "center",
  //     },
  //   );

  //   // ============================================================
  //   // PAGE NUMBER - RIGHT END OF FOOTER
  //   // ============================================================

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(8);
  //   doc.setTextColor("#555555");

  //   doc.text(
  //     `Page ${pageNumber} of ${totalPages}`,
  //     pageWidth - 10,
  //     footerY + 11,
  //     {
  //       align: "right",
  //     },
  //   );

  //   doc.setTextColor(PDF_TEXT);
  // };

  // const pdfSection = (doc, title, y, margin = 13) => {
  //   const w = doc.internal.pageSize.getWidth();
  //   doc.setFillColor(PDF_BLUE);
  //   doc.rect(margin, y, w - margin * 2, 6.8, "F");

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(10);
  //   doc.setTextColor("#FFFFFF");
  //   doc.text(title, margin + 2.8, y + 4.55);

  //   return y + 8.2;
  // };

  // const pdfFieldCompact = (doc, label, value, x, y, width, height = 10.5) => {
  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);
  //   doc.text(label, x, y + 4);

  //   doc.setDrawColor("#9FB6C7");
  //   doc.setLineWidth(0.28);
  //   doc.line(x, y + height, x + width, y + height);

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   const valueText = pdfSafe(value);
  //   const lines = doc.splitTextToSize(valueText, width - 2);

  //   if (lines.length) {
  //     doc.text(lines.slice(0, 2), x, y + 7.1);
  //   }
  // };

  // const pdfFieldCompactWithMoreGap = (
  //   doc,
  //   label,
  //   value,
  //   x,
  //   y,
  //   width,
  //   height = 9.5,
  // ) => {
  //   // ------------------------------------------------------------
  //   // LABEL
  //   // ------------------------------------------------------------

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);

  //   doc.text(label, x, y + 2.4);

  //   // ------------------------------------------------------------
  //   // BOTTOM LINE
  //   // ------------------------------------------------------------

  //   doc.setDrawColor("#9FB6C7");
  //   doc.setLineWidth(0.28);

  //   doc.line(x, y + height, x + width, y + height);

  //   // ------------------------------------------------------------
  //   // VALUE
  //   // ------------------------------------------------------------

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   const valueText = pdfSafe(value);

  //   const lines = doc.splitTextToSize(valueText, width - 2);

  //   if (lines.length) {
  //     doc.text(lines.slice(0, 2), x, y + 8.2);
  //   }
  // };

  // const pdfTextArea = (doc, value, x, y, width, height) => {
  //   doc.setDrawColor(PDF_BORDER);
  //   doc.setLineWidth(0.28);
  //   doc.rect(x, y, width, height, "S");

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   const lines = doc.splitTextToSize(pdfSafe(value), width - 4);
  //   const maxLines = Math.max(1, Math.floor((height - 4) / 3.3));
  //   doc.text(lines.slice(0, maxLines), x + 2, y + 5);
  // };

  // const pdfCheckbox = (doc, x, y, isChecked, label, fontSize = 9) => {
  //   const checkboxSize = 4;

  //   // Checkbox
  //   doc.setDrawColor(PDF_BLUE);
  //   doc.setLineWidth(0.3);

  //   doc.rect(x, y, checkboxSize, checkboxSize);

  //   // Checkmark
  //   if (isChecked) {
  //     doc.setFont("Zapfdingbats", "normal");
  //     doc.setFontSize(9);
  //     doc.setTextColor(0, 0, 0);

  //     doc.text("4", x + 0.6, y + 3.5);

  //     // Always return to Helvetica
  //     doc.setFont("helvetica", "normal");
  //   }

  //   // Label
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(fontSize);
  //   doc.setTextColor(PDF_TEXT);

  //   doc.text(pdfSafe(label), x + checkboxSize + 1.5, y + 3.4);
  // };

  // const pdfSignature = (doc, x, y, width, title, name, date, signature) => {
  //   // ============================================================
  //   // TITLE
  //   // ============================================================

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);

  //   doc.text(title, x + width / 2, y, { align: "center" });

  //   // ============================================================
  //   // NAME
  //   // ============================================================

  //   doc.setFillColor(PDF_LIGHT_BLUE);
  //   doc.setDrawColor(PDF_BORDER);

  //   // Name box
  //   doc.rect(x, y + 3, width, 5, "FD");

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   doc.text(pdfSafe(name), x + 1, y + 6.5);

  //   // Name label
  //   doc.setFontSize(9);
  //   doc.setTextColor("#555555");

  //   doc.text("Name", x, y + 12);

  //   // ============================================================
  //   // DATE
  //   // ============================================================

  //   doc.setFillColor(PDF_LIGHT_BLUE);

  //   doc.rect(x, y + 16, width, 5, "FD");

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   doc.text(pdfSafe(date), x + 1, y + 19.5);

  //   // Date label
  //   doc.setFontSize(9);
  //   doc.setTextColor("#555555");

  //   doc.text("Date", x, y + 24.5);

  //   // ============================================================
  //   // SIGNATURE BOX
  //   // ============================================================

  //   doc.setFillColor("#FFFFFF");
  //   doc.setDrawColor(PDF_BORDER);

  //   const signatureBoxY = y + 28;
  //   const signatureBoxHeight = 25;

  //   doc.rect(x, signatureBoxY, width, signatureBoxHeight, "FD");

  //   // ============================================================
  //   // SIGNATURE IMAGE
  //   // Keep completely inside the signature box
  //   // ============================================================

  //   if (signature) {
  //     try {
  //       const signaturePaddingX = 1;
  //       const signaturePaddingY = 1;

  //       doc.addImage(
  //         signature,
  //         "PNG",
  //         x + signaturePaddingX,
  //         signatureBoxY + signaturePaddingY,
  //         width - signaturePaddingX * 2,
  //         signatureBoxHeight - signaturePaddingY * 2,
  //       );
  //     } catch (error) {
  //       console.warn("Unable to place signature:", error);
  //     }
  //   }

  //   // ============================================================
  //   // SIGNATURE / STAMP LABEL
  //   // ============================================================

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor("#555555");

  //   doc.text("Signature / Stamp", x, y + 56);
  // };

  // const initializeZapfDingbats = (doc) => {
  //   // Initialize ZapfDingbats once before the first real checkmark
  //   doc.setFont("Zapfdingbats", "normal");
  //   doc.setFontSize(1);
  //   doc.setTextColor(255, 255, 255);

  //   // Draw outside the visible page
  //   doc.text("4", -10, -10);

  //   // Return to Helvetica
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);
  // };

  // const generateServiceReportPDF = async (
  //   values,
  //   reportNumber,
  //   signatureTechnician,
  //   signatureManager,
  //   signatureCustomer,
  // ) => {
  //   const doc = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: "a4",
  //     compress: true,
  //   });
  //   initializeZapfDingbats(doc);
  //   // ============================================================
  //   // A4 PAGE SETUP
  //   // ============================================================

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   const margin = 10;
  //   const contentWidth = pageWidth - margin * 2;

  //   // Equal left/right columns
  //   const columnGap = 14;

  //   const columnWidth = (contentWidth - columnGap) / 2;

  //   const rightX = margin + columnWidth + columnGap;

  //   // ============================================================
  //   // PAGE 1
  //   // ============================================================

  //   pdfHeader(doc, reportNumber);

  //   // ============================================================
  //   // PAGE 1 CONTENT START
  //   // ============================================================

  //   // Keep the original starting Y position so the existing
  //   // PDF section layout remains unchanged.
  //   let y = 29;

  //   // ============================================================
  //   // PAGE 1 FIELD HELPER
  //   // ============================================================
  //   //
  //   // IMPORTANT:
  //   // Both left and right fields use exactly the same height.
  //   // This prevents the horizontal lines from becoming misaligned.
  //   //
  //   // ============================================================

  //   const pdfFieldPage1 = (doc, label, value, x, fieldY, width) => {
  //     const fieldHeight = 10.5;

  //     // ----------------------------------------------------------
  //     // LABEL
  //     // ----------------------------------------------------------

  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(9);
  //     doc.setTextColor(PDF_BLUE);

  //     doc.text(pdfSafe(label), x, fieldY + 2.7);

  //     // ----------------------------------------------------------
  //     // VALUE
  //     // ----------------------------------------------------------

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(9);
  //     doc.setTextColor(PDF_TEXT);

  //     const valueText = pdfSafe(value);

  //     const valueLines = doc.splitTextToSize(valueText, width - 2);

  //     if (valueLines.length > 0) {
  //       doc.text(valueLines[0], x, fieldY + 8);
  //     }

  //     // ----------------------------------------------------------
  //     // BOTTOM LINE
  //     // ----------------------------------------------------------
  //     //
  //     // EXACT SAME Y POSITION FOR EVERY FIELD
  //     //
  //     // ----------------------------------------------------------

  //     doc.setDrawColor("#9FB6C7");
  //     doc.setLineWidth(0.25);

  //     doc.line(x, fieldY + 9, x + width, fieldY + 9);
  //   };

  //   // ============================================================
  //   // PAGE 1 TEXT AREA HELPER
  //   // ============================================================

  //   const pdfTextAreaPage1 = (doc, value, x, textY, width, height) => {
  //     doc.setDrawColor(PDF_BORDER);
  //     doc.setLineWidth(0.28);

  //     doc.rect(x, textY, width, height, "S");

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(9);
  //     doc.setTextColor(PDF_TEXT);

  //     const lines = doc.splitTextToSize(pdfSafe(value), width - 5);

  //     const lineHeight = 3.5;

  //     const maxLines = Math.max(1, Math.floor((height - 4) / lineHeight));

  //     doc.text(lines.slice(0, maxLines), x + 2.5, textY + 5);
  //   };

  //   // ============================================================
  //   // 1. CUSTOMER & VISIT INFORMATION
  //   // ============================================================

  //   y = 21;

  //   y = pdfSection(doc, "1. CUSTOMER & VISIT INFORMATION", y, margin);

  //   // Space below section heading
  //   y += 2;

  //   const customerRows = [
  //     ["Customer", values.customer, "Service Date", values.serviceDate],

  //     [
  //       "Site / Location",
  //       values.siteLocation,
  //       "Contact Person",
  //       values.contactPerson,
  //     ],

  //     [
  //       "Contact No.",
  //       values.contactNo,
  //       "Technician",
  //       Array.isArray(values.technician)
  //         ? values.technician.join(", ")
  //         : values.technician,
  //     ],

  //     [
  //       "Arrival Time",
  //       values.arrivalTime,
  //       "Completion Time",
  //       values.completionTime,
  //     ],

  //     [
  //       "Total Working Hours",
  //       values.totalWorkingHours,
  //       "Service Visit Ref.",
  //       values.serviceVisitRef,
  //     ],
  //   ];

  //   customerRows.forEach((row) => {
  //     // LEFT FIELD
  //     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

  //     // RIGHT FIELD
  //     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

  //     // Equal row spacing
  //     y += 11.5;
  //   });

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 1 AND SECTION 2
  //   // ============================================================

  //   y += 3;

  //   // ============================================================
  //   // 2. MACHINE INFORMATION
  //   // ============================================================

  //   y = pdfSection(doc, "2. MACHINE INFORMATION", y, margin);

  //   y += 2;

  //   const machineRows = [
  //     ["Machine Model", values.machineModel, "Serial No.", values.serialNo],

  //     [
  //       "Installation year",
  //       values.installationYear,
  //       "Machine Running Hours",
  //       values.machineRunningHours,
  //     ],

  //     [
  //       "Controller",
  //       values.softwareVersion,
  //       "Warranty Status",
  //       values.warrantyStatus,
  //     ],
  //   ];

  //   machineRows.forEach((row) => {
  //     // LEFT FIELD
  //     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

  //     // RIGHT FIELD
  //     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

  //     // Equal row spacing
  //     y += 11.5;
  //   });

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 2 AND SECTION 3
  //   // ============================================================

  //   y += 3;

  //   // ============================================================
  //   // 3. SERVICE CATEGORY
  //   // ============================================================

  //   y = pdfSection(doc, "3. SERVICE CATEGORY", y, margin);

  //   y += 2;

  //   const serviceCategories = [
  //     ["installation", "Installation / Commissioning"],

  //     ["breakdown", "Breakdown / Defect"],

  //     ["preventive", "Preventive Maintenance"],

  //     ["corrective", "Corrective Maintenance"],

  //     ["inspection", "Inspection"],

  //     ["customerVisit", "Customer Visit"],

  //     ["software", "Software / Program"],

  //     ["other", "Other"],
  //   ];

  //   const serviceXs = [margin, margin + 50, margin + 90, margin + 135];

  //   serviceCategories.forEach(([key, label], index) => {
  //     const row = Math.floor(index / 4);

  //     const x = serviceXs[index % 4];

  //     pdfCheckbox(
  //       doc,
  //       x,
  //       y + row * 6.5,
  //       pdfSelected(values.serviceCategory, key),
  //       label,
  //       9,
  //     );
  //   });

  //   // Space after Section 3
  //   y += 17;

  //   // ============================================================
  //   // 4. CUSTOMER COMPLAINT
  //   // ============================================================

  //   y = pdfSection(doc, "4. CUSTOMER COMPLAINT / REPORTED PROBLEM", y, margin);

  //   y += 1.5;

  //   pdfTextAreaPage1(doc, values.customerComplaint, margin, y, contentWidth, 20);

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 4 AND SECTION 5
  //   // ============================================================

  //   y += 25;

  //   // ============================================================
  //   // 5. TECHNICIAN DIAGNOSIS
  //   // ============================================================

  //   y = pdfSection(doc, "5. TECHNICIAN DIAGNOSIS / ROOT CAUSE", y, margin);

  //   y += 1.5;

  //   pdfTextAreaPage1(
  //     doc,
  //     values.technicianDiagnosis,
  //     margin,
  //     y,
  //     contentWidth,
  //     20,
  //   );

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 5 AND SECTION 6
  //   // ============================================================

  //   y += 25;

  //   // ============================================================
  //   // 6. WORK PERFORMED
  //   // ============================================================

  //   y = pdfSection(doc, "6. WORK PERFORMED / CORRECTIVE ACTION", y, margin);

  //   y += 1.5;

  //   pdfTextAreaPage1(doc, values.workPerformed, margin, y, contentWidth, 20);

  //   // ============================================================
  //   // PAGE 2
  //   // ============================================================

  //   doc.addPage();
  //   initializeZapfDingbats(doc);

  //   pdfHeader(doc, reportNumber);

  //   y = 20;

  //   // ============================================================
  //   // 7. MACHINE TRIAL & FINAL STATUS
  //   // ============================================================

  //   y = pdfSection(doc, "7. MACHINE TRIAL & FINAL STATUS", y, margin);

  //   y += 2;

  //   const trialStatuses = [
  //     ["machineTestedSuccessfully", "Machine tested successfully"],

  //     ["machineRunningNormally", "Machine running normally"],

  //     ["runningWithObservation", "Running with observation"],

  //     ["machineStopped", "Machine stopped - further action required"],

  //     ["customerAdvised", "Customer advised / awaiting action"],
  //   ];

  //   // ============================================================
  //   // SECTION 7 OPTIONS
  //   // 2 ROWS
  //   // SAME FONT SIZE AS PAGE 1 CHECKPOINT OPTIONS
  //   // ============================================================

  //   const trialOptionPositions = [
  //     // ROW 1
  //     {
  //       x: margin,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 70,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 133,
  //       row: 0,
  //     },

  //     // ROW 2
  //     {
  //       x: margin,
  //       row: 1,
  //     },
  //     {
  //       x: margin + 70,
  //       row: 1,
  //     },
  //   ];

  //   trialStatuses.forEach(([key, label], index) => {
  //     const position = trialOptionPositions[index];

  //     pdfCheckbox(
  //       doc,
  //       position.x,
  //       y + position.row * 6,
  //       pdfSelected(values.machineTrialStatus, key),
  //       label,
  //       9,
  //     );
  //   });

  //   y += 14;

  //   pdfFieldCompactWithMoreGap(
  //     doc,
  //     "Trial Duration",
  //     values.trialDuration,
  //     margin,
  //     y,
  //     columnWidth,
  //     9.5,
  //   );

  //   pdfFieldCompactWithMoreGap(
  //     doc,
  //     "Cycle Time",
  //     values.cycleTime,
  //     rightX,
  //     y,
  //     columnWidth,
  //     9.5,
  //   );

  //   y += 12;

  //   pdfFieldCompactWithMoreGap(
  //     doc,
  //     "Product / Material",
  //     values.productMaterial,
  //     margin,
  //     y - 0.5,
  //     contentWidth,
  //     9.5,
  //   );

  //   y += 12;

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);

  //   doc.text("Trial / Status Remarks", margin, y + 2);

  //   pdfTextArea(doc, values.trialStatusRemarks, margin, y + 4, contentWidth, 12);

  //   y += 19;

  //   // ============================================================
  //   // 8. PARTS USED / RECOMMENDED
  //   // ============================================================

  //   y = pdfSection(doc, "8. PARTS USED / RECOMMENDED", y, margin);

  //   const parts = Array.isArray(values.parts) ? values.parts : [];

  //   // Always show at least 3 part rows in the PDF.
  //   // Empty cells are displayed as "-".
  //   const normalizedParts = [...parts];

  //   while (normalizedParts.length < 3) {
  //     normalizedParts.push({
  //       partNo: "",
  //       description: "",
  //       qty: "",
  //       usedRecommended: "",
  //       remarks: "",
  //     });
  //   }

  //   const partRows = normalizedParts.map((part) => [
  //     pdfPartSafe(part?.partNo),
  //     pdfPartSafe(part?.description),
  //     pdfPartSafe(part?.qty),
  //     pdfPartSafe(part?.usedRecommended),
  //     pdfPartSafe(part?.remarks),
  //   ]);

  //   autoTable(doc, {
  //     startY: y + 1,

  //     margin: {
  //       left: margin,
  //       right: margin,
  //     },

  //     tableWidth: contentWidth,

  //     head: [["Part No.", "Description", "Qty", "Used / Recommended", "Remarks"]],

  //     body: partRows,

  //     theme: "grid",

  //     styles: {
  //       font: "helvetica",
  //       fontSize: 7.5,
  //       cellPadding: 1.6,
  //       lineColor: "#B8C8D3",
  //       lineWidth: 0.25,
  //       textColor: PDF_TEXT,
  //       valign: "middle",
  //       minCellHeight: 6.5,
  //     },

  //     headStyles: {
  //       fillColor: [216, 231, 243],
  //       textColor: [31, 78, 121],
  //       fontStyle: "bold",
  //       fontSize: 9,
  //       cellPadding: 1.7,
  //     },

  //   columnStyles: {
  //       0: {
  //         cellWidth: 40,
  //       },

  //       1: {
  //         cellWidth: 47,
  //       },

  //       2: {
  //         cellWidth: 12,
  //       },

  //       3: {
  //         cellWidth: 46.5,
  //       },

  //       4: {
  //         cellWidth: 46.5,
  //       },
  //     },
  //   });

  //   y = doc.lastAutoTable.finalY + 4;

  //   // ============================================================
  //   // 9. FURTHER ACTION REQUIRED
  //   // ============================================================

  //   y = pdfSection(doc, "9. FURTHER ACTION REQUIRED", y, margin);

  //   y += 2;

  //   const furtherActions = [
  //     ["noFurtherAction", "No further action required"],

  //     ["partsRequired", "Parts required"],

  //     ["followUpVisit", "Follow-up visit required"],

  //     ["customerAction", "Customer action required"],

  //     [
  //       "technicalSupportChina",
  //       "Technical / spare support required from Haitian China",
  //     ],
  //   ];

  //   // ============================================================
  //   // SECTION 9 OPTIONS
  //   // 2 ROWS
  //   // ROW 1 = 3 OPTIONS
  //   // ROW 2 = 2 OPTIONS
  //   // ============================================================

  //   const furtherActionPositions = [
  //     // ROW 1
  //     {
  //       x: margin,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 65,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 130,
  //       row: 0,
  //     },

  //     // ROW 2
  //     {
  //       x: margin,
  //       row: 1,
  //     },
  //     {
  //       x: margin + 65,
  //       row: 1,
  //     },
  //   ];

  //   furtherActions.forEach(([key, label], index) => {
  //     const position = furtherActionPositions[index];

  //     pdfCheckbox(
  //       doc,
  //       position.x,
  //       y + position.row * 7,
  //       pdfSelected(values.furtherAction, key),
  //       label,
  //       9,
  //     );
  //   });

  //   y += 15;

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);

  //   doc.text("Required Action / Follow-up", margin, y + 2);

  //   pdfTextArea(
  //     doc,
  //     values.requiredActionFollowUp,
  //     margin,
  //     y + 4,
  //     contentWidth,
  //     12,
  //   );

  //   y += 19;

  //   // ============================================================
  //   // 10. SERVICE COMMERCIAL CLASSIFICATION
  //   // ============================================================

  //   y = pdfSection(doc, "10. SERVICE COMMERCIAL CLASSIFICATION", y, margin);

  //   y += 2;

  //   const commercial = [
  //     ["focCommissioning", "F.O.C. Commissioning"],

  //     ["focMaintenance", "F.O.C. Maintenance"],

  //     ["warrantyService", "Warranty Service"],

  //     ["chargeableMaintenance", "Chargeable Maintenance"],

  //     ["customerVisitService", "Customer Visit (Service)"],

  //     ["serviceContract", "Service Contract"],

  //     ["goodwill", "Goodwill"],

  //     ["chargeableCommissioning", "Chargeable commissioning"],
  //   ];

  //   commercial.forEach(([key, label], index) => {
  //     const row = Math.floor(index / 4);

  //     const x = margin + (index % 4) * 45;

  //     pdfCheckbox(
  //       doc,
  //       x,
  //       y + row * 7.5,
  //       pdfSelected(values.serviceCommercialClassification, key),
  //       label,
  //       9,
  //     );
  //   });

  //   y += 17;

  //   // ============================================================
  //   // 11. CUSTOMER ACKNOWLEDGEMENT
  //   // ============================================================

  //   y = pdfSection(doc, "11. CUSTOMER ACKNOWLEDGEMENT", y, margin);

  //   doc.setFillColor("#F1F6FA");

  //   doc.rect(margin, y + 1, contentWidth, 8, "F");

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   const acknowledgement =
  //     "I acknowledge that the above service work has been carried out and the machine status / further action has been explained to us.";

  //   const ackLines = doc.splitTextToSize(acknowledgement, contentWidth - 6);

  //   doc.text(ackLines.slice(0, 2), margin + 1.5, y + 6.2);

  //   y += 15;

  //   // ============================================================
  //   // SIGNATURES
  //   // ============================================================

  //   const sigGap = 6;

  //   const sigWidth = (contentWidth - sigGap * 2) / 3;

  //   // ------------------------------------------------------------
  //   // TECHNICIAN
  //   // ------------------------------------------------------------

  //   pdfSignature(
  //     doc,
  //     margin,
  //     y,
  //     sigWidth,
  //     "Service Technician",
  //     values.technicianName,
  //     values.technicianDate,
  //     signatureTechnician,
  //   );

  //   // ------------------------------------------------------------
  //   // MANAGER
  //   // ------------------------------------------------------------

  //   pdfSignature(
  //     doc,
  //     margin + sigWidth + sigGap,
  //     y,
  //     sigWidth,
  //     "Service Manager",
  //     values.managerName,
  //     values.managerDate,
  //     signatureManager,
  //   );

  //   // ------------------------------------------------------------
  //   // CUSTOMER
  //   // ------------------------------------------------------------

  //   pdfSignature(
  //     doc,
  //     margin + (sigWidth + sigGap) * 2,
  //     y,
  //     sigWidth,
  //     "Customer",
  //     values.customerName,
  //     values.customerDate,
  //     signatureCustomer,
  //   );

  //   // ============================================================
  //   // SAVE PDF
  //   // ============================================================

  //   const filenameCustomer =
  //     pdfSafe(values.customer)
  //       .trim()
  //       .replace(/[^\w\s-]+/g, "")
  //       .replace(/\s+/g, " ") || "Customer";

  //   const filenameSRN =
  //     pdfSafe(reportNumber)
  //       .trim()
  //       .replace(/[^\w-]+/g, "_") || "SRN";

  //   const fileName = `HT Service Report ${filenameCustomer} ${filenameSRN}.pdf`;

  //   // Return the PDF as a data URI so it can be uploaded to
  //   // Google Apps Script and saved in the configured Google Drive folder.
  //   // The actual browser download is still performed after the Drive
  //   // upload succeeds, preserving the existing download behavior.
  //   // ============================================================
  //   // ADD PREVIOUS PROJECT FOOTER TO EVERY PDF PAGE
  //   // ============================================================

  //   const totalPages = doc.getNumberOfPages();

  //   for (let page = 1; page <= totalPages; page += 1) {
  //     doc.setPage(page);
  //     pdfFooter(doc, page, totalPages);
  //   }

  //   const pdfBase64 = doc.output("datauristring");

  //   return {
  //     fileName,
  //     pdfBase64,
  //     doc,
  //     reportNumber: String(reportNumber || "").trim(),
  //   };
  // };

  // const generateEditServiceReportPDF = async (
  //   values,
  //   reportNumber,
  //   signatureTechnician,
  //   signatureManager,
  //   signatureCustomer,
  // ) => {
  //   const doc = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: "a4",
  //     compress: true,
  //   });
  //   initializeZapfDingbats(doc);
  //   // ============================================================
  //   // A4 PAGE SETUP
  //   // ============================================================

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();

  //   const margin = 10;
  //   const contentWidth = pageWidth - margin * 2;

  //   // Equal left/right columns
  //   const columnGap = 14;

  //   const columnWidth = (contentWidth - columnGap) / 2;

  //   const rightX = margin + columnWidth + columnGap;

  //   // ============================================================
  //   // PAGE 1
  //   // ============================================================

  //   pdfHeader(doc, reportNumber);

  //   // ============================================================
  //   // PAGE 1 CONTENT START
  //   // ============================================================

  //   // Keep the original starting Y position so the existing
  //   // PDF section layout remains unchanged.
  //   let y = 29;

  //   // ============================================================
  //   // PAGE 1 FIELD HELPER
  //   // ============================================================
  //   //
  //   // IMPORTANT:
  //   // Both left and right fields use exactly the same height.
  //   // This prevents the horizontal lines from becoming misaligned.
  //   //
  //   // ============================================================

  //   const pdfFieldPage1 = (doc, label, value, x, fieldY, width) => {
  //     const fieldHeight = 10.5;

  //     // ----------------------------------------------------------
  //     // LABEL
  //     // ----------------------------------------------------------

  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(9);
  //     doc.setTextColor(PDF_BLUE);

  //     doc.text(pdfSafe(label), x, fieldY + 2.7);

  //     // ----------------------------------------------------------
  //     // VALUE
  //     // ----------------------------------------------------------

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(9);
  //     doc.setTextColor(PDF_TEXT);

  //     const valueText = pdfSafe(value);

  //     const valueLines = doc.splitTextToSize(valueText, width - 2);

  //     if (valueLines.length > 0) {
  //       doc.text(valueLines[0], x, fieldY + 8);
  //     }

  //     // ----------------------------------------------------------
  //     // BOTTOM LINE
  //     // ----------------------------------------------------------
  //     //
  //     // EXACT SAME Y POSITION FOR EVERY FIELD
  //     //
  //     // ----------------------------------------------------------

  //     doc.setDrawColor("#9FB6C7");
  //     doc.setLineWidth(0.25);

  //     doc.line(x, fieldY + 9, x + width, fieldY + 9);
  //   };

  //   // ============================================================
  //   // PAGE 1 TEXT AREA HELPER
  //   // ============================================================

  //   const pdfTextAreaPage1 = (doc, value, x, textY, width, height) => {
  //     doc.setDrawColor(PDF_BORDER);
  //     doc.setLineWidth(0.28);

  //     doc.rect(x, textY, width, height, "S");

  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(9);
  //     doc.setTextColor(PDF_TEXT);

  //     const lines = doc.splitTextToSize(pdfSafe(value), width - 5);

  //     const lineHeight = 3.5;

  //     const maxLines = Math.max(1, Math.floor((height - 4) / lineHeight));

  //     doc.text(lines.slice(0, maxLines), x + 2.5, textY + 5);
  //   };

  //   // ============================================================
  //   // 1. CUSTOMER & VISIT INFORMATION
  //   // ============================================================

  //   y = 21;

  //   y = pdfSection(doc, "1. CUSTOMER & VISIT INFORMATION", y, margin);

  //   // Space below section heading
  //   y += 2;

  //   const customerRows = [
  //     ["Customer", values.customer, "Service Date", values.serviceDate],

  //     [
  //       "Site / Location",
  //       values.siteLocation,
  //       "Contact Person",
  //       values.contactPerson,
  //     ],

  //     [
  //       "Contact No.",
  //       values.contactNo,
  //       "Technician",
  //       Array.isArray(values.technician)
  //         ? values.technician.join(", ")
  //         : values.technician,
  //     ],

  //     [
  //       "Arrival Time",
  //       values.arrivalTime,
  //       "Completion Time",
  //       values.completionTime,
  //     ],

  //     [
  //       "Total Working Hours",
  //       values.totalWorkingHours,
  //       "Service Visit Ref.",
  //       values.serviceVisitRef,
  //     ],
  //   ];

  //   customerRows.forEach((row) => {
  //     // LEFT FIELD
  //     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

  //     // RIGHT FIELD
  //     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

  //     // Equal row spacing
  //     y += 11.5;
  //   });

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 1 AND SECTION 2
  //   // ============================================================

  //   y += 3;

  //   // ============================================================
  //   // 2. MACHINE INFORMATION
  //   // ============================================================

  //   y = pdfSection(doc, "2. MACHINE INFORMATION", y, margin);

  //   y += 2;

  //   const machineRows = [
  //     ["Machine Model", values.machineModel, "Serial No.", values.serialNo],

  //     [
  //       "Installation year",
  //       values.installationYear,
  //       "Machine Running Hours",
  //       values.machineRunningHours,
  //     ],

  //     [
  //       "Controller",
  //       values.softwareVersion,
  //       "Warranty Status",
  //       values.warrantyStatus,
  //     ],
  //   ];

  //   machineRows.forEach((row) => {
  //     // LEFT FIELD
  //     pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

  //     // RIGHT FIELD
  //     pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

  //     // Equal row spacing
  //     y += 11.5;
  //   });

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 2 AND SECTION 3
  //   // ============================================================

  //   y += 3;

  //   // ============================================================
  //   // 3. SERVICE CATEGORY
  //   // ============================================================

  //   y = pdfSection(doc, "3. SERVICE CATEGORY", y, margin);

  //   y += 2;

  //   const serviceCategories = [
  //     ["installation", "Installation / Commissioning"],

  //     ["breakdown", "Breakdown / Defect"],

  //     ["preventive", "Preventive Maintenance"],

  //     ["corrective", "Corrective Maintenance"],

  //     ["inspection", "Inspection"],

  //     ["customerVisit", "Customer Visit"],

  //     ["software", "Software / Program"],

  //     ["other", "Other"],
  //   ];

  //   const serviceXs = [margin, margin + 50, margin + 90, margin + 135];

  //   serviceCategories.forEach(([key, label], index) => {
  //     const row = Math.floor(index / 4);

  //     const x = serviceXs[index % 4];

  //     pdfCheckbox(
  //       doc,
  //       x,
  //       y + row * 6.5,
  //       pdfSelected(values.serviceCategory, key),
  //       label,
  //       9,
  //     );
  //   });

  //   // Space after Section 3
  //   y += 17;

  //   // ============================================================
  //   // 4. CUSTOMER COMPLAINT
  //   // ============================================================

  //   y = pdfSection(doc, "4. CUSTOMER COMPLAINT / REPORTED PROBLEM", y, margin);

  //   y += 1.5;

  //   pdfTextAreaPage1(doc, values.customerComplaint, margin, y, contentWidth, 20);

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 4 AND SECTION 5
  //   // ============================================================

  //   y += 25;

  //   // ============================================================
  //   // 5. TECHNICIAN DIAGNOSIS
  //   // ============================================================

  //   y = pdfSection(doc, "5. TECHNICIAN DIAGNOSIS / ROOT CAUSE", y, margin);

  //   y += 1.5;

  //   pdfTextAreaPage1(
  //     doc,
  //     values.technicianDiagnosis,
  //     margin,
  //     y,
  //     contentWidth,
  //     20,
  //   );

  //   // ============================================================
  //   // SPACE BETWEEN SECTION 5 AND SECTION 6
  //   // ============================================================

  //   y += 25;

  //   // ============================================================
  //   // 6. WORK PERFORMED
  //   // ============================================================

  //   y = pdfSection(doc, "6. WORK PERFORMED / CORRECTIVE ACTION", y, margin);

  //   y += 1.5;

  //   pdfTextAreaPage1(doc, values.workPerformed, margin, y, contentWidth, 20);

  //   // ============================================================
  //   // PAGE 2
  //   // ============================================================

  //   doc.addPage();
  //   initializeZapfDingbats(doc);

  //   pdfHeader(doc, reportNumber);

  //   y = 20;

  //   // ============================================================
  //   // 7. MACHINE TRIAL & FINAL STATUS
  //   // ============================================================

  //   y = pdfSection(doc, "7. MACHINE TRIAL & FINAL STATUS", y, margin);

  //   y += 2;

  //   const trialStatuses = [
  //     ["machineTestedSuccessfully", "Machine tested successfully"],

  //     ["machineRunningNormally", "Machine running normally"],

  //     ["runningWithObservation", "Running with observation"],

  //     ["machineStopped", "Machine stopped - further action required"],

  //     ["customerAdvised", "Customer advised / awaiting action"],
  //   ];

  //   // ============================================================
  //   // SECTION 7 OPTIONS
  //   // 2 ROWS
  //   // SAME FONT SIZE AS PAGE 1 CHECKPOINT OPTIONS
  //   // ============================================================

  //   const trialOptionPositions = [
  //     // ROW 1
  //     {
  //       x: margin,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 70,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 133,
  //       row: 0,
  //     },

  //     // ROW 2
  //     {
  //       x: margin,
  //       row: 1,
  //     },
  //     {
  //       x: margin + 70,
  //       row: 1,
  //     },
  //   ];

  //   trialStatuses.forEach(([key, label], index) => {
  //     const position = trialOptionPositions[index];

  //     pdfCheckbox(
  //       doc,
  //       position.x,
  //       y + position.row * 6,
  //       pdfSelected(values.machineTrialStatus, key),
  //       label,
  //       9,
  //     );
  //   });

  //   y += 14;

  //   pdfFieldCompactWithMoreGap(
  //     doc,
  //     "Trial Duration",
  //     values.trialDuration,
  //     margin,
  //     y,
  //     columnWidth,
  //     9.5,
  //   );

  //   pdfFieldCompactWithMoreGap(
  //     doc,
  //     "Cycle Time",
  //     values.cycleTime,
  //     rightX,
  //     y,
  //     columnWidth,
  //     9.5,
  //   );

  //   y += 12;

  //   pdfFieldCompactWithMoreGap(
  //     doc,
  //     "Product / Material",
  //     values.productMaterial,
  //     margin,
  //     y - 0.5,
  //     contentWidth,
  //     9.5,
  //   );

  //   y += 12;

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);

  //   doc.text("Trial / Status Remarks", margin, y + 2);

  //   pdfTextArea(doc, values.trialStatusRemarks, margin, y + 4, contentWidth, 12);

  //   y += 19;

  //   // ============================================================
  //   // 8. PARTS USED / RECOMMENDED
  //   // ============================================================

  //   y = pdfSection(doc, "8. PARTS USED / RECOMMENDED", y, margin);

  //   const parts = Array.isArray(values.parts) ? values.parts : [];

  //   // Always show at least 3 part rows in the PDF.
  //   // Empty cells are displayed as "-".
  //   const normalizedParts = [...parts];

  //   while (normalizedParts.length < 3) {
  //     normalizedParts.push({
  //       partNo: "",
  //       description: "",
  //       qty: "",
  //       usedRecommended: "",
  //       remarks: "",
  //     });
  //   }

  //   const partRows = normalizedParts.map((part) => [
  //     pdfPartSafe(part?.partNo),
  //     pdfPartSafe(part?.description),
  //     pdfPartSafe(part?.qty),
  //     pdfPartSafe(part?.usedRecommended),
  //     pdfPartSafe(part?.remarks),
  //   ]);

  //   autoTable(doc, {
  //     startY: y + 1,

  //     margin: {
  //       left: margin,
  //       right: margin,
  //     },

  //     tableWidth: contentWidth,

  //     head: [["Part No.", "Description", "Qty", "Used / Recommended", "Remarks"]],

  //     body: partRows,

  //     theme: "grid",

  //     styles: {
  //       font: "helvetica",
  //       fontSize: 7.5,
  //       cellPadding: 1.6,
  //       lineColor: "#B8C8D3",
  //       lineWidth: 0.25,
  //       textColor: PDF_TEXT,
  //       valign: "middle",
  //       minCellHeight: 6.5,
  //     },

  //     headStyles: {
  //       fillColor: [216, 231, 243],
  //       textColor: [31, 78, 121],
  //       fontStyle: "bold",
  //       fontSize: 9,
  //       cellPadding: 1.7,
  //     },

  //   columnStyles: {
  //       0: {
  //         cellWidth: 40,
  //       },

  //       1: {
  //         cellWidth: 47,
  //       },

  //       2: {
  //         cellWidth: 12,
  //       },

  //       3: {
  //         cellWidth: 46.5,
  //       },

  //       4: {
  //         cellWidth: 46.5,
  //       },
  //     },
  //   });

  //   y = doc.lastAutoTable.finalY + 4;

  //   // ============================================================
  //   // 9. FURTHER ACTION REQUIRED
  //   // ============================================================

  //   y = pdfSection(doc, "9. FURTHER ACTION REQUIRED", y, margin);

  //   y += 2;

  //   const furtherActions = [
  //     ["noFurtherAction", "No further action required"],

  //     ["partsRequired", "Parts required"],

  //     ["followUpVisit", "Follow-up visit required"],

  //     ["customerAction", "Customer action required"],

  //     [
  //       "technicalSupportChina",
  //       "Technical / spare support required from Haitian China",
  //     ],
  //   ];

  //   // ============================================================
  //   // SECTION 9 OPTIONS
  //   // 2 ROWS
  //   // ROW 1 = 3 OPTIONS
  //   // ROW 2 = 2 OPTIONS
  //   // ============================================================

  //   const furtherActionPositions = [
  //     // ROW 1
  //     {
  //       x: margin,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 65,
  //       row: 0,
  //     },
  //     {
  //       x: margin + 130,
  //       row: 0,
  //     },

  //     // ROW 2
  //     {
  //       x: margin,
  //       row: 1,
  //     },
  //     {
  //       x: margin + 65,
  //       row: 1,
  //     },
  //   ];

  //   furtherActions.forEach(([key, label], index) => {
  //     const position = furtherActionPositions[index];

  //     pdfCheckbox(
  //       doc,
  //       position.x,
  //       y + position.row * 7,
  //       pdfSelected(values.furtherAction, key),
  //       label,
  //       9,
  //     );
  //   });

  //   y += 15;

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_BLUE);

  //   doc.text("Required Action / Follow-up", margin, y + 2);

  //   pdfTextArea(
  //     doc,
  //     values.requiredActionFollowUp,
  //     margin,
  //     y + 4,
  //     contentWidth,
  //     12,
  //   );

  //   y += 19;

  //   // ============================================================
  //   // 10. SERVICE COMMERCIAL CLASSIFICATION
  //   // ============================================================

  //   y = pdfSection(doc, "10. SERVICE COMMERCIAL CLASSIFICATION", y, margin);

  //   y += 2;

  //   const commercial = [
  //     ["focCommissioning", "F.O.C. Commissioning"],

  //     ["focMaintenance", "F.O.C. Maintenance"],

  //     ["warrantyService", "Warranty Service"],

  //     ["chargeableMaintenance", "Chargeable Maintenance"],

  //     ["customerVisitService", "Customer Visit (Service)"],

  //     ["serviceContract", "Service Contract"],

  //     ["goodwill", "Goodwill"],

  //     ["chargeableCommissioning", "Chargeable commissioning"],
  //   ];

  //   commercial.forEach(([key, label], index) => {
  //     const row = Math.floor(index / 4);

  //     const x = margin + (index % 4) * 45;

  //     pdfCheckbox(
  //       doc,
  //       x,
  //       y + row * 7.5,
  //       pdfSelected(values.serviceCommercialClassification, key),
  //       label,
  //       9,
  //     );
  //   });

  //   y += 17;

  //   // ============================================================
  //   // 11. CUSTOMER ACKNOWLEDGEMENT
  //   // ============================================================

  //   y = pdfSection(doc, "11. CUSTOMER ACKNOWLEDGEMENT", y, margin);

  //   doc.setFillColor("#F1F6FA");

  //   doc.rect(margin, y + 1, contentWidth, 8, "F");

  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);
  //   doc.setTextColor(PDF_TEXT);

  //   const acknowledgement =
  //     "I acknowledge that the above service work has been carried out and the machine status / further action has been explained to us.";

  //   const ackLines = doc.splitTextToSize(acknowledgement, contentWidth - 6);

  //   doc.text(ackLines.slice(0, 2), margin + 1.5, y + 6.2);

  //   y += 15;

  //   // ============================================================
  //   // SIGNATURES
  //   // ============================================================

  //   const sigGap = 6;

  //   const sigWidth = (contentWidth - sigGap * 2) / 3;

  //   // ------------------------------------------------------------
  //   // TECHNICIAN
  //   // ------------------------------------------------------------

  //   pdfSignature(
  //     doc,
  //     margin,
  //     y,
  //     sigWidth,
  //     "Service Technician",
  //     values.technicianName,
  //     values.technicianDate,
  //     signatureTechnician,
  //   );

  //   // ------------------------------------------------------------
  //   // MANAGER
  //   // ------------------------------------------------------------

  //   pdfSignature(
  //     doc,
  //     margin + sigWidth + sigGap,
  //     y,
  //     sigWidth,
  //     "Service Manager",
  //     values.managerName,
  //     values.managerDate,
  //     signatureManager,
  //   );

  //   // ------------------------------------------------------------
  //   // CUSTOMER
  //   // ------------------------------------------------------------

  //   pdfSignature(
  //     doc,
  //     margin + (sigWidth + sigGap) * 2,
  //     y,
  //     sigWidth,
  //     "Customer",
  //     values.customerName,
  //     values.customerDate,
  //     signatureCustomer,
  //   );

  //   // ============================================================
  //   // SAVE PDF
  //   // ============================================================

  //   const filenameCustomer =
  //     pdfSafe(values.customer)
  //       .trim()
  //       .replace(/[^\w\s-]+/g, "")
  //       .replace(/\s+/g, " ") || "Customer";

  //   const filenameSRN =
  //     pdfSafe(reportNumber)
  //       .trim()
  //       .replace(/[^\w-]+/g, "_") || "SRN";

  //   const fileName = `HT Service Report ${filenameCustomer} ${filenameSRN}.pdf`;

  //   // Return the PDF as a data URI so it can be uploaded to
  //   // Google Apps Script and saved in the configured Google Drive folder.
  //   // The actual browser download is still performed after the Drive
  //   // upload succeeds, preserving the existing download behavior.
  //   // ============================================================
  //   // ADD PREVIOUS PROJECT FOOTER TO EVERY PDF PAGE
  //   // ============================================================

  //   const totalPages = doc.getNumberOfPages();

  //   for (let page = 1; page <= totalPages; page += 1) {
  //     doc.setPage(page);
  //     pdfFooter(doc, page, totalPages);
  //   }

  //   const pdfBase64 = doc.output("datauristring");

  //   return {
  //     fileName,
  //     pdfBase64,
  //     doc,
  //     reportNumber: String(reportNumber || "").trim(),
  //   };
  // };

  // const ViewSectionTitle = ({ title }) => (
  //   <div
  //     style={{
  //       background: "#0D3884",
  //       color: "#FFFFFF",
  //       fontWeight: 700,
  //       fontSize: "15px",
  //       padding: "9px 14px",
  //       borderRadius: "5px",
  //       margin: "22px 0 14px",
  //       letterSpacing: "0.2px",
  //     }}
  //   >
  //     {title}
  //   </div>
  // );

  // const ViewField = ({
  //   label,
  //   name,
  //   span = "col-md-6",
  //   viewForm,
  //   textarea = false,
  // }) => (
  //   <div className={span}>
  //     <Form.Item
  //       label={
  //         <span
  //           style={{
  //             fontWeight: 600,
  //             color: "#0D3884",
  //           }}
  //         >
  //           {label}
  //         </span>
  //       }
  //       name={name}
  //     >
  //       {textarea ? (
  //         <Input.TextArea
  //           readOnly
  //           autoSize={{
  //             minRows: 2,
  //             maxRows: 4,
  //           }}
  //           style={{
  //             background: "#FAFAFA",
  //             color: "#222",
  //             borderColor: "#D9E2EA",
  //           }}
  //         />
  //       ) : (
  //         <Input
  //           readOnly
  //           size="large"
  //           style={{
  //             background: "#FAFAFA",
  //             color: "#222",
  //             borderColor: "#D9E2EA",
  //           }}
  //         />
  //       )}
  //     </Form.Item>
  //   </div>
  // );

  // const ViewLargeText = ({ name, viewForm }) => (
  //   <Form.Item name={name}>
  //     <Input.TextArea
  //       readOnly
  //       autoSize={{
  //         minRows: 4,
  //         maxRows: 8,
  //       }}
  //       style={{
  //         background: "#FAFAFA",
  //         color: "#222",
  //         borderColor: "#D9E2EA",
  //         lineHeight: 1.6,
  //       }}
  //     />
  //   </Form.Item>
  // );

  // const ViewSignatureCard = ({ title, name, date, signature }) => (
  //   <div className="col-12 col-md-6 col-xl-4 mb-4">
  //     <div
  //       style={{
  //         border: "1px solid #B8C8D3",
  //         borderRadius: "7px",
  //         overflow: "hidden",
  //         height: "100%",
  //         background: "#FFFFFF",
  //       }}
  //     >
  //       <div
  //         style={{
  //           background: "#F1F6FA",
  //           color: "#0D3884",
  //           fontWeight: 700,
  //           padding: "9px 12px",
  //           borderBottom: "1px solid #B8C8D3",
  //           textAlign: "center",
  //         }}
  //       >
  //         {title}
  //       </div>

  //       <div style={{ padding: "12px" }}>
  //         <div
  //           style={{
  //             fontSize: "12px",
  //             color: "#666",
  //             marginBottom: "3px",
  //           }}
  //         >
  //           Name
  //         </div>

  //         <div
  //           style={{
  //             borderBottom: "1px solid #D9E2EA",
  //             paddingBottom: "6px",
  //             marginBottom: "12px",
  //             minHeight: "28px",
  //           }}
  //         >
  //           {name || "-"}
  //         </div>

  //         <div
  //           style={{
  //             fontSize: "12px",
  //             color: "#666",
  //             marginBottom: "3px",
  //           }}
  //         >
  //           Date
  //         </div>

  //         <div
  //           style={{
  //             borderBottom: "1px solid #D9E2EA",
  //             paddingBottom: "6px",
  //             marginBottom: "12px",
  //             minHeight: "28px",
  //           }}
  //         >
  //           {date || "-"}
  //         </div>

  //         {/* <div
  //           style={{
  //             fontSize: "12px",
  //             color: "#666",
  //             marginBottom: "5px",
  //           }}
  //         >
  //           Signature / Stamp
  //         </div>

  //         <div
  //           style={{
  //             height: "130px",
  //             border: "1px solid #D9E2EA",
  //             borderRadius: "4px",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             background: "#FFFFFF",
  //           }}
  //         >
  //           {signature ? (
  //             <img
  //               src={signature}
  //               alt={`${title} signature`}
  //               style={{
  //                 maxWidth: "95%",
  //                 maxHeight: "120px",
  //                 objectFit: "contain",
  //               }}
  //             />
  //           ) : (
  //             <span
  //               style={{
  //                 color: "#999",
  //                 fontSize: "13px",
  //               }}
  //             >
  //               No signature available
  //             </span>
  //           )}
  //         </div> */}
  //       </div>
  //     </div>
  //   </div>
  // );

  // // ============================================================
  // // SERVICE FORM
  // // ============================================================

  // export default function ServiceForm({ onLogout, user }) {
  //   const [form] = Form.useForm();
  //   const [viewForm] = Form.useForm();
  //   const [editForm] = Form.useForm();
  //   const [open, setOpen] = useState(false);
  //   const { TextArea } = Input;
  //   const [canvasSize, setCanvasSize] = useState({
  //     width: 0,
  //     height: 0,
  //   });

  //   const [signatureTechnician, setSignatureTechnician] = useState("");
  //   const [signatureManager, setSignatureManager] = useState("");
  //   const [signatureCustomer, setSignatureCustomer] = useState("");
  //   const [loading, setLoading] = useState(false);
  //   const [serviceReportNumber, setServiceReportNumber] = useState("");
  //   const [srnLoading, setSrnLoading] = useState(true);
  //   const [customerOptions, setCustomerOptions] = useState([]);
  //   const [customerDataList, setCustomerDataList] = useState([]);
  //   const [address, setAddress] = useState("");
  //   const [serialNumber, setSerialNumber] = useState("");
  //   const [selectedTechnicians, setSelectedTechnicians] = useState([]);

  //   // ============================================================
  //   // NEW SERVICE REPORT - PARTS TABLE STATE
  //   // Keep the Parts table values in explicit React state.
  //   // This prevents Ant Design Table/Form rendering from losing or
  //   // shifting the entered Part No., Description, Used/Recommended,
  //   // and Remarks values before the PDF is generated.
  //   // ============================================================
  //   const [partsFormData, setPartsFormData] = useState([
  //     {
  //       key: 0,
  //       partNo: "",
  //       description: "",
  //       qty: "",
  //       usedRecommended: "",
  //       remarks: "",
  //     },
  //     {
  //       key: 1,
  //       partNo: "",
  //       description: "",
  //       qty: "",
  //       usedRecommended: "",
  //       remarks: "",
  //     },
  //     {
  //       key: 2,
  //       partNo: "",
  //       description: "",
  //       qty: "",
  //       usedRecommended: "",
  //       remarks: "",
  //     },
  //   ]);

  //   const updatePartsFormData = (rowIndex, field, value) => {
  //     let limitedValue = value;

  //     if (field === "partNo") {
  //       limitedValue = value.slice(0, 25);
  //     } else if (
  //       field === "description"
  //     ) {
  //       limitedValue = value.slice(0, 25);
  //     } else if (field === "usedRecommended" || field === "remarks") {
  //       limitedValue = value.slice(0, 25);
  //     }

  //     setPartsFormData((previous) =>
  //       previous.map((row, index) =>
  //         index === rowIndex
  //           ? {
  //               ...row,
  //               [field]: limitedValue,
  //             }
  //           : row,
  //       ),
  //     );
  //   };

  //   const [isTechnicianSignSaved, setIsTechnicianSignSaved] = useState(false);
  //   const [isManagerSignSaved, setIsManagerSignSaved] = useState(false);
  //   const [isCustomerSignSaved, setIsCustomerSignSaved] = useState(false);

  //   const [reportData, setReportData] = useState([]);
  //   const [reportTableLoading, setReportTableLoading] = useState(false);

  //   // ============================================================
  //   // SERVICE REPORT TABLE UI STATE
  //   // ============================================================
  //   const [reportTableSearch, setReportTableSearch] = useState("");
  //   const [reportTablePageSize, setReportTablePageSize] = useState(10);
  //   const [viewReport, setViewReport] = useState(null);
  //   const [editReport, setEditReport] = useState(null);
  //   const [viewPartsData, setViewPartsData] = useState([]);
  //   const [viewModalOpen, setViewModalOpen] = useState(false);
  //   const [editModalOpen, setEditModalOpen] = useState(false);
  //   const [pdfDownloadLoading, setPdfDownloadLoading] = useState(false);
  //   const [editPartsData, setEditPartsData] = useState([]);
  //   const [editSaveLoading, setEditSaveLoading] = useState(false);
  //   const [editSignatureTechnician, setEditSignatureTechnician] = useState("");
  //   const [editSignatureManager, setEditSignatureManager] = useState("");
  //   const [editSignatureCustomer, setEditSignatureCustomer] = useState("");
  //   const [isEditTechnicianSignSaved, setIsEditTechnicianSignSaved] =
  //     useState(false);
  //   const [isEditManagerSignSaved, setIsEditManagerSignSaved] = useState(false);
  //   const [isEditCustomerSignSaved, setIsEditCustomerSignSaved] = useState(false);

  //   const sigTechnician = useRef();
  //   const sigManager = useRef();
  //   const sigCustomer = useRef();
  //   const editSigTechnician = useRef();
  //   const editSigManager = useRef();
  //   const editSigCustomer = useRef();

  //   const updateCanvasSize = () => {
  //     setCanvasSize({ width: window.innerWidth < 768 ? 300 : 400, height: 200 });
  //   };

  //   const fetchServiceReports = async () => {
  //     setReportTableLoading(true);

  //     try {
  //       const response = await fetch(
  //         `${GAS_URL}?action=getServiceReports&_=${Date.now()}`,
  //         {
  //           cache: "no-store",
  //         },
  //       );

  //       if (!response.ok) {
  //         throw new Error(`Server returned ${response.status}`);
  //       }

  //       const result = await response.json();

  //       if (!result.success) {
  //         throw new Error(result.message || "Failed to fetch service reports");
  //       }

  //       setReportData(Array.isArray(result.reports) ? result.reports : []);
  //     } catch (error) {
  //       console.error("Failed to fetch service reports:", error);

  //       notification.error({
  //         message: "Error",
  //         description: error.message || "Failed to load service reports.",
  //         placement: "bottomRight",
  //       });

  //       setReportData([]);
  //     } finally {
  //       setReportTableLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchServiceReports();
  //   }, []);

  //   const downloadServiceReportPDFByNumber = async (
  //     reportNumber,
  //     fileName = "",
  //   ) => {
  //     const normalizedReportNumber = String(reportNumber || "").trim();

  //     if (!normalizedReportNumber) {
  //       throw new Error("Service Report Number is missing.");
  //     }

  //     const formData = new URLSearchParams();
  //     formData.append("action", "downloadPdf");
  //     formData.append("serviceReportNumber", normalizedReportNumber);

  //     // If the caller already knows the exact PDF filename, send it.
  //     // This is used by the edit flow and prevents filename mismatches.
  //     const normalizedFileName = String(fileName || "").trim();

  //     if (normalizedFileName) {
  //       formData.append("fileName", normalizedFileName);
  //     }

  //     const response = await fetch(GAS_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: formData.toString(),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`PDF server returned ${response.status}`);
  //     }

  //     const result = await response.json();

  //     if (!result.success || !result.pdfBase64) {
  //       throw new Error(
  //         result.message ||
  //           `PDF not found for Service Report ${normalizedReportNumber}`,
  //       );
  //     }

  //     const binaryString = window.atob(result.pdfBase64);
  //     const bytes = new Uint8Array(binaryString.length);

  //     for (let i = 0; i < binaryString.length; i += 1) {
  //       bytes[i] = binaryString.charCodeAt(i);
  //     }

  //     const blob = new Blob([bytes], {
  //       type: result.mimeType || "application/pdf",
  //     });

  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");

  //     link.href = downloadUrl;
  //     link.download =
  //       result.fileName || `Haitian_Service_Report_${normalizedReportNumber}.pdf`;

  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();

  //     // Give the browser a moment to start the download before releasing
  //     // the object URL. This is more reliable on Chrome/Edge.
  //     window.setTimeout(() => {
  //       window.URL.revokeObjectURL(downloadUrl);
  //     }, 1000);

  //     return result;
  //   };

  //   const downloadServiceReportPDF = async () => {
  //     const reportNumber = String(
  //       viewReport?.["Service Report Number"] || "",
  //     ).trim();

  //     if (!reportNumber) {
  //       notification.error({
  //         message: "Download Failed",
  //         description: "Service Report Number is missing.",
  //         placement: "bottomRight",
  //       });
  //       return;
  //     }

  //     setPdfDownloadLoading(true);

  //     try {
  //       await downloadServiceReportPDFByNumber(reportNumber);

  //       notification.success({
  //         message: "PDF Downloaded",
  //         description: `Service Report ${reportNumber} PDF downloaded successfully.`,
  //         placement: "bottomRight",
  //       });
  //     } catch (error) {
  //       console.error("Service report PDF download error:", error);

  //       notification.error({
  //         message: "PDF Download Failed",
  //         description:
  //           error?.message ||
  //           `Unable to download PDF for Service Report ${reportNumber}.`,
  //         placement: "bottomRight",
  //       });
  //     } finally {
  //       setPdfDownloadLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (!viewReport || !viewModalOpen) {
  //       return;
  //     }

  //     // ============================================================
  //     // HELPER
  //     // Converts JSON-string values from Google Sheet
  //     // back into arrays for Ant Design Checkbox.Group
  //     // ============================================================

  //     const parseArray = (value) => {
  //       if (Array.isArray(value)) {
  //         return value;
  //       }

  //       if (!value) {
  //         return [];
  //       }

  //       try {
  //         const parsed = JSON.parse(value);

  //         return Array.isArray(parsed) ? parsed : [];
  //       } catch (error) {
  //         console.warn("Unable to parse checkbox value:", value);

  //         return [];
  //       }
  //     };

  //     // ============================================================
  //     // PARSE SAVED JSON VALUES
  //     // ============================================================

  //     const serviceCategory = parseArray(viewReport["serviceCategory"]);

  //     const machineTrialStatus =
  //       parseArray(viewReport["machineTrialStatus"]).length > 0
  //         ? parseArray(viewReport["machineTrialStatus"])
  //         : [
  //             viewReport["Machine tested successfully"] === "Yes"
  //               ? "machineTestedSuccessfully"
  //               : null,

  //             viewReport["Machine running normally"] === "Yes"
  //               ? "machineRunningNormally"
  //               : null,

  //             viewReport["Running with observation"] === "Yes"
  //               ? "runningWithObservation"
  //               : null,

  //             viewReport["Machine stopped - further action required"] === "Yes"
  //               ? "machineStopped"
  //               : null,

  //             viewReport["Customer advised / awaiting action"] === "Yes"
  //               ? "customerAdvised"
  //               : null,
  //           ].filter(Boolean);

  //     const furtherAction =
  //       parseArray(viewReport["furtherAction"]).length > 0
  //         ? parseArray(viewReport["furtherAction"])
  //         : [
  //             viewReport["No further action required"] === "Yes"
  //               ? "noFurtherAction"
  //               : null,

  //             viewReport["Parts required"] === "Yes" ? "partsRequired" : null,

  //             viewReport["Follow-up visit required"] === "Yes"
  //               ? "followUpVisit"
  //               : null,

  //             viewReport["Customer action required"] === "Yes"
  //               ? "customerAction"
  //               : null,

  //             (viewReport["Technical support required from Haitian China"] ||
  //               viewReport[
  //                 "Technical / spare support required from Haitian China"
  //               ] ||
  //               "") === "Yes"
  //               ? "technicalSupportChina"
  //               : null,
  //           ].filter(Boolean);

  //     const serviceCommercialClassification =
  //       parseArray(viewReport["serviceCommercialClassification"]).length > 0
  //         ? parseArray(viewReport["serviceCommercialClassification"])
  //         : [
  //             viewReport["F.O.C. Commissioning"] === "Yes"
  //               ? "focCommissioning"
  //               : null,

  //             viewReport["F.O.C. Maintenance"] === "Yes"
  //               ? "focMaintenance"
  //               : null,

  //             viewReport["Warranty Service"] === "Yes" ? "warrantyService" : null,

  //             viewReport["Chargeable Maintenance"] === "Yes"
  //               ? "chargeableMaintenance"
  //               : null,

  //             viewReport["Customer Visit (Service)"] === "Yes"
  //               ? "customerVisitService"
  //               : null,

  //             viewReport["Service Contract"] === "Yes" ? "serviceContract" : null,

  //             viewReport["Goodwill"] === "Yes" ? "goodwill" : null,
  //           ].filter(Boolean);

  //     // ============================================================
  //     // PARTS
  //     // ============================================================

  //     let parts = [];

  //     if (Array.isArray(viewReport.parts)) {
  //       parts = viewReport.parts.map((part, index) => ({
  //         key: index,

  //         "Part No.": part["Part No."] || part.partNo || "",

  //         Description: part["Description"] || part.description || "",

  //         Qty: part["Qty"] || part.qty || "",

  //         "Used / Recommended":
  //           part["Used / Recommended"] || part.usedRecommended || "",

  //         Remarks: part["Remarks"] || part.remarks || "",
  //       }));
  //     } else {
  //       // Fallback in case backend returns only one row
  //       if (
  //         viewReport["Part No."] ||
  //         viewReport["Description"] ||
  //         viewReport["Qty"] ||
  //         viewReport["Used / Recommended"] ||
  //         viewReport["Remarks"]
  //       ) {
  //         parts = [
  //           {
  //             key: 0,

  //             "Part No.": viewReport["Part No."] || "",

  //             Description: viewReport["Description"] || "",

  //             Qty: viewReport["Qty"] || "",

  //             "Used / Recommended": viewReport["Used / Recommended"] || "",

  //             Remarks: viewReport["Remarks"] || "",
  //           },
  //         ];
  //       }
  //     }

  //     // ============================================================
  //     // SET PARTS
  //     // ============================================================

  //     setViewPartsData(parts);

  //     // ============================================================
  //     // SET ALL FORM VALUES
  //     // ============================================================

  //     viewForm.setFieldsValue({
  //       // ==========================================================
  //       // 1. CUSTOMER & VISIT INFORMATION
  //       // ==========================================================

  //       serviceReportNumber: viewReport["Service Report Number"] || "",

  //       customer: viewReport["Customer"] || "",

  //       serviceDate: viewReport["Service Date"] || "",

  //       siteLocation: viewReport["Site / Location"] || "",

  //       contactPerson: viewReport["Contact Person"] || "",

  //       contactNo: viewReport["Contact No."] || "",

  //       technician: viewReport["Technician"] || "",

  //       arrivalTime: viewReport["Arrival Time"] || "",

  //       completionTime: viewReport["Completion Time"] || "",

  //       totalWorkingHours: viewReport["Total Working Hours"] || "",

  //       serviceVisitRef: viewReport["Service Visit Ref."] || "",

  //       // ==========================================================
  //       // 2. MACHINE INFORMATION
  //       // ==========================================================

  //       machineModel: viewReport["Machine Model"] || "",

  //       serialNo: viewReport["Serial No."] || "",

  //       installationYear:
  //         viewReport["Installation year"] ||
  //         viewReport["Installation Date"] ||
  //         "",

  //       machineRunningHours: viewReport["Machine Running Hours"] || "",

  //       controllerSoftwareVersion:
  //         viewReport["Controller"] ||
  //         viewReport["Controller / Software version"] ||
  //         viewReport["Controller / Software Version"] ||
  //         "",

  //       warrantyStatus: viewReport["Warranty Status"] || "",

  //       // ==========================================================
  //       // 3. SERVICE CATEGORY
  //       // ==========================================================

  //       serviceCategory:
  //         // Current format
  //         serviceCategory.length > 0
  //           ? serviceCategory
  //           : // Fallback for old Yes/No column format
  //             [
  //               viewReport["Installation / Commissioning"] === "Yes"
  //                 ? "installation"
  //                 : null,

  //               viewReport["Breakdown / Defect"] === "Yes" ? "breakdown" : null,

  //               viewReport["Preventive Maintenance"] === "Yes"
  //                 ? "preventive"
  //                 : null,

  //               viewReport["Corrective Maintenance"] === "Yes"
  //                 ? "corrective"
  //                 : null,

  //               viewReport["Inspection"] === "Yes" ? "inspection" : null,

  //               viewReport["Customer Visit"] === "Yes" ? "customerVisit" : null,

  //               viewReport["Software / Program"] === "Yes" ? "software" : null,

  //               viewReport["Other"] === "Yes" ? "other" : null,
  //             ].filter(Boolean),

  //       // ==========================================================
  //       // 4. CUSTOMER COMPLAINT
  //       // ==========================================================

  //       customerComplaint:
  //         viewReport["Customer Complaint"] ||
  //         viewReport["Customer complaint / reported problem"] ||
  //         viewReport["Customer Complaint / Reported Problem"] ||
  //         "",

  //       // ==========================================================
  //       // 5. TECHNICIAN DIAGNOSIS
  //       // ==========================================================

  //       diagnosis:
  //         viewReport["Technician Diagnosis"] ||
  //         viewReport["Technician diagnosis/root cause"] ||
  //         viewReport["Technician Diagnosis / Root Cause"] ||
  //         "",

  //       // ==========================================================
  //       // 6. WORK PERFORMED
  //       // ==========================================================

  //       workPerformed:
  //         viewReport["Work Performed"] ||
  //         viewReport["Work performed / corrective action"] ||
  //         viewReport["Work Performed / Corrective Action"] ||
  //         "",

  //       // ==========================================================
  //       // 7. MACHINE TRIAL & FINAL STATUS
  //       // ==========================================================

  //       machineTrialStatus: machineTrialStatus,
  //       trialDuration: viewReport["Trial Duration"] || "",

  //       cycleTime: viewReport["Cycle Time"] || "",

  //       productMaterial: viewReport["Product / Material"] || "",

  //       trialStatusRemarks: viewReport["Trial / Status Remarks"] || "",

  //       // ==========================================================
  //       // 9. FURTHER ACTION REQUIRED
  //       // ==========================================================

  //       furtherAction: furtherAction,

  //       requiredActionFollowUp:
  //         viewReport["Required Action / Follow-up"] ||
  //         viewReport["Required Action / Follow-Up"] ||
  //         "",

  //       // ==========================================================
  //       // 10. COMMERCIAL CLASSIFICATION
  //       // ==========================================================

  //       serviceCommercialClassification: serviceCommercialClassification,

  //       // ==========================================================
  //       // 11. CUSTOMER ACKNOWLEDGEMENT
  //       // ==========================================================

  //       technicianName:
  //         viewReport["Technician Name"] ||
  //         viewReport["Service Technician Name"] ||
  //         "",

  //       technicianDate:
  //         viewReport["Technician Date"] ||
  //         viewReport["Service Technician Date"] ||
  //         "",

  //       managerName:
  //         viewReport["Manager Name"] || viewReport["Service Manager Name"] || "",

  //       managerDate:
  //         viewReport["Manager Date"] || viewReport["Service Manager Date"] || "",

  //       customerName: viewReport["Customer Name"] || "",

  //       customerDate: viewReport["Customer Date"] || "",
  //     });

  //     // ============================================================
  //     // SIGNATURES
  //     // ============================================================

  //     setTimeout(() => {
  //       // setViewSignatureData({
  //       //   technician:
  //       //     viewReport["Technician Signature"] ||
  //       //     viewReport["signatureTechnician"] ||
  //       //     "",
  //       //   manager:
  //       //     viewReport["Manager Signature"] ||
  //       //     viewReport["signatureManager"] ||
  //       //     "",
  //       //   customer:
  //       //     viewReport["Customer Signature"] ||
  //       //     viewReport["signatureCustomer"] ||
  //       //     "",
  //       // });
  //     }, 0);
  //   }, [viewReport, viewModalOpen, viewForm]);

  //   // ============================================================
  //   // EDIT MODAL HELPERS
  //   // ============================================================

  //   const parseEditArray = (value) => {
  //     if (Array.isArray(value)) return value;
  //     if (!value) return [];
  //     try {
  //       const parsed = JSON.parse(value);
  //       return Array.isArray(parsed) ? parsed : [];
  //     } catch {
  //       return [];
  //     }
  //   };

  //   useEffect(() => {
  //     if (!editReport || !editModalOpen) return;

  //     const serviceCategory = parseEditArray(editReport["serviceCategory"]).length
  //       ? parseEditArray(editReport["serviceCategory"])
  //       : [
  //           editReport["Installation / Commissioning"] === "Yes"
  //             ? "installation"
  //             : null,
  //           editReport["Breakdown / Defect"] === "Yes" ? "breakdown" : null,
  //           editReport["Preventive Maintenance"] === "Yes" ? "preventive" : null,
  //           editReport["Corrective Maintenance"] === "Yes" ? "corrective" : null,
  //           editReport["Inspection"] === "Yes" ? "inspection" : null,
  //           editReport["Customer Visit"] === "Yes" ? "customerVisit" : null,
  //           editReport["Software / Program"] === "Yes" ? "software" : null,
  //           editReport["Other"] === "Yes" ? "other" : null,
  //         ].filter(Boolean);

  //     const machineTrialStatus = parseEditArray(editReport["machineTrialStatus"])
  //       .length
  //       ? parseEditArray(editReport["machineTrialStatus"])
  //       : [
  //           editReport["Machine tested successfully"] === "Yes"
  //             ? "machineTestedSuccessfully"
  //             : null,
  //           editReport["Machine running normally"] === "Yes"
  //             ? "machineRunningNormally"
  //             : null,
  //           editReport["Running with observation"] === "Yes"
  //             ? "runningWithObservation"
  //             : null,
  //           editReport["Machine stopped - further action required"] === "Yes"
  //             ? "machineStopped"
  //             : null,
  //           editReport["Customer advised / awaiting action"] === "Yes"
  //             ? "customerAdvised"
  //             : null,
  //         ].filter(Boolean);

  //     const furtherAction = parseEditArray(editReport["furtherAction"]).length
  //       ? parseEditArray(editReport["furtherAction"])
  //       : [
  //           editReport["No further action required"] === "Yes"
  //             ? "noFurtherAction"
  //             : null,
  //           editReport["Parts required"] === "Yes" ? "partsRequired" : null,
  //           editReport["Follow-up visit required"] === "Yes"
  //             ? "followUpVisit"
  //             : null,
  //           editReport["Customer action required"] === "Yes"
  //             ? "customerAction"
  //             : null,
  //           (editReport["Technical support required from Haitian China"] ||
  //             editReport[
  //               "Technical / spare support required from Haitian China"
  //             ] ||
  //             "") === "Yes"
  //             ? "technicalSupportChina"
  //             : null,
  //         ].filter(Boolean);

  //     const commercial = parseEditArray(
  //       editReport["serviceCommercialClassification"],
  //     ).length
  //       ? parseEditArray(editReport["serviceCommercialClassification"])
  //       : [
  //           editReport["F.O.C. Commissioning"] === "Yes"
  //             ? "focCommissioning"
  //             : null,
  //           editReport["F.O.C. Maintenance"] === "Yes" ? "focMaintenance" : null,
  //           editReport["Warranty Service"] === "Yes" ? "warrantyService" : null,
  //           editReport["Chargeable Maintenance"] === "Yes"
  //             ? "chargeableMaintenance"
  //             : null,
  //           editReport["Customer Visit (Service)"] === "Yes"
  //             ? "customerVisitService"
  //             : null,
  //           editReport["Service Contract"] === "Yes" ? "serviceContract" : null,
  //           editReport["Goodwill"] === "Yes" ? "goodwill" : null,
  //           editReport["Chargeable commissioning"] === "Yes"
  //             ? "chargeableCommissioning"
  //             : null,
  //         ].filter(Boolean);

  //     const technicians = String(editReport["Technician"] || "")
  //       .split(",")
  //       .map((x) => x.trim())
  //       .filter(Boolean);

  //     const existingParts =
  //       Array.isArray(editReport.parts) && editReport.parts.length
  //         ? editReport.parts.map((part, index) => ({
  //             key: index,
  //             partNo: part.partNo ?? part["Part No."] ?? "",
  //             description: part.description ?? part["Description"] ?? "",
  //             qty: part.qty ?? part["Qty"] ?? "",
  //             usedRecommended:
  //               part.usedRecommended ?? part["Used / Recommended"] ?? "",
  //             remarks: part.remarks ?? part["Remarks"] ?? "",
  //           }))
  //         : [
  //             {
  //               key: 0,
  //               partNo: editReport["Part No."] || "",
  //               description: editReport["Description"] || "",
  //               qty: editReport["Qty"] || "",
  //               usedRecommended: editReport["Used / Recommended"] || "",
  //               remarks: editReport["Remarks"] || "",
  //             },
  //           ];

  //     // Always show at least 3 rows.
  //     // Existing rows are preserved; empty rows are added only when needed.
  //     const parts = [...existingParts];

  //     while (parts.length < 3) {
  //       parts.push({
  //         key: parts.length,
  //         partNo: "",
  //         description: "",
  //         qty: "",
  //         usedRecommended: "",
  //         remarks: "",
  //       });
  //     }

  //     setEditPartsData(parts);
  //     editForm.setFieldsValue({
  //       serviceReportNumber: editReport["Service Report Number"] || "",
  //       customer: editReport["Customer"] || "",
  //       serviceDate: editReport["Service Date"] || "",
  //       siteLocation: editReport["Site / Location"] || "",
  //       contactPerson: editReport["Contact Person"] || "",
  //       contactNo: editReport["Contact No."] || "",
  //       technician: technicians,
  //       arrivalTime: editReport["Arrival Time"] || "",
  //       completionTime: editReport["Completion Time"] || "",
  //       totalWorkingHours: editReport["Total Working Hours"] || "",
  //       serviceVisitRef: editReport["Service Visit Ref."] || "",
  //       machineModel: editReport["Machine Model"] || "",
  //       serialNo: editReport["Serial No."] || "",
  //       installationYear:
  //         editReport["Installation year"] ||
  //         editReport["Installation Date"] ||
  //         "",
  //       machineRunningHours: editReport["Machine Running Hours"] || "",
  //       softwareVersion:
  //         editReport["Controller"] ||
  //         editReport["Controller / Software version"] ||
  //         editReport["Controller / Software Version"] ||
  //         "",
  //       warrantyStatus: editReport["Warranty Status"] || "",
  //       serviceCategory,
  //       customerComplaint:
  //         editReport["Customer complaint / reported problem"] || "",
  //       technicianDiagnosis:
  //         editReport["Technician diagnosis/root cause"] ||
  //         editReport["Technician Diagnosis / Root Cause"] ||
  //         "",
  //       workPerformed:
  //         editReport["Work performed / corrective action"] ||
  //         editReport["Work Performed / Corrective Action"] ||
  //         "",
  //       machineTrialStatus,
  //       trialDuration: editReport["Trial Duration"] || "",
  //       cycleTime: editReport["Cycle Time"] || "",
  //       productMaterial: editReport["Product / Material"] || "",
  //       trialStatusRemarks: editReport["Trial / Status Remarks"] || "",
  //       furtherAction,
  //       requiredActionFollowUp:
  //         editReport["Required Action / Follow-up"] ||
  //         editReport["Required Action / Follow-Up"] ||
  //         "",
  //       serviceCommercialClassification: commercial,
  //       technicianName:
  //         editReport["Service Technician Name"] ||
  //         editReport["Technician Name"] ||
  //         "",
  //       technicianDate:
  //         editReport["Service Technician Date"] ||
  //         editReport["Technician Date"] ||
  //         "",
  //       managerName:
  //         editReport["Service Manager Name"] || editReport["Manager Name"] || "",
  //       managerDate:
  //         editReport["Service Manager Date"] || editReport["Manager Date"] || "",
  //       customerName: editReport["Customer Name"] || "",
  //       customerDate: editReport["Customer Date"] || "",
  //     });

  //     // Every edit must be re-signed. Existing signature data is not
  //     // exposed by the current backend, so the user must draw all 3.
  //     setEditSignatureTechnician("");
  //     setEditSignatureManager("");
  //     setEditSignatureCustomer("");
  //     setIsEditTechnicianSignSaved(false);
  //     setIsEditManagerSignSaved(false);
  //     setIsEditCustomerSignSaved(false);

  //     setTimeout(() => {
  //       [editSigTechnician, editSigManager, editSigCustomer].forEach((ref) => {
  //         if (ref.current) ref.current.clear();
  //       });
  //     }, 50);
  //   }, [editReport, editModalOpen]);

  //   // ============================================================
  //   // EDIT FORM - PARTS INPUT LIMITS
  //   // Same limits as the New Service Report form
  //   // Part No. = 22, Description = 25, Used / Recommended = 25, Remarks = 25
  //   // ============================================================
  //   const updateEditPart = (key, field, value) => {
  //     let limitedValue = typeof value === "string" ? value : "";

  //     if (field === "partNo") {
  //       limitedValue = limitedValue.slice(0, 22);
  //     } else if (field === "description") {
  //       limitedValue = limitedValue.slice(0, 25);
  //     } else if (field === "usedRecommended" || field === "remarks") {
  //       limitedValue = limitedValue.slice(0, 25);
  //     }

  //     setEditPartsData((current) =>
  //       current.map((part) =>
  //         part.key === key
  //           ? { ...part, [field]: limitedValue }
  //           : part,
  //       ),
  //     );
  //   };

  //   const addEditPart = () => {
  //     setEditPartsData((current) => [
  //       ...current,
  //       {
  //         key: Date.now(),
  //         partNo: "",
  //         description: "",
  //         qty: "",
  //         usedRecommended: "",
  //         remarks: "",
  //       },
  //     ]);
  //   };

  //   const removeEditPart = (key) => {
  //     setEditPartsData((current) => {
  //       const next = current.filter((part) => part.key !== key);
  //       return next.length
  //         ? next
  //         : [
  //             {
  //               key: Date.now(),
  //               partNo: "",
  //               description: "",
  //               qty: "",
  //               usedRecommended: "",
  //               remarks: "",
  //             },
  //           ];
  //     });
  //   };

  //   const closeEditModal = (force = false) => {
  //     if (editSaveLoading && !force) return;
  //     setEditModalOpen(false);
  //     setEditReport(null);
  //     setEditPartsData([]);
  //     editForm.resetFields();
  //     setEditSignatureTechnician("");
  //     setEditSignatureManager("");
  //     setEditSignatureCustomer("");
  //     setIsEditTechnicianSignSaved(false);
  //     setIsEditManagerSignSaved(false);
  //     setIsEditCustomerSignSaved(false);
  //     [editSigTechnician, editSigManager, editSigCustomer].forEach((ref) => {
  //       if (ref.current) ref.current.clear();
  //     });
  //   };

  //   const saveEditSignature = (type) => {
  //     const config = {
  //       technician: {
  //         ref: editSigTechnician,
  //         setSignature: setEditSignatureTechnician,
  //         setSaved: setIsEditTechnicianSignSaved,
  //         label: "Technician",
  //       },
  //       manager: {
  //         ref: editSigManager,
  //         setSignature: setEditSignatureManager,
  //         setSaved: setIsEditManagerSignSaved,
  //         label: "Manager",
  //       },
  //       customer: {
  //         ref: editSigCustomer,
  //         setSignature: setEditSignatureCustomer,
  //         setSaved: setIsEditCustomerSignSaved,
  //         label: "Customer",
  //       },
  //     }[type];

  //     if (config?.ref.current && !config.ref.current.isEmpty()) {
  //       config.setSignature(
  //         config.ref.current.getCanvas().toDataURL("image/png"),
  //       );
  //       config.setSaved(true);
  //       notification.success({
  //         message: "Signature Saved",
  //         description: `${config.label} signature saved successfully.`,
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.error({
  //         message: `${config?.label || "Signature"} Signature Required`,
  //         description: `Please draw the ${String(type).toLowerCase()} signature before saving.`,
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   const clearEditSignature = (type) => {
  //     const config = {
  //       technician: {
  //         ref: editSigTechnician,
  //         setSignature: setEditSignatureTechnician,
  //         setSaved: setIsEditTechnicianSignSaved,
  //       },
  //       manager: {
  //         ref: editSigManager,
  //         setSignature: setEditSignatureManager,
  //         setSaved: setIsEditManagerSignSaved,
  //       },
  //       customer: {
  //         ref: editSigCustomer,
  //         setSignature: setEditSignatureCustomer,
  //         setSaved: setIsEditCustomerSignSaved,
  //       },
  //     }[type];

  //     if (config?.ref.current) config.ref.current.clear();
  //     config?.setSignature("");
  //     config?.setSaved(false);
  //   };

  //   const uploadEditedServiceReportPDF = async (pdfResult) => {
  //     const formData = new URLSearchParams();
  //     formData.append("action", "uploadPdf");
  //     formData.append("fileName", pdfResult.fileName);
  //     formData.append("pdfBase64", pdfResult.pdfBase64);
  //     formData.append("replaceExisting", "true");

  //     // Send the SRN so Apps Script can replace any previous PDF
  //     // belonging to this same service report, even if the customer
  //     // name changed during the edit.
  //     formData.append(
  //       "serviceReportNumber",
  //       String(pdfResult.reportNumber || ""),
  //     );

  //     const response = await fetch(GAS_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: formData.toString(),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`PDF upload server returned ${response.status}`);
  //     }

  //     const result = await response.json();

  //     if (!result.success) {
  //       throw new Error(result.message || "Failed to upload updated PDF");
  //     }

  //     return result;
  //   };

  //   const handleEditSave = async () => {
  //     if (editSaveLoading) return;

  //     try {
  //       const values = await editForm.validateFields();

  //       const signaturesReady =
  //         isEditTechnicianSignSaved &&
  //         Boolean(editSignatureTechnician) &&
  //         editSigTechnician.current &&
  //         !editSigTechnician.current.isEmpty() &&
  //         isEditManagerSignSaved &&
  //         Boolean(editSignatureManager) &&
  //         editSigManager.current &&
  //         !editSigManager.current.isEmpty() &&
  //         isEditCustomerSignSaved &&
  //         Boolean(editSignatureCustomer) &&
  //         editSigCustomer.current &&
  //         !editSigCustomer.current.isEmpty();

  //       if (!signaturesReady) {
  //         notification.error({
  //           message: "All Signatures Required",
  //           description:
  //             "Please draw and save the Technician, Manager, and Customer signatures before submitting the edit.",
  //           placement: "bottomRight",
  //         });
  //         return;
  //       }

  //       if (!navigator.onLine) {
  //         notification.error({
  //           message: "No Internet Connection",
  //           description: "Please check your internet and try again.",
  //           placement: "bottomRight",
  //         });
  //         return;
  //       }

  //       const reportNumber =
  //         values.serviceReportNumber ||
  //         editReport?.["Service Report Number"] ||
  //         "";

  //       if (!reportNumber) {
  //         throw new Error("Service Report Number is missing.");
  //       }

  //       setEditSaveLoading(true);

  //       // IMPORTANT:
  //       // Do NOT filter out empty rows.
  //       // The backend must receive all 3 default rows so they remain
  //       // stored even when the user clears every input.
  //       const parts = editPartsData.map((part) => ({
  //         partNo: String(part?.partNo ?? "").trim(),
  //         description: String(part?.description ?? "").trim(),
  //         qty: String(part?.qty ?? "").trim(),
  //         usedRecommended: String(part?.usedRecommended ?? "").trim(),
  //         remarks: String(part?.remarks ?? "").trim(),
  //       }));

  //       // Safety: always send at least 3 rows.
  //       while (parts.length < 3) {
  //         parts.push({
  //           partNo: "",
  //           description: "",
  //           qty: "",
  //           usedRecommended: "",
  //           remarks: "",
  //         });
  //       }

  //       const payload = {
  //         action: "updateReport",
  //         serviceReportNumber: String(reportNumber),
  //         customer: values.customer || "",
  //         serviceDate: values.serviceDate || "",
  //         siteLocation: values.siteLocation || "",
  //         contactPerson: values.contactPerson || "",
  //         contactNo: values.contactNo || "",
  //         technician: Array.isArray(values.technician)
  //           ? values.technician.join(", ")
  //           : values.technician || "",
  //         arrivalTime: values.arrivalTime || "",
  //         completionTime: values.completionTime || "",
  //         totalWorkingHours: values.totalWorkingHours ?? "",
  //         serviceVisitRef: values.serviceVisitRef || "",
  //         machineModel: values.machineModel || "",
  //         serialNo: values.serialNo || "",
  //         installationYear: values.installationYear || "",
  //         machineRunningHours: values.machineRunningHours ?? "",
  //         softwareVersion: values.softwareVersion || "",
  //         warrantyStatus: values.warrantyStatus || "",
  //         serviceCategory: JSON.stringify(values.serviceCategory || []),
  //         customerComplaint: values.customerComplaint || "",
  //         technicianDiagnosis: values.technicianDiagnosis || "",
  //         workPerformed: values.workPerformed || "",
  //         machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),
  //         trialDuration: values.trialDuration || "",
  //         cycleTime: values.cycleTime || "",
  //         productMaterial: values.productMaterial || "",
  //         trialStatusRemarks: values.trialStatusRemarks || "",
  //         parts: JSON.stringify(parts),
  //         furtherAction: JSON.stringify(values.furtherAction || []),
  //         requiredActionFollowUp: values.requiredActionFollowUp || "",
  //         serviceCommercialClassification: JSON.stringify(
  //           values.serviceCommercialClassification || [],
  //         ),
  //         technicianName: values.technicianName || "",
  //         technicianDate: values.technicianDate || "",
  //         managerName: values.managerName || "",
  //         managerDate: values.managerDate || "",
  //         customerName: values.customerName || "",
  //         customerDate: values.customerDate || "",
  //         // Included for API compatibility; signatures are used for the PDF.
  //         signatureTechnician: editSignatureTechnician,
  //         signatureManager: editSignatureManager,
  //         signatureCustomer: editSignatureCustomer,
  //         userEmail: user?.email || "",
  //       };

  //       const formData = new URLSearchParams();
  //       Object.entries(payload).forEach(([key, value]) => {
  //         formData.append(
  //           key,
  //           value === null || value === undefined ? "" : String(value),
  //         );
  //       });

  //       const response = await fetch(GAS_URL, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //         body: formData.toString(),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Server returned ${response.status}`);
  //       }

  //       const result = await response.json();

  //       if (!result.success) {
  //         throw new Error(result.message || "Failed to update service report");
  //       }

  //       // Generate the new PDF only after the sheet update succeeds.
  //       const pdfValues = {
  //         ...values,
  //         parts,
  //       };

  //       const pdfResult = await generateEditServiceReportPDF(
  //         pdfValues,
  //         String(reportNumber),
  //         editSignatureTechnician,
  //         editSignatureManager,
  //         editSignatureCustomer,
  //       );

  //       await uploadEditedServiceReportPDF(pdfResult);

  //       // Download the exact PDF that was just uploaded.
  //       // Passing the filename avoids the old/new filename mismatch.
  //       await downloadServiceReportPDFByNumber(
  //         String(reportNumber),
  //         pdfResult.fileName,
  //       );

  //       notification.success({
  //         message: "Report Updated",
  //         description: `Service Report ${reportNumber} was updated and its PDF was regenerated successfully.`,
  //         placement: "bottomRight",
  //       });

  //       closeEditModal(true);
  //       await fetchServiceReports();
  //     } catch (error) {
  //       console.error("Edit service report error:", error);

  //       notification.error({
  //         message: "Update Failed",
  //         description: error?.message || "Unable to update the service report.",
  //         placement: "bottomRight",
  //       });
  //     } finally {
  //       setEditSaveLoading(false);
  //     }
  //   };

  //   // ============================================================
  //   // SERVICE REPORT TABLE HELPERS
  //   // ============================================================

  //   const getServiceReportNumber = (record) => {
  //     const raw = record?.["Service Report Number"];
  //     const numeric = Number(String(raw ?? "").replace(/[^0-9.-]/g, ""));
  //     return Number.isFinite(numeric) ? numeric : -Infinity;
  //   };

  //   const getReportSearchText = (record) =>
  //     Object.values(record || {})
  //       .map((value) => {
  //         if (Array.isArray(value)) return value.join(" ");
  //         if (value === null || value === undefined) return "";
  //         return String(value);
  //       })
  //       .join(" ")
  //       .toLowerCase();

  //   // ============================================================
  //   // REPORT TABLE FIELD HELPER
  //   // ============================================================
  //   // The backend/Google Sheet can contain these three fields under
  //   // different header names depending on the version of the report.
  //   // Always check every supported name before displaying "-".
  //   // ============================================================

  //   const getReportField = (record, fieldNames) => {
  //     if (!record || !Array.isArray(fieldNames)) return "";

  //     for (const fieldName of fieldNames) {
  //       const value = record?.[fieldName];

  //       if (value !== null && value !== undefined) {
  //         const text = String(value).trim();

  //         if (text !== "") {
  //           return text;
  //         }
  //       }
  //     }

  //     return "";
  //   };

  //   const getCustomerComplaint = (record) =>
  //     getReportField(record, [
  //       "Customer Complaint",
  //       "Customer complaint / reported problem",
  //       "Customer Complaint / Reported Problem",
  //       "customerComplaint",
  //     ]);

  //   const getTechnicianDiagnosis = (record) =>
  //     getReportField(record, [
  //       "Technician Diagnosis",
  //       "Technician diagnosis/root cause",
  //       "Technician Diagnosis / Root Cause",
  //       "technicianDiagnosis",
  //       "diagnosis",
  //     ]);

  //   const getWorkPerformed = (record) =>
  //     getReportField(record, [
  //       "Work Performed",
  //       "Work performed / corrective action",
  //       "Work Performed / Corrective Action",
  //       "workPerformed",
  //     ]);

  

  //   const loggedInUserEmail = String(user?.email || "")
  //     .replace(/[\u200B-\u200D\uFEFF]/g, "")
  //     .trim()
  //     .toLowerCase();

  //   // Admin access is determined by the authenticated backend role
  //   // OR the exact admin email. This keeps the table working even
  //   // if an older login response does not yet return access: "admin".
  //   const isServiceReportAdmin =
  //     String(user?.access || "").trim().toLowerCase() === "admin" ||
  //     loggedInUserEmail === "admin@haitianme.com";

  //   const filteredAndSortedReportData = [...reportData]
  //     .filter((record) => {
  //       // Admin sees all records.
  //       if (isServiceReportAdmin) {
  //         return true;
  //       }

  //       const modifiedUser = String(
  //         record?.["Modified User"] ?? ""
  //       )
  //         .replace(/[\u200B-\u200D\uFEFF]/g, "")
  //         .trim()
  //         .toLowerCase();

  //       // Normal users see only records modified by themselves.
  //       return (
  //         loggedInUserEmail !== "" &&
  //         modifiedUser === loggedInUserEmail
  //       );
  //     })
  //     .filter((record) => {
  //       const query = reportTableSearch.trim().toLowerCase();
  //       if (!query) return true;
  //       return getReportSearchText(record).includes(query);
  //     })
  //     .sort(
  //       (a, b) =>
  //         getServiceReportNumber(b) -
  //         getServiceReportNumber(a)
  //     );

  //   const reportTableColumns = [
  //     {
  //       title: "Service Report",
  //       dataIndex: "Service Report Number",
  //       key: "serviceReportNumber",
  //       fixed: "left",
  //       width: 150,
  //       sorter: (a, b) => getServiceReportNumber(a) - getServiceReportNumber(b),
  //       defaultSortOrder: "descend",
  //       render: (value) => (
  //         <div className="service-report-number-cell">
  //           <span className="service-report-number-badge">
  //             {value || "-"}
  //           </span>
  //         </div>
  //       ),
  //     },

  //     {
  //       title: "Customer",
  //       dataIndex: "Customer",
  //       key: "customer",
  //       width: 190,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Service Date",
  //       dataIndex: "Service Date",
  //       key: "serviceDate",
  //       width: 125,
  //       sorter: (a, b) =>
  //         String(a?.["Service Date"] || "").localeCompare(
  //           String(b?.["Service Date"] || ""),
  //         ),
  //       render: (date) => date || "-",
  //     },

  //     {
  //       title: "Site / Location",
  //       dataIndex: "Site / Location",
  //       key: "siteLocation",
  //       width: 210,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Contact Person",
  //       dataIndex: "Contact Person",
  //       key: "contactPerson",
  //       width: 170,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Contact No.",
  //       dataIndex: "Contact No.",
  //       key: "contactNo",
  //       width: 145,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Technician",
  //       dataIndex: "Technician",
  //       key: "technician",
  //       width: 150,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Arrival",
  //       dataIndex: "Arrival Time",
  //       key: "arrivalTime",
  //       width: 105,
  //       render: (time) => time || "-",
  //     },

  //     {
  //       title: "Completion",
  //       dataIndex: "Completion Time",
  //       key: "completionTime",
  //       width: 110,
  //       render: (time) => time || "-",
  //     },

  //     {
  //       title: "Working Hours",
  //       dataIndex: "Total Working Hours",
  //       key: "totalWorkingHours",
  //       width: 130,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Visit Ref.",
  //       dataIndex: "Service Visit Ref.",
  //       key: "serviceVisitRef",
  //       width: 150,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Machine Model",
  //       dataIndex: "Machine Model",
  //       key: "machineModel",
  //       width: 170,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Serial No.",
  //       dataIndex: "Serial No.",
  //       key: "serialNo",
  //       width: 165,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Installation Year",
  //       dataIndex: "Installation year",
  //       key: "installationYear",
  //       width: 135,
  //       render: (_, record) =>
  //         record?.["Installation year"] ||
  //         record?.["Installation Date"] ||
  //         "-",
  //     },

  //     {
  //       title: "Running Hours",
  //       dataIndex: "Machine Running Hours",
  //       key: "machineRunningHours",
  //       width: 135,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Controller",
  //       dataIndex: "Controller",
  //       key: "controller",
  //       width: 160,
  //       ellipsis: true,
  //       render: (_, record) =>
  //         record?.["Controller"] ||
  //         record?.["Controller / Software version"] ||
  //         record?.["Controller / Software Version"] ||
  //         "-",
  //     },

  //     {
  //       title: "Warranty",
  //       dataIndex: "Warranty Status",
  //       key: "warrantyStatus",
  //       width: 125,
  //       ellipsis: true,
  //     },

  //     {
  //       title: "Customer Complaint",
  //       dataIndex: "Customer Complaint",
  //       key: "customerComplaint",
  //       width: 240,
  //       ellipsis: true,
  //       render: (_, record) => getCustomerComplaint(record) || "-",
  //     },

  //     {
  //       title: "Technician Diagnosis",
  //       dataIndex: "Technician Diagnosis",
  //       key: "technicianDiagnosis",
  //       width: 240,
  //       ellipsis: true,
  //       render: (_, record) => getTechnicianDiagnosis(record) || "-",
  //     },

  //     {
  //       title: "Work Performed",
  //       dataIndex: "Work Performed",
  //       key: "workPerformed",
  //       width: 240,
  //       ellipsis: true,
  //       render: (_, record) => getWorkPerformed(record) || "-",
  //     },

  //     {
  //       title: "Trial Duration",
  //       dataIndex: "Trial Duration",
  //       key: "trialDuration",
  //       width: 125,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Cycle Time",
  //       dataIndex: "Cycle Time",
  //       key: "cycleTime",
  //       width: 115,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Product / Material",
  //       dataIndex: "Product / Material",
  //       key: "productMaterial",
  //       width: 180,
  //       ellipsis: true,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Trial / Status Remarks",
  //       dataIndex: "Trial / Status Remarks",
  //       key: "trialStatusRemarks",
  //       width: 240,
  //       ellipsis: true,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Part No.",
  //       dataIndex: "Part No.",
  //       key: "partNo",
  //       width: 180,
  //       ellipsis: true,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Part Description",
  //       dataIndex: "Description",
  //       key: "partDescription",
  //       width: 180,
  //       ellipsis: true,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Qty",
  //       dataIndex: "Qty",
  //       key: "qty",
  //       width: 80,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Used / Recommended",
  //       dataIndex: "Used / Recommended",
  //       key: "usedRecommended",
  //       width: 180,
  //       ellipsis: true,
  //       render: (value) => value || "-",
  //     },

  //     {
  //       title: "Part Remarks",
  //       dataIndex: "Remarks",
  //       key: "partRemarks",
  //       width: 180,
  //       ellipsis: true,
  //       render: (value) => value || "-",
  //     },

  //     // {
  //     //   title: "Further Action",
  //     //   dataIndex: "Further Action Required",
  //     //   key: "furtherAction",
  //     //   width: 220,
  //     //   ellipsis: true,
  //     //   render: (value) => value || "-",
  //     // },

  //     // {
  //     //   title: "Commercial Classification",
  //     //   dataIndex: "Service Commercial Classification",
  //     //   key: "commercialClassification",
  //     //   width: 220,
  //     //   ellipsis: true,
  //     //   render: (value) => value || "-",
  //     // },

  //     {
  //       title: "Actions",
  //       key: "action",
  //       fixed: "right",
  //       width: 210,
  //       render: (_, record) => (
  //         <div className="service-report-table-actions">
  //           <Button
  //             className="service-report-view-action"
  //             icon={<EyeOutlined />}
  //             onClick={() => {
  //               setViewReport(record);
  //               setViewModalOpen(true);
  //             }}
  //           >
  //             View
  //           </Button>

  //           <Button
  //             className="service-report-edit-action"
  //             icon={<EditOutlined />}
  //             onClick={() => {
  //               setEditReport(record);
  //               setEditModalOpen(true);
  //             }}
  //           >
  //             Edit
  //           </Button>
  //         </div>
  //       ),
  //     },
  //   ];

  //   // ============================================================
  //   // CUSTOMER DATA HELPERS
  //   // Supports both the actual Form Data sheet headers and the
  //   // older/canonical customer headers used by Code 1.
  //   // ============================================================

  //   const getCustomerName = (item) =>
  //     String(item?.["Customer"] || item?.["Customer Name"] || "").trim();

  //   const getCustomerAddress = (item) =>
  //     String(item?.["Site / Location"] || item?.["Address"] || "").trim();

  //   const getCustomerContact = (item) =>
  //     String(item?.["Contact Person"] || item?.["Contact"] || "").trim();

  //   const getCustomerTelephone = (item) =>
  //     String(item?.["Contact No."] || item?.["Telephone"] || "").trim();

  //   const getCustomerMachineModel = (item) =>
  //     String(item?.["Machine Model"] || item?.["Machine Type"] || "").trim();

  //   const getCustomerSerialNumber = (item) =>
  //     String(item?.["Serial No."] || item?.["Serial Number"] || "").trim();

  //   const getCustomerInstallationYear = (item) =>
  //     String(
  //       item?.["Installation year"] || item?.["Installation Date"] || "",
  //     ).trim();

  //   // ============================================================
  //   // LOAD CUSTOMER DATA
  //   // ============================================================

  //   useEffect(() => {
  //     loadAllCustomerData();
  //   }, []);

  //   const loadAllCustomerData = async () => {
  //     try {
  //       console.log("Loading customer data...");
  //       console.log("Customer API URL:", `${GAS_URL}?action=getAllCustomerData`);

  //       const response = await fetch(`${GAS_URL}?action=getAllCustomerData`, {
  //         method: "GET",
  //         cache: "no-store",
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Customer data server returned ${response.status}`);
  //       }

  //       const result = await response.json();

  //       console.log("Customer API response:", result);

  //       if (!result.success) {
  //         throw new Error(result.message || "Customer data request failed");
  //       }

  //       const allData = Array.isArray(result.customers) ? result.customers : [];

  //       console.log("Customer rows received:", allData.length);
  //       console.log("Customer rows:", allData);

  //       // Normalize the returned rows so the frontend works whether
  //       // the backend sends "Customer" or "Customer Name" and the
  //       // actual sheet field names or the canonical Code-1 names.
  //       const normalizedData = allData
  //         .map((item) => ({
  //           ...item,
  //           Customer: getCustomerName(item),
  //           "Customer Name": getCustomerName(item),
  //           "Site / Location": getCustomerAddress(item),
  //           Address: getCustomerAddress(item),
  //           "Contact Person": getCustomerContact(item),
  //           Contact: getCustomerContact(item),
  //           "Contact No.": getCustomerTelephone(item),
  //           Telephone: getCustomerTelephone(item),
  //           "Machine Model": getCustomerMachineModel(item),
  //           "Machine Type": getCustomerMachineModel(item),
  //           "Serial No.": getCustomerSerialNumber(item),
  //           "Serial Number": getCustomerSerialNumber(item),
  //           "Installation year": getCustomerInstallationYear(item),
  //           "Installation Date": getCustomerInstallationYear(item),
  //         }))
  //         .filter((item) => getCustomerName(item) !== "");

  //       // Keep the latest row for each customer. The backend returns
  //       // sheet rows in their normal order, so iterating backwards
  //       // gives the newest occurrence first.
  //       const seen = new Map();

  //       for (let i = normalizedData.length - 1; i >= 0; i--) {
  //         const item = normalizedData[i];
  //         const name = getCustomerName(item);
  //         const key = name.toLowerCase();

  //         if (name && !seen.has(key)) {
  //           seen.set(key, item);
  //         }
  //       }

  //       const uniqueSorted = Array.from(seen.values()).sort((a, b) =>
  //         getCustomerName(a).localeCompare(getCustomerName(b)),
  //       );

  //       setCustomerDataList(uniqueSorted);
  //       setCustomerOptions(
  //         uniqueSorted.map((customer) => getCustomerName(customer)),
  //       );

  //       console.log(
  //         "Unique customers:",
  //         uniqueSorted.map((customer) => getCustomerName(customer)),
  //       );
  //     } catch (error) {
  //       console.error("Failed to load customer data:", error);
  //       setCustomerDataList([]);
  //       setCustomerOptions([]);
  //     }
  //   };

  //   // ============================================================
  //   // CUSTOMER SEARCH
  //   // ============================================================

  //   const handleCustomerSearch = (value) => {
  //     const searchValue = String(value || "")
  //       .trim()
  //       .toLowerCase();

  //     const filtered = customerDataList
  //       .map((item) => getCustomerName(item))
  //       .filter((name) => name !== "")
  //       .filter(
  //         (name, index, self) =>
  //           self.findIndex(
  //             (other) => other.toLowerCase().trim() === name.toLowerCase().trim(),
  //           ) === index,
  //       )
  //       .filter((name) => name.toLowerCase().includes(searchValue))
  //       .sort((a, b) => a.localeCompare(b));

  //     setCustomerOptions(filtered);
  //   };

  //   // ============================================================
  //   // CUSTOMER CHANGE / AUTO PREFILL
  //   // ============================================================

  //   const clearCustomerAutofill = () => {
  //     form.setFieldsValue({
  //       siteLocation: "",
  //       contactPerson: "",
  //       contactNo: "",
  //       machineModel: "",
  //       serialNo: "",
  //       installationYear: "",
  //     });

  //     setAddress("");
  //     setSerialNumber("");
  //   };

  //   const handleCustomerChange = (value) => {
  //     const customerValue = typeof value === "string" ? value.trim() : "";

  //     form.setFieldsValue({
  //       customer: value || "",
  //     });

  //     // Clear only when the customer field is actually emptied.
  //     // Do NOT clear the previous data while the user is typing a
  //     // partial customer name such as "P" or "HA".
  //     if (!customerValue) {
  //       clearCustomerAutofill();
  //       return;
  //     }

  //     const matched = customerDataList.find(
  //       (customer) =>
  //         getCustomerName(customer).toLowerCase() === customerValue.toLowerCase(),
  //     );

  //     if (!matched) {
  //       // Partial typing is allowed. Autofill happens only after an
  //       // exact customer name is selected/entered.
  //       return;
  //     }

  //     const customerName = getCustomerName(matched);
  //     const addressValue = getCustomerAddress(matched);
  //     const contactValue = getCustomerContact(matched);
  //     const telephoneValue = getCustomerTelephone(matched);
  //     const machineModelValue = getCustomerMachineModel(matched);
  //     const serialValue = getCustomerSerialNumber(matched);
  //     const installationYearValue = getCustomerInstallationYear(matched);

  //     form.setFieldsValue({
  //       customer: customerName,
  //       siteLocation: addressValue,
  //       contactPerson: contactValue,
  //       contactNo: telephoneValue,
  //       machineModel: machineModelValue,
  //       serialNo: serialValue,
  //       installationYear: installationYearValue,
  //     });

  //     setAddress(addressValue);
  //     setSerialNumber(serialValue);

  //     console.log("Customer selected:", matched);
  //   };

  //   const handleTechChange = (value) => {
  //     if (value.length <= 5) {
  //       setSelectedTechnicians(value);
  //       form.setFieldsValue({ technician: value });
  //     }
  //   };

  //   useEffect(() => {
  //     updateCanvasSize();
  //     window.addEventListener("resize", updateCanvasSize);
  //     return () => window.removeEventListener("resize", updateCanvasSize);
  //   }, []);

  //   useEffect(() => {
  //     fetchNextServiceReportNumber();
  //   }, []);

  //   // ============================================================
  //   // TEXT LIMIT UTILITY
  //   // Maximum: 3 lines and 512 characters
  //   // ============================================================
  //   const enforceSectionTextLimit = (value) => {
  //     const input = typeof value === "string" ? value : "";

  //     // First limit to 3 explicit lines
  //     const lines = input.split("\n").slice(0, 3);

  //     let limited = lines.join("\n");

  //     // Then limit total characters to 512
  //     if (limited.length > 512) {
  //       limited = limited.substring(0, 512);
  //     }

  //     return limited;
  //   };

  //   const enforceProductMaterialLimit = (value) => {
  //     const input = typeof value === "string" ? value : "";

  //     // Restrict to 1 line
  //     let limited = input.split("\n")[0];

  //     // Restrict to 90 characters
  //     if (limited.length > 100) {
  //       limited = limited.substring(0, 100);
  //     }

  //     return limited;
  //   };

  //   const handleProductMaterialChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceProductMaterialLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Product Material is limited to 1 line and 100 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     form.setFieldsValue({
  //       productMaterial: limited,
  //     });
  //   };

  //   const handleRequiredActionFollowUpChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceSectionTextLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Required Action / Follow-up is limited to 3 lines and 512 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     form.setFieldsValue({
  //       requiredActionFollowUp: limited,
  //     });
  //   };

  //   const handleTrialStatusRemarksChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceSectionTextLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Trial / Status Remarks is limited to 3 lines and 512 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     form.setFieldsValue({
  //       trialStatusRemarks: limited,
  //     });
  //   };

  //   const handleCustomerComplaintChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceSectionTextLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Customer complaint is limited to 3 lines and 512 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     form.setFieldsValue({
  //       customerComplaint: limited,
  //     });
  //   };

  //   const handleTechnicianDiagnosisChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceSectionTextLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Technician diagnosis is limited to 3 lines and 512 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     form.setFieldsValue({
  //       technicianDiagnosis: limited,
  //     });
  //   };

  //   const handleWorkPerformedChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceSectionTextLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Work performed is limited to 3 lines and 512 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     form.setFieldsValue({
  //       workPerformed: limited,
  //     });
  //   };

  //   // ============================================================
  //   // EDIT FORM - TEXT INPUT LIMITS
  //   // Same limits as the New Service Report form
  //   // ============================================================
  //   const handleEditSectionTextChange = (fieldName, fieldLabel, e) => {
  //     const input = e.target.value;
  //     const limited = enforceSectionTextLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description: `${fieldLabel} is limited to 3 lines and 512 characters. Excess text was removed.`,
  //         placement: "bottomRight",
  //       });
  //     }

  //     editForm.setFieldsValue({
  //       [fieldName]: limited,
  //     });
  //   };

  //   const handleEditProductMaterialChange = (e) => {
  //     const input = e.target.value;
  //     const limited = enforceProductMaterialLimit(input);

  //     if (input !== limited) {
  //       notification.warning({
  //         message: "Warning",
  //         description:
  //           "Product Material is limited to 1 line and 100 characters. Excess text was removed.",
  //         placement: "bottomRight",
  //       });
  //     }

  //     editForm.setFieldsValue({
  //       productMaterial: limited,
  //     });
  //   };

  //   const formatDDMMYYYY = (value = "") => {
  //     // remove everything except numbers
  //     let digits = value.replace(/\D/g, "").slice(0, 8);

  //     if (digits.length >= 5) {
  //       return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
  //     }

  //     if (digits.length >= 3) {
  //       return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  //     }

  //     return digits;
  //   };

  //   // ============================================================
  //   // PARTS TABLE DATA SOURCE
  //   // ============================================================

  //   const partsDataSource = [
  //     {
  //       key: 0,
  //     },
  //     {
  //       key: 1,
  //     },
  //     {
  //       key: 2,
  //     },
  //   ];

  //   // ============================================================
  //   // PARTS TABLE COLUMNS
  //   // ============================================================

  //   const partsColumns = [
  //     {
  //       title: "Part No.",
  //       dataIndex: "partNo",
  //       key: "partNo",
  //       width: "17%",

  //       render: (_, record) => (
  //         <Form.Item style={{ margin: 0 }}>
  //           <Input
  //             placeholder="Part No."
  //             maxLength={22}
  //             showCount
  //             value={partsFormData[record.key]?.partNo || ""}
  //             onChange={(e) =>
  //               updatePartsFormData(record.key, "partNo", e.target.value)
  //             }
  //           />
  //         </Form.Item>
  //       ),
  //     },

  //     {
  //       title: "Description",
  //       dataIndex: "description",
  //       key: "description",
  //       width: "34%",

  //       render: (_, record) => (
  //         <Form.Item style={{ margin: 0 }}>
  //           <Input
  //             placeholder="Description"
  //             maxLength={25}
  //             showCount
  //             value={partsFormData[record.key]?.description || ""}
  //             onChange={(e) =>
  //               updatePartsFormData(record.key, "description", e.target.value)
  //             }
  //           />
  //         </Form.Item>
  //       ),
  //     },

  //     {
  //       title: "Qty",
  //       dataIndex: "qty",
  //       key: "qty",
  //       width: "9%",

  //       render: (_, record) => (
  //         <Form.Item style={{ margin: 0 }}>
  //           <Input
  //             style={{ width: "100%" }}
  //             placeholder="Qty"
  //             value={partsFormData[record.key]?.qty || ""}
  //             onChange={(e) =>
  //               updatePartsFormData(record.key, "qty", e.target.value)
  //             }
  //           />
  //         </Form.Item>
  //       ),
  //     },

  //     {
  //       title: "Used / Recommended",
  //       dataIndex: "usedRecommended",
  //       key: "usedRecommended",
  //       width: "26%",

  //       render: (_, record) => (
  //         <Form.Item style={{ margin: 0 }}>
  //           <Input
  //             placeholder="Used / Recommended"
  //             maxLength={25}
  //             showCount
  //             value={partsFormData[record.key]?.usedRecommended || ""}
  //             onChange={(e) =>
  //               updatePartsFormData(
  //                 record.key,
  //                 "usedRecommended",
  //                 e.target.value,
  //               )
  //             }
  //           />
  //         </Form.Item>
  //       ),
  //     },

  //     {
  //       title: "Remarks",
  //       dataIndex: "remarks",
  //       key: "remarks",
  //       width: "14%",

  //       render: (_, record) => (
  //         <Form.Item style={{ margin: 0 }}>
  //           <Input
  //             placeholder="Remarks"
  //             maxLength={25}
  //             showCount
  //             value={partsFormData[record.key]?.remarks || ""}
  //             onChange={(e) =>
  //               updatePartsFormData(record.key, "remarks", e.target.value)
  //             }
  //           />
  //         </Form.Item>
  //       ),
  //     },
  //   ];

  //   const fetchNextServiceReportNumber = async () => {
  //     try {
  //       setSrnLoading(true);

  //       const response = await fetch(
  //         `${GAS_URL}?action=getNextServiceReportNumber`,
  //       );

  //       if (!response.ok) {
  //         throw new Error(`Server returned ${response.status}`);
  //       }

  //       const result = await response.json();

  //       console.log("Next SRN response:", result);

  //       if (!result.success) {
  //         throw new Error(
  //           result.message || "Failed to fetch service report number",
  //         );
  //       }

  //       const nextSRN = result.serviceReportNumber ?? result.srn;

  //       if (nextSRN === undefined || nextSRN === null) {
  //         throw new Error("Service report number was not received");
  //       }

  //       setServiceReportNumber(String(nextSRN));
  //     } catch (error) {
  //       console.error("Fetch SRN error:", error);

  //       notification.error({
  //         message: "SRN Error",
  //         description: error.message || "Unable to fetch service report number.",
  //         placement: "bottomRight",
  //       });
  //     } finally {
  //       setSrnLoading(false);
  //     }
  //   };

  //   const saveTechnicianSignature = () => {
  //     if (sigTechnician.current && !sigTechnician.current.isEmpty()) {
  //       setSignatureTechnician(
  //         sigTechnician.current.getCanvas().toDataURL("image/png"),
  //       );

  //       setIsTechnicianSignSaved(true);

  //       notification.success({
  //         message: "Success",
  //         description: "Technician signature saved successfully!",
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.error({
  //         message: "Error",
  //         description: "Please draw the technician signature before saving.",
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   const clearTechnicianSignature = () => {
  //     if (sigTechnician.current && !sigTechnician.current.isEmpty()) {
  //       sigTechnician.current.clear();

  //       setSignatureTechnician("");
  //       setIsTechnicianSignSaved(false);

  //       notification.success({
  //         message: "Success",
  //         description: "Technician signature cleared successfully!",
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.warning({
  //         message: "Warning",
  //         description: "No technician signature found to clear.",
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   const saveManagerSignature = () => {
  //     if (sigManager.current && !sigManager.current.isEmpty()) {
  //       setSignatureManager(
  //         sigManager.current.getCanvas().toDataURL("image/png"),
  //       );

  //       setIsManagerSignSaved(true);

  //       notification.success({
  //         message: "Success",
  //         description: "Manager signature saved successfully!",
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.error({
  //         message: "Error",
  //         description: "Please draw the manager signature before saving.",
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   const clearManagerSignature = () => {
  //     if (sigManager.current && !sigManager.current.isEmpty()) {
  //       sigManager.current.clear();

  //       setSignatureManager("");
  //       setIsManagerSignSaved(false);

  //       notification.success({
  //         message: "Success",
  //         description: "Manager signature cleared successfully!",
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.warning({
  //         message: "Warning",
  //         description: "No manager signature found to clear.",
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   const saveCustomerSignature = () => {
  //     if (sigCustomer.current && !sigCustomer.current.isEmpty()) {
  //       setSignatureCustomer(
  //         sigCustomer.current.getCanvas().toDataURL("image/png"),
  //       );

  //       setIsCustomerSignSaved(true);

  //       notification.success({
  //         message: "Success",
  //         description: "Customer signature saved successfully!",
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.error({
  //         message: "Error",
  //         description: "Please draw the customer signature before saving.",
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   const clearCustomerSignature = () => {
  //     if (sigCustomer.current && !sigCustomer.current.isEmpty()) {
  //       sigCustomer.current.clear();

  //       setSignatureCustomer("");
  //       setIsCustomerSignSaved(false);

  //       notification.success({
  //         message: "Success",
  //         description: "Customer signature cleared successfully!",
  //         placement: "bottomRight",
  //       });
  //     } else {
  //       notification.warning({
  //         message: "Warning",
  //         description: "No customer signature found to clear.",
  //         placement: "bottomRight",
  //       });
  //     }
  //   };

  //   // ==========================================================
  //   // FORM SUBMIT
  //   // ==========================================================

  // //   const handleSubmit = async (values) => {
  // //     console.log(values);

  // //     // ========================================================
  // //     // PREVENT DOUBLE SUBMISSION
  // //     // ========================================================

  // //     if (loading) {
  // //       return;
  // //     }

  // //     // ========================================================
  // //     // SIGNATURE VALIDATION
  // //     // ========================================================

  // //     const technicianSignatureReady =
  // //       isTechnicianSignSaved &&
  // //       Boolean(signatureTechnician) &&
  // //       sigTechnician.current &&
  // //       !sigTechnician.current.isEmpty();

  // //     const managerSignatureReady =
  // //       isManagerSignSaved &&
  // //       Boolean(signatureManager) &&
  // //       sigManager.current &&
  // //       !sigManager.current.isEmpty();

  // //     const customerSignatureReady =
  // //       isCustomerSignSaved &&
  // //       Boolean(signatureCustomer) &&
  // //       sigCustomer.current &&
  // //       !sigCustomer.current.isEmpty();

  // //     // --------------------------------------------------------
  // //     // TECHNICIAN SIGNATURE
  // //     // --------------------------------------------------------

  // //     if (!technicianSignatureReady) {
  // //       notification.error({
  // //         message: "Technician Signature Required",
  // //         description:
  // //           "Please draw the technician signature and click Save Signature before submitting the report.",
  // //         placement: "bottomRight",
  // //       });

  // //       return;
  // //     }

  // //     // --------------------------------------------------------
  // //     // MANAGER SIGNATURE
  // //     // --------------------------------------------------------

  // //     if (!managerSignatureReady) {
  // //       notification.error({
  // //         message: "Manager Signature Required",
  // //         description:
  // //           "Please draw the manager signature and click Save Signature before submitting the report.",
  // //         placement: "bottomRight",
  // //       });

  // //       return;
  // //     }

  // //     // --------------------------------------------------------
  // //     // CUSTOMER SIGNATURE
  // //     // --------------------------------------------------------

  // //     if (!customerSignatureReady) {
  // //       notification.error({
  // //         message: "Customer Signature Required",
  // //         description:
  // //           "Please draw the customer signature and click Save Signature before submitting the report.",
  // //         placement: "bottomRight",
  // //       });

  // //       return;
  // //     }

  // //     // ========================================================
  // //     // MAIN SUBMISSION
  // //     // ========================================================

  // //     try {
  // //       // ======================================================
  // //       // INTERNET CHECK
  // //       // ======================================================

  // //       if (!navigator.onLine) {
  // //         notification.error({
  // //           message: "No Internet Connection",
  // //           description: "Please check your internet and try again.",
  // //           placement: "bottomRight",
  // //         });

  // //         return;
  // //       }

  // //       // ======================================================
  // //       // START LOADING
  // //       // ======================================================

  // //       setLoading(true);

  // //       // ========================================================
  // //       // PARTS
  // //       // ========================================================

  // //       // ========================================================
  // //       // PARTS
  // //       // IMPORTANT: use the controlled Parts table state as the
  // //       // single source of truth for saving and PDF generation.
  // //       // ========================================================

  // //       const parts = partsFormData.map((part) => ({
  // //         partNo: String(part?.partNo ?? "").trim(),
  // //         description: String(part?.description ?? "").trim(),
  // //         qty: String(part?.qty ?? "").trim(),
  // //         usedRecommended: String(part?.usedRecommended ?? "").trim(),
  // //         remarks: String(part?.remarks ?? "").trim(),
  // //       }));

  // //       // Always keep all 3 default rows.
  // //       while (parts.length < 3) {
  // //         parts.push({
  // //           partNo: "",
  // //           description: "",
  // //           qty: "",
  // //           usedRecommended: "",
  // //           remarks: "",
  // //         });
  // //       }

  // //       // ========================================================
  // //       // PAYLOAD
  // //       // ========================================================

  // //       const payload = {
  // //         action: "saveReport",

  // //         // ======================================================
  // //         // CUSTOMER & VISIT
  // //         // ======================================================

  // //         customer: values.customer || "",
  // //         serviceDate: values.serviceDate || "",
  // //         siteLocation: values.siteLocation || "",
  // //         contactPerson: values.contactPerson || "",
  // //         contactNo: values.contactNo || "",
  // //         technician: Array.isArray(values.technician)
  // //           ? values.technician.join(", ")
  // //           : values.technician || "",
  // //         arrivalTime: values.arrivalTime || "",
  // //         completionTime: values.completionTime || "",
  // //         totalWorkingHours: values.totalWorkingHours ?? "",
  // //         serviceVisitRef: values.serviceVisitRef || "",

  // //         // ======================================================
  // //         // MACHINE
  // //         // ======================================================

  // //         machineModel: values.machineModel || "",
  // //         serialNo: values.serialNo || "",
  // //         installationYear: values.installationYear || "",
  // //         machineRunningHours: values.machineRunningHours ?? "",
  // //         softwareVersion: values.softwareVersion || "",
  // //         warrantyStatus: values.warrantyStatus || "",

  // //         // ======================================================
  // //         // SERVICE CATEGORY
  // //         // ======================================================

  // //         serviceCategory: JSON.stringify(values.serviceCategory || []),

  // //         // ======================================================
  // //         // COMPLAINT / DIAGNOSIS / WORK
  // //         // ======================================================

  // //         customerComplaint: values.customerComplaint || "",

  // //         technicianDiagnosis: values.technicianDiagnosis || "",

  // //         workPerformed: values.workPerformed || "",

  // //         // ======================================================
  // //         // MACHINE TRIAL
  // //         // ======================================================

  // //         machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),

  // //         trialDuration: values.trialDuration || "",

  // //         cycleTime: values.cycleTime || "",

  // //         productMaterial: values.productMaterial || "",

  // //         trialStatusRemarks: values.trialStatusRemarks || "",

  // //         // ======================================================
  // //         // PARTS
  // //         // ======================================================

  // //         parts: JSON.stringify(parts),

  // //         // ======================================================
  // //         // FURTHER ACTION
  // //         // ======================================================

  // //         furtherAction: JSON.stringify(values.furtherAction || []),

  // //         requiredActionFollowUp: values.requiredActionFollowUp || "",

  // //         // ======================================================
  // //         // COMMERCIAL
  // //         // ======================================================

  // //         serviceCommercialClassification: JSON.stringify(
  // //           values.serviceCommercialClassification || [],
  // //         ),

  // //         // ======================================================
  // //         // CUSTOMER ACKNOWLEDGEMENT
  // //         // ======================================================

  // //         technicianName: values.technicianName || "",

  // //         technicianDate: values.technicianDate || "",

  // //         managerName: values.managerName || "",

  // //         managerDate: values.managerDate || "",

  // //         customerName: values.customerName || "",

  // //         customerDate: values.customerDate || "",

  // //         // ======================================================
  // //         // SIGNATURES
  // //         // ======================================================

  // //         signatureTechnician: signatureTechnician || "",

  // //         signatureManager: signatureManager || "",

  // //         signatureCustomer: signatureCustomer || "",

  // //         // ======================================================
  // //         // LOGIN USER
  // //         // ======================================================

  // //         userEmail: user?.email || "",
  // //       };

  // //       // ========================================================
  // //       // DEBUG - CHECK SIGNATURES BEFORE SUBMISSION
  // //       // ========================================================

  // //       console.log("Technician signature saved:", isTechnicianSignSaved);
  // //       console.log("Manager signature saved:", isManagerSignSaved);
  // //       console.log("Customer signature saved:", isCustomerSignSaved);

  // //       console.log(
  // //         "Technician signature data:",
  // //         signatureTechnician ? "AVAILABLE" : "EMPTY",
  // //       );

  // //       console.log(
  // //         "Manager signature data:",
  // //         signatureManager ? "AVAILABLE" : "EMPTY",
  // //       );

  // //       console.log(
  // //         "Customer signature data:",
  // //         signatureCustomer ? "AVAILABLE" : "EMPTY",
  // //       );

  // //       // ========================================================
  // //       // CREATE FORM DATA
  // //       // ========================================================

  // //       const formData = new URLSearchParams();

  // //       Object.entries(payload).forEach(([key, value]) => {
  // //         formData.append(
  // //           key,
  // //           value === null || value === undefined ? "" : String(value),
  // //         );
  // //       });

  // //       // ========================================================
  // //       // SEND TO GOOGLE APPS SCRIPT
  // //       // ========================================================

  // //       const response = await fetch(GAS_URL, {
  // //         method: "POST",

  // //         headers: {
  // //           "Content-Type": "application/x-www-form-urlencoded",
  // //         },

  // //         body: formData.toString(),
  // //       });

  // //       // ========================================================
  // //       // SERVER RESPONSE CHECK
  // //       // ========================================================

  // //       if (!response.ok) {
  // //         throw new Error(`Server returned ${response.status}`);
  // //       }

  // //       const result = await response.json();

  // //       console.log("Backend response:", result);

  // //       // ========================================================
  // //       // BACKEND SUCCESS CHECK
  // //       // ========================================================

  // //       if (!result.success) {
  // //         throw new Error(result.message || "Failed to save service report");
  // //       }

  // //       // ========================================================
  // //       // GET SAVED REPORT NUMBER
  // //       // ========================================================

  // //       const savedReportNumber = result.serviceReportNumber ?? result.srn ?? "";

  // //       // ========================================================
  // //       // SUCCESS MESSAGE
  // //       // ========================================================

  // //       notification.success({
  // //         message: "Success",

  // //         description: savedReportNumber
  // //           ? `Service report ${savedReportNumber} saved successfully.`
  // //           : "Service report saved successfully.",

  // //         placement: "bottomRight",
  // //       });

  // //       // ========================================================
  // //       // GENERATE PDF AFTER SUCCESSFUL SAVE
  // //       // The PDF is generated only after the backend confirms
  // //       // that the service report was saved successfully.
  // //       // If PDF generation fails, the saved report remains safe.
  // //       // ========================================================

  // //       try {
  // //         // ======================================================
  // //         // GENERATE PDF
  // //         // ======================================================

  // //         // Use exactly the same Parts array that was sent to the backend.
  // //         // Do not rely on values.parts here because the Parts table is
  // //         // controlled independently from the Ant Design form.
  // //         const pdfValues = {
  // //           ...values,
  // //           parts,
  // //         };

  // //         const pdfResult = await generateServiceReportPDF(
  // //           pdfValues,
  // //           savedReportNumber || serviceReportNumber,
  // //           signatureTechnician,
  // //           signatureManager,
  // //           signatureCustomer,
  // //         );

  // //         // ======================================================
  // //         // UPLOAD PDF TO GOOGLE DRIVE THROUGH APPS SCRIPT
  // //         // ======================================================

  // //         const pdfFormData = new URLSearchParams();

  // //         pdfFormData.append("action", "uploadPdf");
  // //         pdfFormData.append("fileName", pdfResult.fileName);
  // //         pdfFormData.append("pdfBase64", pdfResult.pdfBase64);

  // //         const pdfUploadResponse = await fetch(GAS_URL, {
  // //           method: "POST",
  // //           headers: {
  // //             "Content-Type": "application/x-www-form-urlencoded",
  // //           },
  // //           body: pdfFormData.toString(),
  // //         });

  // //         if (!pdfUploadResponse.ok) {
  // //           throw new Error(
  // //             `PDF upload server returned ${pdfUploadResponse.status}`,
  // //           );
  // //         }

  // //         const pdfUploadResult = await pdfUploadResponse.json();

  // //         console.log("PDF upload response:", pdfUploadResult);

  // //         if (!pdfUploadResult.success) {
  // //           throw new Error(
  // //             pdfUploadResult.message || "Failed to upload PDF to Google Drive",
  // //           );
  // //         }

  // //         // ======================================================
  // //         // DOWNLOAD THE SAME PDF LOCALLY
  // //         // This preserves the previous application behavior.
  // //         // ======================================================

  // //         pdfResult.doc.save(pdfResult.fileName);

  // //         console.log(
  // //           "PDF saved to Google Drive:",
  // //           pdfUploadResult.fileUrl || pdfUploadResult.fileId,
  // //         );

  // //         notification.success({
  // //           message: "PDF Generated & Uploaded",
  // //           description: `Service report PDF ${pdfResult.fileName} was saved to Google Drive successfully.`,
  // //           placement: "bottomRight",
  // //         });
  // //       } catch (pdfError) {
  // //         console.error("PDF generation/upload error:", pdfError);

  // //         notification.warning({
  // //           message: "Report Saved, But PDF Upload Failed",
  // //           description: `The service report was saved successfully, but the PDF step failed: ${
  // //             pdfError?.message || "Unknown PDF error"
  // //           }`,
  // //           placement: "bottomRight",
  // //           duration: 8,
  // //         });
  // //       }

  // //       // ========================================================
  // //       // RESET FORM
  // //       // ========================================================

  // //       // form.resetFields();
  // //       // setSelectedTechnicians([]);

  // //       // ========================================================
  // //       // CLEAR TECHNICIAN SIGNATURE
  // //       // ========================================================

  // //       // if (sigTechnician.current) {
  // //       //   sigTechnician.current.clear();
  // //       // }

  // //       // setSignatureTechnician("");

  // //       // setIsTechnicianSignSaved(false);

  // //       // ========================================================
  // //       // CLEAR MANAGER SIGNATURE
  // //       // ========================================================

  // //       // if (sigManager.current) {
  // //       //   sigManager.current.clear();
  // //       // }

  // //       // setSignatureManager("");

  // //       // setIsManagerSignSaved(false);

  // //       // ========================================================
  // //       // CLEAR CUSTOMER SIGNATURE
  // //       // ========================================================

  // //       // if (sigCustomer.current) {
  // //       //   sigCustomer.current.clear();
  // //       // }

  // //       // setSignatureCustomer("");

  // //       // setIsCustomerSignSaved(false);

  // //       await fetchServiceReports();

  // //       // ========================================================
  // //       // FETCH NEXT SERVICE REPORT NUMBER
  // //       // ========================================================

  // //       try {
  // //         const srnResponse = await fetch(
  // //           `${GAS_URL}?action=getNextServiceReportNumber`,
  // //         );

  // //         if (!srnResponse.ok) {
  // //           throw new Error(`SRN server returned ${srnResponse.status}`);
  // //         }

  // //         const srnResult = await srnResponse.json();

  // //         console.log("Next Service Report Number:", srnResult);

  // //         if (!srnResult.success) {
  // //           throw new Error(
  // //             srnResult.message || "Failed to fetch next service report number",
  // //           );
  // //         }

  // //         const nextSRN = srnResult.serviceReportNumber ?? srnResult.srn ?? "";

  // //         if (nextSRN !== "") {
  // //           setServiceReportNumber(String(nextSRN));
  // //         }
  // //       } catch (srnError) {
  // //         console.error("Failed to fetch next SRN:", srnError);

  // //         // Do not show the main submission as failed
  // //         // because the report itself was already saved.
  // //         notification.warning({
  // //           message: "Report Saved, But SRN Refresh Failed",

  // //           description:
  // //             "The report was saved successfully, but the next Service Report Number could not be loaded. Please refresh the page.",

  // //           placement: "bottomRight",
  // //         });
  // //       }
  // //     } catch (error) {
  // //       // ========================================================
  // //       // ERROR
  // //       // ========================================================

  // //       console.error("Save report error:", error);

  // //       notification.error({
  // //         message: "Error",

  // //         description: error.message || "Failed to save service report.",

  // //         placement: "bottomRight",
  // //       });
  // //     } finally {
  // //       // ========================================================
  // //       // STOP LOADING
  // //       // ========================================================

  // //       setLoading(false);
  // //     }
  // //   };

  // // ==========================================================
  // // FORM SUBMIT
  // // ==========================================================

  // const handleSubmit = async (values) => {
  //   console.log(values);

  //   // ========================================================
  //   // PREVENT DOUBLE SUBMISSION
  //   // ========================================================

  //   if (loading) {
  //     return;
  //   }

  //   // ========================================================
  //   // SIGNATURE VALIDATION
  //   // ========================================================

  //   const technicianSignatureReady =
  //     isTechnicianSignSaved &&
  //     Boolean(signatureTechnician) &&
  //     sigTechnician.current &&
  //     !sigTechnician.current.isEmpty();

  //   const managerSignatureReady =
  //     isManagerSignSaved &&
  //     Boolean(signatureManager) &&
  //     sigManager.current &&
  //     !sigManager.current.isEmpty();

  //   const customerSignatureReady =
  //     isCustomerSignSaved &&
  //     Boolean(signatureCustomer) &&
  //     sigCustomer.current &&
  //     !sigCustomer.current.isEmpty();

  //   // --------------------------------------------------------
  //   // TECHNICIAN SIGNATURE
  //   // --------------------------------------------------------

  //   if (!technicianSignatureReady) {
  //     notification.error({
  //       message: "Technician Signature Required",
  //       description:
  //         "Please draw the technician signature and click Save Signature before submitting the report.",
  //       placement: "bottomRight",
  //     });

  //     return;
  //   }

  //   // --------------------------------------------------------
  //   // MANAGER SIGNATURE
  //   // --------------------------------------------------------

  //   if (!managerSignatureReady) {
  //     notification.error({
  //       message: "Manager Signature Required",
  //       description:
  //         "Please draw the manager signature and click Save Signature before submitting the report.",
  //       placement: "bottomRight",
  //     });

  //     return;
  //   }

  //   // --------------------------------------------------------
  //   // CUSTOMER SIGNATURE
  //   // --------------------------------------------------------

  //   if (!customerSignatureReady) {
  //     notification.error({
  //       message: "Customer Signature Required",
  //       description:
  //         "Please draw the customer signature and click Save Signature before submitting the report.",
  //       placement: "bottomRight",
  //     });

  //     return;
  //   }

  //   // ========================================================
  //   // MAIN SUBMISSION
  //   // ========================================================

  //   try {
  //     // ======================================================
  //     // INTERNET CHECK
  //     // ======================================================

  //     if (!navigator.onLine) {
  //       notification.error({
  //         message: "No Internet Connection",
  //         description: "Please check your internet and try again.",
  //         placement: "bottomRight",
  //       });

  //       return;
  //     }

  //     // ======================================================
  //     // START LOADING
  //     // ======================================================

  //     setLoading(true);

  //     // ======================================================
  //     // PARTS
  //     // IMPORTANT: use the controlled Parts table state as
  //     // the single source of truth for saving and PDF generation.
  //     // ======================================================

  //     const parts = partsFormData.map((part) => ({
  //       partNo: String(part?.partNo ?? "").trim(),
  //       description: String(part?.description ?? "").trim(),
  //       qty: String(part?.qty ?? "").trim(),
  //       usedRecommended: String(part?.usedRecommended ?? "").trim(),
  //       remarks: String(part?.remarks ?? "").trim(),
  //     }));

  //     // Always keep all 3 default rows.
  //     while (parts.length < 3) {
  //       parts.push({
  //         partNo: "",
  //         description: "",
  //         qty: "",
  //         usedRecommended: "",
  //         remarks: "",
  //       });
  //     }

  //     // ========================================================
  //     // PAYLOAD
  //     // ========================================================

  //     const payload = {
  //       action: "saveReport",

  //       // ======================================================
  //       // CUSTOMER & VISIT
  //       // ======================================================

  //       customer: values.customer || "",
  //       serviceDate: values.serviceDate || "",
  //       siteLocation: values.siteLocation || "",
  //       contactPerson: values.contactPerson || "",
  //       contactNo: values.contactNo || "",

  //       technician: Array.isArray(values.technician)
  //         ? values.technician.join(", ")
  //         : values.technician || "",

  //       arrivalTime: values.arrivalTime || "",
  //       completionTime: values.completionTime || "",
  //       totalWorkingHours: values.totalWorkingHours ?? "",
  //       serviceVisitRef: values.serviceVisitRef || "",

  //       // ======================================================
  //       // MACHINE
  //       // ======================================================

  //       machineModel: values.machineModel || "",
  //       serialNo: values.serialNo || "",
  //       installationYear: values.installationYear || "",
  //       machineRunningHours: values.machineRunningHours ?? "",
  //       softwareVersion: values.softwareVersion || "",
  //       warrantyStatus: values.warrantyStatus || "",

  //       // ======================================================
  //       // SERVICE CATEGORY
  //       // ======================================================

  //       serviceCategory: JSON.stringify(values.serviceCategory || []),

  //       // ======================================================
  //       // COMPLAINT / DIAGNOSIS / WORK
  //       // ======================================================

  //       customerComplaint: values.customerComplaint || "",

  //       technicianDiagnosis: values.technicianDiagnosis || "",

  //       workPerformed: values.workPerformed || "",

  //       // ======================================================
  //       // MACHINE TRIAL
  //       // ======================================================

  //       machineTrialStatus: JSON.stringify(
  //         values.machineTrialStatus || [],
  //       ),

  //       trialDuration: values.trialDuration || "",

  //       cycleTime: values.cycleTime || "",

  //       productMaterial: values.productMaterial || "",

  //       trialStatusRemarks: values.trialStatusRemarks || "",

  //       // ======================================================
  //       // PARTS
  //       // ======================================================

  //       parts: JSON.stringify(parts),

  //       // ======================================================
  //       // FURTHER ACTION
  //       // ======================================================

  //       furtherAction: JSON.stringify(values.furtherAction || []),

  //       requiredActionFollowUp:
  //         values.requiredActionFollowUp || "",

  //       // ======================================================
  //       // COMMERCIAL
  //       // ======================================================

  //       serviceCommercialClassification: JSON.stringify(
  //         values.serviceCommercialClassification || [],
  //       ),

  //       // ======================================================
  //       // CUSTOMER ACKNOWLEDGEMENT
  //       // ======================================================

  //       technicianName: values.technicianName || "",
  //       technicianDate: values.technicianDate || "",

  //       managerName: values.managerName || "",
  //       managerDate: values.managerDate || "",

  //       customerName: values.customerName || "",
  //       customerDate: values.customerDate || "",

  //       // ======================================================
  //       // SIGNATURES
  //       // ======================================================

  //       signatureTechnician: signatureTechnician || "",
  //       signatureManager: signatureManager || "",
  //       signatureCustomer: signatureCustomer || "",

  //       // ======================================================
  //       // LOGIN USER
  //       // ======================================================

  //       userEmail: user?.email || "",
  //     };

  //     // ========================================================
  //     // DEBUG - CHECK SIGNATURES BEFORE SUBMISSION
  //     // ========================================================

  //     console.log(
  //       "Technician signature saved:",
  //       isTechnicianSignSaved,
  //     );

  //     console.log(
  //       "Manager signature saved:",
  //       isManagerSignSaved,
  //     );

  //     console.log(
  //       "Customer signature saved:",
  //       isCustomerSignSaved,
  //     );

  //     console.log(
  //       "Technician signature data:",
  //       signatureTechnician ? "AVAILABLE" : "EMPTY",
  //     );

  //     console.log(
  //       "Manager signature data:",
  //       signatureManager ? "AVAILABLE" : "EMPTY",
  //     );

  //     console.log(
  //       "Customer signature data:",
  //       signatureCustomer ? "AVAILABLE" : "EMPTY",
  //     );

  //     // ========================================================
  //     // CREATE FORM DATA
  //     // ========================================================

  //     const formData = new URLSearchParams();

  //     Object.entries(payload).forEach(([key, value]) => {
  //       formData.append(
  //         key,
  //         value === null || value === undefined
  //           ? ""
  //           : String(value),
  //       );
  //     });

  //     // ========================================================
  //     // SEND TO GOOGLE APPS SCRIPT
  //     // ========================================================

  //     const response = await fetch(GAS_URL, {
  //       method: "POST",

  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },

  //       body: formData.toString(),
  //     });

  //     // ========================================================
  //     // SERVER RESPONSE CHECK
  //     // ========================================================

  //     if (!response.ok) {
  //       throw new Error(`Server returned ${response.status}`);
  //     }

  //     const result = await response.json();

  //     console.log("Backend response:", result);

  //     // ========================================================
  //     // BACKEND SUCCESS CHECK
  //     // ========================================================

  //     if (!result.success) {
  //       throw new Error(
  //         result.message || "Failed to save service report",
  //       );
  //     }

  //     // ========================================================
  //     // GET SAVED REPORT NUMBER
  //     // ========================================================

  //     const savedReportNumber =
  //       result.serviceReportNumber ??
  //       result.srn ??
  //       "";

  //     // ========================================================
  //     // SUCCESS MESSAGE
  //     // ========================================================

  //     notification.success({
  //       message: "Success",

  //       description: savedReportNumber
  //         ? `Service report ${savedReportNumber} saved successfully.`
  //         : "Service report saved successfully.",

  //       placement: "bottomRight",
  //     });

  //     // ========================================================
  //     // GENERATE PDF AFTER SUCCESSFUL SAVE
  //     // ========================================================

  //     try {
  //       // ======================================================
  //       // GENERATE PDF
  //       // ======================================================

  //       // IMPORTANT:
  //       // Generate the PDF BEFORE clearing the form.
  //       // This ensures the submitted values and signatures
  //       // are still available for the PDF.

  //       const pdfValues = {
  //         ...values,
  //         parts,
  //       };

  //       const pdfResult = await generateServiceReportPDF(
  //         pdfValues,
  //         savedReportNumber || serviceReportNumber,
  //         signatureTechnician,
  //         signatureManager,
  //         signatureCustomer,
  //       );

  //       // ======================================================
  //       // UPLOAD PDF TO GOOGLE DRIVE THROUGH APPS SCRIPT
  //       // ======================================================

  //       const pdfFormData = new URLSearchParams();

  //       pdfFormData.append(
  //         "action",
  //         "uploadPdf",
  //       );

  //       pdfFormData.append(
  //         "fileName",
  //         pdfResult.fileName,
  //       );

  //       pdfFormData.append(
  //         "pdfBase64",
  //         pdfResult.pdfBase64,
  //       );

  //       const pdfUploadResponse = await fetch(GAS_URL, {
  //         method: "POST",

  //         headers: {
  //           "Content-Type":
  //             "application/x-www-form-urlencoded",
  //         },

  //         body: pdfFormData.toString(),
  //       });

  //       if (!pdfUploadResponse.ok) {
  //         throw new Error(
  //           `PDF upload server returned ${pdfUploadResponse.status}`,
  //         );
  //       }

  //       const pdfUploadResult =
  //         await pdfUploadResponse.json();

  //       console.log(
  //         "PDF upload response:",
  //         pdfUploadResult,
  //       );

  //       if (!pdfUploadResult.success) {
  //         throw new Error(
  //           pdfUploadResult.message ||
  //             "Failed to upload PDF to Google Drive",
  //         );
  //       }

  //       // ======================================================
  //       // DOWNLOAD THE SAME PDF LOCALLY
  //       // ======================================================

  //       pdfResult.doc.save(pdfResult.fileName);

  //       console.log(
  //         "PDF saved to Google Drive:",
  //         pdfUploadResult.fileUrl ||
  //           pdfUploadResult.fileId,
  //       );

  //       notification.success({
  //         message: "PDF Generated & Uploaded",

  //         description: `Service report PDF ${pdfResult.fileName} was saved to Google Drive successfully.`,

  //         placement: "bottomRight",
  //       });
  //     } catch (pdfError) {
  //       // ======================================================
  //       // PDF ERROR
  //       // ======================================================

  //       console.error(
  //         "PDF generation/upload error:",
  //         pdfError,
  //       );

  //       notification.warning({
  //         message: "Report Saved, But PDF Upload Failed",

  //         description: `The service report was saved successfully, but the PDF step failed: ${
  //           pdfError?.message || "Unknown PDF error"
  //         }`,

  //         placement: "bottomRight",

  //         duration: 8,
  //       });
  //     }

  //     // ========================================================
  //     // RESET NEW REPORT FORM
  //     // ========================================================
  //     //
  //     // IMPORTANT:
  //     // This section runs ONLY after the backend has confirmed
  //     // successful saving.
  //     //
  //     // The PDF has also already been generated using the
  //     // original values before the form is cleared.
  //     // ========================================================

  //     // --------------------------------------------------------
  //     // RESET ALL ANT DESIGN FORM FIELDS
  //     // --------------------------------------------------------

  //     form.resetFields();

  //     // --------------------------------------------------------
  //     // RESET SELECTED TECHNICIANS
  //     // --------------------------------------------------------

  //     setSelectedTechnicians([]);

  //     // --------------------------------------------------------
  //     // RESET CUSTOMER/AUTOFILL STATE
  //     // --------------------------------------------------------

  //     setAddress("");

  //     setSerialNumber("");

  //     // --------------------------------------------------------
  //     // RESET PARTS TABLE
  //     // --------------------------------------------------------

  //     setPartsFormData([
  //       {
  //         key: 0,
  //         partNo: "",
  //         description: "",
  //         qty: "",
  //         usedRecommended: "",
  //         remarks: "",
  //       },
  //       {
  //         key: 1,
  //         partNo: "",
  //         description: "",
  //         qty: "",
  //         usedRecommended: "",
  //         remarks: "",
  //       },
  //       {
  //         key: 2,
  //         partNo: "",
  //         description: "",
  //         qty: "",
  //         usedRecommended: "",
  //         remarks: "",
  //       },
  //     ]);

  //     // --------------------------------------------------------
  //     // CLEAR TECHNICIAN SIGNATURE
  //     // --------------------------------------------------------

  //     if (sigTechnician.current) {
  //       sigTechnician.current.clear();
  //     }

  //     setSignatureTechnician("");

  //     setIsTechnicianSignSaved(false);

  //     // --------------------------------------------------------
  //     // CLEAR MANAGER SIGNATURE
  //     // --------------------------------------------------------

  //     if (sigManager.current) {
  //       sigManager.current.clear();
  //     }

  //     setSignatureManager("");

  //     setIsManagerSignSaved(false);

  //     // --------------------------------------------------------
  //     // CLEAR CUSTOMER SIGNATURE
  //     // --------------------------------------------------------

  //     if (sigCustomer.current) {
  //       sigCustomer.current.clear();
  //     }

  //     setSignatureCustomer("");

  //     setIsCustomerSignSaved(false);

  //     // ========================================================
  //     // REFRESH SERVICE REPORT TABLE
  //     // ========================================================

  //     await fetchServiceReports();

  //     // ========================================================
  //     // FETCH NEXT SERVICE REPORT NUMBER
  //     // ========================================================

  //     try {
  //       const srnResponse = await fetch(
  //         `${GAS_URL}?action=getNextServiceReportNumber`,
  //       );

  //       if (!srnResponse.ok) {
  //         throw new Error(
  //           `SRN server returned ${srnResponse.status}`,
  //         );
  //       }

  //       const srnResult = await srnResponse.json();

  //       console.log(
  //         "Next Service Report Number:",
  //         srnResult,
  //       );

  //       if (!srnResult.success) {
  //         throw new Error(
  //           srnResult.message ||
  //             "Failed to fetch next service report number",
  //         );
  //       }

  //       const nextSRN =
  //         srnResult.serviceReportNumber ??
  //         srnResult.srn ??
  //         "";

  //       if (nextSRN !== "") {
  //         setServiceReportNumber(
  //           String(nextSRN),
  //         );
  //       }
  //     } catch (srnError) {
  //       console.error(
  //         "Failed to fetch next SRN:",
  //         srnError,
  //       );

  //       // Do not show the main submission as failed
  //       // because the report itself was already saved.

  //       notification.warning({
  //         message:
  //           "Report Saved, But SRN Refresh Failed",

  //         description:
  //           "The report was saved successfully, but the next Service Report Number could not be loaded. Please refresh the page.",

  //         placement: "bottomRight",
  //       });
  //     }
  //   } catch (error) {
  //     // ========================================================
  //     // ERROR
  //     // ========================================================

  //     console.error(
  //       "Save report error:",
  //       error,
  //     );

  //     notification.error({
  //       message: "Error",

  //       description:
  //         error.message ||
  //         "Failed to save service report.",

  //       placement: "bottomRight",
  //     });
  //   } finally {
  //     // ========================================================
  //     // STOP LOADING
  //     // ========================================================

  //     setLoading(false);
  //   }
  // };

  //   // ==========================================================
  //   // REQUIRED FIELD RULE
  //   // ==========================================================

  //   const requiredRule = (fieldName) => [
  //     {
  //       required: true,
  //       message: `Please enter ${fieldName}`,
  //     },
  //   ];

  //   // ==========================================================
  //   // DATE VALIDATION
  //   // DD-MM-YYYY
  //   // ==========================================================

  //   const dateRule = (fieldName) => [
  //     {
  //       required: true,
  //       message: `Please enter ${fieldName}`,
  //     },
  //     {
  //       pattern: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
  //       message: "Please enter date in DD-MM-YYYY format",
  //     },
  //   ];

  //   // ==========================================================
  //   // TIME VALIDATION
  //   // HH:MM
  //   // ==========================================================

  //   const timeRule = (fieldName) => [
  //     {
  //       required: true,
  //       message: `Please enter ${fieldName}`,
  //     },
  //     {
  //       pattern: /^([01]\d|2[0-3]):([0-5]\d)$/,
  //       message: "Please enter time in HH:MM (24 hr) format",
  //     },
  //   ];

  //   const formatHHMM = (value = "") => {
  //     // Remove everything except numbers
  //     let digits = value.replace(/\D/g, "").slice(0, 4);

  //     // Automatically add colon after HH
  //     if (digits.length >= 3) {
  //       return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  //     }

  //     return digits;
  //   };

  //   // ==========================================================
  //   // CONTACT NUMBER VALIDATION
  //   // ==========================================================

  //   const contactNumberRule = [
  //     {
  //       required: true,
  //       message: "Please enter contact number",
  //     },
  //     {
  //       pattern: /^[0-9+\-\s()]+$/,
  //       message: "Please enter a valid contact number",
  //     },
  //   ];

  //   // ==========================================================
  //   // RETURN
  //   // ==========================================================

  //   return (
  //     <div className="service-form-page">
  //       {/* ====================================================== */}
  //       {/* HEADER */}
  //       {/* ====================================================== */}

  //       <div className="service-form-header">
  //         {/* ================================================== */}
  //         {/* HAITIAN LOGO */}
  //         {/* ================================================== */}

  //         <div className="service-form-header-logo-wrap">
  //           <img
  //             src={HaitianLogo}
  //             alt="Haitian Logo"
  //             className="img-fluid service-form-header-logo"
  //           />
  //         </div>

  //         {/* ================================================== */}
  //         {/* SERVICE REPORT NUMBER */}
  //         {/* EXACT CENTER OF PAGE */}
  //         {/* ================================================== */}

  //         <div className="service-form-header-number">
  //           <p
  //             style={{
  //               margin: 0,
  //               padding: 0,
  //               color: "#0D3884",
  //               fontWeight: "bold",
  //               fontSize: "20px",
  //               whiteSpace: "normal",
  //             }}
  //           >
  //             Service Report No:{" "}
  //             {srnLoading ? "Loading..." : serviceReportNumber || "---"}
  //           </p>
  //         </div>

  //         {/* ================================================== */}
  //         {/* USER AVATAR */}
  //         {/* ================================================== */}

  //         <div className="service-form-header-user">
  //           <Dropdown
  //             placement="bottomRight"
  //             open={open}
  //             onOpenChange={(flag) => setOpen(flag)}
  //             trigger={["click"]}
  //             dropdownRender={() => {
  //               const email = user?.email || "";

  //               const username = email.split("@")[0] || "User";

  //               const initials =
  //                 user?.name?.substring(0, 2).toUpperCase() ||
  //                 email.substring(0, 2).toUpperCase() ||
  //                 "US";

  //               return (
  //                 <div
  //                   style={{
  //                     minWidth: 250,
  //                     borderRadius: 12,
  //                     overflow: "hidden",
  //                     backgroundColor: "#fff",
  //                     boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  //                   }}
  //                 >
  //                   {/* ======================================== */}
  //                   {/* DROPDOWN HEADER */}
  //                   {/* ======================================== */}

  //                   <div
  //                     style={{
  //                       backgroundColor: "#0D3884",
  //                       color: "#fff",
  //                       display: "flex",
  //                       alignItems: "center",
  //                       padding: "16px",
  //                     }}
  //                   >
  //                     <Avatar
  //                       size={48}
  //                       style={{
  //                         backgroundColor: "transparent",
  //                         border: "2px solid #fff",
  //                         color: "#fff",
  //                         fontWeight: "bold",
  //                         marginRight: 12,
  //                       }}
  //                     >
  //                       {initials}
  //                     </Avatar>

  //                     <div>
  //                       <div
  //                         style={{
  //                           fontSize: 12,
  //                           opacity: 0.9,
  //                         }}
  //                       >
  //                         Welcome back
  //                       </div>

  //                       <Tooltip title={username}>
  //                         <div
  //                           style={{
  //                             fontWeight: 600,
  //                             fontSize: 16,
  //                             maxWidth: 150,
  //                             overflow: "hidden",
  //                             textOverflow: "ellipsis",
  //                             whiteSpace: "nowrap",
  //                           }}
  //                         >
  //                           {username}
  //                         </div>
  //                       </Tooltip>
  //                     </div>
  //                   </div>

  //                   {/* ======================================== */}
  //                   {/* DROPDOWN BODY */}
  //                   {/* ======================================== */}

  //                   <div
  //                     style={{
  //                       backgroundColor: "#fff",
  //                       padding: "16px",
  //                     }}
  //                   >
  //                     {/* EMAIL */}

  //                     <div
  //                       style={{
  //                         display: "flex",
  //                         alignItems: "center",
  //                         marginBottom: 16,
  //                       }}
  //                     >
  //                       <MailOutlined
  //                         style={{
  //                           marginRight: 8,
  //                           color: "#444",
  //                         }}
  //                       />

  //                       <Tooltip title={email}>
  //                         <span
  //                           style={{
  //                             fontSize: 14,
  //                             maxWidth: 160,
  //                             overflow: "hidden",
  //                             textOverflow: "ellipsis",
  //                             whiteSpace: "nowrap",
  //                             display: "inline-block",
  //                           }}
  //                         >
  //                           {email}
  //                         </span>
  //                       </Tooltip>
  //                     </div>

  //                     {/* LOGOUT BUTTON */}

  //                     <Button
  //                       type="primary"
  //                       danger
  //                       block
  //                       icon={<LogoutOutlined />}
  //                       onClick={() => {
  //                         setOpen(false);

  //                         if (onLogout) {
  //                           onLogout();
  //                         }
  //                       }}
  //                       style={{
  //                         borderRadius: 8,
  //                         fontWeight: 500,
  //                       }}
  //                     >
  //                       Logout
  //                     </Button>
  //                   </div>
  //                 </div>
  //               );
  //             }}
  //           >
  //             {/* MAIN AVATAR */}

  //             <Avatar
  //               size="large"
  //               style={{
  //                 backgroundColor: "#0D3884",
  //                 cursor: "pointer",
  //                 fontWeight: "bold",
  //                 userSelect: "none",
  //               }}
  //             >
  //               {user?.name?.substring(0, 2).toUpperCase() ||
  //                 user?.email?.substring(0, 2).toUpperCase() ||
  //                 "US"}
  //             </Avatar>
  //           </Dropdown>
  //         </div>
  //       </div>

  //       {/* ====================================================== */}
  //       {/* FORM */}
  //       {/* ====================================================== */}

  //       <Form
  //         form={form}
  //         layout="vertical"
  //         onFinish={handleSubmit}
  //         requiredMark={true}
  //       >
  //         {/* ==================================================== */}
  //         {/* 1. CUSTOMER & VISIT INFORMATION */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="1. CUSTOMER & VISIT INFORMATION" />

  //         <div className="row">
  //           {/* ================================================= */}
  //           {/* CUSTOMER */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Customer"
  //               name="customer"
  //               rules={requiredRule("customer")}
  //             >
  //               <AutoComplete
  //                 allowClear
  //                 showSearch
  //                 placeholder="Type or select customer name"
  //                 onSearch={handleCustomerSearch}
  //                 onChange={handleCustomerChange}
  //                 onSelect={(value) => handleCustomerChange(value)}
  //                 options={customerOptions.map((name) => ({
  //                   label: name,
  //                   value: name,
  //                 }))}
  //                 filterOption={(inputValue, option) =>
  //                   String(option?.value || "")
  //                     .toLowerCase()
  //                     .includes(String(inputValue || "").toLowerCase())
  //                 }
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* SERVICE DATE */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Service Date"
  //               name="serviceDate"
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Please enter service date",
  //                 },
  //                 {
  //                   pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                   message: "Enter date in DD-MM-YYYY format",
  //                 },
  //               ]}
  //             >
  //               <Input
  //                 placeholder="DD-MM-YYYY"
  //                 value={form.getFieldValue("serviceDate") || ""}
  //                 onChange={(e) => {
  //                   const formatted = formatDDMMYYYY(e.target.value);

  //                   form.setFieldsValue({
  //                     serviceDate: formatted,
  //                   });
  //                 }}
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* SITE / LOCATION */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Site / Location"
  //               name="siteLocation"
  //               rules={requiredRule("site / location")}
  //             >
  //               <Input size="large" placeholder="Enter site / location" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* CONTACT PERSON */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Contact Person"
  //               name="contactPerson"
  //               rules={requiredRule("contact person")}
  //             >
  //               <Input size="large" placeholder="Enter contact person" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* CONTACT NUMBER */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Contact No."
  //               name="contactNo"
  //               rules={contactNumberRule}
  //             >
  //               <Input size="large" placeholder="Enter contact number" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* TECHNICIAN */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Technician"
  //               name="technician"
  //               rules={requiredRule("technician")}
  //             >
  //               <Select
  //                 mode="multiple"
  //                 size="large"
  //                 placeholder="Select up to 5 technicians"
  //                 value={selectedTechnicians}
  //                 onChange={handleTechChange}
  //                 maxTagCount="responsive"
  //                 optionFilterProp="label"
  //                 style={{ width: "100%" }}
  //                 options={technicianOptions.map((technician) => ({
  //                   label: technician,
  //                   value: technician,
  //                   disabled:
  //                     selectedTechnicians.length >= 5 &&
  //                     !selectedTechnicians.includes(technician),
  //                 }))}
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* ARRIVAL TIME */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Arrival Time"
  //               name="arrivalTime"
  //               rules={timeRule("arrival time")}
  //             >
  //               <Input
  //                 size="large"
  //                 placeholder="HH:MM"
  //                 maxLength={5}
  //                 inputMode="numeric"
  //                 onChange={(e) => {
  //                   const formatted = formatHHMM(e.target.value);

  //                   form.setFieldsValue({
  //                     arrivalTime: formatted,
  //                   });
  //                 }}
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* COMPLETION TIME */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Completion Time"
  //               name="completionTime"
  //               rules={timeRule("completion time")}
  //             >
  //               <Input
  //                 size="large"
  //                 placeholder="HH:MM"
  //                 maxLength={5}
  //                 inputMode="numeric"
  //                 onChange={(e) => {
  //                   const formatted = formatHHMM(e.target.value);

  //                   form.setFieldsValue({
  //                     completionTime: formatted,
  //                   });
  //                 }}
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* TOTAL WORKING HOURS */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Total Working Hours"
  //               name="totalWorkingHours"
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Please enter total working hours",
  //                 },
  //               ]}
  //             >
  //               <Input
  //                 size="large"
  //                 style={{
  //                   width: "100%",
  //                 }}
  //                 placeholder="Enter total working hours"
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* SERVICE VISIT REF */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Service Visit Ref."
  //               name="serviceVisitRef"
  //               rules={requiredRule("service visit reference")}
  //             >
  //               <Input size="large" placeholder="Enter service visit reference" />
  //             </Form.Item>
  //           </div>
  //         </div>

  //         {/* ==================================================== */}
  //         {/* 2. MACHINE INFORMATION */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="2. MACHINE INFORMATION" />

  //         <div className="row">
  //           {/* ================================================= */}
  //           {/* MACHINE MODEL */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Machine Model"
  //               name="machineModel"
  //               rules={requiredRule("machine model")}
  //             >
  //               <Input size="large" placeholder="Enter machine model" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* SERIAL NUMBER */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Serial No."
  //               name="serialNo"
  //               rules={requiredRule("serial number")}
  //             >
  //               <Input size="large" placeholder="Enter serial number" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* INSTALLATION DATE */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Installation Year"
  //               name="installationYear"
  //               rules={requiredRule("installation year")}
  //             >
  //               <Input size="large" placeholder="Enter installation year" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* MACHINE RUNNING HOURS */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item label="Machine Running Hours" name="machineRunningHours">
  //               <Input
  //                 size="large"
  //                 min={0}
  //                 style={{
  //                   width: "100%",
  //                 }}
  //                 placeholder="Enter machine running hours"
  //               />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* CONTROLLER / SOFTWARE VERSION */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Controller"
  //               name="softwareVersion"
  //               rules={requiredRule("controller")}
  //             >
  //               <Input size="large" placeholder="Enter controller" />
  //             </Form.Item>
  //           </div>

  //           {/* ================================================= */}
  //           {/* WARRANTY STATUS */}
  //           {/* ================================================= */}

  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Warranty Status"
  //               name="warrantyStatus"
  //               rules={requiredRule("warranty status")}
  //             >
  //               <Input size="large" placeholder="Enter warranty status" />
  //             </Form.Item>
  //           </div>
  //         </div>

  //         {/* ==================================================== */}
  //         {/* 3. SERVICE CATEGORY */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="3. SERVICE CATEGORY" />

  //         <Form.Item
  //           name="serviceCategory"
  //           rules={[
  //             {
  //               required: true,
  //               type: "array",
  //               min: 1,
  //               message: "Please select at least one service category",
  //             },
  //           ]}
  //         >
  //           <Checkbox.Group style={{ width: "100%" }}>
  //             <div className="service-category-options">
  //               <Checkbox value="installation">
  //                 Installation / Commissioning
  //               </Checkbox>

  //               <Checkbox value="breakdown">Breakdown / Defect</Checkbox>

  //               <Checkbox value="preventive">Preventive Maintenance</Checkbox>

  //               <Checkbox value="corrective">Corrective Maintenance</Checkbox>

  //               <Checkbox value="inspection">Inspection</Checkbox>

  //               <Checkbox value="customerVisit">Customer Visit</Checkbox>

  //               <Checkbox value="software">Software / Program</Checkbox>

  //               <Checkbox value="other">Other</Checkbox>
  //             </div>
  //           </Checkbox.Group>
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 4. CUSTOMER COMPLAINT / REPORTED PROBLEM */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

  //         <Form.Item
  //           name="customerComplaint"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter customer complaint / reported problem",
  //             },
  //           ]}
  //         >
  //           <TextArea
  //             rows={3}
  //             maxLength={512}
  //             showCount
  //             placeholder="Enter customer complaint / reported problem"
  //             onChange={handleCustomerComplaintChange}
  //           />
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 5. TECHNICIAN DIAGNOSIS / ROOT CAUSE */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

  //         <Form.Item
  //           name="technicianDiagnosis"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter technician diagnosis / root cause",
  //             },
  //           ]}
  //         >
  //           <TextArea
  //             rows={3}
  //             maxLength={512}
  //             showCount
  //             placeholder="Enter technician diagnosis / root cause"
  //             onChange={handleTechnicianDiagnosisChange}
  //           />
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 6. WORK PERFORMED / CORRECTIVE ACTION */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

  //         <Form.Item
  //           name="workPerformed"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter work performed / corrective action",
  //             },
  //           ]}
  //         >
  //           <TextArea
  //             rows={3}
  //             maxLength={512}
  //             showCount
  //             placeholder="Enter work performed / corrective action"
  //             onChange={handleWorkPerformedChange}
  //           />
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 7. MACHINE TRIAL & FINAL STATUS */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />

  //         {/* MACHINE STATUS CHECKBOXES */}

  //         {/* MACHINE TRIAL STATUS */}

  //         <Form.Item
  //           name="machineTrialStatus"
  //           rules={[
  //             {
  //               required: true,
  //               type: "array",
  //               min: 1,
  //               message: "Please select machine trial status",
  //             },
  //           ]}
  //         >
  //           <Checkbox.Group style={{ width: "100%" }}>
  //             <div className="machine-trial-options">
  //               <Checkbox value="machineTestedSuccessfully">
  //                 Machine tested successfully
  //               </Checkbox>

  //               <Checkbox value="machineRunningNormally">
  //                 Machine running normally
  //               </Checkbox>

  //               <Checkbox value="runningWithObservation">
  //                 Running with observation
  //               </Checkbox>

  //               <Checkbox value="machineStopped">
  //                 Machine stopped - further action required
  //               </Checkbox>

  //               <Checkbox value="customerAdvised">
  //                 Customer advised / awaiting action
  //               </Checkbox>
  //             </div>
  //           </Checkbox.Group>
  //         </Form.Item>

  //         {/* TRIAL DURATION / CYCLE TIME */}

  //         <div className="row">
  //           {/* TRIAL DURATION */}
  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Trial Duration"
  //               name="trialDuration"
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Please enter trial duration",
  //                 },
  //               ]}
  //             >
  //               <Input placeholder="Enter trial duration" />
  //             </Form.Item>
  //           </div>

  //           {/* CYCLE TIME */}
  //           <div className="col-md-6">
  //             <Form.Item
  //               label="Cycle Time"
  //               name="cycleTime"
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Please enter cycle time",
  //                 },
  //               ]}
  //             >
  //               <Input placeholder="Enter cycle time" />
  //             </Form.Item>
  //           </div>
  //         </div>

  //         {/* PRODUCT / MATERIAL / FINAL REMARKS */}

  //         <div className="row">
  //           {/* PRODUCT / MATERIAL */}
  //           <div className="col-md-12">
  //             <Form.Item
  //               label="Product / Material"
  //               name="productMaterial"
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Please enter product / material",
  //                 },
  //               ]}
  //             >
  //               <Input
  //                 maxLength={100}
  //                 showCount
  //                 placeholder="Enter product material"
  //                 onChange={handleProductMaterialChange}
  //               />{" "}
  //             </Form.Item>
  //           </div>
  //         </div>

  //         {/* TRIAL / STATUS REMARKS */}

  //         <Form.Item
  //           label="Trial / Status Remarks"
  //           name="trialStatusRemarks"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter trial / status remarks",
  //             },
  //           ]}
  //         >
  //           <TextArea
  //             rows={3}
  //             maxLength={512}
  //             showCount
  //             placeholder="Enter trial / status remarks"
  //             onChange={handleTrialStatusRemarksChange}
  //           />{" "}
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 8. PARTS USED / RECOMMENDED */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="8. PARTS USED / RECOMMENDED" />

  //         <div className="parts-table-responsive">
  //           <Table
  //             bordered
  //             pagination={false}
  //             size="small"
  //             columns={partsColumns}
  //             dataSource={partsDataSource}
  //             scroll={{ x: 850 }}
  //           />
  //         </div>

  //         {/* ==================================================== */}
  //         {/* 9. FURTHER ACTION REQUIRED */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="9. FURTHER ACTION REQUIRED" />

  //         <Form.Item
  //           name="furtherAction"
  //           rules={[
  //             {
  //               required: true,
  //               type: "array",
  //               min: 1,
  //               message: "Please select at least one further action",
  //             },
  //           ]}
  //         >
  //           <Checkbox.Group style={{ width: "100%" }}>
  //             <div className="further-action-options">
  //               <Checkbox value="noFurtherAction">
  //                 No further action required
  //               </Checkbox>

  //               <Checkbox value="partsRequired">Parts required</Checkbox>

  //               <Checkbox value="followUpVisit">
  //                 Follow-up visit required
  //               </Checkbox>

  //               <Checkbox value="customerAction">
  //                 Customer action required
  //               </Checkbox>

  //               <Checkbox value="technicalSupportChina">
  //                 Technical / spare support required from Haitian China
  //               </Checkbox>
  //             </div>
  //           </Checkbox.Group>
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* REQUIRED ACTION / FOLLOW-UP */}
  //         {/* ==================================================== */}

  //         <Form.Item
  //           label="Required Action / Follow-up"
  //           name="requiredActionFollowUp"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter required action / follow-up",
  //             },
  //           ]}
  //         >
  //           <TextArea
  //             rows={3}
  //             maxLength={512}
  //             showCount
  //             placeholder="Enter required action / follow-up"
  //             onChange={handleRequiredActionFollowUpChange}
  //           />{" "}
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 10. SERVICE COMMERCIAL CLASSIFICATION */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />

  //         <Form.Item
  //           name="serviceCommercialClassification"
  //           rules={[
  //             {
  //               required: true,
  //               type: "array",
  //               min: 1,
  //               message: "Please select at least one classification",
  //             },
  //           ]}
  //         >
  //           <Checkbox.Group style={{ width: "100%" }}>
  //             <div className="commercial-classification-options">
  //               <Checkbox value="focCommissioning">F.O.C. Commissioning</Checkbox>

  //               <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>

  //               <Checkbox value="warrantyService">Warranty Service</Checkbox>

  //               <Checkbox value="chargeableMaintenance">
  //                 Chargeable Maintenance
  //               </Checkbox>

  //               <Checkbox value="customerVisitService">
  //                 Customer Visit (Service)
  //               </Checkbox>

  //               <Checkbox value="serviceContract">Service Contract</Checkbox>

  //               <Checkbox value="goodwill">Goodwill</Checkbox>
  //               <Checkbox value="chargeableCommissioning">
  //                 Chargeable commissioning
  //               </Checkbox>
  //             </div>
  //           </Checkbox.Group>
  //         </Form.Item>

  //         {/* ==================================================== */}
  //         {/* 11. CUSTOMER ACKNOWLEDGEMENT */}
  //         {/* ==================================================== */}

  //         <SectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />

  //         <div
  //           style={{
  //             fontSize: "16px",
  //           }}
  //         >
  //           I acknowledge that the above service work has been carried out and the
  //           machine status / further action has been explained to me.
  //         </div>

  //         <div className="row mt-2">
  //           {/* ================= SERVICE TECHNICIAN ================= */}

  //           <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
  //             <Form.Item
  //               label={
  //                 <span className="signature-label">
  //                   Signature of Service Technician
  //                 </span>
  //               }
  //               required
  //             >
  //               {" "}
  //               <Form.Item
  //                 label="Name"
  //                 name="technicianName"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter technician name",
  //                   },
  //                 ]}
  //               >
  //                 <Input />
  //               </Form.Item>
  //               <SignatureCanvas
  //                 ref={sigTechnician}
  //                 penColor="black"
  //                 onBegin={() => {
  //                   setIsTechnicianSignSaved(false);
  //                 }}
  //                 canvasProps={{
  //                   width: canvasSize.width,
  //                   height: canvasSize.height,
  //                   className: "signatureborder",
  //                 }}
  //               />
  //               <div className="d-flex justify-content-start gap-2 mt-3">
  //                 <Button
  //                   className="haitianbutton"
  //                   onClick={saveTechnicianSignature}
  //                 >
  //                   Save Signature
  //                 </Button>

  //                 <Button
  //                   className="dangerbutton"
  //                   onClick={clearTechnicianSignature}
  //                 >
  //                   Clear
  //                 </Button>
  //               </div>
  //               <Form.Item
  //                 label="Date"
  //                 name="technicianDate"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter date",
  //                   },
  //                   {
  //                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                     message: "Enter date in DD-MM-YYYY format",
  //                   },
  //                 ]}
  //                 className="mt-2"
  //               >
  //                 <Input
  //                   placeholder="DD-MM-YYYY"
  //                   value={form.getFieldValue("technicianDate") || ""}
  //                   onChange={(e) => {
  //                     const formatted = formatDDMMYYYY(e.target.value);

  //                     form.setFieldsValue({
  //                       technicianDate: formatted,
  //                     });
  //                   }}
  //                 />
  //               </Form.Item>
  //             </Form.Item>
  //           </div>

  //           {/* ================= SERVICE MANAGER ================= */}

  //           <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
  //             <Form.Item
  //               label={
  //                 <span className="signature-label">
  //                   Signature of Service Manager
  //                 </span>
  //               }
  //               required
  //             >
  //               {" "}
  //               <Form.Item
  //                 label="Name"
  //                 name="managerName"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter manager name",
  //                   },
  //                 ]}
  //               >
  //                 <Input />
  //               </Form.Item>
  //               <SignatureCanvas
  //                 ref={sigManager}
  //                 penColor="black"
  //                 canvasProps={{
  //                   width: canvasSize.width,
  //                   height: canvasSize.height,
  //                   className: "signatureborder",
  //                 }}
  //                 onBegin={() => {
  //                   setIsManagerSignSaved(false);
  //                 }}
  //               />
  //               <div className="d-flex justify-content-start gap-2 mt-3">
  //                 <Button
  //                   className="haitianbutton"
  //                   onClick={saveManagerSignature}
  //                 >
  //                   Save Signature
  //                 </Button>

  //                 <Button
  //                   className="dangerbutton"
  //                   onClick={clearManagerSignature}
  //                 >
  //                   Clear
  //                 </Button>
  //               </div>
  //               <Form.Item
  //                 label="Date"
  //                 name="managerDate"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter date",
  //                   },
  //                   {
  //                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                     message: "Enter date in DD-MM-YYYY format",
  //                   },
  //                 ]}
  //                 className="mt-2"
  //               >
  //                 <Input
  //                   placeholder="DD-MM-YYYY"
  //                   value={form.getFieldValue("managerDate") || ""}
  //                   onChange={(e) => {
  //                     const formatted = formatDDMMYYYY(e.target.value);

  //                     form.setFieldsValue({
  //                       managerDate: formatted,
  //                     });
  //                   }}
  //                 />
  //               </Form.Item>
  //             </Form.Item>
  //           </div>

  //           {/* ================= CUSTOMER ================= */}

  //           <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
  //             <Form.Item
  //               label={
  //                 <span className="signature-label">Customer Signature</span>
  //               }
  //               required
  //             >
  //               {" "}
  //               <Form.Item
  //                 label="Name"
  //                 name="customerName"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter customer name",
  //                   },
  //                 ]}
  //               >
  //                 <Input />
  //               </Form.Item>
  //               <SignatureCanvas
  //                 ref={sigCustomer}
  //                 penColor="black"
  //                 onBegin={() => {
  //                   setIsCustomerSignSaved(false);
  //                 }}
  //                 canvasProps={{
  //                   width: canvasSize.width,
  //                   height: canvasSize.height,
  //                   className: "signatureborder",
  //                 }}
  //               />
  //               <div className="d-flex justify-content-start gap-2 mt-3">
  //                 <Button
  //                   className="haitianbutton"
  //                   onClick={saveCustomerSignature}
  //                 >
  //                   Save Signature
  //                 </Button>

  //                 <Button
  //                   className="dangerbutton"
  //                   onClick={clearCustomerSignature}
  //                 >
  //                   Clear
  //                 </Button>
  //               </div>
  //               <Form.Item
  //                 label="Date"
  //                 name="customerDate"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter date",
  //                   },
  //                   {
  //                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                     message: "Enter date in DD-MM-YYYY format",
  //                   },
  //                 ]}
  //                 className="mt-2"
  //               >
  //                 <Input
  //                   placeholder="DD-MM-YYYY"
  //                   value={form.getFieldValue("customerDate") || ""}
  //                   onChange={(e) => {
  //                     const formatted = formatDDMMYYYY(e.target.value);

  //                     form.setFieldsValue({
  //                       customerDate: formatted,
  //                     });
  //                   }}
  //                 />
  //               </Form.Item>
  //             </Form.Item>
  //           </div>
  //         </div>
  //         {/* ==================================================== */}
  //         {/* SAVE BUTTON */}
  //         {/* ==================================================== */}

  //         <div className="save-report-container">
  //           <Button
  //             type="primary"
  //             htmlType="submit"
  //             className="save-report-button"
  //             loading={loading}
  //             disabled={loading}
  //           >
  //             {loading ? "Submitting..." : "Submit Report"}
  //           </Button>
  //         </div>
  //       </Form>

  //       {/* ========================================================== */}
  //       {/* FETCHED SERVICE REPORTS                                   */}
  //       {/* ========================================================== */}

  //       <div className="fetched-service-reports-section mt-5 pt-5">
  //         <div className="fetched-service-reports-card">
  //           <div className="fetched-service-reports-heading">
  //             <div className="fetched-service-reports-heading-main">
  //               <div className="fetched-service-reports-heading-icon">
  //                 <DownloadOutlined />
  //               </div>

  //               <div>
  //                 <div className="fetched-service-reports-title">
  //                   SERVICE REPORT RECORD DATA
  //                 </div>
  //                 <div className="fetched-service-reports-subtitle">
  //                   Latest service reports are displayed first
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="fetched-service-reports-count">
  //               <span className="fetched-service-reports-count-label">
  //                 {reportTableSearch.trim() ? "MATCHING RECORDS" : "TOTAL RECORDS"}
  //               </span>
  //               <strong>{filteredAndSortedReportData.length}</strong>
  //             </div>
  //           </div>

  //           <div className="fetched-service-reports-toolbar">
  //             <div className="service-report-search-wrap">
  //               <SearchOutlined className="service-report-search-icon" />
  //               <Input
  //                 value={reportTableSearch}
  //                 onChange={(event) => setReportTableSearch(event.target.value)}
  //                 placeholder="Search report no., customer, technician, machine, serial no., location..."
  //                 allowClear
  //                 className="service-report-search-input"
  //               />
  //             </div>

  //             <div className="service-report-toolbar-actions">
  //               <div className="service-report-page-size">
  //                 <span>Rows</span>
  //                 <Select
  //                   value={reportTablePageSize}
  //                   onChange={setReportTablePageSize}
  //                   options={[
  //                     { value: 10, label: "10" },
  //                     { value: 20, label: "20" },
  //                     { value: 50, label: "50" },
  //                     { value: 100, label: "100" },
  //                   ]}
  //                 />
  //               </div>

  //               <Button
  //                 className="service-report-refresh-button"
  //                 icon={<ReloadOutlined />}
  //                 loading={reportTableLoading}
  //                 onClick={fetchServiceReports}
  //               >
  //                 Refresh
  //               </Button>

  //               {reportTableSearch && (
  //                 <Button
  //                   className="service-report-clear-button"
  //                   icon={<ClearOutlined />}
  //                   onClick={() => setReportTableSearch("")}
  //                 >
  //                   Clear
  //                 </Button>
  //               )}
  //             </div>
  //           </div>

    

  //           <div className="fetched-service-reports-table">
  //             <Table
  //               dataSource={filteredAndSortedReportData}
  //               loading={reportTableLoading}
  //               columns={reportTableColumns}
  //               rowKey={(record) =>
  //                 String(record["Service Report Number"] || record.rowIndex)
  //               }
  //               scroll={{ x: 3900 }}
  //               sticky={{ offsetHeader: 0 }}
  //               pagination={{
  //                 pageSize: reportTablePageSize,
  //                 showSizeChanger: false,
  //                 showQuickJumper: true,
  //                 showTotal: (total, range) =>
  //                   `${range[0]}-${range[1]} of ${total} records`,
  //                 position: ["bottomCenter"],
  //               }}
  //               size="middle"
  //               bordered={false}
  //               rowClassName={(_, index) =>
  //                 index % 2 === 0
  //                   ? "service-report-table-row-even"
  //                   : "service-report-table-row-odd"
  //               }
  //               showSorterTooltip={{
  //                 target: "sorter-icon",
  //               }}
  //             />
  //           </div>
  //         </div>
  //       </div>

  //       <Modal
  //         className="service-report-view-modal"
  //         width="calc(100vw - 24px)"
  //         style={{
  //           top: 10,
  //           maxWidth: "1250px",
  //         }}
  //         open={editModalOpen}
  //         onCancel={closeEditModal}
  //         footer={null}
  //         destroyOnHidden
  //         maskClosable={!editSaveLoading}
  //         closable={!editSaveLoading}
  //       >
  //         <div
  //           style={{
  //             textAlign: "center",
  //             paddingBottom: "12px",
  //             borderBottom: "2px solid #0D3884",
  //             marginBottom: "18px",
  //           }}
  //         >
  //           <img
  //             src={HaitianLogo}
  //             alt="HaitianLogo"
  //             style={{
  //               maxWidth: "300px",
  //               maxHeight: "70px",
  //               objectFit: "contain",
  //             }}
  //           />
  //           <h2
  //             style={{
  //               margin: "8px 0 0",
  //               color: "#0D3884",
  //               fontWeight: 700,
  //             }}
  //           >
  //             EDIT SERVICE REPORT
  //           </h2>
  //           <div
  //             style={{
  //               marginTop: 8,
  //               display: "inline-block",
  //               padding: "6px 18px",
  //               background: "#F1F6FA",
  //               border: "1px solid #D9E2EA",
  //               borderRadius: 6,
  //               fontWeight: 600,
  //             }}
  //           >
  //             Service Report Number:{" "}
  //             {editForm.getFieldValue("serviceReportNumber") ||
  //               editReport?.["Service Report Number"] ||
  //               ""}
  //           </div>
  //         </div>

  //         <Form
  //           form={editForm}
  //           layout="vertical"
  //           requiredMark
  //           onFinish={handleEditSave}
  //         >
  //           <SectionTitle title="1. CUSTOMER & VISIT INFORMATION" />
  //           <div className="row">
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Customer"
  //                 name="customer"
  //                 rules={requiredRule("customer")}
  //               >
  //                 <AutoComplete
  //                   allowClear
  //                   showSearch
  //                   placeholder="Type or select customer name"
  //                   options={customerOptions.map((name) => ({
  //                     label: name,
  //                     value: name,
  //                   }))}
  //                   filterOption={(inputValue, option) =>
  //                     String(option?.value || "")
  //                       .toLowerCase()
  //                       .includes(String(inputValue || "").toLowerCase())
  //                   }
  //                 />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Service Date"
  //                 name="serviceDate"
  //                 rules={[
  //                   { required: true, message: "Please enter service date" },
  //                   {
  //                     pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                     message: "Enter date in DD-MM-YYYY format",
  //                   },
  //                 ]}
  //               >
  //                 <Input placeholder="DD-MM-YYYY" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Site / Location"
  //                 name="siteLocation"
  //                 rules={requiredRule("site / location")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Contact Person"
  //                 name="contactPerson"
  //                 rules={requiredRule("contact person")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Contact No."
  //                 name="contactNo"
  //                 rules={contactNumberRule}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Technician"
  //                 name="technician"
  //                 rules={requiredRule("technician")}
  //               >
  //                 <Select
  //                   mode="multiple"
  //                   size="large"
  //                   maxTagCount="responsive"
  //                   optionFilterProp="label"
  //                   options={technicianOptions.map((technician) => ({
  //                     label: technician,
  //                     value: technician,
  //                   }))}
  //                 />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Arrival Time"
  //                 name="arrivalTime"
  //                 rules={timeRule("arrival time")}
  //               >
  //                 <Input placeholder="HH:MM" maxLength={5} />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Completion Time"
  //                 name="completionTime"
  //                 rules={timeRule("completion time")}
  //               >
  //                 <Input placeholder="HH:MM" maxLength={5} />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Total Working Hours"
  //                 name="totalWorkingHours"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please enter total working hours",
  //                   },
  //                 ]}
  //               >
  //                 <Input />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Service Visit Ref."
  //                 name="serviceVisitRef"
  //                 rules={requiredRule("service visit reference")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //           </div>

  //           <SectionTitle title="2. MACHINE INFORMATION" />
  //           <div className="row">
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Machine Model"
  //                 name="machineModel"
  //                 rules={requiredRule("machine model")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Serial No."
  //                 name="serialNo"
  //                 rules={requiredRule("serial number")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Installation Year"
  //                 name="installationYear"
  //                 rules={requiredRule("installation year")}
  //               >
  //                 <Input size="large" placeholder="Enter installation year" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Machine Running Hours"
  //                 name="machineRunningHours"
  //               >
  //                 <Input />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Controller"
  //                 name="softwareVersion"
  //                 rules={requiredRule("controller")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Warranty Status"
  //                 name="warrantyStatus"
  //                 rules={requiredRule("warranty status")}
  //               >
  //                 <Input size="large" />
  //               </Form.Item>
  //             </div>
  //           </div>

  //           <SectionTitle title="3. SERVICE CATEGORY" />
  //           <Form.Item
  //             name="serviceCategory"
  //             rules={[
  //               {
  //                 required: true,
  //                 type: "array",
  //                 min: 1,
  //                 message: "Please select at least one service category",
  //               },
  //             ]}
  //           >
  //             <Checkbox.Group style={{ width: "100%" }}>
  //               <div
  //                 className="view-checkbox-options"
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="installation">
  //                   Installation / Commissioning
  //                 </Checkbox>
  //                 <Checkbox value="breakdown">Breakdown / Defect</Checkbox>
  //                 <Checkbox value="preventive">Preventive Maintenance</Checkbox>
  //                 <Checkbox value="corrective">Corrective Maintenance</Checkbox>
  //                 <Checkbox value="inspection">Inspection</Checkbox>
  //                 <Checkbox value="customerVisit">Customer Visit</Checkbox>
  //                 <Checkbox value="software">Software / Program</Checkbox>
  //                 <Checkbox value="other">Other</Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           <SectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />
  //           <Form.Item
  //             name="customerComplaint"
  //             rules={requiredRule("customer complaint / reported problem")}
  //           >
  //             <TextArea
  //               rows={3}
  //               maxLength={512}
  //               showCount
  //               onChange={(e) =>
  //                 handleEditSectionTextChange(
  //                   "customerComplaint",
  //                   "Customer complaint",
  //                   e,
  //                 )
  //               }
  //             />
  //           </Form.Item>

  //           <SectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />
  //           <Form.Item
  //             name="technicianDiagnosis"
  //             rules={requiredRule("technician diagnosis / root cause")}
  //           >
  //             <TextArea
  //               rows={3}
  //               maxLength={512}
  //               showCount
  //               onChange={(e) =>
  //                 handleEditSectionTextChange(
  //                   "technicianDiagnosis",
  //                   "Technician diagnosis",
  //                   e,
  //                 )
  //               }
  //             />
  //           </Form.Item>

  //           <SectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />
  //           <Form.Item
  //             name="workPerformed"
  //             rules={requiredRule("work performed / corrective action")}
  //           >
  //             <TextArea
  //               rows={3}
  //               maxLength={512}
  //               showCount
  //               onChange={(e) =>
  //                 handleEditSectionTextChange(
  //                   "workPerformed",
  //                   "Work performed",
  //                   e,
  //                 )
  //               }
  //             />
  //           </Form.Item>

  //           <SectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />
  //           <Form.Item
  //             name="machineTrialStatus"
  //             rules={[
  //               {
  //                 required: true,
  //                 type: "array",
  //                 min: 1,
  //                 message:
  //                   "Please select at least one machine trial/final status",
  //               },
  //             ]}
  //           >
  //             <Checkbox.Group style={{ width: "100%" }}>
  //               <div
  //                 className="view-checkbox-options"
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="machineTestedSuccessfully">
  //                   Machine tested successfully
  //                 </Checkbox>
  //                 <Checkbox value="machineRunningNormally">
  //                   Machine running normally
  //                 </Checkbox>
  //                 <Checkbox value="runningWithObservation">
  //                   Running with observation
  //                 </Checkbox>
  //                 <Checkbox value="machineStopped">
  //                   Machine stopped - further action required
  //                 </Checkbox>
  //                 <Checkbox value="customerAdvised">
  //                   Customer advised / awaiting action
  //                 </Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           <div className="row">
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Trial Duration"
  //                 name="trialDuration"
  //                 rules={requiredRule("trial duration")}
  //               >
  //                 <Input />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-6">
  //               <Form.Item
  //                 label="Cycle Time"
  //                 name="cycleTime"
  //                 rules={requiredRule("cycle time")}
  //               >
  //                 <Input />
  //               </Form.Item>
  //             </div>
  //             <div className="col-md-12">
  //               <Form.Item
  //                 label="Product / Material"
  //                 name="productMaterial"
  //                 rules={requiredRule("product / material")}
  //               >
  //                 <Input
  //                   maxLength={100}
  //                   showCount
  //                   onChange={handleEditProductMaterialChange}
  //                 />
  //               </Form.Item>
  //             </div>
  //           </div>
  //           <Form.Item
  //             name="trialStatusRemarks"
  //             rules={requiredRule("trial / status remarks")}
  //           >
  //             <TextArea
  //               rows={3}
  //               maxLength={512}
  //               showCount
  //               onChange={(e) =>
  //                 handleEditSectionTextChange(
  //                   "trialStatusRemarks",
  //                   "Trial / Status Remarks",
  //                   e,
  //                 )
  //               }
  //             />
  //           </Form.Item>

  //           <SectionTitle title="8. PARTS USED / RECOMMENDED" />
  //           <Table
  //             bordered
  //             pagination={false}
  //             size="middle"
  //             rowKey={(record) => record.key}
  //             dataSource={editPartsData}
  //             scroll={{ x: "max-content" }}
  //             columns={[
  //               {
  //                 title: "Part No.",
  //                 dataIndex: "partNo",
  //                 render: (_, record) => (
  //                   <Input
  //                     value={record.partNo}
  //                     maxLength={22}
  //                     showCount
  //                     onChange={(e) =>
  //                       updateEditPart(record.key, "partNo", e.target.value)
  //                     }
  //                   />
  //                 ),
  //               },
  //               {
  //                 title: "Description",
  //                 dataIndex: "description",
  //                 render: (_, record) => (
  //                   <Input
  //                     value={record.description}
  //                     maxLength={25}
  //                     showCount
  //                     onChange={(e) =>
  //                       updateEditPart(record.key, "description", e.target.value)
  //                     }
  //                   />
  //                 ),
  //               },
  //               {
  //                 title: "Qty",
  //                 dataIndex: "qty",
  //                 width: 90,
  //                 render: (_, record) => (
  //                   <Input
  //                     value={record.qty}
  //                     onChange={(e) =>
  //                       updateEditPart(record.key, "qty", e.target.value)
  //                     }
  //                   />
  //                 ),
  //               },
  //               {
  //                 title: "Used / Recommended",
  //                 dataIndex: "usedRecommended",
  //                 render: (_, record) => (
  //                   <Input
  //                     value={record.usedRecommended}
  //                     maxLength={25}
  //                     showCount
  //                     onChange={(e) =>
  //                       updateEditPart(
  //                         record.key,
  //                         "usedRecommended",
  //                         e.target.value,
  //                       )
  //                     }
  //                   />
  //                 ),
  //               },
  //               {
  //                 title: "Remarks",
  //                 dataIndex: "remarks",
  //                 render: (_, record) => (
  //                   <Input
  //                     value={record.remarks}
  //                     maxLength={25}
  //                     showCount
  //                     onChange={(e) =>
  //                       updateEditPart(record.key, "remarks", e.target.value)
  //                     }
  //                   />
  //                 ),
  //               },
  //               // {
  //               //   title: "Action",
  //               //   width: 100,
  //               //   render: (_, record) => (
  //               //     <Button danger onClick={() => removeEditPart(record.key)}>
  //               //       Remove
  //               //     </Button>
  //               //   ),
  //               // },
  //             ]}
  //           />
  //           {/* <div style={{ marginTop: 10, marginBottom: 8 }}>
  //             <Button type="dashed" onClick={addEditPart}>
  //               + Add Part
  //             </Button>
  //           </div> */}

  //           <SectionTitle title="9. FURTHER ACTION REQUIRED" />
  //           <Form.Item
  //             name="furtherAction"
  //             rules={[
  //               {
  //                 required: true,
  //                 type: "array",
  //                 min: 1,
  //                 message: "Please select at least one further action",
  //               },
  //             ]}
  //           >
  //             <Checkbox.Group style={{ width: "100%" }}>
  //               <div
  //                 className="view-checkbox-options"
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="noFurtherAction">
  //                   No further action required
  //                 </Checkbox>
  //                 <Checkbox value="partsRequired">Parts required</Checkbox>
  //                 <Checkbox value="followUpVisit">
  //                   Follow-up visit required
  //                 </Checkbox>
  //                 <Checkbox value="customerAction">
  //                   Customer action required
  //                 </Checkbox>
  //                 <Checkbox value="technicalSupportChina">
  //                   Technical / spare support required from Haitian China
  //                 </Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>
  //           <Form.Item
  //             name="requiredActionFollowUp"
  //             rules={requiredRule("required action / follow-up")}
  //           >
  //             <TextArea
  //               rows={3}
  //               maxLength={512}
  //               showCount
  //               onChange={(e) =>
  //                 handleEditSectionTextChange(
  //                   "requiredActionFollowUp",
  //                   "Required Action / Follow-up",
  //                   e,
  //                 )
  //               }
  //             />
  //           </Form.Item>

  //           <SectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />
  //           <Form.Item
  //             name="serviceCommercialClassification"
  //             rules={[
  //               {
  //                 required: true,
  //                 type: "array",
  //                 min: 1,
  //                 message: "Please select at least one commercial classification",
  //               },
  //             ]}
  //           >
  //             <Checkbox.Group style={{ width: "100%" }}>
  //               <div
  //                 className="view-checkbox-options"
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="focCommissioning">
  //                   F.O.C. Commissioning
  //                 </Checkbox>
  //                 <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>
  //                 <Checkbox value="warrantyService">Warranty Service</Checkbox>
  //                 <Checkbox value="chargeableMaintenance">
  //                   Chargeable Maintenance
  //                 </Checkbox>
  //                 <Checkbox value="customerVisitService">
  //                   Customer Visit (Service)
  //                 </Checkbox>
  //                 <Checkbox value="serviceContract">Service Contract</Checkbox>
  //                 <Checkbox value="goodwill">Goodwill</Checkbox>
  //                 <Checkbox value="chargeableCommissioning">
  //                   Chargeable commissioning
  //                 </Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           <SectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />
  //           <div
  //             style={{
  //               background: "#F1F6FA",
  //               border: "1px solid #D9E2EA",
  //               borderRadius: 6,
  //               padding: "14px 16px",
  //               marginBottom: 20,
  //               fontSize: 15,
  //               lineHeight: 1.6,
  //             }}
  //           >
  //             I acknowledge that the above service work has been carried out and
  //             the machine status / further action has been explained to me.
  //           </div>

  //           <div className="row mt-2">
  //             {/* ================= SERVICE TECHNICIAN ================= */}
  //             <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
  //               <Form.Item
  //                 label={
  //                   <span className="signature-label">
  //                     Signature of Service Technician
  //                   </span>
  //                 }
  //                 required
  //               >
  //                 {" "}
  //                 <Form.Item
  //                   label="Name"
  //                   name="technicianName"
  //                   rules={requiredRule("service technician name")}
  //                 >
  //                   <Input />
  //                 </Form.Item>
  //                 <SignatureCanvas
  //                   ref={editSigTechnician}
  //                   penColor="black"
  //                   onBegin={() => {
  //                     setIsEditTechnicianSignSaved(false);
  //                   }}
  //                   canvasProps={{
  //                     width: canvasSize.width,
  //                     height: canvasSize.height,
  //                     className: "signatureborder",
  //                   }}
  //                 />
  //                 <div className="d-flex justify-content-start gap-2 mt-3">
  //                   <Button
  //                     className="haitianbutton"
  //                     onClick={() => saveEditSignature("technician")}
  //                   >
  //                     Save Signature
  //                   </Button>
  //                   <Button
  //                     className="dangerbutton"
  //                     onClick={() => clearEditSignature("technician")}
  //                   >
  //                     Clear
  //                   </Button>
  //                 </div>
  //                 <Form.Item
  //                   label="Date"
  //                   name="technicianDate"
  //                   rules={[
  //                     { required: true, message: "Please enter date" },
  //                     {
  //                       pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                       message: "Enter date in DD-MM-YYYY format",
  //                     },
  //                   ]}
  //                   className="mt-2"
  //                 >
  //                   <Input
  //                     placeholder="DD-MM-YYYY"
  //                     onChange={(e) => {
  //                       editForm.setFieldsValue({
  //                         technicianDate: formatDDMMYYYY(e.target.value),
  //                       });
  //                     }}
  //                   />
  //                 </Form.Item>
  //               </Form.Item>
  //             </div>

  //             {/* ================= SERVICE MANAGER ================= */}
  //             <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
  //               <Form.Item
  //                 label={
  //                   <span className="signature-label">
  //                     Signature of Service Manager
  //                   </span>
  //                 }
  //                 required
  //               >
  //                 {" "}
  //                 <Form.Item
  //                   label="Name"
  //                   name="managerName"
  //                   rules={requiredRule("service manager name")}
  //                 >
  //                   <Input />
  //                 </Form.Item>
  //                 <SignatureCanvas
  //                   ref={editSigManager}
  //                   penColor="black"
  //                   onBegin={() => {
  //                     setIsEditManagerSignSaved(false);
  //                   }}
  //                   canvasProps={{
  //                     width: canvasSize.width,
  //                     height: canvasSize.height,
  //                     className: "signatureborder",
  //                   }}
  //                 />
  //                 <div className="d-flex justify-content-start gap-2 mt-3">
  //                   <Button
  //                     className="haitianbutton"
  //                     onClick={() => saveEditSignature("manager")}
  //                   >
  //                     Save Signature
  //                   </Button>
  //                   <Button
  //                     className="dangerbutton"
  //                     onClick={() => clearEditSignature("manager")}
  //                   >
  //                     Clear
  //                   </Button>
  //                 </div>
  //                 <Form.Item
  //                   label="Date"
  //                   name="managerDate"
  //                   rules={[
  //                     { required: true, message: "Please enter date" },
  //                     {
  //                       pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                       message: "Enter date in DD-MM-YYYY format",
  //                     },
  //                   ]}
  //                   className="mt-2"
  //                 >
  //                   <Input
  //                     placeholder="DD-MM-YYYY"
  //                     onChange={(e) => {
  //                       editForm.setFieldsValue({
  //                         managerDate: formatDDMMYYYY(e.target.value),
  //                       });
  //                     }}
  //                   />
  //                 </Form.Item>
  //               </Form.Item>
  //             </div>

  //             {/* ================= CUSTOMER ================= */}
  //             <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
  //               <Form.Item
  //                 label={
  //                   <span className="signature-label">Customer Signature</span>
  //                 }
  //                 required
  //               >
  //                 {" "}
  //                 <Form.Item
  //                   label="Name"
  //                   name="customerName"
  //                   rules={requiredRule("customer name")}
  //                 >
  //                   <Input />
  //                 </Form.Item>
  //                 <SignatureCanvas
  //                   ref={editSigCustomer}
  //                   penColor="black"
  //                   onBegin={() => {
  //                     setIsEditCustomerSignSaved(false);
  //                   }}
  //                   canvasProps={{
  //                     width: canvasSize.width,
  //                     height: canvasSize.height,
  //                     className: "signatureborder",
  //                   }}
  //                 />
  //                 <div className="d-flex justify-content-start gap-2 mt-3">
  //                   <Button
  //                     className="haitianbutton"
  //                     onClick={() => saveEditSignature("customer")}
  //                   >
  //                     Save Signature
  //                   </Button>
  //                   <Button
  //                     className="dangerbutton"
  //                     onClick={() => clearEditSignature("customer")}
  //                   >
  //                     Clear
  //                   </Button>
  //                 </div>
  //                 <Form.Item
  //                   label="Date"
  //                   name="customerDate"
  //                   rules={[
  //                     { required: true, message: "Please enter date" },
  //                     {
  //                       pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
  //                       message: "Enter date in DD-MM-YYYY format",
  //                     },
  //                   ]}
  //                   className="mt-2"
  //                 >
  //                   <Input
  //                     placeholder="DD-MM-YYYY"
  //                     onChange={(e) => {
  //                       editForm.setFieldsValue({
  //                         customerDate: formatDDMMYYYY(e.target.value),
  //                       });
  //                     }}
  //                   />
  //                 </Form.Item>
  //               </Form.Item>
  //             </div>
  //           </div>

  //           <div className="edit-form-actions">
  //             <Button
  //               className="edit-cancel-button"
  //               size="large"
  //               onClick={closeEditModal}
  //               disabled={editSaveLoading}
  //             >
  //               Cancel
  //             </Button>

  //             <Button
  //               className="edit-save-button"
  //               type="primary"
  //               size="large"
  //               loading={editSaveLoading}
  //               onClick={handleEditSave}
  //             >
  //               {editSaveLoading
  //                 ? "Updating & Generating PDF..."
  //                 : "Save Changes"}
  //             </Button>
  //           </div>
  //         </Form>
  //       </Modal>

  //       <Modal
  //         className="service-report-view-modal"
  //         width="calc(100vw - 24px)"
  //         style={{
  //           top: 10,
  //           maxWidth: "1250px",
  //         }}
  //         open={viewModalOpen}
  //         onCancel={() => {
  //           setViewModalOpen(false);
  //           setViewReport(null);
  //           setViewPartsData([]);
  //           viewForm.resetFields();
  //         }}
  //         footer={null}
  //         destroyOnHidden
  //       >
  //         {/* ============================================================
  //       HEADER
  //   ============================================================ */}

  //         <div
  //           style={{
  //             textAlign: "center",
  //             paddingBottom: "12px",
  //             borderBottom: "2px solid #0D3884",
  //             marginBottom: "18px",
  //           }}
  //         >
  //           <img
  //             src={HaitianLogo}
  //             alt="HaitianLogo"
  //             style={{
  //               maxWidth: "300px",
  //               maxHeight: "70px",
  //               objectFit: "contain",
  //             }}
  //           />

  //           <h2
  //             style={{
  //               color: "#0D3884",
  //               fontWeight: 700,
  //               margin: "10px 0 0",
  //               fontSize: "24px",
  //             }}
  //           >
  //             VIEW SERVICE REPORT
  //           </h2>

  //           <div
  //             style={{
  //               color: "#666",
  //               fontSize: "14px",
  //               marginTop: "4px",
  //             }}
  //           >
  //             Service Report Record
  //           </div>
  //         </div>

  //         <Form form={viewForm} layout="vertical">
  //           {/* ==========================================================
  //         REPORT NUMBER + DOWNLOAD PDF
  //     ========================================================== */}

  //           <div
  //             style={{
  //               background: "#F1F6FA",
  //               border: "1px solid #B8C8D3",
  //               borderRadius: "6px",
  //               padding: "12px 16px",
  //               marginBottom: "18px",
  //             }}
  //           >
  //             <div
  //               style={{
  //                 display: "flex",
  //                 alignItems: "flex-end",
  //                 justifyContent: "space-between",
  //                 gap: "16px",
  //                 flexWrap: "wrap",
  //               }}
  //             >
  //               {/* ======================================================
  //             SERVICE REPORT NUMBER
  //         ====================================================== */}

  //               <div
  //                 style={{
  //                   flex: 1,
  //                   minWidth: "250px",
  //                 }}
  //               >
  //                 <Form.Item
  //                   label={
  //                     <strong style={{ color: "#0D3884" }}>
  //                       Service Report Number
  //                     </strong>
  //                   }
  //                   name="serviceReportNumber"
  //                   style={{
  //                     marginBottom: 0,
  //                   }}
  //                 >
  //                   <Input
  //                     readOnly
  //                     size="large"
  //                     style={{
  //                       fontWeight: 700,
  //                       color: "#0D3884",
  //                       background: "#FFFFFF",
  //                     }}
  //                   />
  //                 </Form.Item>
  //               </div>

  //               {/* ======================================================
  //             DOWNLOAD PDF
  //         ====================================================== */}

  //               <Button
  //                 type="primary"
  //                 size="large"
  //                 icon={<DownloadOutlined />}
  //                 loading={pdfDownloadLoading}
  //                 onClick={downloadServiceReportPDF}
  //                 style={{
  //                   background: "#0D3884",
  //                   borderColor: "#0D3884",
  //                   fontWeight: 600,
  //                   minHeight: "40px",
  //                   flexShrink: 0,
  //                 }}
  //               >
  //                 {pdfDownloadLoading ? "Downloading..." : "Download PDF"}
  //               </Button>
  //             </div>
  //           </div>

  //           {/* ==========================================================
  //         SECTION 1
  //     ========================================================== */}

  //           <ViewSectionTitle title="1. CUSTOMER & VISIT INFORMATION" />

  //           <div className="row">
  //             <ViewField
  //               label="Customer"
  //               name="customer"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Service Date"
  //               name="serviceDate"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Site / Location"
  //               name="siteLocation"
  //               span="col-md-6"
  //               textarea
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Contact Person"
  //               name="contactPerson"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Contact No."
  //               name="contactNo"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Technician"
  //               name="technician"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Arrival Time"
  //               name="arrivalTime"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Completion Time"
  //               name="completionTime"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Total Working Hours"
  //               name="totalWorkingHours"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Service Visit Ref."
  //               name="serviceVisitRef"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />
  //           </div>

  //           {/* ==========================================================
  //         SECTION 2
  //     ========================================================== */}

  //           <ViewSectionTitle title="2. MACHINE INFORMATION" />

  //           <div className="row">
  //             <ViewField
  //               label="Machine Model"
  //               name="machineModel"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Serial No."
  //               name="serialNo"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Installation Year"
  //               name="installationYear"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Machine Running Hours"
  //               name="machineRunningHours"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Controller"
  //               name="controllerSoftwareVersion"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Warranty Status"
  //               name="warrantyStatus"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />
  //           </div>

  //           {/* ==========================================================
  //         SECTION 3
  //     ========================================================== */}

  //           <ViewSectionTitle title="3. SERVICE CATEGORY" />

  //           <Form.Item
  //             name="serviceCategory"
  //             style={{
  //               marginBottom: 20,
  //             }}
  //           >
  //             <Checkbox.Group
  //               className="view-checkbox-group"
  //               style={{
  //                 width: "100%",
  //                 pointerEvents: "none",
  //               }}
  //             >
  //               <div
  //                 className="view-checkbox-options"
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="installation">
  //                   Installation / Commissioning
  //                 </Checkbox>

  //                 <Checkbox value="breakdown">Breakdown / Defect</Checkbox>

  //                 <Checkbox value="preventive">Preventive Maintenance</Checkbox>

  //                 <Checkbox value="corrective">Corrective Maintenance</Checkbox>

  //                 <Checkbox value="inspection">Inspection</Checkbox>

  //                 <Checkbox value="customerVisit">Customer Visit</Checkbox>

  //                 <Checkbox value="software">Software / Program</Checkbox>

  //                 <Checkbox value="other">Other</Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           {/* ==========================================================
  //         SECTION 4
  //     ========================================================== */}

  //           <ViewSectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

  //           <ViewLargeText name="customerComplaint" viewForm={viewForm} />

  //           {/* ==========================================================
  //         SECTION 5
  //     ========================================================== */}

  //           <ViewSectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

  //           <ViewLargeText name="diagnosis" viewForm={viewForm} />

  //           {/* ==========================================================
  //         SECTION 6
  //     ========================================================== */}

  //           <ViewSectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

  //           <ViewLargeText name="workPerformed" viewForm={viewForm} />

  //           {/* ==========================================================
  //         SECTION 7
  //     ========================================================== */}

  //           <ViewSectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />

  //           <Form.Item
  //             name="machineTrialStatus"
  //             style={{
  //               marginBottom: 18,
  //             }}
  //           >
  //             <Checkbox.Group
  //               className="view-checkbox-group"
  //               style={{
  //                 width: "100%",
  //                 pointerEvents: "none",
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="machineTestedSuccessfully">
  //                   Machine tested successfully
  //                 </Checkbox>

  //                 <Checkbox value="machineRunningNormally">
  //                   Machine running normally
  //                 </Checkbox>

  //                 <Checkbox value="runningWithObservation">
  //                   Running with observation
  //                 </Checkbox>

  //                 <Checkbox value="machineStopped">
  //                   Machine stopped - further action required
  //                 </Checkbox>

  //                 <Checkbox value="customerAdvised">
  //                   Customer advised / awaiting action
  //                 </Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           <div className="row">
  //             <ViewField
  //               label="Trial Duration"
  //               name="trialDuration"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Cycle Time"
  //               name="cycleTime"
  //               span="col-md-6"
  //               viewForm={viewForm}
  //             />

  //             <ViewField
  //               label="Product / Material"
  //               name="productMaterial"
  //               span="col-md-12"
  //               viewForm={viewForm}
  //             />
  //           </div>

  //           <ViewLargeText name="trialStatusRemarks" viewForm={viewForm} />

  //           {/* ==========================================================
  //         SECTION 8
  //     ========================================================== */}

  //           <ViewSectionTitle title="8. PARTS USED / RECOMMENDED" />

  //           <div className="view-parts-table-responsive">
  //             <Table
  //               bordered
  //               pagination={false}
  //               size="middle"
  //               rowKey={(record) => record.key}
  //               dataSource={viewPartsData}
  //               columns={[
  //                 {
  //                   title: "Part No.",
  //                   dataIndex: "Part No.",
  //                   key: "Part No.",
  //                 },

  //                 {
  //                   title: "Description",
  //                   dataIndex: "Description",
  //                   key: "Description",
  //                 },

  //                 {
  //                   title: "Qty",
  //                   dataIndex: "Qty",
  //                   key: "Qty",
  //                 },

  //                 {
  //                   title: "Used / Recommended",
  //                   dataIndex: "Used / Recommended",
  //                   key: "Used / Recommended",
  //                 },

  //                 {
  //                   title: "Remarks",
  //                   dataIndex: "Remarks",
  //                   key: "Remarks",
  //                 },
  //               ]}
  //               locale={{
  //                 emptyText: "No parts recorded",
  //               }}
  //             />
  //           </div>

  //           {/* ==========================================================
  //         SECTION 9
  //     ========================================================== */}

  //           <ViewSectionTitle title="9. FURTHER ACTION REQUIRED" />

  //           <Form.Item
  //             name="furtherAction"
  //             style={{
  //               marginBottom: 18,
  //             }}
  //           >
  //             <Checkbox.Group
  //               className="view-checkbox-group"
  //               style={{
  //                 width: "100%",
  //                 pointerEvents: "none",
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="noFurtherAction">
  //                   No further action required
  //                 </Checkbox>

  //                 <Checkbox value="partsRequired">Parts required</Checkbox>

  //                 <Checkbox value="followUpVisit">
  //                   Follow-up visit required
  //                 </Checkbox>

  //                 <Checkbox value="customerAction">
  //                   Customer action required
  //                 </Checkbox>

  //                 <Checkbox value="technicalSupportChina">
  //                   Technical / spare support required from Haitian China
  //                 </Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           <ViewLargeText name="requiredActionFollowUp" viewForm={viewForm} />

  //           {/* ==========================================================
  //         SECTION 10
  //     ========================================================== */}

  //           <ViewSectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />

  //           <Form.Item
  //             name="serviceCommercialClassification"
  //             style={{
  //               marginBottom: 20,
  //             }}
  //           >
  //             <Checkbox.Group
  //               className="view-checkbox-group"
  //               style={{
  //                 width: "100%",
  //                 pointerEvents: "none",
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   display: "grid",
  //                   gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  //                   gap: "12px 20px",
  //                   padding: "12px",
  //                   background: "#F8FAFC",
  //                   border: "1px solid #D9E2EA",
  //                   borderRadius: "6px",
  //                 }}
  //               >
  //                 <Checkbox value="focCommissioning">
  //                   F.O.C. Commissioning
  //                 </Checkbox>

  //                 <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>

  //                 <Checkbox value="warrantyService">Warranty Service</Checkbox>

  //                 <Checkbox value="chargeableMaintenance">
  //                   Chargeable Maintenance
  //                 </Checkbox>

  //                 <Checkbox value="customerVisitService">
  //                   Customer Visit (Service)
  //                 </Checkbox>

  //                 <Checkbox value="serviceContract">Service Contract</Checkbox>

  //                 <Checkbox value="goodwill">Goodwill</Checkbox>

  //                 <Checkbox value="chargeableCommissioning">
  //                   Chargeable commissioning
  //                 </Checkbox>
  //               </div>
  //             </Checkbox.Group>
  //           </Form.Item>

  //           {/* ==========================================================
  //         SECTION 11
  //     ========================================================== */}

  //           <ViewSectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />

  //           <div
  //             style={{
  //               background: "#F1F6FA",
  //               border: "1px solid #D9E2EA",
  //               borderRadius: "6px",
  //               padding: "14px 16px",
  //               marginBottom: "20px",
  //               fontSize: "15px",
  //               lineHeight: "1.6",
  //             }}
  //           >
  //             I acknowledge that the above service work has been carried out and
  //             the machine status / further action has been explained to me.
  //           </div>

  //           {/* ==========================================================
  //         SIGNATURES
  //     ========================================================== */}

  //           <div className="row">
  //             {/* TECHNICIAN */}

  //             <ViewSignatureCard
  //               title="Service Technician"
  //               name={viewForm.getFieldValue("technicianName")}
  //               date={viewForm.getFieldValue("technicianDate")}
  //               // signature={viewReport?.["Technician Signature"]}
  //             />

  //             {/* MANAGER */}

  //             <ViewSignatureCard
  //               title="Service Manager"
  //               name={viewForm.getFieldValue("managerName")}
  //               date={viewForm.getFieldValue("managerDate")}
  //               // signature={viewReport?.["Manager Signature"]}
  //             />

  //             {/* CUSTOMER */}

  //             <ViewSignatureCard
  //               title="Customer"
  //               name={viewForm.getFieldValue("customerName")}
  //               date={viewForm.getFieldValue("customerDate")}
  //               // signature={viewReport?.["Customer Signature"]}
  //             />
  //           </div>

  //           {/* ==========================================================
  //         CLOSE
  //     ========================================================== */}

  //           <div
  //             style={{
  //               textAlign: "center",
  //               marginTop: "28px",
  //               paddingTop: "18px",
  //               borderTop: "1px solid #D9E2EA",
  //             }}
  //           >
  //             <Button
  //               size="large"
  //               className="view-close-button"
  //               onClick={() => {
  //                 setViewModalOpen(false);
  //                 setViewReport(null);
  //                 setViewPartsData([]);
  //                 viewForm.resetFields();
  //               }}
  //             >
  //               Close Report
  //             </Button>
  //           </div>
  //         </Form>
  //       </Modal>
  //     </div>
  //   );
  // }

  // // ============================================================
  // // SECTION TITLE
  // // ============================================================

  // function SectionTitle({ title }) {
  //   return (
  //     <div
  //       style={{
  //         width: "100%",
  //         backgroundColor: "#0d3884",
  //         color: "#FFFFFF",
  //         fontSize: "16px",
  //         fontWeight: 600,
  //         padding: "9px 14px",
  //         marginTop: "20px",
  //         marginBottom: "16px",
  //         borderRadius: 0,
  //       }}
  //     >
  //       {title}
  //     </div>
  //   );
  // }

  import React, { useState, useRef, useEffect } from "react";

  import {
    Form,
    Input,
    Button,
    Checkbox,
    InputNumber,
    Tooltip,
    Avatar,
    Dropdown,
    Table,
    notification,
    Space,
    AutoComplete,
    Select,
    Modal,
  } from "antd";

  import {
    MailOutlined,
    LogoutOutlined,
    EyeOutlined,
    EditOutlined,
    DownloadOutlined,
    SearchOutlined,
    ReloadOutlined,
    ClearOutlined,
  } from "@ant-design/icons";

  import "bootstrap/dist/css/bootstrap.min.css";
  import "antd/dist/reset.css";
  import SignatureCanvas from "react-signature-canvas";
  import { jsPDF } from "jspdf";
  import autoTable from "jspdf-autotable";
  import HaitianLogo from "../Images/HaitianLogo.png";
  import "./../App.css";

  // ============================================================
  // TECHNICIAN OPTIONS
  // Same technician options used in Code 1
  // ============================================================

  const technicianOptions = [
    "Palani",
    "Sampath",
    "Karpagaraj",
    "Balaji",
    "Eswar",
    "Ganesh",
    "Sunderesh",
  ];

  // ============================================================
  // GOOGLE APPS SCRIPT DEPLOYMENT
  // This must be the deployment containing getAllCustomerData.
  // ============================================================
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbyBfzpDXdIjPjdU5_XNOTKnSONqHclSjFE3NoN1J8rvTQ43gj3eS-VPCDbf-IKRx4TS/exec";

  // ============================================================
  // PDF GENERATION - V2
  // Fixed 2-page A4 layout based on the supplied Haitian reference.
  // ============================================================

  const PDF_BLUE = "#24567D";
  const PDF_LIGHT_BLUE = "#DCEAF5";
  const PDF_PALE_BLUE = "#F1F6FA";
  const PDF_BORDER = "#B8C8D3";
  const PDF_TEXT = "#111111";

  const pdfSafe = (value) => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  // Parts-table PDF values:
  // Keep the row visible even when the user has not entered anything.
  const pdfPartSafe = (value) => {
    const text = pdfSafe(value).trim();
    return text || "-";
  };

  const pdfSelected = (selected, key) => {
    if (!Array.isArray(selected)) return false;
    return selected.includes(key);
  };

  const pdfHeader = (doc, reportNumber) => {
    const pageWidth = doc.internal.pageSize.getWidth();

    // ============================================================
    // PREVIOUS PROJECT HEADER
    // ============================================================

    const haitianLogoWidth = 52;
    const haitianLogoHeight = 17;

    doc.addImage(HaitianLogo, "PNG", 10, 1, haitianLogoWidth, haitianLogoHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#0C3C74");
    doc.text("Service Report", pageWidth - 60, 9);

    doc.setTextColor(255, 0, 0);
    doc.text("No.", 150, 14.5);

    doc.text(pdfSafe(reportNumber) || "N/A", 157, 14.5);

    doc.setDrawColor(12, 60, 116);
    doc.setLineWidth(0.5);
    doc.line(0, 18, pageWidth, 18);

    doc.setTextColor(PDF_TEXT);
  };

  const pdfFooter = (doc, pageNumber, totalPages) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    const footerY = pageHeight - 14;
    const centerX = pageWidth / 2;

    doc.setTextColor("#0C3C74");

    // Footer separator line
    const lineY = footerY - 3;
    doc.setDrawColor(12, 60, 116);
    doc.setLineWidth(0.5);
    doc.line(10, lineY, pageWidth - 10, lineY);

    // Company name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Haitian Middle East LLC", centerX, footerY + 1.5, {
      align: "center",
    });

    // Address
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "Umm El Thoub, Umm Al Quwain, United Arab Emirates",
      centerX,
      footerY + 6,
      {
        align: "center",
      },
    );

    // Contact information
    doc.text(
      "Tel: +971 688 457 78  Mob: +971 58 555 7475  Email: ask@haitianme.com  Web: www.haitianme.com",
      centerX - 3,
      footerY + 11,
      {
        align: "center",
      },
    );

    // ============================================================
    // PAGE NUMBER - RIGHT END OF FOOTER
    // ============================================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#555555");

    doc.text(
      `Page ${pageNumber} of ${totalPages}`,
      pageWidth - 10,
      footerY + 11,
      {
        align: "right",
      },
    );

    doc.setTextColor(PDF_TEXT);
  };

  const pdfSection = (doc, title, y, margin = 13) => {
    const w = doc.internal.pageSize.getWidth();
    doc.setFillColor(PDF_BLUE);
    doc.rect(margin, y, w - margin * 2, 6.8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor("#FFFFFF");
    doc.text(title, margin + 2.8, y + 4.55);

    return y + 8.2;
  };

  const pdfFieldCompact = (doc, label, value, x, y, width, height = 10.5) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);
    doc.text(label, x, y + 4);

    doc.setDrawColor("#9FB6C7");
    doc.setLineWidth(0.28);
    doc.line(x, y + height, x + width, y + height);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    const valueText = pdfSafe(value);
    const lines = doc.splitTextToSize(valueText, width - 2);

    if (lines.length) {
      doc.text(lines.slice(0, 2), x, y + 7.1);
    }
  };

  const pdfFieldCompactWithMoreGap = (
    doc,
    label,
    value,
    x,
    y,
    width,
    height = 9.5,
  ) => {
    // ------------------------------------------------------------
    // LABEL
    // ------------------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);

    doc.text(label, x, y + 2.4);

    // ------------------------------------------------------------
    // BOTTOM LINE
    // ------------------------------------------------------------

    doc.setDrawColor("#9FB6C7");
    doc.setLineWidth(0.28);

    doc.line(x, y + height, x + width, y + height);

    // ------------------------------------------------------------
    // VALUE
    // ------------------------------------------------------------

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    const valueText = pdfSafe(value);

    const lines = doc.splitTextToSize(valueText, width - 2);

    if (lines.length) {
      doc.text(lines.slice(0, 2), x, y + 8.2);
    }
  };

  const pdfTextArea = (doc, value, x, y, width, height) => {
    doc.setDrawColor(PDF_BORDER);
    doc.setLineWidth(0.28);
    doc.rect(x, y, width, height, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    const lines = doc.splitTextToSize(pdfSafe(value), width - 4);
    const maxLines = Math.max(1, Math.floor((height - 4) / 3.3));
    doc.text(lines.slice(0, maxLines), x + 2, y + 5);
  };

  const pdfCheckbox = (doc, x, y, isChecked, label, fontSize = 9) => {
    const checkboxSize = 4;

    // Checkbox
    doc.setDrawColor(PDF_BLUE);
    doc.setLineWidth(0.3);

    doc.rect(x, y, checkboxSize, checkboxSize);

    // Checkmark
    if (isChecked) {
      doc.setFont("Zapfdingbats", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      doc.text("4", x + 0.6, y + 3.5);

      // Always return to Helvetica
      doc.setFont("helvetica", "normal");
    }

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(PDF_TEXT);

    doc.text(pdfSafe(label), x + checkboxSize + 1.5, y + 3.4);
  };

  const pdfSignature = (doc, x, y, width, title, name, date, signature) => {
    // ============================================================
    // TITLE
    // ============================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);

    doc.text(title, x + width / 2, y, { align: "center" });

    // ============================================================
    // NAME
    // ============================================================

    doc.setFillColor(PDF_LIGHT_BLUE);
    doc.setDrawColor(PDF_BORDER);

    // Name box
    doc.rect(x, y + 3, width, 5, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    doc.text(pdfSafe(name), x + 1, y + 6.5);

    // Name label
    doc.setFontSize(9);
    doc.setTextColor("#555555");

    doc.text("Name", x, y + 12);

    // ============================================================
    // DATE
    // ============================================================

    doc.setFillColor(PDF_LIGHT_BLUE);

    doc.rect(x, y + 16, width, 5, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    doc.text(pdfSafe(date), x + 1, y + 19.5);

    // Date label
    doc.setFontSize(9);
    doc.setTextColor("#555555");

    doc.text("Date", x, y + 24.5);

    // ============================================================
    // SIGNATURE BOX
    // ============================================================

    doc.setFillColor("#FFFFFF");
    doc.setDrawColor(PDF_BORDER);

    const signatureBoxY = y + 28;
    const signatureBoxHeight = 25;

    doc.rect(x, signatureBoxY, width, signatureBoxHeight, "FD");

    // ============================================================
    // SIGNATURE IMAGE
    // Keep completely inside the signature box
    // ============================================================

    if (signature) {
      try {
        const signaturePaddingX = 1;
        const signaturePaddingY = 1;

        doc.addImage(
          signature,
          "PNG",
          x + signaturePaddingX,
          signatureBoxY + signaturePaddingY,
          width - signaturePaddingX * 2,
          signatureBoxHeight - signaturePaddingY * 2,
        );
      } catch (error) {
        console.warn("Unable to place signature:", error);
      }
    }

    // ============================================================
    // SIGNATURE / STAMP LABEL
    // ============================================================

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#555555");

    doc.text("Signature / Stamp", x, y + 56);
  };

  const initializeZapfDingbats = (doc) => {
    // Initialize ZapfDingbats once before the first real checkmark
    doc.setFont("Zapfdingbats", "normal");
    doc.setFontSize(1);
    doc.setTextColor(255, 255, 255);

    // Draw outside the visible page
    doc.text("4", -10, -10);

    // Return to Helvetica
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);
  };

  const generateServiceReportPDF = async (
    values,
    reportNumber,
    signatureTechnician,
    signatureManager,
    signatureCustomer,
  ) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    initializeZapfDingbats(doc);
    // ============================================================
    // A4 PAGE SETUP
    // ============================================================

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 10;
    const contentWidth = pageWidth - margin * 2;

    // Equal left/right columns
    const columnGap = 14;

    const columnWidth = (contentWidth - columnGap) / 2;

    const rightX = margin + columnWidth + columnGap;

    // ============================================================
    // PAGE 1
    // ============================================================

    pdfHeader(doc, reportNumber);

    // ============================================================
    // PAGE 1 CONTENT START
    // ============================================================

    // Keep the original starting Y position so the existing
    // PDF section layout remains unchanged.
    let y = 29;

    // ============================================================
    // PAGE 1 FIELD HELPER
    // ============================================================
    //
    // IMPORTANT:
    // Both left and right fields use exactly the same height.
    // This prevents the horizontal lines from becoming misaligned.
    //
    // ============================================================

    const pdfFieldPage1 = (doc, label, value, x, fieldY, width) => {
      const fieldHeight = 10.5;

      // ----------------------------------------------------------
      // LABEL
      // ----------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(PDF_BLUE);

      doc.text(pdfSafe(label), x, fieldY + 2.7);

      // ----------------------------------------------------------
      // VALUE
      // ----------------------------------------------------------

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF_TEXT);

      const valueText = pdfSafe(value);

      const valueLines = doc.splitTextToSize(valueText, width - 2);

      if (valueLines.length > 0) {
        doc.text(valueLines[0], x, fieldY + 8);
      }

      // ----------------------------------------------------------
      // BOTTOM LINE
      // ----------------------------------------------------------
      //
      // EXACT SAME Y POSITION FOR EVERY FIELD
      //
      // ----------------------------------------------------------

      doc.setDrawColor("#9FB6C7");
      doc.setLineWidth(0.25);

      doc.line(x, fieldY + 9, x + width, fieldY + 9);
    };

    // ============================================================
    // PAGE 1 TEXT AREA HELPER
    // ============================================================

    const pdfTextAreaPage1 = (doc, value, x, textY, width, height) => {
      doc.setDrawColor(PDF_BORDER);
      doc.setLineWidth(0.28);

      doc.rect(x, textY, width, height, "S");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF_TEXT);

      const lines = doc.splitTextToSize(pdfSafe(value), width - 5);

      const lineHeight = 3.5;

      const maxLines = Math.max(1, Math.floor((height - 4) / lineHeight));

      doc.text(lines.slice(0, maxLines), x + 2.5, textY + 5);
    };

    // ============================================================
    // 1. CUSTOMER & VISIT INFORMATION
    // ============================================================

    y = 21;

    y = pdfSection(doc, "1. CUSTOMER & VISIT INFORMATION", y, margin);

    // Space below section heading
    y += 2;

    const customerRows = [
      ["Customer", values.customer, "Service Date", values.serviceDate],

      [
        "Site / Location",
        values.siteLocation,
        "Contact Person",
        values.contactPerson,
      ],

      [
        "Contact No.",
        values.contactNo,
        "Technician",
        Array.isArray(values.technician)
          ? values.technician.join(", ")
          : values.technician,
      ],

      [
        "Arrival Time",
        values.arrivalTime,
        "Completion Time",
        values.completionTime,
      ],

      [
        "Total Working Hours",
        values.totalWorkingHours,
        "Service Visit Ref.",
        values.serviceVisitRef,
      ],
    ];

    customerRows.forEach((row) => {
      // LEFT FIELD
      pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

      // RIGHT FIELD
      pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

      // Equal row spacing
      y += 11.5;
    });

    // ============================================================
    // SPACE BETWEEN SECTION 1 AND SECTION 2
    // ============================================================

    y += 3;

    // ============================================================
    // 2. MACHINE INFORMATION
    // ============================================================

    y = pdfSection(doc, "2. MACHINE INFORMATION", y, margin);

    y += 2;

    const machineRows = [
      ["Machine Model", values.machineModel, "Serial No.", values.serialNo],

      [
        "Installation year",
        values.installationYear,
        "Machine Running Hours",
        values.machineRunningHours,
      ],

      [
        "Controller",
        values.softwareVersion,
        "Warranty Status",
        values.warrantyStatus,
      ],
    ];

    machineRows.forEach((row) => {
      // LEFT FIELD
      pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

      // RIGHT FIELD
      pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

      // Equal row spacing
      y += 11.5;
    });

    // ============================================================
    // SPACE BETWEEN SECTION 2 AND SECTION 3
    // ============================================================

    y += 3;

    // ============================================================
    // 3. SERVICE CATEGORY
    // ============================================================

    y = pdfSection(doc, "3. SERVICE CATEGORY", y, margin);

    y += 2;

    const serviceCategories = [
      ["installation", "Installation / Commissioning"],

      ["breakdown", "Breakdown / Defect"],

      ["preventive", "Preventive Maintenance"],

      ["corrective", "Corrective Maintenance"],

      ["inspection", "Inspection"],

      ["customerVisit", "Customer Visit"],

      ["software", "Software / Program"],

      ["other", "Other"],
    ];

    const serviceXs = [margin, margin + 50, margin + 90, margin + 135];

    serviceCategories.forEach(([key, label], index) => {
      const row = Math.floor(index / 4);

      const x = serviceXs[index % 4];

      pdfCheckbox(
        doc,
        x,
        y + row * 6.5,
        pdfSelected(values.serviceCategory, key),
        label,
        9,
      );
    });

    // Space after Section 3
    y += 17;

    // ============================================================
    // 4. CUSTOMER COMPLAINT
    // ============================================================

    y = pdfSection(doc, "4. CUSTOMER COMPLAINT / REPORTED PROBLEM", y, margin);

    y += 1.5;

    pdfTextAreaPage1(doc, values.customerComplaint, margin, y, contentWidth, 20);

    // ============================================================
    // SPACE BETWEEN SECTION 4 AND SECTION 5
    // ============================================================

    y += 25;

    // ============================================================
    // 5. TECHNICIAN DIAGNOSIS
    // ============================================================

    y = pdfSection(doc, "5. TECHNICIAN DIAGNOSIS / ROOT CAUSE", y, margin);

    y += 1.5;

    pdfTextAreaPage1(
      doc,
      values.technicianDiagnosis,
      margin,
      y,
      contentWidth,
      20,
    );

    // ============================================================
    // SPACE BETWEEN SECTION 5 AND SECTION 6
    // ============================================================

    y += 25;

    // ============================================================
    // 6. WORK PERFORMED
    // ============================================================

    y = pdfSection(doc, "6. WORK PERFORMED / CORRECTIVE ACTION", y, margin);

    y += 1.5;

    pdfTextAreaPage1(doc, values.workPerformed, margin, y, contentWidth, 20);

    // ============================================================
    // PAGE 2
    // ============================================================

    doc.addPage();
    initializeZapfDingbats(doc);

    pdfHeader(doc, reportNumber);

    y = 20;

    // ============================================================
    // 7. MACHINE TRIAL & FINAL STATUS
    // ============================================================

    y = pdfSection(doc, "7. MACHINE TRIAL & FINAL STATUS", y, margin);

    y += 2;

    const trialStatuses = [
      ["machineTestedSuccessfully", "Machine tested successfully"],

      ["machineRunningNormally", "Machine running normally"],

      ["runningWithObservation", "Running with observation"],

      ["machineStopped", "Machine stopped - further action required"],

      ["customerAdvised", "Customer advised / awaiting action"],
    ];

    // ============================================================
    // SECTION 7 OPTIONS
    // 2 ROWS
    // SAME FONT SIZE AS PAGE 1 CHECKPOINT OPTIONS
    // ============================================================

    const trialOptionPositions = [
      // ROW 1
      {
        x: margin,
        row: 0,
      },
      {
        x: margin + 70,
        row: 0,
      },
      {
        x: margin + 133,
        row: 0,
      },

      // ROW 2
      {
        x: margin,
        row: 1,
      },
      {
        x: margin + 70,
        row: 1,
      },
    ];

    trialStatuses.forEach(([key, label], index) => {
      const position = trialOptionPositions[index];

      pdfCheckbox(
        doc,
        position.x,
        y + position.row * 6,
        pdfSelected(values.machineTrialStatus, key),
        label,
        9,
      );
    });

    y += 14;

    pdfFieldCompactWithMoreGap(
      doc,
      "Trial Duration",
      values.trialDuration,
      margin,
      y,
      columnWidth,
      9.5,
    );

    pdfFieldCompactWithMoreGap(
      doc,
      "Cycle Time",
      values.cycleTime,
      rightX,
      y,
      columnWidth,
      9.5,
    );

    y += 12;

    pdfFieldCompactWithMoreGap(
      doc,
      "Product / Material",
      values.productMaterial,
      margin,
      y - 0.5,
      contentWidth,
      9.5,
    );

    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);

    doc.text("Trial / Status Remarks", margin, y + 2);

    pdfTextArea(doc, values.trialStatusRemarks, margin, y + 4, contentWidth, 12);

    y += 19;

    // ============================================================
    // 8. PARTS USED / RECOMMENDED
    // ============================================================

    y = pdfSection(doc, "8. PARTS USED / RECOMMENDED", y, margin);

    const parts = Array.isArray(values.parts) ? values.parts : [];

    // Always show at least 3 part rows in the PDF.
    // Empty cells are displayed as "-".
    const normalizedParts = [...parts];

    while (normalizedParts.length < 3) {
      normalizedParts.push({
        partNo: "",
        description: "",
        qty: "",
        usedRecommended: "",
        remarks: "",
      });
    }

    const partRows = normalizedParts.map((part) => [
      pdfPartSafe(part?.partNo),
      pdfPartSafe(part?.description),
      pdfPartSafe(part?.qty),
      pdfPartSafe(part?.usedRecommended),
      pdfPartSafe(part?.remarks),
    ]);

    autoTable(doc, {
      startY: y + 1,

      margin: {
        left: margin,
        right: margin,
      },

      tableWidth: contentWidth,

      head: [["Part No.", "Description", "Qty", "Used / Recommended", "Remarks"]],

      body: partRows,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 7.5,
        cellPadding: 1.6,
        lineColor: "#B8C8D3",
        lineWidth: 0.25,
        textColor: PDF_TEXT,
        valign: "middle",
        minCellHeight: 6.5,
      },

      headStyles: {
        fillColor: [216, 231, 243],
        textColor: [31, 78, 121],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 1.7,
      },

    columnStyles: {
        0: {
          cellWidth: 40,
        },

        1: {
          cellWidth: 47,
        },

        2: {
          cellWidth: 12,
        },

        3: {
          cellWidth: 46.5,
        },

        4: {
          cellWidth: 46.5,
        },
      },
    });

    y = doc.lastAutoTable.finalY + 4;

    // ============================================================
    // 9. FURTHER ACTION REQUIRED
    // ============================================================

    y = pdfSection(doc, "9. FURTHER ACTION REQUIRED", y, margin);

    y += 2;

    const furtherActions = [
      ["noFurtherAction", "No further action required"],

      ["partsRequired", "Parts required"],

      ["followUpVisit", "Follow-up visit required"],

      ["customerAction", "Customer action required"],

      [
        "technicalSupportChina",
        "Technical / spare support required from Haitian China",
      ],
    ];

    // ============================================================
    // SECTION 9 OPTIONS
    // 2 ROWS
    // ROW 1 = 3 OPTIONS
    // ROW 2 = 2 OPTIONS
    // ============================================================

    const furtherActionPositions = [
      // ROW 1
      {
        x: margin,
        row: 0,
      },
      {
        x: margin + 65,
        row: 0,
      },
      {
        x: margin + 130,
        row: 0,
      },

      // ROW 2
      {
        x: margin,
        row: 1,
      },
      {
        x: margin + 65,
        row: 1,
      },
    ];

    furtherActions.forEach(([key, label], index) => {
      const position = furtherActionPositions[index];

      pdfCheckbox(
        doc,
        position.x,
        y + position.row * 7,
        pdfSelected(values.furtherAction, key),
        label,
        9,
      );
    });

    y += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);

    doc.text("Required Action / Follow-up", margin, y + 2);

    pdfTextArea(
      doc,
      values.requiredActionFollowUp,
      margin,
      y + 4,
      contentWidth,
      12,
    );

    y += 19;

    // ============================================================
    // 10. SERVICE COMMERCIAL CLASSIFICATION
    // ============================================================

    y = pdfSection(doc, "10. SERVICE COMMERCIAL CLASSIFICATION", y, margin);

    y += 2;

    const commercial = [
      ["focCommissioning", "F.O.C. Commissioning"],

      ["focMaintenance", "F.O.C. Maintenance"],

      ["warrantyService", "Warranty Service"],

      ["chargeableMaintenance", "Chargeable Maintenance"],

      ["customerVisitService", "Customer Visit (Service)"],

      ["serviceContract", "Service Contract"],

      ["goodwill", "Goodwill"],

      ["chargeableCommissioning", "Chargeable commissioning"],
    ];

    commercial.forEach(([key, label], index) => {
      const row = Math.floor(index / 4);

      const x = margin + (index % 4) * 45;

      pdfCheckbox(
        doc,
        x,
        y + row * 7.5,
        pdfSelected(values.serviceCommercialClassification, key),
        label,
        9,
      );
    });

    y += 17;

    // ============================================================
    // 11. CUSTOMER ACKNOWLEDGEMENT
    // ============================================================

    y = pdfSection(doc, "11. CUSTOMER ACKNOWLEDGEMENT", y, margin);

    doc.setFillColor("#F1F6FA");

    doc.rect(margin, y + 1, contentWidth, 8, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    const acknowledgement =
      "I acknowledge that the above service work has been carried out and the machine status / further action has been explained to us.";

    const ackLines = doc.splitTextToSize(acknowledgement, contentWidth - 6);

    doc.text(ackLines.slice(0, 2), margin + 1.5, y + 6.2);

    y += 15;

    // ============================================================
    // SIGNATURES
    // ============================================================

    const sigGap = 6;

    const sigWidth = (contentWidth - sigGap * 2) / 3;

    // ------------------------------------------------------------
    // TECHNICIAN
    // ------------------------------------------------------------

    pdfSignature(
      doc,
      margin,
      y,
      sigWidth,
      "Service Technician",
      values.technicianName,
      values.technicianDate,
      signatureTechnician,
    );

    // ------------------------------------------------------------
    // MANAGER
    // ------------------------------------------------------------

    pdfSignature(
      doc,
      margin + sigWidth + sigGap,
      y,
      sigWidth,
      "Service Manager",
      values.managerName,
      values.managerDate,
      signatureManager,
    );

    // ------------------------------------------------------------
    // CUSTOMER
    // ------------------------------------------------------------

    pdfSignature(
      doc,
      margin + (sigWidth + sigGap) * 2,
      y,
      sigWidth,
      "Customer",
      values.customerName,
      values.customerDate,
      signatureCustomer,
    );

    // ============================================================
    // SAVE PDF
    // ============================================================

    const filenameCustomer =
      pdfSafe(values.customer)
        .trim()
        .replace(/[^\w\s-]+/g, "")
        .replace(/\s+/g, " ") || "Customer";

    const filenameSRN =
      pdfSafe(reportNumber)
        .trim()
        .replace(/[^\w-]+/g, "_") || "SRN";

    const fileName = `HT Service Report ${filenameCustomer} ${filenameSRN}.pdf`;

    // Return the PDF as a data URI so it can be uploaded to
    // Google Apps Script and saved in the configured Google Drive folder.
    // The actual browser download is still performed after the Drive
    // upload succeeds, preserving the existing download behavior.
    // ============================================================
    // ADD PREVIOUS PROJECT FOOTER TO EVERY PDF PAGE
    // ============================================================

    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      pdfFooter(doc, page, totalPages);
    }

    const pdfBase64 = doc.output("datauristring");

    return {
      fileName,
      pdfBase64,
      doc,
      reportNumber: String(reportNumber || "").trim(),
    };
  };

  const generateEditServiceReportPDF = async (
    values,
    reportNumber,
    signatureTechnician,
    signatureManager,
    signatureCustomer,
  ) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    initializeZapfDingbats(doc);
    // ============================================================
    // A4 PAGE SETUP
    // ============================================================

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 10;
    const contentWidth = pageWidth - margin * 2;

    // Equal left/right columns
    const columnGap = 14;

    const columnWidth = (contentWidth - columnGap) / 2;

    const rightX = margin + columnWidth + columnGap;

    // ============================================================
    // PAGE 1
    // ============================================================

    pdfHeader(doc, reportNumber);

    // ============================================================
    // PAGE 1 CONTENT START
    // ============================================================

    // Keep the original starting Y position so the existing
    // PDF section layout remains unchanged.
    let y = 29;

    // ============================================================
    // PAGE 1 FIELD HELPER
    // ============================================================
    //
    // IMPORTANT:
    // Both left and right fields use exactly the same height.
    // This prevents the horizontal lines from becoming misaligned.
    //
    // ============================================================

    const pdfFieldPage1 = (doc, label, value, x, fieldY, width) => {
      const fieldHeight = 10.5;

      // ----------------------------------------------------------
      // LABEL
      // ----------------------------------------------------------

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(PDF_BLUE);

      doc.text(pdfSafe(label), x, fieldY + 2.7);

      // ----------------------------------------------------------
      // VALUE
      // ----------------------------------------------------------

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF_TEXT);

      const valueText = pdfSafe(value);

      const valueLines = doc.splitTextToSize(valueText, width - 2);

      if (valueLines.length > 0) {
        doc.text(valueLines[0], x, fieldY + 8);
      }

      // ----------------------------------------------------------
      // BOTTOM LINE
      // ----------------------------------------------------------
      //
      // EXACT SAME Y POSITION FOR EVERY FIELD
      //
      // ----------------------------------------------------------

      doc.setDrawColor("#9FB6C7");
      doc.setLineWidth(0.25);

      doc.line(x, fieldY + 9, x + width, fieldY + 9);
    };

    // ============================================================
    // PAGE 1 TEXT AREA HELPER
    // ============================================================

    const pdfTextAreaPage1 = (doc, value, x, textY, width, height) => {
      doc.setDrawColor(PDF_BORDER);
      doc.setLineWidth(0.28);

      doc.rect(x, textY, width, height, "S");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF_TEXT);

      const lines = doc.splitTextToSize(pdfSafe(value), width - 5);

      const lineHeight = 3.5;

      const maxLines = Math.max(1, Math.floor((height - 4) / lineHeight));

      doc.text(lines.slice(0, maxLines), x + 2.5, textY + 5);
    };

    // ============================================================
    // 1. CUSTOMER & VISIT INFORMATION
    // ============================================================

    y = 21;

    y = pdfSection(doc, "1. CUSTOMER & VISIT INFORMATION", y, margin);

    // Space below section heading
    y += 2;

    const customerRows = [
      ["Customer", values.customer, "Service Date", values.serviceDate],

      [
        "Site / Location",
        values.siteLocation,
        "Contact Person",
        values.contactPerson,
      ],

      [
        "Contact No.",
        values.contactNo,
        "Technician",
        Array.isArray(values.technician)
          ? values.technician.join(", ")
          : values.technician,
      ],

      [
        "Arrival Time",
        values.arrivalTime,
        "Completion Time",
        values.completionTime,
      ],

      [
        "Total Working Hours",
        values.totalWorkingHours,
        "Service Visit Ref.",
        values.serviceVisitRef,
      ],
    ];

    customerRows.forEach((row) => {
      // LEFT FIELD
      pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

      // RIGHT FIELD
      pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

      // Equal row spacing
      y += 11.5;
    });

    // ============================================================
    // SPACE BETWEEN SECTION 1 AND SECTION 2
    // ============================================================

    y += 3;

    // ============================================================
    // 2. MACHINE INFORMATION
    // ============================================================

    y = pdfSection(doc, "2. MACHINE INFORMATION", y, margin);

    y += 2;

    const machineRows = [
      ["Machine Model", values.machineModel, "Serial No.", values.serialNo],

      [
        "Installation year",
        values.installationYear,
        "Machine Running Hours",
        values.machineRunningHours,
      ],

      [
        "Controller",
        values.softwareVersion,
        "Warranty Status",
        values.warrantyStatus,
      ],
    ];

    machineRows.forEach((row) => {
      // LEFT FIELD
      pdfFieldPage1(doc, row[0], row[1], margin, y, columnWidth);

      // RIGHT FIELD
      pdfFieldPage1(doc, row[2], row[3], rightX, y, columnWidth);

      // Equal row spacing
      y += 11.5;
    });

    // ============================================================
    // SPACE BETWEEN SECTION 2 AND SECTION 3
    // ============================================================

    y += 3;

    // ============================================================
    // 3. SERVICE CATEGORY
    // ============================================================

    y = pdfSection(doc, "3. SERVICE CATEGORY", y, margin);

    y += 2;

    const serviceCategories = [
      ["installation", "Installation / Commissioning"],

      ["breakdown", "Breakdown / Defect"],

      ["preventive", "Preventive Maintenance"],

      ["corrective", "Corrective Maintenance"],

      ["inspection", "Inspection"],

      ["customerVisit", "Customer Visit"],

      ["software", "Software / Program"],

      ["other", "Other"],
    ];

    const serviceXs = [margin, margin + 50, margin + 90, margin + 135];

    serviceCategories.forEach(([key, label], index) => {
      const row = Math.floor(index / 4);

      const x = serviceXs[index % 4];

      pdfCheckbox(
        doc,
        x,
        y + row * 6.5,
        pdfSelected(values.serviceCategory, key),
        label,
        9,
      );
    });

    // Space after Section 3
    y += 17;

    // ============================================================
    // 4. CUSTOMER COMPLAINT
    // ============================================================

    y = pdfSection(doc, "4. CUSTOMER COMPLAINT / REPORTED PROBLEM", y, margin);

    y += 1.5;

    pdfTextAreaPage1(doc, values.customerComplaint, margin, y, contentWidth, 20);

    // ============================================================
    // SPACE BETWEEN SECTION 4 AND SECTION 5
    // ============================================================

    y += 25;

    // ============================================================
    // 5. TECHNICIAN DIAGNOSIS
    // ============================================================

    y = pdfSection(doc, "5. TECHNICIAN DIAGNOSIS / ROOT CAUSE", y, margin);

    y += 1.5;

    pdfTextAreaPage1(
      doc,
      values.technicianDiagnosis,
      margin,
      y,
      contentWidth,
      20,
    );

    // ============================================================
    // SPACE BETWEEN SECTION 5 AND SECTION 6
    // ============================================================

    y += 25;

    // ============================================================
    // 6. WORK PERFORMED
    // ============================================================

    y = pdfSection(doc, "6. WORK PERFORMED / CORRECTIVE ACTION", y, margin);

    y += 1.5;

    pdfTextAreaPage1(doc, values.workPerformed, margin, y, contentWidth, 20);

    // ============================================================
    // PAGE 2
    // ============================================================

    doc.addPage();
    initializeZapfDingbats(doc);

    pdfHeader(doc, reportNumber);

    y = 20;

    // ============================================================
    // 7. MACHINE TRIAL & FINAL STATUS
    // ============================================================

    y = pdfSection(doc, "7. MACHINE TRIAL & FINAL STATUS", y, margin);

    y += 2;

    const trialStatuses = [
      ["machineTestedSuccessfully", "Machine tested successfully"],

      ["machineRunningNormally", "Machine running normally"],

      ["runningWithObservation", "Running with observation"],

      ["machineStopped", "Machine stopped - further action required"],

      ["customerAdvised", "Customer advised / awaiting action"],
    ];

    // ============================================================
    // SECTION 7 OPTIONS
    // 2 ROWS
    // SAME FONT SIZE AS PAGE 1 CHECKPOINT OPTIONS
    // ============================================================

    const trialOptionPositions = [
      // ROW 1
      {
        x: margin,
        row: 0,
      },
      {
        x: margin + 70,
        row: 0,
      },
      {
        x: margin + 133,
        row: 0,
      },

      // ROW 2
      {
        x: margin,
        row: 1,
      },
      {
        x: margin + 70,
        row: 1,
      },
    ];

    trialStatuses.forEach(([key, label], index) => {
      const position = trialOptionPositions[index];

      pdfCheckbox(
        doc,
        position.x,
        y + position.row * 6,
        pdfSelected(values.machineTrialStatus, key),
        label,
        9,
      );
    });

    y += 14;

    pdfFieldCompactWithMoreGap(
      doc,
      "Trial Duration",
      values.trialDuration,
      margin,
      y,
      columnWidth,
      9.5,
    );

    pdfFieldCompactWithMoreGap(
      doc,
      "Cycle Time",
      values.cycleTime,
      rightX,
      y,
      columnWidth,
      9.5,
    );

    y += 12;

    pdfFieldCompactWithMoreGap(
      doc,
      "Product / Material",
      values.productMaterial,
      margin,
      y - 0.5,
      contentWidth,
      9.5,
    );

    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);

    doc.text("Trial / Status Remarks", margin, y + 2);

    pdfTextArea(doc, values.trialStatusRemarks, margin, y + 4, contentWidth, 12);

    y += 19;

    // ============================================================
    // 8. PARTS USED / RECOMMENDED
    // ============================================================

    y = pdfSection(doc, "8. PARTS USED / RECOMMENDED", y, margin);

    const parts = Array.isArray(values.parts) ? values.parts : [];

    // Always show at least 3 part rows in the PDF.
    // Empty cells are displayed as "-".
    const normalizedParts = [...parts];

    while (normalizedParts.length < 3) {
      normalizedParts.push({
        partNo: "",
        description: "",
        qty: "",
        usedRecommended: "",
        remarks: "",
      });
    }

    const partRows = normalizedParts.map((part) => [
      pdfPartSafe(part?.partNo),
      pdfPartSafe(part?.description),
      pdfPartSafe(part?.qty),
      pdfPartSafe(part?.usedRecommended),
      pdfPartSafe(part?.remarks),
    ]);

    autoTable(doc, {
      startY: y + 1,

      margin: {
        left: margin,
        right: margin,
      },

      tableWidth: contentWidth,

      head: [["Part No.", "Description", "Qty", "Used / Recommended", "Remarks"]],

      body: partRows,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 7.5,
        cellPadding: 1.6,
        lineColor: "#B8C8D3",
        lineWidth: 0.25,
        textColor: PDF_TEXT,
        valign: "middle",
        minCellHeight: 6.5,
      },

      headStyles: {
        fillColor: [216, 231, 243],
        textColor: [31, 78, 121],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: 1.7,
      },

    columnStyles: {
        0: {
          cellWidth: 40,
        },

        1: {
          cellWidth: 47,
        },

        2: {
          cellWidth: 12,
        },

        3: {
          cellWidth: 46.5,
        },

        4: {
          cellWidth: 46.5,
        },
      },
    });

    y = doc.lastAutoTable.finalY + 4;

    // ============================================================
    // 9. FURTHER ACTION REQUIRED
    // ============================================================

    y = pdfSection(doc, "9. FURTHER ACTION REQUIRED", y, margin);

    y += 2;

    const furtherActions = [
      ["noFurtherAction", "No further action required"],

      ["partsRequired", "Parts required"],

      ["followUpVisit", "Follow-up visit required"],

      ["customerAction", "Customer action required"],

      [
        "technicalSupportChina",
        "Technical / spare support required from Haitian China",
      ],
    ];

    // ============================================================
    // SECTION 9 OPTIONS
    // 2 ROWS
    // ROW 1 = 3 OPTIONS
    // ROW 2 = 2 OPTIONS
    // ============================================================

    const furtherActionPositions = [
      // ROW 1
      {
        x: margin,
        row: 0,
      },
      {
        x: margin + 65,
        row: 0,
      },
      {
        x: margin + 130,
        row: 0,
      },

      // ROW 2
      {
        x: margin,
        row: 1,
      },
      {
        x: margin + 65,
        row: 1,
      },
    ];

    furtherActions.forEach(([key, label], index) => {
      const position = furtherActionPositions[index];

      pdfCheckbox(
        doc,
        position.x,
        y + position.row * 7,
        pdfSelected(values.furtherAction, key),
        label,
        9,
      );
    });

    y += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PDF_BLUE);

    doc.text("Required Action / Follow-up", margin, y + 2);

    pdfTextArea(
      doc,
      values.requiredActionFollowUp,
      margin,
      y + 4,
      contentWidth,
      12,
    );

    y += 19;

    // ============================================================
    // 10. SERVICE COMMERCIAL CLASSIFICATION
    // ============================================================

    y = pdfSection(doc, "10. SERVICE COMMERCIAL CLASSIFICATION", y, margin);

    y += 2;

    const commercial = [
      ["focCommissioning", "F.O.C. Commissioning"],

      ["focMaintenance", "F.O.C. Maintenance"],

      ["warrantyService", "Warranty Service"],

      ["chargeableMaintenance", "Chargeable Maintenance"],

      ["customerVisitService", "Customer Visit (Service)"],

      ["serviceContract", "Service Contract"],

      ["goodwill", "Goodwill"],

      ["chargeableCommissioning", "Chargeable commissioning"],
    ];

    commercial.forEach(([key, label], index) => {
      const row = Math.floor(index / 4);

      const x = margin + (index % 4) * 45;

      pdfCheckbox(
        doc,
        x,
        y + row * 7.5,
        pdfSelected(values.serviceCommercialClassification, key),
        label,
        9,
      );
    });

    y += 17;

    // ============================================================
    // 11. CUSTOMER ACKNOWLEDGEMENT
    // ============================================================

    y = pdfSection(doc, "11. CUSTOMER ACKNOWLEDGEMENT", y, margin);

    doc.setFillColor("#F1F6FA");

    doc.rect(margin, y + 1, contentWidth, 8, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(PDF_TEXT);

    const acknowledgement =
      "I acknowledge that the above service work has been carried out and the machine status / further action has been explained to us.";

    const ackLines = doc.splitTextToSize(acknowledgement, contentWidth - 6);

    doc.text(ackLines.slice(0, 2), margin + 1.5, y + 6.2);

    y += 15;

    // ============================================================
    // SIGNATURES
    // ============================================================

    const sigGap = 6;

    const sigWidth = (contentWidth - sigGap * 2) / 3;

    // ------------------------------------------------------------
    // TECHNICIAN
    // ------------------------------------------------------------

    pdfSignature(
      doc,
      margin,
      y,
      sigWidth,
      "Service Technician",
      values.technicianName,
      values.technicianDate,
      signatureTechnician,
    );

    // ------------------------------------------------------------
    // MANAGER
    // ------------------------------------------------------------

    pdfSignature(
      doc,
      margin + sigWidth + sigGap,
      y,
      sigWidth,
      "Service Manager",
      values.managerName,
      values.managerDate,
      signatureManager,
    );

    // ------------------------------------------------------------
    // CUSTOMER
    // ------------------------------------------------------------

    pdfSignature(
      doc,
      margin + (sigWidth + sigGap) * 2,
      y,
      sigWidth,
      "Customer",
      values.customerName,
      values.customerDate,
      signatureCustomer,
    );

    // ============================================================
    // SAVE PDF
    // ============================================================

    const filenameCustomer =
      pdfSafe(values.customer)
        .trim()
        .replace(/[^\w\s-]+/g, "")
        .replace(/\s+/g, " ") || "Customer";

    const filenameSRN =
      pdfSafe(reportNumber)
        .trim()
        .replace(/[^\w-]+/g, "_") || "SRN";

    const fileName = `HT Service Report ${filenameCustomer} ${filenameSRN}.pdf`;

    // Return the PDF as a data URI so it can be uploaded to
    // Google Apps Script and saved in the configured Google Drive folder.
    // The actual browser download is still performed after the Drive
    // upload succeeds, preserving the existing download behavior.
    // ============================================================
    // ADD PREVIOUS PROJECT FOOTER TO EVERY PDF PAGE
    // ============================================================

    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      pdfFooter(doc, page, totalPages);
    }

    const pdfBase64 = doc.output("datauristring");

    return {
      fileName,
      pdfBase64,
      doc,
      reportNumber: String(reportNumber || "").trim(),
    };
  };

  const ViewSectionTitle = ({ title }) => (
    <div
      style={{
        background: "#0D3884",
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: "15px",
        padding: "9px 14px",
        borderRadius: "5px",
        margin: "22px 0 14px",
        letterSpacing: "0.2px",
      }}
    >
      {title}
    </div>
  );

  const ViewField = ({
    label,
    name,
    span = "col-md-6",
    viewForm,
    textarea = false,
  }) => (
    <div className={span}>
      <Form.Item
        label={
          <span
            style={{
              fontWeight: 600,
              color: "#0D3884",
            }}
          >
            {label}
          </span>
        }
        name={name}
      >
        {textarea ? (
          <Input.TextArea
            readOnly
            autoSize={{
              minRows: 2,
              maxRows: 4,
            }}
            style={{
              background: "#FAFAFA",
              color: "#222",
              borderColor: "#D9E2EA",
            }}
          />
        ) : (
          <Input
            readOnly
            size="large"
            style={{
              background: "#FAFAFA",
              color: "#222",
              borderColor: "#D9E2EA",
            }}
          />
        )}
      </Form.Item>
    </div>
  );

  const ViewLargeText = ({ name, viewForm }) => (
    <Form.Item name={name}>
      <Input.TextArea
        readOnly
        autoSize={{
          minRows: 4,
          maxRows: 8,
        }}
        style={{
          background: "#FAFAFA",
          color: "#222",
          borderColor: "#D9E2EA",
          lineHeight: 1.6,
        }}
      />
    </Form.Item>
  );

  const ViewSignatureCard = ({ title, name, date, signature }) => (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <div
        style={{
          border: "1px solid #B8C8D3",
          borderRadius: "7px",
          overflow: "hidden",
          height: "100%",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            background: "#F1F6FA",
            color: "#0D3884",
            fontWeight: 700,
            padding: "9px 12px",
            borderBottom: "1px solid #B8C8D3",
            textAlign: "center",
          }}
        >
          {title}
        </div>

        <div style={{ padding: "12px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "3px",
            }}
          >
            Name
          </div>

          <div
            style={{
              borderBottom: "1px solid #D9E2EA",
              paddingBottom: "6px",
              marginBottom: "12px",
              minHeight: "28px",
            }}
          >
            {name || "-"}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "3px",
            }}
          >
            Date
          </div>

          <div
            style={{
              borderBottom: "1px solid #D9E2EA",
              paddingBottom: "6px",
              marginBottom: "12px",
              minHeight: "28px",
            }}
          >
            {date || "-"}
          </div>

          {/* <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "5px",
            }}
          >
            Signature / Stamp
          </div>

          <div
            style={{
              height: "130px",
              border: "1px solid #D9E2EA",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFFFFF",
            }}
          >
            {signature ? (
              <img
                src={signature}
                alt={`${title} signature`}
                style={{
                  maxWidth: "95%",
                  maxHeight: "120px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span
                style={{
                  color: "#999",
                  fontSize: "13px",
                }}
              >
                No signature available
              </span>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // SERVICE FORM
  // ============================================================

  export default function ServiceForm({ onLogout, user }) {
    const [form] = Form.useForm();
    const [viewForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const { TextArea } = Input;
    const [canvasSize, setCanvasSize] = useState({
      width: 0,
      height: 0,
    });

    const [signatureTechnician, setSignatureTechnician] = useState("");
    const [signatureManager, setSignatureManager] = useState("");
    const [signatureCustomer, setSignatureCustomer] = useState("");
    const [loading, setLoading] = useState(false);
    const [serviceReportNumber, setServiceReportNumber] = useState("");
    const [srnLoading, setSrnLoading] = useState(true);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [customerDataList, setCustomerDataList] = useState([]);
    const [address, setAddress] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [selectedTechnicians, setSelectedTechnicians] = useState([]);

    // ============================================================
    // NEW SERVICE REPORT - PARTS TABLE STATE
    // Keep the Parts table values in explicit React state.
    // This prevents Ant Design Table/Form rendering from losing or
    // shifting the entered Part No., Description, Used/Recommended,
    // and Remarks values before the PDF is generated.
    // ============================================================
    const [partsFormData, setPartsFormData] = useState([
      {
        key: 0,
        partNo: "",
        description: "",
        qty: "",
        usedRecommended: "",
        remarks: "",
      },
      {
        key: 1,
        partNo: "",
        description: "",
        qty: "",
        usedRecommended: "",
        remarks: "",
      },
      {
        key: 2,
        partNo: "",
        description: "",
        qty: "",
        usedRecommended: "",
        remarks: "",
      },
    ]);

    const updatePartsFormData = (rowIndex, field, value) => {
      let limitedValue = value;

      if (field === "partNo") {
        limitedValue = value.slice(0, 25);
      } else if (
        field === "description"
      ) {
        limitedValue = value.slice(0, 25);
      } else if (field === "usedRecommended" || field === "remarks") {
        limitedValue = value.slice(0, 25);
      }

      setPartsFormData((previous) =>
        previous.map((row, index) =>
          index === rowIndex
            ? {
                ...row,
                [field]: limitedValue,
              }
            : row,
        ),
      );
    };

    const [isTechnicianSignSaved, setIsTechnicianSignSaved] = useState(false);
    const [isManagerSignSaved, setIsManagerSignSaved] = useState(false);
    const [isCustomerSignSaved, setIsCustomerSignSaved] = useState(false);

    const [reportData, setReportData] = useState([]);
    const [reportTableLoading, setReportTableLoading] = useState(false);

    // ============================================================
    // SERVICE REPORT TABLE UI STATE
    // ============================================================
    const [reportTableSearch, setReportTableSearch] = useState("");
    const [reportTablePageSize, setReportTablePageSize] = useState(10);
    const [viewReport, setViewReport] = useState(null);
    const [editReport, setEditReport] = useState(null);
    const [viewPartsData, setViewPartsData] = useState([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [pdfDownloadLoading, setPdfDownloadLoading] = useState(false);
    const [editPartsData, setEditPartsData] = useState([]);
    const [editSaveLoading, setEditSaveLoading] = useState(false);
    const [editSignatureTechnician, setEditSignatureTechnician] = useState("");
    const [editSignatureManager, setEditSignatureManager] = useState("");
    const [editSignatureCustomer, setEditSignatureCustomer] = useState("");
    const [isEditTechnicianSignSaved, setIsEditTechnicianSignSaved] =
      useState(false);
    const [isEditManagerSignSaved, setIsEditManagerSignSaved] = useState(false);
    const [isEditCustomerSignSaved, setIsEditCustomerSignSaved] = useState(false);

    const sigTechnician = useRef();
    const sigManager = useRef();
    const sigCustomer = useRef();
    const editSigTechnician = useRef();
    const editSigManager = useRef();
    const editSigCustomer = useRef();

    const updateCanvasSize = () => {
      setCanvasSize({ width: window.innerWidth < 768 ? 300 : 400, height: 200 });
    };

    const fetchServiceReports = async () => {
      setReportTableLoading(true);

      try {
        const response = await fetch(
          `${GAS_URL}?action=getServiceReports&_=${Date.now()}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch service reports");
        }

        setReportData(Array.isArray(result.reports) ? result.reports : []);
      } catch (error) {
        console.error("Failed to fetch service reports:", error);

        notification.error({
          message: "Error",
          description: error.message || "Failed to load service reports.",
          placement: "bottomRight",
        });

        setReportData([]);
      } finally {
        setReportTableLoading(false);
      }
    };

    useEffect(() => {
      fetchServiceReports();
    }, []);

    const downloadServiceReportPDFByNumber = async (
      reportNumber,
      fileName = "",
    ) => {
      const normalizedReportNumber = String(reportNumber || "").trim();

      if (!normalizedReportNumber) {
        throw new Error("Service Report Number is missing.");
      }

      const formData = new URLSearchParams();
      formData.append("action", "downloadPdf");
      formData.append("serviceReportNumber", normalizedReportNumber);

      // If the caller already knows the exact PDF filename, send it.
      // This is used by the edit flow and prevents filename mismatches.
      const normalizedFileName = String(fileName || "").trim();

      if (normalizedFileName) {
        formData.append("fileName", normalizedFileName);
      }

      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`PDF server returned ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.pdfBase64) {
        throw new Error(
          result.message ||
            `PDF not found for Service Report ${normalizedReportNumber}`,
        );
      }

      const binaryString = window.atob(result.pdfBase64);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: result.mimeType || "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download =
        result.fileName || `Haitian_Service_Report_${normalizedReportNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Give the browser a moment to start the download before releasing
      // the object URL. This is more reliable on Chrome/Edge.
      window.setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);

      return result;
    };

    const downloadServiceReportPDF = async () => {
      const reportNumber = String(
        viewReport?.["Service Report Number"] || "",
      ).trim();

      if (!reportNumber) {
        notification.error({
          message: "Download Failed",
          description: "Service Report Number is missing.",
          placement: "bottomRight",
        });
        return;
      }

      setPdfDownloadLoading(true);

      try {
        await downloadServiceReportPDFByNumber(reportNumber);

        notification.success({
          message: "PDF Downloaded",
          description: `Service Report ${reportNumber} PDF downloaded successfully.`,
          placement: "bottomRight",
        });
      } catch (error) {
        console.error("Service report PDF download error:", error);

        notification.error({
          message: "PDF Download Failed",
          description:
            error?.message ||
            `Unable to download PDF for Service Report ${reportNumber}.`,
          placement: "bottomRight",
        });
      } finally {
        setPdfDownloadLoading(false);
      }
    };

    useEffect(() => {
      if (!viewReport || !viewModalOpen) {
        return;
      }

      // ============================================================
      // HELPER
      // Converts JSON-string values from Google Sheet
      // back into arrays for Ant Design Checkbox.Group
      // ============================================================

      const parseArray = (value) => {
        if (Array.isArray(value)) {
          return value;
        }

        if (!value) {
          return [];
        }

        try {
          const parsed = JSON.parse(value);

          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          console.warn("Unable to parse checkbox value:", value);

          return [];
        }
      };

      // ============================================================
      // PARSE SAVED JSON VALUES
      // ============================================================

      const serviceCategory = parseArray(viewReport["serviceCategory"]);

      const machineTrialStatus =
        parseArray(viewReport["machineTrialStatus"]).length > 0
          ? parseArray(viewReport["machineTrialStatus"])
          : [
              viewReport["Machine tested successfully"] === "Yes"
                ? "machineTestedSuccessfully"
                : null,

              viewReport["Machine running normally"] === "Yes"
                ? "machineRunningNormally"
                : null,

              viewReport["Running with observation"] === "Yes"
                ? "runningWithObservation"
                : null,

              viewReport["Machine stopped - further action required"] === "Yes"
                ? "machineStopped"
                : null,

              viewReport["Customer advised / awaiting action"] === "Yes"
                ? "customerAdvised"
                : null,
            ].filter(Boolean);

      const furtherAction =
        parseArray(viewReport["furtherAction"]).length > 0
          ? parseArray(viewReport["furtherAction"])
          : [
              viewReport["No further action required"] === "Yes"
                ? "noFurtherAction"
                : null,

              viewReport["Parts required"] === "Yes" ? "partsRequired" : null,

              viewReport["Follow-up visit required"] === "Yes"
                ? "followUpVisit"
                : null,

              viewReport["Customer action required"] === "Yes"
                ? "customerAction"
                : null,

              (viewReport["Technical support required from Haitian China"] ||
                viewReport[
                  "Technical / spare support required from Haitian China"
                ] ||
                "") === "Yes"
                ? "technicalSupportChina"
                : null,
            ].filter(Boolean);

      const serviceCommercialClassification =
        parseArray(viewReport["serviceCommercialClassification"]).length > 0
          ? parseArray(viewReport["serviceCommercialClassification"])
          : [
              viewReport["F.O.C. Commissioning"] === "Yes"
                ? "focCommissioning"
                : null,

              viewReport["F.O.C. Maintenance"] === "Yes"
                ? "focMaintenance"
                : null,

              viewReport["Warranty Service"] === "Yes" ? "warrantyService" : null,

              viewReport["Chargeable Maintenance"] === "Yes"
                ? "chargeableMaintenance"
                : null,

              viewReport["Customer Visit (Service)"] === "Yes"
                ? "customerVisitService"
                : null,

              viewReport["Service Contract"] === "Yes" ? "serviceContract" : null,

              viewReport["Goodwill"] === "Yes" ? "goodwill" : null,
            ].filter(Boolean);

      // ============================================================
      // PARTS
      // ============================================================

      let parts = [];

      if (Array.isArray(viewReport.parts)) {
        parts = viewReport.parts.map((part, index) => ({
          key: index,

          "Part No.": part["Part No."] || part.partNo || "",

          Description: part["Description"] || part.description || "",

          Qty: part["Qty"] || part.qty || "",

          "Used / Recommended":
            part["Used / Recommended"] || part.usedRecommended || "",

          Remarks: part["Remarks"] || part.remarks || "",
        }));
      } else {
        // Fallback in case backend returns only one row
        if (
          viewReport["Part No."] ||
          viewReport["Description"] ||
          viewReport["Qty"] ||
          viewReport["Used / Recommended"] ||
          viewReport["Remarks"]
        ) {
          parts = [
            {
              key: 0,

              "Part No.": viewReport["Part No."] || "",

              Description: viewReport["Description"] || "",

              Qty: viewReport["Qty"] || "",

              "Used / Recommended": viewReport["Used / Recommended"] || "",

              Remarks: viewReport["Remarks"] || "",
            },
          ];
        }
      }

      // ============================================================
      // SET PARTS
      // ============================================================

      setViewPartsData(parts);

      // ============================================================
      // SET ALL FORM VALUES
      // ============================================================

      viewForm.setFieldsValue({
        // ==========================================================
        // 1. CUSTOMER & VISIT INFORMATION
        // ==========================================================

        serviceReportNumber: viewReport["Service Report Number"] || "",

        customer: viewReport["Customer"] || "",

        serviceDate: viewReport["Service Date"] || "",

        siteLocation: viewReport["Site / Location"] || "",

        contactPerson: viewReport["Contact Person"] || "",

        contactNo: viewReport["Contact No."] || "",

        technician: viewReport["Technician"] || "",

        arrivalTime: viewReport["Arrival Time"] || "",

        completionTime: viewReport["Completion Time"] || "",

        totalWorkingHours: viewReport["Total Working Hours"] || "",

        serviceVisitRef: viewReport["Service Visit Ref."] || "",

        // ==========================================================
        // 2. MACHINE INFORMATION
        // ==========================================================

        machineModel: viewReport["Machine Model"] || "",

        serialNo: viewReport["Serial No."] || "",

        installationYear:
          viewReport["Installation year"] ||
          viewReport["Installation Date"] ||
          "",

        machineRunningHours: viewReport["Machine Running Hours"] || "",

        controllerSoftwareVersion:
          viewReport["Controller"] ||
          viewReport["Controller / Software version"] ||
          viewReport["Controller / Software Version"] ||
          "",

        warrantyStatus: viewReport["Warranty Status"] || "",

        // ==========================================================
        // 3. SERVICE CATEGORY
        // ==========================================================

        serviceCategory:
          // Current format
          serviceCategory.length > 0
            ? serviceCategory
            : // Fallback for old Yes/No column format
              [
                viewReport["Installation / Commissioning"] === "Yes"
                  ? "installation"
                  : null,

                viewReport["Breakdown / Defect"] === "Yes" ? "breakdown" : null,

                viewReport["Preventive Maintenance"] === "Yes"
                  ? "preventive"
                  : null,

                viewReport["Corrective Maintenance"] === "Yes"
                  ? "corrective"
                  : null,

                viewReport["Inspection"] === "Yes" ? "inspection" : null,

                viewReport["Customer Visit"] === "Yes" ? "customerVisit" : null,

                viewReport["Software / Program"] === "Yes" ? "software" : null,

                viewReport["Other"] === "Yes" ? "other" : null,
              ].filter(Boolean),

        // ==========================================================
        // 4. CUSTOMER COMPLAINT
        // ==========================================================

        customerComplaint:
          viewReport["Customer Complaint"] ||
          viewReport["Customer complaint / reported problem"] ||
          viewReport["Customer Complaint / Reported Problem"] ||
          "",

        // ==========================================================
        // 5. TECHNICIAN DIAGNOSIS
        // ==========================================================

        diagnosis:
          viewReport["Technician Diagnosis"] ||
          viewReport["Technician diagnosis/root cause"] ||
          viewReport["Technician Diagnosis / Root Cause"] ||
          "",

        // ==========================================================
        // 6. WORK PERFORMED
        // ==========================================================

        workPerformed:
          viewReport["Work Performed"] ||
          viewReport["Work performed / corrective action"] ||
          viewReport["Work Performed / Corrective Action"] ||
          "",

        // ==========================================================
        // 7. MACHINE TRIAL & FINAL STATUS
        // ==========================================================

        machineTrialStatus: machineTrialStatus,
        trialDuration: viewReport["Trial Duration"] || "",

        cycleTime: viewReport["Cycle Time"] || "",

        productMaterial: viewReport["Product / Material"] || "",

        trialStatusRemarks: viewReport["Trial / Status Remarks"] || "",

        // ==========================================================
        // 9. FURTHER ACTION REQUIRED
        // ==========================================================

        furtherAction: furtherAction,

        requiredActionFollowUp:
          viewReport["Required Action / Follow-up"] ||
          viewReport["Required Action / Follow-Up"] ||
          "",

        // ==========================================================
        // 10. COMMERCIAL CLASSIFICATION
        // ==========================================================

        serviceCommercialClassification: serviceCommercialClassification,

        // ==========================================================
        // 11. CUSTOMER ACKNOWLEDGEMENT
        // ==========================================================

        technicianName:
          viewReport["Technician Name"] ||
          viewReport["Service Technician Name"] ||
          "",

        technicianDate:
          viewReport["Technician Date"] ||
          viewReport["Service Technician Date"] ||
          "",

        managerName:
          viewReport["Manager Name"] || viewReport["Service Manager Name"] || "",

        managerDate:
          viewReport["Manager Date"] || viewReport["Service Manager Date"] || "",

        customerName: viewReport["Customer Name"] || "",

        customerDate: viewReport["Customer Date"] || "",
      });

      // ============================================================
      // SIGNATURES
      // ============================================================

      setTimeout(() => {
        // setViewSignatureData({
        //   technician:
        //     viewReport["Technician Signature"] ||
        //     viewReport["signatureTechnician"] ||
        //     "",
        //   manager:
        //     viewReport["Manager Signature"] ||
        //     viewReport["signatureManager"] ||
        //     "",
        //   customer:
        //     viewReport["Customer Signature"] ||
        //     viewReport["signatureCustomer"] ||
        //     "",
        // });
      }, 0);
    }, [viewReport, viewModalOpen, viewForm]);

    // ============================================================
    // EDIT MODAL HELPERS
    // ============================================================

    const parseEditArray = (value) => {
      if (Array.isArray(value)) return value;
      if (!value) return [];
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    useEffect(() => {
      if (!editReport || !editModalOpen) return;

      const serviceCategory = parseEditArray(editReport["serviceCategory"]).length
        ? parseEditArray(editReport["serviceCategory"])
        : [
            editReport["Installation / Commissioning"] === "Yes"
              ? "installation"
              : null,
            editReport["Breakdown / Defect"] === "Yes" ? "breakdown" : null,
            editReport["Preventive Maintenance"] === "Yes" ? "preventive" : null,
            editReport["Corrective Maintenance"] === "Yes" ? "corrective" : null,
            editReport["Inspection"] === "Yes" ? "inspection" : null,
            editReport["Customer Visit"] === "Yes" ? "customerVisit" : null,
            editReport["Software / Program"] === "Yes" ? "software" : null,
            editReport["Other"] === "Yes" ? "other" : null,
          ].filter(Boolean);

      const machineTrialStatus = parseEditArray(editReport["machineTrialStatus"])
        .length
        ? parseEditArray(editReport["machineTrialStatus"])
        : [
            editReport["Machine tested successfully"] === "Yes"
              ? "machineTestedSuccessfully"
              : null,
            editReport["Machine running normally"] === "Yes"
              ? "machineRunningNormally"
              : null,
            editReport["Running with observation"] === "Yes"
              ? "runningWithObservation"
              : null,
            editReport["Machine stopped - further action required"] === "Yes"
              ? "machineStopped"
              : null,
            editReport["Customer advised / awaiting action"] === "Yes"
              ? "customerAdvised"
              : null,
          ].filter(Boolean);

      const furtherAction = parseEditArray(editReport["furtherAction"]).length
        ? parseEditArray(editReport["furtherAction"])
        : [
            editReport["No further action required"] === "Yes"
              ? "noFurtherAction"
              : null,
            editReport["Parts required"] === "Yes" ? "partsRequired" : null,
            editReport["Follow-up visit required"] === "Yes"
              ? "followUpVisit"
              : null,
            editReport["Customer action required"] === "Yes"
              ? "customerAction"
              : null,
            (editReport["Technical support required from Haitian China"] ||
              editReport[
                "Technical / spare support required from Haitian China"
              ] ||
              "") === "Yes"
              ? "technicalSupportChina"
              : null,
          ].filter(Boolean);

      const commercial = parseEditArray(
        editReport["serviceCommercialClassification"],
      ).length
        ? parseEditArray(editReport["serviceCommercialClassification"])
        : [
            editReport["F.O.C. Commissioning"] === "Yes"
              ? "focCommissioning"
              : null,
            editReport["F.O.C. Maintenance"] === "Yes" ? "focMaintenance" : null,
            editReport["Warranty Service"] === "Yes" ? "warrantyService" : null,
            editReport["Chargeable Maintenance"] === "Yes"
              ? "chargeableMaintenance"
              : null,
            editReport["Customer Visit (Service)"] === "Yes"
              ? "customerVisitService"
              : null,
            editReport["Service Contract"] === "Yes" ? "serviceContract" : null,
            editReport["Goodwill"] === "Yes" ? "goodwill" : null,
            editReport["Chargeable commissioning"] === "Yes"
              ? "chargeableCommissioning"
              : null,
          ].filter(Boolean);

      const technicians = String(editReport["Technician"] || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      const existingParts =
        Array.isArray(editReport.parts) && editReport.parts.length
          ? editReport.parts.map((part, index) => ({
              key: index,
              partNo: part.partNo ?? part["Part No."] ?? "",
              description: part.description ?? part["Description"] ?? "",
              qty: part.qty ?? part["Qty"] ?? "",
              usedRecommended:
                part.usedRecommended ?? part["Used / Recommended"] ?? "",
              remarks: part.remarks ?? part["Remarks"] ?? "",
            }))
          : [
              {
                key: 0,
                partNo: editReport["Part No."] || "",
                description: editReport["Description"] || "",
                qty: editReport["Qty"] || "",
                usedRecommended: editReport["Used / Recommended"] || "",
                remarks: editReport["Remarks"] || "",
              },
            ];

      // Always show at least 3 rows.
      // Existing rows are preserved; empty rows are added only when needed.
      const parts = [...existingParts];

      while (parts.length < 3) {
        parts.push({
          key: parts.length,
          partNo: "",
          description: "",
          qty: "",
          usedRecommended: "",
          remarks: "",
        });
      }

      setEditPartsData(parts);
      editForm.setFieldsValue({
        serviceReportNumber: editReport["Service Report Number"] || "",
        customer: editReport["Customer"] || "",
        serviceDate: editReport["Service Date"] || "",
        siteLocation: editReport["Site / Location"] || "",
        contactPerson: editReport["Contact Person"] || "",
        contactNo: editReport["Contact No."] || "",
        technician: technicians,
        arrivalTime: editReport["Arrival Time"] || "",
        completionTime: editReport["Completion Time"] || "",
        totalWorkingHours: editReport["Total Working Hours"] || "",
        serviceVisitRef: editReport["Service Visit Ref."] || "",
        machineModel: editReport["Machine Model"] || "",
        serialNo: editReport["Serial No."] || "",
        installationYear:
          editReport["Installation year"] ||
          editReport["Installation Date"] ||
          "",
        machineRunningHours: editReport["Machine Running Hours"] || "",
        softwareVersion:
          editReport["Controller"] ||
          editReport["Controller / Software version"] ||
          editReport["Controller / Software Version"] ||
          "",
        warrantyStatus: editReport["Warranty Status"] || "",
        serviceCategory,
        customerComplaint:
          editReport["Customer complaint / reported problem"] || "",
        technicianDiagnosis:
          editReport["Technician diagnosis/root cause"] ||
          editReport["Technician Diagnosis / Root Cause"] ||
          "",
        workPerformed:
          editReport["Work performed / corrective action"] ||
          editReport["Work Performed / Corrective Action"] ||
          "",
        machineTrialStatus,
        trialDuration: editReport["Trial Duration"] || "",
        cycleTime: editReport["Cycle Time"] || "",
        productMaterial: editReport["Product / Material"] || "",
        trialStatusRemarks: editReport["Trial / Status Remarks"] || "",
        furtherAction,
        requiredActionFollowUp:
          editReport["Required Action / Follow-up"] ||
          editReport["Required Action / Follow-Up"] ||
          "",
        serviceCommercialClassification: commercial,
        technicianName:
          editReport["Service Technician Name"] ||
          editReport["Technician Name"] ||
          "",
        technicianDate:
          editReport["Service Technician Date"] ||
          editReport["Technician Date"] ||
          "",
        managerName:
          editReport["Service Manager Name"] || editReport["Manager Name"] || "",
        managerDate:
          editReport["Service Manager Date"] || editReport["Manager Date"] || "",
        customerName: editReport["Customer Name"] || "",
        customerDate: editReport["Customer Date"] || "",
      });

      // Every edit must be re-signed. Existing signature data is not
      // exposed by the current backend, so the user must draw all 3.
      setEditSignatureTechnician("");
      setEditSignatureManager("");
      setEditSignatureCustomer("");
      setIsEditTechnicianSignSaved(false);
      setIsEditManagerSignSaved(false);
      setIsEditCustomerSignSaved(false);

      setTimeout(() => {
        [editSigTechnician, editSigManager, editSigCustomer].forEach((ref) => {
          if (ref.current) ref.current.clear();
        });
      }, 50);
    }, [editReport, editModalOpen]);

    // ============================================================
    // EDIT FORM - PARTS INPUT LIMITS
    // Same limits as the New Service Report form
    // Part No. = 22, Description = 25, Used / Recommended = 25, Remarks = 25
    // ============================================================
    const updateEditPart = (key, field, value) => {
      let limitedValue = typeof value === "string" ? value : "";

      if (field === "partNo") {
        limitedValue = limitedValue.slice(0, 22);
      } else if (field === "description") {
        limitedValue = limitedValue.slice(0, 25);
      } else if (field === "usedRecommended" || field === "remarks") {
        limitedValue = limitedValue.slice(0, 25);
      }

      setEditPartsData((current) =>
        current.map((part) =>
          part.key === key
            ? { ...part, [field]: limitedValue }
            : part,
        ),
      );
    };

    const addEditPart = () => {
      setEditPartsData((current) => [
        ...current,
        {
          key: Date.now(),
          partNo: "",
          description: "",
          qty: "",
          usedRecommended: "",
          remarks: "",
        },
      ]);
    };

    const removeEditPart = (key) => {
      setEditPartsData((current) => {
        const next = current.filter((part) => part.key !== key);
        return next.length
          ? next
          : [
              {
                key: Date.now(),
                partNo: "",
                description: "",
                qty: "",
                usedRecommended: "",
                remarks: "",
              },
            ];
      });
    };

    const closeEditModal = (force = false) => {
      if (editSaveLoading && !force) return;
      setEditModalOpen(false);
      setEditReport(null);
      setEditPartsData([]);
      editForm.resetFields();
      setEditSignatureTechnician("");
      setEditSignatureManager("");
      setEditSignatureCustomer("");
      setIsEditTechnicianSignSaved(false);
      setIsEditManagerSignSaved(false);
      setIsEditCustomerSignSaved(false);
      [editSigTechnician, editSigManager, editSigCustomer].forEach((ref) => {
        if (ref.current) ref.current.clear();
      });
    };

    const saveEditSignature = (type) => {
      const config = {
        technician: {
          ref: editSigTechnician,
          setSignature: setEditSignatureTechnician,
          setSaved: setIsEditTechnicianSignSaved,
          label: "Technician",
        },
        manager: {
          ref: editSigManager,
          setSignature: setEditSignatureManager,
          setSaved: setIsEditManagerSignSaved,
          label: "Manager",
        },
        customer: {
          ref: editSigCustomer,
          setSignature: setEditSignatureCustomer,
          setSaved: setIsEditCustomerSignSaved,
          label: "Customer",
        },
      }[type];

      if (config?.ref.current && !config.ref.current.isEmpty()) {
        config.setSignature(
          config.ref.current.getCanvas().toDataURL("image/png"),
        );
        config.setSaved(true);
        notification.success({
          message: "Signature Saved",
          description: `${config.label} signature saved successfully.`,
          placement: "bottomRight",
        });
      } else {
        notification.error({
          message: `${config?.label || "Signature"} Signature Required`,
          description: `Please draw the ${String(type).toLowerCase()} signature before saving.`,
          placement: "bottomRight",
        });
      }
    };

    const clearEditSignature = (type) => {
      const config = {
        technician: {
          ref: editSigTechnician,
          setSignature: setEditSignatureTechnician,
          setSaved: setIsEditTechnicianSignSaved,
        },
        manager: {
          ref: editSigManager,
          setSignature: setEditSignatureManager,
          setSaved: setIsEditManagerSignSaved,
        },
        customer: {
          ref: editSigCustomer,
          setSignature: setEditSignatureCustomer,
          setSaved: setIsEditCustomerSignSaved,
        },
      }[type];

      if (config?.ref.current) config.ref.current.clear();
      config?.setSignature("");
      config?.setSaved(false);
    };

    const uploadEditedServiceReportPDF = async (pdfResult) => {
      const formData = new URLSearchParams();
      formData.append("action", "uploadPdf");
      formData.append("fileName", pdfResult.fileName);
      formData.append("pdfBase64", pdfResult.pdfBase64);
      formData.append("replaceExisting", "true");

      // Send the SRN so Apps Script can replace any previous PDF
      // belonging to this same service report, even if the customer
      // name changed during the edit.
      formData.append(
        "serviceReportNumber",
        String(pdfResult.reportNumber || ""),
      );

      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`PDF upload server returned ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to upload updated PDF");
      }

      return result;
    };

    const handleEditSave = async () => {
      if (editSaveLoading) return;

      try {
        const values = await editForm.validateFields();

        const signaturesReady =
          isEditTechnicianSignSaved &&
          Boolean(editSignatureTechnician) &&
          editSigTechnician.current &&
          !editSigTechnician.current.isEmpty() &&
          isEditManagerSignSaved &&
          Boolean(editSignatureManager) &&
          editSigManager.current &&
          !editSigManager.current.isEmpty() &&
          isEditCustomerSignSaved &&
          Boolean(editSignatureCustomer) &&
          editSigCustomer.current &&
          !editSigCustomer.current.isEmpty();

        if (!signaturesReady) {
          notification.error({
            message: "All Signatures Required",
            description:
              "Please draw and save the Technician, Manager, and Customer signatures before submitting the edit.",
            placement: "bottomRight",
          });
          return;
        }

        if (!navigator.onLine) {
          notification.error({
            message: "No Internet Connection",
            description: "Please check your internet and try again.",
            placement: "bottomRight",
          });
          return;
        }

        const reportNumber =
          values.serviceReportNumber ||
          editReport?.["Service Report Number"] ||
          "";

        if (!reportNumber) {
          throw new Error("Service Report Number is missing.");
        }

        setEditSaveLoading(true);

        // IMPORTANT:
        // Do NOT filter out empty rows.
        // The backend must receive all 3 default rows so they remain
        // stored even when the user clears every input.
        const parts = editPartsData.map((part) => ({
          partNo: String(part?.partNo ?? "").trim(),
          description: String(part?.description ?? "").trim(),
          qty: String(part?.qty ?? "").trim(),
          usedRecommended: String(part?.usedRecommended ?? "").trim(),
          remarks: String(part?.remarks ?? "").trim(),
        }));

        // Safety: always send at least 3 rows.
        while (parts.length < 3) {
          parts.push({
            partNo: "",
            description: "",
            qty: "",
            usedRecommended: "",
            remarks: "",
          });
        }

        const payload = {
          action: "updateReport",
          serviceReportNumber: String(reportNumber),
          customer: values.customer || "",
          serviceDate: values.serviceDate || "",
          siteLocation: values.siteLocation || "",
          contactPerson: values.contactPerson || "",
          contactNo: values.contactNo || "",
          technician: Array.isArray(values.technician)
            ? values.technician.join(", ")
            : values.technician || "",
          arrivalTime: values.arrivalTime || "",
          completionTime: values.completionTime || "",
          totalWorkingHours: values.totalWorkingHours ?? "",
          serviceVisitRef: values.serviceVisitRef || "",
          machineModel: values.machineModel || "",
          serialNo: values.serialNo || "",
          installationYear: values.installationYear || "",
          machineRunningHours: values.machineRunningHours ?? "",
          softwareVersion: values.softwareVersion || "",
          warrantyStatus: values.warrantyStatus || "",
          serviceCategory: JSON.stringify(values.serviceCategory || []),
          customerComplaint: values.customerComplaint || "",
          technicianDiagnosis: values.technicianDiagnosis || "",
          workPerformed: values.workPerformed || "",
          machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),
          trialDuration: values.trialDuration || "",
          cycleTime: values.cycleTime || "",
          productMaterial: values.productMaterial || "",
          trialStatusRemarks: values.trialStatusRemarks || "",
          parts: JSON.stringify(parts),
          furtherAction: JSON.stringify(values.furtherAction || []),
          requiredActionFollowUp: values.requiredActionFollowUp || "",
          serviceCommercialClassification: JSON.stringify(
            values.serviceCommercialClassification || [],
          ),
          technicianName: values.technicianName || "",
          technicianDate: values.technicianDate || "",
          managerName: values.managerName || "",
          managerDate: values.managerDate || "",
          customerName: values.customerName || "",
          customerDate: values.customerDate || "",
          // Included for API compatibility; signatures are used for the PDF.
          signatureTechnician: editSignatureTechnician,
          signatureManager: editSignatureManager,
          signatureCustomer: editSignatureCustomer,
          userEmail: user?.email || "",
        };

        const formData = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(
            key,
            value === null || value === undefined ? "" : String(value),
          );
        });

        const response = await fetch(GAS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to update service report");
        }

        // Generate the new PDF only after the sheet update succeeds.
        const pdfValues = {
          ...values,
          parts,
        };

        const pdfResult = await generateEditServiceReportPDF(
          pdfValues,
          String(reportNumber),
          editSignatureTechnician,
          editSignatureManager,
          editSignatureCustomer,
        );

        await uploadEditedServiceReportPDF(pdfResult);

        // Download the exact PDF that was just uploaded.
        // Passing the filename avoids the old/new filename mismatch.
        await downloadServiceReportPDFByNumber(
          String(reportNumber),
          pdfResult.fileName,
        );

        notification.success({
          message: "Report Updated",
          description: `Service Report ${reportNumber} was updated and its PDF was regenerated successfully.`,
          placement: "bottomRight",
        });

        closeEditModal(true);
        await fetchServiceReports();
      } catch (error) {
        console.error("Edit service report error:", error);

        notification.error({
          message: "Update Failed",
          description: error?.message || "Unable to update the service report.",
          placement: "bottomRight",
        });
      } finally {
        setEditSaveLoading(false);
      }
    };

    // ============================================================
    // SERVICE REPORT TABLE HELPERS
    // ============================================================

    const getServiceReportNumber = (record) => {
      const raw = record?.["Service Report Number"];
      const numeric = Number(String(raw ?? "").replace(/[^0-9.-]/g, ""));
      return Number.isFinite(numeric) ? numeric : -Infinity;
    };

    const getReportSearchText = (record) =>
      Object.values(record || {})
        .map((value) => {
          if (Array.isArray(value)) return value.join(" ");
          if (value === null || value === undefined) return "";
          return String(value);
        })
        .join(" ")
        .toLowerCase();

    // ============================================================
    // REPORT TABLE FIELD HELPER
    // ============================================================
    // The backend/Google Sheet can contain these three fields under
    // different header names depending on the version of the report.
    // Always check every supported name before displaying "-".
    // ============================================================

    const getReportField = (record, fieldNames) => {
      if (!record || !Array.isArray(fieldNames)) return "";

      for (const fieldName of fieldNames) {
        const value = record?.[fieldName];

        if (value !== null && value !== undefined) {
          const text = String(value).trim();

          if (text !== "") {
            return text;
          }
        }
      }

      return "";
    };

    const getCustomerComplaint = (record) =>
      getReportField(record, [
        "Customer Complaint",
        "Customer complaint / reported problem",
        "Customer Complaint / Reported Problem",
        "customerComplaint",
      ]);

    const getTechnicianDiagnosis = (record) =>
      getReportField(record, [
        "Technician Diagnosis",
        "Technician diagnosis/root cause",
        "Technician Diagnosis / Root Cause",
        "technicianDiagnosis",
        "diagnosis",
      ]);

    const getWorkPerformed = (record) =>
      getReportField(record, [
        "Work Performed",
        "Work performed / corrective action",
        "Work Performed / Corrective Action",
        "workPerformed",
      ]);

  

    const loggedInUserEmail = String(user?.email || "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim()
      .toLowerCase();

    // Admin access is determined by the authenticated backend role
    // OR the exact admin email. This keeps the table working even
    // if an older login response does not yet return access: "admin".
    const isServiceReportAdmin =
      String(user?.access || "").trim().toLowerCase() === "admin" ||
      loggedInUserEmail === "admin@haitianme.com";

    const filteredAndSortedReportData = [...reportData]
      .filter((record) => {
        // Admin sees all records.
        if (isServiceReportAdmin) {
          return true;
        }

        const modifiedUser = String(
          record?.["Modified User"] ?? ""
        )
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .trim()
          .toLowerCase();

        // Normal users see only records modified by themselves.
        return (
          loggedInUserEmail !== "" &&
          modifiedUser === loggedInUserEmail
        );
      })
      .filter((record) => {
        const query = reportTableSearch.trim().toLowerCase();
        if (!query) return true;
        return getReportSearchText(record).includes(query);
      })
      .sort(
        (a, b) =>
          getServiceReportNumber(b) -
          getServiceReportNumber(a)
      );

    const reportTableColumns = [
      {
        title: "Service Report",
        dataIndex: "Service Report Number",
        key: "serviceReportNumber",
        fixed: "left",
        width: 150,
        sorter: (a, b) => getServiceReportNumber(a) - getServiceReportNumber(b),
        defaultSortOrder: "descend",
        render: (value) => (
          <div className="service-report-number-cell">
            <span className="service-report-number-badge">
              {value || "-"}
            </span>
          </div>
        ),
      },

      {
        title: "Customer",
        dataIndex: "Customer",
        key: "customer",
        width: 190,
        ellipsis: true,
      },

      {
        title: "Service Date",
        dataIndex: "Service Date",
        key: "serviceDate",
        width: 125,
        sorter: (a, b) =>
          String(a?.["Service Date"] || "").localeCompare(
            String(b?.["Service Date"] || ""),
          ),
        render: (date) => date || "-",
      },

      {
        title: "Site / Location",
        dataIndex: "Site / Location",
        key: "siteLocation",
        width: 210,
        ellipsis: true,
      },

      {
        title: "Contact Person",
        dataIndex: "Contact Person",
        key: "contactPerson",
        width: 170,
        ellipsis: true,
      },

      {
        title: "Contact No.",
        dataIndex: "Contact No.",
        key: "contactNo",
        width: 145,
        ellipsis: true,
      },

      {
        title: "Technician",
        dataIndex: "Technician",
        key: "technician",
        width: 150,
        ellipsis: true,
      },

      {
        title: "Arrival",
        dataIndex: "Arrival Time",
        key: "arrivalTime",
        width: 105,
        render: (time) => time || "-",
      },

      {
        title: "Completion",
        dataIndex: "Completion Time",
        key: "completionTime",
        width: 110,
        render: (time) => time || "-",
      },

      {
        title: "Working Hours",
        dataIndex: "Total Working Hours",
        key: "totalWorkingHours",
        width: 130,
        render: (value) => value || "-",
      },

      {
        title: "Visit Ref.",
        dataIndex: "Service Visit Ref.",
        key: "serviceVisitRef",
        width: 150,
        ellipsis: true,
      },

      {
        title: "Machine Model",
        dataIndex: "Machine Model",
        key: "machineModel",
        width: 170,
        ellipsis: true,
      },

      {
        title: "Serial No.",
        dataIndex: "Serial No.",
        key: "serialNo",
        width: 165,
        ellipsis: true,
      },

      {
        title: "Installation Year",
        dataIndex: "Installation year",
        key: "installationYear",
        width: 135,
        render: (_, record) =>
          record?.["Installation year"] ||
          record?.["Installation Date"] ||
          "-",
      },

      {
        title: "Running Hours",
        dataIndex: "Machine Running Hours",
        key: "machineRunningHours",
        width: 135,
        render: (value) => value || "-",
      },

      {
        title: "Controller",
        dataIndex: "Controller",
        key: "controller",
        width: 160,
        ellipsis: true,
        render: (_, record) =>
          record?.["Controller"] ||
          record?.["Controller / Software version"] ||
          record?.["Controller / Software Version"] ||
          "-",
      },

      {
        title: "Warranty",
        dataIndex: "Warranty Status",
        key: "warrantyStatus",
        width: 125,
        ellipsis: true,
      },

      {
        title: "Customer Complaint",
        dataIndex: "Customer Complaint",
        key: "customerComplaint",
        width: 240,
        ellipsis: true,
        render: (_, record) => getCustomerComplaint(record) || "-",
      },

      {
        title: "Technician Diagnosis",
        dataIndex: "Technician Diagnosis",
        key: "technicianDiagnosis",
        width: 240,
        ellipsis: true,
        render: (_, record) => getTechnicianDiagnosis(record) || "-",
      },

      {
        title: "Work Performed",
        dataIndex: "Work Performed",
        key: "workPerformed",
        width: 240,
        ellipsis: true,
        render: (_, record) => getWorkPerformed(record) || "-",
      },

      {
        title: "Trial Duration",
        dataIndex: "Trial Duration",
        key: "trialDuration",
        width: 125,
        render: (value) => value || "-",
      },

      {
        title: "Cycle Time",
        dataIndex: "Cycle Time",
        key: "cycleTime",
        width: 115,
        render: (value) => value || "-",
      },

      {
        title: "Product / Material",
        dataIndex: "Product / Material",
        key: "productMaterial",
        width: 180,
        ellipsis: true,
        render: (value) => value || "-",
      },

      {
        title: "Trial / Status Remarks",
        dataIndex: "Trial / Status Remarks",
        key: "trialStatusRemarks",
        width: 240,
        ellipsis: true,
        render: (value) => value || "-",
      },

      {
        title: "Part No.",
        dataIndex: "Part No.",
        key: "partNo",
        width: 180,
        ellipsis: true,
        render: (value) => value || "-",
      },

      {
        title: "Part Description",
        dataIndex: "Description",
        key: "partDescription",
        width: 180,
        ellipsis: true,
        render: (value) => value || "-",
      },

      {
        title: "Qty",
        dataIndex: "Qty",
        key: "qty",
        width: 80,
        render: (value) => value || "-",
      },

      {
        title: "Used / Recommended",
        dataIndex: "Used / Recommended",
        key: "usedRecommended",
        width: 180,
        ellipsis: true,
        render: (value) => value || "-",
      },

      {
        title: "Part Remarks",
        dataIndex: "Remarks",
        key: "partRemarks",
        width: 180,
        ellipsis: true,
        render: (value) => value || "-",
      },

      // {
      //   title: "Further Action",
      //   dataIndex: "Further Action Required",
      //   key: "furtherAction",
      //   width: 220,
      //   ellipsis: true,
      //   render: (value) => value || "-",
      // },

      // {
      //   title: "Commercial Classification",
      //   dataIndex: "Service Commercial Classification",
      //   key: "commercialClassification",
      //   width: 220,
      //   ellipsis: true,
      //   render: (value) => value || "-",
      // },

      {
        title: "Actions",
        key: "action",
        fixed: "right",
        width: 210,
        render: (_, record) => (
          <div className="service-report-table-actions">
            <Button
              className="service-report-view-action"
              icon={<EyeOutlined />}
              onClick={() => {
                setViewReport(record);
                setViewModalOpen(true);
              }}
            >
              View
            </Button>

            <Button
              className="service-report-edit-action"
              icon={<EditOutlined />}
              onClick={() => {
                setEditReport(record);
                setEditModalOpen(true);
              }}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ];

    // ============================================================
    // CUSTOMER DATA HELPERS
    // Supports both the actual Form Data sheet headers and the
    // older/canonical customer headers used by Code 1.
    // ============================================================

    const getCustomerName = (item) =>
      String(item?.["Customer"] || item?.["Customer Name"] || "").trim();

    const getCustomerAddress = (item) =>
      String(item?.["Site / Location"] || item?.["Address"] || "").trim();

    const getCustomerContact = (item) =>
      String(item?.["Contact Person"] || item?.["Contact"] || "").trim();

    const getCustomerTelephone = (item) =>
      String(item?.["Contact No."] || item?.["Telephone"] || "").trim();

    const getCustomerMachineModel = (item) =>
      String(item?.["Machine Model"] || item?.["Machine Type"] || "").trim();

    const getCustomerSerialNumber = (item) =>
      String(item?.["Serial No."] || item?.["Serial Number"] || "").trim();

    const getCustomerInstallationYear = (item) =>
      String(
        item?.["Installation year"] || item?.["Installation Date"] || "",
      ).trim();

    // ============================================================
    // LOAD CUSTOMER DATA
    // ============================================================

    useEffect(() => {
      loadAllCustomerData();
    }, []);

    const loadAllCustomerData = async () => {
      try {
        console.log("Loading customer data...");
        console.log("Customer API URL:", `${GAS_URL}?action=getAllCustomerData`);

        const response = await fetch(`${GAS_URL}?action=getAllCustomerData`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Customer data server returned ${response.status}`);
        }

        const result = await response.json();

        console.log("Customer API response:", result);

        if (!result.success) {
          throw new Error(result.message || "Customer data request failed");
        }

        const allData = Array.isArray(result.customers) ? result.customers : [];

        console.log("Customer rows received:", allData.length);
        console.log("Customer rows:", allData);

        // Normalize the returned rows so the frontend works whether
        // the backend sends "Customer" or "Customer Name" and the
        // actual sheet field names or the canonical Code-1 names.
        const normalizedData = allData
          .map((item) => ({
            ...item,
            Customer: getCustomerName(item),
            "Customer Name": getCustomerName(item),
            "Site / Location": getCustomerAddress(item),
            Address: getCustomerAddress(item),
            "Contact Person": getCustomerContact(item),
            Contact: getCustomerContact(item),
            "Contact No.": getCustomerTelephone(item),
            Telephone: getCustomerTelephone(item),
            "Machine Model": getCustomerMachineModel(item),
            "Machine Type": getCustomerMachineModel(item),
            "Serial No.": getCustomerSerialNumber(item),
            "Serial Number": getCustomerSerialNumber(item),
            "Installation year": getCustomerInstallationYear(item),
            "Installation Date": getCustomerInstallationYear(item),
          }))
          .filter((item) => getCustomerName(item) !== "");

        // Keep the latest row for each customer. The backend returns
        // sheet rows in their normal order, so iterating backwards
        // gives the newest occurrence first.
        const seen = new Map();

        for (let i = normalizedData.length - 1; i >= 0; i--) {
          const item = normalizedData[i];
          const name = getCustomerName(item);
          const key = name.toLowerCase();

          if (name && !seen.has(key)) {
            seen.set(key, item);
          }
        }

        const uniqueSorted = Array.from(seen.values()).sort((a, b) =>
          getCustomerName(a).localeCompare(getCustomerName(b)),
        );

        setCustomerDataList(uniqueSorted);
        setCustomerOptions(
          uniqueSorted.map((customer) => getCustomerName(customer)),
        );

        console.log(
          "Unique customers:",
          uniqueSorted.map((customer) => getCustomerName(customer)),
        );
      } catch (error) {
        console.error("Failed to load customer data:", error);
        setCustomerDataList([]);
        setCustomerOptions([]);
      }
    };

    // ============================================================
    // CUSTOMER SEARCH
    // ============================================================

    const handleCustomerSearch = (value) => {
      const searchValue = String(value || "")
        .trim()
        .toLowerCase();

      const filtered = customerDataList
        .map((item) => getCustomerName(item))
        .filter((name) => name !== "")
        .filter(
          (name, index, self) =>
            self.findIndex(
              (other) => other.toLowerCase().trim() === name.toLowerCase().trim(),
            ) === index,
        )
        .filter((name) => name.toLowerCase().includes(searchValue))
        .sort((a, b) => a.localeCompare(b));

      setCustomerOptions(filtered);
    };

    // ============================================================
    // CUSTOMER CHANGE / AUTO PREFILL
    // ============================================================

    const clearCustomerAutofill = () => {
      form.setFieldsValue({
        siteLocation: "",
        contactPerson: "",
        contactNo: "",
        machineModel: "",
        serialNo: "",
        installationYear: "",
      });

      setAddress("");
      setSerialNumber("");
    };

    const handleCustomerChange = (value) => {
      const customerValue = typeof value === "string" ? value.trim() : "";

      form.setFieldsValue({
        customer: value || "",
      });

      // Clear only when the customer field is actually emptied.
      // Do NOT clear the previous data while the user is typing a
      // partial customer name such as "P" or "HA".
      if (!customerValue) {
        clearCustomerAutofill();
        return;
      }

      const matched = customerDataList.find(
        (customer) =>
          getCustomerName(customer).toLowerCase() === customerValue.toLowerCase(),
      );

      if (!matched) {
        // Partial typing is allowed. Autofill happens only after an
        // exact customer name is selected/entered.
        return;
      }

      const customerName = getCustomerName(matched);
      const addressValue = getCustomerAddress(matched);
      const contactValue = getCustomerContact(matched);
      const telephoneValue = getCustomerTelephone(matched);
      const machineModelValue = getCustomerMachineModel(matched);
      const serialValue = getCustomerSerialNumber(matched);
      const installationYearValue = getCustomerInstallationYear(matched);

      form.setFieldsValue({
        customer: customerName,
        siteLocation: addressValue,
        contactPerson: contactValue,
        contactNo: telephoneValue,
        machineModel: machineModelValue,
        serialNo: serialValue,
        installationYear: installationYearValue,
      });

      setAddress(addressValue);
      setSerialNumber(serialValue);

      console.log("Customer selected:", matched);
    };

    const handleTechChange = (value) => {
      if (value.length <= 5) {
        setSelectedTechnicians(value);
        form.setFieldsValue({ technician: value });
      }
    };

    useEffect(() => {
      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);
      return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    useEffect(() => {
      fetchNextServiceReportNumber();
    }, []);

    // ============================================================
    // TEXT LIMIT UTILITY
    // Maximum: 3 lines and 512 characters
    // ============================================================
    const enforceSectionTextLimit = (value) => {
      const input = typeof value === "string" ? value : "";

      // First limit to 3 explicit lines
      const lines = input.split("\n").slice(0, 3);

      let limited = lines.join("\n");

      // Then limit total characters to 512
      if (limited.length > 512) {
        limited = limited.substring(0, 512);
      }

      return limited;
    };

    // Prevent the user from creating a 4th line by pressing Enter.
    // The existing onChange handlers still enforce the same 3-line / 512-character
    // restriction for typing and pasted content.
    const handleSectionTextKeyDown = (e) => {
      if (e.key !== "Enter") return;

      const currentValue = String(e.currentTarget?.value || "");
      const lineCount = currentValue.split(/\r?\n/).length;

      if (lineCount >= 2) {
        e.preventDefault();

        notification.warning({
          message: "Warning",
          description: "This field is limited to 3 lines and 512 characters.",
          placement: "bottomRight",
        });
      }
    };

    const enforceProductMaterialLimit = (value) => {
      const input = typeof value === "string" ? value : "";

      // Restrict to 1 line
      let limited = input.split("\n")[0];

      // Restrict to 90 characters
      if (limited.length > 100) {
        limited = limited.substring(0, 100);
      }

      return limited;
    };

    const handleProductMaterialChange = (e) => {
      const input = e.target.value;
      const limited = enforceProductMaterialLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Product Material is limited to 1 line and 100 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      form.setFieldsValue({
        productMaterial: limited,
      });
    };

    const handleRequiredActionFollowUpChange = (e) => {
      const input = e.target.value;
      const limited = enforceSectionTextLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Required Action / Follow-up is limited to 2 lines and 300 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      form.setFieldsValue({
        requiredActionFollowUp: limited,
      });
    };

    const handleTrialStatusRemarksChange = (e) => {
      const input = e.target.value;
      const limited = enforceSectionTextLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Trial / Status Remarks is limited to 3 lines and 512 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      form.setFieldsValue({
        trialStatusRemarks: limited,
      });
    };

    const handleCustomerComplaintChange = (e) => {
      const input = e.target.value;
      const limited = enforceSectionTextLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Customer complaint is limited to 3 lines and 512 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      form.setFieldsValue({
        customerComplaint: limited,
      });
    };

    const handleTechnicianDiagnosisChange = (e) => {
      const input = e.target.value;
      const limited = enforceSectionTextLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Technician diagnosis is limited to 3 lines and 512 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      form.setFieldsValue({
        technicianDiagnosis: limited,
      });
    };

    const handleWorkPerformedChange = (e) => {
      const input = e.target.value;
      const limited = enforceSectionTextLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Work performed is limited to 3 lines and 512 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      form.setFieldsValue({
        workPerformed: limited,
      });
    };

    // ============================================================
    // EDIT FORM - TEXT INPUT LIMITS
    // Same limits as the New Service Report form
    // ============================================================
    const handleEditSectionTextChange = (fieldName, fieldLabel, e) => {
      const input = e.target.value;
      const limited = enforceSectionTextLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description: `${fieldLabel} is limited to 2 lines and 300 characters. Excess text was removed.`,
          placement: "bottomRight",
        });
      }

      editForm.setFieldsValue({
        [fieldName]: limited,
      });
    };

    const handleEditProductMaterialChange = (e) => {
      const input = e.target.value;
      const limited = enforceProductMaterialLimit(input);

      if (input !== limited) {
        notification.warning({
          message: "Warning",
          description:
            "Product Material is limited to 1 line and 100 characters. Excess text was removed.",
          placement: "bottomRight",
        });
      }

      editForm.setFieldsValue({
        productMaterial: limited,
      });
    };

    const formatDDMMYYYY = (value = "") => {
      // remove everything except numbers
      let digits = value.replace(/\D/g, "").slice(0, 8);

      if (digits.length >= 5) {
        return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
      }

      if (digits.length >= 3) {
        return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      }

      return digits;
    };

    // ============================================================
    // PARTS TABLE DATA SOURCE
    // ============================================================

    const partsDataSource = [
      {
        key: 0,
      },
      {
        key: 1,
      },
      {
        key: 2,
      },
    ];

    // ============================================================
    // PARTS TABLE COLUMNS
    // ============================================================

    const partsColumns = [
      {
        title: "Part No.",
        dataIndex: "partNo",
        key: "partNo",
        width: "17%",

        render: (_, record) => (
          <Form.Item style={{ margin: 0 }}>
            <Input
              placeholder="Part No."
              maxLength={22}
              showCount
              value={partsFormData[record.key]?.partNo || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "partNo", e.target.value)
              }
            />
          </Form.Item>
        ),
      },

      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "34%",

        render: (_, record) => (
          <Form.Item style={{ margin: 0 }}>
            <Input
              placeholder="Description"
              maxLength={25}
              showCount
              value={partsFormData[record.key]?.description || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "description", e.target.value)
              }
            />
          </Form.Item>
        ),
      },

      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        width: "9%",

        render: (_, record) => (
          <Form.Item style={{ margin: 0 }}>
            <Input
              style={{ width: "100%" }}
              placeholder="Qty"
              value={partsFormData[record.key]?.qty || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "qty", e.target.value)
              }
            />
          </Form.Item>
        ),
      },

      {
        title: "Used / Recommended",
        dataIndex: "usedRecommended",
        key: "usedRecommended",
        width: "26%",

        render: (_, record) => (
          <Form.Item style={{ margin: 0 }}>
            <Input
              placeholder="Used / Recommended"
              maxLength={25}
              showCount
              value={partsFormData[record.key]?.usedRecommended || ""}
              onChange={(e) =>
                updatePartsFormData(
                  record.key,
                  "usedRecommended",
                  e.target.value,
                )
              }
            />
          </Form.Item>
        ),
      },

      {
        title: "Remarks",
        dataIndex: "remarks",
        key: "remarks",
        width: "14%",

        render: (_, record) => (
          <Form.Item style={{ margin: 0 }}>
            <Input
              placeholder="Remarks"
              maxLength={25}
              showCount
              value={partsFormData[record.key]?.remarks || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "remarks", e.target.value)
              }
            />
          </Form.Item>
        ),
      },
    ];

    const fetchNextServiceReportNumber = async () => {
      try {
        setSrnLoading(true);

        const response = await fetch(
          `${GAS_URL}?action=getNextServiceReportNumber`,
        );

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        console.log("Next SRN response:", result);

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch service report number",
          );
        }

        const nextSRN = result.serviceReportNumber ?? result.srn;

        if (nextSRN === undefined || nextSRN === null) {
          throw new Error("Service report number was not received");
        }

        setServiceReportNumber(String(nextSRN));
      } catch (error) {
        console.error("Fetch SRN error:", error);

        notification.error({
          message: "SRN Error",
          description: error.message || "Unable to fetch service report number.",
          placement: "bottomRight",
        });
      } finally {
        setSrnLoading(false);
      }
    };

    const saveTechnicianSignature = () => {
      if (sigTechnician.current && !sigTechnician.current.isEmpty()) {
        setSignatureTechnician(
          sigTechnician.current.getCanvas().toDataURL("image/png"),
        );

        setIsTechnicianSignSaved(true);

        notification.success({
          message: "Success",
          description: "Technician signature saved successfully!",
          placement: "bottomRight",
        });
      } else {
        notification.error({
          message: "Error",
          description: "Please draw the technician signature before saving.",
          placement: "bottomRight",
        });
      }
    };

    const clearTechnicianSignature = () => {
      if (sigTechnician.current && !sigTechnician.current.isEmpty()) {
        sigTechnician.current.clear();

        setSignatureTechnician("");
        setIsTechnicianSignSaved(false);

        notification.success({
          message: "Success",
          description: "Technician signature cleared successfully!",
          placement: "bottomRight",
        });
      } else {
        notification.warning({
          message: "Warning",
          description: "No technician signature found to clear.",
          placement: "bottomRight",
        });
      }
    };

    const saveManagerSignature = () => {
      if (sigManager.current && !sigManager.current.isEmpty()) {
        setSignatureManager(
          sigManager.current.getCanvas().toDataURL("image/png"),
        );

        setIsManagerSignSaved(true);

        notification.success({
          message: "Success",
          description: "Manager signature saved successfully!",
          placement: "bottomRight",
        });
      } else {
        notification.error({
          message: "Error",
          description: "Please draw the manager signature before saving.",
          placement: "bottomRight",
        });
      }
    };

    const clearManagerSignature = () => {
      if (sigManager.current && !sigManager.current.isEmpty()) {
        sigManager.current.clear();

        setSignatureManager("");
        setIsManagerSignSaved(false);

        notification.success({
          message: "Success",
          description: "Manager signature cleared successfully!",
          placement: "bottomRight",
        });
      } else {
        notification.warning({
          message: "Warning",
          description: "No manager signature found to clear.",
          placement: "bottomRight",
        });
      }
    };

    const saveCustomerSignature = () => {
      if (sigCustomer.current && !sigCustomer.current.isEmpty()) {
        setSignatureCustomer(
          sigCustomer.current.getCanvas().toDataURL("image/png"),
        );

        setIsCustomerSignSaved(true);

        notification.success({
          message: "Success",
          description: "Customer signature saved successfully!",
          placement: "bottomRight",
        });
      } else {
        notification.error({
          message: "Error",
          description: "Please draw the customer signature before saving.",
          placement: "bottomRight",
        });
      }
    };

    const clearCustomerSignature = () => {
      if (sigCustomer.current && !sigCustomer.current.isEmpty()) {
        sigCustomer.current.clear();

        setSignatureCustomer("");
        setIsCustomerSignSaved(false);

        notification.success({
          message: "Success",
          description: "Customer signature cleared successfully!",
          placement: "bottomRight",
        });
      } else {
        notification.warning({
          message: "Warning",
          description: "No customer signature found to clear.",
          placement: "bottomRight",
        });
      }
    };

    // ==========================================================
    // FORM SUBMIT
    // ==========================================================

  //   const handleSubmit = async (values) => {
  //     console.log(values);

  //     // ========================================================
  //     // PREVENT DOUBLE SUBMISSION
  //     // ========================================================

  //     if (loading) {
  //       return;
  //     }

  //     // ========================================================
  //     // SIGNATURE VALIDATION
  //     // ========================================================

  //     const technicianSignatureReady =
  //       isTechnicianSignSaved &&
  //       Boolean(signatureTechnician) &&
  //       sigTechnician.current &&
  //       !sigTechnician.current.isEmpty();

  //     const managerSignatureReady =
  //       isManagerSignSaved &&
  //       Boolean(signatureManager) &&
  //       sigManager.current &&
  //       !sigManager.current.isEmpty();

  //     const customerSignatureReady =
  //       isCustomerSignSaved &&
  //       Boolean(signatureCustomer) &&
  //       sigCustomer.current &&
  //       !sigCustomer.current.isEmpty();

  //     // --------------------------------------------------------
  //     // TECHNICIAN SIGNATURE
  //     // --------------------------------------------------------

  //     if (!technicianSignatureReady) {
  //       notification.error({
  //         message: "Technician Signature Required",
  //         description:
  //           "Please draw the technician signature and click Save Signature before submitting the report.",
  //         placement: "bottomRight",
  //       });

  //       return;
  //     }

  //     // --------------------------------------------------------
  //     // MANAGER SIGNATURE
  //     // --------------------------------------------------------

  //     if (!managerSignatureReady) {
  //       notification.error({
  //         message: "Manager Signature Required",
  //         description:
  //           "Please draw the manager signature and click Save Signature before submitting the report.",
  //         placement: "bottomRight",
  //       });

  //       return;
  //     }

  //     // --------------------------------------------------------
  //     // CUSTOMER SIGNATURE
  //     // --------------------------------------------------------

  //     if (!customerSignatureReady) {
  //       notification.error({
  //         message: "Customer Signature Required",
  //         description:
  //           "Please draw the customer signature and click Save Signature before submitting the report.",
  //         placement: "bottomRight",
  //       });

  //       return;
  //     }

  //     // ========================================================
  //     // MAIN SUBMISSION
  //     // ========================================================

  //     try {
  //       // ======================================================
  //       // INTERNET CHECK
  //       // ======================================================

  //       if (!navigator.onLine) {
  //         notification.error({
  //           message: "No Internet Connection",
  //           description: "Please check your internet and try again.",
  //           placement: "bottomRight",
  //         });

  //         return;
  //       }

  //       // ======================================================
  //       // START LOADING
  //       // ======================================================

  //       setLoading(true);

  //       // ========================================================
  //       // PARTS
  //       // ========================================================

  //       // ========================================================
  //       // PARTS
  //       // IMPORTANT: use the controlled Parts table state as the
  //       // single source of truth for saving and PDF generation.
  //       // ========================================================

  //       const parts = partsFormData.map((part) => ({
  //         partNo: String(part?.partNo ?? "").trim(),
  //         description: String(part?.description ?? "").trim(),
  //         qty: String(part?.qty ?? "").trim(),
  //         usedRecommended: String(part?.usedRecommended ?? "").trim(),
  //         remarks: String(part?.remarks ?? "").trim(),
  //       }));

  //       // Always keep all 3 default rows.
  //       while (parts.length < 3) {
  //         parts.push({
  //           partNo: "",
  //           description: "",
  //           qty: "",
  //           usedRecommended: "",
  //           remarks: "",
  //         });
  //       }

  //       // ========================================================
  //       // PAYLOAD
  //       // ========================================================

  //       const payload = {
  //         action: "saveReport",

  //         // ======================================================
  //         // CUSTOMER & VISIT
  //         // ======================================================

  //         customer: values.customer || "",
  //         serviceDate: values.serviceDate || "",
  //         siteLocation: values.siteLocation || "",
  //         contactPerson: values.contactPerson || "",
  //         contactNo: values.contactNo || "",
  //         technician: Array.isArray(values.technician)
  //           ? values.technician.join(", ")
  //           : values.technician || "",
  //         arrivalTime: values.arrivalTime || "",
  //         completionTime: values.completionTime || "",
  //         totalWorkingHours: values.totalWorkingHours ?? "",
  //         serviceVisitRef: values.serviceVisitRef || "",

  //         // ======================================================
  //         // MACHINE
  //         // ======================================================

  //         machineModel: values.machineModel || "",
  //         serialNo: values.serialNo || "",
  //         installationYear: values.installationYear || "",
  //         machineRunningHours: values.machineRunningHours ?? "",
  //         softwareVersion: values.softwareVersion || "",
  //         warrantyStatus: values.warrantyStatus || "",

  //         // ======================================================
  //         // SERVICE CATEGORY
  //         // ======================================================

  //         serviceCategory: JSON.stringify(values.serviceCategory || []),

  //         // ======================================================
  //         // COMPLAINT / DIAGNOSIS / WORK
  //         // ======================================================

  //         customerComplaint: values.customerComplaint || "",

  //         technicianDiagnosis: values.technicianDiagnosis || "",

  //         workPerformed: values.workPerformed || "",

  //         // ======================================================
  //         // MACHINE TRIAL
  //         // ======================================================

  //         machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),

  //         trialDuration: values.trialDuration || "",

  //         cycleTime: values.cycleTime || "",

  //         productMaterial: values.productMaterial || "",

  //         trialStatusRemarks: values.trialStatusRemarks || "",

  //         // ======================================================
  //         // PARTS
  //         // ======================================================

  //         parts: JSON.stringify(parts),

  //         // ======================================================
  //         // FURTHER ACTION
  //         // ======================================================

  //         furtherAction: JSON.stringify(values.furtherAction || []),

  //         requiredActionFollowUp: values.requiredActionFollowUp || "",

  //         // ======================================================
  //         // COMMERCIAL
  //         // ======================================================

  //         serviceCommercialClassification: JSON.stringify(
  //           values.serviceCommercialClassification || [],
  //         ),

  //         // ======================================================
  //         // CUSTOMER ACKNOWLEDGEMENT
  //         // ======================================================

  //         technicianName: values.technicianName || "",

  //         technicianDate: values.technicianDate || "",

  //         managerName: values.managerName || "",

  //         managerDate: values.managerDate || "",

  //         customerName: values.customerName || "",

  //         customerDate: values.customerDate || "",

  //         // ======================================================
  //         // SIGNATURES
  //         // ======================================================

  //         signatureTechnician: signatureTechnician || "",

  //         signatureManager: signatureManager || "",

  //         signatureCustomer: signatureCustomer || "",

  //         // ======================================================
  //         // LOGIN USER
  //         // ======================================================

  //         userEmail: user?.email || "",
  //       };

  //       // ========================================================
  //       // DEBUG - CHECK SIGNATURES BEFORE SUBMISSION
  //       // ========================================================

  //       console.log("Technician signature saved:", isTechnicianSignSaved);
  //       console.log("Manager signature saved:", isManagerSignSaved);
  //       console.log("Customer signature saved:", isCustomerSignSaved);

  //       console.log(
  //         "Technician signature data:",
  //         signatureTechnician ? "AVAILABLE" : "EMPTY",
  //       );

  //       console.log(
  //         "Manager signature data:",
  //         signatureManager ? "AVAILABLE" : "EMPTY",
  //       );

  //       console.log(
  //         "Customer signature data:",
  //         signatureCustomer ? "AVAILABLE" : "EMPTY",
  //       );

  //       // ========================================================
  //       // CREATE FORM DATA
  //       // ========================================================

  //       const formData = new URLSearchParams();

  //       Object.entries(payload).forEach(([key, value]) => {
  //         formData.append(
  //           key,
  //           value === null || value === undefined ? "" : String(value),
  //         );
  //       });

  //       // ========================================================
  //       // SEND TO GOOGLE APPS SCRIPT
  //       // ========================================================

  //       const response = await fetch(GAS_URL, {
  //         method: "POST",

  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },

  //         body: formData.toString(),
  //       });

  //       // ========================================================
  //       // SERVER RESPONSE CHECK
  //       // ========================================================

  //       if (!response.ok) {
  //         throw new Error(`Server returned ${response.status}`);
  //       }

  //       const result = await response.json();

  //       console.log("Backend response:", result);

  //       // ========================================================
  //       // BACKEND SUCCESS CHECK
  //       // ========================================================

  //       if (!result.success) {
  //         throw new Error(result.message || "Failed to save service report");
  //       }

  //       // ========================================================
  //       // GET SAVED REPORT NUMBER
  //       // ========================================================

  //       const savedReportNumber = result.serviceReportNumber ?? result.srn ?? "";

  //       // ========================================================
  //       // SUCCESS MESSAGE
  //       // ========================================================

  //       notification.success({
  //         message: "Success",

  //         description: savedReportNumber
  //           ? `Service report ${savedReportNumber} saved successfully.`
  //           : "Service report saved successfully.",

  //         placement: "bottomRight",
  //       });

  //       // ========================================================
  //       // GENERATE PDF AFTER SUCCESSFUL SAVE
  //       // The PDF is generated only after the backend confirms
  //       // that the service report was saved successfully.
  //       // If PDF generation fails, the saved report remains safe.
  //       // ========================================================

  //       try {
  //         // ======================================================
  //         // GENERATE PDF
  //         // ======================================================

  //         // Use exactly the same Parts array that was sent to the backend.
  //         // Do not rely on values.parts here because the Parts table is
  //         // controlled independently from the Ant Design form.
  //         const pdfValues = {
  //           ...values,
  //           parts,
  //         };

  //         const pdfResult = await generateServiceReportPDF(
  //           pdfValues,
  //           savedReportNumber || serviceReportNumber,
  //           signatureTechnician,
  //           signatureManager,
  //           signatureCustomer,
  //         );

  //         // ======================================================
  //         // UPLOAD PDF TO GOOGLE DRIVE THROUGH APPS SCRIPT
  //         // ======================================================

  //         const pdfFormData = new URLSearchParams();

  //         pdfFormData.append("action", "uploadPdf");
  //         pdfFormData.append("fileName", pdfResult.fileName);
  //         pdfFormData.append("pdfBase64", pdfResult.pdfBase64);

  //         const pdfUploadResponse = await fetch(GAS_URL, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/x-www-form-urlencoded",
  //           },
  //           body: pdfFormData.toString(),
  //         });

  //         if (!pdfUploadResponse.ok) {
  //           throw new Error(
  //             `PDF upload server returned ${pdfUploadResponse.status}`,
  //           );
  //         }

  //         const pdfUploadResult = await pdfUploadResponse.json();

  //         console.log("PDF upload response:", pdfUploadResult);

  //         if (!pdfUploadResult.success) {
  //           throw new Error(
  //             pdfUploadResult.message || "Failed to upload PDF to Google Drive",
  //           );
  //         }

  //         // ======================================================
  //         // DOWNLOAD THE SAME PDF LOCALLY
  //         // This preserves the previous application behavior.
  //         // ======================================================

  //         pdfResult.doc.save(pdfResult.fileName);

  //         console.log(
  //           "PDF saved to Google Drive:",
  //           pdfUploadResult.fileUrl || pdfUploadResult.fileId,
  //         );

  //         notification.success({
  //           message: "PDF Generated & Uploaded",
  //           description: `Service report PDF ${pdfResult.fileName} was saved to Google Drive successfully.`,
  //           placement: "bottomRight",
  //         });
  //       } catch (pdfError) {
  //         console.error("PDF generation/upload error:", pdfError);

  //         notification.warning({
  //           message: "Report Saved, But PDF Upload Failed",
  //           description: `The service report was saved successfully, but the PDF step failed: ${
  //             pdfError?.message || "Unknown PDF error"
  //           }`,
  //           placement: "bottomRight",
  //           duration: 8,
  //         });
  //       }

  //       // ========================================================
  //       // RESET FORM
  //       // ========================================================

  //       // form.resetFields();
  //       // setSelectedTechnicians([]);

  //       // ========================================================
  //       // CLEAR TECHNICIAN SIGNATURE
  //       // ========================================================

  //       // if (sigTechnician.current) {
  //       //   sigTechnician.current.clear();
  //       // }

  //       // setSignatureTechnician("");

  //       // setIsTechnicianSignSaved(false);

  //       // ========================================================
  //       // CLEAR MANAGER SIGNATURE
  //       // ========================================================

  //       // if (sigManager.current) {
  //       //   sigManager.current.clear();
  //       // }

  //       // setSignatureManager("");

  //       // setIsManagerSignSaved(false);

  //       // ========================================================
  //       // CLEAR CUSTOMER SIGNATURE
  //       // ========================================================

  //       // if (sigCustomer.current) {
  //       //   sigCustomer.current.clear();
  //       // }

  //       // setSignatureCustomer("");

  //       // setIsCustomerSignSaved(false);

  //       await fetchServiceReports();

  //       // ========================================================
  //       // FETCH NEXT SERVICE REPORT NUMBER
  //       // ========================================================

  //       try {
  //         const srnResponse = await fetch(
  //           `${GAS_URL}?action=getNextServiceReportNumber`,
  //         );

  //         if (!srnResponse.ok) {
  //           throw new Error(`SRN server returned ${srnResponse.status}`);
  //         }

  //         const srnResult = await srnResponse.json();

  //         console.log("Next Service Report Number:", srnResult);

  //         if (!srnResult.success) {
  //           throw new Error(
  //             srnResult.message || "Failed to fetch next service report number",
  //           );
  //         }

  //         const nextSRN = srnResult.serviceReportNumber ?? srnResult.srn ?? "";

  //         if (nextSRN !== "") {
  //           setServiceReportNumber(String(nextSRN));
  //         }
  //       } catch (srnError) {
  //         console.error("Failed to fetch next SRN:", srnError);

  //         // Do not show the main submission as failed
  //         // because the report itself was already saved.
  //         notification.warning({
  //           message: "Report Saved, But SRN Refresh Failed",

  //           description:
  //             "The report was saved successfully, but the next Service Report Number could not be loaded. Please refresh the page.",

  //           placement: "bottomRight",
  //         });
  //       }
  //     } catch (error) {
  //       // ========================================================
  //       // ERROR
  //       // ========================================================

  //       console.error("Save report error:", error);

  //       notification.error({
  //         message: "Error",

  //         description: error.message || "Failed to save service report.",

  //         placement: "bottomRight",
  //       });
  //     } finally {
  //       // ========================================================
  //       // STOP LOADING
  //       // ========================================================

  //       setLoading(false);
  //     }
  //   };

  // ==========================================================
  // FORM SUBMIT
  // ==========================================================

  const handleSubmit = async (values) => {
    console.log(values);

    // ========================================================
    // PREVENT DOUBLE SUBMISSION
    // ========================================================

    if (loading) {
      return;
    }

    // ========================================================
    // SIGNATURE VALIDATION
    // ========================================================

    const technicianSignatureReady =
      isTechnicianSignSaved &&
      Boolean(signatureTechnician) &&
      sigTechnician.current &&
      !sigTechnician.current.isEmpty();

    const managerSignatureReady =
      isManagerSignSaved &&
      Boolean(signatureManager) &&
      sigManager.current &&
      !sigManager.current.isEmpty();

    const customerSignatureReady =
      isCustomerSignSaved &&
      Boolean(signatureCustomer) &&
      sigCustomer.current &&
      !sigCustomer.current.isEmpty();

    // --------------------------------------------------------
    // TECHNICIAN SIGNATURE
    // --------------------------------------------------------

    if (!technicianSignatureReady) {
      notification.error({
        message: "Technician Signature Required",
        description:
          "Please draw the technician signature and click Save Signature before submitting the report.",
        placement: "bottomRight",
      });

      return;
    }

    // --------------------------------------------------------
    // MANAGER SIGNATURE
    // --------------------------------------------------------

    if (!managerSignatureReady) {
      notification.error({
        message: "Manager Signature Required",
        description:
          "Please draw the manager signature and click Save Signature before submitting the report.",
        placement: "bottomRight",
      });

      return;
    }

    // --------------------------------------------------------
    // CUSTOMER SIGNATURE
    // --------------------------------------------------------

    if (!customerSignatureReady) {
      notification.error({
        message: "Customer Signature Required",
        description:
          "Please draw the customer signature and click Save Signature before submitting the report.",
        placement: "bottomRight",
      });

      return;
    }

    // ========================================================
    // MAIN SUBMISSION
    // ========================================================

    try {
      // ======================================================
      // INTERNET CHECK
      // ======================================================

      if (!navigator.onLine) {
        notification.error({
          message: "No Internet Connection",
          description: "Please check your internet and try again.",
          placement: "bottomRight",
        });

        return;
      }

      // ======================================================
      // START LOADING
      // ======================================================

      setLoading(true);

      // ======================================================
      // PARTS
      // IMPORTANT: use the controlled Parts table state as
      // the single source of truth for saving and PDF generation.
      // ======================================================

      const parts = partsFormData.map((part) => ({
        partNo: String(part?.partNo ?? "").trim(),
        description: String(part?.description ?? "").trim(),
        qty: String(part?.qty ?? "").trim(),
        usedRecommended: String(part?.usedRecommended ?? "").trim(),
        remarks: String(part?.remarks ?? "").trim(),
      }));

      // Always keep all 3 default rows.
      while (parts.length < 3) {
        parts.push({
          partNo: "",
          description: "",
          qty: "",
          usedRecommended: "",
          remarks: "",
        });
      }

      // ========================================================
      // PAYLOAD
      // ========================================================

      const payload = {
        action: "saveReport",

        // ======================================================
        // CUSTOMER & VISIT
        // ======================================================

        customer: values.customer || "",
        serviceDate: values.serviceDate || "",
        siteLocation: values.siteLocation || "",
        contactPerson: values.contactPerson || "",
        contactNo: values.contactNo || "",

        technician: Array.isArray(values.technician)
          ? values.technician.join(", ")
          : values.technician || "",

        arrivalTime: values.arrivalTime || "",
        completionTime: values.completionTime || "",
        totalWorkingHours: values.totalWorkingHours ?? "",
        serviceVisitRef: values.serviceVisitRef || "",

        // ======================================================
        // MACHINE
        // ======================================================

        machineModel: values.machineModel || "",
        serialNo: values.serialNo || "",
        installationYear: values.installationYear || "",
        machineRunningHours: values.machineRunningHours ?? "",
        softwareVersion: values.softwareVersion || "",
        warrantyStatus: values.warrantyStatus || "",

        // ======================================================
        // SERVICE CATEGORY
        // ======================================================

        serviceCategory: JSON.stringify(values.serviceCategory || []),

        // ======================================================
        // COMPLAINT / DIAGNOSIS / WORK
        // ======================================================

        customerComplaint: values.customerComplaint || "",

        technicianDiagnosis: values.technicianDiagnosis || "",

        workPerformed: values.workPerformed || "",

        // ======================================================
        // MACHINE TRIAL
        // ======================================================

        machineTrialStatus: JSON.stringify(
          values.machineTrialStatus || [],
        ),

        trialDuration: values.trialDuration || "",

        cycleTime: values.cycleTime || "",

        productMaterial: values.productMaterial || "",

        trialStatusRemarks: values.trialStatusRemarks || "",

        // ======================================================
        // PARTS
        // ======================================================

        parts: JSON.stringify(parts),

        // ======================================================
        // FURTHER ACTION
        // ======================================================

        furtherAction: JSON.stringify(values.furtherAction || []),

        requiredActionFollowUp:
          values.requiredActionFollowUp || "",

        // ======================================================
        // COMMERCIAL
        // ======================================================

        serviceCommercialClassification: JSON.stringify(
          values.serviceCommercialClassification || [],
        ),

        // ======================================================
        // CUSTOMER ACKNOWLEDGEMENT
        // ======================================================

        technicianName: values.technicianName || "",
        technicianDate: values.technicianDate || "",

        managerName: values.managerName || "",
        managerDate: values.managerDate || "",

        customerName: values.customerName || "",
        customerDate: values.customerDate || "",

        // ======================================================
        // SIGNATURES
        // ======================================================

        signatureTechnician: signatureTechnician || "",
        signatureManager: signatureManager || "",
        signatureCustomer: signatureCustomer || "",

        // ======================================================
        // LOGIN USER
        // ======================================================

        userEmail: user?.email || "",
      };

      // ========================================================
      // DEBUG - CHECK SIGNATURES BEFORE SUBMISSION
      // ========================================================

      console.log(
        "Technician signature saved:",
        isTechnicianSignSaved,
      );

      console.log(
        "Manager signature saved:",
        isManagerSignSaved,
      );

      console.log(
        "Customer signature saved:",
        isCustomerSignSaved,
      );

      console.log(
        "Technician signature data:",
        signatureTechnician ? "AVAILABLE" : "EMPTY",
      );

      console.log(
        "Manager signature data:",
        signatureManager ? "AVAILABLE" : "EMPTY",
      );

      console.log(
        "Customer signature data:",
        signatureCustomer ? "AVAILABLE" : "EMPTY",
      );

      // ========================================================
      // CREATE FORM DATA
      // ========================================================

      const formData = new URLSearchParams();

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(
          key,
          value === null || value === undefined
            ? ""
            : String(value),
        );
      });

      // ========================================================
      // SEND TO GOOGLE APPS SCRIPT
      // ========================================================

      const response = await fetch(GAS_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        body: formData.toString(),
      });

      // ========================================================
      // SERVER RESPONSE CHECK
      // ========================================================

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      console.log("Backend response:", result);

      // ========================================================
      // BACKEND SUCCESS CHECK
      // ========================================================

      if (!result.success) {
        throw new Error(
          result.message || "Failed to save service report",
        );
      }

      // ========================================================
      // GET SAVED REPORT NUMBER
      // ========================================================

      const savedReportNumber =
        result.serviceReportNumber ??
        result.srn ??
        "";

      // ========================================================
      // SUCCESS MESSAGE
      // ========================================================

      notification.success({
        message: "Success",

        description: savedReportNumber
          ? `Service report ${savedReportNumber} saved successfully.`
          : "Service report saved successfully.",

        placement: "bottomRight",
      });

      // ========================================================
      // GENERATE PDF AFTER SUCCESSFUL SAVE
      // ========================================================

      try {
        // ======================================================
        // GENERATE PDF
        // ======================================================

        // IMPORTANT:
        // Generate the PDF BEFORE clearing the form.
        // This ensures the submitted values and signatures
        // are still available for the PDF.

        const pdfValues = {
          ...values,
          parts,
        };

        const pdfResult = await generateServiceReportPDF(
          pdfValues,
          savedReportNumber || serviceReportNumber,
          signatureTechnician,
          signatureManager,
          signatureCustomer,
        );

        // ======================================================
        // UPLOAD PDF TO GOOGLE DRIVE THROUGH APPS SCRIPT
        // ======================================================

        const pdfFormData = new URLSearchParams();

        pdfFormData.append(
          "action",
          "uploadPdf",
        );

        pdfFormData.append(
          "fileName",
          pdfResult.fileName,
        );

        pdfFormData.append(
          "pdfBase64",
          pdfResult.pdfBase64,
        );

        const pdfUploadResponse = await fetch(GAS_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: pdfFormData.toString(),
        });

        if (!pdfUploadResponse.ok) {
          throw new Error(
            `PDF upload server returned ${pdfUploadResponse.status}`,
          );
        }

        const pdfUploadResult =
          await pdfUploadResponse.json();

        console.log(
          "PDF upload response:",
          pdfUploadResult,
        );

        if (!pdfUploadResult.success) {
          throw new Error(
            pdfUploadResult.message ||
              "Failed to upload PDF to Google Drive",
          );
        }

        // ======================================================
        // DOWNLOAD THE SAME PDF LOCALLY
        // ======================================================

        pdfResult.doc.save(pdfResult.fileName);

        console.log(
          "PDF saved to Google Drive:",
          pdfUploadResult.fileUrl ||
            pdfUploadResult.fileId,
        );

        notification.success({
          message: "PDF Generated & Uploaded",

          description: `Service report PDF ${pdfResult.fileName} was saved to Google Drive successfully.`,

          placement: "bottomRight",
        });
      } catch (pdfError) {
        // ======================================================
        // PDF ERROR
        // ======================================================

        console.error(
          "PDF generation/upload error:",
          pdfError,
        );

        notification.warning({
          message: "Report Saved, But PDF Upload Failed",

          description: `The service report was saved successfully, but the PDF step failed: ${
            pdfError?.message || "Unknown PDF error"
          }`,

          placement: "bottomRight",

          duration: 8,
        });
      }

      // ========================================================
      // RESET NEW REPORT FORM
      // ========================================================
      //
      // IMPORTANT:
      // This section runs ONLY after the backend has confirmed
      // successful saving.
      //
      // The PDF has also already been generated using the
      // original values before the form is cleared.
      // ========================================================

      // --------------------------------------------------------
      // RESET ALL ANT DESIGN FORM FIELDS
      // --------------------------------------------------------

      form.resetFields();

      // --------------------------------------------------------
      // RESET SELECTED TECHNICIANS
      // --------------------------------------------------------

      setSelectedTechnicians([]);

      // --------------------------------------------------------
      // RESET CUSTOMER/AUTOFILL STATE
      // --------------------------------------------------------

      setAddress("");

      setSerialNumber("");

      // --------------------------------------------------------
      // RESET PARTS TABLE
      // --------------------------------------------------------

      setPartsFormData([
        {
          key: 0,
          partNo: "",
          description: "",
          qty: "",
          usedRecommended: "",
          remarks: "",
        },
        {
          key: 1,
          partNo: "",
          description: "",
          qty: "",
          usedRecommended: "",
          remarks: "",
        },
        {
          key: 2,
          partNo: "",
          description: "",
          qty: "",
          usedRecommended: "",
          remarks: "",
        },
      ]);

      // --------------------------------------------------------
      // CLEAR TECHNICIAN SIGNATURE
      // --------------------------------------------------------

      if (sigTechnician.current) {
        sigTechnician.current.clear();
      }

      setSignatureTechnician("");

      setIsTechnicianSignSaved(false);

      // --------------------------------------------------------
      // CLEAR MANAGER SIGNATURE
      // --------------------------------------------------------

      if (sigManager.current) {
        sigManager.current.clear();
      }

      setSignatureManager("");

      setIsManagerSignSaved(false);

      // --------------------------------------------------------
      // CLEAR CUSTOMER SIGNATURE
      // --------------------------------------------------------

      if (sigCustomer.current) {
        sigCustomer.current.clear();
      }

      setSignatureCustomer("");

      setIsCustomerSignSaved(false);

      // ========================================================
      // REFRESH SERVICE REPORT TABLE
      // ========================================================

      await fetchServiceReports();

      // ========================================================
      // FETCH NEXT SERVICE REPORT NUMBER
      // ========================================================

      try {
        const srnResponse = await fetch(
          `${GAS_URL}?action=getNextServiceReportNumber`,
        );

        if (!srnResponse.ok) {
          throw new Error(
            `SRN server returned ${srnResponse.status}`,
          );
        }

        const srnResult = await srnResponse.json();

        console.log(
          "Next Service Report Number:",
          srnResult,
        );

        if (!srnResult.success) {
          throw new Error(
            srnResult.message ||
              "Failed to fetch next service report number",
          );
        }

        const nextSRN =
          srnResult.serviceReportNumber ??
          srnResult.srn ??
          "";

        if (nextSRN !== "") {
          setServiceReportNumber(
            String(nextSRN),
          );
        }
      } catch (srnError) {
        console.error(
          "Failed to fetch next SRN:",
          srnError,
        );

        // Do not show the main submission as failed
        // because the report itself was already saved.

        notification.warning({
          message:
            "Report Saved, But SRN Refresh Failed",

          description:
            "The report was saved successfully, but the next Service Report Number could not be loaded. Please refresh the page.",

          placement: "bottomRight",
        });
      }
    } catch (error) {
      // ========================================================
      // ERROR
      // ========================================================

      console.error(
        "Save report error:",
        error,
      );

      notification.error({
        message: "Error",

        description:
          error.message ||
          "Failed to save service report.",

        placement: "bottomRight",
      });
    } finally {
      // ========================================================
      // STOP LOADING
      // ========================================================

      setLoading(false);
    }
  };

    // ==========================================================
    // REQUIRED FIELD RULE
    // ==========================================================

    const requiredRule = (fieldName) => [
      {
        required: true,
        message: `Please enter ${fieldName}`,
      },
    ];

    // ==========================================================
    // DATE VALIDATION
    // DD-MM-YYYY
    // ==========================================================

    const dateRule = (fieldName) => [
      {
        required: true,
        message: `Please enter ${fieldName}`,
      },
      {
        pattern: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
        message: "Please enter date in DD-MM-YYYY format",
      },
    ];

    // ==========================================================
    // TIME VALIDATION
    // HH:MM
    // ==========================================================

    const timeRule = (fieldName) => [
      {
        required: true,
        message: `Please enter ${fieldName}`,
      },
      {
        pattern: /^([01]\d|2[0-3]):([0-5]\d)$/,
        message: "Please enter time in HH:MM (24 hr) format",
      },
    ];

    const formatHHMM = (value = "") => {
      // Remove everything except numbers
      let digits = value.replace(/\D/g, "").slice(0, 4);

      // Automatically add colon after HH
      if (digits.length >= 3) {
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
      }

      return digits;
    };

    // ==========================================================
    // CONTACT NUMBER VALIDATION
    // ==========================================================

    const contactNumberRule = [
      {
        required: true,
        message: "Please enter contact number",
      },
      {
        pattern: /^[0-9+\-\s()]+$/,
        message: "Please enter a valid contact number",
      },
    ];

    // ==========================================================
    // RETURN
    // ==========================================================

    return (
      <div className="service-form-page">
        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="service-form-header">
          {/* ================================================== */}
          {/* HAITIAN LOGO */}
          {/* ================================================== */}

          <div className="service-form-header-logo-wrap">
            <img
              src={HaitianLogo}
              alt="Haitian Logo"
              className="img-fluid service-form-header-logo"
            />
          </div>

          {/* ================================================== */}
          {/* SERVICE REPORT NUMBER */}
          {/* EXACT CENTER OF PAGE */}
          {/* ================================================== */}

          <div className="service-form-header-number">
            <p
              style={{
                margin: 0,
                padding: 0,
                color: "#0D3884",
                fontWeight: "bold",
                fontSize: "20px",
                whiteSpace: "normal",
              }}
            >
              Service Report No:{" "}
              {srnLoading ? "Loading..." : serviceReportNumber || "---"}
            </p>
          </div>

          {/* ================================================== */}
          {/* USER AVATAR */}
          {/* ================================================== */}

          <div className="service-form-header-user">
            <Dropdown
              placement="bottomRight"
              open={open}
              onOpenChange={(flag) => setOpen(flag)}
              trigger={["click"]}
              dropdownRender={() => {
                const email = user?.email || "";

                const username = email.split("@")[0] || "User";

                const initials =
                  user?.name?.substring(0, 2).toUpperCase() ||
                  email.substring(0, 2).toUpperCase() ||
                  "US";

                return (
                  <div
                    style={{
                      minWidth: 250,
                      borderRadius: 12,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* ======================================== */}
                    {/* DROPDOWN HEADER */}
                    {/* ======================================== */}

                    <div
                      style={{
                        backgroundColor: "#0D3884",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                      }}
                    >
                      <Avatar
                        size={48}
                        style={{
                          backgroundColor: "transparent",
                          border: "2px solid #fff",
                          color: "#fff",
                          fontWeight: "bold",
                          marginRight: 12,
                        }}
                      >
                        {initials}
                      </Avatar>

                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            opacity: 0.9,
                          }}
                        >
                          Welcome back
                        </div>

                        <Tooltip title={username}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 16,
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {username}
                          </div>
                        </Tooltip>
                      </div>
                    </div>

                    {/* ======================================== */}
                    {/* DROPDOWN BODY */}
                    {/* ======================================== */}

                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "16px",
                      }}
                    >
                      {/* EMAIL */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        <MailOutlined
                          style={{
                            marginRight: 8,
                            color: "#444",
                          }}
                        />

                        <Tooltip title={email}>
                          <span
                            style={{
                              fontSize: 14,
                              maxWidth: 160,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "inline-block",
                            }}
                          >
                            {email}
                          </span>
                        </Tooltip>
                      </div>

                      {/* LOGOUT BUTTON */}

                      <Button
                        type="primary"
                        danger
                        block
                        icon={<LogoutOutlined />}
                        onClick={() => {
                          setOpen(false);

                          if (onLogout) {
                            onLogout();
                          }
                        }}
                        style={{
                          borderRadius: 8,
                          fontWeight: 500,
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                );
              }}
            >
              {/* MAIN AVATAR */}

              <Avatar
                size="large"
                style={{
                  backgroundColor: "#0D3884",
                  cursor: "pointer",
                  fontWeight: "bold",
                  userSelect: "none",
                }}
              >
                {user?.name?.substring(0, 2).toUpperCase() ||
                  user?.email?.substring(0, 2).toUpperCase() ||
                  "US"}
              </Avatar>
            </Dropdown>
          </div>
        </div>

        {/* ====================================================== */}
        {/* FORM */}
        {/* ====================================================== */}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={true}
        >
          {/* ==================================================== */}
          {/* 1. CUSTOMER & VISIT INFORMATION */}
          {/* ==================================================== */}

          <SectionTitle title="1. CUSTOMER & VISIT INFORMATION" />

          <div className="row">
            {/* ================================================= */}
            {/* CUSTOMER */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Customer"
                name="customer"
                rules={requiredRule("customer")}
              >
                <AutoComplete
                  allowClear
                  showSearch
                  placeholder="Type or select customer name"
                  onSearch={handleCustomerSearch}
                  onChange={handleCustomerChange}
                  onSelect={(value) => handleCustomerChange(value)}
                  options={customerOptions.map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  filterOption={(inputValue, option) =>
                    String(option?.value || "")
                      .toLowerCase()
                      .includes(String(inputValue || "").toLowerCase())
                  }
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* SERVICE DATE */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Service Date"
                name="serviceDate"
                rules={[
                  {
                    required: true,
                    message: "Please enter service date",
                  },
                  {
                    pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                    message: "Enter date in DD-MM-YYYY format",
                  },
                ]}
              >
                <Input
                  placeholder="DD-MM-YYYY"
                  value={form.getFieldValue("serviceDate") || ""}
                  onChange={(e) => {
                    const formatted = formatDDMMYYYY(e.target.value);

                    form.setFieldsValue({
                      serviceDate: formatted,
                    });
                  }}
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* SITE / LOCATION */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Site / Location"
                name="siteLocation"
                rules={requiredRule("site / location")}
              >
                <Input size="large" placeholder="Enter site / location" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* CONTACT PERSON */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Contact Person"
                name="contactPerson"
                rules={requiredRule("contact person")}
              >
                <Input size="large" placeholder="Enter contact person" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* CONTACT NUMBER */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Contact No."
                name="contactNo"
                rules={contactNumberRule}
              >
                <Input size="large" placeholder="Enter contact number" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* TECHNICIAN */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Technician"
                name="technician"
                rules={requiredRule("technician")}
              >
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select up to 5 technicians"
                  value={selectedTechnicians}
                  onChange={handleTechChange}
                  maxTagCount="responsive"
                  optionFilterProp="label"
                  style={{ width: "100%" }}
                  options={technicianOptions.map((technician) => ({
                    label: technician,
                    value: technician,
                    disabled:
                      selectedTechnicians.length >= 5 &&
                      !selectedTechnicians.includes(technician),
                  }))}
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* ARRIVAL TIME */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Arrival Time"
                name="arrivalTime"
                rules={timeRule("arrival time")}
              >
                <Input
                  size="large"
                  placeholder="HH:MM"
                  maxLength={5}
                  inputMode="numeric"
                  onChange={(e) => {
                    const formatted = formatHHMM(e.target.value);

                    form.setFieldsValue({
                      arrivalTime: formatted,
                    });
                  }}
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* COMPLETION TIME */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Completion Time"
                name="completionTime"
                rules={timeRule("completion time")}
              >
                <Input
                  size="large"
                  placeholder="HH:MM"
                  maxLength={5}
                  inputMode="numeric"
                  onChange={(e) => {
                    const formatted = formatHHMM(e.target.value);

                    form.setFieldsValue({
                      completionTime: formatted,
                    });
                  }}
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* TOTAL WORKING HOURS */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Total Working Hours"
                name="totalWorkingHours"
                rules={[
                  {
                    required: true,
                    message: "Please enter total working hours",
                  },
                ]}
              >
                <Input
                  size="large"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Enter total working hours"
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* SERVICE VISIT REF */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Service Visit Ref."
                name="serviceVisitRef"
                rules={requiredRule("service visit reference")}
              >
                <Input size="large" placeholder="Enter service visit reference" />
              </Form.Item>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 2. MACHINE INFORMATION */}
          {/* ==================================================== */}

          <SectionTitle title="2. MACHINE INFORMATION" />

          <div className="row">
            {/* ================================================= */}
            {/* MACHINE MODEL */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Machine Model"
                name="machineModel"
                rules={requiredRule("machine model")}
              >
                <Input size="large" placeholder="Enter machine model" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* SERIAL NUMBER */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Serial No."
                name="serialNo"
                rules={requiredRule("serial number")}
              >
                <Input size="large" placeholder="Enter serial number" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* INSTALLATION DATE */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Installation Year"
                name="installationYear"
                rules={requiredRule("installation year")}
              >
                <Input size="large" placeholder="Enter installation year" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* MACHINE RUNNING HOURS */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item label="Machine Running Hours" name="machineRunningHours">
                <Input
                  size="large"
                  min={0}
                  style={{
                    width: "100%",
                  }}
                  placeholder="Enter machine running hours"
                />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* CONTROLLER / SOFTWARE VERSION */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Controller"
                name="softwareVersion"
                rules={requiredRule("controller")}
              >
                <Input size="large" placeholder="Enter controller" />
              </Form.Item>
            </div>

            {/* ================================================= */}
            {/* WARRANTY STATUS */}
            {/* ================================================= */}

            <div className="col-md-6">
              <Form.Item
                label="Warranty Status"
                name="warrantyStatus"
                rules={requiredRule("warranty status")}
              >
                <Input size="large" placeholder="Enter warranty status" />
              </Form.Item>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 3. SERVICE CATEGORY */}
          {/* ==================================================== */}

          <SectionTitle title="3. SERVICE CATEGORY" />

          <Form.Item
            name="serviceCategory"
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "Please select at least one service category",
              },
            ]}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              <div className="service-category-options">
                <Checkbox value="installation">
                  Installation / Commissioning
                </Checkbox>

                <Checkbox value="breakdown">Breakdown / Defect</Checkbox>

                <Checkbox value="preventive">Preventive Maintenance</Checkbox>

                <Checkbox value="corrective">Corrective Maintenance</Checkbox>

                <Checkbox value="inspection">Inspection</Checkbox>

                <Checkbox value="customerVisit">Customer Visit</Checkbox>

                <Checkbox value="software">Software / Program</Checkbox>

                <Checkbox value="other">Other</Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>

          {/* ==================================================== */}
          {/* 4. CUSTOMER COMPLAINT / REPORTED PROBLEM */}
          {/* ==================================================== */}

          <SectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

          <Form.Item
            name="customerComplaint"
            rules={[
              {
                required: true,
                message: "Please enter customer complaint / reported problem",
              },
            ]}
          >
            <TextArea
              rows={3}
              maxLength={512}
              showCount
              placeholder="Enter customer complaint / reported problem"
              onChange={handleCustomerComplaintChange}
            />
          </Form.Item>

          {/* ==================================================== */}
          {/* 5. TECHNICIAN DIAGNOSIS / ROOT CAUSE */}
          {/* ==================================================== */}

          <SectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

          <Form.Item
            name="technicianDiagnosis"
            rules={[
              {
                required: true,
                message: "Please enter technician diagnosis / root cause",
              },
            ]}
          >
            <TextArea
              rows={3}
              maxLength={512}
              showCount
              placeholder="Enter technician diagnosis / root cause"
              onChange={handleTechnicianDiagnosisChange}
            />
          </Form.Item>

          {/* ==================================================== */}
          {/* 6. WORK PERFORMED / CORRECTIVE ACTION */}
          {/* ==================================================== */}

          <SectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

          <Form.Item
            name="workPerformed"
            rules={[
              {
                required: true,
                message: "Please enter work performed / corrective action",
              },
            ]}
          >
            <TextArea
              rows={3}
              maxLength={512}
              showCount
              placeholder="Enter work performed / corrective action"
              onChange={handleWorkPerformedChange}
            />
          </Form.Item>

          {/* ==================================================== */}
          {/* 7. MACHINE TRIAL & FINAL STATUS */}
          {/* ==================================================== */}

          <SectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />

          {/* MACHINE STATUS CHECKBOXES */}

          {/* MACHINE TRIAL STATUS */}

          <Form.Item
            name="machineTrialStatus"
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "Please select machine trial status",
              },
            ]}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              <div className="machine-trial-options">
                <Checkbox value="machineTestedSuccessfully">
                  Machine tested successfully
                </Checkbox>

                <Checkbox value="machineRunningNormally">
                  Machine running normally
                </Checkbox>

                <Checkbox value="runningWithObservation">
                  Running with observation
                </Checkbox>

                <Checkbox value="machineStopped">
                  Machine stopped - further action required
                </Checkbox>

                <Checkbox value="customerAdvised">
                  Customer advised / awaiting action
                </Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>

          {/* TRIAL DURATION / CYCLE TIME */}

          <div className="row">
            {/* TRIAL DURATION */}
            <div className="col-md-6">
              <Form.Item
                label="Trial Duration"
                name="trialDuration"
                rules={[
                  {
                    required: true,
                    message: "Please enter trial duration",
                  },
                ]}
              >
                <Input placeholder="Enter trial duration" />
              </Form.Item>
            </div>

            {/* CYCLE TIME */}
            <div className="col-md-6">
              <Form.Item
                label="Cycle Time"
                name="cycleTime"
                rules={[
                  {
                    required: true,
                    message: "Please enter cycle time",
                  },
                ]}
              >
                <Input placeholder="Enter cycle time" />
              </Form.Item>
            </div>
          </div>

          {/* PRODUCT / MATERIAL / FINAL REMARKS */}

          <div className="row">
            {/* PRODUCT / MATERIAL */}
            <div className="col-md-12">
              <Form.Item
                label="Product / Material"
                name="productMaterial"
                rules={[
                  {
                    required: true,
                    message: "Please enter product / material",
                  },
                ]}
              >
                <Input
                  maxLength={100}
                  showCount
                  placeholder="Enter product material"
                  onChange={handleProductMaterialChange}
                />{" "}
              </Form.Item>
            </div>
          </div>

          {/* TRIAL / STATUS REMARKS */}

          <Form.Item
            label="Trial / Status Remarks"
            name="trialStatusRemarks"
            rules={[
              {
                required: true,
                message: "Please enter trial / status remarks",
              },
            ]}
          >
            <TextArea
              rows={2}
              maxLength={300}
              showCount
              placeholder="Enter trial / status remarks"
              onChange={handleTrialStatusRemarksChange}
              onKeyDown={handleSectionTextKeyDown}
            />{" "}
          </Form.Item>

          {/* ==================================================== */}
          {/* 8. PARTS USED / RECOMMENDED */}
          {/* ==================================================== */}

          <SectionTitle title="8. PARTS USED / RECOMMENDED" />

          <div className="parts-table-responsive">
            <Table
              bordered
              pagination={false}
              size="small"
              columns={partsColumns}
              dataSource={partsDataSource}
              scroll={{ x: 850 }}
            />
          </div>

          {/* ==================================================== */}
          {/* 9. FURTHER ACTION REQUIRED */}
          {/* ==================================================== */}

          <SectionTitle title="9. FURTHER ACTION REQUIRED" />

          <Form.Item
            name="furtherAction"
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "Please select at least one further action",
              },
            ]}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              <div className="further-action-options">
                <Checkbox value="noFurtherAction">
                  No further action required
                </Checkbox>

                <Checkbox value="partsRequired">Parts required</Checkbox>

                <Checkbox value="followUpVisit">
                  Follow-up visit required
                </Checkbox>

                <Checkbox value="customerAction">
                  Customer action required
                </Checkbox>

                <Checkbox value="technicalSupportChina">
                  Technical / spare support required from Haitian China
                </Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>

          {/* ==================================================== */}
          {/* REQUIRED ACTION / FOLLOW-UP */}
          {/* ==================================================== */}

          <Form.Item
            label="Required Action / Follow-up"
            name="requiredActionFollowUp"
            rules={[
              {
                required: true,
                message: "Please enter required action / follow-up",
              },
            ]}
          >
            <TextArea
              rows={2}
              maxLength={300}
              showCount
              placeholder="Enter required action / follow-up"
              onChange={handleRequiredActionFollowUpChange}
              onKeyDown={handleSectionTextKeyDown}
            />{" "}
          </Form.Item>

          {/* ==================================================== */}
          {/* 10. SERVICE COMMERCIAL CLASSIFICATION */}
          {/* ==================================================== */}

          <SectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />

          <Form.Item
            name="serviceCommercialClassification"
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "Please select at least one classification",
              },
            ]}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              <div className="commercial-classification-options">
                <Checkbox value="focCommissioning">F.O.C. Commissioning</Checkbox>

                <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>

                <Checkbox value="warrantyService">Warranty Service</Checkbox>

                <Checkbox value="chargeableMaintenance">
                  Chargeable Maintenance
                </Checkbox>

                <Checkbox value="customerVisitService">
                  Customer Visit (Service)
                </Checkbox>

                <Checkbox value="serviceContract">Service Contract</Checkbox>

                <Checkbox value="goodwill">Goodwill</Checkbox>
                <Checkbox value="chargeableCommissioning">
                  Chargeable commissioning
                </Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>

          {/* ==================================================== */}
          {/* 11. CUSTOMER ACKNOWLEDGEMENT */}
          {/* ==================================================== */}

          <SectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />

          <div
            style={{
              fontSize: "16px",
            }}
          >
            I acknowledge that the above service work has been carried out and the
            machine status / further action has been explained to me.
          </div>

          <div className="row mt-2">
            {/* ================= SERVICE TECHNICIAN ================= */}

            <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
              <Form.Item
                label={
                  <span className="signature-label">
                    Signature of Service Technician
                  </span>
                }
                required
              >
                {" "}
                <Form.Item
                  label="Name"
                  name="technicianName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter technician name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <SignatureCanvas
                  ref={sigTechnician}
                  penColor="black"
                  onBegin={() => {
                    setIsTechnicianSignSaved(false);
                  }}
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: "signatureborder",
                  }}
                />
                <div className="d-flex justify-content-start gap-2 mt-3">
                  <Button
                    className="haitianbutton"
                    onClick={saveTechnicianSignature}
                  >
                    Save Signature
                  </Button>

                  <Button
                    className="dangerbutton"
                    onClick={clearTechnicianSignature}
                  >
                    Clear
                  </Button>
                </div>
                <Form.Item
                  label="Date"
                  name="technicianDate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter date",
                    },
                    {
                      pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                      message: "Enter date in DD-MM-YYYY format",
                    },
                  ]}
                  className="mt-2"
                >
                  <Input
                    placeholder="DD-MM-YYYY"
                    value={form.getFieldValue("technicianDate") || ""}
                    onChange={(e) => {
                      const formatted = formatDDMMYYYY(e.target.value);

                      form.setFieldsValue({
                        technicianDate: formatted,
                      });
                    }}
                  />
                </Form.Item>
              </Form.Item>
            </div>

            {/* ================= SERVICE MANAGER ================= */}

            <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
              <Form.Item
                label={
                  <span className="signature-label">
                    Signature of Service Manager
                  </span>
                }
                required
              >
                {" "}
                <Form.Item
                  label="Name"
                  name="managerName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter manager name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <SignatureCanvas
                  ref={sigManager}
                  penColor="black"
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: "signatureborder",
                  }}
                  onBegin={() => {
                    setIsManagerSignSaved(false);
                  }}
                />
                <div className="d-flex justify-content-start gap-2 mt-3">
                  <Button
                    className="haitianbutton"
                    onClick={saveManagerSignature}
                  >
                    Save Signature
                  </Button>

                  <Button
                    className="dangerbutton"
                    onClick={clearManagerSignature}
                  >
                    Clear
                  </Button>
                </div>
                <Form.Item
                  label="Date"
                  name="managerDate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter date",
                    },
                    {
                      pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                      message: "Enter date in DD-MM-YYYY format",
                    },
                  ]}
                  className="mt-2"
                >
                  <Input
                    placeholder="DD-MM-YYYY"
                    value={form.getFieldValue("managerDate") || ""}
                    onChange={(e) => {
                      const formatted = formatDDMMYYYY(e.target.value);

                      form.setFieldsValue({
                        managerDate: formatted,
                      });
                    }}
                  />
                </Form.Item>
              </Form.Item>
            </div>

            {/* ================= CUSTOMER ================= */}

            <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
              <Form.Item
                label={
                  <span className="signature-label">Customer Signature</span>
                }
                required
              >
                {" "}
                <Form.Item
                  label="Name"
                  name="customerName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter customer name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <SignatureCanvas
                  ref={sigCustomer}
                  penColor="black"
                  onBegin={() => {
                    setIsCustomerSignSaved(false);
                  }}
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: "signatureborder",
                  }}
                />
                <div className="d-flex justify-content-start gap-2 mt-3">
                  <Button
                    className="haitianbutton"
                    onClick={saveCustomerSignature}
                  >
                    Save Signature
                  </Button>

                  <Button
                    className="dangerbutton"
                    onClick={clearCustomerSignature}
                  >
                    Clear
                  </Button>
                </div>
                <Form.Item
                  label="Date"
                  name="customerDate"
                  rules={[
                    {
                      required: true,
                      message: "Please enter date",
                    },
                    {
                      pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                      message: "Enter date in DD-MM-YYYY format",
                    },
                  ]}
                  className="mt-2"
                >
                  <Input
                    placeholder="DD-MM-YYYY"
                    value={form.getFieldValue("customerDate") || ""}
                    onChange={(e) => {
                      const formatted = formatDDMMYYYY(e.target.value);

                      form.setFieldsValue({
                        customerDate: formatted,
                      });
                    }}
                  />
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          {/* ==================================================== */}
          {/* SAVE BUTTON */}
          {/* ==================================================== */}

          <div className="save-report-container">
            <Button
              type="primary"
              htmlType="submit"
              className="save-report-button"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </Form>

        {/* ========================================================== */}
        {/* FETCHED SERVICE REPORTS                                   */}
        {/* ========================================================== */}

        <div className="fetched-service-reports-section mt-5 pt-5">
          <div className="fetched-service-reports-card">
            <div className="fetched-service-reports-heading">
              <div className="fetched-service-reports-heading-main">
                <div className="fetched-service-reports-heading-icon">
                  <DownloadOutlined />
                </div>

                <div>
                  <div className="fetched-service-reports-title">
                    SERVICE REPORT RECORD DATA
                  </div>
                  <div className="fetched-service-reports-subtitle">
                    Latest service reports are displayed first
                  </div>
                </div>
              </div>

              <div className="fetched-service-reports-count">
                <span className="fetched-service-reports-count-label">
                  {reportTableSearch.trim() ? "MATCHING RECORDS" : "TOTAL RECORDS"}
                </span>
                <strong>{filteredAndSortedReportData.length}</strong>
              </div>
            </div>

            <div className="fetched-service-reports-toolbar">
              <div className="service-report-search-wrap">
                <SearchOutlined className="service-report-search-icon" />
                <Input
                  value={reportTableSearch}
                  onChange={(event) => setReportTableSearch(event.target.value)}
                  placeholder="Search report no., customer, technician, machine, serial no., location..."
                  allowClear
                  className="service-report-search-input"
                />
              </div>

              <div className="service-report-toolbar-actions">
                <div className="service-report-page-size">
                  <span>Rows</span>
                  <Select
                    value={reportTablePageSize}
                    onChange={setReportTablePageSize}
                    options={[
                      { value: 10, label: "10" },
                      { value: 20, label: "20" },
                      { value: 50, label: "50" },
                      { value: 100, label: "100" },
                    ]}
                  />
                </div>

                <Button
                  className="service-report-refresh-button"
                  icon={<ReloadOutlined />}
                  loading={reportTableLoading}
                  onClick={fetchServiceReports}
                >
                  Refresh
                </Button>

                {reportTableSearch && (
                  <Button
                    className="service-report-clear-button"
                    icon={<ClearOutlined />}
                    onClick={() => setReportTableSearch("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

    

            <div className="fetched-service-reports-table">
              <Table
                dataSource={filteredAndSortedReportData}
                loading={reportTableLoading}
                columns={reportTableColumns}
                rowKey={(record) =>
                  String(record["Service Report Number"] || record.rowIndex)
                }
                scroll={{ x: 3900 }}
                sticky={{ offsetHeader: 0 }}
                pagination={{
                  pageSize: reportTablePageSize,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} records`,
                  position: ["bottomCenter"],
                }}
                size="middle"
                bordered={false}
                rowClassName={(_, index) =>
                  index % 2 === 0
                    ? "service-report-table-row-even"
                    : "service-report-table-row-odd"
                }
                showSorterTooltip={{
                  target: "sorter-icon",
                }}
              />
            </div>
          </div>
        </div>

        <Modal
          className="service-report-view-modal"
          width="calc(100vw - 24px)"
          style={{
            top: 10,
            maxWidth: "1250px",
          }}
          open={editModalOpen}
          onCancel={closeEditModal}
          footer={null}
          destroyOnHidden
          maskClosable={!editSaveLoading}
          closable={!editSaveLoading}
        >
          <div
            style={{
              textAlign: "center",
              paddingBottom: "12px",
              borderBottom: "2px solid #0D3884",
              marginBottom: "18px",
            }}
          >
            <img
              src={HaitianLogo}
              alt="HaitianLogo"
              style={{
                maxWidth: "300px",
                maxHeight: "70px",
                objectFit: "contain",
              }}
            />
            <h2
              style={{
                margin: "8px 0 0",
                color: "#0D3884",
                fontWeight: 700,
              }}
            >
              EDIT SERVICE REPORT
            </h2>
            <div
              style={{
                marginTop: 8,
                display: "inline-block",
                padding: "6px 18px",
                background: "#F1F6FA",
                border: "1px solid #D9E2EA",
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              Service Report Number:{" "}
              {editForm.getFieldValue("serviceReportNumber") ||
                editReport?.["Service Report Number"] ||
                ""}
            </div>
          </div>

          <Form
            form={editForm}
            layout="vertical"
            requiredMark
            onFinish={handleEditSave}
          >
            <SectionTitle title="1. CUSTOMER & VISIT INFORMATION" />
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  label="Customer"
                  name="customer"
                  rules={requiredRule("customer")}
                >
                  <AutoComplete
                    allowClear
                    showSearch
                    placeholder="Type or select customer name"
                    options={customerOptions.map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    filterOption={(inputValue, option) =>
                      String(option?.value || "")
                        .toLowerCase()
                        .includes(String(inputValue || "").toLowerCase())
                    }
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Service Date"
                  name="serviceDate"
                  rules={[
                    { required: true, message: "Please enter service date" },
                    {
                      pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                      message: "Enter date in DD-MM-YYYY format",
                    },
                  ]}
                >
                  <Input placeholder="DD-MM-YYYY" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Site / Location"
                  name="siteLocation"
                  rules={requiredRule("site / location")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Contact Person"
                  name="contactPerson"
                  rules={requiredRule("contact person")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Contact No."
                  name="contactNo"
                  rules={contactNumberRule}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Technician"
                  name="technician"
                  rules={requiredRule("technician")}
                >
                  <Select
                    mode="multiple"
                    size="large"
                    maxTagCount="responsive"
                    optionFilterProp="label"
                    options={technicianOptions.map((technician) => ({
                      label: technician,
                      value: technician,
                    }))}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Arrival Time"
                  name="arrivalTime"
                  rules={timeRule("arrival time")}
                >
                  <Input placeholder="HH:MM" maxLength={5} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Completion Time"
                  name="completionTime"
                  rules={timeRule("completion time")}
                >
                  <Input placeholder="HH:MM" maxLength={5} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Total Working Hours"
                  name="totalWorkingHours"
                  rules={[
                    {
                      required: true,
                      message: "Please enter total working hours",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Service Visit Ref."
                  name="serviceVisitRef"
                  rules={requiredRule("service visit reference")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </div>

            <SectionTitle title="2. MACHINE INFORMATION" />
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  label="Machine Model"
                  name="machineModel"
                  rules={requiredRule("machine model")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Serial No."
                  name="serialNo"
                  rules={requiredRule("serial number")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Installation Year"
                  name="installationYear"
                  rules={requiredRule("installation year")}
                >
                  <Input size="large" placeholder="Enter installation year" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Machine Running Hours"
                  name="machineRunningHours"
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Controller"
                  name="softwareVersion"
                  rules={requiredRule("controller")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Warranty Status"
                  name="warrantyStatus"
                  rules={requiredRule("warranty status")}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </div>

            <SectionTitle title="3. SERVICE CATEGORY" />
            <Form.Item
              name="serviceCategory"
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message: "Please select at least one service category",
                },
              ]}
            >
              <Checkbox.Group style={{ width: "100%" }}>
                <div
                  className="view-checkbox-options"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="installation">
                    Installation / Commissioning
                  </Checkbox>
                  <Checkbox value="breakdown">Breakdown / Defect</Checkbox>
                  <Checkbox value="preventive">Preventive Maintenance</Checkbox>
                  <Checkbox value="corrective">Corrective Maintenance</Checkbox>
                  <Checkbox value="inspection">Inspection</Checkbox>
                  <Checkbox value="customerVisit">Customer Visit</Checkbox>
                  <Checkbox value="software">Software / Program</Checkbox>
                  <Checkbox value="other">Other</Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            <SectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />
            <Form.Item
              name="customerComplaint"
              rules={requiredRule("customer complaint / reported problem")}
            >
              <TextArea
                rows={3}
                maxLength={512}
                showCount
                onChange={(e) =>
                  handleEditSectionTextChange(
                    "customerComplaint",
                    "Customer complaint",
                    e,
                  )
                }
              />
            </Form.Item>

            <SectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />
            <Form.Item
              name="technicianDiagnosis"
              rules={requiredRule("technician diagnosis / root cause")}
            >
              <TextArea
                rows={3}
                maxLength={512}
                showCount
                onChange={(e) =>
                  handleEditSectionTextChange(
                    "technicianDiagnosis",
                    "Technician diagnosis",
                    e,
                  )
                }
              />
            </Form.Item>

            <SectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />
            <Form.Item
              name="workPerformed"
              rules={requiredRule("work performed / corrective action")}
            >
              <TextArea
                rows={3}
                maxLength={512}
                showCount
                onChange={(e) =>
                  handleEditSectionTextChange(
                    "workPerformed",
                    "Work performed",
                    e,
                  )
                }
              />
            </Form.Item>

            <SectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />
            <Form.Item
              name="machineTrialStatus"
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message:
                    "Please select at least one machine trial/final status",
                },
              ]}
            >
              <Checkbox.Group style={{ width: "100%" }}>
                <div
                  className="view-checkbox-options"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="machineTestedSuccessfully">
                    Machine tested successfully
                  </Checkbox>
                  <Checkbox value="machineRunningNormally">
                    Machine running normally
                  </Checkbox>
                  <Checkbox value="runningWithObservation">
                    Running with observation
                  </Checkbox>
                  <Checkbox value="machineStopped">
                    Machine stopped - further action required
                  </Checkbox>
                  <Checkbox value="customerAdvised">
                    Customer advised / awaiting action
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  label="Trial Duration"
                  name="trialDuration"
                  rules={requiredRule("trial duration")}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="Cycle Time"
                  name="cycleTime"
                  rules={requiredRule("cycle time")}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item
                  label="Product / Material"
                  name="productMaterial"
                  rules={requiredRule("product / material")}
                >
                  <Input
                    maxLength={100}
                    showCount
                    onChange={handleEditProductMaterialChange}
                  />
                </Form.Item>
              </div>
            </div>
            <Form.Item
              name="trialStatusRemarks"
              rules={requiredRule("trial / status remarks")}
            >
              <TextArea
                rows={2}
                maxLength={300}
                showCount
                onChange={(e) =>
                  handleEditSectionTextChange(
                    "trialStatusRemarks",
                    "Trial / Status Remarks",
                    e,
                  )
                }
                onKeyDown={handleSectionTextKeyDown}
              />
            </Form.Item>

            <SectionTitle title="8. PARTS USED / RECOMMENDED" />
            <Table
              bordered
              pagination={false}
              size="middle"
              rowKey={(record) => record.key}
              dataSource={editPartsData}
              scroll={{ x: "max-content" }}
              columns={[
                {
                  title: "Part No.",
                  dataIndex: "partNo",
                  render: (_, record) => (
                    <Input
                      value={record.partNo}
                      maxLength={22}
                      showCount
                      onChange={(e) =>
                        updateEditPart(record.key, "partNo", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  render: (_, record) => (
                    <Input
                      value={record.description}
                      maxLength={25}
                      showCount
                      onChange={(e) =>
                        updateEditPart(record.key, "description", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Qty",
                  dataIndex: "qty",
                  width: 90,
                  render: (_, record) => (
                    <Input
                      value={record.qty}
                      onChange={(e) =>
                        updateEditPart(record.key, "qty", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Used / Recommended",
                  dataIndex: "usedRecommended",
                  render: (_, record) => (
                    <Input
                      value={record.usedRecommended}
                      maxLength={25}
                      showCount
                      onChange={(e) =>
                        updateEditPart(
                          record.key,
                          "usedRecommended",
                          e.target.value,
                        )
                      }
                    />
                  ),
                },
                {
                  title: "Remarks",
                  dataIndex: "remarks",
                  render: (_, record) => (
                    <Input
                      value={record.remarks}
                      maxLength={25}
                      showCount
                      onChange={(e) =>
                        updateEditPart(record.key, "remarks", e.target.value)
                      }
                    />
                  ),
                },
                // {
                //   title: "Action",
                //   width: 100,
                //   render: (_, record) => (
                //     <Button danger onClick={() => removeEditPart(record.key)}>
                //       Remove
                //     </Button>
                //   ),
                // },
              ]}
            />
            {/* <div style={{ marginTop: 10, marginBottom: 8 }}>
              <Button type="dashed" onClick={addEditPart}>
                + Add Part
              </Button>
            </div> */}

            <SectionTitle title="9. FURTHER ACTION REQUIRED" />
            <Form.Item
              name="furtherAction"
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message: "Please select at least one further action",
                },
              ]}
            >
              <Checkbox.Group style={{ width: "100%" }}>
                <div
                  className="view-checkbox-options"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="noFurtherAction">
                    No further action required
                  </Checkbox>
                  <Checkbox value="partsRequired">Parts required</Checkbox>
                  <Checkbox value="followUpVisit">
                    Follow-up visit required
                  </Checkbox>
                  <Checkbox value="customerAction">
                    Customer action required
                  </Checkbox>
                  <Checkbox value="technicalSupportChina">
                    Technical / spare support required from Haitian China
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name="requiredActionFollowUp"
              rules={requiredRule("required action / follow-up")}
            >
              <TextArea
                rows={2}
                maxLength={300}
                showCount
                onChange={(e) =>
                  handleEditSectionTextChange(
                    "requiredActionFollowUp",
                    "Required Action / Follow-up",
                    e,
                  )
                }
                onKeyDown={handleSectionTextKeyDown}
              />
            </Form.Item>

            <SectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />
            <Form.Item
              name="serviceCommercialClassification"
              rules={[
                {
                  required: true,
                  type: "array",
                  min: 1,
                  message: "Please select at least one commercial classification",
                },
              ]}
            >
              <Checkbox.Group style={{ width: "100%" }}>
                <div
                  className="view-checkbox-options"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="focCommissioning">
                    F.O.C. Commissioning
                  </Checkbox>
                  <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>
                  <Checkbox value="warrantyService">Warranty Service</Checkbox>
                  <Checkbox value="chargeableMaintenance">
                    Chargeable Maintenance
                  </Checkbox>
                  <Checkbox value="customerVisitService">
                    Customer Visit (Service)
                  </Checkbox>
                  <Checkbox value="serviceContract">Service Contract</Checkbox>
                  <Checkbox value="goodwill">Goodwill</Checkbox>
                  <Checkbox value="chargeableCommissioning">
                    Chargeable commissioning
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            <SectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />
            <div
              style={{
                background: "#F1F6FA",
                border: "1px solid #D9E2EA",
                borderRadius: 6,
                padding: "14px 16px",
                marginBottom: 20,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              I acknowledge that the above service work has been carried out and
              the machine status / further action has been explained to me.
            </div>

            <div className="row mt-2">
              {/* ================= SERVICE TECHNICIAN ================= */}
              <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
                <Form.Item
                  label={
                    <span className="signature-label">
                      Signature of Service Technician
                    </span>
                  }
                  required
                >
                  {" "}
                  <Form.Item
                    label="Name"
                    name="technicianName"
                    rules={requiredRule("service technician name")}
                  >
                    <Input />
                  </Form.Item>
                  <SignatureCanvas
                    ref={editSigTechnician}
                    penColor="black"
                    onBegin={() => {
                      setIsEditTechnicianSignSaved(false);
                    }}
                    canvasProps={{
                      width: canvasSize.width,
                      height: canvasSize.height,
                      className: "signatureborder",
                    }}
                  />
                  <div className="d-flex justify-content-start gap-2 mt-3">
                    <Button
                      className="haitianbutton"
                      onClick={() => saveEditSignature("technician")}
                    >
                      Save Signature
                    </Button>
                    <Button
                      className="dangerbutton"
                      onClick={() => clearEditSignature("technician")}
                    >
                      Clear
                    </Button>
                  </div>
                  <Form.Item
                    label="Date"
                    name="technicianDate"
                    rules={[
                      { required: true, message: "Please enter date" },
                      {
                        pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                        message: "Enter date in DD-MM-YYYY format",
                      },
                    ]}
                    className="mt-2"
                  >
                    <Input
                      placeholder="DD-MM-YYYY"
                      onChange={(e) => {
                        editForm.setFieldsValue({
                          technicianDate: formatDDMMYYYY(e.target.value),
                        });
                      }}
                    />
                  </Form.Item>
                </Form.Item>
              </div>

              {/* ================= SERVICE MANAGER ================= */}
              <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
                <Form.Item
                  label={
                    <span className="signature-label">
                      Signature of Service Manager
                    </span>
                  }
                  required
                >
                  {" "}
                  <Form.Item
                    label="Name"
                    name="managerName"
                    rules={requiredRule("service manager name")}
                  >
                    <Input />
                  </Form.Item>
                  <SignatureCanvas
                    ref={editSigManager}
                    penColor="black"
                    onBegin={() => {
                      setIsEditManagerSignSaved(false);
                    }}
                    canvasProps={{
                      width: canvasSize.width,
                      height: canvasSize.height,
                      className: "signatureborder",
                    }}
                  />
                  <div className="d-flex justify-content-start gap-2 mt-3">
                    <Button
                      className="haitianbutton"
                      onClick={() => saveEditSignature("manager")}
                    >
                      Save Signature
                    </Button>
                    <Button
                      className="dangerbutton"
                      onClick={() => clearEditSignature("manager")}
                    >
                      Clear
                    </Button>
                  </div>
                  <Form.Item
                    label="Date"
                    name="managerDate"
                    rules={[
                      { required: true, message: "Please enter date" },
                      {
                        pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                        message: "Enter date in DD-MM-YYYY format",
                      },
                    ]}
                    className="mt-2"
                  >
                    <Input
                      placeholder="DD-MM-YYYY"
                      onChange={(e) => {
                        editForm.setFieldsValue({
                          managerDate: formatDDMMYYYY(e.target.value),
                        });
                      }}
                    />
                  </Form.Item>
                </Form.Item>
              </div>

              {/* ================= CUSTOMER ================= */}
              <div className="col-12 col-lg-6 col-xl-4 mt-2 d-flex justify-content-center">
                <Form.Item
                  label={
                    <span className="signature-label">Customer Signature</span>
                  }
                  required
                >
                  {" "}
                  <Form.Item
                    label="Name"
                    name="customerName"
                    rules={requiredRule("customer name")}
                  >
                    <Input />
                  </Form.Item>
                  <SignatureCanvas
                    ref={editSigCustomer}
                    penColor="black"
                    onBegin={() => {
                      setIsEditCustomerSignSaved(false);
                    }}
                    canvasProps={{
                      width: canvasSize.width,
                      height: canvasSize.height,
                      className: "signatureborder",
                    }}
                  />
                  <div className="d-flex justify-content-start gap-2 mt-3">
                    <Button
                      className="haitianbutton"
                      onClick={() => saveEditSignature("customer")}
                    >
                      Save Signature
                    </Button>
                    <Button
                      className="dangerbutton"
                      onClick={() => clearEditSignature("customer")}
                    >
                      Clear
                    </Button>
                  </div>
                  <Form.Item
                    label="Date"
                    name="customerDate"
                    rules={[
                      { required: true, message: "Please enter date" },
                      {
                        pattern: /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
                        message: "Enter date in DD-MM-YYYY format",
                      },
                    ]}
                    className="mt-2"
                  >
                    <Input
                      placeholder="DD-MM-YYYY"
                      onChange={(e) => {
                        editForm.setFieldsValue({
                          customerDate: formatDDMMYYYY(e.target.value),
                        });
                      }}
                    />
                  </Form.Item>
                </Form.Item>
              </div>
            </div>

            <div className="edit-form-actions">
              <Button
                className="edit-cancel-button"
                size="large"
                onClick={closeEditModal}
                disabled={editSaveLoading}
              >
                Cancel
              </Button>

              <Button
                className="edit-save-button"
                type="primary"
                size="large"
                loading={editSaveLoading}
                onClick={handleEditSave}
              >
                {editSaveLoading
                  ? "Updating & Generating PDF..."
                  : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          className="service-report-view-modal"
          width="calc(100vw - 24px)"
          style={{
            top: 10,
            maxWidth: "1250px",
          }}
          open={viewModalOpen}
          onCancel={() => {
            setViewModalOpen(false);
            setViewReport(null);
            setViewPartsData([]);
            viewForm.resetFields();
          }}
          footer={null}
          destroyOnHidden
        >
          {/* ============================================================
        HEADER
    ============================================================ */}

          <div
            style={{
              textAlign: "center",
              paddingBottom: "12px",
              borderBottom: "2px solid #0D3884",
              marginBottom: "18px",
            }}
          >
            <img
              src={HaitianLogo}
              alt="HaitianLogo"
              style={{
                maxWidth: "300px",
                maxHeight: "70px",
                objectFit: "contain",
              }}
            />

            <h2
              style={{
                color: "#0D3884",
                fontWeight: 700,
                margin: "10px 0 0",
                fontSize: "24px",
              }}
            >
              VIEW SERVICE REPORT
            </h2>

            <div
              style={{
                color: "#666",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Service Report Record
            </div>
          </div>

          <Form form={viewForm} layout="vertical">
            {/* ==========================================================
          REPORT NUMBER + DOWNLOAD PDF
      ========================================================== */}

            <div
              style={{
                background: "#F1F6FA",
                border: "1px solid #B8C8D3",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                {/* ======================================================
              SERVICE REPORT NUMBER
          ====================================================== */}

                <div
                  style={{
                    flex: 1,
                    minWidth: "250px",
                  }}
                >
                  <Form.Item
                    label={
                      <strong style={{ color: "#0D3884" }}>
                        Service Report Number
                      </strong>
                    }
                    name="serviceReportNumber"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Input
                      readOnly
                      size="large"
                      style={{
                        fontWeight: 700,
                        color: "#0D3884",
                        background: "#FFFFFF",
                      }}
                    />
                  </Form.Item>
                </div>

                {/* ======================================================
              DOWNLOAD PDF
          ====================================================== */}

                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  loading={pdfDownloadLoading}
                  onClick={downloadServiceReportPDF}
                  style={{
                    background: "#0D3884",
                    borderColor: "#0D3884",
                    fontWeight: 600,
                    minHeight: "40px",
                    flexShrink: 0,
                  }}
                >
                  {pdfDownloadLoading ? "Downloading..." : "Download PDF"}
                </Button>
              </div>
            </div>

            {/* ==========================================================
          SECTION 1
      ========================================================== */}

            <ViewSectionTitle title="1. CUSTOMER & VISIT INFORMATION" />

            <div className="row">
              <ViewField
                label="Customer"
                name="customer"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Service Date"
                name="serviceDate"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Site / Location"
                name="siteLocation"
                span="col-md-6"
                textarea
                viewForm={viewForm}
              />

              <ViewField
                label="Contact Person"
                name="contactPerson"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Contact No."
                name="contactNo"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Technician"
                name="technician"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Arrival Time"
                name="arrivalTime"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Completion Time"
                name="completionTime"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Total Working Hours"
                name="totalWorkingHours"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Service Visit Ref."
                name="serviceVisitRef"
                span="col-md-6"
                viewForm={viewForm}
              />
            </div>

            {/* ==========================================================
          SECTION 2
      ========================================================== */}

            <ViewSectionTitle title="2. MACHINE INFORMATION" />

            <div className="row">
              <ViewField
                label="Machine Model"
                name="machineModel"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Serial No."
                name="serialNo"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Installation Year"
                name="installationYear"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Machine Running Hours"
                name="machineRunningHours"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Controller"
                name="controllerSoftwareVersion"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Warranty Status"
                name="warrantyStatus"
                span="col-md-6"
                viewForm={viewForm}
              />
            </div>

            {/* ==========================================================
          SECTION 3
      ========================================================== */}

            <ViewSectionTitle title="3. SERVICE CATEGORY" />

            <Form.Item
              name="serviceCategory"
              style={{
                marginBottom: 20,
              }}
            >
              <Checkbox.Group
                className="view-checkbox-group"
                style={{
                  width: "100%",
                  pointerEvents: "none",
                }}
              >
                <div
                  className="view-checkbox-options"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="installation">
                    Installation / Commissioning
                  </Checkbox>

                  <Checkbox value="breakdown">Breakdown / Defect</Checkbox>

                  <Checkbox value="preventive">Preventive Maintenance</Checkbox>

                  <Checkbox value="corrective">Corrective Maintenance</Checkbox>

                  <Checkbox value="inspection">Inspection</Checkbox>

                  <Checkbox value="customerVisit">Customer Visit</Checkbox>

                  <Checkbox value="software">Software / Program</Checkbox>

                  <Checkbox value="other">Other</Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            {/* ==========================================================
          SECTION 4
      ========================================================== */}

            <ViewSectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

            <ViewLargeText name="customerComplaint" viewForm={viewForm} />

            {/* ==========================================================
          SECTION 5
      ========================================================== */}

            <ViewSectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

            <ViewLargeText name="diagnosis" viewForm={viewForm} />

            {/* ==========================================================
          SECTION 6
      ========================================================== */}

            <ViewSectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

            <ViewLargeText name="workPerformed" viewForm={viewForm} />

            {/* ==========================================================
          SECTION 7
      ========================================================== */}

            <ViewSectionTitle title="7. MACHINE TRIAL & FINAL STATUS" />

            <Form.Item
              name="machineTrialStatus"
              style={{
                marginBottom: 18,
              }}
            >
              <Checkbox.Group
                className="view-checkbox-group"
                style={{
                  width: "100%",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="machineTestedSuccessfully">
                    Machine tested successfully
                  </Checkbox>

                  <Checkbox value="machineRunningNormally">
                    Machine running normally
                  </Checkbox>

                  <Checkbox value="runningWithObservation">
                    Running with observation
                  </Checkbox>

                  <Checkbox value="machineStopped">
                    Machine stopped - further action required
                  </Checkbox>

                  <Checkbox value="customerAdvised">
                    Customer advised / awaiting action
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            <div className="row">
              <ViewField
                label="Trial Duration"
                name="trialDuration"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Cycle Time"
                name="cycleTime"
                span="col-md-6"
                viewForm={viewForm}
              />

              <ViewField
                label="Product / Material"
                name="productMaterial"
                span="col-md-12"
                viewForm={viewForm}
              />
            </div>

            <ViewLargeText name="trialStatusRemarks" viewForm={viewForm} />

            {/* ==========================================================
          SECTION 8
      ========================================================== */}

            <ViewSectionTitle title="8. PARTS USED / RECOMMENDED" />

            <div className="view-parts-table-responsive">
              <Table
                bordered
                pagination={false}
                size="middle"
                rowKey={(record) => record.key}
                dataSource={viewPartsData}
                columns={[
                  {
                    title: "Part No.",
                    dataIndex: "Part No.",
                    key: "Part No.",
                  },

                  {
                    title: "Description",
                    dataIndex: "Description",
                    key: "Description",
                  },

                  {
                    title: "Qty",
                    dataIndex: "Qty",
                    key: "Qty",
                  },

                  {
                    title: "Used / Recommended",
                    dataIndex: "Used / Recommended",
                    key: "Used / Recommended",
                  },

                  {
                    title: "Remarks",
                    dataIndex: "Remarks",
                    key: "Remarks",
                  },
                ]}
                locale={{
                  emptyText: "No parts recorded",
                }}
              />
            </div>

            {/* ==========================================================
          SECTION 9
      ========================================================== */}

            <ViewSectionTitle title="9. FURTHER ACTION REQUIRED" />

            <Form.Item
              name="furtherAction"
              style={{
                marginBottom: 18,
              }}
            >
              <Checkbox.Group
                className="view-checkbox-group"
                style={{
                  width: "100%",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="noFurtherAction">
                    No further action required
                  </Checkbox>

                  <Checkbox value="partsRequired">Parts required</Checkbox>

                  <Checkbox value="followUpVisit">
                    Follow-up visit required
                  </Checkbox>

                  <Checkbox value="customerAction">
                    Customer action required
                  </Checkbox>

                  <Checkbox value="technicalSupportChina">
                    Technical / spare support required from Haitian China
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            <ViewLargeText name="requiredActionFollowUp" viewForm={viewForm} />

            {/* ==========================================================
          SECTION 10
      ========================================================== */}

            <ViewSectionTitle title="10. SERVICE COMMERCIAL CLASSIFICATION" />

            <Form.Item
              name="serviceCommercialClassification"
              style={{
                marginBottom: 20,
              }}
            >
              <Checkbox.Group
                className="view-checkbox-group"
                style={{
                  width: "100%",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px 20px",
                    padding: "12px",
                    background: "#F8FAFC",
                    border: "1px solid #D9E2EA",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox value="focCommissioning">
                    F.O.C. Commissioning
                  </Checkbox>

                  <Checkbox value="focMaintenance">F.O.C. Maintenance</Checkbox>

                  <Checkbox value="warrantyService">Warranty Service</Checkbox>

                  <Checkbox value="chargeableMaintenance">
                    Chargeable Maintenance
                  </Checkbox>

                  <Checkbox value="customerVisitService">
                    Customer Visit (Service)
                  </Checkbox>

                  <Checkbox value="serviceContract">Service Contract</Checkbox>

                  <Checkbox value="goodwill">Goodwill</Checkbox>

                  <Checkbox value="chargeableCommissioning">
                    Chargeable commissioning
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>

            {/* ==========================================================
          SECTION 11
      ========================================================== */}

            <ViewSectionTitle title="11. CUSTOMER ACKNOWLEDGEMENT" />

            <div
              style={{
                background: "#F1F6FA",
                border: "1px solid #D9E2EA",
                borderRadius: "6px",
                padding: "14px 16px",
                marginBottom: "20px",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              I acknowledge that the above service work has been carried out and
              the machine status / further action has been explained to me.
            </div>

            {/* ==========================================================
          SIGNATURES
      ========================================================== */}

            <div className="row">
              {/* TECHNICIAN */}

              <ViewSignatureCard
                title="Service Technician"
                name={viewForm.getFieldValue("technicianName")}
                date={viewForm.getFieldValue("technicianDate")}
                // signature={viewReport?.["Technician Signature"]}
              />

              {/* MANAGER */}

              <ViewSignatureCard
                title="Service Manager"
                name={viewForm.getFieldValue("managerName")}
                date={viewForm.getFieldValue("managerDate")}
                // signature={viewReport?.["Manager Signature"]}
              />

              {/* CUSTOMER */}

              <ViewSignatureCard
                title="Customer"
                name={viewForm.getFieldValue("customerName")}
                date={viewForm.getFieldValue("customerDate")}
                // signature={viewReport?.["Customer Signature"]}
              />
            </div>

            {/* ==========================================================
          CLOSE
      ========================================================== */}

            <div
              style={{
                textAlign: "center",
                marginTop: "28px",
                paddingTop: "18px",
                borderTop: "1px solid #D9E2EA",
              }}
            >
              <Button
                size="large"
                className="view-close-button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewReport(null);
                  setViewPartsData([]);
                  viewForm.resetFields();
                }}
              >
                Close Report
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }

  // ============================================================
  // SECTION TITLE
  // ============================================================

  function SectionTitle({ title }) {
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: "#0d3884",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 600,
          padding: "9px 14px",
          marginTop: "20px",
          marginBottom: "16px",
          borderRadius: 0,
        }}
      >
        {title}
      </div>
    );
  }
