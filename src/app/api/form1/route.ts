import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver:'HR.batp@batp.org'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

async function generateCompliancePDF(formData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 1800]);
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const padding = 50;
  const contentWidth = width - (padding * 2);
  let y = page.getHeight() - padding;

  async function drawParagraph(page, text, x, y, font, fontSize, color, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    for (const word of words) {
      const testLine = line + word + " ";
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line.trim());
    for (let i = 0; i < lines.length; i++) {
      page.drawText(lines[i], {
        x,
        y: y - i * lineHeight,
        size: fontSize,
        font,
        color,
      });
    }
    return y - lines.length * lineHeight;
  }

  const drawText = (text, x, yPos, fontToUse, size, color = black, maxWidth, lineHeight) => {
    page.drawText(text, { x, y: yPos, font: fontToUse, size, color, maxWidth, lineHeight });
  };
  // Remove blue background from all input boxes
  const drawInputBox = (x, yPos, w, h) => {
    page.drawRectangle({ x, y: yPos, width: w, height: h, borderWidth: 1, borderColor: black });
  };

  // --- Job Application Fields at the top ---
  page.drawRectangle({ x: padding, y: y - 30, width: contentWidth, height: 30, color: black });
  drawText("Job Application Information", padding + 10, y - 12, fontBold, 15, white, undefined, undefined);
  y -= 80;
