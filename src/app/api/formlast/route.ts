import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver:'vincentiaadams@batp.org'
};

interface W4FormData {
  jobAppFullName?: string;
  jobRole?: string;
  location?: string;
  firstName?: string;
  lastName?: string;
  socialSecurityNumber?: string;
  address?: string;
  cityStateZip?: string;
  filingStatus?: {
    single?: boolean;
    marriedJointly?: boolean;
    headOfHousehold?: boolean;
  };
  multipleJobs?: {
    useEstimator?: boolean;
    useWorksheet?: boolean;
    twoJobsOnly?: boolean;
  };
  dependents?: {
    qualifyingChildren?: string;
    otherDependents?: string;
    totalCredits?: string;
  };
  otherAdjustments?: {
    otherIncome?: string;
    deductions?: string;
    extraWithholding?: string;
  };
  employerInfo?: {
    name?: string;
    firstDateOfEmployment?: string;
    ein?: string;
  };
}

async function generateW4TableLayoutPDF(formData: W4FormData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 3500]); // much larger height to fit all tables

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helpers
  const drawText = (
    text: string,
    x: number,
    y: number,
    size = 10,
    isBold = false,
    color = rgb(0, 0, 0)
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: isBold ? boldFont : font,
      color,
    });
  };

  const drawBox = (x: number, y: number, width: number, height: number) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderWidth: 1,
      color: rgb(0.9, 0.95, 1), // Always blue background
      borderColor: rgb(0.1, 0.1, 0.1),
    });
  };

  const drawField = (label: string, value: string, x: number, y: number) => {
    drawText(label, x, y + 20, 9, true);
    drawBox(x, y, 200, 18);
    drawText(value || '', x + 5, y + 5, 10);
  };

  const drawTable = (startX: number, startY: number, headers: string[], rows: string[][]) => {
    const rowHeight = 20;
    const colWidths = [130, 60, 60, 60, 60, 60, 60, 60];
    let y = startY;
    let x;
    headers.forEach((header, i) => {
      x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      page.drawRectangle({ x, y, width: colWidths[i], height: rowHeight, borderWidth: 1, borderColor: rgb(0.5, 0.5, 0.5) });
      drawText(header, x + 3, y + 6, 8, true);
    });
    y -= rowHeight;
    rows.forEach(row => {
      x = startX;
      row.forEach((cell, i) => {
        page.drawRectangle({ x, y, width: colWidths[i], height: rowHeight, borderWidth: 1, borderColor: rgb(0.85, 0.85, 0.85) });
        drawText(cell, x + 3, y + 6, 8);
        x += colWidths[i];
      });
      y -= rowHeight;
    });
    return y;
  };

  let y = 3500;

  // === Header ===
  page.drawRectangle({ x: 30, y: y, width: 550, height: 30, color: rgb(0, 0, 0) });
  drawText("Job Application Information", 40, y + 8, 14, true, rgb(1, 1, 1));
  y -= 50;

  // === Job Info Fields ===
  drawField("Full Name", formData.jobAppFullName || '', 40, y);
  drawField("Job Role", formData.jobRole || '', 240, y);
  drawField("Location", formData.location || '', 440, y);
  y -= 50;

    // === W-4 Title Block ===
  page.drawRectangle({ x: 30, y: y, width: 84, height: 45, borderWidth: 1, color: rgb(1, 1, 1), borderColor: rgb(0.1, 0.1, 0.1) });
  
  drawText("W-4", 44, y + 10, 24, true);
  drawText("Department of the Treasury", 38, y + 2, 6);
   

  drawText("Employee's Withholding Certificate", 120, y + 20, 18, true);
  drawText("Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.", 120, y + 10, 8);
  drawText("Give Form W-4 to your employer.", 120, y, 8);
  drawText("Your withholding is subject to review by the IRS.", 120, y - 10, 8);

  page.drawRectangle({ x: 500, y: y, width: 90, height: 45, borderWidth: 1, color: rgb(1, 1, 1), borderColor: rgb(0.1, 0.1, 0.1) });
  drawText("OMB No. 1545-0074", 505, y + 10, 4);
  drawText("2025", 520, y + 10, 24, true);
  y -= 70;

  // === Step 1: Personal Info ===
  drawText("Step 1: Enter Personal Information", 30, y, 12, true); y -= 30;

  // Row 1: First name, Last name, SSN
  drawText("(a) First name and middle initial", 30, y); y -= 25;
  drawText("Last name", 230, y + 5); 
  drawText("(b) Social Security number", 430, y + 5); y -= 25;
  drawBox(30, y, 180, 20); drawText(formData.firstName || '', 35, y + 5);
  drawBox(230, y, 180, 20); drawText(formData.lastName || '', 235, y + 5);
  drawBox(430, y, 150, 20); drawText(formData.socialSecurityNumber || '', 435, y + 5);
  y -= 40;

  // Address fields
  drawText("Address", 30, y); y -= 25;
  drawBox(30, y, 550, 20); drawText(formData.address || '', 35, y + 5); y -= 40;
  drawText("City or town, state, and ZIP code", 30, y); y -= 25;
  drawBox(30, y, 550, 20); drawText(formData.cityStateZip || '', 35, y + 5); y -= 50;

  drawText("(c) Filing Status", 30, y); y -= 25;
  drawText(`[${formData.filingStatus?.single ? "X" : " "}] Single or Married filing separately`, 40, y); y -= 20;
  drawText(`[${formData.filingStatus?.marriedJointly ? "X" : " "}] Married filing jointly or Qualifying surviving spouse`, 40, y); y -= 20;
  drawText(`[${formData.filingStatus?.headOfHousehold ? "X" : " "}] Head of household`, 40, y); y -= 40;

  // === Step 2: Multiple Jobs ===
  drawText("Step 2: Multiple Jobs or Spouse Works", 30, y, 12, true); y -= 30;
  drawText(`[${formData.multipleJobs?.useEstimator ? "X" : " "}] Use estimator at irs.gov/W4App`, 30, y); y -= 20;
  drawText(`[${formData.multipleJobs?.useWorksheet ? "X" : " "}] Use Multiple Jobs Worksheet`, 30, y); y -= 20;
  drawText(`[${formData.multipleJobs?.twoJobsOnly ? "X" : " "}] Check this box if only two jobs`, 30, y); y -= 40;

  // === Step 3: Dependents ===
  drawText("Step 3: Claim Dependents", 30, y, 12, true); y -= 30;
  drawText("Multiply # children under 17 by $2,000", 30, y); y -= 25;
  drawBox(320, y, 80, 18); drawText(String(formData.dependents?.qualifyingChildren ?? ''), 325, y + 5);
  y -= 30;
  drawText("Multiply # other dependents by $500", 30, y); y -= 25;
  drawBox(320, y, 80, 18); drawText(String(formData.dependents?.otherDependents ?? ''), 325, y + 5);
  y -= 30;
  drawText("Add credits and enter total", 30, y); y -= 25;
  drawBox(320, y, 80, 18); drawText(String(formData.dependents?.totalCredits ?? ''), 325, y + 5);
  y -= 40;

  // === Step 4 ===
  drawText("Step 4: (Optional) Other Adjustments", 30, y, 12, true); y -= 30;
  drawText("a) Other income", 30, y); y -= 25;
  drawBox(470, y, 80, 18); drawText(String(formData.otherAdjustments?.otherIncome ?? ''), 475, y + 5);
  y -= 30;
  drawText("b) Deductions", 30, y); y -= 25;
  drawBox(470, y, 80, 18); drawText(String(formData.otherAdjustments?.deductions ?? ''), 475, y + 5);
  y -= 30;
  drawText("c) Extra withholding", 30, y); y -= 25;
  drawBox(470, y, 80, 18); drawText(String(formData.otherAdjustments?.extraWithholding ?? ''), 475, y + 5);
  y -= 40;

  // === Step 5 ===
  drawText("Step 5: Sign Here", 30, y, 12, true); y -= 30;

  // Draw all three labels in a row
  drawText("Employer’s name and address", 30, y);
  drawText("First date of employment", 300, y);
  drawText("EIN", 450, y);
  y -= 40;

  // Draw all three boxes in a row
  drawBox(30, y, 250, 28); drawText(formData.employerInfo?.name || '', 35, y + 8);
  drawBox(300, y, 100, 28); drawText(formData.employerInfo?.firstDateOfEmployment || '', 305, y + 8);
  drawBox(450, y, 100, 28); drawText(formData.employerInfo?.ein || '', 455, y + 8);
  y -= 50;

  // === Tables ===
  const headers = ['Wage', '$0-9k', '$10-19k', '$20-29k', '$30-39k', '$40-49k', '$50-59k', '$60-69k'];
  const rows = [
    ['$0-9k', '$0', '$0', '$0', '$600', '$800', '$1000', '$1200'],
    ['$10-19k', '$700', '$900', '$1100', '$1300', '$1500', '$1700', '$1900'],
    ['$20-29k', '$1500', '$1700', '$1900', '$2100', '$2300', '$2500', '$2700'],
    ['$30-39k', '$2300', '$2500', '$2700', '$2900', '$3100', '$3300', '$3500'],
    ['$40-49k', '$3100', '$3300', '$3500', '$3700', '$3900', '$4100', '$4300'],
    ['$50-59k', '$3900', '$4100', '$4300', '$4500', '$4700', '$4900', '$5100'],
    ['$60-69k', '$4700', '$4900', '$5100', '$5300', '$5500', '$5700', '$5900'],
    ['$70-79k', '$5500', '$5700', '$5900', '$6100', '$6300', '$6500', '$6700'],
    ['$80-89k', '$6300', '$6500', '$6700', '$6900', '$7100', '$7300', '$7500'],
    ['$90-99k', '$7100', '$7300', '$7500', '$7700', '$7900', '$8100', '$8300'],
    ['$100-109k', '$7900', '$8100', '$8300', '$8500', '$8700', '$8900', '$9100'],
    ['$110-119k', '$8700', '$8900', '$9100', '$9300', '$9500', '$9700', '$9900'],
    ['$120k+', '$9500', '$9700', '$9900', '$10100', '$10300', '$10500', '$10700'],
  ];

  drawText("Married Filing Jointly or Qualifying Surviving Spouse", 30, y, 12, true); y -= 40;
  y = drawTable(30, y, headers, rows); y -= 40;

  drawText("Single or Married Filing Separately", 30, y, 12, true); y -= 40;
  y = drawTable(30, y, headers, rows); y -= 40;

  drawText("Head of Household", 30, y, 12, true); y -= 40;
  y = drawTable(30, y, headers, rows); y -= 40;

  // === Submit Button ===
  page.drawRectangle({ x: 180, y, width: 250, height: 30, color: rgb(0, 0, 0) });
  drawText("Submit Form", 250, y + 10, 12, true, rgb(1, 1, 1));

  return await pdfDoc.save();
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received W-4 form data:', data);

    // Generate UI-matching PDF
    const pdfBytes = await generateW4TableLayoutPDF(data);

    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Employment Form 08 (Employees Withholding Certificate)',
      text: 'See attached PDF for the submitted W-4 tax table layout.',
      attachments: [
        {
          filename: 'Employment Form 08 (Employees Withholding Certificate).pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        }
      ]
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form submission failed', error);
    return NextResponse.json({ success: false, error: 'Failed to generate PDF' }, { status: 500 });
  }
}
