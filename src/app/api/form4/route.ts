import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Email config (use the same as form7/route.ts)
const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'flbw wrtr rwgo grlu',
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
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 370;
  const lineHeight = 22;
  const sectionSpacing = 12;

  function drawHeading(text) {
    y -= lineHeight;
    page.drawText(text, { x: 50, y, size: 16, font: fontBold, color: rgb(0,0,0) });
    y -= sectionSpacing;
  }
  function drawField(label, value) {
    y -= lineHeight;
    page.drawText(label + ':', { x: 60, y, size: 12, font: fontBold, color: rgb(0.1,0.1,0.1) });
    page.drawText(value || '', { x: 200, y, size: 12, font, color: rgb(0.2,0.2,0.2) });
  }

  // Compliance Handbook
  drawHeading('Compliance Handbook and Code of Conduct');
  drawField('Name', formData.name);
  drawField('Date', formData.date);

  // Signature
  drawHeading('Signature');
  if (formData.signature && formData.signature.startsWith('data:image')) {
    const base64 = formData.signature.split(',')[1];
    const imageBytes = Buffer.from(base64, 'base64');
    let image;
    if (formData.signature.startsWith('data:image/png')) {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      image = await pdfDoc.embedJpg(imageBytes);
    }
    const imgDims = image.scale(0.5);
    y -= (imgDims.height + 10);
    page.drawImage(image, {
      x: 60,
      y: y,
      width: imgDims.width,
      height: imgDims.height,
    });
    y -= 10;
    drawField('Signature Provided', 'Yes (see image above)');
  } else {
    drawField('Signature Provided', 'No');
  }

  return await pdfDoc.save();
}

export async function POST(req) {
  try {
    const formData = await req.json();
    // Generate PDF
    const pdfBytes = await generateCompliancePDF(formData);
    // Define mailOptions
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Compliance Handbook Submission',
      text: 'See attached PDF for the submitted compliance handbook acknowledgment.',
      attachments: [
        {
          filename: 'compliance-handbook.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process compliance form' },
      { status: 500 }
    );
  }
} 