// Draw labels in a row
const labelY = y + 18;
drawText("Full Name", padding, labelY, fontBold, 11, black, undefined, undefined);
drawText("Job Role", padding + 180, labelY, fontBold, 11, black, undefined, undefined);
drawText("Location", padding + 360, labelY, fontBold, 11, black, undefined, undefined);
// Add vertical space between label row and input box row
y -= 6;
// Draw input boxes in a row
drawInputBox(padding, y, 160, 22);
drawInputBox(padding + 180, y, 160, 22);
drawInputBox(padding + 360, y, 160, 22);
// Draw values in boxes
drawText(formData.jobAppFullName || '', padding + 8, y + 6, font, 11, black, undefined, undefined);
drawText(formData.jobRole || '', padding + 188, y + 6, font, 11, black, undefined, undefined);
drawText(formData.location || '', padding + 368, y + 6, font, 11, black, undefined, undefined);
y -= 40;

  // Title and subtitle (centered, match UI)

  drawText("BEHAVIOR ANALYSIS & THERAPY PARTNERS", padding, y, fontBold, 16, black, undefined, undefined);
  y -= 24;
  drawText("CONFIDENTIALITY AGREEMENT", padding, y, fontBold, 13, black, undefined, undefined);
  y -= 30;

  // Agreement statement
  y -= 10;
  y = await drawParagraph(page, "I, ", padding, y, font, 11, black, contentWidth, 16);
  drawInputBox(padding + 20, y + 4, 200, 14);
  drawText(formData.name || '', padding + 25, y + 7, font, 11, black, undefined, undefined);
  drawText(", agree with the following statements:", padding + 230, y + 7, font, 11, black, undefined, undefined);
  y -= 30;

  // Privacy Policy bold
  drawText("I have read and understood BATP's Privacy Policy.", padding, y, fontBold, 12, black, undefined, undefined);
  y -= 20;

  // Policy paragraphs
  y = await drawParagraph(page, "I understand that I may encounter confidential information during my time at BATP. As part of the condition of my work with BATP I will keep in strict confidence any information regarding any client, employee, consultant, or business of BATP or any other organization that comes to my attention while at BATP. I will do this in accordance with the BATP privacy policy and applicable laws, including those that require mandatory reporting. If I am unsure of whether or not to disclose, I will bring it up in supervision.", padding, y, font, 11, black, contentWidth, 16);
  y -= 10;
  y = await drawParagraph(page, "I also agree to never remove any confidential material of any kind from the premises of BATP unless authorized as part of my duties, or with the express permission or direction to do so from BATP.", padding, y, font, 11, black, contentWidth, 16);
  y -= 20;

  // INSTRUCTIONS section (move before signature fields)
  drawText("INSTRUCTIONS", padding, y, fontBold, 14, black, undefined, undefined); y -= 20;
  y = await drawParagraph(page, "This form is to be used by employers and taxpayers to report essential information for the collection and distribution of Local Earned Income Taxes to the local EIT collector.", padding, y, font, 11, black, contentWidth, 16);
  y -= 16;
  y = await drawParagraph(page, "This form must be used by employers when a new employee is hired or when a current employee notifies employer of a name or address change.", padding, y, font, 11, black, contentWidth, 16);
  y -= 16;
  y = await drawParagraph(page, "Use the Address Search Application at dced.pa.gov/Act32 to determine PSD codes, EIT rates, and tax collector contact information.", padding, y, font, 11, black, contentWidth, 16);
  y -= 20;
  y = await drawParagraph(page, "By signing this form, you acknowledge that you have read, understood, and agree to abide by the BATP Privacy Policy and all confidentiality requirements.", padding, y, font, 11, black, contentWidth, 16);
  y -= 30;

  // Signature and Date fields (side by side)
  // Signature label
  drawText('Signature', padding, y, font, 11, black, undefined, undefined);
  // Date label on the right
  const dateLabelX = padding + 300;
  drawText('Date', dateLabelX, y, font, 11, black, undefined, undefined);
  // Move down for boxes
  y -= 24;
  // Signature box
  page.drawRectangle({ x: padding, y: y - 100, width: 240, height: 100, borderWidth: 1, borderColor: black });
  // Date box to the right
  page.drawRectangle({ x: dateLabelX, y: y - 10, width: 120, height: 22, borderWidth: 1, borderColor: black });
  drawText(formData.date || 'mm/dd/yyyy', dateLabelX + 10, y + 2, font, 11, black, undefined, undefined);
  // Signature image logic (if present)
  if (formData.signature && typeof formData.signature === 'string' && formData.signature.startsWith('data:image')) {
    try {
      const imageBytes = Buffer.from(formData.signature.split(',')[1], 'base64');
      let image;
      if (formData.signature.startsWith('data:image/png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (formData.signature.startsWith('data:image/jpeg') || formData.signature.startsWith('data:image/jpg')) {
        image = await pdfDoc.embedJpg(imageBytes);
      }
      if (image) {
        page.drawImage(image, { x: padding + 5, y: y - 95, width: 230, height: 90 });
      } else {
        page.drawLine({ start: { x: padding + 10, y: y - 50 }, end: { x: padding + 230, y: y - 50 }, thickness: 1, color: black });
      }
    } catch {
      page.drawLine({ start: { x: padding + 10, y: y - 50 }, end: { x: padding + 230, y: y - 50 }, thickness: 1, color: black });
    }
  } else {
    page.drawLine({ start: { x: padding + 10, y: y - 50 }, end: { x: padding + 230, y: y - 50 }, thickness: 1, color: black });
    page.drawText('Clear Signature', { x: padding + 10, y: y - 40, size: 12, font: fontBold, color: rgb(1,0,0) });
  }
  y -= 120; // vertical space after signature/date row
  drawText('Print Name', padding, y, font, 11, black, undefined, undefined);
  y -= 24; // vertical space before box
  page.drawRectangle({ x: padding, y: y - 22, width: 240, height: 22, borderWidth: 1, borderColor: black });
  drawText(formData.print || '', padding + 8, y - 10, font, 11, black, undefined, undefined);
  y -= 40; // vertical space after print box

  // Footer
  page.drawText("BATP Confidentiality Agreement v1.0", {
    x: padding + contentWidth - 220,
    y,
    size: 11,
    font: fontBold,
    color: black,
  });

  return pdfDoc.save();
}

export async function POST(req) {
  try {
    const formData = await req.json();
    const pdfBytes = await generateCompliancePDF(formData);
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Employment Form 03 (Confidentiality Agreement)',
      text: 'See attached PDF for the submitted confidentiality agreement.',
      attachments: [
        {
          filename: 'Employment Form 03 ( Confidentiality Agreement)',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully'
      });
    } catch (emailError) {
      return NextResponse.json(
        { 
          success: true,
          error: 'Form submitted but email notification failed',
          details: emailError
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to process confidentiality form' },
      { status: 500 }
    );
  }
}