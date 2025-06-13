import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';

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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log('Received form data:', formData);

    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zipCode') as string;
    const pdfFile = formData.get('pdf') as File;

    // Validate required fields
    const missingFields = [];
    if (!firstName) missingFields.push('First Name');
    if (!lastName) missingFields.push('Last Name');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');
    if (!address) missingFields.push('Address');
    if (!city) missingFields.push('City');
    if (!state) missingFields.push('State');
    if (!zipCode) missingFields.push('ZIP Code');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate PDF
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #333;">New Form Submission</h2>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Personal Information</h3>
          <p><strong>First Name:</strong> ${firstName}</p>
          <p><strong>Last Name:</strong> ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>ZIP Code:</strong> ${zipCode}</p>
        </div>
      </div>
    `;

    // Define mailOptions
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Form Submission',
      html: htmlContent,
      attachments: [
        {
          filename: 'submission.pdf',
          content: pdfBuffer
        }
      ]
    };

    // Send email
    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);

      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully and email notification sent'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
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
