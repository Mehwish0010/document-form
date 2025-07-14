import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver: 'mailbatp@gmail.com'
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
    console.log('Form8 API called');
    const body = await req.json();
    console.log('Received body keys:', Object.keys(body));
    
    const { section1 = {}, section2 = {} } = body;
    
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
    const page = pdfDoc.addPage([1200, 2100]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0, 0, 0);
    const blueBg = rgb(0.9, 0.95, 1);
    const grayBg = rgb(0.93, 0.93, 0.93);
    let y = 2000;
    const padding = 40;
    const inputHeight = 28;
    const inputTextSize = 13;
    const labelSize = 12;
    const colGap = 10;

    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logouss.png');
      const logoBuffer = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBuffer);
      const logoDims = logoImage.scale(0.42); // Increased scale for larger logo
      page.drawImage(logoImage, { x: padding, y: y - logoDims.height + 10, width: logoDims.width, height: logoDims.height });
    } catch {
      console.error('Logo embedding failed:');
    }

    // Heading
    page.drawText('Employment Eligibility Verification', { x: 400, y, size: 18, font: fontBold, color: black });
    page.drawText('USCIS', { x: 1080, y, size: 12, font: fontBold, color: black });
    y -= 22;
    page.drawText('Department of Homeland Security', { x: 400, y, size: 13, font: fontBold, color: black });
    page.drawText('Form I-9', { x: 1080, y, size: 12, font: fontBold, color: black });
    y -= 18;
    page.drawText('U.S. Citizenship and Immigration Services', { x: 400, y, size: 11, font, color: black });
    page.drawText('OMB No. 1615-0047', { x: 1080, y, size: 10, font, color: black });
    y -= 14;
    page.drawText('Expires 07/31/2026', { x: 1080, y, size: 10, font, color: black });
    y -= 18;
    page.drawLine({ start: { x: padding, y }, end: { x: 1160, y }, thickness: 2, color: black });
    y -= 10;
    page.drawText('START HERE: Employers must ensure the form instructions are available to employees when completing this form...', { x: padding, y, size: 11, font: fontBold, color: black });
    y -= 16;
    page.drawText('ANTI-DISCRIMINATION NOTICE: All employees can choose which acceptable documentation...', { x: padding, y, size: 10, font, color: black });
    y -= 18;
    // Add extra space before job application info boxes
    y -= 30;

    // Black bar for Job Application Information
    page.drawRectangle({ x: padding, y: y - 30, width: 1120, height: 30, color: black });
    page.drawText('Job Application Information', { x: padding + 10, y: y - 12, size: 15, font: fontBold, color: rgb(1,1,1) });
    y -= 40;

    // Job info row
    page.drawText('Full Name:', { x: padding, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 80, y: y - 4, width: 250, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(body.jobAppFullName || '', { x: padding + 85, y: y + 6, size: inputTextSize, font, color: black });
    page.drawText('Job Role:', { x: padding + 370, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 440, y: y - 4, width: 250, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(body.jobRole || '', { x: padding + 445, y: y + 6, size: inputTextSize, font, color: black });
    page.drawText('Location:', { x: padding + 730, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 800, y: y - 4, width: 250, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(body.location || '', { x: padding + 805, y: y + 6, size: inputTextSize, font, color: black });
    y -= inputHeight + 18;

    // Section 1 header
    page.drawRectangle({ x: padding, y: y - 30, width: 1120, height: 30, color: grayBg });
    page.drawText('Section 1. Employee Information and Attestation:', { x: padding + 10, y: y - 12, size: 13, font: fontBold, color: black });
    page.drawText('Employees must complete and sign Section 1 of Form I-9 no later than the first day of employment, but not before accepting a job offer.', { x: padding + 10, y: y - 24, size: 10, font, color: black });
    y -= 60; // Increased gap after section header and description

    // --- Section 1 Input Grid ---
    // Row 1: Name fields
    const col1 = padding, col2 = col1 + 220 + colGap, col3 = col2 + 220 + colGap, col4 = col3 + 120 + colGap;
    const labelToBoxGap = 32;
    const rowGap = 54;
    let rowY = y;
    // Row 1 labels
    page.drawText('Last Name (Family Name)', { x: col1, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('First Name (Given Name)', { x: col2, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('Middle Initial', { x: col3, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('Other Last Names Used (if any)', { x: col4, y: rowY, size: labelSize, font: fontBold, color: black });
    // Row 1 boxes
    const row1BoxY = rowY - labelToBoxGap;
    page.drawRectangle({ x: col1, y: row1BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: col2, y: row1BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: col3, y: row1BoxY, width: 120, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: col4, y: row1BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    // Row 1 values
    page.drawText(section1.lastName || '', { x: col1 + 4, y: row1BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.firstName || '', { x: col2 + 4, y: row1BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.middleInitial || '', { x: col3 + 4, y: row1BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.otherLastNames || '', { x: col4 + 4, y: row1BoxY + 6, size: inputTextSize, font, color: black });
    rowY = row1BoxY - rowGap;

    // Row 2: Address fields
    const colA = col1, colB = col2, colC = col3, colD = col4, colE = colC + 120 + colGap;
    page.drawText('Address (Street Number and Name)', { x: colA, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('Apt. Number (if any)', { x: colB, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('City or Town', { x: colC, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('State', { x: colD, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('ZIP Code', { x: colE, y: rowY, size: labelSize, font: fontBold, color: black });
    const row2BoxY = rowY - labelToBoxGap;
    page.drawRectangle({ x: colA, y: row2BoxY, width: 250, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: colB, y: row2BoxY, width: 100, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: colC, y: row2BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: colD, y: row2BoxY, width: 100, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: colE, y: row2BoxY, width: 100, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(section1.address || '', { x: colA + 4, y: row2BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.aptNumber || '', { x: colB + 4, y: row2BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.city || '', { x: colC + 4, y: row2BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.state || '', { x: colD + 4, y: row2BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.zipCode || '', { x: colE + 4, y: row2BoxY + 6, size: inputTextSize, font, color: black });
    rowY = row2BoxY - rowGap;

    // Row 3: DOB, SSN, Email, Phone
    const c1 = col1, c2 = col2, c3 = col3, c4 = col4;
    page.drawText('Date of Birth (mm/dd/yyyy)', { x: c1, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('U.S. Social Security Number', { x: c2, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText("Employee's Email Address", { x: c3, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText("Employee's Telephone Number", { x: c4, y: rowY, size: labelSize, font: fontBold, color: black });
    const row3BoxY = rowY - labelToBoxGap;
    page.drawRectangle({ x: c1, y: row3BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: c2, y: row3BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: c3, y: row3BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawRectangle({ x: c4, y: row3BoxY, width: 220, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(section1.dateOfBirth || '', { x: c1 + 4, y: row3BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.ssn || '', { x: c2 + 4, y: row3BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.email || '', { x: c3 + 4, y: row3BoxY + 6, size: inputTextSize, font, color: black });
    page.drawText(section1.telephone || '', { x: c4 + 4, y: row3BoxY + 6, size: inputTextSize, font, color: black });
    y = row3BoxY - rowGap - 60; // Add extra space before signature area

    // Signature and Date
    page.drawText('Signature of Employee', { x: padding, y: y + inputHeight + 4, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding, y, width: 700, height: 60, color: blueBg, borderWidth: 1, borderColor: black });
    if (section1.employeeSignature && section1.employeeSignature.startsWith('data:image')) {
      try {
        const imageBytes = Buffer.from(section1.employeeSignature.split(',')[1], 'base64');
        const image = await pdfDoc.embedPng(imageBytes);
        const dims = image.scale(0.25);
        page.drawImage(image, { x: padding + 10, y: y + 10, width: dims.width, height: dims.height });
      } catch {
        page.drawText('Signature not available', { x: padding + 10, y: y + 20, size: 10, font, color: rgb(1,0,0) });
      }
    }
    page.drawText('Clear Signature', { x: padding, y: y - 16, size: 11, font, color: rgb(1,0,0) });
    page.drawText("Today's Date (mm/dd/yyyy)", { x: padding + 800, y: y + inputHeight + 4, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 800, y, width: 200, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText(section1.employeeDate || '', { x: padding + 805, y: y + 6, size: inputTextSize, font, color: black });
    y -= 80;

    // Attestation and Checkbox Area (side-by-side/flex)
    const flexY = y;
    const flexHeight = 120;
    const flexWidth = 540; // half of 1120 (content area for 1200 width)
    const flexGap = 40;
    // Left: Attestation paragraph
    page.drawRectangle({ x: padding, y: flexY - flexHeight, width: flexWidth, height: flexHeight, color: grayBg, borderWidth: 1, borderColor: black });
    page.drawText(
      'I am aware that federal law provides for imprisonment and/or fines for false statements, or the use of false documents, in connection with the completion of this form. I attest, under penalty of perjury, that this information, including my selection of the box attesting to my citizenship or immigration status, is true and',
      { x: padding + 8, y: flexY - 18, size: 10, font, color: black, maxWidth: flexWidth - 16, lineHeight: 12 }
    );
    // Right: Citizenship checkboxes
    const rightX = padding + flexWidth + flexGap;
    page.drawRectangle({ x: rightX, y: flexY - flexHeight, width: flexWidth, height: flexHeight, color: grayBg, borderWidth: 1, borderColor: black });
    page.drawText('Check one of the following boxes to attest to your citizenship or immigration status', { x: rightX + 10, y: flexY - 18, size: 11, font: fontBold, color: black });
    page.drawText('(See page 2 and 3 of the instructions.)', { x: rightX + 10, y: flexY - 32, size: 9, font, color: black });
    const boxYStart = flexY - 50;
    const boxSize = 12;
    const boxGapY = 22;
    const checkboxes = [
      '1. A citizen of the United States',
      '2. A noncitizen national of the United States (See instructions.)',
      '3. A lawful permanent resident (Enter USCIS or A-Number)',
      '4. An alien authorized to work (other than Numbers 2 and 3 above) until (exp. date, if any)'
    ];
    // Only mark the selected checkbox with an 'X', leave others empty
    const selectedStatus = ['1','2','3','4'].includes(section1.citizenshipStatus) ? section1.citizenshipStatus : '';
    for (let i = 0; i < checkboxes.length; i++) {
      const boxY = boxYStart - i * boxGapY;
      page.drawRectangle({ x: rightX + 10, y: boxY, width: boxSize, height: boxSize, borderWidth: 1, borderColor: black });
      // Mark only the selected checkbox
      if (selectedStatus === String(i + 1)) {
        page.drawText('X', { x: rightX + 13, y: boxY + 2, size: 10, font: fontBold, color: black });
      }
      page.drawText(checkboxes[i], { x: rightX + 28, y: boxY + 2, size: 10, font, color: black });
    }
    y = flexY - flexHeight - 20;

    // “If you check Item Number 4...” row
    page.drawText('If you check Item Number 4., enter one of these:', { x: padding, y, size: 11, font: fontBold, color: black });
    y -= 20;
    page.drawRectangle({ x: padding, y, width: 300, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('USCIS A-Number', { x: padding + 4, y: y + inputHeight - 8, size: 10, font, color: black });
    page.drawText(section1.uscisNumber || '', { x: padding + 4, y: y + 6, size: inputTextSize, font, color: black });
    page.drawRectangle({ x: padding + 320, y, width: 300, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('Form I-94 Admission Number', { x: padding + 324, y: y + inputHeight - 8, size: 10, font, color: black });
    page.drawText(section1.i94Number || '', { x: padding + 324, y: y + 6, size: inputTextSize, font, color: black });
    page.drawRectangle({ x: padding + 640, y, width: 300, height: inputHeight, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('Foreign Passport Number and Country of Issuance', { x: padding + 644, y: y + inputHeight - 8, size: 10, font, color: black });
    page.drawText(section1.passportNumber || '', { x: padding + 644, y: y + 6, size: inputTextSize, font, color: black });
    y -= inputHeight + 20;

    // Document Table
    page.drawRectangle({ x: padding, y: y, width: 1120, height: 30, color: grayBg, borderWidth: 1, borderColor: black });
    page.drawText('LIST A', { x: padding + 10, y: y + 8, size: 12, font: fontBold, color: black });
    page.drawText('LIST B', { x: padding + 380, y: y + 8, size: 12, font: fontBold, color: black });
    page.drawText('LIST C', { x: padding + 750, y: y + 8, size: 12, font: fontBold, color: black });
    y -= 30;
    page.drawRectangle({ x: padding, y: y, width: 1120, height: 30, color: blueBg, borderWidth: 1, borderColor: black });
    page.drawText('Document Title 1', { x: padding + 10, y: y + 8, size: 11, font, color: black });
    y -= 40;

    // Acceptable Receipts Section
    page.drawText('ACCEPTABLE RECEIPTS', { x: 500, y: y, size: 16, font: fontBold, color: black });
    y -= 20;
    page.drawText('May be presented in lieu of a document listed above for a temporary period.', { x: 350, y: y, size: 11, font: fontBold, color: black });
    y -= 40;
    
    // End of layout
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully');

    // Simple email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Employment Form 05 (Employment Eligibility  verification Form)',
      text: 'Test form submission with PDF attachment.',
      attachments: [
        {
          filename: 'Employment Form 05 (Employment Eligibility  verification Form)',
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