import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobAppFullName,
      jobRole,
      location,
      fullName,
      dobDay,
      dobMonth,
      dobYear,
      otherNames,
      hasNotBeenArrestedOrConvicted,
      hasBeenArrestedOrConvicted,
      arrestDetail1,
      arrestDetail2,
      hasNotBeenPerpetratorChildAbuse,
      hasBeenPerpetratorChildAbuse,
      date,
      signature,
    } = body;

    // Increase PDF page height for more vertical space
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 2000]); // Increased height from 1400 to 2000
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;
    const lineHeight = 18;
    const margin = 40;

    function drawHeading(text: string) {
      y -= lineHeight * 1.8;
      // Draw black rectangle for heading background
      page.drawRectangle({
        x: margin,
        y: y + 4,
        width: width - margin * 2,
        height: 24,
        color: rgb(0, 0, 0),
      });
      page.drawText(text, { x: margin + 8, y: y + 8, size: 14, font: boldFont, color: rgb(1, 1, 1) });
      y -= 5;
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }

    function drawLabelValue(label: string, value: string) {
      y -= lineHeight;
      page.drawText(`${label}:`, { x: margin, y, size: 12, font: boldFont });
      page.drawText(value || '', { x: margin + 120, y, size: 12, font });
      // Draw underline for input
      page.drawLine({ start: { x: margin + 120, y: y - 2 }, end: { x: width - margin, y: y - 2 }, thickness: 1, color: rgb(0, 0, 0) });
      y -= lineHeight * 0.7;
    }

    function drawParagraphHeading(text: string) {
      y -= lineHeight * 1.2;
      // Black background for paragraph heading
      page.drawRectangle({
        x: margin,
        y: y + 4,
        width: width - margin * 2,
        height: 20,
        color: rgb(0, 0, 0),
      });
      page.drawText(text, { x: margin + 8, y: y + 7, size: 12, font: boldFont, color: rgb(1, 1, 1) });
      y -= 8;
    }

    function drawParagraph(text: string, margin: number, maxWidth: number) {
      const words = text.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, 11);
        if (testWidth > maxWidth && line !== '') {
          y -= 18;
          page.drawText(line.trim(), { x: margin, y, size: 11, font });
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      if (line) {
        y -= 18;
        page.drawText(line.trim(), { x: margin, y, size: 11, font });
      }
      y -= 10;
    }

    function drawWrappedText(text: string, x: number, yStart: number, maxWidth: number, font: PDFFont, fontSize: number) {
      const words = text.split(' ');
      let line = '';
      let yPos = yStart;
      for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && line !== '') {
          page.drawText(line.trim(), { x, y: yPos, size: fontSize, font });
          yPos -= fontSize + 3;
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line.trim(), { x, y: yPos, size: fontSize, font });
        yPos -= fontSize + 3;
      }
      return yPos;
    }

    // === Form Sections ===

    // Title
    page.drawText("ARREST/CONVICTION REPORT AND CERTIFICATION FORM", {
      x: margin,
      y,
      size: 16,
      font: boldFont,
    });
    y -= lineHeight;
    page.drawText("(under Act 24 of 2011 and Act 82 of 2012)", {
      x: margin,
      y,
      size: 12,
      font,
    });

    // Section 1: Job Application Info
    drawHeading("Job Application Information");
    drawLabelValue("Full Name", jobAppFullName);
    y -= lineHeight * 0.7;
    drawLabelValue("Job Role", jobRole);
    y -= lineHeight * 0.7;
    drawLabelValue("Location", location);
    y -= lineHeight * 0.7;

    // Section 2: Personal Info
    drawHeading("Section 1. Personal Information");
    drawLabelValue("Full Legal Name", fullName);
    y -= lineHeight * 0.7;
    drawLabelValue("Date of Birth", `${dobDay}/${dobMonth}/${dobYear}`);
    y -= lineHeight * 0.7;
    // Draw the long label in two lines to avoid overlap
    y -= lineHeight;
    page.drawText("Other names by which you have been", { x: margin, y, size: 12, font: boldFont });
    y -= lineHeight - 4;
    page.drawText("identified:", { x: margin, y, size: 12, font: boldFont });
    page.drawText(otherNames || '', { x: margin + 120, y, size: 12, font });
    page.drawLine({ start: { x: margin + 120, y: y - 2 }, end: { x: width - margin, y: y - 2 }, thickness: 1, color: rgb(0, 0, 0) });
    y -= lineHeight * 0.7;

    // Section 3: Arrest or Conviction
    drawHeading("Section 2. Arrest or Conviction");
    y -= 16;
    // Checkboxes
    if (hasNotBeenArrestedOrConvicted) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    y = drawWrappedText(
      "By checking this box, I state that I have NOT been arrested for or convicted of any Reportable Offense.",
      margin + 18, y, width - margin * 2 - 18, font, 11
    ) + 3;
    y -= 24;
    if (hasBeenArrestedOrConvicted) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    y = drawWrappedText(
      'By checking this box, I report that I have been arrested for or convicted of an offense or offenses enumerated under 24 P.S. §§1-111(e) or (f. 1) ("Reportable Offense(s)"). See Page 3 of this Form for a list of Reportable Offenses.',
      margin + 18, y, width - margin * 2 - 18, font, 11
    ) + 3;
    y -= 24;
    drawParagraphHeading("Details of Arrests or Convictions");
    drawParagraph("For each arrest for or conviction of any Reportable Offense, specify in the space below (or on additional attachments if necessary) the offense for which you have been arrested or convicted, the date and location of arrest and/or conviction, docket number, and the applicable court.", margin, width - margin * 2);
    drawLabelValue("Detail 1", arrestDetail1);
    drawLabelValue("Detail 2", arrestDetail2);

    // Section 4: Child Abuse
    drawHeading("Section 3. Child Abuse");
    y -= 18;
    if (hasNotBeenPerpetratorChildAbuse) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    y = drawWrappedText(
      "By checking this box, I state that I have NOT been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.",
      margin + 18, y, width - margin * 2 - 18, font, 11
    ) + 3;
    y -= 24;
    if (hasBeenPerpetratorChildAbuse) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    y = drawWrappedText(
      "By checking this box, I report that I have been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.",
      margin + 18, y, width - margin * 2 - 18, font, 11
    ) + 3;
    y -= 24;

    // Section 5: Certification
    drawHeading("Section 4. Certification");
    drawParagraph(
      "By signing this form, I certify under penalty of law that the statements made in this form are true, correct and complete. I understand that false statements herein, including, without limitation, any failure to accurately report any arrest or conviction for a Reportable Offense, shall subject me to criminal prosecution under 18 Pa.C.S. §4904, relating to unsworn falsification to authorities.",
      margin,
      width - margin * 2
    );
    y -= 10;

    // Signature and Date section (stacked vertically)
    y -= 100; // Add even more space before signature
    // Signature label
    page.drawText("Signature", { x: margin, y, size: 14, font: boldFont });
    y -= 100; // Add much more vertical spacing between label and input
    // Signature input box (increase height)
    const sigBoxWidth = 400;
    const sigBoxHeight = 32;
    page.drawRectangle({
      x: margin,
      y: y,
      width: sigBoxWidth,
      height: sigBoxHeight,
      borderWidth: 2,
      borderColor: rgb(0, 0, 0),
      color: undefined
    });
    // Draw signature image inside the box, scaled to fit
    if (signature) {
      const sigImageBytes = Buffer.from(signature.split(",")[1], "base64");
      const sigImage = await pdfDoc.embedPng(sigImageBytes);
      // Always print the signature in a fixed, smaller size
      const fixedWidth = 120;
      const fixedHeight = 32;
      // Center the signature in the box
      const drawX = margin + (sigBoxWidth - fixedWidth) / 2;
      const drawY = y + (sigBoxHeight - fixedHeight) / 2;
      page.drawImage(sigImage, {
        x: drawX,
        y: drawY,
        width: fixedWidth,
        height: fixedHeight,
      });
    }
    y -= 120; // Much more space after signature
    // Date label (right side, but below signature)
    page.drawText("Date", { x: margin, y, size: 12, font: boldFont });
    y -= 35; // Increased vertical spacing before the box
    // Date input box
    page.drawRectangle({
      x: margin,
      y: y - 15,
      width: 120,
      height: 20,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });
    // Draw date text inside the box
    page.drawText(date || '', {
      x: margin + 5,
      y: y - 10,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 40;

    // Final Section: Instructions
    drawHeading("INSTRUCTIONS");
    drawParagraph(
      "Pursuant to 24 P.S. §1-111(c.4) and (j), the Pennsylvania Department of Education developed this standardized form (PDE-6004) to be used by current and prospective employees of public and private schools, intermediate units, and area vocational-technical schools.",
      margin,
      width - margin * 2
    );
    drawParagraph(
      "As required by subsection (c.4) and (j)(2) of 24 P.S. §1-111, this form shall be completed and submitted by all current and prospective employees of said institutions to provide written reporting of any arrest or conviction for an offense enumerated under 24 P.S. §1-111(e) or (f.1) and to provide notification of having been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.",
      margin,
      width - margin * 2
    );
    drawParagraph(
      "As required by subsection (j)(4) of 24 P.S. §1-111, this form also shall be utilized by current and prospective employees to provide written notice within seventy-two (72) hours after a subsequent arrest or conviction for an offense enumerated under 24 P.S. §§1-111(e) or (f.1).",
      margin,
      width - margin * 2
    );
    drawParagraph(
      "In accordance with 24 P.S. §1-111, employees completing this form are required to submit the form to the administrator or other person responsible for employment decisions in a school entity. Please contact a supervisor or the school entity administration office with any questions regarding the PDE 6004, including to whom the form should be sent.",
      margin,
      width - margin * 2
    );
    y -= 5;
    page.drawText("PROVIDE ALL INFORMATION REQUIRED BY THIS FORM LEGIBLY IN INK.", {
      x: margin,
      y,
      size: 13,
      font: boldFont,
    });
    y -= 10;
    page.drawText("PDE-6004 03/01/2016", {
      x: width - 150,
      y,
      size: 10,
      font,
    });

    // Generate and email PDF
    const pdfBytes = await pdfDoc.save();

    // --- Restore previous static credentials (for demonstration) ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:  'mailbatp@gmail.com',
        pass:'nkjt tzvm ctyp cgpn '
,
      },
    });
 
    await transporter.sendMail({
      from:  'mailbatp@gmail.com',
      to: 'vincentiaadams@batp.org',
      subject: 'Employment Form 02 (Arrest Conviction Form)',
      text: 'Please find the submitted PDE-6004 form attached.',
      attachments: [
        {
          filename: 'Employment Form 02 (Arrest Conviction and Certification Form)',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission failed", error);
    return NextResponse.json({ success: false, error: "Failed to generate PDF" }, { status: 500 });
  }
}
