// app/compliance/page.tsx
'use client';
import { useState, useRef, useEffect } from 'react';

export default function ComplianceHandbook() {
    const [jobAppFullName, setJobAppFullName] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [location, setLocation] = useState('');
    const [signature, setSignature] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
    }, []);

    useEffect(() => {
      const saved = localStorage.getItem('jobApplicationData');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setJobAppFullName(parsed.fullName || '');
          setJobRole(parsed.jobRole || '');
          setLocation(parsed.location || '');
        } catch {}
      }
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setLastX(x);
        setLastY(y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastX(x);
        setLastY(y);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (!canvas) return;
        setSignature(canvas.toDataURL());
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signature || !name || !date || !jobAppFullName || !jobRole || !location) {
            alert('Please fill in all fields including job application info and signature');
            return;
        }

        try {
            const response = await fetch('/api/form4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobAppFullName,
                    jobRole,
                    location,
                    signature,
                    name,
                    date
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Form submitted successfully!');
                // Clear form
                clearSignature();
                setName('');
                setDate('');
                setJobAppFullName('');
                setJobRole('');
                setLocation('');
            } else {
                alert('Error submitting form: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form. Please try again.');
        }
    };

    return (
      <main className="max-w-3xl mx-auto p-10 text-gray-800 font-serif y-8 shadow-xl">
        {/* Job Application Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-center bg-black text-white py-2 rounded">Job Application Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="jobAppFullName"
                value={jobAppFullName}
                onChange={e => setJobAppFullName(e.target.value)}
                className="w-full border-b border-black px-2 py-1"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Job Role</label>
              <input
                type="text"
                name="jobRole"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
                className="w-full border-b border-black px-2 py-1"
                placeholder="Enter job role"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full border-b border-black px-2 py-1"
                placeholder="Enter location"
                required
              />
            </div>
          </div>
        </section>
  
        {/* Page 1 */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold text-center uppercase mt-12">
            Behavior Analysis & Therapy Partners (BATP)
          </h1>
          <h2 className="text-lg font-bold text-center">
            Compliance Handbook and Code of Conduct
          </h2>
  
          <h3 className="font-bold text-bold text-xl underline">Introduction</h3>
          <p className="text-md ">
            BATP is a provider of children&#39;s behavioral health services and dedicated to a mission of outstanding services and ethical conduct.
          </p>
          <p className="">
            Compliance refers to BATP&#39;s effort to abide by all federal, state, and local laws and program regulations. The plan coordinates leadership, provides for training, performs internal monitoring of procedures, reports suspected violations, takes corrective action, and focuses on preventative activities.
          </p>
          <p className="">
            This compliance handbook and code of conduct will set the ethical standards for the delivery of services, business transactions, relationships with clients, and relationships with payers and referral services.
          </p>
          <p className="">
            It is the responsibility of each and every staff, employee, contractor, and agent to engage in behavior that is ethical and aligned with BATP&#39;s compliance plan. An individual is encouraged to raise concerns with the most appropriate person to take the situation as it relates to potential compliance issues, that individual must seek guidance. Designated &quot;Compliance Staff&quot; have been charged with overseeing compliance issues. These staff members are:
          </p>
  
          <ul className="list-disc list-inside text-bold ml-4">
            <li>Halina Dziewolska, Compliance Officer</li>
            <li>Gary Ames, Deputy Compliance Officer</li>
            <li>Lynn Santilli Connor, Executive Director</li>
          </ul>
  
          <p className="">
            Additional support can be sought anonymously by calling our <strong>Compliance Helpline</strong> at <strong>610-664-6200</strong>.
          </p>
  
          <p className="">
            Violating BATP&#39;s compliance plan and code of conduct is a very serious matter and will be treated as such. It is BATP&#39s intent to pursue disciplinary action against unethical behavior and illegal conduct as well as create an environment that supports appropriate actions. The mutual support and efforts of all associated with BATP allow the agency to be a great place to work, practice, and grow. The ultimate goal of this plan is to promote ethical practices and a culture in which these practices will be maintained.
          </p>
        </section>
  
        {/* Page 2 */}
        <section className="space-y-4 border-t pt-8">
          <h3 className="font-bold underline text-xl">Mission Statement</h3>
          <p className="font-bold">
            Our mission is to facilitate recovery for children and adults with behavioral health problems. We seek to improve the behavioral health and wellbeing of children, families, and adults while strengthening the community&#39s capacity to deal with behavioral health issues through the delivery of limited, accountable, and effective and accessible behavioral health services. We believe that the highest quality services are best provided through highly trained and clinically competent behavioral health professionals in collaboration with families, agency personnel, and involved community members. We hope to reunite individuals with their natural community supports. We seek to empower families to live life in accord with their highest values and to help their children overcome their behavioral health disabilities.
          </p>
  
          <h3 className="font-bold underline">
            Ethical Responsibilities of all BATP Staff, Employees, Contractors, and Agents
          </h3>
          <p className="">
            Each staff, employee, contractor, or agent of BATP has a responsibility to conduct oneself in a totally ethical and honest manner. Dealings with payers, consumers, advocates, referral sources, co-workers, regulators, vendors, and others that are present must be beyond reproach. As stated previously, it is never in the agency&#39s or individual &#39s best interest to perform an illegal or unethical act.
          </p>
          <p className="">
            Each staff, employee, contractor, or agent of BATP has a responsibility to know the regulations and laws that apply to one&#39;s professional area of work as well as BATP&#39s operations. It is expected that if a person has a concern or suspects an illegal situation, the individual will report the incident using the chain of command or other appropriate documented channels. Assistance should be obtained when a staff member is unsure about the ethical and legal response to a compliance situation. Compliance is everyone&#39s responsibility and such; the individual has an obligation to report issues of concern. If the issue is not resolved through the usual chain of command or the individual feels uncomfortable reporting a particular issue to a potential violator, the issue should be reported to a supervisor or Designated Compliance Staff or presented on the Compliance Hotline: 609-471-2090.
          </p>
  
          <h3 className="font-bold underline text-lg">Clinical Code of Conduct and Ethics</h3>
          <h4 className="font-bold text-md">Purpose</h4>
          <p className="">
            In order to assure that all associated with the BATP program understand and protect the special relationship between BATP and its clients, a clinical code of conduct has been established for all staff. It will be necessary to train all staff.
          </p>
        </section>
        <section>
            <p className="">
            employees, contractors, and agents on this policy, its interpretation, and its 
implementation. Every person will be trained in the Code as well as be required 
to sign a statement that they understand the Code, have not committed violations 
of the Code, and are not aware of any violations of the Code by any other staff, 
employee, contractor, or agent of BATP. The signed statement will be kept in 
each person&#39;s file and updated on an annual basis. Any and all noted violations 
will be reviewed by Designated Compliance Staff.
            </p>
        <h2 className="text-lg font-bold mb-4">The Code</h2>
        <ul className="list-disc pl-6 space-y-4">
          <li>All consumers and their families will be treated with dignity and respect. Abuse, neglect, or mistreatment of any kind will not be tolerated.</li>
          <li>All treatment must be in the best interest of the client. All decisions to begin, continue or discontinue treatment must be based exclusively on the client&#39s needs and best interests. Decisions must never be based on the financial interests of the agency, individual or collective interests of staff, employees, contractors, agents, referral sources, or payers. Under no circumstances should a BATP staff, employee, contractor, or agent make or accept a treatment or clinical recommendation that they know or suspect is not in the best interest of the client.</li>
          <li>BATP staff, employees, contractors, and agents are charged with the treatment and rehabilitation of clients... <span className="italic">(truncated for brevity)</span></li>
          <li>Staff, employees, contractors, and agents may not solicit, accept, or receive tips, wages, compensation, or remuneration from consumers or their families.</li>
          <li>Services will be provided exclusively by staff, employees, contractors, and agents that have the proper credentials to deliver the type and intensity of service contracted and needed.</li>
          <li>The credentials of all staff, employees, contractors, and agents will be verified through a staff-credentialing process. The credentialing process will assure that a thorough review of background, work history, and suitability for employment at BATP is conducted.</li>
          <li>Only services that are actually provided will be billed. In order to be billed, services must be fully documented.</li>
          <li>All staff, employees, contractors, and agents will abide by and obey all program, credentialing, or national accreditation standards that apply to the BATP program.</li>
          <li>All staff... will strictly conform to all BATP policies regarding <span className="font-bold">confidentiality</span> and use, storage, safeguarding, and dissemination of client records...</li>
          <li>Staff... will adhere to all BATP work rules including standards specific to appropriate attire, drug-free work place, client abuse and neglect, conflict of interest, health and safety, proper public image, and criminal activity.</li>
        </ul>
        <p className="mt-6 font-semibold">
          It is a responsibility of all parties to report all known or suspected violations of law or regulation.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Business Code of Conduct and Ethics</h2>
        <h3 className="font-bold underline">Purpose</h3>
        <p className="mt-2 semifont-bold">
          In order to assure that BATP&#39;s business practices are consistent with best practices and existing laws and regulations, BATP has developed a business code of conduct and ethics.
        </p>
        <p className="mt-2 font-semibold">
          It is essential that all BATP staff... conduct themselves in an ethical and honest manner. Employees must not engage in inappropriate or unethical behavior at any time.
        </p>

        <h3 className="mt-4 font-bold underline">The Code</h3>
        <ul className="list-disc pl-6 space-y-4 mt-2">
          <li>Staff... must not disclose agency information, trade secrets, technology, business strategy... to anyone outside of the agency for any reason.</li>
          <li>Staff... may not accept any gift, favor or gratuity from BATP business associates which could impair their judgment or create the appearance of conflict.</li>
        </ul>
      </section>
      <section>
        <ul className="list-disc pl-6 space-y-4">
          <li>Staff, employees, contractors, and agents, or members of their immediate family may not accept gifts from clients or their families. Additionally, the borrowing or lending of money to and from clients is strictly prohibited.</li>
          <li>Staff, employees, contractors, and agents may not give gifts to clients or their families.</li>
          <li>Staff, employees, contractors, and agents may not engage in activity that compromises their ability to perform their work with BATP.</li>
          <li>Staff, employees, contractors, and agents may not engage in any activity that harms or puts BATP business operations, opportunities, or integrity at risk.</li>
          <li>Staff, employees, contractors, and agents may not contribute agency funds, property, or services to political parties, candidates, or issues. Additionally, agency assets or time may not be used for lobbying activities.</li>
          <li>All agency documents, forms, information, reports, invoices, records, and cost reports must be filled out honestly, accurately, and completely according to agency specifications and policies. Internal audits or billing procedures will be held quarterly, with 30 cases pulled each time.</li>
          <li>No staff, employees, contractors, and agents may engage in any behavior or lack of behavior that causes BATP to receive reimbursement to which it is not entitled.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Training Programs</h2>
        <p>
          The management of BATP believes that training and communication is the cornerstone of any effective compliance effort. Through its communication and training effort, BATP will secure the understanding, commitment, and cooperation of all parties associated with BATP.
        </p>
        <p className="mt-2">
          From the beginning of a person&#39;s association with BATP, they will receive training designed to promote awareness and conformance to BATP&#39s standards of compliance and business ethics. By assuring that everyone receives the same message and support, BATP will see to it that compliance is built into the day-to-day activities of the organization.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Training Activities</h2>
        <p className="font-semibold mt-2">Initial interview — Overview of compliance expectation</p>
        <p className="font-semibold mt-2">Orientation — Review and signature for the following:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Staff compliance handbook</li>
          <li>Clinical Code of Conduct and Confidentiality</li>
          <li>Business Code of Conduct</li>
          <li>BATP operating documents</li>
          <li>Other mandatory BATP orientation documents</li>
          <li>Training program on BATP compliance plan</li>
        </ul>

        <p className="font-semibold mt-4">In-Service training</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Annual in-service training on assorted compliance topics</li>
          <li>Special training sessions on applicable regulations, laws, and requirements</li>
        </ul>

        <p className="text-sm mt-4">
          <strong>Note:</strong> Participation in training on compliance issues is mandatory for all staff, employees, contractors, and agents and will be considered a condition for continued employment.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Reporting Known or Suspected Compliance Violations</h2>
        <p>
          It is everyone&#39;s responsibility to report known or suspected violations of BATP&#39s Compliance guidelines.
        </p>
        <p className="mt-2">
          There are several ways that one can go about doing so. If you are comfortable, you can report the issue to your supervisor. Your supervisor will then take the issue to Designated Compliance Staff. If you report the violation in this fashion, you will most likely be called upon to provide detail and further information about the potential violation. If you do not wish (or feel unable to) report the violation to your supervisor, you may report the violation to Designated Compliance Staff. When reporting to compliance staff, you will be asked for detail about the issue so that a comprehensive investigation can be performed.
        </p>
        <p className="mt-2">
          When you make a report, you are doing your duty as a partner in assuring that BATP is operating in an ethical and honest manner. As such, BATP is invested in making certain that you are comfortable and supported. Retaliation against people who report inappropriate or questionable activity will not be tolerated and will be dealt with severely.
        </p>
        <p className="font-bold mt-4">Compliance Helpline……610-664-6200</p>
      </section>

      <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">Seeking Answers to Ethical Questions</h1>
          <p className="text-justify leading-relaxed">
            Sometimes, it is not clear when an issue is right or wrong or in compliance with regulations. 
            If you encounter a situation that causes you to question its appropriateness, BATP wants you to ask. 
            The Helpline can be used for this purpose. By asking questions if you are uncertain if something 
            is the right thing to do, you are protecting BATP as well as yourself. Your compliance staff will 
            be happy to assist and guide you.
          </p>
        </div>

        {/* Billing Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Billing and Accounting Practices</h2>
          <p className="mb-4 text-justify leading-relaxed">
            BATP bills for the services it provides only when the service has been appropriately delivered 
            and appropriate. BATP complies with all billing and third party requirements in the processing of 
            invoices. Any misleading statements made to government, regulatory agencies, or payers are 
            potentially illegal and will be cause for disciplinary action. Additionally, the person making 
            the false statements may be subject to criminal penalties. Employees are cautioned to exercise 
            extreme caution in this area.
          </p>
          <p className="text-justify leading-relaxed">
            BATP is required by law and best practices to keep and maintain accurate financial records. 
            All staff, employees, contractors, and agents must be truthful in their actions and reporting 
            to assure the integrity of BATP&#39s accounting records. Staff, employees, contractors and agents 
            may not engage in conduct that results in false or misleading financial statements. Anyone whose 
            lack of honesty or diligence results in inaccurate or false financial statements or records will 
            face disciplinary action and possible legal action.
          </p>
        </div>

        {/* Email Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Use of E-Mail and Agency Equipment</h2>
          <p className="text-justify leading-relaxed">
            Computers, software, e-mail, papers, telephones, and other business equipment are provided for 
            employee use in executing agency business. Personal use of agency equipment may be permitted as 
            long as such use is done on personal time and does not interfere with your work schedule or duties. 
            If you are unclear whether your personal use of agency property is permissible, ask designated 
            compliance staff. Any use of agency property to obtain, transmit, view, or send offensive, 
            objectionable, or obscene material is grounds for discipline and possible termination. Additionally, 
            any communications or e-mail shall be deemed agency property and available to the employer&#39s 
            supervisor and agency officials.
          </p>
        </div>

        {/* Copyright Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Copyright Infringement</h2>
          <p className="text-justify leading-relaxed">
            Unauthorized copying of software programs and other copyright materials is strictly prohibited. 
            Such unauthorized action could result in liability for BATP as well as you individually. Employees 
            may only copy software for agency or personal use when existing licensing agreement authorizes 
            such action.
          </p>
        </div>

        {/* Page Number */}
        <div className="flex justify-center mt-10 mb-6">
          <span className="text-xl">7</span>
        </div>

        {/* Agency Name */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider">Behavior Analysis & Therapy Partners</h2>
        </div>

        {/* Compliance Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Compliance and Code of Conduct</h2>
          <p className="mb-6 text-justify leading-relaxed">
            I have received and have read the BATP Compliance Manual and Code of Conduct. I agree to abide by 
            what is outlined in the Manual and the Clinical Code of Conduct and Ethics and the Business Code 
            of Conduct. If I have any questions, I will contact my supervisor or a member of the designated 
            Corporate Compliance Staff.
          </p>
          {/* Signature Block */}
          <form onSubmit={handleSubmit}>
            <div className="mt-10">
              <div className="flex flex-wrap items-end mb-6">
                <div className="mr-6 mb-4 sm:mb-0">
                  <span className="block mb-1">Signature</span>
                  <canvas
                    ref={canvasRef}
                    width={256}
                    height={100}
                    className=" border-gray-300 rounded"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="mt-2 px-2 p-1 text-sm  hover:bg-gray-300 rounded border">
                    Clear Signature
                  </button>
                </div>
                <div>
                  <span className="block mb-1">Print Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-48 border-b border-black h-8 px-2 focus:outline-none focus:border-blue-500"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="mb-4">
                <span className="block mb-1">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-40 border-b border-black h-8 px-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-6 ded-lg hover:bg-gray-400 n-colors duration-200 font-semibold"
                >
                  Submit Form
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    );
  }
  