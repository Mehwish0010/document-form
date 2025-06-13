import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const dob = formData.get('dob') as string;
    const address = formData.get('address') as string;
    const arrestDetails = formData.get('arrestDetails') as string;
    const pdfFile = formData.get('pdf') as File;

    // Validate required fields
    if (!fullName || !email || !dob || !address || !arrestDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate PDF
    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
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
          <p><strong>Full Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date of Birth:</strong> ${dob}</p>
          <p><strong>Address:</strong> ${address}</p>
        </div>

        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Arrest Details</h3>
          <p>${arrestDetails}</p>
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
