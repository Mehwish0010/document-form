import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'nlis zqmk mnon daak ',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

// Verify transporter configuration
transporter.verify(function(error) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export async function POST(request: Request) {
  try {
    // Get the raw body as text
    const rawBody = await request.text();
    console.log('Received raw body:', rawBody);

    // Check if the body is empty
    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    // Try to parse the JSON
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate the parsed data
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate required sections
    if (!data.section1 || !data.section2) {
      return NextResponse.json(
        { error: 'Missing required form sections' },
        { status: 400 }
      );
    }

    // Log email configuration (without sensitive data)
    console.log('Attempting to send email to:', emailConfig.receiver);

    // Send email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Form I-9 Submission',
      html: `
        <h2>New Form I-9 Submission</h2>
        <h3>Section 1 - Employee Information</h3>
        <p><strong>Name:</strong> ${data.section1.firstName} ${data.section1.middleInitial} ${data.section1.lastName}</p>
        <p><strong>Address:</strong> ${data.section1.address}, ${data.section1.aptNumber}</p>
        <p><strong>City:</strong> ${data.section1.city}, ${data.section1.state} ${data.section1.zipCode}</p>
        <p><strong>Date of Birth:</strong> ${data.section1.dateOfBirth}</p>
        <p><strong>SSN:</strong> ${data.section1.ssn}</p>
        <p><strong>Email:</strong> ${data.section1.email}</p>
        <p><strong>Telephone:</strong> ${data.section1.telephone}</p>
        <p><strong>Employee Signature:</strong></p>
        <img src="${data.section1.employeeSignature}" alt="Employee Signature" style="max-width: 300px; border: 1px solid #ccc; padding: 10px; margin: 10px 0;" />
        <p><strong>Employee Date:</strong> ${data.section1.employeeDate}</p>

        <h3>Section 2 - Employer Review</h3>
        <p><strong>Document 1:</strong> ${data.section2.document1?.title || 'N/A'}</p>
        <p><strong>Document 2:</strong> ${data.section2.document2?.title || 'N/A'}</p>
        <p><strong>Document 3:</strong> ${data.section2.document3?.title || 'N/A'}</p>
        <p><strong>Employer Name:</strong> ${data.section2.employerName}</p>
        <p><strong>Employer Business:</strong> ${data.section2.employerBusiness}</p>
        <p><strong>Employer Address:</strong> ${data.section2.employerAddress}</p>
        <p><strong>Employer Signature:</strong></p>
        <img src="${data.section2.employerSignature}" alt="Employer Signature" style="max-width: 300px; border: 1px solid #ccc; padding: 10px; margin: 10px 0;" />
        <p><strong>Certification Date:</strong> ${data.section2.certificationDate}</p>

        ${data.supplementB ? `
        <h3>Supplement B - Reverification</h3>
        <p><strong>Name:</strong> ${data.supplementB.firstName} ${data.supplementB.middleInitial} ${data.supplementB.lastName}</p>
        <p><strong>Rehire Date:</strong> ${data.supplementB.rehireDate}</p>
        <p><strong>Document Title:</strong> ${data.supplementB.documentTitle}</p>
        <p><strong>Document Number:</strong> ${data.supplementB.documentNumber}</p>
        <p><strong>Expiration Date:</strong> ${data.supplementB.expirationDate}</p>
        <p><strong>Employer Name:</strong> ${data.supplementB.employerName}</p>
        <p><strong>Today's Date:</strong> ${data.supplementB.todayDate}</p>
        <p><strong>Employer Signature:</strong></p>
        <img src="${data.supplementB.employerSignature}" alt="Supplement B Employer Signature" style="max-width: 300px; border: 1px solid #ccc; padding: 10px; margin: 10px 0;" />
        <p><strong>Final Signature:</strong></p>
        <img src="${data.supplementB.finalSignature}" alt="Final Signature" style="max-width: 300px; border: 1px solid #ccc; padding: 10px; margin: 10px 0;" />
        ` : ''}
      `,
      attachments: [
        {
          filename: 'employee_signature.png',
          content: data.section1.employeeSignature.split('base64,')[1],
          encoding: 'base64'
        },
        {
          filename: 'employer_signature.png',
          content: data.section2.employerSignature.split('base64,')[1],
          encoding: 'base64'
        },
        ...(data.supplementB && data.supplementB.employerSignature ? [{
          filename: 'supplement_employer_signature.png',
          content: data.supplementB.employerSignature.split('base64,')[1],
          encoding: 'base64'
        }] : []),
        ...(data.supplementB && data.supplementB.finalSignature ? [{
          filename: 'final_signature.png',
          content: data.supplementB.finalSignature.split('base64,')[1],
          encoding: 'base64'
        }] : [])
      ]
    };

    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully and email notification sent',
      data
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 