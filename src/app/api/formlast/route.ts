import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb, RGB } from 'pdf-lib';

const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'nlis zqmk mnon daak',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

async function generateW4TableLayoutPDF(formData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 1800]); // Extended height

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    isBold: boolean = false,
    color: RGB = rgb(0, 0, 0)
  ) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: isBold ? bold : font,
      color: color,
    });
  };

  const drawInputBox = (x: number, y: number, width: number, height = 18) => {
    page.drawRectangle({
      x, y, width, height,
      borderWidth: 1,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.7, 0.7, 0.7),
    });
  };

  const drawInputValue = (value, x, y, size = 10) => {
    if (value) page.drawText(String(value), { x: x + 5, y: y + 4, size, font, color: rgb(0.2, 0.2, 0.2) });
  };

  const drawSectionTitle = (text: string, x: number, y: number, size = 13) => {
    drawText(text, x, y, size, true);
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

  let y = 1750;

  // Header
  page.drawRectangle({ x: 30, y: y - 20, width: 70, height: 60, borderWidth: 2, borderColor: rgb(0.7, 0.7, 0.7) });
  drawText("Form", 38, y + 25, 8, true);
  drawSectionTitle("W-4", 38, y + 10, 24);
  drawText("Department of the Treasury", 38, y, 6);
  drawText("Internal Revenue Service", 38, y - 8, 6);

  drawSectionTitle("Employee's Withholding Certificate", 120, y + 25, 18);
  drawText("Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.", 120, y + 10, 8, true);
  drawText("Give Form W-4 to your employer.", 120, y, 8, true);
  drawText("Your withholding is subject to review by the IRS.", 120, y - 10, 8, true);

  page.drawRectangle({ x: 500, y: y - 20, width: 80, height: 60, borderWidth: 2, borderColor: rgb(0.7, 0.7, 0.7) });
  drawText("OMB No. 1545-0074", 505, y + 25, 8);
  drawSectionTitle("2025", 520, y + 10, 24);
  y -= 90;

  // Step 1
  drawSectionTitle("Step 1: Enter Personal Information", 30, y); y -= 30;
  drawText("(a) First name and middle initial", 30, y, 10, false);
  drawText("Last name", 230, y, 10, false);
  drawText("(b) Social Security Number", 430, y, 10, false);
  y -= 20;
  drawInputBox(30, y, 180); drawInputValue(formData.firstName + (formData.middleInitial ? (" " + formData.middleInitial) : ""), 30, y);
  drawInputBox(230, y, 180); drawInputValue(formData.lastName, 230, y);
  drawInputBox(430, y, 150); drawInputValue(formData.socialSecurityNumber, 430, y);
  y -= 40;
  drawText("Address", 30, y, 10); y -= 20;
  drawInputBox(30, y, 300); drawInputValue(formData.address, 30, y); y -= 30;
  drawText("City or town, state, and ZIP code", 30, y, 10); y -= 20;
  drawInputBox(30, y, 300); drawInputValue(formData.cityStateZip, 30, y); y -= 35;
  drawText("(c) Filing Status", 360, y + 20, 10); y -= 5;
  drawText(`[${formData.filingStatus?.single ? 'X' : ' '}] Single or Married filing separately`, 360, y, 10); y -= 15;
  drawText(`[${formData.filingStatus?.marriedJointly ? 'X' : ' '}] Married filing jointly or Qualifying surviving spouse`, 360, y, 10); y -= 15;
  drawText(`[${formData.filingStatus?.headOfHousehold ? 'X' : ' '}] Head of household`, 360, y, 10); y -= 40;

  // Step 2
  drawSectionTitle("Step 2: Multiple Jobs or Spouse Works", 30, y); y -= 20;
  drawText(`[${formData.multipleJobs?.useEstimator ? 'X' : ' '}] (a) Use estimator at www.irs.gov/W4App`, 30, y, 8); y -= 12;
  drawText(`[${formData.multipleJobs?.useWorksheet ? 'X' : ' '}] (b) Use the Multiple Jobs Worksheet`, 30, y, 8); y -= 12;
  drawText(`[${formData.multipleJobs?.twoJobsOnly ? 'X' : ' '}] (c) If there are only two jobs, check this box`, 30, y, 8); y -= 30;

  // Step 3
  drawSectionTitle("Step 3: Claim Dependents", 30, y); y -= 20;
  drawText("Multiply # children under 17 by $2,000", 30, y, 8); y -= 12; drawInputBox(320, y, 80); drawInputValue(formData.dependents?.qualifyingChildren, 320, y); y -= 20;
  drawText("Multiply # other dependents by $500", 30, y, 8); y -= 12; drawInputBox(320, y, 80); drawInputValue(formData.dependents?.otherDependents, 320, y); y -= 20;
  drawText("Add credits and enter total", 30, y, 8); y -= 12; drawInputBox(320, y, 80); drawInputValue(formData.dependents?.totalCredits, 320, y); y -= 30;

  // Step 4
  drawSectionTitle("Step 4: (Optional) Other Adjustments", 30, y); y -= 20;
  drawText("a) Other income (not from jobs)", 30, y, 8); y -= 12; drawInputBox(470, y, 80); drawInputValue(formData.otherAdjustments?.otherIncome, 470, y); y -= 20;
  drawText("b) Deductions (use worksheet)", 30, y, 8); y -= 12; drawInputBox(470, y, 80); drawInputValue(formData.otherAdjustments?.deductions, 470, y); y -= 20;
  drawText("c) Extra withholding", 30, y, 8); y -= 12; drawInputBox(470, y, 80); drawInputValue(formData.otherAdjustments?.extraWithholding, 470, y); y -= 30;

  // Step 5
  drawSectionTitle("Step 5: Sign Here", 30, y); y -= 20;
  drawText("Employer's name and address", 30, y, 10); y -= 15; drawInputBox(30, y, 250, 28); drawInputValue(formData.employerInfo?.name, 30, y);
  drawText("First date of employment", 300, y + 10, 10); drawInputBox(300, y, 100, 28); drawInputValue(formData.employerInfo?.firstDateOfEmployment, 300, y);
  drawText("EIN", 420, y + 10, 10); drawInputBox(420, y, 100, 28); drawInputValue(formData.employerInfo?.ein, 420, y); y -= 60;

  // Tables
  const headers = ['Wage', '$0-9k', '$10-19k', '$20-29k', '$30-39k', '$40-49k', '$50-59k', '$60-69k'];
  const rows = [
    ['$0-9k', '$0', '$0', '$0', '$600', '$800', '$1000', '$1200'],
    ['$10-19k', '$700', '$900', '$1100', '$1300', '$1500', '$1700', '$1900'],
    ['$20-29k', '$1500', '$1700', '$1900', '$2100', '$2300', '$2500', '$2700'],
  ];

  drawSectionTitle("Married Filing Jointly or Qualifying Surviving Spouse", 30, y); y -= 20;
  y = drawTable(30, y, headers, rows); y -= 40;

  drawSectionTitle("Single or Married Filing Separately", 30, y); y -= 20;
  y = drawTable(30, y, headers, rows); y -= 40;

  drawSectionTitle("Head of Household", 30, y); y -= 20;
  y = drawTable(30, y, headers, rows); y -= 40;

  // Footer Submit Button
  page.drawRectangle({ x: 180, y, width: 250, height: 30, color: rgb(0, 0, 0) });
  drawText("Submit Form", 260, y + 10, 12, true);

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
      subject: 'New W-4 Form Submission',
      text: 'See attached PDF for the submitted W-4 tax table layout.',
      attachments: [
        {
          filename: 'w4-form-table.pdf',
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return NextResponse.json({ success: true, message: 'Form sent with table layout' });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error sending form', error },
      { status: 500 }
    );
  }
}
