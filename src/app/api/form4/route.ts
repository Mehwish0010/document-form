import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const emailConfig = {
  user: 'mailbatp@gmail.com',
  pass: 'nkjt tzvm ctyp cgpn ',
  receiver: 'mailbatp@gmail.com'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

async function generateCompliancePDF(formData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 3500]);
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);
  const padding = 50;
  const contentWidth = width - (padding * 2);
  let y = page.getHeight() - padding;

  async function drawParagraph(page, text, x, y, font, fontSize, color, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    for (const word of words) {
      const testLine = line + word + " ";
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line.trim());
    for (let i = 0; i < lines.length; i++) {
      page.drawText(lines[i], {
        x,
        y: y - i * lineHeight,
        size: fontSize,
        font,
        color,
      });
    }
    return y - lines.length * lineHeight;
  }

  const drawText = (text, x, yPos, fontToUse, size, color = black, maxWidth, lineHeight) => {
    page.drawText(text, { x, y: yPos, font: fontToUse, size, color, maxWidth, lineHeight });
  };
  const drawInputBox = (x, yPos, w, h, hasValue) => {
    page.drawRectangle({ x, y: yPos, width: w, height: h, color: hasValue ? rgb(0.9,0.95,1) : white, borderWidth: 1, borderColor: black });
  };

  // --- Job Application Fields at the top ---
  drawText("Job Application Information", padding, y, fontBold, 14, black, undefined, undefined); y -= 24;
  drawText("Full Name:", padding, y, font, 11, black, undefined, undefined); 
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.jobAppFullName);
  drawText(formData.jobAppFullName || '', padding + 95, y - 5, font, 11, black, undefined, undefined); y -= 22;
  drawText("Job Role:", padding, y, font, 11, black, undefined, undefined);
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.jobRole);
  drawText(formData.jobRole || '', padding + 95, y - 5, font, 11, black, undefined, undefined); y -= 22;
  drawText("Location:", padding, y, font, 11, black, undefined, undefined);
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.location);
  drawText(formData.location || '', padding + 95, y - 5, font, 11, black, undefined, undefined); y -= 30;

  // Title and subtitle
  drawText("Employement Form 03 ", padding, y, fontBold, 16, black, undefined, undefined);
  y -= 24;
  drawText("BEHAVIOR ANALYSIS & THERAPY PARTNERS (BATP)", padding, y, fontBold, 16, black, undefined, undefined); y -= 24;
  drawText("Compliance Handbook and Code of Conduct", padding, y, fontBold, 13, black, undefined, undefined); y -= 30;

  // Introduction
  drawText("Introduction", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "BATP is a provider of children's behavioral health services and dedicated to a mission of outstanding services and ethical conduct. Compliance refers to BATP's effort to abide by all federal, state, and local laws and program regulations. The plan coordinates leadership, provides for training, performs internal monitoring of procedures, reports suspected violations, takes corrective action, and focuses on preventative activities. This compliance handbook and code of conduct will set the ethical standards for the delivery of services, business transactions, relationships with clients, and relationships with payers and referral services. It is the responsibility of each and every staff, employee, contractor, and agent to engage in behavior that is ethical and aligned with BATP's compliance plan. An individual is encouraged to raise concerns with the most appropriate person to take the situation as it relates to potential compliance issues, that individual must seek guidance. Designated 'Compliance Staff' have been charged with overseeing compliance issues. These staff members are: Halina Dziewolska, Compliance Officer; Gary Ames, Deputy Compliance Officer; Lynn Santilli Connor, Executive Director. Additional support can be sought anonymously by calling our Compliance Helpline at 610-664-6200. Violating BATP's compliance plan and code of conduct is a very serious matter and will be treated as such. It is BATP's intent to pursue disciplinary action against unethical behavior and illegal conduct as well as create an environment that supports appropriate actions. The mutual support and efforts of all associated with BATP allow the agency to be a great place to work, practice, and grow. The ultimate goal of this plan is to promote ethical practices and a culture in which these practices will be maintained.", padding, y, font, 11, black, contentWidth, 16); y -= 20;

  // Mission Statement
  drawText("Mission Statement", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "Our mission is to facilitate recovery for children and adults with behavioral health problems. We seek to improve the behavioral health and wellbeing of children, families, and adults while strengthening the community's capacity to deal with behavioral health issues through the delivery of limited, accountable, and effective and accessible behavioral health services. We believe that the highest quality services are best provided through highly trained and clinically competent behavioral health professionals in collaboration with families, agency personnel, and involved community members. We hope to reunite individuals with their natural community supports. We seek to empower families to live life in accord with their highest values and to help their children overcome their behavioral health disabilities.", padding, y, font, 11, black, contentWidth, 16); y -= 20;

  // Ethical Responsibilities
  drawText("Ethical Responsibilities of all BATP Staff, Employees, Contractors, and Agents", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "Each staff, employee, contractor, or agent of BATP has a responsibility to conduct oneself in a totally ethical and honest manner. Dealings with payers, consumers, advocates, referral sources, co-workers, regulators, vendors, and others that are present must be beyond reproach. As stated previously, it is never in the agency's or individual's best interest to perform an illegal or unethical act. Each staff, employee, contractor, or agent of BATP has a responsibility to know the regulations and laws that apply to one's professional area of work as well as BATP's operations. It is expected that if a person has a concern or suspects an illegal situation, the individual will report the incident using the chain of command or other appropriate documented channels. Assistance should be obtained when a staff member is unsure about the ethical and legal response to a compliance situation. Compliance is everyone's responsibility and such; the individual has an obligation to report issues of concern. If the issue is not resolved through the usual chain of command or the individual feels uncomfortable reporting a particular issue to a potential violator, the issue should be reported to a supervisor or Designated Compliance Staff or presented on the Compliance Hotline: 609-471-2090.", padding, y, font, 11, black, contentWidth, 16); y -= 20;

  // Clinical Code of Conduct and Ethics
  drawText("Clinical Code of Conduct and Ethics", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  drawText("Purpose", padding, y, fontBold, 11, black, undefined, undefined); y -= 16;
  y = await drawParagraph(page, "In order to assure that all associated with the BATP program understand and protect the special relationship between BATP and its clients, a clinical code of conduct has been established for all staff. It will be necessary to train all staff, employees, contractors, and agents on this policy, its interpretation, and its implementation. Every person will be trained in the Code as well as be required to sign a statement that they understand the Code, have not committed violations of the Code, and are not aware of any violations of the Code by any other staff, employee, contractor, or agent of BATP. The signed statement will be kept in each person's file and updated on an annual basis. Any and all noted violations will be reviewed by Designated Compliance Staff.", padding, y, font, 11, black, contentWidth, 16); y -= 20;

  // The Code (bulleted)
  drawText("The Code", padding, y, fontBold, 11, black, undefined, undefined); y -= 16;
  const codeBullets = [
    "All consumers and their families will be treated with dignity and respect. Abuse, neglect, or mistreatment of any kind will not be tolerated.",
    "All treatment must be in the best interest of the client. All decisions to begin, continue or discontinue treatment must be based exclusively on the client's needs and best interests. Decisions must never be based on the financial interests of the agency, individual or collective interests of staff, employees, contractors, agents, referral sources, or payers. Under no circumstances should a BATP staff, employee, contractor, or agent make or accept a treatment or clinical recommendation that they know or suspect is not in the best interest of the client.",
    "BATP staff, employees, contractors, and agents are charged with the treatment and rehabilitation of clients...",
    "Staff, employees, contractors, and agents may not solicit, accept, or receive tips, wages, compensation, or remuneration from consumers or their families.",
    "Services will be provided exclusively by staff, employees, contractors, and agents that have the proper credentials to deliver the type and intensity of service contracted and needed.",
    "The credentials of all staff, employees, contractors, and agents will be verified through a staff-credentialing process. The credentialing process will assure that a thorough review of background, work history, and suitability for employment at BATP is conducted.",
    "Only services that are actually provided will be billed. In order to be billed, services must be fully documented.",
    "All staff, employees, contractors, and agents will abide by and obey all program, credentialing, or national accreditation standards that apply to the BATP program.",
    "All staff... will strictly conform to all BATP policies regarding confidentiality and use, storage, safeguarding, and dissemination of client records...",
    "Staff... will adhere to all BATP work rules including standards specific to appropriate attire, drug-free work place, client abuse and neglect, conflict of interest, health and safety, proper public image, and criminal activity."
  ];
  for (const bullet of codeBullets) {
    y = await drawParagraph(page, `• ${bullet}`, padding + 10, y, font, 11, black, contentWidth - 20, 16); y -= 8;
  }
  y -= 16;
  drawText("It is a responsibility of all parties to report all known or suspected violations of law or regulation.", padding, y, fontBold, 11, black, undefined, undefined); y -= 24;

  // Business Code of Conduct and Ethics
  drawText("Business Code of Conduct and Ethics", padding, y, fontBold, 12, black, undefined, undefined); y -= 22;
  drawText("Purpose", padding, y, fontBold, 11, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "In order to assure that BATP's business practices are consistent with best practices and existing laws and regulations, BATP has developed a business code of conduct and ethics. It is essential that all BATP staff... conduct themselves in an ethical and honest manner. Employees must not engage in inappropriate or unethical behavior at any time.", padding, y, font, 11, black, contentWidth, 16); y -= 16;
  drawText("The Code", padding, y, fontBold, 11, black, undefined, undefined); y -= 18;
  const businessBullets = [
    "Staff... must not disclose agency information, trade secrets, technology, business strategy... to anyone outside of the agency for any reason.",
    "Staff... may not accept any gift, favor or gratuity from BATP business associates which could impair their judgment or create the appearance of conflict.",
    "Staff, employees, contractors, and agents, or members of their immediate family may not accept gifts from clients or their families. Additionally, the borrowing or lending of money to and from clients is strictly prohibited.",
    "Staff, employees, contractors, and agents may not give gifts to clients or their families.",
    "Staff, employees, contractors, and agents may not engage in activity that compromises their ability to perform their work with BATP.",
    "Staff, employees, contractors, and agents may not engage in any activity that harms or puts BATP business operations, opportunities, or integrity at risk.",
    "Staff, employees, contractors, and agents may not contribute agency funds, property, or services to political parties, candidates, or issues. Additionally, agency assets or time may not be used for lobbying activities.",
    "All agency documents, forms, information, reports, invoices, records, and cost reports must be filled out honestly, accurately, and completely according to agency specifications and policies. Internal audits or billing procedures will be held quarterly, with 30 cases pulled each time.",
    "No staff, employees, contractors, and agents may engage in any behavior or lack of behavior that causes BATP to receive reimbursement to which it is not entitled."
  ];
  for (const bullet of businessBullets) {
    y = await drawParagraph(page, `• ${bullet}`, padding + 10, y, font, 11, black, contentWidth - 20, 16); y -= 8;
  }
  y -= 16;

  // Training Programs
  drawText("Training Programs", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "The management of BATP believes that training and communication is the cornerstone of any effective compliance effort. Through its communication and training effort, BATP will secure the understanding, commitment, and cooperation of all parties associated with BATP. From the beginning of a person's association with BATP, they will receive training designed to promote awareness and conformance to BATP's standards of compliance and business ethics. By assuring that everyone receives the same message and support, BATP will see to it that compliance is built into the day-to-day activities of the organization.", padding, y, font, 11, black, contentWidth, 16); y -= 10;

  // Training Activities
  drawText("Training Activities", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "Initial interview — Overview of compliance expectation. Orientation — Review and signature for the following: Staff compliance handbook, Clinical Code of Conduct and Confidentiality, Business Code of Conduct, BATP operating documents, Other mandatory BATP orientation documents, Training program on BATP compliance plan. In-Service training: Annual in-service training on assorted compliance topics, Special training sessions on applicable regulations, laws, and requirements. Participation in training on compliance issues is mandatory for all staff, employees, contractors, and agents and will be considered a condition for continued employment.", padding, y, font, 11, black, contentWidth, 16); y -= 10;

  // Reporting Known or Suspected Compliance Violations
  drawText("Reporting Known or Suspected Compliance Violations", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "It is everyone's responsibility to report known or suspected violations of BATP's Compliance guidelines. There are several ways that one can go about doing so. If you are comfortable, you can report the issue to your supervisor. Your supervisor will then take the issue to Designated Compliance Staff. If you report the violation in this fashion, you will most likely be called upon to provide detail and further information about the potential violation. If you do not wish (or feel unable to) report the violation to your supervisor, you may report the violation to Designated Compliance Staff. When reporting to compliance staff, you will be asked for detail about the issue so that a comprehensive investigation can be performed. When you make a report, you are doing your duty as a partner in assuring that BATP is operating in an ethical and honest manner. As such, BATP is invested in making certain that you are comfortable and supported. Retaliation against people who report inappropriate or questionable activity will not be tolerated and will be dealt with severely.", padding, y, font, 11, black, contentWidth, 16); y -= 10;
  drawText("Compliance Helpline……610-664-6200", padding, y, fontBold, 11, black, undefined, undefined); y -= 20;

  // Seeking Answers to Ethical Questions
  drawText("Seeking Answers to Ethical Questions", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "Sometimes, it is not clear when an issue is right or wrong or in compliance with regulations. If you encounter a situation that causes you to question its appropriateness, BATP wants you to ask. The Helpline can be used for this purpose. By asking questions if you are uncertain if something is the right thing to do, you are protecting BATP as well as yourself. Your compliance staff will be happy to assist and guide you.", padding, y, font, 11, black, contentWidth, 16); y -= 10;

  // Billing and Accounting Practices
  drawText("Billing and Accounting Practices", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "BATP bills for the services it provides only when the service has been appropriately delivered and appropriate. BATP complies with all billing and third party requirements in the processing of invoices. Any misleading statements made to government, regulatory agencies, or payers are potentially illegal and will be cause for disciplinary action. Additionally, the person making the false statements may be subject to criminal penalties. Employees are cautioned to exercise extreme caution in this area. BATP is required by law and best practices to keep and maintain accurate financial records. All staff, employees, contractors, and agents must be truthful in their actions and reporting to assure the integrity of BATP's accounting records. Staff, employees, contractors and agents may not engage in conduct that results in false or misleading financial statements. Anyone whose lack of honesty or diligence results in inaccurate or false financial statements or records will face disciplinary action and possible legal action.", padding, y, font, 11, black, contentWidth, 16); y -= 10;

  // Use of E-Mail and Agency Equipment
  drawText("Use of E-Mail and Agency Equipment", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "Computers, software, e-mail, papers, telephones, and other business equipment are provided for employee use in executing agency business. Personal use of agency equipment may be permitted as long as such use is done on personal time and does not interfere with your work schedule or duties. If you are unclear whether your personal use of agency property is permissible, ask designated compliance staff. Any use of agency property to obtain, transmit, view, or send offensive, objectionable, or obscene material is grounds for discipline and possible termination. Additionally, any communications or e-mail shall be deemed agency property and available to the employer's supervisor and agency officials.", padding, y, font, 11, black, contentWidth, 16); y -= 10;

  // Copyright Infringement
  drawText("Copyright Infringement", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "Unauthorized copying of software programs and other copyright materials is strictly prohibited. Such unauthorized action could result in liability for BATP as well as you individually. Employees may only copy software for agency or personal use when existing licensing agreement authorizes such action.", padding, y, font, 11, black, contentWidth, 16); y -= 20;

  // Page number and agency name
  drawText("7", width / 2 - 5, y, fontBold, 14, black, undefined, undefined); y -= 30;
  drawText("BEHAVIOR ANALYSIS & THERAPY PARTNERS", padding, y, fontBold, 14, black, undefined, undefined); y -= 30;

  // Compliance and Code of Conduct Acknowledgment
  drawText("Compliance and Code of Conduct", padding, y, fontBold, 12, black, undefined, undefined); y -= 18;
  y = await drawParagraph(page, "I have received and have read the BATP Compliance Manual and Code of Conduct. I agree to abide by what is outlined in the Manual and the Clinical Code of Conduct and Ethics and the Business Code of Conduct. If I have any questions, I will contact my supervisor or a member of the designated Corporate Compliance Staff.", padding, y, font, 11, black, contentWidth, 16); y -= 20;

  // --- Always render signature, print name, and date fields last ---
  let signatureHeight = 40;
  if (formData.signature && formData.signature.startsWith('data:image')) {
    try {
      const imageBytes = Buffer.from(formData.signature.split(',')[1], 'base64');
      const image = await (formData.signature.startsWith('data:image/png') ? pdfDoc.embedPng(imageBytes) : pdfDoc.embedJpg(imageBytes));
      const dims = image.scale(0.7);
      page.drawImage(image, { x: padding, y: y - dims.height, width: dims.width, height: dims.height });
      signatureHeight = dims.height;
    } catch {
      page.drawLine({ start: { x: padding, y: y }, end: { x: padding + 250, y: y }, thickness: 1 });
    }
  } else {
    page.drawLine({ start: { x: padding, y: y }, end: { x: padding + 250, y: y }, thickness: 1 });
  }
  y -= signatureHeight + 16;
  drawText("Signature", padding, y, font, 12, black, undefined, undefined);
  y -= 32;
  drawText("Print Name", padding, y, font, 12, black, undefined, undefined);
  drawInputBox(padding + 90, y - 10, 180, 18, !!formData.name);
  drawText(formData.name || '', padding + 95, y - 5, font, 11, black, undefined, undefined);
  drawText("Date", padding + 300, y, font, 12, black, undefined, undefined);
  drawInputBox(padding + 350, y - 10, 120, 18, !!formData.date);
  drawText(formData.date || '', padding + 355, y - 5, font, 11, black, undefined, undefined);
  y -= 40;

  return pdfDoc.save();
}

export async function POST(req) {
  try {
    const formData = await req.json();
    const pdfBytes = await generateCompliancePDF(formData);
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.receiver,
      subject: 'Employment Form 03 (Behavior Analysis and Therapy Partners)',
      text: 'See attached PDF for the submitted confidentiality agreement.',
      attachments: [
        {
          filename: 'Employment Form 03 (Behavior Analysis and Therapy Partners)',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    };
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully'
      });
    } catch (emailError) {
      return NextResponse.json(
        { 
          success: true,
          error: 'Form submitted but email notification failed',
          details: emailError
        },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to process confidentiality form' },
      { status: 500 }
    );
  }
}