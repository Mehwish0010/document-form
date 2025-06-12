import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  receiver: process.env.EMAIL_RECEIVER
};

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log('Received form data:', formData);

    // Validate required fields
    if (!formData.signature || !formData.name || !formData.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const {  height } = page.getSize();
    let y = height - 40;

    // Helper to draw text line by line
    const drawLine = (label: string, value: string | undefined) => {
      page.drawText(`${label}: ${value || ''}`, {
        x: 50,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      });
      y -= 20;
    };

    // Add title
    page.drawText('Compliance Handbook and Code of Conduct', {
      x: 50,
      y: height - 40,
      size: 16,
      color: rgb(0, 0, 0),
    });
    y -= 40;

    // Add form data
    drawLine('Name', formData.name);
    drawLine('Date', formData.date);

    // Add signature
    if (formData.signature) {
      try {
        const signatureImageBytes = Buffer.from(formData.signature.split(',')[1], 'base64');
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        const sigDims = signatureImage.scale(0.5);
        page.drawImage(signatureImage, {
          x: 50,
          y: y - 50,
          width: sigDims.width,
          height: sigDims.height,
        });
        drawLine('Signature', '(image embedded)');
      } catch (error) {
        console.error('Error embedding signature:', error);
      }
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    // Send email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Compliance Handbook Submission',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #ffffff;">
          <h2 style="text-align: center; color: #333; margin-bottom: 5px;">COMPLIANCE HANDBOOK AND CODE OF CONDUCT</h2>
          <h3 style="text-align: center; color: #555; margin-top: 0; margin-bottom: 5px;">Behavior Analysis & Therapy Partners (BATP)</h3>
          
          <hr style="border: none; height: 1px; background-color: #333; margin: 5px auto 2px auto; width: 80%;">
          <hr style="border: none; height: 1px; background-color: #333; margin: 2px auto 20px auto; width: 80%;">
          
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">EMPLOYEE ACKNOWLEDGMENT</h4>
          </div>
          
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Name:</strong> ${formData.name}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>Date:</strong> ${formData.date}</p>
          <p style="margin-top: 5px; margin-bottom: 20px;"><strong>Signature:</strong> (image embedded in PDF)</p>
          
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">ACKNOWLEDGMENT STATEMENT</h4>
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 20px; margin-bottom: 20px;">
            I have received and have read the BATP Compliance Manual and Code of Conduct. I agree to abide by 
            what is outlined in the Manual and the Clinical Code of Conduct and Ethics and the Business Code 
            of Conduct. If I have any questions, I will contact my supervisor or a member of the designated 
            Corporate Compliance Staff.
          </p>

          <p style="margin-top: 20px;"><em>Complete form with signature is attached below.</em></p>
        </div>
      `,
      attachments: [
        {
          filename: 'compliance_handbook.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf'
        }
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully and email notification sent',
        data: formData
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully but email notification failed',
        data: formData,
        emailError: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 