import { NextResponse } from 'next/server';
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
  }
});

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

    // Validate required fields
    const requiredFields = ['name', 'signature', 'date', 'print'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Log email configuration (without sensitive data)
    console.log('Attempting to send email to:', emailConfig.receiver);

    // Send email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Confidentiality Agreement Submission',
      html: `
        <h2>New Confidentiality Agreement Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Signature:</strong> ${data.signature}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Print Name:</strong> ${data.print}</p>
      `
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
