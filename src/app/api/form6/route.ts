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
transporter.verify((error, success) => {
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
    const name = formData.get('name') as string;
    const signature = formData.get('signature') as string;
    const date = formData.get('date') as string;
    const print = formData.get('print') as string;
    const pdfFile = formData.get('pdf') as File | null;

    console.log('📋 Extracted fields:', { name, date, print });

    // Validate fields
    if (!name || !signature || !date || !print || !pdfFile) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields or PDF file' },
        { status: 400 }
      );
    }

    // Read PDF into buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    console.log('📄 PDF buffer size:', pdfBuffer.length, 'bytes');
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
      subject: 'New Caregiver Disclosure Form Submission',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #ffffff;">
          <h2 style="text-align: center; color: #333; margin-bottom: 5px;">RESIDENCY CERTIFICATION FORM</h2>
          <h3 style="text-align: center; color: #555; margin-top: 0; margin-bottom: 5px;">Local Earned Income Tax Withholding</h3>
          
          <hr style="border: none; height: 1px; background-color: #333; margin: 5px auto 2px auto; width: 80%;">
          <hr style="border: none; height: 1px; background-color: #333; margin: 2px auto 20px auto; width: 80%;">
          
          <p style="font-size: 12px; color: #666; margin-top: 20px; margin-bottom: 20px;">
            <strong>TO EMPLOYERS/TAXPAYERS:</strong> This form is to be used by employers and taxpayers to report essential information for the collection and distribution of Local Earned Income Taxes
            to the local EIT collector. This form must be used by employers when a new employee is hired or when a current employee notifies employer
            of a name or address change. Use the Address Search Application at dced.pa.gov/Act32 to determine PSD codes, EIT rates,
            and tax collector contact information.
          </p>
          
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">EMPLOYEE INFORMATION – RESIDENCE LOCATION</h4>
          </div>
          
          <p style="margin-top: 0; margin-bottom: 5px;"><strong>Name (Last Name, First Name, Middle Initial):</strong> ${name}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>Date:</strong> ${date}</p>
          <p style="margin-top: 5px; margin-bottom: 5px;"><strong>Print Name:</strong> ${print}</p>
          <p style="margin-top: 5px; margin-bottom: 20px;"><strong>Signature:</strong> ${signature}</p>
          
          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">EMPLOYER INFORMATION – EMPLOYMENT LOCATION</h4>
          </div>
          
          <!-- Add placeholders for employer info if needed -->

          <div style="background-color: #f4f4f4; padding: 10px; margin-top: 20px; margin-bottom: 10px;">
            <h4 style="margin: 0; color: #333;">CERTIFICATION</h4>
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 20px; margin-bottom: 20px;">Under penalties of perjury, I (we) declare that I (we) have examined this information, including all accompanying
          schedules and statements and to the best of my (our) belief, they are true, correct and complete.</p>

          <p style="margin-top: 20px;"><em>PDF is attached below.</em></p>
        </div>
      `,
      attachments: [
        {
          filename: 'CaregiverDisclosureForm.pdf',
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

