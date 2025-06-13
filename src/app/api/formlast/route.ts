import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log('📝 Form data received');

    // Extract form fields
    const firstName = formData.get('firstName') as string;
    const middleInitial = formData.get('middleInitial') as string;
    const lastName = formData.get('lastName') as string;
    const socialSecurityNumber = formData.get('socialSecurityNumber') as string;
    const address = formData.get('address') as string;
    const cityStateZip = formData.get('cityStateZip') as string;
    const filingStatus = formData.get('filingStatus') as string;
    const multipleJobs = formData.get('multipleJobs') as string;
    const dependents = formData.get('dependents') as string;
    const otherAdjustments = formData.get('otherAdjustments') as string;
    const employerName = formData.get('employerName') as string;
    const employerAddress = formData.get('employerAddress') as string;
    const employerFirstDate = formData.get('employerFirstDate') as string;
    const employerEIN = formData.get('employerEIN') as string;
    const pdfFile = formData.get('pdf') as File | null;

    // Validate required fields
    if (!firstName || !lastName || !socialSecurityNumber || !pdfFile) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields or PDF file' },
        { status: 400 }
      );
    }

    // Read PDF into buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    if (pdfBuffer.length === 0) {
      console.error('❌ Uploaded PDF is empty');
      return NextResponse.json(
        { error: 'Uploaded PDF is empty' },
        { status: 400 }
      );
    }

    // Email options
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New W-4 Form Submission',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #ffffff;">
          <h2 style="text-align: center; color: #333; margin-bottom: 5px;">Form W-4</h2>
          <h3 style="text-align: center; color: #555; margin-top: 0; margin-bottom: 5px;">Employee's Withholding Certificate</h3>
          <hr style="border: none; height: 1px; background-color: #333; margin: 5px auto 2px auto; ">
          <hr style="border: none; height: 1px; background-color: #333; margin: 2px auto 20px auto; ">
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">Personal Information</h4>
          </div>
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Name:</strong> ${firstName} ${middleInitial} ${lastName}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>Social Security Number:</strong> ${socialSecurityNumber}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>Address:</strong> ${address}</p>
          <p style="margin-top: 5px; margin-bottom: 20px;"><strong>City/State/ZIP:</strong> ${cityStateZip}</p>
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">Filing Status</h4>
          </div>
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Filing Status:</strong> ${filingStatus}</p>
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">Multiple Jobs</h4>
          </div>
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Multiple Jobs:</strong> ${multipleJobs}</p>
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">Dependents</h4>
          </div>
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Dependents:</strong> ${dependents}</p>
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">Other Adjustments</h4>
          </div>
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Other Adjustments:</strong> ${otherAdjustments}</p>
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">Employer Information</h4>
          </div>
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Employer Name:</strong> ${employerName}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>Employer Address:</strong> ${employerAddress}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>First Date of Employment:</strong> ${employerFirstDate}</p>
          <p style="margin-top: 5px; margin-bottom: 20px;"><strong>EIN:</strong> ${employerEIN}</p>
          <p style="margin-top: 20px;"><em>PDF is attached below.</em></p>
        </div>
      `,
      attachments: [
        {
          filename: 'W4Form.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
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