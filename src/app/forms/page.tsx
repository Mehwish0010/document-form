'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import SignatureCanvas from 'react-signature-canvas';

interface FormData {
  hasNotBeenArrestedOrConvicted: boolean;
  hasBeenArrestedOrConvicted: boolean;
  arrestConvictionDetails: string;
  hasNotBeenPerpetratorChildAbuse: boolean;
  hasBeenPerpetratorChildAbuse: boolean;
  signature: string;
  date: string;
  arrestDetail1: string;
  arrestDetail2: string;
  fullName: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  otherNames: string;
}

export default function Forms() {
  const [formData, setFormData] = useState<FormData>({
    hasNotBeenArrestedOrConvicted: false,
    hasBeenArrestedOrConvicted: false,
    arrestConvictionDetails: '',
    hasNotBeenPerpetratorChildAbuse: false,
    hasBeenPerpetratorChildAbuse: false,
    signature: '',
    date: '',
    arrestDetail1: '',
    arrestDetail2: '',
    fullName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    otherNames: '',
  });

  const signaturePadRef = useRef<SignatureCanvas>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const signatureDataUrl = signaturePadRef.current?.toDataURL() || '';
  
      const formToSend = {
        ...formData,
        signature: signatureDataUrl,
      };
  
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToSend),
      });
  
      const result = await response.json();
      if (result.success) {
        // Show success message with Tailwind classes
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100';
        successDiv.innerHTML = `
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Form submitted successfully! We'll send you a confirmation email shortly.</span>
          </div>
        `;
        document.body.appendChild(successDiv);
        
        // Remove the message after 5 seconds with fade out
        setTimeout(() => {
          successDiv.classList.add('translate-y-4', 'opacity-0');
          setTimeout(() => successDiv.remove(), 300);
        }, 5000);

        // Clear form
        setFormData({
          hasNotBeenArrestedOrConvicted: false,
          hasBeenArrestedOrConvicted: false,
          arrestConvictionDetails: '',
          hasNotBeenPerpetratorChildAbuse: false,
          hasBeenPerpetratorChildAbuse: false,
          signature: '',
          date: '',
          arrestDetail1: '',
          arrestDetail2: '',
          fullName: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
          otherNames: '',
        });
        if (signaturePadRef.current) {
          signaturePadRef.current.clear();
        }
      } else {
        // Show error message with Tailwind classes
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100';
        errorDiv.innerHTML = `
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Form submission failed: ${result.error}</span>
          </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Remove the message after 5 seconds with fade out
        setTimeout(() => {
          errorDiv.classList.add('translate-y-4', 'opacity-0');
          setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
      }
    } catch (error) {
      // Show error message with Tailwind classes
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100';
      errorDiv.innerHTML = `
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Something went wrong. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      // Remove the message after 5 seconds with fade out
      setTimeout(() => {
        errorDiv.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => errorDiv.remove(), 300);
      }, 5000);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans  ">
      <div className="max-w-5xl mx-auto px-6 ">
        <Card className="bg-white shadow-lg  border-black border-1">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-black text-nowrap">ARREST/CONVICTION REPORT AND CERTIFICATION FORM</h1>
                <p className="text-lg text-black font-semibold whitespace-nowrap">(under Act 24 of 2011 and Act 82 of 2012)</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl text-center font-semibold text-white bg-black ">     Section 1. Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 items-center">
                  <div className="space-y-8 mt-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="fullName" className="text-base font-semibold text-gray-700 whitespace-nowrap">
                        Full Legal Name:
                      </Label>
                      <div className="flex-grow border-b border-black">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Label htmlFor="dateOfBirth" className="text-base font-semibold text-gray-700 whitespace-nowrap">
                      Date of Birth:
                    </Label>

                    {/* Day Input */}
                    <div className="w-10 text-center border-b border-black">
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="DD"
                        className="w-full text-center outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                        name="dobDay"
                        value={formData.dobDay}
                        onChange={handleChange}
                      />
                    </div>

                    <span className="text-gray-700 text-base">/</span>

                    {/* Month Input */}
                    <div className="w-10 text-center border-b border-black">
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        className="w-full text-center outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                        name="dobMonth"
                        value={formData.dobMonth}
                        onChange={handleChange}
                      />
                    </div>

                    <span className="text-gray-700 text-base">/</span>

                    {/* Year Input */}
                    <div className="w-16 text-center border-b border-black">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        className="w-full text-center outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                        name="dobYear"
                        value={formData.dobYear}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-8 mt-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="otherNames" className="text-base font-semibold text-gray-700 whitespace-nowrap">
                        Other names by<br />which you have<br />been identified:
                      </Label>
                      <div className="flex-grow border-b border-black">
                        <input
                          type="text"
                          id="otherNames"
                          name="otherNames"
                          value={formData.otherNames}
                          onChange={handleChange}
                           className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-center text-white bg-black p-1">Section 2. Arrest or Conviction</h2>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start">
                    <Checkbox
                      id="hasNotBeenArrestedOrConvicted"
                      checked={formData.hasNotBeenArrestedOrConvicted}
                      onCheckedChange={(checked) => handleCheckboxChange('hasNotBeenArrestedOrConvicted', checked)}
                      className="mt-1 mr-4 h-5 w-4 border-black rounded text-white focus:ring-gray-500 focus:ring-2"
                    />
                    <Label htmlFor="hasNotBeenArrestedOrConvicted" className="text-lg font-medium text-gray-900">
                      By checking this box, I state that I have NOT been arrested for or convicted of any Reportable Offense.
                    </Label>
                  </div>

                  <div className="flex items-start">
                    <Checkbox
                      id="hasBeenArrestedOrConvicted"
                      checked={formData.hasBeenArrestedOrConvicted}
                      onCheckedChange={(checked) => handleCheckboxChange('hasBeenArrestedOrConvicted', checked)}
                      className="mt-1 mr-4 h-5 w-5 border-black rounded bg-gray-300 text-white focus:ring-gray-500 focus:ring-2"
                    />
                    <Label htmlFor="hasBeenArrestedOrConvicted" className="text-md font-medium text-gray-900">
                      By checking this box, I report that I have been arrested for or convicted of an offense or offenses enumerated under 24 P.S. §§1-111(e) or (f. 1) (&quot;Reportable Offense(s)&quot;). See Page 3 of this Form for a list of Reportable Offenses.
                    </Label>
                  </div>

                  <div className="mt-8 space-y-3">
                    <h3 className="text-xl font-semibold text-white bg-black p-1 ml-20">Details of Arrests or Convictions</h3>
                    <p className="text-md text-black text-bold ml-24">
                      For each arrest for or conviction of any Reportable Offense, specify in the space below (or on additional attachments if necessary) the offense for which you have been arrested or convicted, the date and location of arrest and/or conviction, docket number, and the applicable court.
                    </p>
                    <div className="space-y-6 mt-4">
                      <input
                        type="text"
                        id="arrestDetail1"
                        name="arrestDetail1"
                        value={formData.arrestDetail1}
                        onChange={handleChange}
                        className="w-[800px] border-0 border-b ml-20 border-black outline-none placeholder:text-gray-400 text-black bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder=""
                      />
                      <input
                        type="text"
                        id="arrestDetail2"
                        name="arrestDetail2"
                        value={formData.arrestDetail2}
                        onChange={handleChange}
                        className="w-[800px] border-0 border-b ml-20 border-black outline-none placeholder:text-gray-400 text-black bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                 <h2 className="text-xl font-semibold text-white bg-black p-1 text-center">Section 3. Child Abuse</h2>
                 <div className="space-y-6 mt-6">
                   <div className="flex items-start">
                     <Checkbox
                       id="hasNotBeenPerpetratorChildAbuse"
                       checked={formData.hasNotBeenPerpetratorChildAbuse}
                       onCheckedChange={(checked) => handleCheckboxChange('hasNotBeenPerpetratorChildAbuse', checked)}
                       className="mt-1 mr-4 h-5 w-4 border-black rounded text-white focus:ring-gray-500 focus:ring-2"
                     />
                     <Label htmlFor="hasNotBeenPerpetratorChildAbuse" className="text-lg font-medium text-gray-900">
                       By checking this box, I state that I have NOT been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.
                     </Label>
                   </div>

                   <div className="flex items-start">
                     <Checkbox
                       id="hasBeenPerpetratorChildAbuse"
                       checked={formData.hasBeenPerpetratorChildAbuse}
                       onCheckedChange={(checked) => handleCheckboxChange('hasBeenPerpetratorChildAbuse', checked)}
                       className="mt-1 mr-4 h-5 w-5 border-black rounded bg-gray-300 text-white focus:ring-gray-500 focus:ring-2"
                     />
                     <Label htmlFor="hasBeenPerpetratorChildAbuse" className="text-lg font-medium text-gray-900">
                       By checking this box, I report that I have been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.
                     </Label>
                   </div>
                 </div>
              </div>

              <div className="mb-8">
                 <h2 className="text-xl font-semibold text-white bg-black p-3 text-center">Section 4. Certification</h2>
                 <div className="mt-6 text-lg text-black leading-relaxed italic">
                   By signing this form, I certify under penalty of law that the statements made in this form are true, correct and complete. I understand that false statements herein, including, without limitation, any failure to accurately report any arrest or conviction for a Reportable Offense, shall subject me to criminal prosecution under 18 Pa.C.S. §4904, relating to unsworn falsification to authorities.
                 </div>
              </div>

              <div className="border-b border-black mt-1">
                <div className="flex w-full justify-between">
                  <div className="flex-1">
                    <SignatureCanvas
                      ref={signaturePadRef}
                      canvasProps={{
                        className: 'signature-canvas',
                        width: 500,
                        height: 200
                      }}
                    />
                  </div>
                  <div className="flex-1 ml-8 mb-10">
                    <input
                      type="text"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full h-[20px] outline-none mt-38 placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0 text-center text-lg"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full text-black justify-between mt-2 mb-10">
                <span className="text-lg">Signature</span>
                <span className="text-lg ml-8">Date</span>
              </div>

              {/* Moved Instructions Section to match layout of other sections */}
              <div className="mb-8 mt-40 ">
                <h2 className="text-3xl font-semibold text-black bg-white p-3 text-center">INSTRUCTIONS</h2>
                <div className="mt-6 text-base text-gray-700 space-y-4">
                  <p>
                    Pursuant to 24 P.S. §1-111(c.4) and (j), the Pennsylvania Department of Education developed this standardized form (PDE-6004) to be used by current and prospective employees of public and private schools, intermediate units, and area vocational-technical schools.
                  </p>
                  <p>
                    As required by subsection (c.4) and (j)(2) of 24 P.S. §1-111, this form shall be completed and submitted by all current and prospective employees of said institutions to provide written reporting of any arrest or conviction for an offense enumerated under 24 P.S. §1-111(e) or (f.1) and to provide notification of having been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.
                  </p>
                  <p>
                    As required by subsection (j)(4) of 24 P.S. §1-111, this form also shall be utilized by current and prospective employees to provide written notice within seventy-two (72) hours after a subsequent arrest or conviction for an offense enumerated under 24 P.S. §§1-111(e) or (f.1).
                  </p>
                   <p>
                    In accordance with 24 P.S. §1-111, employees completing this form are required to submit the form to the administrator or other person responsible for employment decisions in a school entity. Please contact a supervisor or the school entity administration office with any questions regarding the PDE 6004, including to whom the form should be sent.
                   </p>
                  <p className="font-semibold text-black text-2xl mt-6 mb-96">
                    PROVIDE ALL INFORMATION REQUIRED BY THIS FORM LEGIBLY IN INK.
                  </p>
                  <div className="flex justify-end  mt-14 text-md text-black">
                PDE-6004 03/01/2016
              </div>
                </div>
           
              </div>
              <hr className="w-full border-black border mt-2"/>
              {/* New Section: LIST OF REPORTABLE OFFENSES */}
              <div className="mb-8 mt-14" style={{ fontFamily: "'Times New Roman', serif" }}>
        <h2 className="font-semibold text-black bg-white p-3 text-center mb-8 text-3xl" style={{ fontFamily: "'Arial', sans-serif" }}>LIST OF REPORTABLE OFFENSES</h2>
        
        <div className="mt-12 text-base space-y-4 text-black mb-16">
          <p className='font-bold text-md mb-6 text-xl' style={{ fontFamily: "'Arial', sans-serif" }}>
            A reportable offense enumerated under 24 P.S. §1-111(e) consists of any of the following:
          </p>
          
          <ol className="list-decimal list-inside ml-4 space-y-2 mb-10">
            <li>
              An offense under one or more of the following provisions of Title 18 of the Pennsylvania Consolidated Statutes:
              <div className="flex mt-2 gap-8">
                <ul className="list-none ml-4 text-lg space-y-0 w-1/2 [&>li]:before:content-['■'] [&>li]:before:mr-2 [&>li]:before:text-black">
                  <li>Chapter 25 (criminal homicide)</li>
                  <li>Section 2702 (aggravated assault)</li>
                  <li>Section 2709.1 (stalking)</li>
                  <li>Section 2901 (kidnapping)</li>
                  <li>Section 2902 (unlawful restraint)</li>
                  <li>Section 2910 (luring a child)</li>
                  <li>Section 3121 (rape)</li>
                  <li>Section 3122.1 (statutory sexual assault)</li>
                  <li>Section 3123 (involuntary deviate sexual intercourse)</li>
                  <li>Section 3124.1 (sexual assault)</li>
                  <li>Section 3124.2 (institutional sexual assault)</li>
                  <li>Section 3125 (aggravated indecent assault)</li>
                  <li>Section 3126 (indecent assault)</li>
                  <li>Section 3127 (indecent exposure)</li>
                  <li>Section 3129 (sexual intercourse with animal)</li>
                  <li>Section 4302 (incest)</li>
                  <li>Section 4303 (concealing death of child)</li>
                </ul>
                <ul className="list-none ml-4 text-lg space-y-1 w-1/2 [&>li]:before:content-['■'] [&>li]:before:mr-2 [&>li]:before:text-black">
                  <li>Section 4304 (relating to endangering welfare of children)</li>
                  <li>Section 4305 (relating to dealing in infant children)</li>
                  <li>A felony offense under section 5902(b) (relating to prostitution and related offenses)</li>
                  <li>Section 5903(c) or (d) (relating to obscene and other sexual materials and performances)</li>
                  <li>Section 6301(a)(1) (relating to corruption of minors)</li>
                  <li>Section 6312 (relating to sexual abuse of children)</li>
                  <li>Section 6318 (relating to unlawful contact with minor)</li>
                  <li>Section 6319 (relating to solicitation of minors to traffic drugs)</li>
                  <li>Section 6320 (relating to sexual exploitation of children)</li>
                </ul>
              </div>
            </li>
            
            <li className='mt-6'>
              An offense designated as a felony under the act of April 14, 1972 (P.L. 233, No. 64), known as "The Controlled Substance, Drug, Device and Cosmetic Act."
            </li>
            
            <li className='mt-6'>
              An offense SIMILAR IN NATURE to those crimes listed above in clauses (1) and (2) under the laws or former laws of:
              <ul className="list-none ml-4 space-y-1 mt-6 text-lg [&>li]:before:content-['■'] [&>li]:before:mr-2 [&>li]:before:text-black">
                <li>the United States; or</li>
                <li>one of its territories or possessions; or</li>
                <li>another state; or</li>
                <li>the District of Columbia; or</li>
                <li>the Commonwealth of Puerto Rico; or</li>
                <li>a foreign nation; or</li>
                <li>under a former law of this Commonwealth.</li>
              </ul>
            </li>
          </ol>
          
          <p className='mt-6 font-bold' style={{ fontFamily: "'Arial', sans-serif" }}>
            A reportable offense enumerated under 24 P.S. §1-111(f.1) consists of any of the following:
          </p>
          
          <div className="ml-4 space-y-4 mt-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-gray-700" style={{ fontFamily: "'Arial', sans-serif" }}>(1)</span>
              <p className="text-lg text-gray-700 leading-relaxed">
                An offense graded as a felony offense of the first, second or third degree, other than one of the offenses enumerated under 24 P.S. §1-111(e), if less than (10) ten years has elapsed from the date of expiration of the sentence for the offense.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-gray-700" style={{ fontFamily: "'Arial', sans-serif" }}>(2)</span>
              <p className="text-lg text-gray-700 leading-relaxed">
                An offense graded as a misdemeanor of the first degree, other than one of the offenses enumerated under 24 P.S. §1-111(e), if less than (5) five years has elapsed from the date of expiration of the sentence for the offense.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-gray-700" style={{ fontFamily: "'Arial', sans-serif" }}>(3)</span>
              <p className="text-lg text-gray-700 leading-relaxed">
                An offense under 75 Pa.C.S. § 3802(a), (b), (c) or (d) (relating to driving under influence of alcohol or controlled substance) graded as a misdemeanor of the first degree under 75 Pa.C.S. § 3803 (relating to grading), if the person has been previously convicted of such an offense and less than (3) three years has elapsed from the date of expiration of the sentence for the most recent offense.
              </p>
            </div>
          </div>
        
                </div>
              </div>

              {/* PDE-6004 footer */}
              <div className="flex justify-end text-md text-black mt-32">
                PDE-6004 03/01/2016
              </div>
              
              <div className="flex justify-center mt-8 mb-16">
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white text-lg font-semibold rounded hover:bg-gray-800 transition-colors"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 


