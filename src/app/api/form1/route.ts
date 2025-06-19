import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, signature, date, print } = body;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 400]);
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
    drawText("CONFIDENTIALITY AGREEMENT", 50, 360, true);
    drawText("Behavior Analysis & Therapy Partners", 50, 340);

    // Fields
    drawText(`Name: ${name}`, 50, 300);
    drawText(`Date: ${date}`, 50, 280);
    drawText(`Print Name: ${print}`, 50, 260);

    // Signature
    drawText("Signature:", 50, 220);
    if (signature) {
      try {
        const signatureImage = await pdfDoc.embedPng(signature.split(',')[1]);
        page.drawImage(signatureImage, {
          x: 120,
          y: 190,
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
      pass: 'flbw wrtr rwgo grlu',
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
      text: `Form submitted by ${name}.\n\nSubmission Details:\nName: ${name}\nDate: ${date}\nPrint Name: ${print}`,
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
