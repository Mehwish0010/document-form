import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const fontSize = 10;
    const {  height } = page.getSize();
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

    // Flatten some data (like SSN)
    const ssn = [
      formData.ssn1, formData.ssn2, formData.ssn3,
      formData.ssn4, formData.ssn5, formData.ssn6,
      formData.ssn7, formData.ssn8, formData.ssn9,
    ].join('');

    // Draw form data
    drawLine('Name', formData.name);
    drawLine('SSN', ssn);
    drawLine('Street Address', formData.streetAddress);
    drawLine('Address Line 2', formData.address2);
    drawLine('City', formData.city);
    drawLine('State', formData.state);
    drawLine('Zip', formData.zip);
    drawLine('Phone', formData.phone);
    drawLine('Municipality', formData.municipality);
    drawLine('County', formData.county);
    drawLine('Resident PSD', formData.residentPsd);
    drawLine('Resident Rate', formData.residentRate);
    drawLine('Employer Name', formData.employerName);
    drawLine('EIN', formData.ein);
    drawLine('Employer Address', `${formData.employerStreet}, ${formData.employerCity}, ${formData.employerState} ${formData.employerZip}`);
    drawLine('Employer Municipality', formData.employerMunicipality);
    drawLine('Employer County', formData.employerCounty);
    drawLine('Work PSD', formData.workPsd);
    drawLine('Non-Resident Rate', formData.nonResRate);
    drawLine('Date', formData.date);
    drawLine('Employee Phone', formData.employeePhone);
    drawLine('Email', formData.email);

    // Embed signature if provided
    if (formData.employeeSignature) {
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
    }

    const pdfBytes = await pdfDoc.save();

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mehwishsheikh0010sheikh@gmail.com', // your email
        pass: 'flbwwtrrwgogrlu', // your app-specific password
      },
    });

    await transporter.sendMail({
      from: '"Residency Form Bot" <mehwishsheikh0010sheikh@gmail.com>',
      to: 'another.email@gmail.com', // use different email!
      subject: 'Residency Certification Form Submission',
      text: 'Hi,\n\nPlease find attached the Residency Certification Form submitted by a user.\n\nRegards,\nTeam',
      html: '<p>Please find attached the <strong>Residency Certification Form</strong>.</p>',
      attachments: [
        {
          filename: 'residency_form.pdf',
          content: Buffer.from(pdfBytes),
        },
      ],
    });
    

    return NextResponse.json({ success: true, message: 'Form submitted and emailed successfully.' });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit form.' }, { status: 500 });
  }
}
