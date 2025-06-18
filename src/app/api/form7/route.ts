import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
}

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

async function generateApplicationPDF(formData: FormData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 900]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 870;
  const lineHeight = 22;
  const sectionSpacing = 12;

  function drawHeading(text: string) {
    y -= lineHeight;
    page.drawText(text, { x: 50, y, size: 16, font: fontBold, color: rgb(0,0,0) });
    y -= sectionSpacing;
  }
  function drawField(label: string, value: string) {
    y -= lineHeight;
    page.drawText(label + ':', { x: 60, y, size: 12, font: fontBold, color: rgb(0.1,0.1,0.1) });
    page.drawText(value || '', { x: 200, y, size: 12, font, color: rgb(0.2,0.2,0.2) });
  }

  // Personal Information
  drawHeading('Personal Information');
  drawField('Name', `${formData.firstName} ${formData.middleInitial} ${formData.lastName}`);
  drawField('Date', formData.date);
  drawField('Address', `${formData.streetAddress} ${formData.apartmentUnit}`);
  drawField('City, State, ZIP', `${formData.city}, ${formData.state} ${formData.zipCode}`);
  drawField('Phone', formData.phone);
  drawField('Email', formData.email);
  drawField("Driver's License", `${formData.driversLicense} (${formData.licenseState})`);
  drawField('License Expiration', formData.licenseExp);
  drawField('Date Available', formData.dateAvailable);
  drawField('Social Security', formData.socialSecurity);
  drawField('Position Applied', formData.positionApplied);

  // Citizenship & Employment
  drawHeading('Citizenship & Employment');
  drawField('US Citizen', formData.isCitizen);
  drawField('Authorized to Work', formData.isAuthorized);
  drawField('Previous Employment', formData.previousEmployment);
  drawField('Previous Employment Date', formData.previousEmploymentDate);
  drawField('Felony Conviction', formData.felonyConviction);
  drawField('Felony Explanation', formData.felonyExplanation);
  drawField('Can Meet Attendance', formData.canMeetAttendance);

  // Education
  drawHeading('Education - High School');
  drawField('Address', formData.highSchoolAddress);
  drawField('From', formData.highSchoolFrom);
  drawField('To', formData.highSchoolTo);
  drawField('Graduate', formData.highSchoolGraduate);
  drawField('Diploma', formData.highSchoolDiploma);
  drawHeading('Education - College');
  drawField('Address', formData.collegeAddress);
  drawField('From', formData.collegeFrom);
  drawField('To', formData.collegeTo);
  drawField('Graduate', formData.collegeGraduate);
  drawField('Degree', formData.collegeDegree);

  // Signature
  drawHeading('Signature');
  if (formData.signature && formData.signature.startsWith('data:image')) {
    // Extract base64 from data URL
    const base64 = formData.signature.split(',')[1];
    const imageBytes = Buffer.from(base64, 'base64');
    let image;
    if (formData.signature.startsWith('data:image/png')) {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      image = await pdfDoc.embedJpg(imageBytes);
    }
    const imgDims = image.scale(0.5);
    y -= (imgDims.height + 10);
    page.drawImage(image, {
      x: 60,
      y: y,
      width: imgDims.width,
      height: imgDims.height,
    });
    y -= 10;
    drawField('Signature Provided', 'Yes (see image above)');
  } else {
    drawField('Signature Provided', 'No');
  }

  return await pdfDoc.save();
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
