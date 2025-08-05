
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver:'HR.batp@batp.org'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      jobAppFullName,
      jobRole,
      location,
    } = body;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 2800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = 2750;

    // Helper to ensure value is string
    const safe = (val: unknown): string =>
      val === undefined || val === null ? '' : String(val);

    // Draw text
    const drawText = (
      text: string,
      x: number,
      yPos: number,
      isBold = false,
      size = 12
    ): void => {
      page.drawText(text, {
        x,
        y: yPos,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    // Draw paragraph with word wrap
    const drawParagraph = (
      text: string,
      x: number,
      yPos: number,
      width: number,
      size = 10,
      lineGap = 4
    ): number => {
      const words = text.split(' ');
      let line = '';
      let yy = yPos;
      for (let i = 0; i < words.length; i += 1) {
        const testLine = line + words[i] + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, size);
        if (testWidth > width && line !== '') {
          page.drawText(line, { x, y: yy, size, font, color: rgb(0, 0, 0) });
          line = words[i] + ' ';
          yy -= size + lineGap;
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line, { x, y: yy, size, font, color: rgb(0, 0, 0) });
      }
      return yy - size - lineGap;
    };

    // Draw line
    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): void => {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    };

    // --- Job Application Fields at the top ---
    page.drawRectangle({
      x: 40,
      y: y - 30,
      width: 530,
      height: 30,
      color: rgb(0, 0, 0),
    });
    page.drawText('Job Application Information', {
      x: 50,
      y: y - 12,
      size: 14,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
    y -= 50;

    // Full Name
    drawText('Full Name:', 50, y, true, 10);
    page.drawRectangle({
      x: 130,
      y: y - 4,
      width: 180,
      height: 18,
      color: rgb(0.9, 0.95, 1),
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });
    drawText(safe(jobAppFullName), 135, y, false, 10);
    y -= 22;

    // Job Role
    drawText('Job Role:', 50, y, true, 10);
    page.drawRectangle({
      x: 130,
      y: y - 4,
      width: 180,
      height: 18,
      color: rgb(0.9, 0.95, 1),
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });
    drawText(safe(jobRole), 135, y, false, 10);
    y -= 22;

    // Location
    drawText('Location:', 50, y, true, 10);
    page.drawRectangle({
      x: 130,
      y: y - 4,
      width: 180,
      height: 18,
      color: rgb(0.9, 0.95, 1),
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });
    drawText(safe(location), 135, y, false, 10);
    y -= 30;

    // Draw input box with value
    function drawInputBox(
      value: string,
      x: number,
      yPos: number,
      width: number,
      height: number,
      placeholder = ''
    ): void {
      page.drawRectangle({
        x,
        y: yPos - 2,
        width,
        height,
        color: rgb(1, 1, 1),
        borderWidth: 1,
        borderColor: rgb(0.7, 0.7, 0.7),
      });
      // Always draw the value, fallback to placeholder if empty
      drawText(safe(value) !== '' ? safe(value) : placeholder, x + 6, yPos + 4, false, 10);
    }

    // Draw date box
    function drawDateBox(
      label: string,
      value: string,
      xLabel: number,
      y: number,
      xBox: number,
      boxWidth = 90,
      boxHeight = 18,
      labelBold = true,
      fontSize = 10
    ): void {
      if (label) drawText(label, xLabel, y + 4, labelBold, fontSize);
      page.drawRectangle({
        x: xBox,
        y: y - 2,
        width: boxWidth,
        height: boxHeight,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });
      drawText(safe(value), xBox + 6, y + 4, false, fontSize);
    }

    // Draw Yes/No radio
    function drawYesNoRadio(
      label: string,
      answer: string,
      xLabel: number,
      y: number,
      xYes: number,
      xNo: number,
      labelBold = true,
      fontSize = 10
    ): void {
      if (label) drawText(label, xLabel, y + 4, labelBold, fontSize);
      page.drawEllipse({
        x: xYes,
        y: y + 6,
        xScale: 6,
        yScale: 6,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });
      if (answer === 'yes') {
        page.drawEllipse({
          x: xYes,
          y: y + 6,
          xScale: 3,
          yScale: 3,
          color: rgb(0, 0, 0),
        });
      }
      drawText('Yes', xYes + 10, y + 6, false, fontSize);
      page.drawEllipse({
        x: xNo,
        y: y + 6,
        xScale: 6,
        yScale: 6,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });
      if (answer === 'no') {
        page.drawEllipse({
          x: xNo,
          y: y + 6,
          xScale: 3,
          yScale: 3,
          color: rgb(0, 0, 0),
        });
      }
      drawText('No', xNo + 10, y + 6, false, fontSize);
    }

    // --- Main PDF Layout ---
    async function drawFullDisclosureForm(form: Record<string, unknown>, startY: number): Promise<number> {
      let y = startY;

      // --- Header ---
      drawText('Commonwealth of Pennsylvania', 160, y, true, 16);
      y -= 22;
      drawText('Sexual Misconduct/Abuse Disclosure Release', 120, y, true, 14);
      y -= 18;
      drawText('(Pursuant to Act 168 of 2014)', 200, y, false, 11);
      y -= 30;

      drawText('(Instructions)', 200, y, false, 11);
      y -= 30;
      y =
        drawParagraph(
          'This standardized form has been developed by the Pennsylvania Department of Education, pursuant to Act 168 of 2014, to be used by school entities and independent contractors of school entities and by applicants who would be employed by or in a school entity in a position involving direct contact with children to satisfy the Act\'s requirements of providing information related to abuse or sexual misconduct. As required by Act 168, in addition to fulfilling the requirements under section 111 of the School Code and the Child Protective Services Law ("CPSL"), an applicant who would be employed by or in a school entity in a position having direct contact with children, must provide the information requested in SECTION 1 of this form and complete written authorization that consents to and authorizes the disclosure by the applicant\'s current and former employers of the information requested in SECTION 2 of this form. The applicant shall complete one form for the applicant\'s current employer(s) and one for each of the applicant\'s former employers that were school entities or where the applicant was employed in a position having direct contact with children (therefore, the applicant may have to complete more than one form). Upon completion by the applicant, the hiring school entity or independent contractor shall submit the form to the applicant\'s current and former employers to complete SECTION 2. A school entity or independent contractor may not hire an applicant who does not provide the required information for a position involving direct contact with children.',
          55,
          y,
          500,
          10,
          4
        ) - 10;
      y =
        drawParagraph(
          'The individual whose name appears below has reported previous employment with your entity. We request you provide the information requested in SECTION 2 of this form within 20 calendar days as required by Act 168 of 2014.',
          55,
          y,
          500,
          10,
          4
        ) - 10;
      y =
        drawParagraph(
          'Please note that failure to respond to this request within the specified timeframe may result in further follow-up or action as permitted by law. Your cooperation is essential in ensuring a safe environment for all students.',
          55,
          y,
          500,
          10,
          4
        ) - 10;
      y =
        drawParagraph(
          'If you have any questions regarding this request or require additional information, please contact our office at your earliest convenience. Thank you for your prompt attention to this important matter.',
          55,
          y,
          500,
          10,
          4
        ) - 10;

      // --- Employer Section ---
      drawText('Commonwealth of Pennsylvania', 160, y, true, 16);
      y -= 22;
      drawText('Sexual Misconduct/Abuse Disclosure Release', 120, y, true, 14);
      y -= 18;
      drawText('(Pursuant to Act 168 of 2014)', 200, y, false, 11);
      y -= 30;

      // Draw a box around the entire Employer Section (all labels and inputs)
      const employerSectionX = 45;
      const employerSectionY = y;
      const employerSectionWidth = 550;
      const employerSectionHeight = 250; // Adjust as needed to fit all fields

      page.drawRectangle({
        x: employerSectionX,
        y: employerSectionY - employerSectionHeight + 10,
        width: employerSectionWidth,
        height: employerSectionHeight,
        borderWidth: 1,
        borderColor: rgb(0.2, 0.2, 0.2),
        color: rgb(1, 1, 1),
      });

      // Name of Current or Former Employer (label and input box on same line, spaced horizontally)
      const flexLabel1X = employerSectionX + 10;
      const flexY = y - 10;

      drawText(
        'Name of Current or Former Employer',
        flexLabel1X,
        flexY,
        true,
        10
      );
      drawInputBox(
        safe(form.employerName),
        flexLabel1X,
        flexY - 20,
        300,
        20,
        'Enter employer name...'
      );
      // Draw a rectangle around the "No applicable employment" label and its checkbox area
      const noEmpRectX = flexLabel1X + 355;
      const noEmpRectY = flexY - 20; // moved 10 units further down
      const noEmpRectWidth = 170;
      const noEmpRectHeight = 22;
      page.drawRectangle({
        x: noEmpRectX,
        y: noEmpRectY,
        width: noEmpRectWidth,
        height: noEmpRectHeight,
        borderWidth: 1,
        borderColor: rgb(0.1, 0.1, 0.1),
        color: rgb(1, 1, 1),
      });

      drawText(
        'No applicable employment',
        flexLabel1X + 370,
        flexY - 10, // also move the label down to match the rectangle
        true,
        10
      );
      // Draw the checkbox next to the "No applicable employment" label, a little lower and aligned to the right of the label
      const labelX = flexLabel1X + 370;
      const labelY = flexY - 17; // y position of the label
      const tickBoxSize = 14;
      // Place the checkbox just to the right of the label, and a little lower
      const tickX = labelX + 134; // 130px to the right of label (adjust as needed for spacing)
      const tickY = labelY - 2;   // 2px lower than label baseline
      page.drawRectangle({
        x: tickX,
        y: tickY,
        width: tickBoxSize,
        height: tickBoxSize,
        borderWidth: 1,
        borderColor: rgb(0.1, 0.1, 0.1),
        color: rgb(1, 1, 1),
      });
      if (form.employerNoApplicable) {
        page.drawLine({
          start: { x: tickX + 3, y: tickY + 5 },
          end: { x: tickX + 6, y: tickY + 2 },
          thickness: 2,
          color: rgb(0, 0.5, 0),
        });
        page.drawLine({
          start: { x: tickX + 6, y: tickY + 2 },
          end: { x: tickX + 10, y: tickY + 10 },
          thickness: 2,
          color: rgb(0, 0.5, 0),
        });
      }

      y -= 42;

      drawText('Street Address', 55, y, true, 10);
      y -= 24;
      drawInputBox(
        safe(form.employerStreet),
        55,
        y,
        160,
        20,
        'Enter street address...'
      );
      y -= 26;

      drawText('City, State, Zip', 55, y, true, 10);
      y -= 24;
      drawInputBox(
        safe(form.employerCityStateZip),
        55,
        y,
        160,
        20,
        'Enter city, state, zip...'
      );
      y -= 26;

      const col1X = 55;
      const col2X = col1X + 180;
      const col3X = col2X + 180;

      drawText('Telephone Number', col1X, y, true, 10);
      drawText('Fax Number', col2X, y, true, 10);
      drawText('Email', col3X, y, true, 10);

      y -= 24;

      drawInputBox(
        safe(form.employerPhone),
        col1X,
        y,
        160,
        20,
        'Enter phone...'
      );
      drawInputBox(
        safe(form.employerFax),
        col2X,
        y,
        160,
        20,
        'Enter fax...'
      );
      drawInputBox(
        safe(form.employerEmail),
        col3X,
        y,
        160,
        20,
        'Enter email...'
      );

      y -= 32;

      const contactLabelX = 55;
      const contactInputX = contactLabelX;
      const titleLabelX = contactLabelX + 200;
      const titleInputX = titleLabelX;
      const inputWidth = 160;
      const inputHeight = 20;

      drawText('Contact Person', contactLabelX, y, true, 10);
      drawText('Title', titleLabelX, y, true, 10);

      y -= 22;

      drawInputBox(
        safe(form.employerContact),
        contactInputX,
        y,
        inputWidth,
        inputHeight,
        'Enter contact person...'
      );
      drawInputBox(
        safe(form.employerTitle),
        titleInputX,
        y,
        inputWidth,
        inputHeight,
        'Enter title...'
      );

      y -= 42;

      y =
        drawParagraph(
          "The named applicant is under consideration for a position with our entity. The Pennsylvania General Assembly has determined that additional safeguards are necessary in the hiring of school employees to ensure the safety of the Commonwealth's students. The individual whose name appears below has reported previous employment with your entity. We request you provide the information requested in SECTION 2 of this form within 20 calendar days as required by Act 168 of 2014.",
          55,
          y,
          500,
          10,
          4
        ) - 10;

      drawLine(50, y, 550, y);
      y -= 18;

      drawText('Section 1: Applicant Certification and Release', 55, y, true, 12);
      y -= 20;

      drawText("Applicant's Name (First, Middle, Last)", 55, y, true, 10);
      y -= 24;
      drawInputBox(
        safe(form.applicantName),
        55,
        y,
        260,
        20,
        "Enter applicant's name..."
      );
      y -= 26;

      drawText(
        'Any former names by which the Applicant has been identified',
        55,
        y,
        true,
        10
      );
      y -= 24;
      drawInputBox(
        safe(form.applicantFormerNames),
        55,
        y,
        260,
        20,
        'Enter former names...'
      );
      y -= 20;

      drawText('DOB', 55, y, true, 10);
      y -= 24;
      drawInputBox(safe(form.applicantDOB), 55, y, 160, 20, 'MM/DD/YYYY');
      y -= 20;

      drawText(
        "Last 4 digits of Applicant's Social Security Number",
        55,
        y,
        true,
        10
      );
      drawText('PPID (if applicable)', 320, y, true, 10);

      y -= 24;

      drawInputBox(safe(form.applicantSSN4), 55, y, 120, 20, 'XXXX');
      drawInputBox(safe(form.applicantPPID), 320, y, 120, 20, 'Enter PPID...');

      y -= 20;

      drawText(
        'Approximate dates of employment with the entity listed above',
        55,
        y,
        true,
        10
      );
      y -= 24;
      drawInputBox(
        safe(form.applicantEmploymentDates),
        55,
        y,
        260,
        20,
        'Enter dates...'
      );
      y -= 20;

      drawText('Position(s) held with the entity', 55, y, true, 10);
      y -= 24;
      drawInputBox(
        safe(form.applicantPositions),
        55,
        y,
        260,
        20,
        'Enter positions...'
      );
      y -= 36;

      y =
        drawParagraph(
          'Pursuant to Act 168, an employer, school entity, administrator and/or independent contractor that provides information or records about a current or former employee or applicant shall be immune from criminal liability under the CPSL, the Educator DisciplineAct, and from the cival liability for the disclosure of the information, or records provided were knowingly false.Such immunity shall be an addition to and not in limitation of any other immmunity provided law or any absoluten or conditional previliges applicable to such disclosure by the virtue of the circumstancesof the applicants consent thereto. Under Act 168, the willfull failure to respond to or for provide the information and records as requested may result in civil penalties and/or professional discipline, where applicable.',
          55,
          y,
          500,
          10,
          4
        ) - 10;

      drawLine(50, y, 550, y);
      y -= 18;

      drawText('Section 1: Have you (Applicant) ever?', 55, y, true, 11);
      y -= 18;
      const applicantQuestions = [
        'Been the subject of an abuse or sexual misconduct investigation by any employer, state licensing agency, law enforcement agency or child protective services agency (unless the investigation resulted in a finding that the allegations were false)?',
        'Been disciplined, discharged, non-renewed, asked to resign from employment, resigned from or otherwise separated from employment while allegations of abuse or sexual misconduct were pending or under investigation or due to adjudication or findings of abuse or sexual misconduct?',
        'Had a license, professional license or certificate suspended, surrendered or revoked while allegations of abuse or sexual misconduct were pending or under investigation or due to an adjudication or findings of abuse or sexual misconduct?',
      ];
      for (let i = 0; i < applicantQuestions.length; i += 1) {
        drawYesNoRadio(
          '',
          safe(form[`applicantQ${i}`]),
          70,
          y - 2,
          60,
          100
        );
        y = drawParagraph(
          `${i + 1}. ${applicantQuestions[i]}`,
          140,
          y,
          430,
          9,
          2
        );
        y -= 28;
      }

      y -= 6;
      y = drawParagraph(
        'By signing this form, I certify under penalty of law that the statements made in this form are correct, complete and true to the best of my knowledge. I understand that false statements herein including, without limitation, any willful misrepresentation shall, subject me to criminal prosecution under 18 P.C.S. § 4904 (relating to unsworn falsification to authorities) and to discipline up to and including termination of employment, and may subject me to civil penalties. I understand that this form and the responses are official records of the Department of Education. I also hereby authorize the above-named employer to release all requested information and any related records. I hereby release, waive and discharge the above-named employer from any and all liability for providing the requested information and records. I understand and acknowledge that third party vendors may be used to process this Act 168 pre-employment history review.',
        55,
        y,
        500,
        9,
        3
      );
      y -= 20;

      // Draw "Signature" and "Date" labels side by side, then draw input boxes below with data/signature if present
      const applicantSignatureBoxWidth = 180;
      const applicantSignatureBoxHeight = 32;
      const applicantDateBoxWidth = 120;
      const applicantDateBoxHeight = 32;
      const applicantSignatureBoxX = 55;
      const applicantDateBoxX =
        applicantSignatureBoxX + applicantSignatureBoxWidth + 40;
      const applicantLabelFontSize = 10;
      const applicantLabelSpacing = 8;
      const applicantInputBoxY =
        y - applicantLabelFontSize - applicantLabelSpacing;

      // Draw labels above input boxes
      drawText(
        'Signature',
        applicantSignatureBoxX,
        y,
        true,
        applicantLabelFontSize
      );
      drawText(
        'Date',
        applicantDateBoxX,
        y,
        true,
        applicantLabelFontSize
      );

      // Draw signature input box
      page.drawRectangle({
        x: applicantSignatureBoxX,
        y: applicantInputBoxY - applicantSignatureBoxHeight + 2,
        width: applicantSignatureBoxWidth,
        height: applicantSignatureBoxHeight,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });

      // Draw date input box
      page.drawRectangle({
        x: applicantDateBoxX,
        y: applicantInputBoxY - applicantDateBoxHeight + 2,
        width: applicantDateBoxWidth,
        height: applicantDateBoxHeight,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });

      // Draw signature image if present
      if (
        form.applicantSignature &&
        typeof form.applicantSignature === 'string' &&
        form.applicantSignature.startsWith('data:image')
      ) {
        const base64 = form.applicantSignature.split(',')[1];
        const binary = Buffer.from(base64, 'base64');
        const pngImage = await pdfDoc.embedPng(binary);
        let imgWidth = pngImage.width;
        let imgHeight = pngImage.height;

        // Fit image inside the signature box with some padding
        const maxWidth = applicantSignatureBoxWidth - 20;
        const maxHeight = applicantSignatureBoxHeight - 8;
        const scale = Math.min(
          maxWidth / imgWidth,
          maxHeight / imgHeight,
          1
        );
        imgWidth *= scale;
        imgHeight *= scale;
        page.drawImage(pngImage, {
          x:
            applicantSignatureBoxX +
            (applicantSignatureBoxWidth - imgWidth) / 2,
          y:
            applicantInputBoxY -
            applicantSignatureBoxHeight +
            2 +
            (applicantSignatureBoxHeight - imgHeight) / 2,
          width: imgWidth,
          height: imgHeight,
        });
      }

      // Draw applicant date if present, inside the date input box
      if (form.applicantDate && typeof form.applicantDate === 'string') {
        drawText(
          form.applicantDate,
          applicantDateBoxX + 12,
          applicantInputBoxY -
            applicantDateBoxHeight +
            2 +
            applicantDateBoxHeight / 2 -
            5,
          false,
          10
        );
      }
      y -= 76;

      drawText(
        'Section 2: Current/Former Employer Verification ',
        55,
        y,
        true,
        12
      );
      y -= 20;

      drawText('Dates of employment of Applicant', 55, y, true, 10);
      drawText('Contact telephone #', 340, y, true, 10);
      y -= 24;
      drawInputBox(
        safe(form.section2EmploymentDates),
        55,
        y,
        260,
        20,
        'Enter dates...'
      );
      drawInputBox(
        safe(form.section2EmployerPhone),
        340,
        y,
        160,
        20,
        'Enter phone...'
      );
      y -= 40;

      const section2Questions = [
        'Been the subject of an abuse or sexual misconduct investigation by any employer, state licensing agency, law enforcement agency or child protective services agency (unless the investigation resulted in a finding that the allegations were false)?',
        'Been disciplined, discharged, non-renewed, asked to resign from employment, resigned from or otherwise separated from employment while allegations of abuse or sexual misconduct were pending or under investigation or due to adjudication or findings of abuse or sexual misconduct?',
        'Had a license, professional license or certificate suspended, surrendered or revoked while allegations of abuse or sexual misconduct were pending or under investigation or due to an adjudication or findings of abuse or sexual misconduct?',
        'No records or other evidence currently exists regarding the above questions. I have no knowledge of information pertaining to the applicant that would disqualify the applicant from employment.',
      ];
      for (let i = 0; i < section2Questions.length; i += 1) {
        const radioX = 44;
        const radioY = y;
        const labelYesX = radioX + 0;
        const radioYesX = labelYesX + 30;
        const labelNoX = radioYesX + 30;
        const radioNoX = labelNoX + 30;
        const questionX = radioNoX + 40;

        drawText('Yes', labelYesX, radioY, false, 10);
        page.drawEllipse({
          x: radioYesX,
          y: radioY + 6,
          xScale: 6,
          yScale: 6,
          color: rgb(1, 1, 1),
          borderWidth: 1.2,
          borderColor: rgb(0.2, 0.2, 0.2),
        });
        if (form[`section2Q${i}`] === 'yes') {
          page.drawEllipse({
            x: radioYesX,
            y: radioY + 6,
            xScale: 3,
            yScale: 3,
            color: rgb(0, 0, 0),
          });
        }

        drawText('No', labelNoX, radioY, false, 10);
        page.drawEllipse({
          x: radioNoX,
          y: radioY + 6,
          xScale: 6,
          yScale: 6,
          color: rgb(1, 1, 1),
          borderWidth: 1.2,
          borderColor: rgb(0.2, 0.2, 0.2),
        });
        if (form[`section2Q${i}`] === 'no') {
          page.drawEllipse({
            x: radioNoX,
            y: radioY + 6,
            xScale: 3,
            yScale: 3,
            color: rgb(0, 0, 0),
          });
        }

        const paraEndY = drawParagraph(
          `${i + 1}. ${section2Questions[i]}`,
          questionX,
          radioY,
          420,
          9,
          2
        );
        const paraHeight = radioY - paraEndY;
        if (paraHeight > 0) {
          y -= paraHeight;
        }
        y -= 28;
      }

      y -= 10;

      // Draw signature and date fields in a flex row style (side by side)
      const sigLabelX = 55;

      drawText(
        'Former Employer Representative Signature and Date',
        sigLabelX,
        y,
        true,
        10
      );

      y -= 18;

      // Set new dimensions for signature and date input boxes
      const newSigBoxWidth = 100;
      const newSigBoxHeight = 44;
      const newDateBoxWidth = 100;
      const newDateBoxHeight = newSigBoxHeight;
      const boxSpacing = 40;
      const newSigBoxX = 55;
      const newDateBoxX = newSigBoxX + newSigBoxWidth + boxSpacing;
      const labelFontSize = 10;
      const labelSpacing = 8;
      const inputBoxY = y - labelFontSize - labelSpacing;

      // Draw signature label above input box
      drawText(
        'Former Employer Representative Signature and Date',
        newSigBoxX,
        y,
        true,
        labelFontSize
      );

      // Draw signature input box
      page.drawRectangle({
        x: newSigBoxX,
        y: inputBoxY - newSigBoxHeight + 2,
        width: newSigBoxWidth,
        height: newSigBoxHeight,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });

      // Draw date input box
      page.drawRectangle({
        x: newDateBoxX,
        y: inputBoxY - newDateBoxHeight + 2,
        width: newDateBoxWidth,
        height: newDateBoxHeight,
        color: rgb(1, 1, 1),
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.2),
      });

      // Draw signature image if present
      if (
        form.employerSignature &&
        typeof form.employerSignature === 'string' &&
        form.employerSignature.startsWith('data:image')
      ) {
        const base64 = form.employerSignature.split(',')[1];
        const binary = Buffer.from(base64, 'base64');
        const pngImage = await pdfDoc.embedPng(binary);
        let imgWidth = pngImage.width;
        let imgHeight = pngImage.height;

        // Fit image inside the signature box with some padding
        const maxWidth = newSigBoxWidth - 20;
        const maxHeight = newSigBoxHeight - 8;
        const scale = Math.min(
          maxWidth / imgWidth,
          maxHeight / imgHeight,
          1
        );
        imgWidth *= scale;
        imgHeight *= scale;
        page.drawImage(pngImage, {
          x: newSigBoxX + (newSigBoxWidth - imgWidth) / 2,
          y:
            inputBoxY -
            newSigBoxHeight +
            2 +
            (newSigBoxHeight - imgHeight) / 2,
          width: imgWidth,
          height: imgHeight,
        });
      }

      // Draw employer date if present, inside the date input box
      if (form.employerDate && typeof form.employerDate === 'string') {
        drawText(
          form.employerDate,
          newDateBoxX + 12,
          inputBoxY -
            newDateBoxHeight +
            2 +
            newDateBoxHeight / 2 -
            5,
          false,
          10
        );
      }

      y -= 84;

      drawText('Return all completed information to:', 55, y, true, 11);
      y -= 28;
      // Draw a rectangle around the "Return all completed information to" section and the following labels
      // Calculate the height to cover both rows of labels and their backgrounds
      const infoBoxX = 50;
      const infoBoxY = y + 10; // a little above the "Return all completed information to:" label
      const infoBoxWidth = 450;
      const infoBoxHeight = 400; // enough to cover both label rows and some padding

      page.drawRectangle({
        x: infoBoxX,
        y: infoBoxY - infoBoxHeight,
        width: infoBoxWidth,
        height: infoBoxHeight,
        borderWidth: 1.2,
        borderColor: rgb(0.2, 0.2, 0.5),
        color: rgb(1, 1, 1),
      });

      let rowY = y;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 260,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      page.drawRectangle({
        x: 340,
        y: rowY - 18,
        width: 120,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      drawText(
        'School Entity/Independent Contractor',
        60,
        rowY - 6,
        true,
        10
      );
      drawText('Phone', 345, rowY - 6, true, 10);

      rowY -= 24;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 260,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      page.drawRectangle({
        x: 340,
        y: rowY - 18,
        width: 120,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      drawText(
        'Behavior Analysis & Therapy Partners',
        60,
        rowY - 6,
        false,
        10
      );
      drawText('610-664-6200', 345, rowY - 6, false, 10);

      rowY -= 26;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 220,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      page.drawRectangle({
        x: 340,
        y: rowY - 18,
        width: 120,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      drawText('Address', 60, rowY - 6, true, 10);
      drawText('Fax', 345, rowY - 6, true, 10);

      rowY -= 24;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 220,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      page.drawRectangle({
        x: 340,
        y: rowY - 18,
        width: 120,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      drawText('139 Montgomery Ave Suite #110', 60, rowY - 6, false, 10);
      drawText('610-664-6202', 345, rowY - 6, false, 10);

      rowY -= 26;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 120,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      page.drawRectangle({
        x: 240,
        y: rowY - 18,
        width: 220,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      drawText('City', 60, rowY - 6, true, 10);
      drawText('Email', 245, rowY - 6, true, 10);

      rowY -= 24;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 120,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      page.drawRectangle({
        x: 240,
        y: rowY - 18,
        width: 220,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      drawText('Bala Cynwyd', 60, rowY - 6, false, 10);
      drawText('hr.batp@gmail.com', 245, rowY - 6, false, 10);

      rowY -= 26;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 60,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      page.drawRectangle({
        x: 160,
        y: rowY - 18,
        width: 80,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      drawText('State', 60, rowY - 6, true, 10);
      drawText('Zip', 165, rowY - 6, true, 10);

      rowY -= 24;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 60,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      page.drawRectangle({
        x: 160,
        y: rowY - 18,
        width: 80,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      drawText('PA', 60, rowY - 6, false, 10);
      drawText('19004', 165, rowY - 6, false, 10);

      rowY -= 26;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 160,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      page.drawRectangle({
        x: 240,
        y: rowY - 18,
        width: 160,
        height: 18,
        borderWidth: 0,
        color: rgb(0.97, 0.97, 1),
      });
      drawText('Contact Person', 60, rowY - 6, true, 10);
      drawText('Title', 245, rowY - 6, true, 10);

      rowY -= 24;

      page.drawRectangle({
        x: 55,
        y: rowY - 18,
        width: 160,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      page.drawRectangle({
        x: 240,
        y: rowY - 18,
        width: 160,
        height: 18,
        borderWidth: 0,
        color: rgb(1, 1, 1),
      });
      drawText('Vinnie Adams', 60, rowY - 6, false, 10);
      drawText('HR Coordinator', 245, rowY - 6, false, 10);

      // Move the "Date Form Received" and "Received by" fields to the very bottom, ensuring enough space below previous content
      y -= 320;

      // Draw "Date" and "Received by" labels side by side (flex row)
      drawText('Date', 55, y, true);
      drawText('Received by', 250, y, true);
      y -= 24;

      // Draw input boxes for Date and Received by side by side, just below their labels
      drawDateBox(
        '',
        safe(form.dateFormReceived),
        55,
        y - 18,
        55,
        18,
        1
      );
      drawInputBox(
        safe(form.receivedBy),
        250,
        y - 18,
        180,
        20,
        'Enter name...'
      );
      y -= 30;

      return y;
    }

    await drawFullDisclosureForm(
      {
        fullName: jobAppFullName,
        jobRole,
        location,
        employerName: body?.employerName,
        employerNoApplicable: body?.employerNoApplicable,
        employerStreet: body?.employerStreet,
        employerCityStateZip: body?.employerCityStateZip,
        employerPhone: body?.employerPhone,
        employerFax: body?.employerFax,
        employerEmail: body?.employerEmail,
        employerContact: body?.employerContact,
        employerTitle: body?.employerTitle,
        applicantName: body?.applicantName,
        applicantFormerNames: body?.applicantFormerNames,
        applicantDOB: body?.applicantDOB,
        applicantSSN4: body?.applicantSSN4,
        applicantPPID: body?.applicantPPID,
        applicantEmploymentDates: body?.applicantEmploymentDates,
        applicantPositions: body?.applicantPositions,
        applicantQ0: body?.applicantQ0,
        applicantQ1: body?.applicantQ1,
        applicantQ2: body?.applicantQ2,
        applicantSignature: body?.applicantSignature,
        applicantDate: body?.applicantDate,
        section2EmploymentDates: body?.section2EmploymentDates,
        section2EmployerPhone: body?.section2EmployerPhone,
        section2Q0: body?.section2Q0,
        section2Q1: body?.section2Q1,
        section2Q2: body?.section2Q2,
        section2Q3: body?.section2Q3,
        employerSignature: body?.employerSignature,
        employerDate: body?.employerDate,
        dateFormReceived: body?.dateFormReceived,
        receivedBy: body?.receivedBy,
      },
      y
    );

    const pdfBytes = await pdfDoc.save();

    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Employment Form 09 (Act 168 Form.pdf)',
      text: `Disclosure Statement submitted by ${name}.`,
      attachments: [
        {
          filename: 'Employment Form 09 (Act 168 Form.pdf)',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully. Email with PDF sent.',
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Server error while sending email' },
      { status: 500 }
    );
  }
}
