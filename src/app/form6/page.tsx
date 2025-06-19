'use client';

import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function DisclosureForm() {
  const [formData, setFormData] = useState({
    witness: '',
    name: '',
    signature: '',
    date: '',
    guardianName: '',
    guardianSignature: '',
    guardianDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Collect signature Data URLs
    const applicantSignature = sigCanvas.current?.toDataURL() || '';
    const witnessSignature = witnessSigCanvas.current?.toDataURL() || '';
    const guardianSignature = guardianSigCanvas.current?.toDataURL() || '';

    const payload = {
      ...formData,
      signature: applicantSignature,
      witnessSignature,
      guardianSignature,
    };

    try {
      const response = await fetch('/api/form6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        showNotification('success', 'Your form has been submitted successfully! Thank you.');
        setFormData({
          witness: '',
          name: '',
          signature: '',
          date: '',
          guardianName: '',
          guardianSignature: '',
          guardianDate: '',
        });
        sigCanvas.current?.clear();
        witnessSigCanvas.current?.clear();
        guardianSigCanvas.current?.clear();
      } else {
        showNotification('error', result.error || 'Failed to submit form. Please try again.');
      }
    } catch {
      showNotification('error', 'Failed to submit form. Please try again.');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    const div = document.createElement('div');
    div.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
      type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    } px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100`;
    div.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success'
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(div);
    setTimeout(() => {
      div.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => div.remove(), 300);
    }, 5000);
  };

  const sigCanvas = useRef<SignatureCanvas>(null);
  const witnessSigCanvas = useRef<SignatureCanvas>(null);
  const guardianSigCanvas = useRef<SignatureCanvas>(null);

  return (
    <div className="p-4 sm:p-12 bg-white leading-relaxed tracking-wide shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-14 py-6 sm:py-10 font-serif text-[13px] sm:text-[15px] tracking-wide shadow-lg rounded-lg leading-6 text-black">
        <h2 className="text-center font-bold uppercase text-sm sm:text-base">Appendix A</h2>
        <h1 className="text-center font-bold mt-2 text-lg sm:text-xl">Disclosure Statement</h1>
        <h2 className="text-center font-bold mb-2 uppercase text-sm sm:text-base">
          Application for Employment, Including Provisional Employment
        </h2>
        <p className="text-center font-bold mb-4 sm:mb-6 text-xs sm:text-sm">
          Required by the Child Protective Service Law<br />
          23 Pa. C.S. Section 6344 (relating to employees having contact with children; adoptive and foster parents)
        </p>

        {[
          'I swear/affirm that, if providing certifications that have been obtained within the preceding 60 months, I have not been disqualified from employment as outlined below or have not been convicted of an offense similar in nature to a crime listed below under the laws or former laws of the United States or one of its territories or possessions, another state, the District of Columbia, the Commonwealth of Puerto Rico a foreign nation, or under a former law of this Commonwealth.',
          'I swear/affirm that I have not been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.',
          'I swear/affirm that I have not been convicted of any of the following crimes under Title 18 of the Pennsylvania consolidated statutes or equivalent crime under the laws or former laws of the United States or one of its territories or possessions, another state, the District of Columbia, the Commonwealth of Puerto Rico or a foreign nation, or under a former law of this Commonwealth.',
        ].map((text, i) => (
          <p key={i} className="mb-2 sm:mb-3 text-xs sm:text-sm">{text}</p>
        ))}

        <div className="text-xs sm:text-sm">
          <p>Chapter 25 (relating to criminal homicide)</p>
          <p>Section 2702 (relating to aggravated assault)</p>
          <p>Section 2709.1 (relating to stalking)</p>
          <p>Section 2901 (relating to kidnapping)</p>
          <p>Section 2902 (relating to unlawful restraint)</p>
          <p>Section 3121 (relating to rape)</p>
          <p>Section 3122.1 (relating to statutory sexual assault)</p>
          <p>Section 3123 (relating to involuntary deviate sexual intercourse)</p>
          <p>Section 3124.1 (relating to sexual assault)</p>
          <p>Section 3125 (relating to aggravated indecent assault)</p>
          <p>Section 3126 (relating to indecent assault)</p>
          <p>Section 3127 (relating to indecent exposure)</p>
          <p>Section 4302 (relating to incest)</p>
          <p>Section 4303 (relating to concealing death of child)</p>
          <p>Section 4304 (relating to endangering welfare of children)</p>
          <p>Section 4305 (relating to dealing in infant children)</p>
          <p>Section 5902(b) (relating to prostitution and related offenses)</p>
          <p>Section 5903(c) (d) (relating to obscene and other sexual material and performances)</p>
          <p>Section 6301 (relating to corruption of minors)</p>
          <p>Section 6312 (relating to sexual abuse of children), or an equivalent crime under Federal law or the law of another state.</p>
        </div>

        <p className="mb-2 sm:mb-3 text-xs sm:text-sm">
          In addition to the crimes already outlined above, if I am an individual being employed in a child care center, group child care home, or family child care home, I swear/affirm that I have not been convicted of any of the following crimes g crimes under Title 18 of the Pennsylvania consolidated statutes or equivalent crime under the laws or former laws of the United States or one of its territories or possessions, another state, the District of Columbia, the Commonwealth of Puerto Rico or a foreign nation, or under a former law of this Commonwealth.
        </p>

        <div className="text-xs sm:text-sm">
          <p>Section 2718 (relating to strangulation)</p>
          <p>Section 3301 (relating to arson and related offenses)</p>
          <p>18 U.S.C. Section 2261 (relating to interstate domestic violence)</p>
          <p>18 U.S.C. Section 2262 (relating to interstate violation of protection order)</p>
        </div>

        {[
          'I swear/affirm that I have not been convicted of a felony offense under Act 64-1972 (relating to the controlled substance, drug device and cosmetic act) committed within the past five years.',
          'I understand that I must be dismissed from employment if I am named as a perpetrator of a founded report of child abuse within the past five (5) years or have been convicted of any of the crimes listed above.',
          'I understand that if I am arrested for or convicted of an offense that would constitute grounds for denying employment or participation in a program, activity or service under the Child Protective Services Law as listed above, or am named as perpetrator in a founded or indicated report, I must provide the administrator or designee with written notice not later than 72 hours after the arrest, conviction or notification that I have been listed as a perpetrator in the Statewide databuse.',
          'I understand that if the person responsible for employment decisions or the administrator of a program, activity or service has a reasonable belief that I was arrested or convicted for an offense that would constitute grounds for denying employment or participation in a program, activity or service under the Child Protective Services Law, or was named as perpetrator in a founded or indicated report, or I have provided notice as required under this section, the person responsible for employment decisions or administrator of a program, activity or service shall immediately require me to submit current certifications obtained through the Department of Human Services, the Pennsylvania State Police, and the Federal Bureau of Investigation. The cost of certifications shall be bome by the employing entity or program, activity or service.',
          'I understand that if I willfully fail to disclose information required above, I commit a misdemeanor of the third degree and shall be subject to discipline up to and including termination or denial of employment.',
          'I understand that certifications obtained for employment purposes may be used to apply for employment, serve as an employee, apply to volunteer and serve as a volunteer.',
          'I understand that the person responsible for employment decisions or the administrator of a program, activity or service is required to maintain a copy of my certifications,',
          'I hereby swear/affirm that the information as set forth above is true and correct. I understand that false swearing is a misdemeanor pursuant to Section 4903 of the Crimes Code.',
        ].map((text, i) => (
          <p key={i} className="mb-2 sm:mb-3 text-xs sm:text-sm">{text}</p>
        ))}

        {/* Witness and Applicant Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 sm:gap-y-0 items-end">
          {/* Row 1: Witness and Signature */}
          <div className="flex items-center">
            <label className="block font-bold text-xs sm:text-sm">Witness:</label>
            <div className="flex-grow">
              <input
                type="text"
                name="witness"
                value={formData.witness}
                onChange={handleChange}
                className="w-full border-b border-black focus:outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="block font-bold mt-16 sm:mt-20 text-xs sm:text-sm">Signature:</label>
            <div className="flex-grow border-b border-black pb-1" style={{ height: '80px' }}>
              <SignatureCanvas
                ref={witnessSigCanvas}
                penColor='black'
                canvasProps={{ className: 'sigCanvas', width: 150, height: 80 }}
                clearOnResize={false}
                backgroundColor='rgba(0,0,0,0)'
              />
            </div>
          </div>
          {/* Row 2: Name and Signature (Pad) */}
          <div className="flex items-center gap-x-2">
            <label className="block font-bold text-xs sm:text-sm">Name:</label>
            <div className="flex-grow">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b border-black focus:outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <label className="block font-bold mt-16 sm:mt-20 text-xs sm:text-sm">Signature:</label>
            <div className="flex-grow border-b border-black pb-1" style={{ height: '80px' }}>
              <SignatureCanvas
                ref={sigCanvas}
                penColor='black'
                canvasProps={{ className: 'sigCanvas', width: 150, height: 80 }}
                clearOnResize={false}
                backgroundColor='rgba(0,0,0,0)'
              />
            </div>
          </div>
        </div>

        {/* Guardian Section */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 items-end">
          <p className="font-bold mb-2 sm:mb-3 col-span-full text-xs sm:text-sm">If the employee is a minor:</p>
          {/* Row 1: Parent/Legal Guardian Name */}
          <div className="flex items-center gap-x-2 col-span-full">
            <label className="block font-bold text-xs sm:text-sm">Parent/Legal Guardian Name:</label>
            <div className="flex-grow">
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className="w-full border-b border-black focus:outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
          {/* Row 2: Signature and Date */}
          <div className="flex items-center gap-x-2">
            <label className="block font-bold mt-16 sm:mt-20 text-xs sm:text-sm">Signature:</label>
            <div className="flex-grow border-b border-black pb-1" style={{ height: '80px' }}>
              <SignatureCanvas
                ref={guardianSigCanvas}
                penColor='black'
                canvasProps={{ className: 'sigCanvas', width: 150, height: 80 }}
                clearOnResize={false}
                backgroundColor='rgba(0,0,0,0)'
              />
            </div>
            <button
              type="button"
              onClick={() => guardianSigCanvas.current?.clear()}
              className="mt-2 px-2 sm:px-3 py-1 sm:py-2 text-[10px] sm:text-xs text-red-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear Signature
            </button>
          </div>
          <div className="flex items-center gap-x-2 mt-2 sm:mt-4">
            <label className="block font-bold text-xs sm:text-sm">Date:</label>
            <div className="flex-grow">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border-b border-black focus:outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 sm:mt-10 bg-black text-white font-bold px-4 sm:px-56 text-nowrap py-2 rounded hover:bg-gray-800 transition-colors duration-200 w-full sm:w-auto text-xs sm:text-sm"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
}
