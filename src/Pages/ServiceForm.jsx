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
//   ExportOutlined,
//   FormOutlined,
// } from "@ant-design/icons";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "antd/dist/reset.css";
// import SignatureCanvas from "react-signature-canvas";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx-js-style";
// import { saveAs } from "file-saver";
// import HaitianLogo from "../Images/HaitianLogo.png";
// import "./../App.css";

// // ============================================================
// // RESTORE COMMERCIAL CLASSIFICATION CHECKBOXES
// // Supports canonical checkbox values and older sheet column labels.
// // Combines the saved JSON array with legacy Yes/No columns so one
// // missing/stale source cannot hide a checked option.
// // ============================================================
// const getCommercialClassification = (report) => {
//   const options = [
//     { key: "focCommissioning", labels: ["focCommissioning", "F.O.C. Commissioning"] },
//     { key: "focMaintenance", labels: ["focMaintenance", "F.O.C. Maintenance"] },
//     { key: "warrantyService", labels: ["warrantyService", "Warranty Service"] },
//     { key: "chargeableMaintenance", labels: ["chargeableMaintenance", "Chargeable Maintenance"] },
//     { key: "customerVisitService", labels: ["customerVisitService", "Customer Visit (Service)"] },
//     { key: "serviceContract", labels: ["serviceContract", "Service Contract"] },
//     { key: "goodwill", labels: ["goodwill", "Goodwill"] },
//     {
//       key: "chargeableCommissioning",
//       labels: ["chargeableCommissioning", "Chargeable commissioning", "Chargeable Commissioning"],
//     },
//   ];

//   const normalize = (value) =>
//     String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

//   const isChecked = (value) =>
//     value === true || ["yes", "true", "1", "checked"].includes(
//       String(value ?? "").trim().toLowerCase(),
//     );

//   const selected = new Set();
//   let savedValues = report?.serviceCommercialClassification;

//   if (!Array.isArray(savedValues)) {
//     if (typeof savedValues === "string") {
//       try {
//         savedValues = JSON.parse(savedValues);
//       } catch {
//         savedValues = savedValues ? [savedValues] : [];
//       }
//     } else {
//       savedValues = [];
//     }
//   }

//   if (Array.isArray(savedValues)) {
//     savedValues.forEach((savedValue) => {
//       const normalizedSavedValue = normalize(savedValue);
//       options.forEach((option) => {
//         if (option.labels.some((label) => normalize(label) === normalizedSavedValue)) {
//           selected.add(option.key);
//         }
//       });
//     });
//   }

//   // Also check individual columns returned by Apps Script / Google Sheets.
//   options.forEach((option) => {
//     if (option.labels.some((label) => isChecked(report?.[label]))) {
//       selected.add(option.key);
//     }
//   });

//   return Array.from(selected);
// };

// // ============================================================
// // RESTORE ALL MULTI-SELECT CHECKBOX GROUPS
// // Supports canonical keys, saved JSON arrays, display labels, and
// // legacy Yes/No columns returned from Google Sheets.
// // ============================================================
// const getCheckboxSelections = (report, field, options) => {
//   const normalize = (value) =>
//     String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
//   const isChecked = (value) =>
//     value === true || ["yes", "true", "1", "checked"].includes(
//       String(value ?? "").trim().toLowerCase(),
//     );
//   const selected = new Set();
//   let savedValues = report?.[field];
//   if (!Array.isArray(savedValues)) {
//     if (typeof savedValues === "string") {
//       try { savedValues = JSON.parse(savedValues); }
//       catch { savedValues = savedValues ? [savedValues] : []; }
//     } else { savedValues = []; }
//   }
//   if (Array.isArray(savedValues)) {
//     savedValues.forEach((saved) => {
//       const normalized = normalize(saved);
//       options.forEach((option) => {
//         if ([option.key, ...option.labels].some((label) => normalize(label) === normalized)) {
//           selected.add(option.key);
//         }
//       });
//     });
//   }
//   options.forEach((option) => {
//     if (option.labels.some((label) => isChecked(report?.[label]))) selected.add(option.key);
//   });
//   return Array.from(selected);
// };

// const serviceCategoryCheckboxOptions = [
//   { key: "installation", labels: ["Installation / Commissioning"] },
//   { key: "breakdown", labels: ["Breakdown / Defect"] },
//   { key: "preventive", labels: ["Preventive Maintenance"] },
//   { key: "corrective", labels: ["Corrective Maintenance"] },
//   { key: "inspection", labels: ["Inspection"] },
//   { key: "customerVisit", labels: ["Customer Visit"] },
//   { key: "software", labels: ["Software / Program"] },
//   { key: "other", labels: ["Other"] },
// ];
// const machineTrialCheckboxOptions = [
//   { key: "machineTestedSuccessfully", labels: ["Machine tested successfully"] },
//   { key: "machineRunningNormally", labels: ["Machine running normally"] },
//   { key: "runningWithObservation", labels: ["Running with observation"] },
//   { key: "machineStopped", labels: ["Machine stopped - further action required"] },
//   { key: "customerAdvised", labels: ["Customer advised / awaiting action"] },
// ];
// const furtherActionCheckboxOptions = [
//   { key: "noFurtherAction", labels: ["No further action required"] },
//   { key: "partsRequired", labels: ["Parts required"] },
//   { key: "followUpVisit", labels: ["Follow-up visit required"] },
//   { key: "customerAction", labels: ["Customer action required"] },
//   { key: "technicalSupportChina", labels: ["Technical support required from Haitian China", "Technical / spare support required from Haitian China"] },
// ];

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
//   "https://script.google.com/macros/s/AKfycbxPtFQDfu04zysazJwP5F5jiessPEZb0XaE8UYYLJ2LrVLRYXcxxOcpPW5Z4ccDABk1tA/exec";

// // ============================================================
// // CENTRAL GOOGLE APPS SCRIPT REQUEST HELPER
// // ============================================================
// // GET requests may be retried because they are read-only.
// // POST requests are NOT retried by default because save/update/PDF
// // operations are not safe to repeat blindly after a lost response.
// // A 404 is treated as a deployment/configuration problem and is
// // never retried.
// // ============================================================
// const gasRequest = async ({
//   action,
//   method = "GET",
//   data = {},
//   retries = method === "GET" ? 0 : 0,
//   timeoutMs = method === "GET" ? 20000 : 60000,
// }) => {
//   let lastError = null;

//   for (let attempt = 0; attempt <= retries; attempt += 1) {
//     const controller = new AbortController();
//     const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

//     try {
//       let response;

//       if (method === "GET") {
//         const params = new URLSearchParams();
//         params.append("action", action);
//         Object.entries(data || {}).forEach(([key, value]) => {
//           if (value !== undefined && value !== null)
//             params.append(key, String(value));
//         });

//         response = await fetch(`${GAS_URL}?${params.toString()}`, {
//           method: "GET",
//           cache: "no-store",
//           signal: controller.signal,
//         });
//       } else {
//         const formData = new URLSearchParams();
//         formData.append("action", action);
//         Object.entries(data || {}).forEach(([key, value]) => {
//           formData.append(key, value == null ? "" : String(value));
//         });

//         response = await fetch(GAS_URL, {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: formData.toString(),
//           signal: controller.signal,
//         });
//       }

//       if (response.status === 404) {
//         const error = new Error(
//           `Google Apps Script Web App returned HTTP 404. The /exec deployment URL is invalid, deleted, restricted, or this frontend is using an old deployment.\n\nCurrent URL:\n${GAS_URL}`,
//         );
//         error.code = "GAS_DEPLOYMENT_404";
//         error.retryable = false;
//         throw error;
//       }

//       if (!response.ok) {
//         const error = new Error(`Server returned HTTP ${response.status}`);
//         error.retryable = response.status === 429 || response.status >= 500;
//         throw error;
//       }

//       const rawText = await response.text();
//       let result;
//       try {
//         result = JSON.parse(rawText);
//       } catch {
//         throw new Error("Google Apps Script returned invalid JSON.");
//       }

//       if (!result || typeof result !== "object") {
//         throw new Error("Server returned an invalid response.");
//       }

//       if (!result.success) {
//         const error = new Error(result.message || "Server request failed.");
//         error.retryable = false;
//         throw error;
//       }

//       return result;
//     } catch (error) {
//       if (error?.name === "AbortError") {
//         lastError = new Error(
//           `Google Apps Script request timed out after ${Math.round(timeoutMs / 1000)} seconds (${action}).`,
//         );
//         lastError.retryable = true;
//       } else {
//         lastError = error;
//       }

//       const shouldRetry = attempt < retries && lastError?.retryable !== false;
//       if (!shouldRetry) break;

//       await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
//     } finally {
//       window.clearTimeout(timeoutId);
//     }
//   }

//   throw lastError || new Error("Server request failed.");
// };

// // ============================================================
// // PDF GENERATION - V2
// // Fixed 2-page A4 layout based on the supplied Haitian reference.
// // ============================================================

// const PDF_BLUE = "#0D3884";
// const PDF_LIGHT_BLUE = "#DCEAF5";
// const PDF_PALE_BLUE = "#F1F6FA";
// const PDF_BORDER = "#B8C8D3";
// const PDF_TEXT = "#111111";

// const pdfSafe = (value) => {
//   if (value === null || value === undefined) return "";
//   if (Array.isArray(value)) return value.join(", ");
//   return String(value);
// };

// // ============================================================
// // SAVE GENERATED PDF LOCALLY
// // ============================================================
// // jsPDF's doc.save() triggers the browser download. It is kept
// // as a separate helper so BOTH new-report and edit-report flows
// // use exactly the same local-save logic.
// // IMPORTANT: this must run BEFORE the Drive upload.
// // ============================================================
// const savePdfLocally = async (pdfResult) => {
//   if (!pdfResult?.doc) {
//     throw new Error("Generated PDF document is missing.");
//   }

//   const fileName = String(pdfResult.fileName || "").trim();

//   if (!fileName) {
//     throw new Error("Generated PDF file name is missing.");
//   }

//   // Make sure the PDF document actually contains pages before saving.
//   const pageCount = Number(pdfResult.doc.getNumberOfPages?.() || 0);

//   if (pageCount < 1) {
//     throw new Error("Generated PDF contains no pages.");
//   }

//   try {
//     // This triggers the browser's normal Save/Download behavior.
//     pdfResult.doc.save(fileName);

//     // No artificial delay here. The browser starts the download
//     // immediately and the Drive upload can begin without waiting.
//     console.log("PDF saved locally:", fileName);

//     return fileName;
//   } catch (error) {
//     throw new Error(
//       `Unable to save PDF locally: ${error?.message || "Unknown browser download error"}`,
//     );
//   }
// };

// // ============================================================
// // VERIFY PDF IN GOOGLE DRIVE AFTER A LOST UPLOAD RESPONSE
// // ============================================================
// const verifyUploadedPdfInDrive = async (pdfResult, serviceReportNumber) => {
//   const reportNumber = String(
//     pdfResult?.reportNumber || serviceReportNumber || "",
//   ).trim();
//   const fileName = String(pdfResult?.fileName || "").trim();

//   if (!reportNumber && !fileName) return null;

//   try {
//     const verification = await gasRequest({
//       action: "verifyPdf",
//       method: "GET",
//       data: {
//         ...(reportNumber ? { serviceReportNumber: reportNumber } : {}),
//         ...(fileName ? { fileName } : {}),
//       },
//       retries: 1,
//     });

//     if (!verification?.success || !verification?.fileId) {
//       return null;
//     }

//     return {
//       success: true,
//       fileId: verification.fileId,
//       fileName: verification.fileName || fileName,
//       fileUrl: verification.fileUrl || "",
//       fileSize: Number(verification.fileSize || 0),
//       verifiedAfterLostUploadResponse: true,
//       message: "PDF upload completed and was verified in Google Drive.",
//     };
//   } catch (verificationError) {
//     console.warn("Google Drive PDF verification failed:", verificationError);
//     return null;
//   }
// };

// // ============================================================
// // RELIABLE PDF UPLOAD
// // ============================================================
// // PDF upload is recovered on any transport failure. We verify Drive
// // before retrying so a lost response is never shown as a false failure.
// // The backend upload is idempotent by exact filename.
// // ============================================================
// const uploadPdfWithRecovery = async (pdfResult, serviceReportNumber) => {
//   const reportNumber = String(
//     pdfResult?.reportNumber || serviceReportNumber || "",
//   ).trim();

//   const uploadData = {
//     fileName: pdfResult.fileName,
//     pdfBase64: pdfResult.pdfBase64,
//     serviceReportNumber: reportNumber,
//     replaceExisting: "false",
//   };

//   let firstError = null;

//   try {
//     const result = await gasRequest({
//       action: "uploadPdf",
//       method: "POST",
//       data: uploadData,
//       retries: 0,
//       timeoutMs: 120000,
//     });

//     if (result?.success === true && result?.fileId) return result;
//     firstError = new Error(
//       result?.message || "Google Drive did not confirm the PDF upload.",
//     );
//   } catch (error) {
//     firstError = error;
//   }

//   // The request may have timed out AFTER Drive created the file.
//   const verified = await verifyUploadedPdfInDrive(pdfResult, reportNumber);
//   if (verified?.success && verified?.fileId) return verified;

//   // Retry once only when verification says the file does not exist.
//   try {
//     const retryResult = await gasRequest({
//       action: "uploadPdf",
//       method: "POST",
//       data: uploadData,
//       retries: 0,
//       timeoutMs: 120000,
//     });

//     if (retryResult?.success === true && retryResult?.fileId) {
//       return retryResult;
//     }

//     throw new Error(
//       retryResult?.message || "Retry upload was not confirmed by Google Drive.",
//     );
//   } catch (retryError) {
//     // Final verification covers a response lost after the retry.
//     const finalVerification = await verifyUploadedPdfInDrive(
//       pdfResult,
//       reportNumber,
//     );

//     if (finalVerification?.success && finalVerification?.fileId) {
//       return finalVerification;
//     }

//     throw new Error(
//       `PDF upload could not be confirmed. ${
//         retryError?.message || firstError?.message || "Unknown upload error"
//       }`,
//     );
//   }
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

//     columnStyles: {
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

//     columnStyles: {
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
//             style={{
//               fontSize: "12px",
//               color: "#666",
//               marginBottom: "5px",
//             }}
//           >
//             Signature / Stamp
//           </div>

//           <div
//             style={{
//               height: "130px",
//               border: "1px solid #D9E2EA",
//               borderRadius: "4px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: "#FFFFFF",
//             }}
//           >
//             {signature ? (
//               <img
//                 src={signature}
//                 alt={`${title} signature`}
//                 style={{
//                   maxWidth: "95%",
//                   maxHeight: "120px",
//                   objectFit: "contain",
//                 }}
//               />
//             ) : (
//               <span
//                 style={{
//                   color: "#999",
//                   fontSize: "13px",
//                 }}
//               >
//                 No signature available
//               </span>
//             )}
//           </div> */}
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
//       limitedValue = value.slice(0, 22);
//     } else if (field === "description") {
//       limitedValue = value.slice(0, 30);
//     } else if (field === "usedRecommended" || field === "remarks") {
//       limitedValue = value.slice(0, 30);
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
//   const [reportTableSearchLoading, setReportTableSearchLoading] = useState(false);
//   // Controls the refresh button label so search and manual refresh are distinct.
//   const [reportTableLoadingMode, setReportTableLoadingMode] = useState("idle");
//   const [reportExcelExportLoading, setReportExcelExportLoading] =
//     useState(false);

//   // ============================================================
//   // SERVICE REPORT TABLE UI STATE
//   // ============================================================
//   const [reportTableSearch, setReportTableSearch] = useState("");
//   const [
//     reportTableServiceReportNumberSearch,
//     setReportTableServiceReportNumberSearch,
//   ] = useState("");
//   const [reportTablePageSize, setReportTablePageSize] = useState(10);
//   const [reportTableCurrentPage, setReportTableCurrentPage] = useState(1);
//   const [reportTableTotal, setReportTableTotal] = useState(0);
//   const reportSearchTimerRef = useRef(null);

//   // Prevent an older/slower pagination response from overwriting a newer
//   // page requested by the user.
//   const reportTableRequestSequenceRef = useRef(0);

//   // ------------------------------------------------------------
//   // REPORT PAGE CACHE / PREFETCH
//   // ------------------------------------------------------------
//   // Keeps already fetched report pages in memory and preloads the
//   // next page in the background. This prevents the user from waiting
//   // for a new Google Apps Script request every time pagination changes.
//   // Cache entries expire quickly so report data does not remain stale.
//   const reportPageCacheRef = useRef(new Map());
//   const reportPageRequestRef = useRef(new Map());

//   // Session-lifetime page cache.
//   // Pages stay cached while this ServiceForm is open and are invalidated
//   // explicitly after save/edit or by the Refresh button.
//   //
//   // IMPORTANT:
//   // Do NOT use a short TTL here. A 30-second TTL caused already-loaded
//   // pages to be fetched from Google Apps Script again after some time.
//   const getReportPageCacheKey = (
//     page,
//     pageSize,
//     search,
//     serviceReportNumberSearch,
//   ) =>
//     `${Number(page) || 1}|${Number(pageSize) || 10}|${String(search || "")
//       .trim()
//       .toLowerCase()}|${String(serviceReportNumberSearch || "")
//       .trim()
//       .toLowerCase()}`;

//   const hasCachedReportPage = (
//     page,
//     pageSize,
//     search,
//     serviceReportNumberSearch,
//   ) => {
//     const cacheKey = getReportPageCacheKey(
//       page,
//       pageSize,
//       search,
//       serviceReportNumberSearch,
//     );
//     return reportPageCacheRef.current.has(cacheKey);
//   };

//   // Explicit invalidation is used after data mutations or manual refresh.
//   // This is safer than time-based expiry because cache freshness is tied
//   // to actual application changes rather than an arbitrary number of seconds.
//   const clearReportPageCache = () => {
//     reportPageCacheRef.current.clear();
//   };

//   const [viewReport, setViewReport] = useState(null);
//   const [editReport, setEditReport] = useState(null);
//   const [viewPartsData, setViewPartsData] = useState([]);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   // Track the Service Report Number currently downloading.
//   // This prevents the PDF loading state from leaking between View records.
//   const [pdfDownloadLoadingReportNumber, setPdfDownloadLoadingReportNumber] =
//     useState("");
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

//   const applyCustomerCache = (rows) => {
//     const sourceRows = Array.isArray(rows) ? rows : [];
//     const normalizedData = sourceRows
//       .map((item) => {
//         const name = String(
//           item?.["Customer"] || item?.["Customer Name"] || "",
//         ).trim();
//         const addressValue = String(
//           item?.["Site / Location"] || item?.["Address"] || "",
//         ).trim();
//         const contactValue = String(
//           item?.["Contact Person"] || item?.["Contact"] || "",
//         ).trim();
//         const telephoneValue = String(
//           item?.["Contact No."] || item?.["Telephone"] || "",
//         ).trim();
//         const machineValue = String(
//           item?.["Machine Model"] || item?.["Machine Type"] || "",
//         ).trim();
//         const serialValue = String(
//           item?.["Serial No."] || item?.["Serial Number"] || "",
//         ).trim();
//         const installationValue = String(
//           item?.["Installation year"] || item?.["Installation Date"] || "",
//         ).trim();

//         return {
//           ...item,
//           Customer: name,
//           "Customer Name": name,
//           "Site / Location": addressValue,
//           Address: addressValue,
//           "Contact Person": contactValue,
//           Contact: contactValue,
//           "Contact No.": telephoneValue,
//           Telephone: telephoneValue,
//           "Machine Model": machineValue,
//           "Machine Type": machineValue,
//           "Serial No.": serialValue,
//           "Serial Number": serialValue,
//           "Installation year": installationValue,
//           "Installation Date": installationValue,
//         };
//       })
//       .filter((item) => item.Customer !== "");

//     // Keep the newest report for each customer. Report rows are in
//     // sheet order, so walking backwards preserves the latest data.
//     const seen = new Map();
//     for (let i = normalizedData.length - 1; i >= 0; i -= 1) {
//       const item = normalizedData[i];
//       const key = item.Customer.toLowerCase();
//       if (!seen.has(key)) seen.set(key, item);
//     }

//     const uniqueSorted = Array.from(seen.values()).sort((a, b) =>
//       a.Customer.localeCompare(b.Customer),
//     );

//     setCustomerDataList(uniqueSorted);
//     setCustomerOptions(uniqueSorted.map((item) => item.Customer));
//   };

//   // ============================================================
//   // FAST SERVER-SIDE REPORT LOADING
//   // ============================================================
//   // The old implementation downloaded every report into the browser
//   // before Ant Design could render page 1. The backend now returns only
//   // the requested page and a total count.
//   // ============================================================

//   // Request one report page from Google Apps Script.
//   // The promise is shared when the same page is requested more than once
//   // while the first request is still running.
//   const requestReportPage = async ({
//     page,
//     pageSize,
//     search,
//     serviceReportNumberSearch,
//     forceFresh = false,
//   }) => {
//     const normalizedPage = Math.max(1, Number(page) || 1);
//     const normalizedPageSize = Math.max(1, Number(pageSize) || 10);
//     const normalizedSearch = String(search || "").trim();
//     const normalizedServiceReportNumberSearch = String(
//       serviceReportNumberSearch || "",
//     ).trim();
//     const cacheKey = getReportPageCacheKey(
//       normalizedPage,
//       normalizedPageSize,
//       normalizedSearch,
//       normalizedServiceReportNumberSearch,
//     );

//     // A cached page is valid until the application explicitly invalidates it.
//     // This makes repeated navigation between pages instant.
//     const cached = !forceFresh ? reportPageCacheRef.current.get(cacheKey) : null;
//     if (cached) {
//       return cached.data;
//     }

//     const existingRequest = !forceFresh
//       ? reportPageRequestRef.current.get(cacheKey)
//       : null;
//     if (existingRequest) {
//       return existingRequest;
//     }

//     const requestPromise = gasRequest({
//       action: "getServiceReportsPage",
//       method: "GET",
//       data: {
//         page: normalizedPage,
//         pageSize: normalizedPageSize,
//         search: normalizedSearch,
//         serviceReportNumber: normalizedServiceReportNumberSearch,
//         userEmail: String(user?.email || "").trim(),
//         access: String(user?.access || "").trim(),
//       },
//       retries: 0,
//     })
//       .then((result) => {
//         const data = {
//           reports: Array.isArray(result.reports) ? result.reports : [],
//           total: Number(result.total || 0),
//           page: Number(result.page || normalizedPage),
//         };

//         reportPageCacheRef.current.set(cacheKey, {
//           timestamp: Date.now(),
//           data,
//         });

//         return data;
//       })
//       .finally(() => {
//         // Do not let an older request remove a newer request for the same key.
//         if (reportPageRequestRef.current.get(cacheKey) === requestPromise) {
//           reportPageRequestRef.current.delete(cacheKey);
//         }
//       });

//     // Forced refreshes bypass both cache and request deduplication.
//     if (!forceFresh) {
//       reportPageRequestRef.current.set(cacheKey, requestPromise);
//     }
//     return requestPromise;
//   };

//   // Preload the next page without showing the table loading spinner.
//   // This runs in the background and does not block the current page.
//   const prefetchReportPage = ({
//     page,
//     pageSize,
//     search,
//     serviceReportNumberSearch,
//   }) => {
//     const normalizedPage = Math.max(1, Number(page) || 1);
//     const normalizedPageSize = Math.max(1, Number(pageSize) || 10);
//     const normalizedSearch = String(search || "").trim();
//     const normalizedServiceReportNumberSearch = String(
//       serviceReportNumberSearch || "",
//     ).trim();
//     const cacheKey = getReportPageCacheKey(
//       normalizedPage,
//       normalizedPageSize,
//       normalizedSearch,
//       normalizedServiceReportNumberSearch,
//     );

//     // Do not prefetch a page that is already cached or currently loading.
//     if (reportPageCacheRef.current.has(cacheKey)) {
//       return;
//     }

//     if (reportPageRequestRef.current.has(cacheKey)) {
//       return;
//     }

//     requestReportPage({
//       page: normalizedPage,
//       pageSize: normalizedPageSize,
//       search: normalizedSearch,
//       serviceReportNumberSearch: normalizedServiceReportNumberSearch,
//     }).catch((error) => {
//       // Prefetch is an optimization only. Never show an error notification
//       // when a background prefetch fails; normal pagination will retry it.
//       console.debug("Report page prefetch skipped:", error);
//     });
//   };

