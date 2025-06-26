import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, signature, date, print, fullName, jobRole, location } = body;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 500]);
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

    // Title
    drawText("CONFIDENTIALITY AGREEMENT", 50, 460, true);
    drawText("Behavior Analysis & Therapy Partners", 50, 440);

    // Job Application Information
    drawText("Job Application Information:", 50, 400, true);
    drawText(`Full Name: ${fullName}`, 50, 380);
    drawText(`Job Role: ${jobRole}`, 50, 360);
    drawText(`Location: ${location}`, 50, 340);

    // Form Fields
    drawText("Form Information:", 50, 300, true);
    drawText(`Name: ${name}`, 50, 280);
    drawText(`Date: ${date}`, 50, 260);
    drawText(`Print Name: ${print}`, 50, 240);

    // Signature
    drawText("Signature:", 50, 200);
    if (signature) {
      try {
        const signatureImage = await pdfDoc.embedPng(signature.split(',')[1]);
        page.drawImage(signatureImage, {
          x: 120,
          y: 170,
          width: 200,
          height: 50,
        });
      } catch (error) {
        console.error('Error embedding signature:', error);
      }
    }

    // Footer
    drawText("BATP Confidentiality Agreement", 50, 50);

    const pdfBytes = await pdfDoc.save();

    // Email configuration
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

    await transporter.sendMail({
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: "Confidentiality Agreement Submission",
      text: `Form submitted by ${name}.\n\nJob Application Information:\nFull Name: ${fullName}\nJob Role: ${jobRole}\nLocation: ${location}\n\nForm Details:\nName: ${name}\nDate: ${date}\nPrint Name: ${print}`,
      attachments: [
        {
          filename: "Confidentiality-Agreement.pdf",
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
