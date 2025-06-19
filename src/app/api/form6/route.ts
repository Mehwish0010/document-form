import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Email configuration
const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'flbwwrtrrwgogrlu', // App password
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  },
  logger: true,
  debug: true // Enables detailed logs in terminal
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      witness,
      name,
      signature,
      date,
      guardianName,
      guardianSignature,
      guardianDate
    } = body;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = 750;
    const drawText = (text: string, x: number, y: number, isBold: boolean = false, size: number = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    drawText('DISCLOSURE STATEMENT', 50, y, true, 18); y -= 30;
    drawText('Application for Employment, Including Provisional Employment', 50, y, false, 12); y -= 30;
    drawText('Required by the Child Protective Service Law', 50, y, false, 12); y -= 20;
    drawText('23 Pa. C.S. Section 6344', 50, y, false, 12); y -= 30;

    drawText('Witness:', 50, y, true); drawText(witness || '', 150, y); y -= 30;
    drawText('Applicant Name:', 50, y, true); drawText(name || '', 200, y); y -= 30;
    drawText('Date:', 50, y, true); drawText(date || '', 120, y); y -= 30;

    // Witness Signature
    drawText('Witness Signature:', 50, y, true); y -= 60;
    if (body.witnessSignature) {
      try {
        const witnessSigImg = await pdfDoc.embedPng(body.witnessSignature.split(',')[1]);
        page.drawImage(witnessSigImg, { x: 50, y: y, width: 150, height: 50 });
      } catch { /* ignore */ }
    }
    y -= 60;
    // Applicant Signature
    drawText('Applicant Signature:', 50, y, true); y -= 60;
    if (signature) {
      try {
        const sigImg = await pdfDoc.embedPng(signature.split(',')[1]);
        page.drawImage(sigImg, { x: 50, y: y, width: 150, height: 50 });
      } catch { /* ignore */ }
    }
    y -= 60;
    // Guardian Section
    drawText('Guardian Name:', 50, y, true); drawText(guardianName || '', 180, y); y -= 30;
    drawText('Guardian Date:', 50, y, true); drawText(guardianDate || '', 180, y); y -= 30;
    drawText('Guardian Signature:', 50, y, true); y -= 60;
    if (guardianSignature) {
      try {
        const guardianSigImg = await pdfDoc.embedPng(guardianSignature.split(',')[1]);
        page.drawImage(guardianSigImg, { x: 50, y: y, width: 150, height: 50 });
      } catch { /* ignore */ }
    }

    const pdfBytes = await pdfDoc.save();

    // Email options
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Disclosure Statement Form Submission',
      text: `Disclosure Statement submitted by ${name}.`,
      attachments: [
        {
          filename: 'Disclosure-Statement.pdf',
          content: Buffer.from(pdfBytes),
        },
      ],
    };

    // Send email
    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.response);

      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully. Email with PDF sent.',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Server error:', error);
    return NextResponse.json(
      { error: 'Server error while sending email' },
      { status: 500 }
    );
  }
}