//   const fetchServiceReports = async ({
//     page = reportTableCurrentPage,
//     pageSize = reportTablePageSize,
//     search = reportTableSearch,
//     serviceReportNumberSearch = reportTableServiceReportNumberSearch,
//     showError = true,
//     useCache = true,
//     prefetchNext = true,
//     silent = false,
//     loadingMode,
//   } = {}) => {
//     const normalizedPage = Math.max(1, Number(page) || 1);
//     const normalizedPageSize = Math.max(1, Number(pageSize) || 10);
//     const normalizedSearch = String(search || "").trim();
//     const normalizedServiceReportNumberSearch = String(
//       serviceReportNumberSearch || "",
//     ).trim();

//     const requestLoadingMode = loadingMode || "load";
//     // Only explicit search actions should show Searching...; page navigation
//     // must not make the Refresh button look like it is refreshing.
//     setReportTableLoadingMode(requestLoadingMode);
//     setReportTableSearchLoading(requestLoadingMode === "search");

//     const cacheKey = getReportPageCacheKey(
//       normalizedPage,
//       normalizedPageSize,
//       normalizedSearch,
//       normalizedServiceReportNumberSearch,
//     );

//     // Every user-initiated page request gets a sequence number.
//     // If the user clicks Page 2 and immediately clicks Page 3, a slower
//     // Page 2 response can no longer overwrite the newer Page 3 result.
//     reportTableRequestSequenceRef.current += 1;
//     const requestSequence = reportTableRequestSequenceRef.current;

//     const pageAlreadyCached =
//       useCache &&
//       hasCachedReportPage(
//         normalizedPage,
//         normalizedPageSize,
//         normalizedSearch,
//         normalizedServiceReportNumberSearch,
//       );

//     // Cached pages render without a loading spinner.
//     // A silent refresh is used after a new record is saved so the table can
//     // refresh in the background while PDF generation/upload continues.
//     if (!pageAlreadyCached && !silent) {
//       setReportTableLoading(true);
//     }

//     try {
//       let pageData;

//       if (useCache) {
//         pageData = await requestReportPage({
//           page: normalizedPage,
//           pageSize: normalizedPageSize,
//           search: normalizedSearch,
//           serviceReportNumberSearch: normalizedServiceReportNumberSearch,
//         });
//       } else {
//         // Refresh must always fetch fresh data.
//         reportPageCacheRef.current.delete(cacheKey);

//         pageData = await requestReportPage({
//           page: normalizedPage,
//           pageSize: normalizedPageSize,
//           search: normalizedSearch,
//           serviceReportNumberSearch: normalizedServiceReportNumberSearch,
//           forceFresh: true,
//         });
//       }

//       // Ignore an older response if the user has already requested another
//       // page. This prevents pagination race conditions.
//       if (requestSequence !== reportTableRequestSequenceRef.current) {
//         return Array.isArray(pageData?.reports) ? pageData.reports : [];
//       }

//       const reports = Array.isArray(pageData.reports) ? pageData.reports : [];

//       setReportData(reports);
//       setReportTableTotal(Number(pageData.total || 0));
//       setReportTableCurrentPage(Number(pageData.page || normalizedPage));

//       // Once the current page is available, silently prepare the next page.
//       if (prefetchNext && reports.length > 0) {
//         const nextPage = normalizedPage + 1;
//         const total = Number(pageData.total || 0);

//         if (nextPage <= Math.ceil(total / normalizedPageSize)) {
//           // Let React paint the current page before the background request.
//           window.setTimeout(() => {
//             prefetchReportPage({
//               page: nextPage,
//               pageSize: normalizedPageSize,
//               search: normalizedSearch,
//               serviceReportNumberSearch: normalizedServiceReportNumberSearch,
//             });
//           }, 150);
//         }
//       }

//       return reports;
//     } catch (error) {
//       // If this response is no longer the latest request, do not replace
//       // the current page with an error state from an older request.
//       if (requestSequence !== reportTableRequestSequenceRef.current) {
//         return [];
//       }

//       console.error("Failed to fetch service reports:", error);

//       if (showError) {
//         notification.error({
//           message: "Error",
//           description: error.message || "Failed to load service reports.",
//           placement: "bottomRight",
//         });
//       }

//       setReportData([]);
//       setReportTableTotal(0);
//       return [];
//     } finally {
//       // Only the latest non-silent request is allowed to turn loading off.
//       if (
//         requestSequence === reportTableRequestSequenceRef.current
//       ) {
//         setReportTableSearchLoading(false);
//         setReportTableLoadingMode("idle");
//         if (!silent) setReportTableLoading(false);
//       }
//     }
//   };

//   const loadInitialData = async () => {
//     // Startup order:
//     // 1) Load the next SRN first.
//     // 2) After the SRN request settles, start customer data immediately.
//     // 3) Start the report table independently; it must never gate customers.
//     setSrnLoading(true);
//     setReportTableLoading(false);
//     setReportTableSearchLoading(false);

//     try {
//       const srnResult = await gasRequest({
//         action: "getNextServiceReportNumber",
//         method: "GET",
//         retries: 0,
//         timeoutMs: 20000,
//       });

//       const nextSRN = srnResult.serviceReportNumber ?? srnResult.srn ?? "";
//       if (String(nextSRN).trim() === "") {
//         throw new Error("The backend did not return the next Service Report Number.");
//       }
//       setServiceReportNumber(String(nextSRN));
//     } catch (error) {
//       console.error("Next service report number failed to load:", error);
//       setServiceReportNumber("");
//       notification.error({
//         message: "Service Report Number Error",
//         description:
//           error.message || "Unable to load the next Service Report Number.",
//         placement: "bottomRight",
//         duration: 8,
//       });
//     } finally {
//       setSrnLoading(false);
//     }

//     // Start customer loading immediately after the SRN request settles.
//     // Do not await this promise: customer data and the table can load at the
//     // same time, and a slow/failing table request cannot block customer data.
//     const customerLoadPromise = gasRequest({
//       action: "getAllCustomerData",
//       method: "GET",
//       retries: 1,
//       timeoutMs: 30000,
//     })
//       .then((result) => {
//         const customers = Array.isArray(result?.customers)
//           ? result.customers
//           : [];
//         applyCustomerCache(customers);
//         return customers;
//       })
//       .catch((error) => {
//         console.error("Customer suggestions failed to load:", error);
//         // Keep the rest of the page usable if customer suggestions fail.
//         return [];
//       });

//     // Load report-table page 1 independently of the customer request.
//     setReportTableLoading(true);
//     try {
//       const firstPage = await requestReportPage({
//         page: 1,
//         pageSize: reportTablePageSize,
//         search: "",
//         serviceReportNumberSearch: "",
//       });

//       const reports = Array.isArray(firstPage.reports) ? firstPage.reports : [];
//       const total = Number(firstPage.total || 0);
//       setReportData(reports);
//       setReportTableTotal(total);
//       setReportTableCurrentPage(1);

//       const initialPageData = { reports, total, page: 1 };
//       reportPageCacheRef.current.set(
//         getReportPageCacheKey(1, reportTablePageSize, "", ""),
//         { timestamp: Date.now(), data: initialPageData },
//       );

//       if (reports.length > 0 && total > reportTablePageSize) {
//         window.setTimeout(() => {
//           prefetchReportPage({
//             page: 2,
//             pageSize: reportTablePageSize,
//             search: "",
//             serviceReportNumberSearch: "",
//           });
//         }, 150);
//       }
//     } catch (error) {
//       console.error("Initial service report page load failed:", error);
//       notification.error({
//         message: "Service Report Table Error",
//         description:
//           error.message || "Unable to load service reports. Please try again.",
//         placement: "bottomRight",
//         duration: 8,
//       });
//       setReportData([]);
//       setReportTableTotal(0);
//     } finally {
//       setReportTableLoading(false);
//     }

//     // The promise has its own catch above. Intentionally do not await it so
//     // table completion does not control customer loading or customer autofill.
//     void customerLoadPromise;
//   };

//   useEffect(() => {
//     loadInitialData();

//     return () => {
//       if (reportSearchTimerRef.current) {
//         clearTimeout(reportSearchTimerRef.current);
//       }

//       // Invalidate any in-flight response before clearing the maps.
//       reportTableRequestSequenceRef.current += 1;
//       clearReportPageCache();
//       reportPageRequestRef.current.clear();
//     };
//     // User is established before ServiceForm is mounted in the existing app.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const scheduleReportTableSearch = ({ search, serviceReportNumberSearch }) => {
//     if (reportSearchTimerRef.current) {
//       clearTimeout(reportSearchTimerRef.current);
//     }

//     // Invalidate an older in-flight response immediately when the user changes
//     // the search, not only after the debounce delay.
//     reportTableRequestSequenceRef.current += 1;
//     setReportTableSearchLoading(true);
//     setReportTableLoadingMode("search");

//     reportSearchTimerRef.current = setTimeout(() => {
//       fetchServiceReports({
//         page: 1,
//         pageSize: reportTablePageSize,
//         search: String(search || ""),
//         serviceReportNumberSearch: String(serviceReportNumberSearch || ""),
//         showError: false,
//         loadingMode: "search",
//       });
//     }, 350);
//   };

//   const handleReportSearchChange = (value) => {
//     const nextSearch = String(value || "");
//     setReportTableSearch(nextSearch);
//     scheduleReportTableSearch({
//       search: nextSearch,
//       serviceReportNumberSearch: reportTableServiceReportNumberSearch,
//     });
//   };

//   const handleServiceReportNumberSearchChange = (value) => {
//     const nextSearch = String(value || "").trim();
//     setReportTableServiceReportNumberSearch(nextSearch);
//     scheduleReportTableSearch({
//       search: reportTableSearch,
//       serviceReportNumberSearch: nextSearch,
//     });
//   };

//   const downloadServiceReportPDFByNumber = async (
//     reportNumber,
//     fileName = "",
//   ) => {
//     const normalizedReportNumber = String(reportNumber || "").trim();

//     if (!normalizedReportNumber) {
//       throw new Error("Service Report Number is missing.");
//     }

//     // If the caller already knows the exact PDF filename, send it.
//     // This is used by the edit flow and prevents filename mismatches.
//     const normalizedFileName = String(fileName || "").trim();

//     const result = await gasRequest({
//       action: "downloadPdf",
//       method: "POST",
//       data: {
//         serviceReportNumber: normalizedReportNumber,
//         ...(normalizedFileName ? { fileName: normalizedFileName } : {}),
//       },
//       retries: 0,
//     });

//     if (!result.pdfBase64) {
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

//     // IMPORTANT:
//     // Store the exact SRN being downloaded. This prevents the loading
//     // state from leaking into another record when the user opens it.
//     setPdfDownloadLoadingReportNumber(reportNumber);

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
//       // Only clear the state if this same report is still marked as
//       // downloading. If the user already opened another record, do not
//       // disturb that record's state.
//       setPdfDownloadLoadingReportNumber((current) =>
//         current === reportNumber ? "" : current,
//       );
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

//     const serviceCategory = getCheckboxSelections(viewReport, "serviceCategory", serviceCategoryCheckboxOptions);

//     const machineTrialStatus = getCheckboxSelections(viewReport, "machineTrialStatus", machineTrialCheckboxOptions);

//     const furtherAction = getCheckboxSelections(viewReport, "furtherAction", furtherActionCheckboxOptions);

//     const serviceCommercialClassification =
//       getCommercialClassification(viewReport);

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

//     const serviceCategory = getCheckboxSelections(editReport, "serviceCategory", serviceCategoryCheckboxOptions);

//     const machineTrialStatus = getCheckboxSelections(editReport, "machineTrialStatus", machineTrialCheckboxOptions);

//     const furtherAction = getCheckboxSelections(editReport, "furtherAction", furtherActionCheckboxOptions);

//     const commercial = getCommercialClassification(editReport);

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
//   // Part No. = 22, Description = 30, Used / Recommended = 30, Remarks = 30
//   // ============================================================
//   const updateEditPart = (key, field, value) => {
//     let limitedValue = typeof value === "string" ? value : "";

//     if (field === "partNo") {
//       limitedValue = limitedValue.slice(0, 22);
//     } else if (field === "description") {
//       limitedValue = limitedValue.slice(0, 30);
//     } else if (field === "usedRecommended" || field === "remarks") {
//       limitedValue = limitedValue.slice(0, 30);
//     }

//     setEditPartsData((current) =>
//       current.map((part) =>
//         part.key === key ? { ...part, [field]: limitedValue } : part,
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
//     // Send the SRN so Apps Script can replace any previous PDF
//     // belonging to this same service report, even if the customer
//     // name changed during the edit.

//     try {
//       return await gasRequest({
//         action: "uploadPdf",
//         method: "POST",
//         data: {
//           fileName: pdfResult.fileName,
//           pdfBase64: pdfResult.pdfBase64,
//           replaceExisting: "true",
//           serviceReportNumber: String(pdfResult.reportNumber || ""),
//         },
//         retries: 0,
//       });
//     } catch (uploadError) {
//       const uploadMessage = String(uploadError?.message || "");
//       const lostResponse =
//         uploadMessage.includes("HTTP 404") ||
//         uploadMessage.includes("production deployment is unavailable") ||
//         uploadMessage.includes("Server returned HTTP 404");

//       if (lostResponse) {
//         const verified = await verifyUploadedPdfInDrive(
//           pdfResult,
//           pdfResult.reportNumber,
//         );
//         if (verified) return verified;
//       }

//       throw uploadError;
//     }
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

//       const result = await gasRequest({
//         action: "updateReport",
//         method: "POST",
//         data: payload,
//         retries: 0,
//       });

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

//       // ======================================================
//       // STEP 1 — SAVE EDITED PDF LOCALLY FIRST
//       // ======================================================

//       await savePdfLocally(pdfResult);

//       // ======================================================
//       // STEP 2 — UPLOAD THE SAME PDF TO GOOGLE DRIVE
//       // ======================================================

//       const editPdfUploadResult = await uploadEditedServiceReportPDF(pdfResult);

//       if (
//         !editPdfUploadResult ||
//         editPdfUploadResult.success !== true ||
//         !editPdfUploadResult.fileId
//       ) {
//         throw new Error(
//           editPdfUploadResult?.message ||
//             "PDF was saved locally, but Google Drive did not confirm the updated PDF upload.",
//         );
//       }

//       notification.success({
//         message: "Report Updated",
//         description: `Service Report ${reportNumber} was updated and its PDF was regenerated successfully.`,
//         placement: "bottomRight",
//       });

//       // Update the report table locally. No full report/customer fetch
//       // is needed after an edit because the backend returns the updated
//       // report object.
//       const updatedReport = result.report || {
//         ...(editReport || {}),
//         "Service Report Number": String(reportNumber),
//         Customer: values.customer || "",
//         "Site / Location": values.siteLocation || "",
//         "Contact Person": values.contactPerson || "",
//         "Contact No.": values.contactNo || "",
//         "Machine Model": values.machineModel || "",
//         "Serial No.": values.serialNo || "",
//         "Installation year": values.installationYear || "",
//       };

//       // The edited record may belong to a prefetched page. Invalidate the
//       // report-page cache before updating the visible page locally.
//       clearReportPageCache();

//       setReportData((previous) => {
//         const next = previous.map((item) =>
//           String(item?.["Service Report Number"] || "").trim() ===
//           String(reportNumber).trim()
//             ? updatedReport
//             : item,
//         );
//         applyCustomerCache(next);
//         return next;
//       });

//       closeEditModal(true);
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
//     String(user?.access || "")
//       .trim()
//       .toLowerCase() === "admin" || loggedInUserEmail === "admin@haitianme.com";

//   // Backend now performs visibility filtering, search, sorting and paging.
//   // Keep this variable name so the existing table rendering remains stable.
//   const filteredAndSortedReportData = reportData;

//   // ============================================================
//   // EXPORT SERVICE REPORT TABLE TO EXCEL
//   // Exports ALL records matching the current table search, not just
//   // the currently visible server-paginated page. Uses the same backend
//   // visibility rules (userEmail/access) as normal table loading.
//   // ============================================================
//   const handleExportServiceReportsToExcel = async () => {
//     if (reportExcelExportLoading) return;

//     setReportExcelExportLoading(true);
//     try {
//       const search = String(reportTableSearch || "").trim();
//       const serviceReportNumberSearch = String(
//         reportTableServiceReportNumberSearch || "",
//       ).trim();
//       const pageSize = 100;
//       let page = 1;
//       let total = 0;
//       const allReports = [];
//       const maxPages = 10000;

//       // Fetch in pages to avoid loading every record during normal table use.
//       // The export alone requests every page matching the current filters.
//       while (page <= maxPages) {
//         const result = await gasRequest({
//           action: "getServiceReportsPage",
//           method: "GET",
//           data: {
//             page,
//             pageSize,
//             search,
//             serviceReportNumber: serviceReportNumberSearch,
//             userEmail: String(user?.email || "").trim(),
//             access: String(user?.access || "").trim(),
//           },
//           retries: 0,
//           timeoutMs: 60000,
//         });

//         const rows = Array.isArray(result.reports) ? result.reports : [];
//         total = Number(result.total || 0);
//         if (!rows.length) break;
//         allReports.push(...rows);

//         if (total > 0 && allReports.length >= total) break;
//         page += 1;
//       }

//       if (!allReports.length) {
//         notification.warning({
//           message: "No Data",
//           description: "No service report data was found to export.",
//           placement: "bottomRight",
//         });
//         return;
//       }

//       // Export the complete service-report dataset using the full column
//       // layout requested from the previous project. Do not stop at Parts Used.
//       const columns = [
//         { title: "Service Report Number", key: "Service Report Number" },
//         { title: "Customer", key: "Customer" },
//         { title: "Service Date", key: "Service Date" },
//         { title: "Site / Location", key: "Site / Location" },
//         { title: "Contact Person", key: "Contact Person" },
//         { title: "Contact No.", key: "Contact No." },
//         { title: "Technician", key: "Technician" },
//         { title: "Arrival Time", key: "Arrival Time" },
//         { title: "Completion Time", key: "Completion Time" },
//         { title: "Total Working Hours", key: "Total Working Hours" },
//         { title: "Service Visit Ref.", key: "Service Visit Ref." },
//         { title: "Machine Model", key: "Machine Model" },
//         { title: "Serial No.", key: "Serial No." },
//         { title: "Installation year", key: "Installation year" },
//         { title: "Machine Running Hours", key: "Machine Running Hours" },
//         { title: "Controller", key: "Controller" },
//         { title: "Warranty Status", key: "Warranty Status" },
//         {
//           title: "Installation / Commissioning",
//           key: "Installation / Commissioning",
//         },
//         { title: "Breakdown / Defect", key: "Breakdown / Defect" },
//         { title: "Preventive Maintenance", key: "Preventive Maintenance" },
//         { title: "Corrective Maintenance", key: "Corrective Maintenance" },
//         { title: "Inspection", key: "Inspection" },
//         { title: "Customer Visit", key: "Customer Visit" },
//         { title: "Software / Program", key: "Software / Program" },
//         { title: "Other", key: "Other" },
//         {
//           title: "Customer complaint / reported problem",
//           key: "Customer complaint / reported problem",
//         },
//         {
//           title: "Technician diagnosis/root cause",
//           key: "Technician diagnosis/root cause",
//         },
//         {
//           title: "Work performed / corrective action",
//           key: "Work performed / corrective action",
//         },
//         {
//           title: "Machine tested successfully",
//           key: "Machine tested successfully",
//         },
//         { title: "Machine running normally", key: "Machine running normally" },
//         { title: "Running with observation", key: "Running with observation" },
//         {
//           title: "Machine stopped - further action required",
//           key: "Machine stopped - further action required",
//         },
//         {
//           title: "Customer advised / awaiting action",
//           key: "Customer advised / awaiting action",
//         },
//         { title: "Trial Duration", key: "Trial Duration" },
//         { title: "Cycle Time", key: "Cycle Time" },
//         { title: "Product / Material", key: "Product / Material" },
//         { title: "Trial / Status Remarks", key: "Trial / Status Remarks" },
//         { title: "Part No.", key: "Part No." },
//         { title: "Description", key: "Description" },
//         { title: "Qty", key: "Qty" },
//         { title: "Used / Recommended", key: "Used / Recommended" },
//         { title: "Remarks", key: "Remarks" },
//         {
//           title: "No further action required",
//           key: "No further action required",
//         },
//         { title: "Parts required", key: "Parts required" },
//         { title: "Follow-up visit required", key: "Follow-up visit required" },
//         { title: "Customer action required", key: "Customer action required" },
//         {
//           title: "Technical support required from Haitian China",
//           key: "Technical support required from Haitian China",
//         },
//         {
//           title: "Required Action / Follow-up",
//           key: "Required Action / Follow-up",
//         },
//         { title: "F.O.C. Commissioning", key: "F.O.C. Commissioning" },
//         { title: "F.O.C. Maintenance", key: "F.O.C. Maintenance" },
//         { title: "Warranty Service", key: "Warranty Service" },
//         { title: "Chargeable Maintenance", key: "Chargeable Maintenance" },
//         { title: "Customer Visit (Service)", key: "Customer Visit (Service)" },
//         { title: "Service Contract", key: "Service Contract" },
//         { title: "Goodwill", key: "Goodwill" },
//         { title: "Chargeable commissioning", key: "Chargeable commissioning" },
//         { title: "Service Technician Name", key: "Service Technician Name" },
//         { title: "Service Technician Date", key: "Service Technician Date" },
//         { title: "Service Manager Name", key: "Service Manager Name" },
//         { title: "Service Manager Date", key: "Service Manager Date" },
//         { title: "Customer Name", key: "Customer Name" },
//         { title: "Customer Date", key: "Customer Date" },
//         { title: "Modified User", key: "Modified User" },
//         { title: "Modified date & time", key: "Modified date & time" },
//       ];

//       const firstValue = (record, keys) => {
//         for (const key of keys) {
//           const value = record?.[key];
//           if (
//             value !== undefined &&
//             value !== null &&
//             String(value).trim() !== ""
//           )
//             return value;
//         }
//         // Also match spreadsheet headers to camelCase fields returned by older
//         // backend versions (for example, "Machine Running Hours" and
//         // "machineRunningHours"). Exact names above always take priority.
//         const normalizeFieldName = (value) =>
//           String(value || "")
//             .toLowerCase()
//             .replace(/[^a-z0-9]/g, "");
//         const wanted = new Set(keys.map(normalizeFieldName));
//         const matchingKey = Object.keys(record || {}).find((existingKey) =>
//           wanted.has(normalizeFieldName(existingKey)),
//         );
//         if (matchingKey !== undefined) {
//           const value = record[matchingKey];
//           if (
//             value !== undefined &&
//             value !== null &&
//             String(value).trim() !== ""
//           )
//             return value;
//         }
//         return "";
//       };

//       const arrayValue = (record, arrayKeys, selectedKey, legacyKeys = []) => {
//         let selected = firstValue(record, arrayKeys);
//         if (typeof selected === "string") {
//           try {
//             selected = JSON.parse(selected);
//           } catch {
//             selected = selected.split(/[,;]\s*/);
//           }
//         }
//         if (Array.isArray(selected)) {
//           const selectedLabels = {
//             installation: "Installation / Commissioning",
//             breakdown: "Breakdown / Defect",
//             preventive: "Preventive Maintenance",
//             corrective: "Corrective Maintenance",
//             inspection: "Inspection",
//             customerVisit: "Customer Visit",
//             software: "Software / Program",
//             other: "Other",
//             machineTestedSuccessfully: "Machine tested successfully",
//             machineRunningNormally: "Machine running normally",
//             runningWithObservation: "Running with observation",
//             machineStopped: "Machine stopped - further action required",
//             customerAdvised: "Customer advised / awaiting action",
//             noFurtherAction: "No further action required",
//             partsRequired: "Parts required",
//             followUpVisit: "Follow-up visit required",
//             customerAction: "Customer action required",
//             technicalSupportChina:
//               "Technical support required from Haitian China",
//             focCommissioning: "F.O.C. Commissioning",
//             focMaintenance: "F.O.C. Maintenance",
//             warrantyService: "Warranty Service",
//             chargeableMaintenance: "Chargeable Maintenance",
//             customerVisitService: "Customer Visit (Service)",
//             serviceContract: "Service Contract",
//             goodwill: "Goodwill",
//             chargeableCommissioning: "Chargeable commissioning",
//           };
//           if (
//             selected.includes(selectedKey) ||
//             selected.includes(selectedLabels[selectedKey])
//           )
//             return "Yes";
//         }
//         const direct = firstValue(
//           record,
//           legacyKeys.length ? legacyKeys : [selectedKey],
//         );
//         if (String(direct).trim().toLowerCase() === "yes" || direct === true)
//           return "Yes";
//         if (String(direct).trim().toLowerCase() === "no" || direct === false)
//           return "No";
//         return direct || "No";
//       };

