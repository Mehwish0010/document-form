import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 page
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
    drawLabelValue("Job Role", jobRole);
    drawLabelValue("Location", location);

    // Section 2: Personal Info
    drawHeading("Section 1. Personal Information");
    drawLabelValue("Full Legal Name", fullName);
    drawLabelValue("Date of Birth", `${dobDay}/${dobMonth}/${dobYear}`);
    drawLabelValue("Other names by which you have been identified", otherNames);

    // Section 3: Arrest or Conviction
    drawHeading("Section 2. Arrest or Conviction");
    y -= 10;
    // Checkboxes
    if (hasNotBeenArrestedOrConvicted) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    page.drawText("By checking this box, I state that I have NOT been arrested for or convicted of any Reportable Offense.", { x: margin + 18, y, size: 11, font });
    y -= 18;
    if (hasBeenArrestedOrConvicted) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    page.drawText("By checking this box, I report that I have been arrested for or convicted of an offense or offenses enumerated under 24 P.S. §§1-111(e) or (f. 1) (\"Reportable Offense(s)\"). See Page 3 of this Form for a list of Reportable Offenses.", { x: margin + 18, y, size: 11, font });
    y -= 24;
    drawParagraphHeading("Details of Arrests or Convictions");
    drawParagraph("For each arrest for or conviction of any Reportable Offense, specify in the space below (or on additional attachments if necessary) the offense for which you have been arrested or convicted, the date and location of arrest and/or conviction, docket number, and the applicable court.", margin, width - margin * 2);
    drawLabelValue("Detail 1", arrestDetail1);
    drawLabelValue("Detail 2", arrestDetail2);

    // Section 4: Child Abuse
    drawHeading("Section 3. Child Abuse");
    y -= 10;
    if (hasNotBeenPerpetratorChildAbuse) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    page.drawText("By checking this box, I state that I have NOT been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.", { x: margin + 18, y, size: 11, font });
    y -= 18;
    if (hasBeenPerpetratorChildAbuse) {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
      page.drawLine({ start: { x: margin+2, y: y+2 }, end: { x: margin+10, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
      page.drawLine({ start: { x: margin+10, y: y+2 }, end: { x: margin+2, y: y+10 }, thickness: 2, color: rgb(0,0,0) });
    } else {
      page.drawRectangle({ x: margin, y: y, width: 12, height: 12, borderColor: rgb(0,0,0), borderWidth: 1 });
    }
    page.drawText("By checking this box, I report that I have been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.", { x: margin + 18, y, size: 11, font });

    // Section 5: Certification
    drawHeading("Section 4. Certification");
    drawParagraph(
      "By signing this form, I certify under penalty of law that the statements made in this form are true, correct and complete. I understand that false statements herein, including, without limitation, any failure to accurately report any arrest or conviction for a Reportable Offense, shall subject me to criminal prosecution under 18 Pa.C.S. §4904, relating to unsworn falsification to authorities.",
      margin,
      width - margin * 2
    );
    y -= 10;

    // Signature and Date lines (side by side, with underlines and labels)
    const sigLineY = y - 40;
    const sigLineWidth = 200;
    const dateLineWidth = 120;
    const sigX = margin;
    const dateX = width - margin - dateLineWidth;

    // Draw signature line
    page.drawLine({
      start: { x: sigX, y: sigLineY },
      end: { x: sigX + sigLineWidth, y: sigLineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    // Draw date line
    page.drawLine({
      start: { x: dateX, y: sigLineY },
      end: { x: dateX + dateLineWidth, y: sigLineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Draw signature image above the signature line
    if (signature) {
      const sigImageBytes = Buffer.from(signature.split(",")[1], "base64");
      const sigImage = await pdfDoc.embedPng(sigImageBytes);
      const sigDims = sigImage.scale(0.4);
      page.drawImage(sigImage, {
        x: sigX,
        y: sigLineY + 5,
        width: sigDims.width,
        height: sigDims.height,
      });
    }
    // Draw date text above the date line
    page.drawText(date || '', {
      x: dateX + 10,
      y: sigLineY + 10,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // Draw labels below the lines
    page.drawText("Signature", {
      x: sigX,
      y: sigLineY - 16,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Date", {
      x: dateX,
      y: sigLineY - 16,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    y = sigLineY - 40;

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
        user: 'mailbatp@gmail.com',
        pass: 'nkjt tzvm ctyp cgpn',
      },
    });

    await transporter.sendMail({
      from: 'mailbatp@gmail.com',
      to: 'mailbatp@gmail.com',
      subject: 'Submitted PDE-6004 Form',
      text: 'Please find the submitted PDE-6004 form attached.',
      attachments: [
        {
          filename: 'PDE-6004.pdf',
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
