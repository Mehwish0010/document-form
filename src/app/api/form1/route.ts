import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'nlis zqmk mnon daak ',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
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
  const headerGray = rgb(0.2, 0.2, 0.2);
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
  const drawInputBox = (x, yPos, w, h, hasValue) => {
    page.drawRectangle({ x, y: yPos, width: w, height: h, color: hasValue ? rgb(0.9,0.95,1) : white, borderWidth: 1, borderColor: black });
  };

  // --- Job Application Fields at the top ---
  drawText("Job Application Information", padding, y, fontBold, 14, black, undefined, undefined); y -= 24;
  drawText("Full Name:", padding, y, font, 11, black, undefined, undefined); 
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.jobAppFullName);
  drawText(formData.jobAppFullName || '', padding + 95, y - 5, font, 11, black, undefined, undefined); y -= 22;
  drawText("Job Role:", padding, y, font, 11, black, undefined, undefined);
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.jobRole);
  drawText(formData.jobRole || '', padding + 95, y - 5, font, 11, black, undefined, undefined); y -= 22;
  drawText("Location:", padding, y, font, 11, black, undefined, undefined);
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.location);
  drawText(formData.location || '', padding + 95, y - 5, font, 11, black, undefined, undefined); y -= 30;

  // Title and subtitle (centered, match UI)
  drawText("BEHAVIOR ANALYSIS & THERAPY PARTNERS", padding, y, fontBold, 16, black, undefined, undefined); y -= 24;
  drawText("CONFIDENTIALITY AGREEMENT", padding, y, fontBold, 13, black, undefined, undefined); y -= 30;

  // Job Application Information Section (match UI layout)
  if (formData.name) {
    y -= 10;
    page.drawRectangle({ x: padding, y: y, width: contentWidth, height: 25, color: headerGray });
    drawText("JOB APPLICATION INFORMATION", padding + 10, y + 8, fontBold, 12, white, undefined, undefined);
    y -= 30;
    drawText("Full Name:", padding, y, font, 11, black, undefined, undefined);
    drawInputBox(padding + 90, y - 10, 180, 18, !!formData.name);
    drawText(formData.name || '', padding + 95, y - 5, font, 11, black, undefined, undefined);
    y -= 22;
    // No job role/location in this form, but keep layout consistent
    drawText("Date:", padding, y, font, 11, black, undefined, undefined);
    drawInputBox(padding + 90, y - 10, 120, 18, !!formData.date);
    drawText(formData.date || '', padding + 95, y - 5, font, 11, black, undefined, undefined);
    y -= 30;
  }

  // Agreement statement
  y -= 10;
  y = await drawParagraph(page, "I, ", padding, y, font, 11, black, contentWidth, 16);
  drawInputBox(padding + 20, y + 4, 200, 14, !!formData.name);
  drawText(formData.name || '', padding + 25, y + 7, font, 11, black, undefined, undefined);
  drawText(", agree with the following statements:", padding + 230, y + 7, font, 11, black, undefined, undefined);
  y -= 30;

  // Privacy Policy bold
  drawText("I have read and understood BATP's Privacy Policy.", padding, y, fontBold, 12, black, undefined, undefined); y -= 20;

  // Policy paragraphs
  y = await drawParagraph(page, "I understand that I may encounter confidential information during my time at BATP. As part of the condition of my work with BATP I will keep in strict confidence any information regarding any client, employee, consultant, or business of BATP or any other organization that comes to my attention while at BATP. I will do this in accordance with the BATP privacy policy and applicable laws, including those that require mandatory reporting. If I am unsure of whether or not to disclose, I will bring it up in supervision.", padding, y, font, 11, black, contentWidth, 16); y -= 10;
  y = await drawParagraph(page, "I also agree to never remove any confidential material of any kind from the premises of BATP unless authorized as part of my duties, or with the express permission or direction to do so from BATP.", padding, y, font, 11, black, contentWidth, 16); y -= 30;

  // Signature block
  let signatureHeight = 40; // Default height for signature image or line
  if (formData.signature && formData.signature.startsWith('data:image')) {
    try {
      const imageBytes = Buffer.from(formData.signature.split(',')[1], 'base64');
      const image = await (formData.signature.startsWith('data:image/png') ? pdfDoc.embedPng(imageBytes) : pdfDoc.embedJpg(imageBytes));
      const dims = image.scale(0.4);
      page.drawImage(image, { x: padding + 10, y: y - dims.height, width: dims.width, height: dims.height });
      signatureHeight = dims.height;
    } catch {
      page.drawLine({ start: { x: padding + 10, y: y }, end: { x: padding + 250, y: y }, thickness: 1 });
    }
  } else {
    page.drawLine({ start: { x: padding + 10, y: y }, end: { x: padding + 250, y: y }, thickness: 1 });
  }
  // Draw the "Signature:" label just below the image/line
  y -= signatureHeight + 10;
  drawText("Signature:", padding, y, font, 12, black, undefined, undefined);

  // Add extra space before the next fields
  y -= 40; // Increased spacing to prevent merging

  drawText("Print Name:", padding + 270, y + 5, font, 12, black, undefined, undefined);
  drawInputBox(padding + 350, y - 15, 180, 20, !!formData.name);
  drawText(formData.name || '', padding + 355, y - 10, font, 11, black, undefined, undefined);

  drawText("Date:", padding, y, font, 12, black, undefined, undefined);
  drawInputBox(padding + 50, y - 10, 120, 18, !!formData.date);
  drawText(formData.date || '', padding + 55, y - 5, font, 11, black, undefined, undefined);
  y -= 40;

  // Instructions Section
  y -= 10;
  drawText("INSTRUCTIONS", padding, y, fontBold, 14, black, undefined, undefined); y -= 20;
  y = await drawParagraph(page, "This form is to be completed by all staff, employees, contractors, and agents of BATP. Please read the confidentiality agreement carefully and sign above. If you have any questions, contact your supervisor or a member of the designated Corporate Compliance Staff.", padding, y, font, 11, black, contentWidth, 16); y -= 10;
  y = await drawParagraph(page, "By signing this form, you acknowledge that you have read, understood, and agree to abide by the BATP Privacy Policy and all confidentiality requirements.", padding, y, font, 11, black, contentWidth, 16); y -= 30;

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
      subject: 'New Confidentiality Agreement Submission',
      text: 'See attached PDF for the submitted confidentiality agreement.',
      attachments: [
        {
          filename: 'confidentiality-agreement.pdf',
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