//       // Return the stored part rows as separate records. Do not join part
//       // values with semicolons: Part No., Description, Qty, Used/Recommended,
//       // and Remarks must all come from the SAME part object on each Excel row.
//       const getPartsList = (record) => {
//         let partList = firstValue(record, [
//           "partsUsed",
//           "parts",
//           "partsUsedRecommended",
//         ]);
//         if (typeof partList === "string") {
//           try {
//             partList = JSON.parse(partList);
//           } catch {
//             partList = [];
//           }
//         }
//         if (Array.isArray(partList))
//           return partList.filter((part) => part && typeof part === "object");

//         // Support legacy sheet records where each part column is stored as
//         // a semicolon/comma-separated list instead of an array of objects.
//         const legacyKeys = {
//           partNo: ["Part No.", "Part No", "partNumber", "partNo"],
//           description: ["Description", "description"],
//           qty: ["Qty", "Quantity", "quantity", "qty"],
//           usedRecommended: ["Used / Recommended", "usedRecommended", "type"],
//           remarks: ["Remarks", "remarks", "note"],
//         };
//         const splitLegacy = (keys) => {
//           const value = firstValue(record, keys);
//           if (Array.isArray(value)) return value;
//           if (value === undefined || value === null || value === "") return [];
//           return String(value).split(/\s*;\s*|\s*,\s*/);
//         };
//         const legacyValues = Object.fromEntries(
//           Object.entries(legacyKeys).map(([key, keys]) => [
//             key,
//             splitLegacy(keys),
//           ]),
//         );
//         const legacyCount = Math.max(
//           0,
//           ...Object.values(legacyValues).map((values) => values.length),
//         );
//         return Array.from({ length: legacyCount }, (_, index) => ({
//           partNo: legacyValues.partNo[index] ?? "",
//           description: legacyValues.description[index] ?? "",
//           qty: legacyValues.qty[index] ?? "",
//           usedRecommended: legacyValues.usedRecommended[index] ?? "",
//           remarks: legacyValues.remarks[index] ?? "",
//         }));
//       };

//       const partValue = (record, fieldKeys, partIndex) => {
//         const part = getPartsList(record)[partIndex];
//         if (part) return firstValue(part, fieldKeys);
//         // Keep support for old single-value records with no parts array.
//         if (partIndex === 0) return firstValue(record, fieldKeys);
//         return "";
//       };

//       const valueFor = (record, key, partIndex = 0) => {
//         let value;
//         switch (key) {
//           case "Service Report Number":
//             return firstValue(record, [
//               "Service Report Number",
//               "serviceReportNumber",
//               "srn",
//             ]);
//           case "Customer":
//             return firstValue(record, [
//               "Customer",
//               "Customer Name",
//               "customer",
//               "customerName",
//             ]);
//           case "Service Date":
//             return firstValue(record, [
//               "Service Date",
//               "serviceDate",
//               "Installation Date",
//             ]);
//           case "Site / Location":
//             return firstValue(record, [
//               "Site / Location",
//               "Site / Location ",
//               "siteLocation",
//               "Address",
//             ]);
//           case "Contact Person":
//             return firstValue(record, ["Contact Person", "contactPerson"]);
//           case "Contact No.":
//             return firstValue(record, [
//               "Contact No.",
//               "Contact No",
//               "contactNo",
//               "Telephone",
//             ]);
//           case "Technician":
//             return firstValue(record, [
//               "Technician",
//               "Service Technician",
//               "Service Technician Name",
//               "technician",
//             ]);
//           case "Installation year":
//             return firstValue(record, [
//               "Installation year",
//               "Installation Year",
//               "installationYear",
//             ]);
//           case "Controller":
//             return firstValue(record, [
//               "Controller",
//               "Controller / Software version",
//               "Controller / Software Version",
//               "softwareVersion",
//             ]);
//           case "Customer complaint / reported problem":
//             return getCustomerComplaint(record);
//           case "Technician diagnosis/root cause":
//             return getTechnicianDiagnosis(record);
//           case "Work performed / corrective action":
//             return getWorkPerformed(record);
//           case "Installation / Commissioning":
//             return arrayValue(record, ["serviceCategory"], "installation", [
//               key,
//             ]);
//           case "Breakdown / Defect":
//             return arrayValue(record, ["serviceCategory"], "breakdown", [key]);
//           case "Preventive Maintenance":
//             return arrayValue(record, ["serviceCategory"], "preventive", [key]);
//           case "Corrective Maintenance":
//             return arrayValue(record, ["serviceCategory"], "corrective", [key]);
//           case "Inspection":
//             return arrayValue(record, ["serviceCategory"], "inspection", [key]);
//           case "Customer Visit":
//             return arrayValue(record, ["serviceCategory"], "customerVisit", [
//               key,
//             ]);
//           case "Software / Program":
//             return arrayValue(record, ["serviceCategory"], "software", [key]);
//           case "Machine tested successfully":
//             return arrayValue(
//               record,
//               ["machineTrialStatus"],
//               "machineTestedSuccessfully",
//               [key],
//             );
//           case "Machine running normally":
//             return arrayValue(
//               record,
//               ["machineTrialStatus"],
//               "machineRunningNormally",
//               [key],
//             );
//           case "Running with observation":
//             return arrayValue(
//               record,
//               ["machineTrialStatus"],
//               "runningWithObservation",
//               [key],
//             );
//           case "Machine stopped - further action required":
//             return arrayValue(
//               record,
//               ["machineTrialStatus"],
//               "machineStopped",
//               [key],
//             );
//           case "Customer advised / awaiting action":
//             return arrayValue(
//               record,
//               ["machineTrialStatus"],
//               "customerAdvised",
//               [key],
//             );
//           case "Part No.":
//             return partValue(
//               record,
//               ["Part No.", "Part No", "partNumber", "partNo"],
//               partIndex,
//             );
//           case "Description":
//             return partValue(record, ["Description", "description"], partIndex);
//           case "Qty":
//             return partValue(
//               record,
//               ["Qty", "Quantity", "quantity", "qty"],
//               partIndex,
//             );
//           case "Used / Recommended":
//             return partValue(
//               record,
//               ["Used / Recommended", "usedRecommended", "type"],
//               partIndex,
//             );
//           case "Remarks":
//             return partValue(record, ["Remarks", "remarks", "note"], partIndex);
//           case "No further action required":
//             return arrayValue(record, ["furtherAction"], "noFurtherAction", [
//               key,
//             ]);
//           case "Parts required":
//             return arrayValue(record, ["furtherAction"], "partsRequired", [
//               key,
//             ]);
//           case "Follow-up visit required":
//             return arrayValue(record, ["furtherAction"], "followUpVisit", [
//               key,
//             ]);
//           case "Customer action required":
//             return arrayValue(record, ["furtherAction"], "customerAction", [
//               key,
//             ]);
//           case "Technical support required from Haitian China":
//             return arrayValue(
//               record,
//               ["furtherAction"],
//               "technicalSupportChina",
//               [key, "Technical / spare support required from Haitian China"],
//             );
//           case "F.O.C. Commissioning":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "focCommissioning",
//               [key],
//             );
//           case "F.O.C. Maintenance":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "focMaintenance",
//               [key],
//             );
//           case "Warranty Service":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "warrantyService",
//               [key],
//             );
//           case "Chargeable Maintenance":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "chargeableMaintenance",
//               [key],
//             );
//           case "Customer Visit (Service)":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "customerVisitService",
//               [key],
//             );
//           case "Service Contract":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "serviceContract",
//               [key, "Service contract"],
//             );
//           case "Goodwill":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "goodwill",
//               [key],
//             );
//           case "Chargeable commissioning":
//             return arrayValue(
//               record,
//               ["serviceCommercialClassification"],
//               "chargeableCommissioning",
//               [key, "Chargeable Commissioning"],
//             );
//           case "Required Action / Follow-up":
//             return firstValue(record, [
//               key,
//               "requiredActionFollowUp",
//               "Required Action / Follow-up ",
//             ]);
//           case "Service Technician Name":
//             return firstValue(record, [
//               key,
//               "Technician Name",
//               "Service Technician",
//               "technicianName",
//             ]);
//           case "Service Technician Date":
//             return firstValue(record, [
//               key,
//               "Technician Date",
//               "technicianDate",
//             ]);
//           case "Service Manager Name":
//             return firstValue(record, [
//               key,
//               "Manager Name",
//               "Service Manager",
//               "managerName",
//             ]);
//           case "Service Manager Date":
//             return firstValue(record, [key, "Manager Date", "managerDate"]);
//           case "Customer Name":
//             return firstValue(record, [
//               key,
//               "Customer Acknowledgement Name",
//               "customerName",
//             ]);
//           case "Customer Date":
//             return firstValue(record, [
//               key,
//               "Customer Acknowledgement Date",
//               "customerDate",
//             ]);
//           case "Modified User":
//             return firstValue(record, [
//               key,
//               "Modified By",
//               "modifiedBy",
//               "updatedBy",
//             ]);
//           case "Modified date & time":
//             return firstValue(record, [
//               key,
//               "Modified Date",
//               "Modified At",
//               "modifiedAt",
//               "updatedAt",
//             ]);
//           default:
//             value = record?.[key];
//         }

//         if (value === undefined || value === null) return "";
//         if (Array.isArray(value)) {
//           return value
//             .map((item) => {
//               if (item && typeof item === "object")
//                 return Object.values(item)
//                   .filter((v) => v != null && v !== "")
//                   .join(" / ");
//               return item == null ? "" : String(item);
//             })
//             .filter(Boolean)
//             .join("; ");
//         }
//         if (value && typeof value === "object") return JSON.stringify(value);
//         return String(value);
//       };
//       // Match the attached workbook's "Form Data" layout: grouped section
//       // headings, individual field names beneath them, and three data rows
//       // for every service report, matching the backend sheet structure.
//       const sectionHeader = Array(columns.length).fill("");
//       sectionHeader[0] = "Service Report Number";
//       const setSection = (columnNumber, title) => {
//         sectionHeader[columnNumber - 1] = title;
//       };
//       setSection(2, "CUSTOMER & VISIT INFORMATION");
//       setSection(12, "MACHINE INFORMATION");
//       setSection(18, "SERVICE CATEGORY");
//       setSection(26, "CUSTOMER COMPLAINT / REPORTED PROBLEM");
//       setSection(27, "TECHNICIAN DIAGNOSIS / ROOT CAUSE");
//       setSection(28, "WORK PERFORMED / CORRECTIVE ACTION");
//       setSection(29, "MACHINE TRIAL & FINAL STATUS");
//       setSection(38, "PARTS USED / RECOMMENDED");
//       setSection(43, "FURTHER ACTION REQUIRED");
//       setSection(49, "SERVICE COMMERCIAL CLASSIFICATION");
//       setSection(57, "CUSTOMER ACKNOWLEDGEMENT");
//       setSection(63, "USER MODIFIED DETAILS");

//       const worksheetData = [
//         sectionHeader,
//         columns.map((column) => column.title),
//         ...allReports.flatMap((record) => {
//           const parts = getPartsList(record);
//           // One Excel row per part. Every part's quantity and descriptive
//           // fields stay aligned with that same part; report-level fields are
//           // repeated so each row remains understandable when filtered/sorted.
//           const rowCount = Math.max(parts.length, 1);
//           return Array.from({ length: rowCount }, (_, partIndex) =>
//             columns.map((column) => valueFor(record, column.key, partIndex)),
//           );
//         }),
//       ];
//       const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//       const fullBorder = {
//         top: { style: "thin", color: { rgb: "000000" } },
//         bottom: { style: "thin", color: { rgb: "000000" } },
//         left: { style: "thin", color: { rgb: "000000" } },
//         right: { style: "thin", color: { rgb: "000000" } },
//       };

//       // Merge section headings to match the uploaded Form Data worksheet.
//       worksheet["!merges"] = [
//         { s: { r: 0, c: 1 }, e: { r: 0, c: 10 } },
//         { s: { r: 0, c: 11 }, e: { r: 0, c: 16 } },
//         { s: { r: 0, c: 17 }, e: { r: 0, c: 24 } },
//         { s: { r: 0, c: 28 }, e: { r: 0, c: 36 } },
//         { s: { r: 0, c: 37 }, e: { r: 0, c: 41 } },
//         { s: { r: 0, c: 42 }, e: { r: 0, c: 47 } },
//         { s: { r: 0, c: 48 }, e: { r: 0, c: 55 } },
//         { s: { r: 0, c: 56 }, e: { r: 0, c: 61 } },
//         { s: { r: 0, c: 62 }, e: { r: 0, c: 63 } },
//       ];

//       const range = XLSX.utils.decode_range(worksheet["!ref"]);
//       for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
//         for (
//           let columnIndex = range.s.c;
//           columnIndex <= range.e.c;
//           columnIndex += 1
//         ) {
//           const cellAddress = XLSX.utils.encode_cell({
//             r: rowIndex,
//             c: columnIndex,
//           });
//           if (!worksheet[cellAddress])
//             worksheet[cellAddress] = { t: "s", v: "" };
//           const isSectionHeader = rowIndex === 0;
//           const isFieldHeader = rowIndex === 1;
//           worksheet[cellAddress].s = {
//             font: {
//               name: "Arial",
//               bold: isSectionHeader || isFieldHeader,
//               sz: isSectionHeader ? 10 : isFieldHeader ? 9 : 10,
//             },
//             alignment: {
//               vertical: "center",
//               horizontal: "center",
//               wrapText: false,
//             },
//             ...(isSectionHeader || isFieldHeader
//               ? { fill: { fgColor: { rgb: "FFF200" } } }
//               : {}),
//             border: fullBorder,
//           };
//         }
//       }

//       const customColumnWidths = {
//         "Customer complaint / reported problem": 120,
//         "Technician diagnosis/root cause": 120,
//         "Work performed / corrective action": 120,
//       };

//       worksheet["!cols"] = columns.map((column) => {
//         const customWidth = customColumnWidths[column.title];

//         if (customWidth) {
//           return { wch: customWidth };
//         }

//         const maxLength = Math.max(
//           column.title.length,
//           ...allReports
//             .slice(0, 500)
//             .map((record) => String(valueFor(record, column.key) || "").length),
//         );

//         return { wch: Math.min(Math.max(maxLength + 1, 12), 40) };
//       });

//       // Reduced header height/padding while keeping long field names readable.
//       const exportedPartRowCount = allReports.reduce(
//         (count, record) => count + Math.max(getPartsList(record).length, 1),
//         0,
//       );
//       worksheet["!rows"] = [
//         { hpt: 18 },
//         { hpt: 24 },
//         ...Array(exportedPartRowCount).fill({ hpt: 18 }),
//       ];

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Service Reports");
//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });
//       const blob = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const timestamp = new Date()
//         .toISOString()
//         .replace(/[:.]/g, "-")
//         .slice(0, 19);
//       saveAs(blob, `Haitian_Service_Reports_${timestamp}.xlsx`);

//       notification.success({
//         message: "Export Successful",
//         description: `Exported ${allReports.length} service report(s), with each part on its own row${total && allReports.length < total ? ` (server reported ${total} matching records)` : ""}.`,
//         placement: "bottomRight",
//       });
//     } catch (error) {
//       console.error("Service report Excel export failed:", error);
//       notification.error({
//         message: "Export Failed",
//         description:
//           error?.message || "Unable to export service reports to Excel.",
//         placement: "bottomRight",
//       });
//     } finally {
//       setReportExcelExportLoading(false);
//     }
//   };

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
//           <span className="service-report-number-badge">{value || "-"}</span>
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
//         record?.["Installation year"] || record?.["Installation Date"] || "-",
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
//             disabled={loading}
//             onClick={() => {
//               // A new View record must always start with a clean PDF
//               // download state.
//               setPdfDownloadLoadingReportNumber("");
//               setViewReport(record);
//               setViewModalOpen(true);
//             }}
//           >
//             View
//           </Button>

//           <Button
//             className="service-report-edit-action"
//             icon={<EditOutlined />}
//             disabled={loading}
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
//   // CUSTOMER DATA
//   // ============================================================
//   // Customer data is loaded together with reports by loadInitialData().
//   // This helper remains available if a manual refresh is ever needed.
//   // ============================================================

//   const loadAllCustomerData = async () => {
//     try {
//       const result = await gasRequest({
//         action: "getAllCustomerData",
//         method: "GET",
//         retries: 2,
//       });
//       const customers = Array.isArray(result.customers) ? result.customers : [];
//       applyCustomerCache(customers);
//       return customers;
//     } catch (error) {
//       console.error("Failed to load customer data:", error);
//       setCustomerDataList([]);
//       setCustomerOptions([]);
//       return [];
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

//     // Customer details must belong to the exact current customer name.
//     // If the field is cleared or no exact match exists, remove previous
//     // autofilled details so they cannot be saved against another customer.
//     if (!customerValue) {
//       clearCustomerAutofill();
//       return;
//     }

//     const matched = customerDataList.find(
//       (customer) =>
//         getCustomerName(customer).toLowerCase() === customerValue.toLowerCase(),
//     );

//     if (!matched) {
//       // Do not keep details from a previously matched customer when the
//       // current name is different (for example, "Kumar" -> "Kumars").
//       // Autofill is applied only when the full customer name matches.
//       clearCustomerAutofill();
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

//   const enforceSectionTrailRequiredLimit = (value) => {
//     const input = typeof value === "string" ? value : "";

//     // First limit to 2 explicit lines
//     const lines = input.split("\n").slice(0, 2);

//     let limited = lines.join("\n");

//     // Then limit total characters to 250
//     if (limited.length > 250) {
//       limited = limited.substring(0, 250);
//     }

//     return limited;
//   };

//   // Prevent the user from creating a 4th line by pressing Enter.
//   // The existing onChange handlers still enforce the same 3-line / 512-character
//   // restriction for typing and pasted content.
//   const handleSectionTextKeyDown = (e) => {
//     if (e.key !== "Enter") return;

//     const currentValue = String(e.currentTarget?.value || "");
//     const lineCount = currentValue.split(/\r?\n/).length;

//     if (lineCount >= 2) {
//       e.preventDefault();

//       notification.warning({
//         message: "Warning",
//         description: "This field is limited to 2 lines and 250 characters.",
//         placement: "bottomRight",
//       });
//     }
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
//     const limited = enforceSectionTrailRequiredLimit(input);

//     if (input !== limited) {
//       notification.warning({
//         message: "Warning",
//         description:
//           "Required Action / Follow-up is limited to 2 lines and 250 characters. Excess text was removed.",
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
//       width: 210,
//       key: "partNo",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Tooltip title={partsFormData[record.key]?.partNo || "Enter the part number (maximum 22 characters)"} placement="topLeft">
//                   <Input
//             placeholder="Part No."
//             maxLength={22}
//             showCount
//             value={partsFormData[record.key]?.partNo || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "partNo", e.target.value)
//             }
//           />
//                 </Tooltip>
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Description",
//       dataIndex: "description",
//       width: 250,
//       key: "description",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Tooltip title={partsFormData[record.key]?.description || "Enter the part description (maximum 30 characters)"} placement="topLeft">
//                   <Input
//             placeholder="Description"
//             maxLength={30}
//             showCount
//             value={partsFormData[record.key]?.description || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "description", e.target.value)
//             }
//           />
//                 </Tooltip>
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Qty",
//       dataIndex: "qty",
//       width: 100,
//       key: "qty",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Tooltip title={partsFormData[record.key]?.qty || "Enter the quantity"} placement="topLeft">
//                   <Input
//             style={{ width: "100%" }}
//             placeholder="Qty"
//             value={partsFormData[record.key]?.qty || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "qty", e.target.value)
//             }
//           />
//                 </Tooltip>
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Used / Recommended",
//       dataIndex: "usedRecommended",
//       width: 270,
//       key: "usedRecommended",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Tooltip title={partsFormData[record.key]?.usedRecommended || "Enter whether the part was used or recommended (maximum 30 characters)"} placement="topLeft">
//                   <Input
//             placeholder="Used / Recommended"
//             maxLength={30}
//             showCount
//             value={partsFormData[record.key]?.usedRecommended || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "usedRecommended", e.target.value)
//             }
//           />
//                 </Tooltip>
//         </Form.Item>
//       ),
//     },

//     {
//       title: "Remarks",
//       dataIndex: "remarks",
//       width: 250,
//       key: "remarks",

//       render: (_, record) => (
//         <Form.Item style={{ margin: 0 }}>
//           <Tooltip title={partsFormData[record.key]?.remarks || "Enter remarks (maximum 30 characters)"} placement="topLeft">
//                   <Input
//             placeholder="Remarks"
//             maxLength={30}
//             showCount
//             value={partsFormData[record.key]?.remarks || ""}
//             onChange={(e) =>
//               updatePartsFormData(record.key, "remarks", e.target.value)
//             }
//           />
//                 </Tooltip>
//         </Form.Item>
//       ),
//     },
//   ];

//   const fetchNextServiceReportNumber = async () => {
//     try {
//       setSrnLoading(true);
//       const result = await gasRequest({
//         action: "getNextServiceReportNumber",
//         method: "GET",
//         retries: 2,
//       });

//       const nextSRN = result.serviceReportNumber ?? result.srn ?? "";
//       if (nextSRN === "") {
//         throw new Error("Service report number was not received");
//       }

//       setServiceReportNumber(String(nextSRN));
//       return String(nextSRN);
//     } catch (error) {
//       console.error("Fetch SRN error:", error);
//       notification.error({
//         message: "SRN Error",
//         description: error.message || "Unable to fetch service report number.",
//         placement: "bottomRight",
//       });
//       return "";
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

//   const handleSubmit = async (values) => {
//     // ========================================================
//     // PREVENT DOUBLE SUBMISSION
//     // ========================================================

//     if (loading) {
//       return;
//     }

//     // Prevent submission by Enter-key or programmatic form submit while the
//     // SRN is loading, or if Apps Script did not return a usable SRN.
//     if (srnLoading || !String(serviceReportNumber || "").trim()) {
//       notification.warning({
//         message: "Service Report Number Not Ready",
//         description:
//           "Please wait until the Service Report Number has loaded before submitting.",
//         placement: "bottomRight",
//       });
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

//       // ======================================================
//       // PARTS
//       // IMPORTANT: use the controlled Parts table state as
//       // the single source of truth for saving and PDF generation.
//       // ======================================================

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

//       // ========================================================
//       // SEND TO GOOGLE APPS SCRIPT
//       // ========================================================

//       const result = await gasRequest({
//         action: "saveReport",
//         method: "POST",
//         data: payload,
//         retries: 0,
//       });

//       // ========================================================
//       // GET SAVED REPORT NUMBER
//       // ========================================================

//       const savedReportNumber = result.serviceReportNumber ?? result.srn ?? "";

//       // Normalize the saved report returned by the backend. Some backend
//       // responses include result.report; the fallback keeps the customer
//       // cache update safe when only the submitted form values are returned.
//       const savedReport = result.report || {
//         ...values,
//         "Service Report Number": savedReportNumber || serviceReportNumber,
//         Customer: values.customer || "",
//         "Site / Location": values.siteLocation || "",
//         "Contact Person": values.contactPerson || "",
//         "Contact No.": values.contactNo || "",
//         "Machine Model": values.machineModel || "",
//         "Serial No.": values.serialNo || "",
//         "Installation year": values.installationYear || "",
//       };

//       const tablePageSize = Math.max(1, Number(reportTablePageSize) || 10);
//       const normalizedSavedReportNumber = String(
//         savedReportNumber || serviceReportNumber || "",
//       ).trim();
//       const savedTechnician = Array.isArray(values.technician)
//         ? values.technician.join(", ")
//         : values.technician || "";
//       const firstPart = Array.isArray(parts) ? parts[0] || {} : {};

