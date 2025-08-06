import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'pcqx olxw twgw xkzz  ',
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
    // Make the page larger to accommodate bigger text and more spacing
    const pdfDoc = await PDFDocument.create();
    const pageWidth = 2000;
    const pageHeight = 2600;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0, 0, 0);
    const blueBg = rgb(0.9, 0.95, 1);
    const grayBg = rgb(0.93, 0.93, 0.93);

    // Increase all font sizes and box sizes
    let y = pageHeight - 100;
    const padding = 80;
    const inputHeight = 48;
    const inputTextSize = 22;
    const labelSize = 20;
    const headingSize = 32;
    const subHeadingSize = 26;
    const sectionHeaderSize = 24;
    const colGap = 40;
    const rowGap = 80;
    const labelToBoxGap = 40;

    // Logo
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logouss.png');
      const logoBuffer = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBuffer);
      const logoDims = logoImage.scale(0.7); // Larger logo
      page.drawImage(logoImage, { x: padding, y: y - logoDims.height + 60, width: logoDims.width, height: logoDims.height });
    } catch {
      console.error('Logo embedding failed:');
    }

    // Heading
    page.drawText('Employment Eligibility Verification', { x: 520, y, size: headingSize, font: fontBold, color: black });
    page.drawText('USCIS', { x: pageWidth - padding - 120, y, size: subHeadingSize, font: fontBold, color: black });
    y -= headingSize + 24; // Increased vertical space

    page.drawText('Department of Homeland Security', { x: 520, y, size: subHeadingSize, font: fontBold, color: black });
    page.drawText('Form I-9', { x: pageWidth - padding - 120, y, size: subHeadingSize, font: fontBold, color: black });
    y -= subHeadingSize + 18; // Increased vertical space

    page.drawText('U.S. Citizenship and Immigration Services', { x: 520, y, size: labelSize, font, color: black });
    page.drawText('OMB No. 1615-0047', { x: pageWidth - padding - 120, y, size: labelSize, font, color: black });
    y -= labelSize + 16; // Increased vertical space

    page.drawText('Expires 07/31/2026', { x: pageWidth - padding - 120, y, size: labelSize, font, color: black });
    y -= labelSize + 18; // Increased vertical space

    page.drawLine({ start: { x: padding, y }, end: { x: pageWidth - padding, y }, thickness: 3, color: black });
    y -= 32; // Increased vertical space

    page.drawText(
      'START HERE: Employers must ensure the form instructions are available to employees when completing this form...',
      { x: padding, y, size: labelSize, font: fontBold, color: black }
    );
    y -= labelSize + 18; // Increased vertical space

    page.drawText(
      'ANTI-DISCRIMINATION NOTICE: All employees can choose which acceptable documentation...',
      { x: padding, y, size: labelSize, font, color: black }
    );
    y -= labelSize + 40; // Increased vertical space

    // Black bar for Job Application Information
    page.drawRectangle({ x: padding, y: y - 60, width: pageWidth - 2 * padding, height: 60, color: black });
    page.drawText('Job Application Information', { x: padding + 20, y: y - 28, size: sectionHeaderSize, font: fontBold, color: rgb(1,1,1) });
    y -= 110; // Increased vertical space

    // Draw input boxes in a row
    // Use body.jobAppFullName, body.jobRole, body.location for values
    page.drawText('Full Name:', { x: padding, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 180, y: y - 8, width: 400, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawText(body.jobAppFullName || '', { x: padding + 190, y: y + 16, size: inputTextSize, font, color: black });

    page.drawText('Job Role:', { x: padding + 650, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 800, y: y - 8, width: 300, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawText(body.jobRole || '', { x: padding + 810, y: y + 16, size: inputTextSize, font, color: black });

    page.drawText('Location:', { x: padding + 1150, y, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding + 1280, y: y - 8, width: 220, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawText(body.location || '', { x: padding + 1290, y: y + 16, size: inputTextSize, font, color: black });
    y -= inputHeight + 48; // Increased vertical space

    // Section 1 header
    page.drawRectangle({ x: padding, y: y - 60, width: pageWidth - 2 * padding, height: 60, color: grayBg });
    page.drawText('Section 1. Employee Information and Attestation:', { x: padding + 20, y: y - 24, size: sectionHeaderSize, font: fontBold, color: black });
    page.drawText(
      'Employees must complete and sign Section 1 of Form I-9 no later than the first day of employment, but not before accepting a job offer.',
      { x: padding + 20, y: y - 48, size: labelSize, font, color: black }
    );
    y -= 110; // Increased vertical space

    // --- Section 1 Input Grid ---
    // Row 1: Name fields
    const col1 = padding;
    const col2 = col1 + 340 + colGap;
    const col3 = col2 + 340 + colGap;
    const col4 = col3 + 180 + colGap;
    let rowY = y;

    // Row 1 labels
    page.drawText('Last Name (Family Name)', { x: col1, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('First Name (Given Name)', { x: col2, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('Middle Initial', { x: col3, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('Other Last Names Used (if any)', { x: col4, y: rowY, size: labelSize, font: fontBold, color: black });

    // Row 1 boxes
    const row1BoxY = rowY - labelToBoxGap - 24; // Add extra vertical gap (increased for more gapping)
    page.drawRectangle({ x: col1, y: row1BoxY, width: 340, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: col2, y: row1BoxY, width: 340, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: col3, y: row1BoxY, width: 180, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: col4, y: row1BoxY, width: 340, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });

    // Row 1 values
    page.drawText(section1.lastName || '', { x: col1 + 8, y: row1BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.firstName || '', { x: col2 + 8, y: row1BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.middleInitial || '', { x: col3 + 8, y: row1BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.otherLastNames || '', { x: col4 + 8, y: row1BoxY + 16, size: inputTextSize, font, color: black });
    rowY = row1BoxY - rowGap - 16; // Add extra vertical gap

    // Row 2: Address fields (adjusted widths to prevent collision)
    // Add more vertical gapping before address row
    rowY -= 20; // Increase vertical gap before address row

    const addrColA = padding;
    const addrColB = addrColA + 320 + colGap;
    const addrColC = addrColB + 180 + colGap;
    const addrColD = addrColC + 320 + colGap;
    const addrColE = addrColD + 180 + colGap;

    page.drawText('Address (Street Number and Name)', { x: addrColA, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('Apt. Number (if any)', { x: addrColB, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('City or Town', { x: addrColC, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('State', { x: addrColD, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('ZIP Code', { x: addrColE, y: rowY, size: labelSize, font: fontBold, color: black });

    const row2BoxY = rowY - labelToBoxGap - 18; // Add extra vertical gap
    page.drawRectangle({ x: addrColA, y: row2BoxY, width: 320, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: addrColB, y: row2BoxY, width: 180, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: addrColC, y: row2BoxY, width: 320, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: addrColD, y: row2BoxY, width: 180, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: addrColE, y: row2BoxY, width: 180, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });

    page.drawText(section1.address || '', { x: addrColA + 8, y: row2BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.aptNumber || '', { x: addrColB + 8, y: row2BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.city || '', { x: addrColC + 8, y: row2BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.state || '', { x: addrColD + 8, y: row2BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.zipCode || '', { x: addrColE + 8, y: row2BoxY + 16, size: inputTextSize, font, color: black });
    rowY = row2BoxY - rowGap - 12; // Add extra vertical gap

    // Row 3: DOB, SSN, Email, Phone (adjusted widths and gaps)
    const empColA = padding;
    const empColB = empColA + 320 + colGap;
    const empColC = empColB + 320 + colGap;
    const empColD = empColC + 320 + colGap;

    page.drawText('Date of Birth (mm/dd/yyyy)', { x: empColA, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText('U.S. Social Security Number', { x: empColB, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText("Employee's Email Address", { x: empColC, y: rowY, size: labelSize, font: fontBold, color: black });
    page.drawText("Employee's Telephone Number", { x: empColD, y: rowY, size: labelSize, font: fontBold, color: black });

    const row3BoxY = rowY - labelToBoxGap - 18; // Add extra vertical gap
    page.drawRectangle({ x: empColA, y: row3BoxY, width: 320, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: empColB, y: row3BoxY, width: 320, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: empColC, y: row3BoxY, width: 320, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    page.drawRectangle({ x: empColD, y: row3BoxY, width: 320, height: inputHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });

    page.drawText(section1.dateOfBirth || '', { x: empColA + 8, y: row3BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.ssn || '', { x: empColB + 8, y: row3BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.email || '', { x: empColC + 8, y: row3BoxY + 16, size: inputTextSize, font, color: black });
    page.drawText(section1.telephone || '', { x: empColD + 8, y: row3BoxY + 16, size: inputTextSize, font, color: black });
    y = row3BoxY - rowGap - 120; // Add extra space before signature area

    // Signature and Date
    page.drawText('Signature of Employee', { x: padding, y: y + inputHeight + 32, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: padding, y, width: 600, height: inputHeight + 32, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
    if (section1.employeeSignature && section1.employeeSignature.startsWith('data:image')) {
      try {
        const imageBytes = Buffer.from(section1.employeeSignature.split(',')[1], 'base64');
        const image = await pdfDoc.embedPng(imageBytes);
        // Decrease the size of the signature and center it in the signature box
        const signatureBoxWidth = 600;
        const signatureBoxHeight = inputHeight + 42;
        const dims = image.scale(0.35);
        const sigX = padding + (signatureBoxWidth - dims.width) / 2;
        const sigY = y + (signatureBoxHeight - dims.height) / 2;
        page.drawImage(image, { x: sigX, y: sigY, width: dims.width, height: dims.height });
      } catch {
        page.drawText('Signature not available', { x: padding + 20, y: y + (inputHeight + 32) / 2, size: labelSize, font, color: rgb(1,0,0) });
      }
    }
    page.drawText('Clear Signature', { x: padding, y: y - 38, size: labelSize, font, color: rgb(1,0,0) });
    page.drawText("Today's Date (mm/dd/yyyy)", { x: pageWidth - padding - 400, y: y + inputHeight + 32, size: labelSize, font: fontBold, color: black });
    page.drawRectangle({ x: pageWidth - padding - 400, y, width: 320, height: inputHeight+20, borderWidth: 2, borderColor: black });
    page.drawText(section1.employeeDate || '', { x: pageWidth - padding - 390, y: y + 16, size: inputTextSize, font, color: black });
    y -= inputHeight + 80; // Increased vertical space

    // Attestation and Checkbox Area (side-by-side/flex)
    const flexY = y;
    const flexHeight = 260; // Increased height
    const flexWidth = (pageWidth - 2 * padding - colGap) / 2;
    const flexGap = colGap;
    // Left: Attestation paragraph
    page.drawRectangle({ x: padding, y: flexY - flexHeight, width: flexWidth, height: flexHeight, color: grayBg, borderWidth: 2, borderColor: black });
    page.drawText(
      'I am aware that federal law provides for imprisonment and/or fines for false statements, or the use of false documents, in connection with the completion of this form. I attest, under penalty of perjury, that this information, including my selection of the box attesting to my citizenship or immigration status, is true and',
      { x: padding + 16, y: flexY - 44, size: labelSize, font, color: black, maxWidth: flexWidth - 32, lineHeight: labelSize + 8 }
    );
    // Right: Citizenship checkboxes
    const rightX = padding + flexWidth + flexGap;
    page.drawRectangle({ x: rightX, y: flexY - flexHeight, width: flexWidth, height: flexHeight, color: grayBg, borderWidth: 2, borderColor: black });
    page.drawText('Check one of the following boxes to attest to your citizenship or immigration status', { x: rightX + 20, y: flexY - 44, size: labelSize, font: fontBold, color: black });
    page.drawText('(See page 2 and 3 of the instructions.)', { x: rightX + 20, y: flexY - 72, size: labelSize - 2, font, color: black });
    const boxYStart = flexY - 110; // Lowered start for more space
    const boxSize = 20; // Slightly larger
    const boxGapY = 48; // More vertical gap between checkboxes
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
      page.drawRectangle({ x: rightX + 20, y: boxY, width: boxSize, height: boxSize, borderWidth: 2, borderColor: black });
      // Mark only the selected checkbox
      if (selectedStatus === String(i + 1)) {
        page.drawText('X', { x: rightX + 27, y: boxY + 6, size: labelSize, font: fontBold, color: black });
      }
      page.drawText(checkboxes[i], { x: rightX + 60, y: boxY + 6, size: labelSize, font, color: black });
    }
    y = flexY - flexHeight - 60; // Increased vertical space

    // “If you check Item Number 4...” row
    page.drawText('If you check Item Number 4., enter one of these:', { x: padding, y, size: labelSize, font: fontBold, color: black });
    y -= labelSize + 48; // Increased vertical space

    page.drawRectangle({ x: padding, y, width: 400, height: inputHeight+50, color: blueBg, borderWidth: 2, borderColor: black });
    // Add more vertical gap between label and input text
    const uscisBoxLabelY = y + inputHeight + 10; // label higher above input
    const uscisBoxInputY = y + 28; // input text lower
    page.drawText('USCIS A-Number', { x: padding + 16, y: uscisBoxLabelY, size: labelSize, font, color: black });
    page.drawText(section1.uscisNumber || '', { x: padding + 60, y: uscisBoxInputY, size: inputTextSize, font, color: black });

    // Adjusted collision/spacing to match above (like uscisBoxLabelY/uscisBoxInputY)
    // I-94 box
    const i94BoxX = padding + 440;
    page.drawRectangle({ x: i94BoxX, y, width: 400, height: inputHeight + 50, color: blueBg, borderWidth: 2, borderColor: black });
    const i94BoxLabelY = y + inputHeight + 10;
    const i94BoxInputY = y + 28;
    page.drawText('Form I-94 Admission Number', { x: i94BoxX + 16, y: i94BoxLabelY, size: labelSize, font, color: black });
    page.drawText(section1.i94Number || '', { x: i94BoxX + 60, y: i94BoxInputY, size: inputTextSize, font, color: black });

    // Passport box
    const passportBoxX = padding + 880;
    page.drawRectangle({ x: passportBoxX, y, width: 520, height: inputHeight + 50, color: blueBg, borderWidth: 2, borderColor: black });
    const passportBoxLabelY = y + inputHeight + 10;
    const passportBoxInputY = y + 28;
    page.drawText('Foreign Passport Number and Country of Issuance', { x: passportBoxX + 16, y: passportBoxLabelY, size: labelSize, font, color: black });
    page.drawText(section1.passportNumber || '', { x: passportBoxX + 60, y: passportBoxInputY, size: inputTextSize, font, color: black });
    y -= inputHeight + 90; // Increased vertical space

    // Document Table (vertical labels)
    const tableFieldLabels = ['Document Title', 'Issuing Authority', 'Document Number', 'Expiration Date (if any)'];
    const tableColWidth = 360;
    const tableColXs = [padding, padding + tableColWidth, padding + tableColWidth * 2, padding + tableColWidth * 3];
    const tableRowHeight = 100; // Increased row height
    // Draw header row: empty cell, then List A, List B, List C
    page.drawRectangle({ x: padding, y: y, width: tableColWidth * 4, height: tableRowHeight, color: grayBg, borderWidth: 2, borderColor: black });
    page.drawText('', { x: tableColXs[0] + 20, y: y + 28, size: labelSize, font: fontBold, color: black });
    page.drawText('List A', { x: tableColXs[1] + 20, y: y + 28, size: labelSize, font: fontBold, color: black });
    page.drawText('List B', { x: tableColXs[2] + 20, y: y + 28, size: labelSize, font: fontBold, color: black });
    page.drawText('List C', { x: tableColXs[3] + 20, y: y + 28, size: labelSize, font: fontBold, color: black });
    y -= tableRowHeight;
    // Draw each field row
    const docFields = ['title', 'authority', 'number', 'expiration'];
    const placeholders = [
      'Enter document title',
      'Enter issuing authority',
      'Enter document number',
      'Enter expiration date'
    ];
    for (let i = 0; i < 4; i++) {
      // Row backgrounds: all white
      for (let c = 0; c < 4; c++) {
        page.drawRectangle({ x: tableColXs[c], y: y, width: tableColWidth, height: tableRowHeight, color: rgb(1,1,1), borderWidth: 2, borderColor: black });
      }
      // Label
      page.drawText(tableFieldLabels[i], { x: tableColXs[0] + 20, y: y + 28, size: labelSize, font: fontBold, color: black });
      // List A
      const valA = section2.document1?.[docFields[i]] || '';
      page.drawText(valA || placeholders[i], {
        x: tableColXs[1] + 20,
        y: y + 28,
        size: labelSize,
        font,
        color: valA ? black : rgb(0.7,0.7,0.7)
      });
      // List B
      const valB = section2.document2?.[docFields[i]] || '';
      page.drawText(valB || placeholders[i], {
        x: tableColXs[2] + 20,
        y: y + 28,
        size: labelSize,
        font,
        color: valB ? black : rgb(0.7,0.7,0.7)
      });
      // List C
      const valC = section2.document3?.[docFields[i]] || '';
      page.drawText(valC || placeholders[i], {
        x: tableColXs[3] + 20,
        y: y + 28,
        size: labelSize,
        font,
        color: valC ? black : rgb(0.7,0.7,0.7)
      });
      y -= tableRowHeight;
    }

    // Acceptable Receipts Section
    page.drawText('ACCEPTABLE RECEIPTS', { x: pageWidth / 2 - 120, y: y, size: sectionHeaderSize, font: fontBold, color: black });
    y -= sectionHeaderSize + 24; // Increased vertical space
    page.drawText('May be presented in lieu of a document listed above for a temporary period.', { x: pageWidth / 2 - 300, y: y, size: labelSize, font: fontBold, color: black });
    y -= labelSize + 70; // Increased vertical space
    
    // End of layout
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully');

    // Simple email
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Employment Form 05 (Form I-9)',
      text: 'Test form submission with PDF attachment.',
      attachments: [
        {
          filename: 'Employment Form 05 (Form I-9)',
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