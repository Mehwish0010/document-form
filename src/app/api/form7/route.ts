import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";

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
    const formData = await req.json();
    console.log('Received form data:', formData);

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });

    const page = await browser.newPage();

    await page.goto('http://localhost:3000/form7', {
      waitUntil: 'networkidle0'
    });

    // Fill inputs inside the page with formData values
    await page.evaluate((data) => {
      // For each input name, assign the corresponding value
      (document.querySelector('input[name="fullName"]') as HTMLInputElement).value = data.fullName || '';
      (document.querySelector('input[name="email"]') as HTMLInputElement).value = data.email || '';
      (document.querySelector('input[name="dob"]') as HTMLInputElement).value = data.dob || '';
      (document.querySelector('input[name="address"]') as HTMLInputElement).value = data.address || '';
      (document.querySelector('textarea[name="arrestDetails"]') as HTMLTextAreaElement).value = data.arrestDetails || '';
    }, formData);

    // Wait a moment to ensure the DOM updates after input fill
  

    // Generate the PDF after filling inputs
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();
    // ✅ Define mailOptions before sending the email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Employment Application Submission',
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Employment Application</h2>
          <p>This is an auto-generated email with the submitted form attached as a PDF.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'employment_application.pdf',
          content: Buffer.from(pdfBuffer) // ✅ Make sure to wrap with Buffer
        }
      ]
    };

    // Send email
    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);

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