//       const savedReportForTable = {
//         ...savedReport,
//         "Service Report Number": normalizedSavedReportNumber,
//         Customer: savedReport?.Customer || savedReport?.["Customer Name"] || values.customer || "",
//         "Customer Name": savedReport?.["Customer Name"] || savedReport?.Customer || values.customer || "",
//         "Service Date": savedReport?.["Service Date"] || savedReport?.serviceDate || values.serviceDate || "",
//         "Site / Location": savedReport?.["Site / Location"] || savedReport?.siteLocation || values.siteLocation || "",
//         "Contact Person": savedReport?.["Contact Person"] || savedReport?.contactPerson || values.contactPerson || "",
//         "Contact No.": savedReport?.["Contact No."] || savedReport?.contactNo || values.contactNo || "",
//         Technician: savedReport?.Technician || savedReport?.technician || savedTechnician,
//         "Arrival Time": savedReport?.["Arrival Time"] || savedReport?.arrivalTime || values.arrivalTime || "",
//         "Completion Time": savedReport?.["Completion Time"] || savedReport?.completionTime || values.completionTime || "",
//         "Total Working Hours": savedReport?.["Total Working Hours"] || savedReport?.totalWorkingHours || values.totalWorkingHours || "",
//         "Service Visit Ref.": savedReport?.["Service Visit Ref."] || savedReport?.serviceVisitRef || values.serviceVisitRef || "",
//         "Machine Model": savedReport?.["Machine Model"] || savedReport?.machineModel || values.machineModel || "",
//         "Serial No.": savedReport?.["Serial No."] || savedReport?.serialNo || values.serialNo || "",
//         "Installation year": savedReport?.["Installation year"] || savedReport?.installationYear || values.installationYear || "",
//         "Machine Running Hours": savedReport?.["Machine Running Hours"] || savedReport?.machineRunningHours || values.machineRunningHours || "",
//         Controller: savedReport?.Controller || savedReport?.softwareVersion || values.softwareVersion || "",
//         "Warranty Status": savedReport?.["Warranty Status"] || savedReport?.warrantyStatus || values.warrantyStatus || "",
//         "Customer Complaint": savedReport?.["Customer Complaint"] || savedReport?.customerComplaint || values.customerComplaint || "",
//         "Technician Diagnosis": savedReport?.["Technician Diagnosis"] || savedReport?.technicianDiagnosis || values.technicianDiagnosis || "",
//         "Work Performed": savedReport?.["Work Performed"] || savedReport?.workPerformed || values.workPerformed || "",
//         "Trial Duration": savedReport?.["Trial Duration"] || savedReport?.trialDuration || values.trialDuration || "",
//         "Cycle Time": savedReport?.["Cycle Time"] || savedReport?.cycleTime || values.cycleTime || "",
//         "Product / Material": savedReport?.["Product / Material"] || savedReport?.productMaterial || values.productMaterial || "",
//         "Trial / Status Remarks": savedReport?.["Trial / Status Remarks"] || savedReport?.trialStatusRemarks || values.trialStatusRemarks || "",
//         "Part No.": savedReport?.["Part No."] || firstPart.partNo || "",
//         Description: savedReport?.Description || firstPart.description || "",
//         Qty: savedReport?.Qty || firstPart.qty || "",
//         "Used / Recommended": savedReport?.["Used / Recommended"] || firstPart.usedRecommended || "",
//         Remarks: savedReport?.Remarks || firstPart.remarks || "",
//       };

//       // A successful new submission returns the table to its default view.
//       // Cancel debounce/in-flight searches, clear filters, and start on page 1.
//       if (reportSearchTimerRef.current) {
//         clearTimeout(reportSearchTimerRef.current);
//         reportSearchTimerRef.current = null;
//       }
//       setReportTableSearch("");
//       setReportTableServiceReportNumberSearch("");
//       setReportTableCurrentPage(1);
//       setReportTableSearchLoading(false);
//       clearReportPageCache();
//       reportPageRequestRef.current.clear();

//       // Cancel the influence of any older in-flight page response so it
//       // cannot overwrite the newly saved row after this local update.
//       reportTableRequestSequenceRef.current += 1;
//       setReportTableLoading(false);
//       setReportData((previous) => {
//         const currentRows = Array.isArray(previous) ? previous : [];
//         // Only deduplicate when the backend returned a real report number.
//         // A missing SRN must never cause unrelated rows to be removed.
//         const withoutDuplicate = normalizedSavedReportNumber
//           ? currentRows.filter(
//               (item) =>
//                 String(item?.["Service Report Number"] || "").trim() !==
//                 normalizedSavedReportNumber,
//             )
//           : currentRows;
//         return [savedReportForTable, ...withoutDuplicate].slice(0, tablePageSize);
//       });
//       setReportTableTotal((previous) => Number(previous || 0) + 1);

//       // Reconcile this immediate display with the authoritative backend
//       // response in the background. This does not block PDF creation/upload.
//       // Never replace the optimistic row with a stale read: if the new SRN is
//       // not present yet, invalidate that cached response and retry once.
//       // A newer user table request cancels reconciliation to avoid races.
//       const savedTableRefreshSequence = reportTableRequestSequenceRef.current;
//       const savedTableCacheKey = getReportPageCacheKey(1, tablePageSize, "", "");

//       const reconcileSavedReportTable = async (attempt = 0) => {
//         if (savedTableRefreshSequence !== reportTableRequestSequenceRef.current) {
//           return;
//         }

//         try {
//           // Bypass the page-request deduplication map for this one read so
//           // an older in-flight request cannot masquerade as a post-save read.
//           const freshResult = await gasRequest({
//             action: "getServiceReportsPage",
//             method: "GET",
//             data: {
//               page: 1,
//               pageSize: tablePageSize,
//               search: "",
//               serviceReportNumber: "",
//               userEmail: String(user?.email || "").trim(),
//               access: String(user?.access || "").trim(),
//             },
//             retries: 0,
//           });
//           const freshPage = {
//             reports: Array.isArray(freshResult?.reports) ? freshResult.reports : [],
//             total: Number(freshResult?.total || 0),
//             page: Number(freshResult?.page || 1),
//           };

//           if (savedTableRefreshSequence !== reportTableRequestSequenceRef.current) {
//             return;
//           }

//           const freshReports = Array.isArray(freshPage?.reports)
//             ? freshPage.reports
//             : [];
//           const savedRowIsPresent = normalizedSavedReportNumber !== "" &&
//             freshReports.some((item) =>
//               String(item?.["Service Report Number"] || "").trim() === normalizedSavedReportNumber
//             );

//           if (savedRowIsPresent) {
//             // Cache only a confirmed post-save page containing the new SRN.
//             reportPageCacheRef.current.set(savedTableCacheKey, {
//               timestamp: Date.now(),
//               data: freshPage,
//             });
//             setReportData(freshReports);
//             setReportTableTotal(Number(freshPage.total || 0));
//             setReportTableCurrentPage(1);
//             return;
//           }

//           // Preserve the visible saved row if the spreadsheet read is stale.
//           reportPageCacheRef.current.delete(savedTableCacheKey);
//           if (attempt < 1) {
//             window.setTimeout(() => {
//               void reconcileSavedReportTable(attempt + 1);
//             }, 1200);
//           }
//         } catch (refreshError) {
//           reportPageCacheRef.current.delete(savedTableCacheKey);
//           if (attempt < 1) {
//             window.setTimeout(() => {
//               void reconcileSavedReportTable(attempt + 1);
//             }, 1200);
//             return;
//           }
//           console.warn(
//             "Background table refresh failed after a successful save; the visible row is preserved.",
//             refreshError,
//           );
//         }
//       };

//       window.setTimeout(() => {
//         void reconcileSavedReportTable(0);
//       }, 500);

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
//       // PDF GENERATION + DRIVE UPLOAD — RELIABLE SUBMISSION
//       // ========================================================
//       // IMPORTANT:
//       // Do NOT detach this operation from handleSubmit.
//       //
//       // Google Apps Script cannot guarantee a browser-side background
//       // job after the submit handler has finished. If we use:
//       //
//       //   void (async () => { ... })();
//       //
//       // the UI can say "saved" while the PDF is still uploading, and
//       // the browser can terminate/throttle the request. That caused
//       // the previous "PDF is processing in background" problem.
//       //
//       // The report is already saved at this point. We now generate,
//       // save locally and upload the PDF, then continue with the final
//       // form reset only after Drive has confirmed the file.
//       // ========================================================

//       const pdfValuesForUpload = { ...values, parts };
//       const pdfReportNumberForUpload = String(
//         savedReportNumber || serviceReportNumber || "",
//       ).trim();

//       notification.info({
//         message: "Report Saved — Uploading PDF",
//         description: `Service Report ${
//           pdfReportNumberForUpload || ""
//         } was saved. Generating and uploading the PDF to Google Drive...`,
//         placement: "bottomRight",
//         duration: 0,
//       });

//       const pdfResult = await generateServiceReportPDF(
//         pdfValuesForUpload,
//         pdfReportNumberForUpload,
//         signatureTechnician,
//         signatureManager,
//         signatureCustomer,
//       );

//       // Keep the browser's local PDF download, but do not make an
//       // unnecessary 300ms wait before starting the Drive upload.
//       const localPdfFileName = await savePdfLocally(pdfResult);

//       // This function verifies Drive after transport failures and retries
//       // only when the PDF cannot be found. It prevents duplicate PDFs
//       // when Drive succeeded but the HTTP response was lost.
//       const pdfUploadResult = await uploadPdfWithRecovery(
//         pdfResult,
//         pdfReportNumberForUpload,
//       );

//       if (
//         !pdfUploadResult ||
//         pdfUploadResult.success !== true ||
//         !pdfUploadResult.fileId
//       ) {
//         throw new Error("Google Drive did not confirm the PDF upload.");
//       }

//       notification.destroy();

//       notification.success({
//         message: "Report & PDF Saved Successfully",
//         description: `${localPdfFileName} was saved locally and the PDF was confirmed in Google Drive.`,
//         placement: "bottomRight",
//         duration: 5,
//       });

//       // ========================================================
//       // RESET NEW REPORT FORM
//       // ========================================================
//       //
//       // IMPORTANT:
//       // This section runs ONLY after the backend has confirmed
//       // successful saving.
//       //
//       // The PDF has also already been generated using the
//       // original values before the form is cleared.
//       // ========================================================

//       // --------------------------------------------------------
//       // RESET ALL ANT DESIGN FORM FIELDS
//       // --------------------------------------------------------

//       form.resetFields();

//       // --------------------------------------------------------
//       // RESET SELECTED TECHNICIANS
//       // --------------------------------------------------------

//       setSelectedTechnicians([]);

//       // --------------------------------------------------------
//       // RESET CUSTOMER/AUTOFILL STATE
//       // --------------------------------------------------------

//       setAddress("");

//       setSerialNumber("");

//       // --------------------------------------------------------
//       // RESET PARTS TABLE
//       // --------------------------------------------------------

//       setPartsFormData([
//         {
//           key: 0,
//           partNo: "",
//           description: "",
//           qty: "",
//           usedRecommended: "",
//           remarks: "",
//         },
//         {
//           key: 1,
//           partNo: "",
//           description: "",
//           qty: "",
//           usedRecommended: "",
//           remarks: "",
//         },
//         {
//           key: 2,
//           partNo: "",
//           description: "",
//           qty: "",
//           usedRecommended: "",
//           remarks: "",
//         },
//       ]);

//       // --------------------------------------------------------
//       // CLEAR TECHNICIAN SIGNATURE
//       // --------------------------------------------------------

//       if (sigTechnician.current) {
//         sigTechnician.current.clear();
//       }

//       setSignatureTechnician("");

//       setIsTechnicianSignSaved(false);

//       // --------------------------------------------------------
//       // CLEAR MANAGER SIGNATURE
//       // --------------------------------------------------------

//       if (sigManager.current) {
//         sigManager.current.clear();
//       }

//       setSignatureManager("");

//       setIsManagerSignSaved(false);

//       // --------------------------------------------------------
//       // CLEAR CUSTOMER SIGNATURE
//       // --------------------------------------------------------

//       if (sigCustomer.current) {
//         sigCustomer.current.clear();
//       }

//       setSignatureCustomer("");

//       setIsCustomerSignSaved(false);

//       // ========================================================
//       // UPDATE LOCAL CUSTOMER STATE
//       // ========================================================
//       // Report-table state was updated immediately after the backend save,
//       // before PDF generation/upload. Keep the customer/autofill cache update
//       // here because it does not need to block the report-table refresh.
//       // ========================================================

//       // Merge the new customer into the existing full customer cache instead
//       // of rebuilding the cache from only the current report page.
//       const savedCustomerName = String(
//         savedReport?.["Customer"] || savedReport?.["Customer Name"] || "",
//       ).trim();

//       if (savedCustomerName) {
//         setCustomerDataList((previous) => {
//           const next = [
//             savedReport,
//             ...(Array.isArray(previous) ? previous : []),
//           ];
//           const seen = new Map();
//           next.forEach((item) => {
//             const name = String(
//               item?.["Customer"] || item?.["Customer Name"] || "",
//             ).trim();
//             if (!name) return;
//             const key = name.toLowerCase();
//             if (!seen.has(key)) seen.set(key, item);
//           });
//           return Array.from(seen.values()).sort((a, b) =>
//             String(a?.["Customer"] || a?.["Customer Name"] || "").localeCompare(
//               String(b?.["Customer"] || b?.["Customer Name"] || ""),
//             ),
//           );
//         });

//         setCustomerOptions((previous) => {
//           const names = new Set([
//             savedCustomerName,
//             ...(Array.isArray(previous) ? previous : []),
//           ]);
//           return Array.from(names).sort((a, b) => a.localeCompare(b));
//         });
//       }

//       const nextSRN = result.nextServiceReportNumber ?? result.nextSrn ?? "";

//       if (nextSRN !== "") {
//         setServiceReportNumber(String(nextSRN));
//       } else {
//         // Safe fallback for older deployments.
//         await fetchNextServiceReportNumber();
//       }
//     } catch (error) {
//       notification.destroy();

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

//       <div className="service-form-header newFormStyleHeader mt-1 ">
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
//               fontSize: "25px",
//               whiteSpace: "normal",
//             }}
//           >
//             {/* Service Report No:{" "}
//             {srnLoading ? "Loading..." : serviceReportNumber || "---"} */}
//             HAITIAN SERVICE REPORT
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
//         className="newFormStyle"
//         disabled={loading}
//       >
//         <div className="fetched-service-reports-heading">
//           <div className="fetched-service-reports-heading-main">
//             <div className="fetched-service-reports-heading-icon">
//               <FormOutlined />
//             </div>

//             <div>
//               <div className="fetched-service-reports-title">
//                 NEW SERVICE FORM
//               </div>
//               <div className="fetched-service-reports-subtitle">
//                 Complete the required information below to create a service
//                 report
//               </div>
//             </div>
//           </div>

//           <div className="fetched-service-reports-count">
//             <span className="fetched-service-reports-count-label">
//               SERVICE REPORT NUMBER
//             </span>
//             <strong>
//               {srnLoading ? "Loading..." : serviceReportNumber || "---"}
//             </strong>
//           </div>
//         </div>
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
//             rows={2}
//             maxLength={250}
//             showCount
//             placeholder="Enter trial / status remarks"
//             onChange={handleTrialStatusRemarksChange}
//             onKeyDown={handleSectionTextKeyDown}
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
//             size="middle"
//             tableLayout="fixed"
//             columns={partsColumns}
//             dataSource={partsDataSource}
//             scroll={{ x: 1120 }}
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
//             rows={2}
//             maxLength={250}
//             showCount
//             placeholder="Enter required action / follow-up"
//             onChange={handleRequiredActionFollowUpChange}
//             onKeyDown={handleSectionTextKeyDown}
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
//                   disabled={loading}
//                 >
//                   Save Signature
//                 </Button>

//                 <Button
//                   className="dangerbutton"
//                   onClick={clearTechnicianSignature}
//                   disabled={loading}
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
//                   disabled={loading}
//                 >
//                   Save Signature
//                 </Button>

//                 <Button
//                   className="dangerbutton"
//                   onClick={clearManagerSignature}
//                   disabled={loading}
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
//                   disabled={loading}
//                 >
//                   Save Signature
//                 </Button>

//                 <Button
//                   className="dangerbutton"
//                   onClick={clearCustomerSignature}
//                   disabled={loading}
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
//             disabled={loading || srnLoading || !String(serviceReportNumber || "").trim()}
//           >
//             {loading
//               ? "Submitting..."
//               : srnLoading
//                 ? "Loading SRN..."
//                 : "Submit Report"}
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
//                 {reportTableSearch.trim() ||
//                 reportTableServiceReportNumberSearch.trim()
//                   ? "MATCHING RECORDS"
//                   : "TOTAL RECORDS"}
//               </span>
//               <strong>{reportTableTotal}</strong>
//             </div>
//           </div>

//           <div className="fetched-service-reports-toolbar">
//             <div
//               className="service-report-search-wrap"
//               style={{ minWidth: 260, maxWidth: 300 }}
//             >
//               <SearchOutlined className="service-report-search-icon" />
//               <Input
//                 value={reportTableServiceReportNumberSearch}
//                 onChange={(event) =>
//                   handleServiceReportNumberSearchChange(event.target.value)
//                 }
//                 placeholder="Search Service Report No..."
//                 allowClear
//                 className="service-report-search-input"
//                 disabled={loading || reportTableLoading || reportTableSearchLoading}
//               />
//             </div>

//             <div className="service-report-search-wrap">
//               <SearchOutlined className="service-report-search-icon" />
//               <Input
//                 value={reportTableSearch}
//                 onChange={(event) =>
//                   handleReportSearchChange(event.target.value)
//                 }
//                 placeholder="Search customer, technician, machine, serial no., location..."
//                 allowClear
//                 className="service-report-search-input"
//                 disabled={loading || reportTableLoading || reportTableSearchLoading}
//               />
//             </div>

//             <div className="service-report-toolbar-actions">

//               {/* <div className="service-report-page-size">
//                 <span>Rows</span>
//                 <Select
//                   value={reportTablePageSize}
//                   onChange={(nextPageSize) => {
//                     setReportTablePageSize(nextPageSize);
//                     setReportTableCurrentPage(1);
//                     fetchServiceReports({
//                       page: 1,
//                       pageSize: nextPageSize,
//                       search: reportTableSearch,
//                     });
//                   }}
//                   options={[
//                     { value: 10, label: "10" },
//                     // { value: 20, label: "20" },
//                     // { value: 50, label: "50" },
//                     // { value: 100, label: "100" },
//                   ]}
//                 />
//               </div> */}

//               <Button
//                 className="service-report-refresh-button"
//                 icon={<ReloadOutlined />}
//                 loading={
//                   reportTableLoadingMode === "search" ||
//                   reportTableLoadingMode === "refresh"
//                 }
//                 disabled={loading || reportTableLoading || reportTableSearchLoading}
//                 onClick={() => {
//                   if (reportSearchTimerRef.current) {
//                     clearTimeout(reportSearchTimerRef.current);
//                     reportSearchTimerRef.current = null;
//                   }
//                   fetchServiceReports({
//                     page: reportTableCurrentPage,
//                     pageSize: reportTablePageSize,
//                     search: reportTableSearch,
//                     serviceReportNumberSearch:
//                       reportTableServiceReportNumberSearch,
//                     useCache: false,
//                     loadingMode: "refresh",
//                   });
//                 }}
//               >
//                 {reportTableLoadingMode === "search"
//                   ? "Searching..."
//                   : reportTableLoadingMode === "refresh"
//                     ? "Refreshing..."
//                     : "Refresh"}
//               </Button>

//               <Button
//                 className="service-report-refresh-button"
//                 icon={<ExportOutlined />}
//                 loading={reportExcelExportLoading}
//                 disabled={reportExcelExportLoading || loading}
//                 onClick={handleExportServiceReportsToExcel}
//               >
//                 {reportExcelExportLoading ? "Exporting..." : "Export Excel"}
//               </Button>

//               {(reportTableSearch || reportTableServiceReportNumberSearch) && (
//                 <Button
//                   className="service-report-clear-button"
//                   icon={<ClearOutlined />}
//                   disabled={loading}
//                   onClick={() => {
//                     setReportTableSearch("");
//                     setReportTableServiceReportNumberSearch("");
//                     scheduleReportTableSearch({
//                       search: "",
//                       serviceReportNumberSearch: "",
//                     });
//                   }}
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
//                 // Page navigation is server-side. Already-loaded pages are
//                 // served from the in-memory cache without another GAS call.
//                 current: reportTableCurrentPage,
//                 pageSize: reportTablePageSize,
//                 total: reportTableTotal,
//                 disabled: loading,

//                 showSizeChanger: false,
//                 showQuickJumper: true,
//                 showTotal: (total, range) =>
//                   `${range[0]}-${range[1]} of ${total} records`,
//                 onChange: (page) => {
//                   fetchServiceReports({
//                     page,
//                     pageSize: reportTablePageSize,
//                     search: reportTableSearch,
//                     serviceReportNumberSearch:
//                       reportTableServiceReportNumberSearch,
//                     loadingMode: "load",
//                   });
//                 },
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
//             label="Trial / Status Remarks"
//             name="trialStatusRemarks"
//             rules={requiredRule("trial / status remarks")}
//           >
//             <TextArea
//               rows={2}
//               maxLength={250}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "trialStatusRemarks",
//                   "Trial / Status Remarks",
//                   e,
//                 )
//               }
//               onKeyDown={handleSectionTextKeyDown}
//             />
//           </Form.Item>

//           <SectionTitle title="8. PARTS USED / RECOMMENDED" />
//           <Table
//             bordered
//             pagination={false}
//             size="middle"
//             rowKey={(record) => record.key}
//             dataSource={editPartsData}
//             tableLayout="fixed"
//             scroll={{ x: 1120 }}
//             columns={[
//               {
//                 title: "Part No.",
//                 dataIndex: "partNo",
//                 width: 210,
//                 render: (_, record) => (
//                   <Tooltip title={record.partNo || "Enter the part number (maximum 22 characters)"} placement="topLeft">
//                   <Input
//                     value={record.partNo}
//                     maxLength={22}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(record.key, "partNo", e.target.value)
//                     }
//                   />
//                 </Tooltip>
//                 ),
//               },
//               {
//                 title: "Description",
//                 dataIndex: "description",
//                 width: 250,
//                 render: (_, record) => (
//                   <Tooltip title={record.description || "Enter the part description (maximum 30 characters)"} placement="topLeft">
//                   <Input
//                     value={record.description}
//                     maxLength={30}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(record.key, "description", e.target.value)
//                     }
//                   />
//                 </Tooltip>
//                 ),
//               },
//               {
//                 title: "Qty",
//                 dataIndex: "qty",
//                 width: 100,
//                 render: (_, record) => (
//                   <Tooltip title={record.qty || "Enter the quantity"} placement="topLeft">
//                   <Input
//                     value={record.qty}
//                     onChange={(e) =>
//                       updateEditPart(record.key, "qty", e.target.value)
//                     }
//                   />
//                 </Tooltip>
//                 ),
//               },
//               {
//                 title: "Used / Recommended",
//                 dataIndex: "usedRecommended",
//                 width: 270,
//                 render: (_, record) => (
//                   <Tooltip title={record.usedRecommended || "Enter whether the part was used or recommended (maximum 30 characters)"} placement="topLeft">
//                   <Input
//                     value={record.usedRecommended}
//                     maxLength={30}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(
//                         record.key,
//                         "usedRecommended",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </Tooltip>
//                 ),
//               },
//               {
//                 title: "Remarks",
//                 dataIndex: "remarks",
//                 width: 250,
//                 render: (_, record) => (
//                   <Tooltip title={record.remarks || "Enter remarks (maximum 30 characters)"} placement="topLeft">
//                   <Input
//                     value={record.remarks}
//                     maxLength={30}
//                     showCount
//                     onChange={(e) =>
//                       updateEditPart(record.key, "remarks", e.target.value)
//                     }
//                   />
//                 </Tooltip>
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
//               <Button type="dashed" onClick={addEditPart}>
//                 + Add Part
//               </Button>
//             </div> */}

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
//             label="Required Action / Follow-up"
//             name="requiredActionFollowUp"
//             rules={requiredRule("required action / follow-up")}
//           >
//             <TextArea
//               rows={2}
//               maxLength={250}
//               showCount
//               onChange={(e) =>
//                 handleEditSectionTextChange(
//                   "requiredActionFollowUp",
//                   "Required Action / Follow-up",
//                   e,
//                 )
//               }
//               onKeyDown={handleSectionTextKeyDown}
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
//               {editSaveLoading ? "Updating..." : "Update Changes"}
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
//           setPdfDownloadLoadingReportNumber("");
//           setViewModalOpen(false);
//           setViewReport(null);
//           setViewPartsData([]);
//           viewForm.resetFields();
//         }}
//         footer={null}
//         destroyOnHidden
//       >
//         {/* ============================================================
//         HEADER
//     ============================================================ */}

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
//           REPORT NUMBER + DOWNLOAD PDF
//       ========================================================== */}

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
//               SERVICE REPORT NUMBER
//           ====================================================== */}

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
//               DOWNLOAD PDF
//           ====================================================== */}

