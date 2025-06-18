import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  user: 'your-email@gmail.com',
  pass: 'your-app-specific-password',
  receiver: 'receiver-email@example.com'
};

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

interface EmailError {
  code: string;
  command: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form data
    const firstName = formData.get('firstName') as string;
    const middleInitial = formData.get('middleInitial') as string;
    const lastName = formData.get('lastName') as string;
    const socialSecurityNumber = formData.get('socialSecurityNumber') as string;
    const address = formData.get('address') as string;
    const cityStateZip = formData.get('cityStateZip') as string;
    const filingStatus = JSON.parse(formData.get('filingStatus') as string);
    const multipleJobs = JSON.parse(formData.get('multipleJobs') as string);
    const dependents = JSON.parse(formData.get('dependents') as string);
    const otherAdjustments = JSON.parse(formData.get('otherAdjustments') as string);
    const employerName = formData.get('employerName') as string;
    const employerAddress = formData.get('employerAddress') as string;
    const employerFirstDate = formData.get('employerFirstDate') as string;
    const employerEIN = formData.get('employerEIN') as string;

    // Validate required fields
    if (!firstName || !lastName || !socialSecurityNumber || !address || !cityStateZip) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
      New W-4 Form Submission
      
      Personal Information:
      Name: ${firstName} ${middleInitial} ${lastName}
      SSN: ${socialSecurityNumber}
      Address: ${address}
      City, State, ZIP: ${cityStateZip}
      
      Filing Status:
      Single: ${filingStatus.single}
      Married Filing Jointly: ${filingStatus.marriedJointly}
      Head of Household: ${filingStatus.headOfHousehold}
      
      Multiple Jobs:
      Use Estimator: ${multipleJobs.useEstimator}
      Use Worksheet: ${multipleJobs.useWorksheet}
      Two Jobs Only: ${multipleJobs.twoJobsOnly}
      
      Dependents:
      Qualifying Children: ${dependents.qualifyingChildren}
      Other Dependents: ${dependents.otherDependents}
      Total Credits: ${dependents.totalCredits}
      
      Other Adjustments:
      Other Income: ${otherAdjustments.otherIncome}
      Deductions: ${otherAdjustments.deductions}
      Extra Withholding: ${otherAdjustments.extraWithholding}
      
      Employer Information:
      Name: ${employerName}
      Address: ${employerAddress}
      First Date of Employment: ${employerFirstDate}
      EIN: ${employerEIN}
    `;

    // Send email
    try {
      await transporter.sendMail({
        from: emailConfig.user,
        to: emailConfig.receiver,
        subject: 'New W-4 Form Submission',
        text: emailContent
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Email sending failed:', error);
      const emailError = error as EmailError;
      return NextResponse.json(
        { 
          success: true,
          error: 'Form submitted but email notification failed',
          details: emailError
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Form processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
} 