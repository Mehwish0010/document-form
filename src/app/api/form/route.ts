import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      jobRole,
      location,
      fullNameForm,
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
    const page = pdfDoc.addPage([612, 792]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text: string, x: number, y: number, isBold: boolean = false) => {
      page.drawText(text, {
        x,
        y,
        size: 12,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    // Job Application Info Section
    let y = 770;
    drawText("Job Application Information", 50, y, true); y -= 20;
    drawText(`Full Name: ${fullName || ''}`, 50, y); y -= 20;
    drawText(`Job Role: ${jobRole || ''}`, 50, y); y -= 20;
    drawText(`Location: ${location || ''}`, 50, y); y -= 30;

    // Title
    drawText("ARREST/CONVICTION REPORT AND CERTIFICATION FORM", 50, y, true); y -= 20;
    drawText("(under Act 24 of 2011 and Act 82 of 2012)", 50, y, true); y -= 40;

    // Section 1: Personal Information
    drawText("Section 1. Personal Information", 50, y, true); y -= 20;
    drawText(`Full Legal Name: ${fullNameForm}`, 50, y); y -= 20;
    drawText(`Date of Birth: ${dobDay}/${dobMonth}/${dobYear}`, 50, y); y -= 20;
    drawText(`Other names by which you have been identified: ${otherNames}`, 50, y); y -= 40;

    // Section 2: Arrest or Conviction
    drawText("Section 2. Arrest or Conviction", 50, y, true); y -= 20;
    drawText(`Has NOT been arrested: ${hasNotBeenArrestedOrConvicted ? "Yes" : "No"}`, 50, y); y -= 20;
    drawText(`Has been arrested: ${hasBeenArrestedOrConvicted ? "Yes" : "No"}`, 50, y); y -= 20;
    if (hasBeenArrestedOrConvicted) {
      drawText("Details of Arrests or Convictions:", 50, y, true); y -= 20;
      drawText(`1. ${arrestDetail1}`, 70, y); y -= 20;
      drawText(`2. ${arrestDetail2}`, 70, y); y -= 20;
    } else {
      y -= 40;
    }

    // Section 3: Child Abuse
    drawText("Section 3. Child Abuse", 50, y, true); y -= 20;
    drawText(`Has NOT been perpetrator of child abuse: ${hasNotBeenPerpetratorChildAbuse ? "Yes" : "No"}`, 50, y); y -= 20;
    drawText(`Has been perpetrator of child abuse: ${hasBeenPerpetratorChildAbuse ? "Yes" : "No"}`, 50, y); y -= 40;

    // Section 4: Certification
    drawText("Section 4. Certification", 50, y, true); y -= 20;
    drawText("By signing this form, I certify under penalty of law that the statements made in this form are true, correct and complete.", 50, y); y -= 20;
    drawText("I understand that false statements herein shall subject me to criminal prosecution under 18 Pa.C.S. §4904.", 50, y); y -= 40;

    // Signature and Date
    drawText("Signature:", 50, y); y -= 60;
    if (signature) {
      try {
        const signatureImage = await pdfDoc.embedPng(signature.split(',')[1]);
        page.drawImage(signatureImage, {
          x: 50,
          y: y,
          width: 200,
          height: 50,
        });
      } catch (error) {
        console.error('Error embedding signature:', error);
      }
    }
    y -= 60;
    drawText(`Date: ${date}`, 50, y);

    // Footer
    drawText("PDE-6004 03/01/2016", 450, 50);

    const pdfBytes = await pdfDoc.save();

    // Email configuration
    const emailConfig = {
      user: 'mehwishsheikh0010sheikh@gmail.com',
      pass: 'nliszqmkmnondaak ',
      receiver: 'mehwishsheikh0010sheikh@gmail.com'
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });

    await transporter.sendMail({
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: "PDE-6004 Form Submission",
      text: `Form submitted by ${fullName} (${jobRole}, ${location}).\n\nSubmission Details:\nFull Name: ${fullNameForm}\nDate of Birth: ${dobDay}/${dobMonth}/${dobYear}\nSubmission Date: ${date}`,
      attachments: [
        {
          filename: "PDE-6004-Form.pdf",
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
}