//               <Button
//                 type="primary"
//                 size="large"
//                 icon={<DownloadOutlined />}
//                 loading={
//                   pdfDownloadLoadingReportNumber ===
//                   String(viewReport?.["Service Report Number"] || "").trim()
//                 }
//                 onClick={downloadServiceReportPDF}
//                 style={{
//                   background: "#0D3884",
//                   borderColor: "#0D3884",
//                   fontWeight: 600,
//                   minHeight: "40px",
//                   flexShrink: 0,
//                 }}
//               >
//                 {pdfDownloadLoadingReportNumber ===
//                 String(viewReport?.["Service Report Number"] || "").trim()
//                   ? "Downloading..."
//                   : "Download PDF"}
//               </Button>
//             </div>
//           </div>

//           {/* ==========================================================
//           SECTION 1
//       ========================================================== */}

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
//           SECTION 2
//       ========================================================== */}

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
//           SECTION 3
//       ========================================================== */}

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
//           SECTION 4
//       ========================================================== */}

//           <ViewSectionTitle title="4. CUSTOMER COMPLAINT / REPORTED PROBLEM" />

//           <ViewLargeText name="customerComplaint" viewForm={viewForm} />

//           {/* ==========================================================
//           SECTION 5
//       ========================================================== */}

//           <ViewSectionTitle title="5. TECHNICIAN DIAGNOSIS / ROOT CAUSE" />

//           <ViewLargeText name="diagnosis" viewForm={viewForm} />

//           {/* ==========================================================
//           SECTION 6
//       ========================================================== */}

//           <ViewSectionTitle title="6. WORK PERFORMED / CORRECTIVE ACTION" />

//           <ViewLargeText name="workPerformed" viewForm={viewForm} />

//           {/* ==========================================================
//           SECTION 7
//       ========================================================== */}

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
//           SECTION 8
//       ========================================================== */}

//           <ViewSectionTitle title="8. PARTS USED / RECOMMENDED" />

//           <div
//             className="view-parts-table-responsive"
//             style={{
//               width: "100%",
//               maxWidth: "100%",
//               minWidth: 0,
//               overflowX: "auto",
//               overflowY: "hidden",
//             }}
//           >
//             <Table
//               bordered
//               pagination={false}
//               size="middle"
//               tableLayout="fixed"
//               rowKey={(record) => record.key}
//               dataSource={viewPartsData}
//               scroll={{ x: 1120 }}
//               columns={[
//                 {
//                   title: "Part No.",
//                   dataIndex: "Part No.",
//                   key: "Part No.",
//                   width: 190,
//                   ellipsis: true,
//                   render: (value) => (
//                     <Tooltip
//                       title={value == null || value === "" ? "No part number" : String(value)}
//                       placement="topLeft"
//                     >
//                       <span className="view-part-cell-text">
//                         {value == null || value === "" ? "—" : String(value)}
//                       </span>
//                     </Tooltip>
//                   ),
//                 },
//                 {
//                   title: "Description",
//                   dataIndex: "Description",
//                   key: "Description",
//                   width: 250,
//                   ellipsis: true,
//                   render: (value) => (
//                     <Tooltip
//                       title={value == null || value === "" ? "No description" : String(value)}
//                       placement="topLeft"
//                     >
//                       <span className="view-part-cell-text">
//                         {value == null || value === "" ? "—" : String(value)}
//                       </span>
//                     </Tooltip>
//                   ),
//                 },
//                 {
//                   title: "Qty",
//                   dataIndex: "Qty",
//                   key: "Qty",
//                   width: 100,
//                   align: "center",
//                   render: (value) => (
//                     <Tooltip
//                       title={value == null || value === "" ? "No quantity" : String(value)}
//                       placement="top"
//                     >
//                       <span className="view-part-cell-text">
//                         {value == null || value === "" ? "—" : String(value)}
//                       </span>
//                     </Tooltip>
//                   ),
//                 },
//                 {
//                   title: "Used / Recommended",
//                   dataIndex: "Used / Recommended",
//                   key: "Used / Recommended",
//                   width: 280,
//                   ellipsis: true,
//                   render: (value) => (
//                     <Tooltip
//                       title={value == null || value === "" ? "No used/recommended details" : String(value)}
//                       placement="topLeft"
//                     >
//                       <span className="view-part-cell-text">
//                         {value == null || value === "" ? "—" : String(value)}
//                       </span>
//                     </Tooltip>
//                   ),
//                 },
//                 {
//                   title: "Remarks",
//                   dataIndex: "Remarks",
//                   key: "Remarks",
//                   width: 250,
//                   ellipsis: true,
//                   render: (value) => (
//                     <Tooltip
//                       title={value == null || value === "" ? "No remarks" : String(value)}
//                       placement="topLeft"
//                     >
//                       <span className="view-part-cell-text">
//                         {value == null || value === "" ? "—" : String(value)}
//                       </span>
//                     </Tooltip>
//                   ),
//                 },
//               ]}
//               locale={{
//                 emptyText: "No parts recorded",
//               }}
//             />
//           </div>

//           {/* ==========================================================
//           SECTION 9
//       ========================================================== */}

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
//           SECTION 10
//       ========================================================== */}

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
//           SECTION 11
//       ========================================================== */}

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
//           SIGNATURES
//       ========================================================== */}

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
//           CLOSE
//       ========================================================== */}

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
//                 setPdfDownloadLoadingReportNumber("");
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
//         borderRadius: "10px",
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
  ExportOutlined,
  FormOutlined,
} from "@ant-design/icons";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import HaitianLogo from "../Images/HaitianLogo.png";
import "./../App.css";

// ============================================================
// RESTORE COMMERCIAL CLASSIFICATION CHECKBOXES
// Supports canonical checkbox values and older sheet column labels.
// Combines the saved JSON array with legacy Yes/No columns so one
// missing/stale source cannot hide a checked option.
// ============================================================
const getCommercialClassification = (report) => {
  const options = [
    {
      key: "focCommissioning",
      labels: ["focCommissioning", "F.O.C. Commissioning"],
    },
    { key: "focMaintenance", labels: ["focMaintenance", "F.O.C. Maintenance"] },
    { key: "warrantyService", labels: ["warrantyService", "Warranty Service"] },
    {
      key: "chargeableMaintenance",
      labels: ["chargeableMaintenance", "Chargeable Maintenance"],
    },
    {
      key: "customerVisitService",
      labels: ["customerVisitService", "Customer Visit (Service)"],
    },
    { key: "serviceContract", labels: ["serviceContract", "Service Contract"] },
    { key: "goodwill", labels: ["goodwill", "Goodwill"] },
    {
      key: "chargeableCommissioning",
      labels: [
        "chargeableCommissioning",
        "Chargeable commissioning",
        "Chargeable Commissioning",
      ],
    },
  ];

  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const isChecked = (value) =>
    value === true ||
    ["yes", "true", "1", "checked"].includes(
      String(value ?? "")
        .trim()
        .toLowerCase(),
    );

  const selected = new Set();
  let savedValues = report?.serviceCommercialClassification;

  if (!Array.isArray(savedValues)) {
    if (typeof savedValues === "string") {
      try {
        savedValues = JSON.parse(savedValues);
      } catch {
        savedValues = savedValues ? [savedValues] : [];
      }
    } else {
      savedValues = [];
    }
  }

  if (Array.isArray(savedValues)) {
    savedValues.forEach((savedValue) => {
      const normalizedSavedValue = normalize(savedValue);
      options.forEach((option) => {
        if (
          option.labels.some(
            (label) => normalize(label) === normalizedSavedValue,
          )
        ) {
          selected.add(option.key);
        }
      });
    });
  }

  // Also check individual columns returned by Apps Script / Google Sheets.
  options.forEach((option) => {
    if (option.labels.some((label) => isChecked(report?.[label]))) {
      selected.add(option.key);
    }
  });

  return Array.from(selected);
};

// ============================================================
// RESTORE ALL MULTI-SELECT CHECKBOX GROUPS
// Supports canonical keys, saved JSON arrays, display labels, and
// legacy Yes/No columns returned from Google Sheets.
// ============================================================
const getCheckboxSelections = (report, field, options) => {
  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  const isChecked = (value) =>
    value === true ||
    ["yes", "true", "1", "checked"].includes(
      String(value ?? "")
        .trim()
        .toLowerCase(),
    );
  const selected = new Set();
  let savedValues = report?.[field];
  if (!Array.isArray(savedValues)) {
    if (typeof savedValues === "string") {
      try {
        savedValues = JSON.parse(savedValues);
      } catch {
        savedValues = savedValues ? [savedValues] : [];
      }
    } else {
      savedValues = [];
    }
  }
  if (Array.isArray(savedValues)) {
    savedValues.forEach((saved) => {
      const normalized = normalize(saved);
      options.forEach((option) => {
        if (
          [option.key, ...option.labels].some(
            (label) => normalize(label) === normalized,
          )
        ) {
          selected.add(option.key);
        }
      });
    });
  }
  options.forEach((option) => {
    if (option.labels.some((label) => isChecked(report?.[label])))
      selected.add(option.key);
  });
  return Array.from(selected);
};

const serviceCategoryCheckboxOptions = [
  { key: "installation", labels: ["Installation / Commissioning"] },
  { key: "breakdown", labels: ["Breakdown / Defect"] },
  { key: "preventive", labels: ["Preventive Maintenance"] },
  { key: "corrective", labels: ["Corrective Maintenance"] },
  { key: "inspection", labels: ["Inspection"] },
  { key: "customerVisit", labels: ["Customer Visit"] },
  { key: "software", labels: ["Software / Program"] },
  { key: "other", labels: ["Other"] },
];
const machineTrialCheckboxOptions = [
  { key: "machineTestedSuccessfully", labels: ["Machine tested successfully"] },
  { key: "machineRunningNormally", labels: ["Machine running normally"] },
  { key: "runningWithObservation", labels: ["Running with observation"] },
  {
    key: "machineStopped",
    labels: ["Machine stopped - further action required"],
  },
  { key: "customerAdvised", labels: ["Customer advised / awaiting action"] },
];
const furtherActionCheckboxOptions = [
  { key: "noFurtherAction", labels: ["No further action required"] },
  { key: "partsRequired", labels: ["Parts required"] },
  { key: "followUpVisit", labels: ["Follow-up visit required"] },
  { key: "customerAction", labels: ["Customer action required"] },
  {
    key: "technicalSupportChina",
    labels: [
      "Technical support required from Haitian China",
      "Technical / spare support required from Haitian China",
    ],
  },
];

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
  "https://script.google.com/macros/s/AKfycbyGdsebBWo1LbOjHclpnFTi-Hb4fMBKIpPiZYOkW0h8z_DW4M7rcPjAc-vBxLhzGzWx/exec";

