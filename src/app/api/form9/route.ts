import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts, RGB } from 'pdf-lib';

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
   receiver:'vincentiaadams@batp.org'
}

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
      employerName, ein1, ein2, ein3, ein4, ein5, ein6, ein7, ein8, ein9,
      employerStreet, employerAddress2,
      employerCity, employerState, employerZip, employerPhone,
      employerMunicipality, employerCounty, workPsd, nonResRate,
      employeeSignature, date, employeePhone, email,
      jobAppFullName, jobRole, location
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

    const ssn = [ssn1, ssn2, ssn3, ssn4, ssn5, ssn6, ssn7, ssn8, ssn9].join('');
    const ein = [ein1, ein2, ein3, ein4, ein5, ein6, ein7, ein8, ein9].join('');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 2000]); // Further increased height for more space
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text: string, x: number, y: number, size: number, isBold: boolean = false, color: RGB = rgb(0, 0, 0)) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: color,
      });
    };

    // --- Job Application Fields at the top (exact same as form9.tsx) ---
    let y = 1950; // Define y before using it
    const boxTopY = y; // Save the top Y position for the box
    // Main heading at the very top (no black background)
    drawText("RESIDENCY CERTIFICATION FORM", 250, y, 20, true);
    y -= 30;
    drawText("Local Earned Income Tax Withholding", 280, y, 14, true);
    y -= 40;
    // Job Application Information section heading with black background
    page.drawRectangle({ x: 40, y: y, width: 760, height: 30, color: rgb(0,0,0) });
    drawText("Job Application Information", 50, y + 18, 14, true, rgb(1,1,1));
    y -= 40;

    // Application Information fields (vertical layout)
    drawText("Full Name:", 50, y + 10, 12, true);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.jobAppFullName || '', 135, y, 12);
    y -= 17;
    drawText("Job Role:", 50, y + 10, 12, true);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.jobRole || '', 135, y, 12);
    y -= 17;
    drawText("Location:", 50, y + 10, 12, true);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.location || '', 135, y, 12);
    y -= 40; // Extra space below application info

    // Employee Information section
    page.drawRectangle({ x: 40, y: y, width: 760, height: 25, color: rgb(0,0,0) });
    drawText("EMPLOYEE INFORMATION – RESIDENCE LOCATION", 50, y + 8, 14, true, rgb(1,1,1));
    y -= 60; // Increased spacing
    drawText("Name:", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.name || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    drawText("Social Security Number:", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    // Draw 9 small boxes for SSN digits
    for (let i = 0; i < 9; i++) {
      page.drawRectangle({ x: 50 + i * 22, y: y - 15, width: 20, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
      drawText((body[`ssn${i+1}`] || ''), 55 + i * 22, y - 10, 11);
    }
    y -= 50; // Increased spacing

    drawText("Street Address (No PO Box, RD or RR):", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.streetAddress || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    drawText("Address Line 2:", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.address2 || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    // City, State, Zip, Phone row (exact same as form9.tsx)
    let xPos = 50;
    const cityWidth = 200;
    const stateWidth = 100;
    const zipWidth = 120;
    const phoneWidth = 200;
    
    drawText("City:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: cityWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.city || '', xPos + 5, y - 10, 11);
    xPos += cityWidth + 10;
    
    drawText("State:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: stateWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.state || '', xPos + 5, y - 10, 11);
    xPos += stateWidth + 10;
    
    drawText("Zip Code:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: zipWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.zip || '', xPos + 5, y - 10, 11);
    xPos += zipWidth + 10;
    
    drawText("Daytime Phone Number:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: phoneWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.phone || '', xPos + 5, y - 10, 11);
    y -= 50; // Increased spacing

    drawText("MUNICIPALITY (City, Borough or Township):", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.municipality || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    // County and PSD/Rate row (exact same as form9.tsx)
    drawText("COUNTY:", 50, y + 8, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 300, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.county || '', 55, y - 10, 11);
    
    drawText("RESIDENT PSD CODE:", 370, y + 8, 10, true);
    page.drawRectangle({ x: 370, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.residentPsd || '', 375, y - 10, 11);
    
    drawText("TOTAL RESIDENT EIT RATE:", 570, y + 8, 10, true);
    page.drawRectangle({ x: 570, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.residentRate || '', 575, y - 10, 11);
    y -= 65; // Increased spacing

    // EMPLOYER INFORMATION – EMPLOYMENT LOCATION (heading)
    y -= 20;
    page.drawRectangle({ x: 40, y: y, width: 760, height: 25, color: rgb(0,0,0) });
    drawText("EMPLOYER INFORMATION – EMPLOYMENT LOCATION", 50, y + 8, 14, true, rgb(1,1,1));
    y -= 60; // Increased spacing
    // Employer Name and FEIN row (exact same as form9.tsx)
    drawText("Employer Business Name (Use Federal ID Name):", 50, y + 8, 10, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerName || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    drawText("Employer Identification Number (EIN):", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.ein || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    
    // Employer Street Address (exact same as form9.tsx)
    drawText("Employer Street Address (No PO Box, RD or RR):", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerStreet || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    // Employer Address Line 2 (exact same as form9.tsx)
    drawText("Address Line 2:", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerAddress2 || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    // Employer City, State, Zip, Phone row (exact same as form9.tsx)
    xPos = 50;
    
    drawText("City:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: cityWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerCity || '', xPos + 5, y - 10, 11);
    xPos += cityWidth + 10;
    
    drawText("State:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: stateWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerState || '', xPos + 5, y - 10, 11);
    xPos += stateWidth + 10;
    
    drawText("Zip Code:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: zipWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerZip || '', xPos + 5, y - 10, 11);
    xPos += zipWidth + 10;
    
    drawText("Daytime Phone Number:", xPos, y + 8, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: phoneWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerPhone || '', xPos + 5, y - 10, 11);
    y -= 50; // Increased spacing

    // Employer Municipality (exact same as form9.tsx)
    drawText("MUNICIPALITY (City, Borough or Township):", 50, y + 10, 12, true);
    y -= 25; // Increased spacing
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerMunicipality || '', 55, y - 10, 11);
    y -= 50; // Increased spacing

    // Employer County and Work PSD/Rate row (exact same as form9.tsx)
    drawText("COUNTY:", 50, y + 8, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 300, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerCounty || '', 55, y - 10, 11);
    
    drawText("WORK LOCATION PSD CODE:", 370, y + 8, 10, true);
    page.drawRectangle({ x: 370, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.workPsd || '', 375, y - 10, 11);
    
    drawText("WORK LOCATION NON-RESIDENT EIT RATE:", 570, y + 8, 10, true);
    page.drawRectangle({ x: 570, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.nonResRate || '', 575, y - 10, 11);
    y -= 65; // Increased spacing

    // CERTIFICATION (exact same as form9.tsx)
    // Black background header
    page.drawRectangle({ x: 40, y: y, width: 760, height: 25, color: rgb(0,0,0) });
    drawText("CERTIFICATION", 50, y + 8, 14, true, rgb(1,1,1));
    y -= 60; // Increased spacing

    drawText("Under penalties of perjury, I (we) declare that I (we) have examined this information...", 60, y, 10);
    y -= 50; // Increased spacing

    // Signature and Date row (exact same as form9.tsx)
    drawText("Signature of Employee:", 50, y + 5, 12, true);
    // Make signature rectangle much taller
    page.drawRectangle({ x: 50, y: y - 40, width: 350, height: 80, color: rgb(1,1,1), borderWidth: 2, borderColor: rgb(0,0,0) });
    if (body.employeeSignature) {
        try {
            console.log('employeeSignature:', body.employeeSignature?.substring(0, 100));
            let signatureImage;
            if (body.employeeSignature.startsWith('data:image/png')) {
                signatureImage = await pdfDoc.embedPng(Buffer.from(body.employeeSignature.split(',')[1], 'base64'));
            } else if (body.employeeSignature.startsWith('data:image/jpeg') || body.employeeSignature.startsWith('data:image/jpg')) {
                signatureImage = await pdfDoc.embedJpg(Buffer.from(body.employeeSignature.split(',')[1], 'base64'));
            } else {
                throw new Error('Unsupported signature image format');
            }
            // Scale up signature image and center vertically in the box
            page.drawImage(signatureImage, {
                x: 60,
                y: y - 35,
                width: 250,
                height: 30,
            });
        } catch (error) {
            console.error('Error embedding signature:', error);
        }
    }
    // More space after signature
    y -= 60;
   // Draw label first
drawText("Date (MM/DD/YYYY):", 470, y + 35, 12, true);  // higher up

// Draw rectangle below the label
page.drawRectangle({
  x: 470,
  y: y + 5,
  width: 200,
  height: 30,
  color: rgb(1,1,1),
  borderWidth: 1,
  borderColor: rgb(0,0,0)
});

// Draw field value inside the box
drawText(body.date || '', 475, y + 15, 12);

// Move down after section
y -= 60;

    // Phone and Email row (exact same as form9.tsx)
    drawText("Phone Number:", 50, y + 10, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 300, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employeePhone || '', 55, y - 10, 11);
    
   // LABEL
drawText("Email Address:", 370, y + 20, 10, true);

// RECTANGLE FIELD
page.drawRectangle({ 
  x: 370, 
  y: y - 10, 
  width: 400, 
  height: 25, 
  color: rgb(1,1,1), 
  borderWidth: 1, 
  borderColor: rgb(0,0,0) 
});

// VALUE INSIDE FIELD
drawText(body.email || '', 375, y - 4, 11);

// Spacing after field
y -= 50;

   
    // Save the y position before drawing the footer
    // Remove boxBottom if never used

// Footer information (exact same as form9.tsx) - now inside the box
y -= 25; // Add spacing before footer
drawText("For information on obtaining the appropriate MUNICIPALITY, PSD CODES, and EIT RATES visit:", 50, y, 10);
y -= 20;
drawText("dced.pa.gov/Act32", 50, y, 10, true);
y -= 30; // Add spacing after footer

// Draw a box around the entire content area including footer
page.drawRectangle({
  x: 30,
  y: y - 20, // a bit below the last footer line
  width: 780,
  height: (boxTopY - (y - 20)), // Dynamic height from top of content to bottom of box
  borderWidth: 2,
  borderColor: rgb(0, 0, 0),
  color: undefined, // transparent
});


    const pdfBytes = await pdfDoc.save();

    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #333;">Residency Certification Form Submission</h2>
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #444;">Job Application Information</h3>
          <p><strong>Full Name:</strong> ${jobAppFullName}</p>
          <p><strong>Job Role:</strong> ${jobRole}</p>
          <p><strong>Location:</strong> ${location}</p>
        </div>
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
      subject: 'Employment Form 06 (Residence Certification Form)',
      html: htmlContent,
      attachments: [
        {
          filename: 'Employment Form 06 (Residence Certification Form)',
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
