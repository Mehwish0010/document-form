import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'flbw wrtr rwgo grlu',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  },
  debug: true,
  logger: true
});

// Define email error type
interface EmailError extends Error {
  code?: string;
  command?: string;
  responseCode?: number;
  response?: string;
}

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    console.log('Received raw body:', rawBody);

    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    let formData;
    try {
      formData = JSON.parse(rawBody);
      console.log('Parsed form data:', formData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    try {
      console.log('Starting PDF creation...');
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);

      const fontSize = 10;
      const { width, height } = page.getSize();
      let y = height - 40;

      // Helper to draw text line by line
      const drawLine = (label: string, value: string | undefined) => {
        page.drawText(`${label}: ${value || ''}`, {
          x: 50,
          y,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
        y -= 16;
      };

      console.log('Drawing form data...');
      // Draw form data
      drawLine('Name', formData.name);
      drawLine('Street Address', formData.streetAddress);
      drawLine('Address Line 2', formData.address2);
      drawLine('City', formData.city);
      drawLine('State', formData.state);
      drawLine('Zip', formData.zip);
      drawLine('Phone', formData.phone);
      drawLine('Email', formData.email);
      drawLine('Date', formData.date);

      console.log('Processing signature...');
      if (formData.employeeSignature) {
        try {
          const signatureImageBytes = Buffer.from(formData.employeeSignature.split(',')[1], 'base64');
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

      console.log('Saving PDF...');
      const pdfBytes = await pdfDoc.save();

      console.log('Creating email content...');
      const emailContent = `
        <h2>New Confidentiality Agreement Submission</h2>
        
        <h3>Employee Information:</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Street Address:</strong> ${formData.streetAddress}</p>
        ${formData.address2 ? `<p><strong>Address Line 2:</strong> ${formData.address2}</p>` : ''}
        <p><strong>City:</strong> ${formData.city}</p>
        <p><strong>State:</strong> ${formData.state}</p>
        <p><strong>Zip:</strong> ${formData.zip}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Date:</strong> ${formData.date}</p>
      `;

      console.log('Sending email...');
      const mailOptions = {
        from: emailConfig.user,
        to: emailConfig.receiver,
        subject: 'New Confidentiality Agreement Submission',
        html: emailContent,
        attachments: [
          {
            filename: 'confidentiality_agreement.pdf',
            content: Buffer.from(pdfBytes),
          },
        ],
      };

      try {
        console.log('Attempting to send email...');
        console.log('Mail options:', {
          ...mailOptions,
          attachments: [{ filename: mailOptions.attachments[0].filename }]
        });
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        
        return NextResponse.json({
          success: true,
          message: 'Form submitted successfully and email notification sent',
          data: formData
        });
      } catch (error) {
        const emailError = error as EmailError;
        console.error('Error sending email:', emailError);
        console.error('Email error details:', {
          message: emailError.message,
          stack: emailError.stack,
          code: emailError.code
        });
        
        return NextResponse.json({
          success: true,
          message: 'Form submitted successfully but email notification failed',
          data: formData,
          emailError: emailError.message
        });
      }
    } catch (error) {
      console.error('Error processing form:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error processing form data',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 