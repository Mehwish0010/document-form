import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

    const ssn = [body.ssn1, body.ssn2, body.ssn3, body.ssn4, body.ssn5, body.ssn6, body.ssn7, body.ssn8, body.ssn9].join('');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 1191]); // A4 size landscape
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text: string, x: number, y: number, size: number, isBold: boolean = false) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    // Title
    drawText("RESIDENCY CERTIFICATION FORM", 250, 1140, 20, true);
    drawText("Local Earned Income Tax Withholding", 280, 1120, 16, true);

    // EMPLOYEE INFORMATION
    drawText("EMPLOYEE INFORMATION – RESIDENCE LOCATION", 200, 1080, 16, true);
    drawText(`Name: ${body.name}`, 50, 1050, 12);
    drawText(`Social Security Number: ${ssn}`, 450, 1050, 12);
    drawText(`Street Address: ${body.streetAddress}`, 50, 1030, 12);
    drawText(`Address Line 2: ${body.address2}`, 50, 1010, 12);
    drawText(`City: ${body.city}`, 50, 990, 12);
    drawText(`State: ${body.state}`, 250, 990, 12);
    drawText(`Zip Code: ${body.zip}`, 450, 990, 12);
    drawText(`Daytime Phone Number: ${body.phone}`, 50, 970, 12);
    drawText(`MUNICIPALITY: ${body.municipality}`, 50, 950, 12);
    drawText(`COUNTY: ${body.county}`, 50, 930, 12);
    drawText(`RESIDENT PSD CODE: ${body.residentPsd}`, 450, 930, 12);
    drawText(`TOTAL RESIDENT EIT RATE: ${body.residentRate}`, 450, 910, 12);

    // EMPLOYER INFORMATION
    drawText("EMPLOYER INFORMATION – EMPLOYMENT LOCATION", 200, 870, 16, true);
    drawText(`Employer Business Name: ${body.employerName}`, 50, 840, 12);
    drawText(`Employer FEIN: ${body.ein}`, 450, 840, 12);
    drawText(`Employer Street Address: ${body.employerStreet}`, 50, 820, 12);
    drawText(`Address Line 2: ${body.employerAddress2}`, 50, 800, 12);
    drawText(`City: ${body.employerCity}`, 50, 780, 12);
    drawText(`State: ${body.employerState}`, 250, 780, 12);
    drawText(`Zip Code: ${body.employerZip}`, 450, 780, 12);
    drawText(`Daytime Phone Number: ${body.employerPhone}`, 50, 760, 12);
    drawText(`MUNICIPALITY: ${body.employerMunicipality}`, 50, 740, 12);
    drawText(`COUNTY: ${body.employerCounty}`, 50, 720, 12);
    drawText(`WORK LOCATION PSD CODE: ${body.workPsd}`, 450, 720, 12);
    drawText(`WORK LOCATION NON-RESIDENT EIT RATE: ${body.nonResRate}`, 450, 700, 12);
    
    // CERTIFICATION
    drawText("CERTIFICATION", 350, 660, 16, true);
    drawText(`Date: ${body.date}`, 50, 630, 12);
    drawText(`Phone Number: ${body.employeePhone}`, 50, 610, 12);
    drawText(`Email Address: ${body.email}`, 50, 590, 12);
    
    if (body.employeeSignature) {
        try {
            const signatureImage = await pdfDoc.embedPng(body.employeeSignature.split(',')[1]);
            page.drawImage(signatureImage, {
                x: 50,
                y: 500,
                width: 200,
                height: 50,
            });
        } catch (error) {
            console.error('Error embedding signature:', error);
        }
    }

    const pdfBytes = await pdfDoc.save();

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
      html: htmlContent,
      attachments: [
        {
          filename: 'residency_certification_form.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully and email notification sent'
      });
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { success: false, error: 'Failed to send email notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
