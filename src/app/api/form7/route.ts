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
    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #333;">New Employment Application</h2>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Personal Information</h3>
          <p><strong>Name:</strong> ${formData.firstName} ${formData.middleInitial} ${formData.lastName}</p>
          <p><strong>Date:</strong> ${formData.date}</p>
          <p><strong>Address:</strong> ${formData.streetAddress} ${formData.apartmentUnit}</p>
          <p><strong>City:</strong> ${formData.city}, <strong>State:</strong> ${formData.state}, <strong>ZIP:</strong> ${formData.zipCode}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
        </div>

        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Employment Details</h3>
          <p><strong>Position Applied:</strong> ${formData.positionApplied}</p>
          <p><strong>Date Available:</strong> ${formData.dateAvailable}</p>
          <p><strong>Driver's License:</strong> ${formData.driversLicense} (${formData.licenseState})</p>
          <p><strong>Social Security:</strong> ${formData.socialSecurity}</p>
        </div>

        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Education</h3>
          <p><strong>High School:</strong> ${formData.highSchoolAddress}</p>
          <p><strong>College:</strong> ${formData.collegeAddress}</p>
        </div>

        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Signature</h3>
          ${formData.signature ? `<img src="${formData.signature}" alt="Signature" style="max-width: 300px; border: 1px solid #ddd; padding: 10px; background: white;" />` : '<p>No signature provided</p>'}
        </div>
      </div>
    `;

    // Define mailOptions
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Employment Application Submission',
      html: htmlContent
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
