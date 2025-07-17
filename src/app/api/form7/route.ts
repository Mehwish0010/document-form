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
  // References fields
  ref1Name: string;
  ref1Relationship: string;
  ref1Company: string;
  ref1Phone: string;
  ref1Address: string;
  ref2Name: string;
  ref2Relationship: string;
  ref2Company: string;
  ref2Phone: string;
  ref2Address: string;
  ref3Name: string;
  ref3Relationship: string;
  ref3Company: string;
  ref3Phone: string;
  ref3Address: string;
  // Military Service fields
  militaryBranch: string;
  militaryFrom: string;
  militaryTo: string;
  militaryRank: string;
  militaryDischargeType: string;
  militaryDischargeExplanation: string;
  signature: string;
  signatureDate: string;
  fullName?: string;
  jobRole?: string;
  location?: string;
  jobAppFullName?: string;
}

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver: 'vincentiaadams@batp.org'
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
  const page = pdfDoc.addPage([612, 3400]); // Increased page height to ensure all content is visible
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const headerGray = rgb(75 / 255, 85 / 255, 99 / 255);
  // const lightBlue = rgb(219 / 255, 234 / 255, 254 / 255); // Commented out unused variable

  // Equal padding on all sides
  const padding = 50;
  const contentWidth = width - (padding * 2);
  let y = page.getHeight() - padding;

  const drawText = (text: string, x: number, yPos: number, fontToUse: PDFFont, size: number, color = black) => {
    page.drawText(text, { x, y: yPos, font: fontToUse, size, color, lineHeight: size + 4 });
  };

  const drawInputBox = (x: number, yPos: number, width: number, height: number) => {
    page.drawRectangle({
      x, y: yPos, width, height,
      // Removed color property to ensure no background fill
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

  // --- Job Application Fields at the top ---
  // Black background heading
  page.drawRectangle({ x: padding, y: y - 30, width: contentWidth, height: 30, color: black });
  drawText("Job Application Information", padding + 10, y - 12, fontBold, 14, white);
  y -= 40;
  // Inputs in a grouped block
  drawText("Full Name:", padding, y, font, 11, black);
  drawInputBox(padding + 90, y - 10, 180, 18);
  drawText(formData.jobAppFullName || '', padding + 95, y - 5, font, 11, black);
  y -= 22;
  drawText("Job Role:", padding, y, font, 11, black);
  drawInputBox(padding + 90, y - 10, 180, 18);
  drawText(formData.jobRole || '', padding + 95, y - 5, font, 11, black);
  y -= 22;
  drawText("Location:", padding, y, font, 11, black);
  drawInputBox(padding + 90, y - 10, 180, 18);
  drawText(formData.location || '', padding + 95, y - 5, font, 11, black);
  y -= 30;

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
  drawInputBox(padding + 70, y - 15, 200, 20);
  drawText(formData.lastName || "Last", padding + 75, y - 10, font, 10);
  drawInputBox(padding + 280, y - 15, 100, 20);
  drawText(formData.firstName || "First", padding + 285, y - 10, font, 10);
  drawInputBox(padding + 390, y - 15, 50, 20);
  drawText(formData.middleInitial || "M.I.", padding + 395, y - 10, font, 10);
  drawText("Date:", padding + 450, y, font, 10);
  drawInputBox(padding + 480, y - 15, 80, 20);
  drawText(formData.date || "MM/DD/YYYY", padding + 485, y - 10, font, 10);
  y -= 35;

  // Address row
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 300, 20);
  drawText(formData.streetAddress || "Street Address", padding + 75, y - 10, font, 10);
  drawText("Apt/Unit:", padding + 380, y, font, 10);
  drawInputBox(padding + 440, y - 15, 120, 20);
  drawText(formData.apartmentUnit || "Apt/Unit #", padding + 445, y - 10, font, 10);
  y -= 35;

  // City, State, ZIP row
  drawInputBox(padding + 70, y - 15, 150, 20);
  drawText(formData.city || "City", padding + 75, y - 10, font, 10);
  drawInputBox(padding + 230, y - 15, 80, 20);
  drawText(formData.state || "State", padding + 235, y - 10, font, 10);
  drawInputBox(padding + 320, y - 15, 100, 20);
  drawText(formData.zipCode || "ZIP Code", padding + 325, y - 10, font, 10);
  y -= 35;

  // Phone and Email row
  drawText("Phone:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 200, 20);
  drawText(formData.phone || "Phone Number", padding + 75, y - 10, font, 10);
  drawText("Email:", padding + 280, y, font, 10);
  drawInputBox(padding + 330, y - 15, 230, 20);
  drawText(formData.email || "Email Address", padding + 335, y - 10, font, 10);
  y -= 35;

  // Driver's License row
  drawText("Driver's License:", padding, y, font, 10);
  drawInputBox(padding + 100, y - 15, 150, 20);
  drawText(formData.driversLicense || "License Number", padding + 105, y - 10, font, 10);
  drawText("State:", padding + 260, y, font, 10);
  drawInputBox(padding + 300, y - 15, 60, 20);
  drawText(formData.licenseState || "State", padding + 305, y - 10, font, 10);
  drawText("Exp:", padding + 370, y, font, 10);
  drawInputBox(padding + 400, y - 15, 80, 20);
  drawText(formData.licenseExp || "MM/DD/YYYY", padding + 405, y - 10, font, 10);
  y -= 35;

  // Driving notice
  drawText("DRIVING IS AN ESSENTIAL JOB FUNCTION", padding, y, fontBold, 10);
  y -= 25;

  // Date Available and SSN row
  drawText("Date Available:", padding, y, font, 10);
  drawInputBox(padding + 100, y - 15, 120, 20);
  drawText(formData.dateAvailable || "MM/DD/YYYY", padding + 105, y - 10, font, 10);
  drawText("Social Security No.:", padding + 230, y, font, 10);
  drawInputBox(padding + 350, y - 15, 150, 20);
  drawText(formData.socialSecurity || "SSN", padding + 355, y - 10, font, 10);
  y -= 35;

  // Position Applied row
  drawText("Position Applied for:", padding, y, font, 10);
  drawInputBox(padding + 130, y - 15, 400, 20);
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
    drawInputBox(padding + 80, y - 15, 100, 20);
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
    drawInputBox(padding + 80, y - 15, 450, 40);
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
  drawInputBox(padding + 70, y - 15, 450, 20);
  drawText(formData.highSchoolAddress || "School Address", padding + 75, y - 10, font, 10);
  y -= 30;
  drawText("From:", padding, y, font, 10);
  drawInputBox(padding + 40, y - 15, 100, 20);
  drawText(formData.highSchoolFrom || "MM/DD/YYYY", padding + 45, y - 10, font, 10);
  drawText("To:", padding + 150, y, font, 10);
  drawInputBox(padding + 170, y - 15, 100, 20);
  drawText(formData.highSchoolTo || "MM/DD/YYYY", padding + 175, y - 10, font, 10);
  y -= 30;
  drawText("Did you graduate?", padding, y, font, 10);
  drawCheckbox(padding + 100, y, formData.highSchoolGraduate === 'YES'); drawText("YES", padding + 115, y, font, 10);
  drawCheckbox(padding + 150, y, formData.highSchoolGraduate === 'NO'); drawText("NO", padding + 165, y, font, 10);
  if (formData.highSchoolGraduate === 'YES') {
    drawText("Diploma:", padding + 200, y, font, 10);
    drawInputBox(padding + 260, y - 15, 200, 20);
    drawText(formData.highSchoolDiploma || "Diploma Type", padding + 265, y - 10, font, 10);
  }
  y -= 35;

  drawText("College", padding, y, fontBold, 12); y -= 20;
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 450, 20);
  drawText(formData.collegeAddress || "College Address", padding + 75, y - 10, font, 10);
  y -= 30;
  drawText("From:", padding, y, font, 10);
  drawInputBox(padding + 40, y - 15, 100, 20);
  drawText(formData.collegeFrom || "MM/DD/YYYY", padding + 45, y - 10, font, 10);
  drawText("To:", padding + 150, y, font, 10);
  drawInputBox(padding + 170, y - 15, 100, 20);
  drawText(formData.collegeTo || "MM/DD/YYYY", padding + 175, y - 10, font, 10);
  y -= 30;
  drawText("Did you graduate?", padding, y, font, 10);
  drawCheckbox(padding + 100, y, formData.collegeGraduate === 'YES'); drawText("YES", padding + 115, y, font, 10);
  drawCheckbox(padding + 150, y, formData.collegeGraduate === 'NO'); drawText("NO", padding + 165, y, font, 10);
  if (formData.collegeGraduate === 'YES') {
    drawText("Degree:", padding + 200, y, font, 10);
    drawInputBox(padding + 260, y - 15, 200, 20);
    drawText(formData.collegeDegree || "Degree Type", padding + 265, y - 10, font, 10);
  }
  y -= 50;

  // References Section
  y = drawHeader("References");
  drawText("Please list three professional references.", padding, y, font, 9);
  y -= 20;

  // Reference 1
  drawText("Reference 1:", padding, y, fontBold, 11);
  y -= 20;
  drawText("Name:", padding, y, font, 10);
  drawInputBox(padding + 50, y - 15, 200, 20);
  drawText(formData.ref1Name || "Full Name", padding + 55, y - 10, font, 10);
  drawText("Relationship:", padding + 270, y, font, 10);
  drawInputBox(padding + 350, y - 15, 150, 20);
  drawText(formData.ref1Relationship || "Relationship", padding + 355, y - 10, font, 10);
  y -= 30;
  drawText("Company:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 200, 20);
  drawText(formData.ref1Company || "Company", padding + 75, y - 10, font, 10);
  drawText("Phone:", padding + 290, y, font, 10);
  drawInputBox(padding + 340, y - 15, 150, 20);
  drawText(formData.ref1Phone || "Phone", padding + 345, y - 10, font, 10);
  y -= 30;
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 450, 20);
  drawText(formData.ref1Address || "Address", padding + 75, y - 10, font, 10);
  y -= 40;

  // Reference 2
  drawText("Reference 2:", padding, y, fontBold, 11);
  y -= 20;
  drawText("Name:", padding, y, font, 10);
  drawInputBox(padding + 50, y - 15, 200, 20);
  drawText(formData.ref2Name || "Full Name", padding + 55, y - 10, font, 10);
  drawText("Relationship:", padding + 270, y, font, 10);
  drawInputBox(padding + 350, y - 15, 150, 20);
  drawText(formData.ref2Relationship || "Relationship", padding + 355, y - 10, font, 10);
  y -= 30;
  drawText("Company:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 200, 20);
  drawText(formData.ref2Company || "Company", padding + 75, y - 10, font, 10);
  drawText("Phone:", padding + 290, y, font, 10);
  drawInputBox(padding + 340, y - 15, 150, 20);
  drawText(formData.ref2Phone || "Phone", padding + 345, y - 10, font, 10);
  y -= 30;
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 450, 20);
  drawText(formData.ref2Address || "Address", padding + 75, y - 10, font, 10);
  y -= 40;

  // Reference 3
  drawText("Reference 3:", padding, y, fontBold, 11);
  y -= 20;
  drawText("Name:", padding, y, font, 10);
  drawInputBox(padding + 50, y - 15, 200, 20);
  drawText(formData.ref3Name || "Full Name", padding + 55, y - 10, font, 10);
  drawText("Relationship:", padding + 270, y, font, 10);
  drawInputBox(padding + 350, y - 15, 150, 20);
  drawText(formData.ref3Relationship || "Relationship", padding + 355, y - 10, font, 10);
  y -= 30;
  drawText("Company:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 200, 20);
  drawText(formData.ref3Company || "Company", padding + 75, y - 10, font, 10);
  drawText("Phone:", padding + 290, y, font, 10);
  drawInputBox(padding + 340, y - 15, 150, 20);
  drawText(formData.ref3Phone || "Phone", padding + 345, y - 10, font, 10);
  y -= 30;
  drawText("Address:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 450, 20);
  drawText(formData.ref3Address || "Address", padding + 75, y - 10, font, 10);
  y -= 40;

  // Military Service Section
  y = drawHeader("Military Service");
  drawText("Branch:", padding, y, font, 10);
  drawInputBox(padding + 70, y - 15, 150, 20);
  drawText(formData.militaryBranch || "Branch", padding + 75, y - 10, font, 10);
  y -= 30;
  drawText("Service Period:", padding, y, font, 10);
  drawText("From:", padding + 100, y, font, 10);
  drawInputBox(padding + 140, y - 15, 100, 20);
  drawText(formData.militaryFrom || "MM/DD/YYYY", padding + 145, y - 10, font, 10);
  drawText("To:", padding + 260, y, font, 10);
  drawInputBox(padding + 280, y - 15, 100, 20);
  drawText(formData.militaryTo || "MM/DD/YYYY", padding + 285, y - 10, font, 10);
  y -= 30;
  drawText("Rank at Discharge:", padding, y, font, 10);
  drawInputBox(padding + 120, y - 15, 150, 20);
  drawText(formData.militaryRank || "Rank", padding + 125, y - 10, font, 10);
  y -= 30;
  drawText("Type of Discharge:", padding, y, font, 10);
  drawInputBox(padding + 130, y - 15, 150, 20);
  drawText(formData.militaryDischargeType || "Type", padding + 135, y - 10, font, 10);
  y -= 10;
  y -= 10; // Move the box and label 10 units lower
  if (formData.militaryDischargeExplanation) {
    y -= 10; // Move the box and label 10 units lower
    drawText("If other than honorable, explain:", padding, y, font, 10);
    drawInputBox(padding + 145, y - 15, 350, 20);
    page.drawText(formData.militaryDischargeExplanation || "Explanation", { x: padding + 205, y: y - 10, size: 10, font, maxWidth: 340, lineHeight: 12 });
    y -= 50;
  }
  y -= 30;

  // Disclaimer Section
  y = drawHeader("Disclaimer and Signature");
  const disclaimerParagraphs = [
    "I UNDERSTAND THAT, IF I AM EMPLOYED, ANY MISREPRESENTATION OR MATERIAL OMISSION MADE BY ME ON THIS APPLICATION WILL BE SUFFICIENT CAUSE FOR CANCELLATION OF THIS APPLICATION OR IMMEDIATE DISCHARGE FROM THE EMPLOYER'S SERVICE, WHENEVER IT IS DISCOVERED.",
    "I GIVE THE EMPLOYER THE RIGHT TO CONTACT AND OBTAIN INFORMATION FROM ALL REFERENCES, EMPLOYERS, AND EDUCATIONAL INSTITUTIONS AND TO OTHERWISE VERIFY THE ACCURACY OF THE INFORMATION CONTAINED IN THIS APPLICATION. I HEREBY RELEASE FROM LIABILITY THE EMPLOYER AND ITS REPRESENTATIVES FOR SEEKING, GATHERING, AND USING SUCH INFORMATION AND ALL OTHER PERSONS, CORPORATIONS, OR ORGANIZATIONS FOR FURNISHING SUCH INFORMATION.",
    "THE EMPLOYER DOES NOT UNLAWFULLY DISCRIMINATE IN EMPLOYMENT AND NO QUESTION ON THE APPLICATION IS USED FOR THE PURPOSE OF LIMITING OR EXCLUDING ANY APPLICANT FROM CONSIDERATION FOR EMPLOYMENT ON A BASIS PROHIBITED BY LOCAL, STATE, OR FEDERAL LAW.",
    "THIS APPLICATION IS CURRENT FOR ONLY 60 DAYS. AT THE CONCLUSION OF THIS TIME, IF I HAVE NOT HEARD FROM THE EMPLOYER AND STILL WISH TO BE CONSIDERED FOR EMPLOYMENT, IT WILL BE NECESSARY TO FILL OUT A NEW APPLICATION.",
    "IF I AM HIRED, I UNDERSTAND THAT I AM FREE TO RESIGN AT ANY TIME, WITH OR WITHOUT CAUSE AND WITHOUT PRIOR NOTICE, AND THE EMPLOYER RESERVES THE SAME RIGHT TO TERMINATE MY EMPLOYMENT AT ANY TIME, WITH OR WITHOUT CAUSE AND WITHOUT PRIOR NOTICE, EXCEPT AS MAY BE REQUIRED BY LAW. THIS APPLICATION DOES NOT CONSTITUTE AN AGREEMENT OR CONTRACT FOR EMPLOYMENT FOR ANY SPECIFIED PERIOD OR DEFINITE DURATION. I UNDERSTAND THAT NO REPRESENTATIVE OF THE EMPLOYER, OTHER THAN AN AUTHORIZED OFFICER, HAS THE AUTHORITY TO MAKE ANY ASSURANCES TO THE CONTRARY. I FURTHER UNDERSTAND THAT ANY SUCH ASSURANCES MUST BE IN WRITING AND SIGNED BY AN AUTHORIZED OFFICER.",
    "I UNDERSTAND IT IS THE COMPANY'S POLICY NOT TO REFUSE TO HIRE A QUALIFIED INDIVIDUAL WITH A DISABILITY BECAUSE OF THAT PERSON'S NEED FOR REASONABLE ACCOMMODATION AS REQUIRED BY THE ADA.",
    "I ALSO UNDERSTAND THAT, IF I AM HIRED, I WILL BE REQUIRED TO PROVIDE PROOF OF IDENTITY AND LEGAL WORK AUTHORIZATION.",
    "I represent and warrant that I have read and fully understand the foregoing and seek employment under these conditions."
  ];
  // Helper function to estimate number of lines for a paragraph
  function estimateLines(text: string, maxWidth: number, font: PDFFont, fontSize: number) {
    // Estimate average character width
    const avgCharWidth = font.widthOfTextAtSize('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', fontSize) / 52;
    const charsPerLine = Math.floor(maxWidth / avgCharWidth);
    const lines = Math.ceil(text.length / charsPerLine);
    return lines;
  }

  for (const para of disclaimerParagraphs) {
    page.drawText(para, { x: padding, y, size: 9, font, maxWidth: contentWidth, lineHeight: 20 });
    const lines = estimateLines(para, contentWidth, font, 9);
    y -= (lines * 20 + 10); // 20 is lineHeight, 10 is extra spacing
  }
  y -= 10;

  // Signature and Date Section
  y = drawHeader("Signature and Date");
  y -= 30;

  // Signature line (left side)
  const sigLineY = y;
  if (formData.signature && formData.signature.startsWith('data:image')) {
    try {
      const imageBytes = Buffer.from(formData.signature.split(',')[1], 'base64');
      const image = await (formData.signature.startsWith('data:image/png') ? pdfDoc.embedPng(imageBytes) : pdfDoc.embedJpg(imageBytes));
      const dims = image.scale(0.3);
      page.drawImage(image, { x: padding + 10, y: sigLineY - dims.height + 5, width: dims.width, height: dims.height });
    } catch (error) {
      console.error('Error embedding signature:', error);
      page.drawLine({ start: { x: padding + 10, y: sigLineY }, end: { x: padding + 250, y: sigLineY }, thickness: 1 });
    }
  } else {
    page.drawLine({ start: { x: padding + 10, y: sigLineY }, end: { x: padding + 250, y: sigLineY }, thickness: 1 });
  }
  drawText("Signature", padding + 10, sigLineY - 18, font, 10, black);

  // Date field (right side, same y)
  drawText("Date:", padding + 350, sigLineY + 5, font, 12);
  drawInputBox(padding + 350, sigLineY - 30, 120, 20);
  drawText(formData.signatureDate || "MM/DD/YYYY", padding + 355, sigLineY - 20, font, 10);

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
      subject: 'Employment Form 01 (Employment Application Form)',
      text: 'See attached PDF for the submitted employment application.',
      attachments: [
        {
          filename: 'Employment Form 01 (Employment Application Form)',
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
