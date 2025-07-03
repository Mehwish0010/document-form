import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'nlis zqmk mnon daak',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

const rowGap = 26;
const gap = 20; // Added gap for layout spacing
const extraYGap = 10;

export async function POST(req: Request) {
  try {
    console.log('Form8 API called');
    const body = await req.json();
    console.log('Received body keys:', Object.keys(body));
    
    const { section1, section2, supplementB } = body;
    
    console.log('Section1 exists:', !!section1);
    console.log('Section2 exists:', !!section2);
    
    // Simple validation
    if (!section1) {
      return NextResponse.json({
        success: false,
        error: 'Missing section1 data'
      }, { status: 400 });
    }

    // --- PDF Generation ---
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 1800]); // Large enough for all fields
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0, 0, 0);
    const blueBg = rgb(0.9, 0.95, 1); // Approx for bg-blue-100
    let y = 1750;
    const padding = 40;
    const labelSize = 9;
    const inputTextSize = 9;
    const inputHeight = 18;
    const inputWidth = 140;
    const drawInput = (label, value, x, y, w = inputWidth, h = inputHeight, placeholder = '') => {
      page.drawText(label, { x, y: y + 4, size: labelSize, font: fontBold, color: black });
      page.drawRectangle({ x: x + 110, y: y, width: w, height: h, color: blueBg, borderWidth: 1, borderColor: black });
      page.drawText(value || placeholder, { x: x + 115, y: y + 4, size: inputTextSize, font, color: black });
    };
    // Helper to wrap long text
    const wrapText = (text, x, y, font, size, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let lines = [];
      for (let word of words) {
        const testLine = line + word + ' ';
        if (font.widthOfTextAtSize(testLine, size) > maxWidth) {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line);
      lines.forEach((l, i) => {
        page.drawText(l.trim(), { x, y: y - i * lineHeight, size, font, color: black });
      });
      return y - lines.length * lineHeight;
    };
    // Heading
    y = wrapText('Employment Eligibility Verification', 180, y, fontBold, 16, 300, 18);
    page.drawText('USCIS', { x: 500, y, size: 12, font: fontBold, color: black });
    y -= 20;
    y = wrapText('Department of Homeland Security', 180, y, fontBold, 13, 300, 16);
    page.drawText('Form I-9', { x: 500, y, size: 12, font: fontBold, color: black });
    y -= 16;
    y = wrapText('U.S. Citizenship and Immigration Services', 180, y, font, 12, 300, 14);
    page.drawText('OMB No. 1615-0047', { x: 500, y, size: 10, font, color: black });
    y -= 14;
    page.drawText('Expires 07/31/2026', { x: 500, y, size: 10, font, color: black });
    y -= 20;
    page.drawLine({ start: { x: padding, y }, end: { x: 570, y }, thickness: 2, color: black });
    y -= 10;
    y = wrapText('START HERE: Employers must ensure the form instructions are available to employees when completing this form...', padding, y, fontBold, 10, 500, 12);
    y = wrapText('ANTI-DISCRIMINATION NOTICE: All employees can choose which acceptable documentation...', padding, y - 10, font, 9, 500, 11);
    y -= 40; // Extra space before first input row
    
    const labelOffset = 4;
    const textInsideOffset = 3;
    const colGap = 14;
    
    // Draw a box around the entire content area to frame the page
    page.drawRectangle({
      x: padding - 10,
      y: 30,
      width: 570 - (padding - 10),
      height: y - 30 + (padding - 10),
      borderWidth: 2,
      borderColor: black,
      color: undefined // transparent
    });
    
    // --- Job Application Fields at the top ---
    // Black background heading
    page.drawRectangle({ x: padding, y: y - 30, width: 530, height: 30, color: black });
    page.drawText("Job Application Information", { x: padding + 10, y: y - 12, size: 14, font: fontBold, color: rgb(1,1,1) });
    y -= 40;
    // Inputs in a grouped block
    page.drawText("Full Name:", { x: padding, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 90, y: y - 4, width: 180, height: 18, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(body.jobAppFullName || '', { x: padding + 95, y: y, size: inputTextSize, font, color: black });
    y -= 22;
    page.drawText("Job Role:", { x: padding, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 90, y: y - 4, width: 180, height: 18, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(body.jobRole || '', { x: padding + 95, y: y, size: inputTextSize, font, color: black });
    y -= 22;
    page.drawText("Location:", { x: padding, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 90, y: y - 4, width: 180, height: 18, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(body.location || '', { x: padding + 95, y: y, size: inputTextSize, font, color: black });
    y -= 30;
    // Add extra spacing below application information
    y -= 20;
    
    // Row 1
    const col1Width = 100, col2Width = 100, col3Width = 80, col4Width = 100;
    let x1 = padding;
    let x2 = x1 + col1Width + colGap;
    let x3 = x2 + col2Width + colGap;
    let x4 = x3 + col3Width + colGap;
    
    page.drawText('Last Name (Family Name):', { x: x1, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('First Name (Given Name):', { x: x2, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('Middle Initial:', { x: x3, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('Other Last Names Used (if any):', { x: x4, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    
    page.drawRectangle({ x: x1, y, width: col1Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: x2, y, width: col2Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: x3, y, width: col3Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: x4, y, width: col4Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    
    if (section1.lastName) page.drawText(section1.lastName, { x: x1 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.firstName) page.drawText(section1.firstName, { x: x2 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.middleInitial) page.drawText(section1.middleInitial, { x: x3 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.otherLastNames) page.drawText(section1.otherLastNames, { x: x4 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    
    y -= rowGap + extraYGap;
    
    // Row 2 (Address, Apt, City, State, ZIP)
    const colAWidth = 180, colBWidth = 50, colCWidth = 110, colDWidth = 50, colEWidth = 70;
    let xa = padding;
    let xb = xa + colAWidth + colGap;
    let xc = xb + colBWidth + colGap;
    let xd = xc + colCWidth + colGap;
    let xe = xd + colDWidth + colGap;
    
    page.drawText('Address (Street Number and Name):', { x: xa, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('Apt. Number (if any):', { x: xb, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('City or Town:', { x: xc, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('State:', { x: xd, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('ZIP Code:', { x: xe, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    
    page.drawRectangle({ x: xa, y, width: colAWidth, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: xb, y, width: colBWidth, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: xc, y, width: colCWidth, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: xd, y, width: colDWidth, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: xe, y, width: colEWidth, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    
    if (section1.address) page.drawText(section1.address, { x: xa + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.aptNumber) page.drawText(section1.aptNumber, { x: xb + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.city) page.drawText(section1.city, { x: xc + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.state) page.drawText(section1.state, { x: xd + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.zipCode) page.drawText(section1.zipCode, { x: xe + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    
    y -= rowGap + extraYGap;
    
    // Row 3 (DOB, SSN, Email, Telephone)
    const c1Width = 110, c2Width = 110, c3Width = 140, c4Width = 110;
    let cx1 = padding;
    let cx2 = cx1 + c1Width + colGap;
    let cx3 = cx2 + c2Width + colGap;
    let cx4 = cx3 + c3Width + colGap;
    
    page.drawText('Date of Birth (mm/dd/yyyy):', { x: cx1, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText('U.S. Social Security Number:', { x: cx2, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText("Employee's Email Address:", { x: cx3, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    page.drawText("Employee's Telephone Number:", { x: cx4, y: y + inputHeight + labelOffset, size: labelSize, font: fontBold, color: black });
    
    page.drawRectangle({ x: cx1, y, width: c1Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: cx2, y, width: c2Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: cx3, y, width: c3Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: cx4, y, width: c4Width, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    
    if (section1.dateOfBirth) page.drawText(section1.dateOfBirth, { x: cx1 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.ssn) page.drawText(section1.ssn, { x: cx2 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.email) page.drawText(section1.email, { x: cx3 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    if (section1.telephone) page.drawText(section1.telephone, { x: cx4 + 4, y: y + textInsideOffset, size: inputTextSize, font, color: black });
    
    y -= rowGap + extraYGap;
    
    // Attestation Box
    const attestationBoxHeight = 80;
    const attestationBoxY = y - attestationBoxHeight;
    
    page.drawRectangle({
      x: padding,
      y: attestationBoxY,
      width: 180,
      height: attestationBoxHeight,
      color: rgb(0.95, 0.95, 0.98),
      borderWidth: 1,
      borderColor: black,
    });
    
    page.drawText(
      'I am aware that federal law provides for imprisonment and/or fines for false statements, or the use of false documents, in connection with the completion of this form. I attest, under penalty of perjury, that this information, including my selection of the box attesting to my citizenship or immigration status, is true and',
      {
        x: padding + 4,
        y: attestationBoxY + attestationBoxHeight - 36,
        size: 8,
        font,
        color: black,
        maxWidth: 170,
        lineHeight: 10,
      }
    );
    
    y = attestationBoxY - gap; // move below the attestation box
    
    // Checkbox Box
    const checkboxBoxHeight = 100;
    const checkboxBoxY = y - checkboxBoxHeight;
    
    page.drawRectangle({
      x: padding + 190,
      y: checkboxBoxY,
      width: 340,
      height: checkboxBoxHeight,
      color: rgb(1, 1, 1),
      borderWidth: 1,
      borderColor: black,
    });
    
    // Text inside checkbox box
    page.drawText(
      'Check one of the following boxes to attest to your citizenship or immigration status',
      { x: padding + 195, y: checkboxBoxY + 74, size: 9, font, color: black }
    );
    
    page.drawText('(See page 2 and 3 of the instructions.)', {
      x: padding + 195,
      y: checkboxBoxY + 62,
      size: 8,
      font,
      color: black,
    });
    
    // Checkboxes and text
    const boxOptions = [
      '1. A citizen of the United States',
      '2. A noncitizen national of the United States',
      '3. A lawful permanent resident (Enter USCIS or A-Number)',
      '4. An alien authorized to work (other than Numbers 2 and 3 above) until (exp. date, if any)',
    ];
    
    boxOptions.forEach((text, i) => {
      const boxY = checkboxBoxY + 44 - i * 14;
      page.drawRectangle({ x: padding + 200, y: boxY, width: 10, height: 10, borderColor: black, borderWidth: 1 });
      page.drawText(text, { x: padding + 215, y: boxY + 2, size: 8, font, color: black });
    });
    
    y = checkboxBoxY - 50;
    
    // Additional Fields for Option 4
    page.drawRectangle({ x: padding, y: y, width: 170, height: 30, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('USCIS A-Number', { x: padding + 4, y: y + 18, size: 8, font, color: black });
    
    page.drawRectangle({ x: padding + 180, y: y, width: 170, height: 30, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('Form I-94 Admission Number', { x: padding + 184, y: y + 18, size: 8, font, color: black });
    
    page.drawRectangle({ x: padding + 360, y: y, width: 170, height: 30, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('Foreign Passport Number and Country of Issuance', { x: padding + 364, y: y + 18, size: 8, font, color: black });
    
    y -= 50;
    
    // Table for Document Lists
    page.drawRectangle({ x: padding, y: y, width: 530, height: 60, color: rgb(1, 1, 1), borderWidth: 1, borderColor: black });
    page.drawText('LIST A', { x: padding + 10, y: y + 44, size: 10, font: fontBold, color: black });
    page.drawText('LIST B', { x: padding + 190, y: y + 44, size: 10, font: fontBold, color: black });
    page.drawText('LIST C', { x: padding + 370, y: y + 44, size: 10, font: fontBold, color: black });
    page.drawText('Document Title 1', { x: padding + 10, y: y + 24, size: 9, font, color: black });
    
    y -= 80;
    
    // Acceptable Receipts section
    page.drawText('ACCEPTABLE RECEIPTS', { x: 200, y, size: 13, font: fontBold, color: black });
    page.drawText(
      'May be presented in lieu of a document listed above for a temporary period.',
      { x: 120, y: y - 16, size: 9, font, color: black }
    );
    
    y -= 50;
    
    // Submit Button
    page.drawRectangle({ x: 200, y: y, width: 180, height: 30, color: rgb(0, 0, 0), borderWidth: 1, borderColor: black });
    page.drawText('Submit Form', {
      x: 260,
      y: y + 8,
      size: 11,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    
    // End of layout
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully');

    // Simple email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Form I-9 Test Submission',
      text: 'Test form submission with PDF attachment.',
      attachments: [
        {
          filename: 'form_i_9.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };

    console.log('Attempting to send email...');
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json({ success: false, error: 'Email sending failed' }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully and email sent.'
    });
  } catch (error) {
    console.error('Form8 server error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 