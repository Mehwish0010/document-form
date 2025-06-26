import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';

// Define the form data type
interface FormData {
  firstName: string;
  lastName: string;
  middleInitial: string;
  date: string;
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  driversLicense: string;
  licenseState: string;
  licenseExp: string;
  dateAvailable: string;
  socialSecurity: string;
  positionApplied: string;
  isCitizen: string;
  isAuthorized: string;
  previousEmployment: string;
  previousEmploymentDate: string;
  felonyConviction: string;
  felonyExplanation: string;
  canMeetAttendance: string;
  highSchoolAddress: string;
  highSchoolFrom: string;
  highSchoolTo: string;
  highSchoolGraduate: string;
  highSchoolDiploma: string;
  collegeAddress: string;
  collegeFrom: string;
  collegeTo: string;
  collegeGraduate: string;
  collegeDegree: string;
  signature: string;
  signatureDate: string;
  fullName?: string;
  jobRole?: string;
  location?: string;
}

const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'nliszqmkmnondaak  ',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

async function generateApplicationPDF(formData: FormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 1800]); // Increased page height to fit everything
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const headerGray = rgb(75 / 255, 85 / 255, 99 / 255);
  const lightBlue = rgb(219 / 255, 234 / 255, 254 / 255);

  // Equal padding on all sides
  const padding = 50;
  const contentWidth = width - (padding * 2);
  let y = page.getHeight() - padding;

  const drawText = (text: string, x: number, yPos: number, fontToUse: PDFFont, size: number, color = black) => {
    page.drawText(text, { x, y: yPos, font: fontToUse, size, color, lineHeight: size + 4 });
  };

  const drawInputBox = (x: number, yPos: number, width: number, height: number, hasValue: boolean) => {
    page.drawRectangle({
      x, y: yPos, width, height,
      color: hasValue ? lightBlue : white,
      borderWidth: 1, borderColor: black,
    });
  };

  const drawHeader = (text: string): number => {
    y -= 30;
    page.drawRectangle({ x: padding, y: y, width: contentWidth, height: 25, color: headerGray });
    drawText(text, padding + 10, y + 8, fontBold, 14, white);
    y -= 20;
    return y;
  };

  const drawCheckbox = (x: number, yPos: number, checked: boolean) => {
    page.drawRectangle({ x, y: yPos, width: 12, height: 12, borderWidth: 1, borderColor: black });
    if (checked) {
      page.drawText('X', { x: x + 2, y: yPos + 1, size: 10, font: fontBold });
    }
  };

  // Print job application fields at the top if present
  if (formData.fullName || formData.jobRole || formData.location) {
    drawText("Job Application Information", padding, y, fontBold, 14, black); y -= 20;
    if (formData.fullName) {
      drawText(`Full Name: ${formData.fullName}`, padding, y, font, 12, black); y -= 18;
    }
    if (formData.jobRole) {
      drawText(`Job Role: ${formData.jobRole}`, padding, y, font, 12, black); y -= 18;
    }
    if (formData.location) {
      drawText(`Location: ${formData.location}`, padding, y, font, 12, black); y -= 18;
    }
    y -= 10;
  }

  // Company Header - Same as UI
  drawText("Behavior Analysis & Therapy Partners", padding + 100, y, fontBold, 16); y -= 20;
  drawText("139 Montgomery Ave., Suite 110", padding + 150, y, font, 10); y -= 15;
  drawText("Bala Cynwyd, PA 19004", padding + 170, y, font, 10); y -= 15;
  drawText("Phone: 610-664-6200, -6201", padding + 160, y, font, 10); y -= 15;
  drawText("Fax: 610-664-6202", padding + 185, y, font, 10); y -= 30;

  // Title - Employment Application
  drawText("Employment Application", padding + 150, y, fontBold, 22); y -= 10;
  page.drawLine({ start: { x: padding, y }, end: { x: width - padding, y }, thickness: 2 }); y -= 20;
  drawText("Please print", padding + 220, y, font, 10); y -= 30;

  // Equal Access Statement
  const equalAccessText = "Equal access to programs, services, and employment is available to all persons. Those applicants requiring reasonable access to accommodations for the application and/or interview process should notify a representative of the Human Resources Department.";
  page.drawText(equalAccessText, { x: padding, y, size: 9, font, maxWidth: contentWidth, lineHeight: 12 });
  y -= 60;

  // Applicant Information Section
  y = drawHeader("Applicant Information"); y -= 10;

  // Full Name and Date row
  drawText("Full Name:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 200, 20, !!formData.lastName);
  drawText(formData.lastName || "Last", padding + 75, y - 10, font, 10);
  drawInputBox(padding + 280, y - 15, 100, 20, !!formData.firstName);
  drawText(formData.firstName || "First", padding + 285, y - 10, font, 10);
  drawInputBox(padding + 390, y - 15, 50, 20, !!formData.middleInitial);
  drawText(formData.middleInitial || "M.I.", padding + 395, y - 10, font, 10);
  drawText("Date:", padding + 450, y, font, 10);
  drawInputBox(padding + 480, y - 15, 80, 20, !!formData.date);
  drawText(formData.date || "MM/DD/YYYY", padding + 485, y - 10, font, 10);
  y -= 35;

  // Address row
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 300, 20, !!formData.streetAddress);
  drawText(formData.streetAddress || "Street Address", padding + 75, y - 10, font, 10);
  drawText("Apt/Unit:", padding + 380, y, font, 10);
  drawInputBox(padding + 440, y - 15, 120, 20, !!formData.apartmentUnit);
  drawText(formData.apartmentUnit || "Apt/Unit #", padding + 445, y - 10, font, 10);
  y -= 35;

  // City, State, ZIP row
  drawInputBox(padding + 70, y - 15, 150, 20, !!formData.city);
  drawText(formData.city || "City", padding + 75, y - 10, font, 10);
  drawInputBox(padding + 230, y - 15, 80, 20, !!formData.state);
  drawText(formData.state || "State", padding + 235, y - 10, font, 10);
  drawInputBox(padding + 320, y - 15, 100, 20, !!formData.zipCode);
  drawText(formData.zipCode || "ZIP Code", padding + 325, y - 10, font, 10);
  y -= 35;

  // Phone and Email row
  drawText("Phone:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 200, 20, !!formData.phone);
  drawText(formData.phone || "Phone Number", padding + 75, y - 10, font, 10);
  drawText("Email:", padding + 280, y, font, 10);
  drawInputBox(padding + 330, y - 15, 230, 20, !!formData.email);
  drawText(formData.email || "Email Address", padding + 335, y - 10, font, 10);
  y -= 35;

  // Driver's License row
  drawText("Driver's License:", padding, y, font, 10);
  drawInputBox(padding + 100, y - 15, 150, 20, !!formData.driversLicense);
  drawText(formData.driversLicense || "License Number", padding + 105, y - 10, font, 10);
  drawText("State:", padding + 260, y, font, 10);
  drawInputBox(padding + 300, y - 15, 60, 20, !!formData.licenseState);
  drawText(formData.licenseState || "State", padding + 305, y - 10, font, 10);
  drawText("Exp:", padding + 370, y, font, 10);
  drawInputBox(padding + 400, y - 15, 80, 20, !!formData.licenseExp);
  drawText(formData.licenseExp || "MM/DD/YYYY", padding + 405, y - 10, font, 10);
  y -= 35;

  // Driving notice
  drawText("DRIVING IS AN ESSENTIAL JOB FUNCTION", padding, y, fontBold, 10);
  y -= 25;

  // Date Available and SSN row
  drawText("Date Available:", padding, y, font, 10);
  drawInputBox(padding + 100, y - 15, 120, 20, !!formData.dateAvailable);
  drawText(formData.dateAvailable || "MM/DD/YYYY", padding + 105, y - 10, font, 10);
  drawText("Social Security No.:", padding + 230, y, font, 10);
  drawInputBox(padding + 350, y - 15, 150, 20, !!formData.socialSecurity);
  drawText(formData.socialSecurity || "SSN", padding + 355, y - 10, font, 10);
  y -= 35;

  // Position Applied row
  drawText("Position Applied for:", padding, y, font, 10);
  drawInputBox(padding + 130, y - 15, 400, 20, !!formData.positionApplied);
  drawText(formData.positionApplied || "Position", padding + 135, y - 10, font, 10);
  y -= 35;

  // Citizenship questions
  drawText("Are you a citizen of the United States?", padding, y, font, 10);
  drawCheckbox(padding + 270, y, formData.isCitizen === 'YES'); drawText("YES", padding + 285, y, font, 10);
  drawCheckbox(padding + 320, y, formData.isCitizen === 'NO'); drawText("NO", padding + 335, y, font, 10);
  y -= 25;

  drawText("If no, are you authorized to work in the U.S.?", padding, y, font, 10);
  drawCheckbox(padding + 270, y, formData.isAuthorized === 'YES'); drawText("YES", padding + 285, y, font, 10);
  drawCheckbox(padding + 320, y, formData.isAuthorized === 'NO'); drawText("NO", padding + 335, y, font, 10);
  y -= 30;

  // Previous Employment Section
  y = drawHeader("Previous Employment");
  drawText("Have you ever been employed by this company?", padding, y, font, 10);
  drawCheckbox(padding + 300, y, formData.previousEmployment === 'YES'); drawText("YES", padding + 315, y, font, 10);
  drawCheckbox(padding + 350, y, formData.previousEmployment === 'NO'); drawText("NO", padding + 365, y, font, 10);
  if (formData.previousEmployment === 'YES') {
    y -= 25;
    drawText("If yes, when?", padding, y, font, 10);
    drawInputBox(padding + 80, y - 15, 100, 20, !!formData.previousEmploymentDate);
    drawText(formData.previousEmploymentDate || "MM/DD/YYYY", padding + 85, y - 10, font, 10);
  }
  y -= 30;

  // Felony Conviction Section
  y = drawHeader("Felony Conviction");
  drawText("Have you ever been convicted of a felony?", padding, y, font, 10);
  drawCheckbox(padding + 300, y, formData.felonyConviction === 'YES'); drawText("YES", padding + 315, y, font, 10);
  drawCheckbox(padding + 350, y, formData.felonyConviction === 'NO'); drawText("NO", padding + 365, y, font, 10);
  if (formData.felonyConviction === 'YES') {
    y -= 25;
    drawText("If yes, explain:", padding, y, font, 10);
    drawInputBox(padding + 80, y - 15, 450, 40, !!formData.felonyExplanation);
    page.drawText(formData.felonyExplanation || "Explanation", { x: padding + 85, y: y - 10, size: 10, font, maxWidth: 440, lineHeight: 12 });
    y -= 50;
  }
  y -= 30;

  // Attendance Section
  y = drawHeader("Attendance");
  drawText("Can you meet the attendance requirements?", padding, y, font, 10);
  drawCheckbox(padding + 300, y, formData.canMeetAttendance === 'YES'); drawText("YES", padding + 315, y, font, 10);
  drawCheckbox(padding + 350, y, formData.canMeetAttendance === 'NO'); drawText("NO", padding + 365, y, font, 10);
  y -= 30;

  // Education Section
  y = drawHeader("Education");
  drawText("High School", padding, y, fontBold, 12); y -= 20;
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 450, 20, !!formData.highSchoolAddress);
  drawText(formData.highSchoolAddress || "School Address", padding + 75, y - 10, font, 10);
  y -= 30;
  drawText("From:", padding, y, font, 10);
  drawInputBox(padding + 40, y - 15, 100, 20, !!formData.highSchoolFrom);
  drawText(formData.highSchoolFrom || "MM/DD/YYYY", padding + 45, y - 10, font, 10);
  drawText("To:", padding + 150, y, font, 10);
  drawInputBox(padding + 170, y - 15, 100, 20, !!formData.highSchoolTo);
  drawText(formData.highSchoolTo || "MM/DD/YYYY", padding + 175, y - 10, font, 10);
  y -= 30;
  drawText("Did you graduate?", padding, y, font, 10);
  drawCheckbox(padding + 100, y, formData.highSchoolGraduate === 'YES'); drawText("YES", padding + 115, y, font, 10);
  drawCheckbox(padding + 150, y, formData.highSchoolGraduate === 'NO'); drawText("NO", padding + 165, y, font, 10);
  if (formData.highSchoolGraduate === 'YES') {
    drawText("Diploma:", padding + 200, y, font, 10);
    drawInputBox(padding + 260, y - 15, 200, 20, !!formData.highSchoolDiploma);
    drawText(formData.highSchoolDiploma || "Diploma Type", padding + 265, y - 10, font, 10);
  }
  y -= 35;

  drawText("College", padding, y, fontBold, 12); y -= 20;
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 450, 20, !!formData.collegeAddress);
  drawText(formData.collegeAddress || "College Address", padding + 75, y - 10, font, 10);
  y -= 30;
  drawText("From:", padding, y, font, 10);
  drawInputBox(padding + 40, y - 15, 100, 20, !!formData.collegeFrom);
  drawText(formData.collegeFrom || "MM/DD/YYYY", padding + 45, y - 10, font, 10);
  drawText("To:", padding + 150, y, font, 10);
  drawInputBox(padding + 170, y - 15, 100, 20, !!formData.collegeTo);
  drawText(formData.collegeTo || "MM/DD/YYYY", padding + 175, y - 10, font, 10);
  y -= 30;
  drawText("Did you graduate?", padding, y, font, 10);
  drawCheckbox(padding + 100, y, formData.collegeGraduate === 'YES'); drawText("YES", padding + 115, y, font, 10);
  drawCheckbox(padding + 150, y, formData.collegeGraduate === 'NO'); drawText("NO", padding + 165, y, font, 10);
  if (formData.collegeGraduate === 'YES') {
    drawText("Degree:", padding + 200, y, font, 10);
    drawInputBox(padding + 260, y - 15, 200, 20, !!formData.collegeDegree);
    drawText(formData.collegeDegree || "Degree Type", padding + 265, y - 10, font, 10);
  }
  y -= 50;

  // Disclaimer Section
  y = drawHeader("Disclaimer and Signature");
  const disclaimer = [
    "I UNDERSTAND THAT, IF I AM EMPLOYED, ANY MISREPRESENTATION OR MATERIAL OMISSION MADE BY ME ON THIS APPLICATION WILL BE SUFFICIENT CAUSE FOR CANCELLATION OF THIS APPLICATION OR IMMEDIATE DISCHARGE FROM THE EMPLOYER'S SERVICE, WHENEVER IT IS DISCOVERED.",
    "I GIVE THE EMPLOYER THE RIGHT TO CONTACT AND OBTAIN INFORMATION FROM ALL REFERENCES, EMPLOYERS, AND EDUCATIONAL INSTITUTIONS AND TO OTHERWISE VERIFY THE ACCURACY OF THE INFORMATION CONTAINED IN THIS APPLICATION. I HEREBY RELEASE FROM LIABILITY THE EMPLOYER AND ITS REPRESENTATIVES FOR SEEKING, GATHERING, AND USING SUCH INFORMATION AND ALL OTHER PERSONS, CORPORATIONS, OR ORGANIZATIONS FOR FURNISHING SUCH INFORMATION.",
    "THE EMPLOYER DOES NOT UNLAWFULLY DISCRIMINATE IN EMPLOYMENT AND NO QUESTION ON THE APPLICATION IS USED FOR THE PURPOSE OF LIMITING OR EXCLUDING ANY APPLICANT FROM CONSIDERATION FOR EMPLOYMENT ON A BASIS PROHIBITED BY LOCAL, STATE, OR FEDERAL LAW.",
    "THIS APPLICATION IS CURRENT FOR ONLY 60 DAYS. AT THE CONCLUSION OF THIS TIME, IF I HAVE NOT HEARD FROM THE EMPLOYER AND STILL WISH TO BE CONSIDERED FOR EMPLOYMENT, IT WILL BE NECESSARY TO FILL OUT A NEW APPLICATION.",
    "IF I AM HIRED, I UNDERSTAND THAT I AM FREE TO RESIGN AT ANY TIME, WITH OR WITHOUT CAUSE AND WITHOUT PRIOR NOTICE, AND THE EMPLOYER RESERVES THE SAME RIGHT TO TERMINATE MY EMPLOYMENT AT ANY TIME, WITH OR WITHOUT CAUSE AND WITHOUT PRIOR NOTICE, EXCEPT AS MAY BE REQUIRED BY LAW. THIS APPLICATION DOES NOT CONSTITUTE AN AGREEMENT OR CONTRACT FOR EMPLOYMENT FOR ANY SPECIFIED PERIOD OR DEFINITE DURATION. I UNDERSTAND THAT NO REPRESENTATIVE OF THE EMPLOYER, OTHER THAN AN AUTHORIZED OFFICER, HAS THE AUTHORITY TO MAKE ANY ASSURANCES TO THE CONTRARY. I FURTHER UNDERSTAND THAT ANY SUCH ASSURANCES MUST BE IN WRITING AND SIGNED BY AN AUTHORIZED OFFICER.",
    "I UNDERSTAND IT IS THE COMPANY'S POLICY NOT TO REFUSE TO HIRE A QUALIFIED INDIVIDUAL WITH A DISABILITY BECAUSE OF THAT PERSON'S NEED FOR REASONABLE ACCOMMODATION AS REQUIRED BY THE ADA.",
    "I ALSO UNDERSTAND THAT, IF I AM HIRED, I WILL BE REQUIRED TO PROVIDE PROOF OF IDENTITY AND LEGAL WORK AUTHORIZATION.",
    "I represent and warrant that I have read and fully understand the foregoing and seek employment under these conditions."
  ].join('\n\n');

  page.drawText(disclaimer, { x: padding, y, size: 8, font, maxWidth: contentWidth, lineHeight: 11 });
  y -= 350;

  // Signature and Date Section
  y = drawHeader("Signature and Date");
  y -= 20;

  // Signature area
  if (formData.signature && formData.signature.startsWith('data:image')) {
    try {
      const imageBytes = Buffer.from(formData.signature.split(',')[1], 'base64');
      const image = await (formData.signature.startsWith('data:image/png') ? pdfDoc.embedPng(imageBytes) : pdfDoc.embedJpg(imageBytes));
      const dims = image.scale(0.3);
      page.drawImage(image, { x: padding + 10, y: y - dims.height, width: dims.width, height: dims.height });
    } catch (error) {
      console.error('Error embedding signature:', error);
      // Draw signature line if signature embedding fails
      page.drawLine({ start: { x: padding + 10, y: y }, end: { x: padding + 250, y: y }, thickness: 1 });
    }
  } else {
    // Draw signature line if no signature
    page.drawLine({ start: { x: padding + 10, y: y }, end: { x: padding + 250, y: y }, thickness: 1 });
  }

  // Date field
  drawText("Date:", padding + 300, y + 5, font, 12);
  drawInputBox(padding + 340, y - 15, 120, 20, !!formData.signatureDate);
  drawText(formData.signatureDate || "MM/DD/YYYY", padding + 345, y - 10, font, 10);

  return pdfDoc.save();
}

export async function POST(req: Request) {
  try {
    const formData: FormData = await req.json();
    console.log('Received form data:', formData);

    // Generate PDF
    const pdfBytes = await generateApplicationPDF(formData);

    // Define mailOptions
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New Employment Application',
      text: 'See attached PDF for the submitted employment application.',
      attachments: [
        {
          filename: 'employment-application.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { 
          success: true,
          error: 'Application submitted but email notification failed',
          details: emailError
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
