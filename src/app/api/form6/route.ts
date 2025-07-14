import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Email configuration
const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver: 'mailbatp@gmail.com'
};

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  },
  logger: true,
  debug: true // Enables detailed logs in terminal
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      witness,
      name,
      signature,
      date,
      guardianName,
      guardianSignature,
      guardianDate
    } = body;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 1600]); // Further increased height for all text
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = 1540; // Start near the top for a 1600px tall page
    const drawText = (text: string, x: number, y: number, isBold: boolean = false, size: number = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };
    const drawParagraph = (text: string, x: number, y: number, width: number, size: number = 10, lineGap: number = 4) => {
      const words = text.split(' ');
      let line = '';
      let yy = y;
      for (let i = 0; i < words.length; i++) {
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
      if (line) page.drawText(line, { x, y: yy, size, font, color: rgb(0, 0, 0) });
      return yy - size - lineGap;
    };
    const drawLine = (x1, y1, x2, y2) => {
      page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 1, color: rgb(0, 0, 0) });
    };

    // --- Job Application Fields at the top ---
    // Black background heading
    page.drawRectangle({ x: 40, y: y - 30, width: 530, height: 30, color: rgb(0,0,0) });
    drawText("Job Application Information", 50, y - 12, true, 14);
    y -= 40;
    // Inputs in a grouped block
    drawText("Full Name:", 50, y, true, 10);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(0.9,0.95,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.jobAppFullName || '', 135, y, false, 10);
    y -= 22;
    drawText("Job Role:", 50, y, true, 10);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(0.9,0.95,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.jobRole || '', 135, y, false, 10);
    y -= 22;
    drawText("Location:", 50, y, true, 10);
    page.drawRectangle({ x: 130, y: y - 4, width: 180, height: 18, color: rgb(0.9,0.95,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(body.location || '', 135, y, false, 10);
    y -= 30;

    // Headings
    drawText('Appendix A', 260, y, true, 12); y -= 22;
    drawText('Disclosure Statement', 170, y, true, 18); y -= 22;
    drawText('Application for Employment, Including Provisional Employment', 60, y, true, 12); y -= 18;
    drawText('Required by the Child Protective Service Law', 120, y, false, 11); y -= 15;
    drawText('23 Pa. C.S. Section 6344 (relating to employees having contact with children; adoptive and foster parents)', 30, y, false, 9); y -= 20;

    // Legal/Instructional Paragraphs
    const paragraphs = [
      'I swear/affirm that, if providing certifications that have been obtained within the preceding 60 months, I have not been disqualified from employment as outlined below or have not been convicted of an offense similar in nature to a crime listed below under the laws or former laws of the United States or one of its territories or possessions, another state, the District of Columbia, the Commonwealth of Puerto Rico a foreign nation, or under a former law of this Commonwealth.',
      'I swear/affirm that I have not been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.',
      'I swear/affirm that I have not been convicted of any of the following crimes under Title 18 of the Pennsylvania consolidated statutes or equivalent crime under the laws or former laws of the United States or one of its territories or possessions, another state, the District of Columbia, the Commonwealth of Puerto Rico or a foreign nation, or under a former law of this Commonwealth.'
    ];
    for (const p of paragraphs) {
      y = drawParagraph(p, 30, y, 550, 9, 2);
      y -= 8;
    }
    // Crime list 1
    const crimes1 = [
      'Chapter 25 (relating to criminal homicide)',
      'Section 2702 (relating to aggravated assault)',
      'Section 2709.1 (relating to stalking)',
      'Section 2901 (relating to kidnapping)',
      'Section 2902 (relating to unlawful restraint)',
      'Section 3121 (relating to rape)',
      'Section 3122.1 (relating to statutory sexual assault)',
      'Section 3123 (relating to involuntary deviate sexual intercourse)',
      'Section 3124.1 (relating to sexual assault)',
      'Section 3125 (relating to aggravated indecent assault)',
      'Section 3126 (relating to indecent assault)',
      'Section 3127 (relating to indecent exposure)',
      'Section 4302 (relating to incest)',
      'Section 4303 (relating to concealing death of child)',
      'Section 4304 (relating to endangering welfare of children)',
      'Section 4305 (relating to dealing in infant children)',
      'Section 5902(b) (relating to prostitution and related offenses)',
      'Section 5903(c) (d) (relating to obscene and other sexual material and performances)',
      'Section 6301 (relating to corruption of minors)',
      'Section 6312 (relating to sexual abuse of children), or an equivalent crime under Federal law or the law of another state.'
    ];
    for (const c of crimes1) {
      drawText(c, 40, y, false, 8); y -= 12;
    }
    y -= 8;
    y = drawParagraph('In addition to the crimes already outlined above, if I am an individual being employed in a child care center, group child care home, or family child care home, I swear/affirm that I have not been convicted of any of the following crimes g crimes under Title 18 of the Pennsylvania consolidated statutes or equivalent crime under the laws or former laws of the United States or one of its territories or possessions, another state, the District of Columbia, the Commonwealth of Puerto Rico or a foreign nation, or under a former law of this Commonwealth.', 30, y, 550, 9, 2);
    y -= 8;
    // Crime list 2
    const crimes2 = [
      'Section 2718 (relating to strangulation)',
      'Section 3301 (relating to arson and related offenses)',
      '18 U.S.C. Section 2261 (relating to interstate domestic violence)',
      '18 U.S.C. Section 2262 (relating to interstate violation of protection order)'
    ];
    for (const c of crimes2) {
      drawText(c, 40, y, false, 8); y -= 12;
    }
    y -= 8;
    // More paragraphs
    const moreParagraphs = [
      'I swear/affirm that I have not been convicted of a felony offense under Act 64-1972 (relating to the controlled substance, drug device and cosmetic act) committed within the past five years.',
      'I understand that I must be dismissed from employment if I am named as a perpetrator of a founded report of child abuse within the past five (5) years or have been convicted of any of the crimes listed above.',
      'I understand that if I am arrested for or convicted of an offense that would constitute grounds for denying employment or participation in a program, activity or service under the Child Protective Services Law as listed above, or am named as perpetrator in a founded or indicated report, I must provide the administrator or designee with written notice not later than 72 hours after the arrest, conviction or notification that I have been listed as a perpetrator in the Statewide databuse.',
      'I understand that if the person responsible for employment decisions or the administrator of a program, activity or service has a reasonable belief that I was arrested or convicted for an offense that would constitute grounds for denying employment or participation in a program, activity or service under the Child Protective Services Law, or was named as perpetrator in a founded or indicated report, or I have provided notice as required under this section, the person responsible for employment decisions or administrator of a program, activity or service shall immediately require me to submit current certifications obtained through the Department of Human Services, the Pennsylvania State Police, and the Federal Bureau of Investigation. The cost of certifications shall be bome by the employing entity or program, activity or service.',
      'I understand that if I willfully fail to disclose information required above, I commit a misdemeanor of the third degree and shall be subject to discipline up to and including termination or denial of employment.',
      'I understand that certifications obtained for employment purposes may be used to apply for employment, serve as an employee, apply to volunteer and serve as a volunteer.',
      'I understand that the person responsible for employment decisions or the administrator of a program, activity or service is required to maintain a copy of my certifications,',
      'I hereby swear/affirm that the information as set forth above is true and correct. I understand that false swearing is a misdemeanor pursuant to Section 4903 of the Crimes Code.'
    ];
    for (const p of moreParagraphs) {
      y = drawParagraph(p, 30, y, 550, 9, 2);
      y -= 8;
    }
    // --- Witness and Applicant Section ---
    y -= 10;
    // Witness row
    drawText('Witness:', 50, y, true, 10);
    drawLine(120, y - 2, 300, y - 2);
    drawText(witness || '', 125, y + 2, false, 10);
    // Signature row
    drawText('Signature:', 320, y, true, 10);
    drawLine(400, y - 2, 540, y - 2);
    if (body.witnessSignature) {
      try {
        const witnessSigImg = await pdfDoc.embedPng(body.witnessSignature.split(',')[1]);
        page.drawImage(witnessSigImg, { x: 405, y: y - 2, width: 120, height: 32 });
      } catch { /* ignore */ }
    }
    y -= 40;
    // Name row
    drawText('Name:', 50, y, true, 10);
    drawLine(120, y - 2, 300, y - 2);
    drawText(name || '', 125, y + 2, false, 10);
    // Signature row
    drawText('Signature:', 320, y, true, 10);
    drawLine(400, y - 2, 540, y - 2);
    if (signature) {
      try {
        const sigImg = await pdfDoc.embedPng(signature.split(',')[1]);
        page.drawImage(sigImg, { x: 405, y: y - 2, width: 120, height: 32 });
      } catch { /* ignore */ }
    }
    y -= 40;
    // Date row
    drawText('Date:', 50, y, true, 10);
    drawLine(120, y - 2, 300, y - 2);
    drawText(date || '', 125, y + 2, false, 10);
    y -= 40;
    // --- Guardian Section ---
    drawText('If the employee is a minor:', 50, y, true, 10); y -= 22;
    // Guardian Name row
    drawText('Parent/Legal Guardian Name:', 50, y, true, 10);
    page.drawRectangle({ x: 220, y: y - 4, width: 250, height: 18, color: rgb(0.9,0.95,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(guardianName || '', 225, y, false, 10);
    y -= 28;
    y -= 20; // Add extra vertical space before signature box
    // Guardian Signature row (on its own line)
    drawText('Signature:', 50, y, true, 10);
    page.drawRectangle({ x: 150, y: y - 4, width: 180, height: 32, color: rgb(0.9,0.95,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    if (guardianSignature) {
      try {
        const guardianSigImg = await pdfDoc.embedPng(guardianSignature.split(',')[1]);
        page.drawImage(guardianSigImg, { x: 155, y: y - 2, width: 170, height: 28 });
      } catch { /* ignore */ }
    } else {
      // Show 'Clear Signature' label in red if no signature
      page.drawText('Clear Signature', { x: 155, y: y + 8, size: 10, font: boldFont, color: rgb(1,0,0) });
    }
    y -= 74; // Increased vertical space to prevent overlap
    // Guardian Date row (on its own line)
    drawText('Date:', 50, y, true, 10);
    page.drawRectangle({ x: 150, y: y - 4, width: 100, height: 18, color: rgb(0.9,0.95,1), borderWidth: 1, borderColor: rgb(0,0,0) });
    drawText(guardianDate || '', 155, y, false, 10);
    y -= 28;
    // --- End PDF Generation ---

    const pdfBytes = await pdfDoc.save();

    // Email options
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: ' Employment Form 07 (Disclosure-Statement.pdf)',
      text: `Disclosure Statement submitted by ${name}.`,
      attachments: [
        {
          filename: ' Employment Form 07 (Disclosure-Statement.pdf)',
          content: Buffer.from(pdfBytes),
        },
      ],
    };

    // Send email
    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.response);

      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully. Email with PDF sent.',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Server error:', error);
    return NextResponse.json(
      { error: 'Server error while sending email' },
      { status: 500 }
    );
  }
}

