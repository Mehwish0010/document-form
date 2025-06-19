import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Use a working email config (update with your real credentials)
const emailConfig = {
  user: 'mehwishsheikh0010sheikh@gmail.com',
  pass: 'flbw wrtr rwgo grlu',
  receiver: 'mehwishsheikh0010sheikh@gmail.com'
};

async function generateW4PDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 900]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 870;
  const lineHeight = 22;
  const sectionSpacing = 12;

  function drawHeading(text) {
    y -= lineHeight;
    page.drawText(text, { x: 50, y, size: 14, font: fontBold, color: rgb(0,0,0) });
    y -= sectionSpacing;
  }
  function drawField(label, value) {
    y -= lineHeight;
    page.drawText(label + ':', { x: 60, y, size: 12, font: fontBold, color: rgb(0.1,0.1,0.1) });
    page.drawText(value || '', { x: 200, y, size: 12, font, color: rgb(0.2,0.2,0.2) });
  }

  // Personal Information
  drawHeading('Personal Information');
  drawField('First Name', data.firstName);
  drawField('Middle Initial', data.middleInitial);
  drawField('Last Name', data.lastName);
  drawField('Social Security Number', data.socialSecurityNumber);
  drawField('Address', data.address);
  drawField('City, State, ZIP', data.cityStateZip);

  // Filing Status
  drawHeading('Filing Status');
  drawField('Single', data.filingStatus?.single ? 'Yes' : 'No');
  drawField('Married Filing Jointly', data.filingStatus?.marriedJointly ? 'Yes' : 'No');
  drawField('Head of Household', data.filingStatus?.headOfHousehold ? 'Yes' : 'No');

  // Multiple Jobs
  drawHeading('Multiple Jobs');
  drawField('Use Estimator', data.multipleJobs?.useEstimator ? 'Yes' : 'No');
  drawField('Use Worksheet', data.multipleJobs?.useWorksheet ? 'Yes' : 'No');
  drawField('Two Jobs Only', data.multipleJobs?.twoJobsOnly ? 'Yes' : 'No');

  // Dependents
  drawHeading('Dependents');
  drawField('Qualifying Children', String(data.dependents?.qualifyingChildren ?? ''));
  drawField('Other Dependents', String(data.dependents?.otherDependents ?? ''));
  drawField('Total Credits', String(data.dependents?.totalCredits ?? ''));

  // Other Adjustments
  drawHeading('Other Adjustments');
  drawField('Other Income', String(data.otherAdjustments?.otherIncome ?? ''));
  drawField('Deductions', String(data.otherAdjustments?.deductions ?? ''));
  drawField('Extra Withholding', String(data.otherAdjustments?.extraWithholding ?? ''));

  // Employer Information
  drawHeading('Employer Information');
  drawField('Name', data.employerInfo?.name ?? '');
  drawField('Address', data.employerInfo?.address ?? '');
  drawField('First Date of Employment', data.employerInfo?.firstDateOfEmployment ?? '');
  drawField('EIN', data.employerInfo?.ein ?? '');

  return await pdfDoc.save();
}

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('Received W-4 form data:', data);
    // Generate PDF
    const pdfBytes = await generateW4PDF(data);
    // Define mailOptions
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'New W-4 Form Submission',
      text: 'See attached PDF for the submitted W-4 form.',
      attachments: [
        {
          filename: 'w4-form.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });
    try {
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send email notification',
          details: emailError
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
} 