// ============================================================
// CENTRAL GOOGLE APPS SCRIPT REQUEST HELPER
// ============================================================
// GET requests may be retried because they are read-only.
// POST requests are NOT retried by default because save/update/PDF
// operations are not safe to repeat blindly after a lost response.
// A 404 is treated as a deployment/configuration problem and is
// never retried.
// ============================================================
const gasRequest = async ({
  action,
  method = "GET",
  data = {},
  retries = method === "GET" ? 0 : 0,
  timeoutMs = method === "GET" ? 20000 : 60000,
}) => {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      let response;

      if (method === "GET") {
        const params = new URLSearchParams();
        params.append("action", action);
        Object.entries(data || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null)
            params.append(key, String(value));
        });

        response = await fetch(`${GAS_URL}?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
      } else {
        const formData = new URLSearchParams();
        formData.append("action", action);
        Object.entries(data || {}).forEach(([key, value]) => {
          formData.append(key, value == null ? "" : String(value));
        });

        response = await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
          signal: controller.signal,
        });
      }

      if (response.status === 404) {
        const error = new Error(
          `Google Apps Script Web App returned HTTP 404. The /exec deployment URL is invalid, deleted, restricted, or this frontend is using an old deployment.\n\nCurrent URL:\n${GAS_URL}`,
        );
        error.code = "GAS_DEPLOYMENT_404";
        error.retryable = false;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(`Server returned HTTP ${response.status}`);
        error.retryable = response.status === 429 || response.status >= 500;
        throw error;
      }

      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error("Google Apps Script returned invalid JSON.");
      }

      if (!result || typeof result !== "object") {
        throw new Error("Server returned an invalid response.");
      }

      if (!result.success) {
        const error = new Error(result.message || "Server request failed.");
        error.retryable = false;
        throw error;
      }

      return result;
    } catch (error) {
      if (error?.name === "AbortError") {
        lastError = new Error(
          `Google Apps Script request timed out after ${Math.round(timeoutMs / 1000)} seconds (${action}).`,
        );
        lastError.retryable = true;
      } else {
        lastError = error;
      }

      const shouldRetry = attempt < retries && lastError?.retryable !== false;
      if (!shouldRetry) break;

      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error("Server request failed.");
};

// ============================================================
// PDF GENERATION - V2
// Fixed 2-page A4 layout based on the supplied Haitian reference.
// ============================================================

const PDF_BLUE = "#0D3884";
const PDF_LIGHT_BLUE = "#DCEAF5";
const PDF_PALE_BLUE = "#F1F6FA";
const PDF_BORDER = "#B8C8D3";
const PDF_TEXT = "#111111";

const pdfSafe = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

// ============================================================
// SAVE GENERATED PDF LOCALLY
// ============================================================
// jsPDF's doc.save() triggers the browser download. It is kept
// as a separate helper so BOTH new-report and edit-report flows
// use exactly the same local-save logic.
// IMPORTANT: this must run BEFORE the Drive upload.
// ============================================================
const savePdfLocally = async (pdfResult) => {
  if (!pdfResult?.doc) {
    throw new Error("Generated PDF document is missing.");
  }

  const fileName = String(pdfResult.fileName || "").trim();

  if (!fileName) {
    throw new Error("Generated PDF file name is missing.");
  }

  // Make sure the PDF document actually contains pages before saving.
  const pageCount = Number(pdfResult.doc.getNumberOfPages?.() || 0);

  if (pageCount < 1) {
    throw new Error("Generated PDF contains no pages.");
  }

  try {
    // This triggers the browser's normal Save/Download behavior.
    pdfResult.doc.save(fileName);

    // No artificial delay here. The browser starts the download
    // immediately and the Drive upload can begin without waiting.
    console.log("PDF saved locally:", fileName);

    return fileName;
  } catch (error) {
    throw new Error(
      `Unable to save PDF locally: ${error?.message || "Unknown browser download error"}`,
    );
  }
};

// ============================================================
// VERIFY PDF IN GOOGLE DRIVE AFTER A LOST UPLOAD RESPONSE
// ============================================================
const verifyUploadedPdfInDrive = async (pdfResult, serviceReportNumber) => {
  const reportNumber = String(
    pdfResult?.reportNumber || serviceReportNumber || "",
  ).trim();
  const fileName = String(pdfResult?.fileName || "").trim();

  if (!reportNumber && !fileName) return null;

  try {
    const verification = await gasRequest({
      action: "verifyPdf",
      method: "GET",
      data: {
        ...(reportNumber ? { serviceReportNumber: reportNumber } : {}),
        ...(fileName ? { fileName } : {}),
      },
      retries: 1,
    });

    if (!verification?.success || !verification?.fileId) {
      return null;
    }

    return {
      success: true,
      fileId: verification.fileId,
      fileName: verification.fileName || fileName,
      fileUrl: verification.fileUrl || "",
      fileSize: Number(verification.fileSize || 0),
      verifiedAfterLostUploadResponse: true,
      message: "PDF upload completed and was verified in Google Drive.",
    };
  } catch (verificationError) {
    console.warn("Google Drive PDF verification failed:", verificationError);
    return null;
  }
};

// ============================================================
// RELIABLE PDF UPLOAD
// ============================================================
// PDF upload is recovered on any transport failure. We verify Drive
// before retrying so a lost response is never shown as a false failure.
// The backend upload is idempotent by exact filename.
// ============================================================
const uploadPdfWithRecovery = async (pdfResult, serviceReportNumber) => {
  const reportNumber = String(
    pdfResult?.reportNumber || serviceReportNumber || "",
  ).trim();

  const uploadData = {
    fileName: pdfResult.fileName,
    pdfBase64: pdfResult.pdfBase64,
    serviceReportNumber: reportNumber,
    replaceExisting: "false",
  };

  let firstError = null;

  try {
    const result = await gasRequest({
      action: "uploadPdf",
      method: "POST",
      data: uploadData,
      retries: 0,
      timeoutMs: 120000,
    });

    if (result?.success === true && result?.fileId) return result;
    firstError = new Error(
      result?.message || "Google Drive did not confirm the PDF upload.",
    );
  } catch (error) {
    firstError = error;
  }

  // The request may have timed out AFTER Drive created the file.
  const verified = await verifyUploadedPdfInDrive(pdfResult, reportNumber);
  if (verified?.success && verified?.fileId) return verified;

  // Retry once only when verification says the file does not exist.
  try {
    const retryResult = await gasRequest({
      action: "uploadPdf",
      method: "POST",
      data: uploadData,
      retries: 0,
      timeoutMs: 120000,
    });

    if (retryResult?.success === true && retryResult?.fileId) {
      return retryResult;
    }

    throw new Error(
      retryResult?.message || "Retry upload was not confirmed by Google Drive.",
    );
  } catch (retryError) {
    // Final verification covers a response lost after the retry.
    const finalVerification = await verifyUploadedPdfInDrive(
      pdfResult,
      reportNumber,
    );

    if (finalVerification?.success && finalVerification?.fileId) {
      return finalVerification;
    }

    throw new Error(
      `PDF upload could not be confirmed. ${
        retryError?.message || firstError?.message || "Unknown upload error"
      }`,
    );
  }
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
      limitedValue = value.slice(0, 22);
    } else if (field === "description") {
      limitedValue = value.slice(0, 30);
    } else if (field === "usedRecommended" || field === "remarks") {
      limitedValue = value.slice(0, 30);
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
  const [reportTableSearchLoading, setReportTableSearchLoading] =
    useState(false);
  // Controls the refresh button label so search and manual refresh are distinct.
  const [reportTableLoadingMode, setReportTableLoadingMode] = useState("idle");
  const [reportExcelExportLoading, setReportExcelExportLoading] =
    useState(false);

  // ============================================================
  // SERVICE REPORT TABLE UI STATE
  // ============================================================
  const [reportTableSearch, setReportTableSearch] = useState("");
  const [
    reportTableServiceReportNumberSearch,
    setReportTableServiceReportNumberSearch,
  ] = useState("");
  const [reportTablePageSize, setReportTablePageSize] = useState(10);
  const [reportTableCurrentPage, setReportTableCurrentPage] = useState(1);
  const [reportTableTotal, setReportTableTotal] = useState(0);
  const reportSearchTimerRef = useRef(null);

  // Prevent an older/slower pagination response from overwriting a newer
  // page requested by the user.
  const reportTableRequestSequenceRef = useRef(0);

  // ------------------------------------------------------------
  // REPORT PAGE CACHE / PREFETCH
  // ------------------------------------------------------------
  // Keeps already fetched report pages in memory and preloads the
  // next page in the background. This prevents the user from waiting
  // for a new Google Apps Script request every time pagination changes.
  // Cache entries expire quickly so report data does not remain stale.
  const reportPageCacheRef = useRef(new Map());
  const reportPageRequestRef = useRef(new Map());

  // Session-lifetime page cache.
  // Pages stay cached while this ServiceForm is open and are invalidated
  // explicitly after save/edit or by the Refresh button.
  //
  // IMPORTANT:
  // Do NOT use a short TTL here. A 30-second TTL caused already-loaded
  // pages to be fetched from Google Apps Script again after some time.
  const getReportPageCacheKey = (
    page,
    pageSize,
    search,
    serviceReportNumberSearch,
  ) =>
    `${Number(page) || 1}|${Number(pageSize) || 10}|${String(search || "")
      .trim()
      .toLowerCase()}|${String(serviceReportNumberSearch || "")
      .trim()
      .toLowerCase()}`;

  const hasCachedReportPage = (
    page,
    pageSize,
    search,
    serviceReportNumberSearch,
  ) => {
    const cacheKey = getReportPageCacheKey(
      page,
      pageSize,
      search,
      serviceReportNumberSearch,
    );
    return reportPageCacheRef.current.has(cacheKey);
  };

  // Explicit invalidation is used after data mutations or manual refresh.
  // This is safer than time-based expiry because cache freshness is tied
  // to actual application changes rather than an arbitrary number of seconds.
  const clearReportPageCache = () => {
    reportPageCacheRef.current.clear();
  };

  const [viewReport, setViewReport] = useState(null);
  const [editReport, setEditReport] = useState(null);
  const [viewPartsData, setViewPartsData] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // Track the Service Report Number currently downloading.
  // This prevents the PDF loading state from leaking between View records.
  const [pdfDownloadLoadingReportNumber, setPdfDownloadLoadingReportNumber] =
    useState("");
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

  const applyCustomerCache = (rows) => {
    const sourceRows = Array.isArray(rows) ? rows : [];
    const normalizedData = sourceRows
      .map((item) => {
        const name = String(
          item?.["Customer"] || item?.["Customer Name"] || "",
        ).trim();
        const addressValue = String(
          item?.["Site / Location"] || item?.["Address"] || "",
        ).trim();
        const contactValue = String(
          item?.["Contact Person"] || item?.["Contact"] || "",
        ).trim();
        const telephoneValue = String(
          item?.["Contact No."] || item?.["Telephone"] || "",
        ).trim();
        const machineValue = String(
          item?.["Machine Model"] || item?.["Machine Type"] || "",
        ).trim();
        const serialValue = String(
          item?.["Serial No."] || item?.["Serial Number"] || "",
        ).trim();
        const installationValue = String(
          item?.["Installation year"] || item?.["Installation Date"] || "",
        ).trim();

        return {
          ...item,
          Customer: name,
          "Customer Name": name,
          "Site / Location": addressValue,
          Address: addressValue,
          "Contact Person": contactValue,
          Contact: contactValue,
          "Contact No.": telephoneValue,
          Telephone: telephoneValue,
          "Machine Model": machineValue,
          "Machine Type": machineValue,
          "Serial No.": serialValue,
          "Serial Number": serialValue,
          "Installation year": installationValue,
          "Installation Date": installationValue,
        };
      })
      .filter((item) => item.Customer !== "");

    // Keep the newest report for each customer. Report rows are in
    // sheet order, so walking backwards preserves the latest data.
    const seen = new Map();
    for (let i = normalizedData.length - 1; i >= 0; i -= 1) {
      const item = normalizedData[i];
      const key = item.Customer.toLowerCase();
      if (!seen.has(key)) seen.set(key, item);
    }

    const uniqueSorted = Array.from(seen.values()).sort((a, b) =>
      a.Customer.localeCompare(b.Customer),
    );

    setCustomerDataList(uniqueSorted);
    setCustomerOptions(uniqueSorted.map((item) => item.Customer));
  };

  // ============================================================
  // FAST SERVER-SIDE REPORT LOADING
  // ============================================================
  // The old implementation downloaded every report into the browser
  // before Ant Design could render page 1. The backend now returns only
  // the requested page and a total count.
  // ============================================================

  // Request one report page from Google Apps Script.
  // The promise is shared when the same page is requested more than once
  // while the first request is still running.
  const requestReportPage = async ({
    page,
    pageSize,
    search,
    serviceReportNumberSearch,
    forceFresh = false,
  }) => {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedPageSize = Math.max(1, Number(pageSize) || 10);
    const normalizedSearch = String(search || "").trim();
    const normalizedServiceReportNumberSearch = String(
      serviceReportNumberSearch || "",
    ).trim();
    const cacheKey = getReportPageCacheKey(
      normalizedPage,
      normalizedPageSize,
      normalizedSearch,
      normalizedServiceReportNumberSearch,
    );

    // A cached page is valid until the application explicitly invalidates it.
    // This makes repeated navigation between pages instant.
    const cached = !forceFresh
      ? reportPageCacheRef.current.get(cacheKey)
      : null;
    if (cached) {
      return cached.data;
    }

    const existingRequest = !forceFresh
      ? reportPageRequestRef.current.get(cacheKey)
      : null;
    if (existingRequest) {
      return existingRequest;
    }

    const requestPromise = gasRequest({
      action: "getServiceReportsPage",
      method: "GET",
      data: {
        page: normalizedPage,
        pageSize: normalizedPageSize,
        search: normalizedSearch,
        serviceReportNumber: normalizedServiceReportNumberSearch,
        userEmail: String(user?.email || "").trim(),
        access: String(user?.access || "").trim(),
      },
      retries: 0,
    })
      .then((result) => {
        const data = {
          reports: Array.isArray(result.reports) ? result.reports : [],
          total: Number(result.total || 0),
          page: Number(result.page || normalizedPage),
        };

        reportPageCacheRef.current.set(cacheKey, {
          timestamp: Date.now(),
          data,
        });

        return data;
      })
      .finally(() => {
        // Do not let an older request remove a newer request for the same key.
        if (reportPageRequestRef.current.get(cacheKey) === requestPromise) {
          reportPageRequestRef.current.delete(cacheKey);
        }
      });

    // Forced refreshes bypass both cache and request deduplication.
    if (!forceFresh) {
      reportPageRequestRef.current.set(cacheKey, requestPromise);
    }
    return requestPromise;
  };

  // Preload the next page without showing the table loading spinner.
  // This runs in the background and does not block the current page.
  const prefetchReportPage = ({
    page,
    pageSize,
    search,
    serviceReportNumberSearch,
  }) => {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedPageSize = Math.max(1, Number(pageSize) || 10);
    const normalizedSearch = String(search || "").trim();
    const normalizedServiceReportNumberSearch = String(
      serviceReportNumberSearch || "",
    ).trim();
    const cacheKey = getReportPageCacheKey(
      normalizedPage,
      normalizedPageSize,
      normalizedSearch,
      normalizedServiceReportNumberSearch,
    );

    // Do not prefetch a page that is already cached or currently loading.
    if (reportPageCacheRef.current.has(cacheKey)) {
      return;
    }

    if (reportPageRequestRef.current.has(cacheKey)) {
      return;
    }

    requestReportPage({
      page: normalizedPage,
      pageSize: normalizedPageSize,
      search: normalizedSearch,
      serviceReportNumberSearch: normalizedServiceReportNumberSearch,
    }).catch((error) => {
      // Prefetch is an optimization only. Never show an error notification
      // when a background prefetch fails; normal pagination will retry it.
      console.debug("Report page prefetch skipped:", error);
    });
  };

  const fetchServiceReports = async ({
    page = reportTableCurrentPage,
    pageSize = reportTablePageSize,
    search = reportTableSearch,
    serviceReportNumberSearch = reportTableServiceReportNumberSearch,
    showError = true,
    useCache = true,
    prefetchNext = true,
    silent = false,
    loadingMode,
  } = {}) => {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedPageSize = Math.max(1, Number(pageSize) || 10);
    const normalizedSearch = String(search || "").trim();
    const normalizedServiceReportNumberSearch = String(
      serviceReportNumberSearch || "",
    ).trim();

    const requestLoadingMode = loadingMode || "load";
    // Only explicit search actions should show Searching...; page navigation
    // must not make the Refresh button look like it is refreshing.
    setReportTableLoadingMode(requestLoadingMode);
    setReportTableSearchLoading(requestLoadingMode === "search");

    const cacheKey = getReportPageCacheKey(
      normalizedPage,
      normalizedPageSize,
      normalizedSearch,
      normalizedServiceReportNumberSearch,
    );

    // Every user-initiated page request gets a sequence number.
    // If the user clicks Page 2 and immediately clicks Page 3, a slower
    // Page 2 response can no longer overwrite the newer Page 3 result.
    reportTableRequestSequenceRef.current += 1;
    const requestSequence = reportTableRequestSequenceRef.current;

    const pageAlreadyCached =
      useCache &&
      hasCachedReportPage(
        normalizedPage,
        normalizedPageSize,
        normalizedSearch,
        normalizedServiceReportNumberSearch,
      );

    // Cached pages render without a loading spinner.
    // A silent refresh is used after a new record is saved so the table can
    // refresh in the background while PDF generation/upload continues.
    if (!pageAlreadyCached && !silent) {
      setReportTableLoading(true);
    }

    try {
      let pageData;

      if (useCache) {
        pageData = await requestReportPage({
          page: normalizedPage,
          pageSize: normalizedPageSize,
          search: normalizedSearch,
          serviceReportNumberSearch: normalizedServiceReportNumberSearch,
        });
      } else {
        // Refresh must always fetch fresh data.
        reportPageCacheRef.current.delete(cacheKey);

        pageData = await requestReportPage({
          page: normalizedPage,
          pageSize: normalizedPageSize,
          search: normalizedSearch,
          serviceReportNumberSearch: normalizedServiceReportNumberSearch,
          forceFresh: true,
        });
      }

      // Ignore an older response if the user has already requested another
      // page. This prevents pagination race conditions.
      if (requestSequence !== reportTableRequestSequenceRef.current) {
        return Array.isArray(pageData?.reports) ? pageData.reports : [];
      }

      const reports = Array.isArray(pageData.reports) ? pageData.reports : [];

      setReportData(reports);
      setReportTableTotal(Number(pageData.total || 0));
      setReportTableCurrentPage(Number(pageData.page || normalizedPage));

      // Once the current page is available, silently prepare the next page.
      if (prefetchNext && reports.length > 0) {
        const nextPage = normalizedPage + 1;
        const total = Number(pageData.total || 0);

        if (nextPage <= Math.ceil(total / normalizedPageSize)) {
          // Let React paint the current page before the background request.
          window.setTimeout(() => {
            prefetchReportPage({
              page: nextPage,
              pageSize: normalizedPageSize,
              search: normalizedSearch,
              serviceReportNumberSearch: normalizedServiceReportNumberSearch,
            });
          }, 150);
        }
      }

      return reports;
    } catch (error) {
      // If this response is no longer the latest request, do not replace
      // the current page with an error state from an older request.
      if (requestSequence !== reportTableRequestSequenceRef.current) {
        return [];
      }

      console.error("Failed to fetch service reports:", error);

      if (showError) {
        notification.error({
          message: "Error",
          description: error.message || "Failed to load service reports.",
          placement: "bottomRight",
        });
      }

      setReportData([]);
      setReportTableTotal(0);
      return [];
    } finally {
      // Only the latest non-silent request is allowed to turn loading off.
      if (requestSequence === reportTableRequestSequenceRef.current) {
        setReportTableSearchLoading(false);
        setReportTableLoadingMode("idle");
        if (!silent) setReportTableLoading(false);
      }
    }
  };

  const loadInitialData = async () => {
    // Startup order:
    // 1) Load the next SRN first.
    // 2) After the SRN request settles, start customer data immediately.
    // 3) Start the report table independently; it must never gate customers.
    setSrnLoading(true);
    setReportTableLoading(false);
    setReportTableSearchLoading(false);

    try {
      const srnResult = await gasRequest({
        action: "getNextServiceReportNumber",
        method: "GET",
        retries: 0,
        timeoutMs: 20000,
      });

      const nextSRN = srnResult.serviceReportNumber ?? srnResult.srn ?? "";
      if (String(nextSRN).trim() === "") {
        throw new Error(
          "The backend did not return the next Service Report Number.",
        );
      }
      setServiceReportNumber(String(nextSRN));
    } catch (error) {
      console.error("Next service report number failed to load:", error);
      setServiceReportNumber("");
      notification.error({
        message: "Service Report Number Error",
        description:
          error.message || "Unable to load the next Service Report Number.",
        placement: "bottomRight",
        duration: 8,
      });
    } finally {
      setSrnLoading(false);
    }

    // Start customer loading immediately after the SRN request settles.
    // Do not await this promise: customer data and the table can load at the
    // same time, and a slow/failing table request cannot block customer data.
    const customerLoadPromise = gasRequest({
      action: "getAllCustomerData",
      method: "GET",
      retries: 1,
      timeoutMs: 30000,
    })
      .then((result) => {
        const customers = Array.isArray(result?.customers)
          ? result.customers
          : [];
        applyCustomerCache(customers);
        return customers;
      })
      .catch((error) => {
        console.error("Customer suggestions failed to load:", error);
        // Keep the rest of the page usable if customer suggestions fail.
        return [];
      });

    // Load report-table page 1 independently of the customer request.
    setReportTableLoading(true);
    try {
      const firstPage = await requestReportPage({
        page: 1,
        pageSize: reportTablePageSize,
        search: "",
        serviceReportNumberSearch: "",
      });

      const reports = Array.isArray(firstPage.reports) ? firstPage.reports : [];
      const total = Number(firstPage.total || 0);
      setReportData(reports);
      setReportTableTotal(total);
      setReportTableCurrentPage(1);

      const initialPageData = { reports, total, page: 1 };
      reportPageCacheRef.current.set(
        getReportPageCacheKey(1, reportTablePageSize, "", ""),
        { timestamp: Date.now(), data: initialPageData },
      );

      if (reports.length > 0 && total > reportTablePageSize) {
        window.setTimeout(() => {
          prefetchReportPage({
            page: 2,
            pageSize: reportTablePageSize,
            search: "",
            serviceReportNumberSearch: "",
          });
        }, 150);
      }
    } catch (error) {
      console.error("Initial service report page load failed:", error);
      notification.error({
        message: "Service Report Table Error",
        description:
          error.message || "Unable to load service reports. Please try again.",
        placement: "bottomRight",
        duration: 8,
      });
      setReportData([]);
      setReportTableTotal(0);
    } finally {
      setReportTableLoading(false);
    }

    // The promise has its own catch above. Intentionally do not await it so
    // table completion does not control customer loading or customer autofill.
    void customerLoadPromise;
  };

  useEffect(() => {
    loadInitialData();

    return () => {
      if (reportSearchTimerRef.current) {
        clearTimeout(reportSearchTimerRef.current);
      }

      // Invalidate any in-flight response before clearing the maps.
      reportTableRequestSequenceRef.current += 1;
      clearReportPageCache();
      reportPageRequestRef.current.clear();
    };
    // User is established before ServiceForm is mounted in the existing app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleReportTableSearch = ({ search, serviceReportNumberSearch }) => {
    if (reportSearchTimerRef.current) {
      clearTimeout(reportSearchTimerRef.current);
    }

    // Invalidate an older in-flight response immediately when the user changes
    // the search, not only after the debounce delay.
    reportTableRequestSequenceRef.current += 1;
    setReportTableSearchLoading(true);
    setReportTableLoadingMode("search");

    reportSearchTimerRef.current = setTimeout(() => {
      fetchServiceReports({
        page: 1,
        pageSize: reportTablePageSize,
        search: String(search || ""),
        serviceReportNumberSearch: String(serviceReportNumberSearch || ""),
        showError: false,
        loadingMode: "search",
      });
    }, 350);
  };

  const handleReportSearchChange = (value) => {
    const nextSearch = String(value || "");
    setReportTableSearch(nextSearch);
    scheduleReportTableSearch({
      search: nextSearch,
      serviceReportNumberSearch: reportTableServiceReportNumberSearch,
    });
  };

  const handleServiceReportNumberSearchChange = (value) => {
    const nextSearch = String(value || "").trim();
    setReportTableServiceReportNumberSearch(nextSearch);
    scheduleReportTableSearch({
      search: reportTableSearch,
      serviceReportNumberSearch: nextSearch,
    });
  };

  const downloadServiceReportPDFByNumber = async (
    reportNumber,
    fileName = "",
  ) => {
    const normalizedReportNumber = String(reportNumber || "").trim();

    if (!normalizedReportNumber) {
      throw new Error("Service Report Number is missing.");
    }

    // If the caller already knows the exact PDF filename, send it.
    // This is used by the edit flow and prevents filename mismatches.
    const normalizedFileName = String(fileName || "").trim();

    const result = await gasRequest({
      action: "downloadPdf",
      method: "POST",
      data: {
        serviceReportNumber: normalizedReportNumber,
        ...(normalizedFileName ? { fileName: normalizedFileName } : {}),
      },
      retries: 0,
    });

    if (!result.pdfBase64) {
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

    // IMPORTANT:
    // Store the exact SRN being downloaded. This prevents the loading
    // state from leaking into another record when the user opens it.
    setPdfDownloadLoadingReportNumber(reportNumber);

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
      // Only clear the state if this same report is still marked as
      // downloading. If the user already opened another record, do not
      // disturb that record's state.
      setPdfDownloadLoadingReportNumber((current) =>
        current === reportNumber ? "" : current,
      );
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

    const serviceCategory = getCheckboxSelections(
      viewReport,
      "serviceCategory",
      serviceCategoryCheckboxOptions,
    );

    const machineTrialStatus = getCheckboxSelections(
      viewReport,
      "machineTrialStatus",
      machineTrialCheckboxOptions,
    );

    const furtherAction = getCheckboxSelections(
      viewReport,
      "furtherAction",
      furtherActionCheckboxOptions,
    );

    const serviceCommercialClassification =
      getCommercialClassification(viewReport);

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

    const serviceCategory = getCheckboxSelections(
      editReport,
      "serviceCategory",
      serviceCategoryCheckboxOptions,
    );

    const machineTrialStatus = getCheckboxSelections(
      editReport,
      "machineTrialStatus",
      machineTrialCheckboxOptions,
    );

    const furtherAction = getCheckboxSelections(
      editReport,
      "furtherAction",
      furtherActionCheckboxOptions,
    );

    const commercial = getCommercialClassification(editReport);

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
  // Part No. = 22, Description = 30, Used / Recommended = 30, Remarks = 30
  // ============================================================
  const updateEditPart = (key, field, value) => {
    let limitedValue = typeof value === "string" ? value : "";

    if (field === "partNo") {
      limitedValue = limitedValue.slice(0, 22);
    } else if (field === "description") {
      limitedValue = limitedValue.slice(0, 30);
    } else if (field === "usedRecommended" || field === "remarks") {
      limitedValue = limitedValue.slice(0, 30);
    }

    setEditPartsData((current) =>
      current.map((part) =>
        part.key === key ? { ...part, [field]: limitedValue } : part,
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
    // Send the SRN so Apps Script can replace any previous PDF
    // belonging to this same service report, even if the customer
    // name changed during the edit.

    try {
      return await gasRequest({
        action: "uploadPdf",
        method: "POST",
        data: {
          fileName: pdfResult.fileName,
          pdfBase64: pdfResult.pdfBase64,
          replaceExisting: "true",
          serviceReportNumber: String(pdfResult.reportNumber || ""),
        },
        retries: 0,
      });
    } catch (uploadError) {
      const uploadMessage = String(uploadError?.message || "");
      const lostResponse =
        uploadMessage.includes("HTTP 404") ||
        uploadMessage.includes("production deployment is unavailable") ||
        uploadMessage.includes("Server returned HTTP 404");

      if (lostResponse) {
        const verified = await verifyUploadedPdfInDrive(
          pdfResult,
          pdfResult.reportNumber,
        );
        if (verified) return verified;
      }

      throw uploadError;
    }
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

      const result = await gasRequest({
        action: "updateReport",
        method: "POST",
        data: payload,
        retries: 0,
      });

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

      // ======================================================
      // STEP 1 — SAVE EDITED PDF LOCALLY FIRST
      // ======================================================

      await savePdfLocally(pdfResult);

      // ======================================================
      // STEP 2 — UPLOAD THE SAME PDF TO GOOGLE DRIVE
      // ======================================================

      const editPdfUploadResult = await uploadEditedServiceReportPDF(pdfResult);

      if (
        !editPdfUploadResult ||
        editPdfUploadResult.success !== true ||
        !editPdfUploadResult.fileId
      ) {
        throw new Error(
          editPdfUploadResult?.message ||
            "PDF was saved locally, but Google Drive did not confirm the updated PDF upload.",
        );
      }

      notification.success({
        message: "Report Updated",
        description: `Service Report ${reportNumber} was updated and its PDF was regenerated successfully.`,
        placement: "bottomRight",
      });

      // Update the report table locally. No full report/customer fetch
      // is needed after an edit because the backend returns the updated
      // report object.
      const updatedReport = result.report || {
        ...(editReport || {}),
        "Service Report Number": String(reportNumber),
        Customer: values.customer || "",
        "Site / Location": values.siteLocation || "",
        "Contact Person": values.contactPerson || "",
        "Contact No.": values.contactNo || "",
        "Machine Model": values.machineModel || "",
        "Serial No.": values.serialNo || "",
        "Installation year": values.installationYear || "",
      };

      // The edited record may belong to a prefetched page. Invalidate the
      // report-page cache before updating the visible page locally.
      clearReportPageCache();

      setReportData((previous) => {
        const next = previous.map((item) =>
          String(item?.["Service Report Number"] || "").trim() ===
          String(reportNumber).trim()
            ? updatedReport
            : item,
        );
        applyCustomerCache(next);
        return next;
      });

      closeEditModal(true);
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
    String(user?.access || "")
      .trim()
      .toLowerCase() === "admin" || loggedInUserEmail === "admin@haitianme.com";

  // Backend now performs visibility filtering, search, sorting and paging.
  // Keep this variable name so the existing table rendering remains stable.
  const filteredAndSortedReportData = reportData;

  // ============================================================
  // EXPORT SERVICE REPORT TABLE TO EXCEL
  // Exports ALL records matching the current table search, not just
  // the currently visible server-paginated page. Uses the same backend
  // visibility rules (userEmail/access) as normal table loading.
  // ============================================================
  const handleExportServiceReportsToExcel = async () => {
    if (reportExcelExportLoading) return;

    setReportExcelExportLoading(true);
    try {
      const search = String(reportTableSearch || "").trim();
      const serviceReportNumberSearch = String(
        reportTableServiceReportNumberSearch || "",
      ).trim();
      const pageSize = 100;
      let page = 1;
      let total = 0;
      const allReports = [];
      const maxPages = 10000;

      // Fetch in pages to avoid loading every record during normal table use.
      // The export alone requests every page matching the current filters.
      while (page <= maxPages) {
        const result = await gasRequest({
          action: "getServiceReportsPage",
          method: "GET",
          data: {
            page,
            pageSize,
            search,
            serviceReportNumber: serviceReportNumberSearch,
            userEmail: String(user?.email || "").trim(),
            access: String(user?.access || "").trim(),
          },
          retries: 0,
          timeoutMs: 60000,
        });

        const rows = Array.isArray(result.reports) ? result.reports : [];
        total = Number(result.total || 0);
        if (!rows.length) break;
        allReports.push(...rows);

        if (total > 0 && allReports.length >= total) break;
        page += 1;
      }

      if (!allReports.length) {
        notification.warning({
          message: "No Data",
          description: "No service report data was found to export.",
          placement: "bottomRight",
        });
        return;
      }

      // Sort the report objects by Service Report Number in ascending order.
      // Numeric-aware comparison handles values such as SRN-2 before SRN-10.
      // Reports with a missing SRN are kept at the end.
      const getExportSrn = (record) =>
        String(
          record?.["Service Report Number"] ??
            record?.serviceReportNumber ??
            record?.srn ??
            "",
        )
          .trim()
          .replace(/^'/, "");

      allReports.sort((a, b) => {
        const srnA = getExportSrn(a);
        const srnB = getExportSrn(b);

        if (!srnA && srnB) return 1;
        if (srnA && !srnB) return -1;
        if (!srnA && !srnB) return 0;

        return srnA.localeCompare(srnB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      // Export the complete service-report dataset using the full column
      // layout requested from the previous project. Do not stop at Parts Used.
      const columns = [
        { title: "Service Report Number", key: "Service Report Number" },
        { title: "Customer", key: "Customer" },
        { title: "Service Date", key: "Service Date" },
        { title: "Site / Location", key: "Site / Location" },
        { title: "Contact Person", key: "Contact Person" },
        { title: "Contact No.", key: "Contact No." },
        { title: "Technician", key: "Technician" },
        { title: "Arrival Time", key: "Arrival Time" },
        { title: "Completion Time", key: "Completion Time" },
        { title: "Total Working Hours", key: "Total Working Hours" },
        { title: "Service Visit Ref.", key: "Service Visit Ref." },
        { title: "Machine Model", key: "Machine Model" },
        { title: "Serial No.", key: "Serial No." },
        { title: "Installation year", key: "Installation year" },
        { title: "Machine Running Hours", key: "Machine Running Hours" },
        { title: "Controller", key: "Controller" },
        { title: "Warranty Status", key: "Warranty Status" },
        {
          title: "Installation / Commissioning",
          key: "Installation / Commissioning",
        },
        { title: "Breakdown / Defect", key: "Breakdown / Defect" },
        { title: "Preventive Maintenance", key: "Preventive Maintenance" },
        { title: "Corrective Maintenance", key: "Corrective Maintenance" },
        { title: "Inspection", key: "Inspection" },
        { title: "Customer Visit", key: "Customer Visit" },
        { title: "Software / Program", key: "Software / Program" },
        { title: "Other", key: "Other" },
        {
          title: "Customer complaint / reported problem",
          key: "Customer complaint / reported problem",
        },
        {
          title: "Technician diagnosis/root cause",
          key: "Technician diagnosis/root cause",
        },
        {
          title: "Work performed / corrective action",
          key: "Work performed / corrective action",
        },
        {
          title: "Machine tested successfully",
          key: "Machine tested successfully",
        },
        { title: "Machine running normally", key: "Machine running normally" },
        { title: "Running with observation", key: "Running with observation" },
        {
          title: "Machine stopped - further action required",
          key: "Machine stopped - further action required",
        },
        {
          title: "Customer advised / awaiting action",
          key: "Customer advised / awaiting action",
        },
        { title: "Trial Duration", key: "Trial Duration" },
        { title: "Cycle Time", key: "Cycle Time" },
        { title: "Product / Material", key: "Product / Material" },
        { title: "Trial / Status Remarks", key: "Trial / Status Remarks" },
        { title: "Part No.", key: "Part No." },
        { title: "Description", key: "Description" },
        { title: "Qty", key: "Qty" },
        { title: "Used / Recommended", key: "Used / Recommended" },
        { title: "Remarks", key: "Remarks" },
        {
          title: "No further action required",
          key: "No further action required",
        },
        { title: "Parts required", key: "Parts required" },
        { title: "Follow-up visit required", key: "Follow-up visit required" },
        { title: "Customer action required", key: "Customer action required" },
        {
          title: "Technical support required from Haitian China",
          key: "Technical support required from Haitian China",
        },
        {
          title: "Required Action / Follow-up",
          key: "Required Action / Follow-up",
        },
        { title: "F.O.C. Commissioning", key: "F.O.C. Commissioning" },
        { title: "F.O.C. Maintenance", key: "F.O.C. Maintenance" },
        { title: "Warranty Service", key: "Warranty Service" },
        { title: "Chargeable Maintenance", key: "Chargeable Maintenance" },
        { title: "Customer Visit (Service)", key: "Customer Visit (Service)" },
        { title: "Service Contract", key: "Service Contract" },
        { title: "Goodwill", key: "Goodwill" },
        { title: "Chargeable commissioning", key: "Chargeable commissioning" },
        { title: "Service Technician Name", key: "Service Technician Name" },
        { title: "Service Technician Date", key: "Service Technician Date" },
        { title: "Service Manager Name", key: "Service Manager Name" },
        { title: "Service Manager Date", key: "Service Manager Date" },
        { title: "Customer Name", key: "Customer Name" },
        { title: "Customer Date", key: "Customer Date" },
        { title: "Modified User", key: "Modified User" },
        { title: "Modified date & time", key: "Modified date & time" },
      ];

      const firstValue = (record, keys) => {
        for (const key of keys) {
          const value = record?.[key];
          if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          )
            return value;
        }
        // Also match spreadsheet headers to camelCase fields returned by older
        // backend versions (for example, "Machine Running Hours" and
        // "machineRunningHours"). Exact names above always take priority.
        const normalizeFieldName = (value) =>
          String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
        const wanted = new Set(keys.map(normalizeFieldName));
        const matchingKey = Object.keys(record || {}).find((existingKey) =>
          wanted.has(normalizeFieldName(existingKey)),
        );
        if (matchingKey !== undefined) {
          const value = record[matchingKey];
          if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          )
            return value;
        }
        return "";
      };

      const arrayValue = (record, arrayKeys, selectedKey, legacyKeys = []) => {
        let selected = firstValue(record, arrayKeys);
        if (typeof selected === "string") {
          try {
            selected = JSON.parse(selected);
          } catch {
            selected = selected.split(/[,;]\s*/);
          }
        }
        if (Array.isArray(selected)) {
          const selectedLabels = {
            installation: "Installation / Commissioning",
            breakdown: "Breakdown / Defect",
            preventive: "Preventive Maintenance",
            corrective: "Corrective Maintenance",
            inspection: "Inspection",
            customerVisit: "Customer Visit",
            software: "Software / Program",
            other: "Other",
            machineTestedSuccessfully: "Machine tested successfully",
            machineRunningNormally: "Machine running normally",
            runningWithObservation: "Running with observation",
            machineStopped: "Machine stopped - further action required",
            customerAdvised: "Customer advised / awaiting action",
            noFurtherAction: "No further action required",
            partsRequired: "Parts required",
            followUpVisit: "Follow-up visit required",
            customerAction: "Customer action required",
            technicalSupportChina:
              "Technical support required from Haitian China",
            focCommissioning: "F.O.C. Commissioning",
            focMaintenance: "F.O.C. Maintenance",
            warrantyService: "Warranty Service",
            chargeableMaintenance: "Chargeable Maintenance",
            customerVisitService: "Customer Visit (Service)",
            serviceContract: "Service Contract",
            goodwill: "Goodwill",
            chargeableCommissioning: "Chargeable commissioning",
          };
          if (
            selected.includes(selectedKey) ||
            selected.includes(selectedLabels[selectedKey])
          )
            return "Yes";
        }
        const direct = firstValue(
          record,
          legacyKeys.length ? legacyKeys : [selectedKey],
        );
        if (String(direct).trim().toLowerCase() === "yes" || direct === true)
          return "Yes";
        if (String(direct).trim().toLowerCase() === "no" || direct === false)
          return "No";
        return direct || "No";
      };

      // Return the stored part rows as separate records. Do not join part
      // values with semicolons: Part No., Description, Qty, Used/Recommended,
      // and Remarks must all come from the SAME part object on each Excel row.
      const getPartsList = (record) => {
        let partList = firstValue(record, [
          "partsUsed",
          "parts",
          "partsUsedRecommended",
        ]);
        if (typeof partList === "string") {
          try {
            partList = JSON.parse(partList);
          } catch {
            partList = [];
          }
        }
        if (Array.isArray(partList))
          return partList.filter((part) => part && typeof part === "object");

        // Support legacy sheet records where each part column is stored as
        // a semicolon/comma-separated list instead of an array of objects.
        const legacyKeys = {
          partNo: ["Part No.", "Part No", "partNumber", "partNo"],
          description: ["Description", "description"],
          qty: ["Qty", "Quantity", "quantity", "qty"],
          usedRecommended: ["Used / Recommended", "usedRecommended", "type"],
          remarks: ["Remarks", "remarks", "note"],
        };
        const splitLegacy = (keys) => {
          const value = firstValue(record, keys);
          if (Array.isArray(value)) return value;
          if (value === undefined || value === null || value === "") return [];
          return String(value).split(/\s*;\s*|\s*,\s*/);
        };
        const legacyValues = Object.fromEntries(
          Object.entries(legacyKeys).map(([key, keys]) => [
            key,
            splitLegacy(keys),
          ]),
        );
        const legacyCount = Math.max(
          0,
          ...Object.values(legacyValues).map((values) => values.length),
        );
        return Array.from({ length: legacyCount }, (_, index) => ({
          partNo: legacyValues.partNo[index] ?? "",
          description: legacyValues.description[index] ?? "",
          qty: legacyValues.qty[index] ?? "",
          usedRecommended: legacyValues.usedRecommended[index] ?? "",
          remarks: legacyValues.remarks[index] ?? "",
        }));
      };

      const partValue = (record, fieldKeys, partIndex) => {
        const part = getPartsList(record)[partIndex];
        if (part) return firstValue(part, fieldKeys);
        // Keep support for old single-value records with no parts array.
        if (partIndex === 0) return firstValue(record, fieldKeys);
        return "";
      };

      const valueFor = (record, key, partIndex = 0) => {
        let value;
        switch (key) {
          case "Service Report Number":
            return firstValue(record, [
              "Service Report Number",
              "serviceReportNumber",
              "srn",
            ]);
          case "Customer":
            return firstValue(record, [
              "Customer",
              "Customer Name",
              "customer",
              "customerName",
            ]);
          case "Service Date":
            return firstValue(record, [
              "Service Date",
              "serviceDate",
              "Installation Date",
            ]);
          case "Site / Location":
            return firstValue(record, [
              "Site / Location",
              "Site / Location ",
              "siteLocation",
              "Address",
            ]);
          case "Contact Person":
            return firstValue(record, ["Contact Person", "contactPerson"]);
          case "Contact No.":
            return firstValue(record, [
              "Contact No.",
              "Contact No",
              "contactNo",
              "Telephone",
            ]);
          case "Technician":
            return firstValue(record, [
              "Technician",
              "Service Technician",
              "Service Technician Name",
              "technician",
            ]);
          case "Installation year":
            return firstValue(record, [
              "Installation year",
              "Installation Year",
              "installationYear",
            ]);
          case "Controller":
            return firstValue(record, [
              "Controller",
              "Controller / Software version",
              "Controller / Software Version",
              "softwareVersion",
            ]);
          case "Customer complaint / reported problem":
            return getCustomerComplaint(record);
          case "Technician diagnosis/root cause":
            return getTechnicianDiagnosis(record);
          case "Work performed / corrective action":
            return getWorkPerformed(record);
          case "Installation / Commissioning":
            return arrayValue(record, ["serviceCategory"], "installation", [
              key,
            ]);
          case "Breakdown / Defect":
            return arrayValue(record, ["serviceCategory"], "breakdown", [key]);
          case "Preventive Maintenance":
            return arrayValue(record, ["serviceCategory"], "preventive", [key]);
          case "Corrective Maintenance":
            return arrayValue(record, ["serviceCategory"], "corrective", [key]);
          case "Inspection":
            return arrayValue(record, ["serviceCategory"], "inspection", [key]);
          case "Customer Visit":
            return arrayValue(record, ["serviceCategory"], "customerVisit", [
              key,
            ]);
          case "Software / Program":
            return arrayValue(record, ["serviceCategory"], "software", [key]);
          case "Machine tested successfully":
            return arrayValue(
              record,
              ["machineTrialStatus"],
              "machineTestedSuccessfully",
              [key],
            );
          case "Machine running normally":
            return arrayValue(
              record,
              ["machineTrialStatus"],
              "machineRunningNormally",
              [key],
            );
          case "Running with observation":
            return arrayValue(
              record,
              ["machineTrialStatus"],
              "runningWithObservation",
              [key],
            );
          case "Machine stopped - further action required":
            return arrayValue(
              record,
              ["machineTrialStatus"],
              "machineStopped",
              [key],
            );
          case "Customer advised / awaiting action":
            return arrayValue(
              record,
              ["machineTrialStatus"],
              "customerAdvised",
              [key],
            );
          case "Part No.":
            return partValue(
              record,
              ["Part No.", "Part No", "partNumber", "partNo"],
              partIndex,
            );
          case "Description":
            return partValue(record, ["Description", "description"], partIndex);
          case "Qty":
            return partValue(
              record,
              ["Qty", "Quantity", "quantity", "qty"],
              partIndex,
            );
          case "Used / Recommended":
            return partValue(
              record,
              ["Used / Recommended", "usedRecommended", "type"],
              partIndex,
            );
          case "Remarks":
            return partValue(record, ["Remarks", "remarks", "note"], partIndex);
          case "No further action required":
            return arrayValue(record, ["furtherAction"], "noFurtherAction", [
              key,
            ]);
          case "Parts required":
            return arrayValue(record, ["furtherAction"], "partsRequired", [
              key,
            ]);
          case "Follow-up visit required":
            return arrayValue(record, ["furtherAction"], "followUpVisit", [
              key,
            ]);
          case "Customer action required":
            return arrayValue(record, ["furtherAction"], "customerAction", [
              key,
            ]);
          case "Technical support required from Haitian China":
            return arrayValue(
              record,
              ["furtherAction"],
              "technicalSupportChina",
              [key, "Technical / spare support required from Haitian China"],
            );
          case "F.O.C. Commissioning":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "focCommissioning",
              [key],
            );
          case "F.O.C. Maintenance":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "focMaintenance",
              [key],
            );
          case "Warranty Service":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "warrantyService",
              [key],
            );
          case "Chargeable Maintenance":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "chargeableMaintenance",
              [key],
            );
          case "Customer Visit (Service)":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "customerVisitService",
              [key],
            );
          case "Service Contract":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "serviceContract",
              [key, "Service contract"],
            );
          case "Goodwill":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "goodwill",
              [key],
            );
          case "Chargeable commissioning":
            return arrayValue(
              record,
              ["serviceCommercialClassification"],
              "chargeableCommissioning",
              [key, "Chargeable Commissioning"],
            );
          case "Required Action / Follow-up":
            return firstValue(record, [
              key,
              "requiredActionFollowUp",
              "Required Action / Follow-up ",
            ]);
          case "Service Technician Name":
            return firstValue(record, [
              key,
              "Technician Name",
              "Service Technician",
              "technicianName",
            ]);
          case "Service Technician Date":
            return firstValue(record, [
              key,
              "Technician Date",
              "technicianDate",
            ]);
          case "Service Manager Name":
            return firstValue(record, [
              key,
              "Manager Name",
              "Service Manager",
              "managerName",
            ]);
          case "Service Manager Date":
            return firstValue(record, [key, "Manager Date", "managerDate"]);
          case "Customer Name":
            return firstValue(record, [
              key,
              "Customer Acknowledgement Name",
              "customerName",
            ]);
          case "Customer Date":
            return firstValue(record, [
              key,
              "Customer Acknowledgement Date",
              "customerDate",
            ]);
          case "Modified User":
            return firstValue(record, [
              key,
              "Modified By",
              "modifiedBy",
              "updatedBy",
            ]);
          case "Modified date & time":
            return firstValue(record, [
              key,
              "Modified Date",
              "Modified At",
              "modifiedAt",
              "updatedAt",
            ]);
          default:
            value = record?.[key];
        }

        if (value === undefined || value === null) return "";
        if (Array.isArray(value)) {
          return value
            .map((item) => {
              if (item && typeof item === "object")
                return Object.values(item)
                  .filter((v) => v != null && v !== "")
                  .join(" / ");
              return item == null ? "" : String(item);
            })
            .filter(Boolean)
            .join("; ");
        }
        if (value && typeof value === "object") return JSON.stringify(value);
        return String(value);
      };
      // Match the attached workbook's "Form Data" layout: grouped section
      // headings, individual field names beneath them, and three data rows
      // for every service report, matching the backend sheet structure.
      const sectionHeader = Array(columns.length).fill("");
      sectionHeader[0] = "Service Report Number";
      const setSection = (columnNumber, title) => {
        sectionHeader[columnNumber - 1] = title;
      };
      setSection(2, "CUSTOMER & VISIT INFORMATION");
      setSection(12, "MACHINE INFORMATION");
      setSection(18, "SERVICE CATEGORY");
      setSection(26, "CUSTOMER COMPLAINT / REPORTED PROBLEM");
      setSection(27, "TECHNICIAN DIAGNOSIS / ROOT CAUSE");
      setSection(28, "WORK PERFORMED / CORRECTIVE ACTION");
      setSection(29, "MACHINE TRIAL & FINAL STATUS");
      setSection(38, "PARTS USED / RECOMMENDED");
      setSection(43, "FURTHER ACTION REQUIRED");
      setSection(49, "SERVICE COMMERCIAL CLASSIFICATION");
      setSection(57, "CUSTOMER ACKNOWLEDGEMENT");
      setSection(63, "USER MODIFIED DETAILS");

      const worksheetData = [
        sectionHeader,
        columns.map((column) => column.title),
        ...allReports.flatMap((record) => {
          const parts = getPartsList(record);
          // One Excel row per part. Every part's quantity and descriptive
          // fields stay aligned with that same part; report-level fields are
          // repeated so each row remains understandable when filtered/sorted.
          const rowCount = Math.max(parts.length, 1);
          return Array.from({ length: rowCount }, (_, partIndex) =>
            columns.map((column) => valueFor(record, column.key, partIndex)),
          );
        }),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const fullBorder = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };

      // Merge section headings to match the uploaded Form Data worksheet.
      worksheet["!merges"] = [
        { s: { r: 0, c: 1 }, e: { r: 0, c: 10 } },
        { s: { r: 0, c: 11 }, e: { r: 0, c: 16 } },
        { s: { r: 0, c: 17 }, e: { r: 0, c: 24 } },
        { s: { r: 0, c: 28 }, e: { r: 0, c: 36 } },
        { s: { r: 0, c: 37 }, e: { r: 0, c: 41 } },
        { s: { r: 0, c: 42 }, e: { r: 0, c: 47 } },
        { s: { r: 0, c: 48 }, e: { r: 0, c: 55 } },
        { s: { r: 0, c: 56 }, e: { r: 0, c: 61 } },
        { s: { r: 0, c: 62 }, e: { r: 0, c: 63 } },
      ];

      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
        for (
          let columnIndex = range.s.c;
          columnIndex <= range.e.c;
          columnIndex += 1
        ) {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: columnIndex,
          });
          if (!worksheet[cellAddress])
            worksheet[cellAddress] = { t: "s", v: "" };
          const isSectionHeader = rowIndex === 0;
          const isFieldHeader = rowIndex === 1;
          worksheet[cellAddress].s = {
            font: {
              name: "Arial",
              bold: isSectionHeader || isFieldHeader,
              sz: isSectionHeader ? 10 : isFieldHeader ? 9 : 10,
            },
            alignment: {
              vertical: "center",
              horizontal: "center",
              wrapText: false,
            },
            ...(isSectionHeader || isFieldHeader
              ? { fill: { fgColor: { rgb: "FFF200" } } }
              : {}),
            border: fullBorder,
          };
        }
      }

      const customColumnWidths = {
        "Customer complaint / reported problem": 120,
        "Technician diagnosis/root cause": 120,
        "Work performed / corrective action": 120,
      };

      worksheet["!cols"] = columns.map((column) => {
        const customWidth = customColumnWidths[column.title];

        if (customWidth) {
          return { wch: customWidth };
        }

        const maxLength = Math.max(
          column.title.length,
          ...allReports
            .slice(0, 500)
            .map((record) => String(valueFor(record, column.key) || "").length),
        );

        return { wch: Math.min(Math.max(maxLength + 1, 12), 40) };
      });

      // Reduced header height/padding while keeping long field names readable.
      const exportedPartRowCount = allReports.reduce(
        (count, record) => count + Math.max(getPartsList(record).length, 1),
        0,
      );
      worksheet["!rows"] = [
        { hpt: 18 },
        { hpt: 24 },
        ...Array(exportedPartRowCount).fill({ hpt: 18 }),
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Service Reports");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // const timestamp = new Date()
      //   .toISOString()
      //   .replace(/[:.]/g, "-")
      //   .slice(0, 19);
      // saveAs(blob, `Haitian_Service_Reports_${timestamp}.xlsx`);

      const exportDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Dubai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      saveAs(blob, `Haitian_Service_Reports_${exportDate}.xlsx`);

      notification.success({
        message: "Export Successful",
        description: `Exported ${allReports.length} service report(s), with each part on its own row${total && allReports.length < total ? ` (server reported ${total} matching records)` : ""}.`,
        placement: "bottomRight",
      });
    } catch (error) {
      console.error("Service report Excel export failed:", error);
      notification.error({
        message: "Export Failed",
        description:
          error?.message || "Unable to export service reports to Excel.",
        placement: "bottomRight",
      });
    } finally {
      setReportExcelExportLoading(false);
    }
  };

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
          <span className="service-report-number-badge">{value || "-"}</span>
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
        record?.["Installation year"] || record?.["Installation Date"] || "-",
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
            disabled={loading}
            onClick={() => {
              // A new View record must always start with a clean PDF
              // download state.
              setPdfDownloadLoadingReportNumber("");
              setViewReport(record);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>

          <Button
            className="service-report-edit-action"
            icon={<EditOutlined />}
            disabled={loading}
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
  // CUSTOMER DATA
  // ============================================================
  // Customer data is loaded together with reports by loadInitialData().
  // This helper remains available if a manual refresh is ever needed.
  // ============================================================

  const loadAllCustomerData = async () => {
    try {
      const result = await gasRequest({
        action: "getAllCustomerData",
        method: "GET",
        retries: 2,
      });
      const customers = Array.isArray(result.customers) ? result.customers : [];
      applyCustomerCache(customers);
      return customers;
    } catch (error) {
      console.error("Failed to load customer data:", error);
      setCustomerDataList([]);
      setCustomerOptions([]);
      return [];
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

    // Customer details must belong to the exact current customer name.
    // If the field is cleared or no exact match exists, remove previous
    // autofilled details so they cannot be saved against another customer.
    if (!customerValue) {
      clearCustomerAutofill();
      return;
    }

    const matched = customerDataList.find(
      (customer) =>
        getCustomerName(customer).toLowerCase() === customerValue.toLowerCase(),
    );

    if (!matched) {
      // Do not keep details from a previously matched customer when the
      // current name is different (for example, "Kumar" -> "Kumars").
      // Autofill is applied only when the full customer name matches.
      clearCustomerAutofill();
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

  const enforceSectionTrailRequiredLimit = (value) => {
    const input = typeof value === "string" ? value : "";

    // First limit to 2 explicit lines
    const lines = input.split("\n").slice(0, 2);

    let limited = lines.join("\n");

    // Then limit total characters to 250
    if (limited.length > 250) {
      limited = limited.substring(0, 250);
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
        description: "This field is limited to 2 lines and 250 characters.",
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
    const limited = enforceSectionTrailRequiredLimit(input);

    if (input !== limited) {
      notification.warning({
        message: "Warning",
        description:
          "Required Action / Follow-up is limited to 2 lines and 250 characters. Excess text was removed.",
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
        description: `${fieldLabel} is limited to 3 lines and 512 characters. Excess text was removed.`,
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
      width: 210,
      key: "partNo",

      render: (_, record) => (
        <Form.Item style={{ margin: 0 }}>
          <Tooltip
            title={
              partsFormData[record.key]?.partNo ||
              "Enter the part number (maximum 22 characters)"
            }
            placement="topLeft"
          >
            <Input
              placeholder="Part No."
              maxLength={22}
              showCount
              value={partsFormData[record.key]?.partNo || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "partNo", e.target.value)
              }
            />
          </Tooltip>
        </Form.Item>
      ),
    },

    {
      title: "Description",
      dataIndex: "description",
      width: 250,
      key: "description",

      render: (_, record) => (
        <Form.Item style={{ margin: 0 }}>
          <Tooltip
            title={
              partsFormData[record.key]?.description ||
              "Enter the part description (maximum 30 characters)"
            }
            placement="topLeft"
          >
            <Input
              placeholder="Description"
              maxLength={30}
              showCount
              value={partsFormData[record.key]?.description || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "description", e.target.value)
              }
            />
          </Tooltip>
        </Form.Item>
      ),
    },

    {
      title: "Qty",
      dataIndex: "qty",
      width: 100,
      key: "qty",

      render: (_, record) => (
        <Form.Item style={{ margin: 0 }}>
          <Tooltip
            title={partsFormData[record.key]?.qty || "Enter the quantity"}
            placement="topLeft"
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Qty"
              value={partsFormData[record.key]?.qty || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "qty", e.target.value)
              }
            />
          </Tooltip>
        </Form.Item>
      ),
    },

    {
      title: "Used / Recommended",
      dataIndex: "usedRecommended",
      width: 270,
      key: "usedRecommended",

      render: (_, record) => (
        <Form.Item style={{ margin: 0 }}>
          <Tooltip
            title={
              partsFormData[record.key]?.usedRecommended ||
              "Enter whether the part was used or recommended (maximum 30 characters)"
            }
            placement="topLeft"
          >
            <Input
              placeholder="Used / Recommended"
              maxLength={30}
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
          </Tooltip>
        </Form.Item>
      ),
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      width: 250,
      key: "remarks",

      render: (_, record) => (
        <Form.Item style={{ margin: 0 }}>
          <Tooltip
            title={
              partsFormData[record.key]?.remarks ||
              "Enter remarks (maximum 30 characters)"
            }
            placement="topLeft"
          >
            <Input
              placeholder="Remarks"
              maxLength={30}
              showCount
              value={partsFormData[record.key]?.remarks || ""}
              onChange={(e) =>
                updatePartsFormData(record.key, "remarks", e.target.value)
              }
            />
          </Tooltip>
        </Form.Item>
      ),
    },
  ];

  const fetchNextServiceReportNumber = async () => {
    try {
      setSrnLoading(true);
      const result = await gasRequest({
        action: "getNextServiceReportNumber",
        method: "GET",
        retries: 2,
      });

      const nextSRN = result.serviceReportNumber ?? result.srn ?? "";
      if (nextSRN === "") {
        throw new Error("Service report number was not received");
      }

      setServiceReportNumber(String(nextSRN));
      return String(nextSRN);
    } catch (error) {
      console.error("Fetch SRN error:", error);
      notification.error({
        message: "SRN Error",
        description: error.message || "Unable to fetch service report number.",
        placement: "bottomRight",
      });
      return "";
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

  const handleSubmit = async (values) => {
    // ========================================================
    // PREVENT DOUBLE SUBMISSION
    // ========================================================

    if (loading) {
      return;
    }

    // Prevent submission by Enter-key or programmatic form submit while the
    // SRN is loading, or if Apps Script did not return a usable SRN.
    if (srnLoading || !String(serviceReportNumber || "").trim()) {
      notification.warning({
        message: "Service Report Number Not Ready",
        description:
          "Please wait until the Service Report Number has loaded before submitting.",
        placement: "bottomRight",
      });
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

        machineTrialStatus: JSON.stringify(values.machineTrialStatus || []),

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

        requiredActionFollowUp: values.requiredActionFollowUp || "",

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
      // DUPLICATE-SUBMISSION PROTECTION
      // ========================================================
      // Keep the same ID if the browser/server response failed after the
      // spreadsheet may already have saved this report. The backend checks
      // this ID under its script lock before writing any rows.
      // Do not silently reuse a pending ID for changed form data.
      const pendingSubmissionStorageKey =
        "haitianServiceReportPendingSubmissionV1";
      const payloadFingerprint = JSON.stringify(payload);
      let pendingSubmission = null;

      try {
        const storedPendingSubmission = window.localStorage.getItem(
          pendingSubmissionStorageKey,
        );
        pendingSubmission = storedPendingSubmission
          ? JSON.parse(storedPendingSubmission)
          : null;
      } catch (storageReadError) {
        console.warn(
          "Could not read the pending submission marker.",
          storageReadError,
        );
      }

      if (
        pendingSubmission &&
        pendingSubmission.submissionId &&
        pendingSubmission.fingerprint !== payloadFingerprint
      ) {
        notification.error({
          message: "Previous Submission Needs Checking",
          description:
            "A previous submission may already have been saved, but its final confirmation was not completed. Do not change or submit this report again yet. Check the Service Report table for the saved SRN first.",
          placement: "bottomRight",
          duration: 8,
        });
        return;
      }

      const submissionId =
        pendingSubmission?.submissionId ||
        (window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `sr-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`);

      payload.submissionId = submissionId;

      try {
        window.localStorage.setItem(
          pendingSubmissionStorageKey,
          JSON.stringify({ submissionId, fingerprint: payloadFingerprint }),
        );
      } catch (storageWriteError) {
        // The backend still protects duplicate IDs when storage is available;
        // report the limitation rather than silently claiming durable retry safety.
        console.warn(
          "Could not persist the pending submission marker.",
          storageWriteError,
        );
        notification.warning({
          message: "Retry Protection Limited",
          description:
            "This browser could not save the pending submission marker. If submission confirmation fails, check the report table before trying again.",
          placement: "bottomRight",
        });
      }

      // ========================================================
      // SEND TO GOOGLE APPS SCRIPT
      // ========================================================

      const result = await gasRequest({
        action: "saveReport",
        method: "POST",
        data: payload,
        retries: 0,
      });

      // ========================================================
      // GET SAVED REPORT NUMBER
      // ========================================================

      const savedReportNumber = result.serviceReportNumber ?? result.srn ?? "";

      // Normalize the saved report returned by the backend. Some backend
      // responses include result.report; the fallback keeps the customer
      // cache update safe when only the submitted form values are returned.
      const savedReport = result.report || {
        ...values,
        "Service Report Number": savedReportNumber || serviceReportNumber,
        Customer: values.customer || "",
        "Site / Location": values.siteLocation || "",
        "Contact Person": values.contactPerson || "",
        "Contact No.": values.contactNo || "",
        "Machine Model": values.machineModel || "",
        "Serial No.": values.serialNo || "",
        "Installation year": values.installationYear || "",
      };

      const tablePageSize = Math.max(1, Number(reportTablePageSize) || 10);
      const normalizedSavedReportNumber = String(
        savedReportNumber || serviceReportNumber || "",
      ).trim();
      const savedTechnician = Array.isArray(values.technician)
        ? values.technician.join(", ")
        : values.technician || "";
      const firstPart = Array.isArray(parts) ? parts[0] || {} : {};

      const savedReportForTable = {
        ...savedReport,
        "Service Report Number": normalizedSavedReportNumber,
        Customer:
          savedReport?.Customer ||
          savedReport?.["Customer Name"] ||
          values.customer ||
          "",
        "Customer Name":
          savedReport?.["Customer Name"] ||
          savedReport?.Customer ||
          values.customer ||
          "",
        "Service Date":
          savedReport?.["Service Date"] ||
          savedReport?.serviceDate ||
          values.serviceDate ||
          "",
        "Site / Location":
          savedReport?.["Site / Location"] ||
          savedReport?.siteLocation ||
          values.siteLocation ||
          "",
        "Contact Person":
          savedReport?.["Contact Person"] ||
          savedReport?.contactPerson ||
          values.contactPerson ||
          "",
        "Contact No.":
          savedReport?.["Contact No."] ||
          savedReport?.contactNo ||
          values.contactNo ||
          "",
        Technician:
          savedReport?.Technician || savedReport?.technician || savedTechnician,
        "Arrival Time":
          savedReport?.["Arrival Time"] ||
          savedReport?.arrivalTime ||
          values.arrivalTime ||
          "",
        "Completion Time":
          savedReport?.["Completion Time"] ||
          savedReport?.completionTime ||
          values.completionTime ||
          "",
        "Total Working Hours":
          savedReport?.["Total Working Hours"] ||
          savedReport?.totalWorkingHours ||
          values.totalWorkingHours ||
          "",
        "Service Visit Ref.":
          savedReport?.["Service Visit Ref."] ||
          savedReport?.serviceVisitRef ||
          values.serviceVisitRef ||
          "",
        "Machine Model":
          savedReport?.["Machine Model"] ||
          savedReport?.machineModel ||
          values.machineModel ||
          "",
        "Serial No.":
          savedReport?.["Serial No."] ||
          savedReport?.serialNo ||
          values.serialNo ||
          "",
        "Installation year":
          savedReport?.["Installation year"] ||
          savedReport?.installationYear ||
          values.installationYear ||
          "",
        "Machine Running Hours":
          savedReport?.["Machine Running Hours"] ||
          savedReport?.machineRunningHours ||
          values.machineRunningHours ||
          "",
        Controller:
          savedReport?.Controller ||
          savedReport?.softwareVersion ||
          values.softwareVersion ||
          "",
        "Warranty Status":
          savedReport?.["Warranty Status"] ||
          savedReport?.warrantyStatus ||
          values.warrantyStatus ||
          "",
        "Customer Complaint":
          savedReport?.["Customer Complaint"] ||
          savedReport?.customerComplaint ||
          values.customerComplaint ||
          "",
        "Technician Diagnosis":
          savedReport?.["Technician Diagnosis"] ||
          savedReport?.technicianDiagnosis ||
          values.technicianDiagnosis ||
          "",
        "Work Performed":
          savedReport?.["Work Performed"] ||
          savedReport?.workPerformed ||
          values.workPerformed ||
          "",
        "Trial Duration":
          savedReport?.["Trial Duration"] ||
          savedReport?.trialDuration ||
          values.trialDuration ||
          "",
        "Cycle Time":
          savedReport?.["Cycle Time"] ||
          savedReport?.cycleTime ||
          values.cycleTime ||
          "",
        "Product / Material":
          savedReport?.["Product / Material"] ||
          savedReport?.productMaterial ||
          values.productMaterial ||
          "",
        "Trial / Status Remarks":
          savedReport?.["Trial / Status Remarks"] ||
          savedReport?.trialStatusRemarks ||
          values.trialStatusRemarks ||
          "",
        "Part No.": savedReport?.["Part No."] || firstPart.partNo || "",
        Description: savedReport?.Description || firstPart.description || "",
        Qty: savedReport?.Qty || firstPart.qty || "",
        "Used / Recommended":
          savedReport?.["Used / Recommended"] ||
          firstPart.usedRecommended ||
          "",
        Remarks: savedReport?.Remarks || firstPart.remarks || "",
      };

      // A successful new submission returns the table to its default view.
      // Cancel debounce/in-flight searches, clear filters, and start on page 1.
      if (reportSearchTimerRef.current) {
        clearTimeout(reportSearchTimerRef.current);
        reportSearchTimerRef.current = null;
      }
      setReportTableSearch("");
      setReportTableServiceReportNumberSearch("");
      setReportTableCurrentPage(1);
      setReportTableSearchLoading(false);
      clearReportPageCache();
      reportPageRequestRef.current.clear();

      // Cancel the influence of any older in-flight page response so it
      // cannot overwrite the newly saved row after this local update.
      reportTableRequestSequenceRef.current += 1;
      setReportTableLoading(false);
      setReportData((previous) => {
        const currentRows = Array.isArray(previous) ? previous : [];
        // Only deduplicate when the backend returned a real report number.
        // A missing SRN must never cause unrelated rows to be removed.
        const withoutDuplicate = normalizedSavedReportNumber
          ? currentRows.filter(
              (item) =>
                String(item?.["Service Report Number"] || "").trim() !==
                normalizedSavedReportNumber,
            )
          : currentRows;
        return [savedReportForTable, ...withoutDuplicate].slice(
          0,
          tablePageSize,
        );
      });
      setReportTableTotal((previous) => Number(previous || 0) + 1);

      // Reconcile this immediate display with the authoritative backend
      // response in the background. This does not block PDF creation/upload.
      // Never replace the optimistic row with a stale read: if the new SRN is
      // not present yet, invalidate that cached response and retry once.
      // A newer user table request cancels reconciliation to avoid races.
      const savedTableRefreshSequence = reportTableRequestSequenceRef.current;
      const savedTableCacheKey = getReportPageCacheKey(
        1,
        tablePageSize,
        "",
        "",
      );

      const reconcileSavedReportTable = async (attempt = 0) => {
        if (
          savedTableRefreshSequence !== reportTableRequestSequenceRef.current
        ) {
          return;
        }

        try {
          // Bypass the page-request deduplication map for this one read so
          // an older in-flight request cannot masquerade as a post-save read.
          const freshResult = await gasRequest({
            action: "getServiceReportsPage",
            method: "GET",
            data: {
              page: 1,
              pageSize: tablePageSize,
              search: "",
              serviceReportNumber: "",
              userEmail: String(user?.email || "").trim(),
              access: String(user?.access || "").trim(),
            },
            retries: 0,
          });
          const freshPage = {
            reports: Array.isArray(freshResult?.reports)
              ? freshResult.reports
              : [],
            total: Number(freshResult?.total || 0),
            page: Number(freshResult?.page || 1),
          };

          if (
            savedTableRefreshSequence !== reportTableRequestSequenceRef.current
          ) {
            return;
          }

          const freshReports = Array.isArray(freshPage?.reports)
            ? freshPage.reports
            : [];
          const savedRowIsPresent =
            normalizedSavedReportNumber !== "" &&
            freshReports.some(
              (item) =>
                String(item?.["Service Report Number"] || "").trim() ===
                normalizedSavedReportNumber,
            );

          if (savedRowIsPresent) {
            // Cache only a confirmed post-save page containing the new SRN.
            reportPageCacheRef.current.set(savedTableCacheKey, {
              timestamp: Date.now(),
              data: freshPage,
            });
            setReportData(freshReports);
            setReportTableTotal(Number(freshPage.total || 0));
            setReportTableCurrentPage(1);
            return;
          }

          // Preserve the visible saved row if the spreadsheet read is stale.
          reportPageCacheRef.current.delete(savedTableCacheKey);
          if (attempt < 1) {
            window.setTimeout(() => {
              void reconcileSavedReportTable(attempt + 1);
            }, 1200);
          }
        } catch (refreshError) {
          reportPageCacheRef.current.delete(savedTableCacheKey);
          if (attempt < 1) {
            window.setTimeout(() => {
              void reconcileSavedReportTable(attempt + 1);
            }, 1200);
            return;
          }
          console.warn(
            "Background table refresh failed after a successful save; the visible row is preserved.",
            refreshError,
          );
        }
      };

      window.setTimeout(() => {
        void reconcileSavedReportTable(0);
      }, 500);

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
      // PDF GENERATION + DRIVE UPLOAD — RELIABLE SUBMISSION
      // ========================================================
      // IMPORTANT:
      // Do NOT detach this operation from handleSubmit.
      //
      // Google Apps Script cannot guarantee a browser-side background
      // job after the submit handler has finished. If we use:
      //
      //   void (async () => { ... })();
      //
      // the UI can say "saved" while the PDF is still uploading, and
      // the browser can terminate/throttle the request. That caused
      // the previous "PDF is processing in background" problem.
      //
      // The report is already saved at this point. We now generate,
      // save locally and upload the PDF, then continue with the final
      // form reset only after Drive has confirmed the file.
      // ========================================================

      const pdfValuesForUpload = { ...values, parts };
      const pdfReportNumberForUpload = String(
        savedReportNumber || serviceReportNumber || "",
      ).trim();

      notification.info({
        message: "Report Saved — Uploading PDF",
        description: `Service Report ${
          pdfReportNumberForUpload || ""
        } was saved. Generating and uploading the PDF to Google Drive...`,
        placement: "bottomRight",
        duration: 0,
      });

      const pdfResult = await generateServiceReportPDF(
        pdfValuesForUpload,
        pdfReportNumberForUpload,
        signatureTechnician,
        signatureManager,
        signatureCustomer,
      );

      // Keep the browser's local PDF download, but do not make an
      // unnecessary 300ms wait before starting the Drive upload.
      const localPdfFileName = await savePdfLocally(pdfResult);

      // This function verifies Drive after transport failures and retries
      // only when the PDF cannot be found. It prevents duplicate PDFs
      // when Drive succeeded but the HTTP response was lost.
      const pdfUploadResult = await uploadPdfWithRecovery(
        pdfResult,
        pdfReportNumberForUpload,
      );

      if (
        !pdfUploadResult ||
        pdfUploadResult.success !== true ||
        !pdfUploadResult.fileId
      ) {
        throw new Error("Google Drive did not confirm the PDF upload.");
      }

      notification.destroy();

      notification.success({
        message: "Report & PDF Saved Successfully",
        description: `${localPdfFileName} was saved locally and the PDF was confirmed in Google Drive.`,
        placement: "bottomRight",
        duration: 5,
      });

      // ========================================================
      // RESET NEW REPORT FORM
      // ========================================================
      // Clear the pending id only after both the report save and Drive PDF
      // confirmation succeeded. If PDF upload fails, the ID stays available
      // so a retry cannot create another report row group.
      try {
        window.localStorage.removeItem(
          "haitianServiceReportPendingSubmissionV1",
        );
      } catch (storageRemoveError) {
        console.warn(
          "Could not clear the pending submission marker.",
          storageRemoveError,
        );
      }
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
      // UPDATE LOCAL CUSTOMER STATE
      // ========================================================
      // Report-table state was updated immediately after the backend save,
      // before PDF generation/upload. Keep the customer/autofill cache update
      // here because it does not need to block the report-table refresh.
      // ========================================================

      // Merge the new customer into the existing full customer cache instead
      // of rebuilding the cache from only the current report page.
      const savedCustomerName = String(
        savedReport?.["Customer"] || savedReport?.["Customer Name"] || "",
      ).trim();

      if (savedCustomerName) {
        setCustomerDataList((previous) => {
          const next = [
            savedReport,
            ...(Array.isArray(previous) ? previous : []),
          ];
          const seen = new Map();
          next.forEach((item) => {
            const name = String(
              item?.["Customer"] || item?.["Customer Name"] || "",
            ).trim();
            if (!name) return;
            const key = name.toLowerCase();
            if (!seen.has(key)) seen.set(key, item);
          });
          return Array.from(seen.values()).sort((a, b) =>
            String(a?.["Customer"] || a?.["Customer Name"] || "").localeCompare(
              String(b?.["Customer"] || b?.["Customer Name"] || ""),
            ),
          );
        });

        setCustomerOptions((previous) => {
          const names = new Set([
            savedCustomerName,
            ...(Array.isArray(previous) ? previous : []),
          ]);
          return Array.from(names).sort((a, b) => a.localeCompare(b));
        });
      }

      const nextSRN = result.nextServiceReportNumber ?? result.nextSrn ?? "";

      if (nextSRN !== "") {
        setServiceReportNumber(String(nextSRN));
      } else {
        // Safe fallback for older deployments.
        await fetchNextServiceReportNumber();
      }
    } catch (error) {
      notification.destroy();

      // ========================================================
      // ERROR
      // ========================================================

      console.error("Save report error:", error);

      notification.error({
        message: "Error",

        description: error.message || "Failed to save service report.",

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

      <div className="service-form-header newFormStyleHeader mt-1 ">
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
              fontSize: "25px",
              whiteSpace: "normal",
            }}
          >
            {/* Service Report No:{" "}
            {srnLoading ? "Loading..." : serviceReportNumber || "---"} */}
            HAITIAN SERVICE REPORT
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
        className="newFormStyle"
        disabled={loading}
      >
        <div className="fetched-service-reports-heading">
          <div className="fetched-service-reports-heading-main">
            <div className="fetched-service-reports-heading-icon">
              <FormOutlined />
            </div>

            <div>
              <div className="fetched-service-reports-title">
                NEW SERVICE FORM
              </div>
              <div className="fetched-service-reports-subtitle">
                Complete the required information below to create a service
                report
              </div>
            </div>
          </div>

          <div className="fetched-service-reports-count">
            <span className="fetched-service-reports-count-label">
              SERVICE REPORT NUMBER
            </span>
            <strong>
              {srnLoading ? "Loading..." : serviceReportNumber || "---"}
            </strong>
          </div>
        </div>
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
            maxLength={250}
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
            size="middle"
            tableLayout="fixed"
            columns={partsColumns}
            dataSource={partsDataSource}
            scroll={{ x: 1120 }}
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
            maxLength={250}
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
                  disabled={loading}
                >
                  Save Signature
                </Button>

                <Button
                  className="dangerbutton"
                  onClick={clearTechnicianSignature}
                  disabled={loading}
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
                  disabled={loading}
                >
                  Save Signature
                </Button>

                <Button
                  className="dangerbutton"
                  onClick={clearManagerSignature}
                  disabled={loading}
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
                  disabled={loading}
                >
                  Save Signature
                </Button>

                <Button
                  className="dangerbutton"
                  onClick={clearCustomerSignature}
                  disabled={loading}
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
            disabled={
              loading || srnLoading || !String(serviceReportNumber || "").trim()
            }
          >
            {loading
              ? "Submitting..."
              : srnLoading
                ? "Loading SRN..."
                : "Submit Report"}
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
                {reportTableSearch.trim() ||
                reportTableServiceReportNumberSearch.trim()
                  ? "MATCHING RECORDS"
                  : "TOTAL RECORDS"}
              </span>
              <strong>{reportTableTotal}</strong>
            </div>
          </div>

          <div className="fetched-service-reports-toolbar">
            <div
              className="service-report-search-wrap"
              style={{ minWidth: 260, maxWidth: 300 }}
            >
              <SearchOutlined className="service-report-search-icon" />
              <Input
                value={reportTableServiceReportNumberSearch}
                onChange={(event) =>
                  handleServiceReportNumberSearchChange(event.target.value)
                }
                placeholder="Search Service Report No..."
                allowClear
                className="service-report-search-input"
                disabled={
                  loading || reportTableLoading || reportTableSearchLoading
                }
              />
            </div>

            <div className="service-report-search-wrap">
              <SearchOutlined className="service-report-search-icon" />
              <Input
                value={reportTableSearch}
                onChange={(event) =>
                  handleReportSearchChange(event.target.value)
                }
                placeholder="Search customer, technician, machine, serial no., location..."
                allowClear
                className="service-report-search-input"
                disabled={
                  loading || reportTableLoading || reportTableSearchLoading
                }
              />
            </div>

            <div className="service-report-toolbar-actions">
              {/* <div className="service-report-page-size">
                <span>Rows</span>
                <Select
                  value={reportTablePageSize}
                  onChange={(nextPageSize) => {
                    setReportTablePageSize(nextPageSize);
                    setReportTableCurrentPage(1);
                    fetchServiceReports({
                      page: 1,
                      pageSize: nextPageSize,
                      search: reportTableSearch,
                    });
                  }}
                  options={[
                    { value: 10, label: "10" },
                    // { value: 20, label: "20" },
                    // { value: 50, label: "50" },
                    // { value: 100, label: "100" },
                  ]}
                />
              </div> */}

              <Button
                className="service-report-refresh-button"
                icon={<ReloadOutlined />}
                loading={
                  reportTableLoadingMode === "search" ||
                  reportTableLoadingMode === "refresh"
                }
                disabled={
                  loading || reportTableLoading || reportTableSearchLoading
                }
                onClick={() => {
                  if (reportSearchTimerRef.current) {
                    clearTimeout(reportSearchTimerRef.current);
                    reportSearchTimerRef.current = null;
                  }
                  fetchServiceReports({
                    page: reportTableCurrentPage,
                    pageSize: reportTablePageSize,
                    search: reportTableSearch,
                    serviceReportNumberSearch:
                      reportTableServiceReportNumberSearch,
                    useCache: false,
                    loadingMode: "refresh",
                  });
                }}
              >
                {reportTableLoadingMode === "search"
                  ? "Searching..."
                  : reportTableLoadingMode === "refresh"
                    ? "Refreshing..."
                    : "Refresh"}
              </Button>

              <Button
                className="service-report-refresh-button"
                icon={<ExportOutlined />}
                loading={reportExcelExportLoading}
                disabled={reportExcelExportLoading || loading}
                onClick={handleExportServiceReportsToExcel}
              >
                {reportExcelExportLoading ? "Exporting..." : "Export Excel"}
              </Button>

              {(reportTableSearch || reportTableServiceReportNumberSearch) && (
                <Button
                  className="service-report-clear-button"
                  icon={<ClearOutlined />}
                  disabled={loading}
                  onClick={() => {
                    setReportTableSearch("");
                    setReportTableServiceReportNumberSearch("");
                    scheduleReportTableSearch({
                      search: "",
                      serviceReportNumberSearch: "",
                    });
                  }}
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
                // Page navigation is server-side. Already-loaded pages are
                // served from the in-memory cache without another GAS call.
                current: reportTableCurrentPage,
                pageSize: reportTablePageSize,
                total: reportTableTotal,
                disabled: loading,

                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} records`,
                onChange: (page) => {
                  fetchServiceReports({
                    page,
                    pageSize: reportTablePageSize,
                    search: reportTableSearch,
                    serviceReportNumberSearch:
                      reportTableServiceReportNumberSearch,
                    loadingMode: "load",
                  });
                },
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
            label="Trial / Status Remarks"
            name="trialStatusRemarks"
            rules={requiredRule("trial / status remarks")}
          >
            <TextArea
              rows={2}
              maxLength={250}
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
            tableLayout="fixed"
            scroll={{ x: 1120 }}
            columns={[
              {
                title: "Part No.",
                dataIndex: "partNo",
                width: 210,
                render: (_, record) => (
                  <Tooltip
                    title={
                      record.partNo ||
                      "Enter the part number (maximum 22 characters)"
                    }
                    placement="topLeft"
                  >
                    <Input
                      value={record.partNo}
                      maxLength={22}
                      showCount
                      onChange={(e) =>
                        updateEditPart(record.key, "partNo", e.target.value)
                      }
                    />
                  </Tooltip>
                ),
              },
              {
                title: "Description",
                dataIndex: "description",
                width: 250,
                render: (_, record) => (
                  <Tooltip
                    title={
                      record.description ||
                      "Enter the part description (maximum 30 characters)"
                    }
                    placement="topLeft"
                  >
                    <Input
                      value={record.description}
                      maxLength={30}
                      showCount
                      onChange={(e) =>
                        updateEditPart(
                          record.key,
                          "description",
                          e.target.value,
                        )
                      }
                    />
                  </Tooltip>
                ),
              },
              {
                title: "Qty",
                dataIndex: "qty",
                width: 100,
                render: (_, record) => (
                  <Tooltip
                    title={record.qty || "Enter the quantity"}
                    placement="topLeft"
                  >
                    <Input
                      value={record.qty}
                      onChange={(e) =>
                        updateEditPart(record.key, "qty", e.target.value)
                      }
                    />
                  </Tooltip>
                ),
              },
              {
                title: "Used / Recommended",
                dataIndex: "usedRecommended",
                width: 270,
                render: (_, record) => (
                  <Tooltip
                    title={
                      record.usedRecommended ||
                      "Enter whether the part was used or recommended (maximum 30 characters)"
                    }
                    placement="topLeft"
                  >
                    <Input
                      value={record.usedRecommended}
                      maxLength={30}
                      showCount
                      onChange={(e) =>
                        updateEditPart(
                          record.key,
                          "usedRecommended",
                          e.target.value,
                        )
                      }
                    />
                  </Tooltip>
                ),
              },
              {
                title: "Remarks",
                dataIndex: "remarks",
                width: 250,
                render: (_, record) => (
                  <Tooltip
                    title={
                      record.remarks || "Enter remarks (maximum 30 characters)"
                    }
                    placement="topLeft"
                  >
                    <Input
                      value={record.remarks}
                      maxLength={30}
                      showCount
                      onChange={(e) =>
                        updateEditPart(record.key, "remarks", e.target.value)
                      }
                    />
                  </Tooltip>
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
            label="Required Action / Follow-up"
            name="requiredActionFollowUp"
            rules={requiredRule("required action / follow-up")}
          >
            <TextArea
              rows={2}
              maxLength={250}
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
              {editSaveLoading ? "Updating..." : "Update Changes"}
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
          setPdfDownloadLoadingReportNumber("");
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
                loading={
                  pdfDownloadLoadingReportNumber ===
                  String(viewReport?.["Service Report Number"] || "").trim()
                }
                onClick={downloadServiceReportPDF}
                style={{
                  background: "#0D3884",
                  borderColor: "#0D3884",
                  fontWeight: 600,
                  minHeight: "40px",
                  flexShrink: 0,
                }}
              >
                {pdfDownloadLoadingReportNumber ===
                String(viewReport?.["Service Report Number"] || "").trim()
                  ? "Downloading..."
                  : "Download PDF"}
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

          <div
            className="view-parts-table-responsive"
            style={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            <Table
              bordered
              pagination={false}
              size="middle"
              tableLayout="fixed"
              rowKey={(record) => record.key}
              dataSource={viewPartsData}
              scroll={{ x: 1120 }}
              columns={[
                {
                  title: "Part No.",
                  dataIndex: "Part No.",
                  key: "Part No.",
                  width: 190,
                  ellipsis: true,
                  render: (value) => (
                    <Tooltip
                      title={
                        value == null || value === ""
                          ? "No part number"
                          : String(value)
                      }
                      placement="topLeft"
                    >
                      <span className="view-part-cell-text">
                        {value == null || value === "" ? "—" : String(value)}
                      </span>
                    </Tooltip>
                  ),
                },
                {
                  title: "Description",
                  dataIndex: "Description",
                  key: "Description",
                  width: 250,
                  ellipsis: true,
                  render: (value) => (
                    <Tooltip
                      title={
                        value == null || value === ""
                          ? "No description"
                          : String(value)
                      }
                      placement="topLeft"
                    >
                      <span className="view-part-cell-text">
                        {value == null || value === "" ? "—" : String(value)}
                      </span>
                    </Tooltip>
                  ),
                },
                {
                  title: "Qty",
                  dataIndex: "Qty",
                  key: "Qty",
                  width: 100,
                  align: "center",
                  render: (value) => (
                    <Tooltip
                      title={
                        value == null || value === ""
                          ? "No quantity"
                          : String(value)
                      }
                      placement="top"
                    >
                      <span className="view-part-cell-text">
                        {value == null || value === "" ? "—" : String(value)}
                      </span>
                    </Tooltip>
                  ),
                },
                {
                  title: "Used / Recommended",
                  dataIndex: "Used / Recommended",
                  key: "Used / Recommended",
                  width: 280,
                  ellipsis: true,
                  render: (value) => (
                    <Tooltip
                      title={
                        value == null || value === ""
                          ? "No used/recommended details"
                          : String(value)
                      }
                      placement="topLeft"
                    >
                      <span className="view-part-cell-text">
                        {value == null || value === "" ? "—" : String(value)}
                      </span>
                    </Tooltip>
                  ),
                },
                {
                  title: "Remarks",
                  dataIndex: "Remarks",
                  key: "Remarks",
                  width: 250,
                  ellipsis: true,
                  render: (value) => (
                    <Tooltip
                      title={
                        value == null || value === ""
                          ? "No remarks"
                          : String(value)
                      }
                      placement="topLeft"
                    >
                      <span className="view-part-cell-text">
                        {value == null || value === "" ? "—" : String(value)}
                      </span>
                    </Tooltip>
                  ),
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
                setPdfDownloadLoadingReportNumber("");
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
        borderRadius: "10px",
      }}
    >
      {title}
    </div>
  );
}
