'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "../../components/ui/card";

import { Label } from "../../components/ui/label";

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
  jobAppFullName: string;
  jobRole: string;
  location: string;
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
    jobAppFullName: '',
    jobRole: '',
    location: '',
  });

  const signaturePadRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jobApplicationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          jobAppFullName: parsed.fullName || '',
          jobRole: parsed.jobRole || '',
          location: parsed.location || '',
        }));
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const signatureDataUrl = signaturePadRef.current?.toDataURL() || '';

      const formToSend = {
        ...formData,
        signature: signatureDataUrl,
        name: formData.jobAppFullName
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
          jobAppFullName: '',
          jobRole: '',
          location: '',
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
    } catch {
      console.error('Form submission error');
      alert('Failed to submit form. Please try again.');
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
    localStorage.setItem(name, value);
  };

  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    localStorage.setItem(name, checked.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-12 font-sans">
      <div className="max-w-5xl mx-auto px-2 sm:px-6">
        <Card className="bg-white shadow-lg border-black border-1">
          <CardContent className="p-4 sm:p-10">
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-6 sm:mb-10">
                <h1 className="text-xl sm:text-3xl font-bold text-black">ARREST/CONVICTION REPORT AND CERTIFICATION FORM</h1>
                <p className="text-base sm:text-lg text-black font-semibold">(under Act 24 of 2011 and Act 82 of 2012)</p>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl text-center font-semibold text-white bg-black">Job Application Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mt-4 sm:mt-6 items-center">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="jobAppFullName" className="text-sm sm:text-base font-semibold text-gray-700">Full Name:</Label>
                    <input
                      type="text"
                      id="jobAppFullName"
                      name="jobAppFullName"
                      value={formData.jobAppFullName}
                      onChange={handleChange}
                      className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 border-b border-black p-0"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="jobRole" className="text-sm sm:text-base font-semibold text-gray-700">Job Role:</Label>
                    <input
                      type="text"
                      id="jobRole"
                      name="jobRole"
                      value={formData.jobRole}
                      onChange={handleChange}
                      className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 border-b border-black p-0"
                      placeholder="Enter job role"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location" className="text-sm sm:text-base font-semibold text-gray-700">Location:</Label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 border-b border-black p-0"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl text-center font-semibold text-white bg-black">Section 1. Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-4 sm:mt-6 items-center">
                  <div className="space-y-4 sm:space-y-8 mt-2 sm:mt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Label htmlFor="fullName" className="text-sm sm:text-base font-semibold text-gray-700 whitespace-normal sm:whitespace-nowrap">
                        Full Legal Name:
                      </Label>
                      <div className="w-full border-b border-black">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-4">
                    <Label htmlFor="dateOfBirth" className="text-sm sm:text-base font-semibold text-gray-700 whitespace-normal sm:whitespace-nowrap">
                      Date of Birth:
                    </Label>

                    <div className="flex items-center gap-1 sm:gap-2">
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
                  </div>

                  <div className="space-y-4 sm:space-y-8 mt-2 sm:mt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Label htmlFor="otherNames" className="text-sm sm:text-base font-semibold text-gray-700 whitespace-normal sm:whitespace-nowrap">
                        Other names by<br />which you have<br />been identified:
                      </Label>
                      <div className="w-full border-b border-black">
                        <input
                          type="text"
                          id="otherNames"
                          name="otherNames"
                          value={formData.otherNames}
                          onChange={handleChange}
                           className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-center text-white bg-black p-1">Section 2. Arrest or Conviction</h2>
                <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                  <div className="flex items-start">
                    <Checkbox
                      id="hasNotBeenArrestedOrConvicted"
                      checked={formData.hasNotBeenArrestedOrConvicted}
                      onCheckedChange={(checked) => handleCheckboxChange('hasNotBeenArrestedOrConvicted', checked)}
                      className="mt-1 mr-2 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 border-black rounded text-white focus:ring-gray-500 focus:ring-2"
                    />
                    <Label htmlFor="hasNotBeenArrestedOrConvicted" className="text-base sm:text-lg font-medium text-gray-900">
                      By checking this box, I state that I have NOT been arrested for or convicted of any Reportable Offense.
                    </Label>
                  </div>

                  <div className="flex items-start">
                    <Checkbox
                      id="hasBeenArrestedOrConvicted"
                      checked={formData.hasBeenArrestedOrConvicted}
                      onCheckedChange={(checked) => handleCheckboxChange('hasBeenArrestedOrConvicted', checked)}
                      className="mt-1 mr-2 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 border-black rounded bg-gray-300 text-white focus:ring-gray-500 focus:ring-2"
                    />
                    <Label htmlFor="hasBeenArrestedOrConvicted" className="text-sm sm:text-md font-medium text-gray-900">
                      By checking this box, I report that I have been arrested for or convicted of an offense or offenses enumerated under 24 P.S. §§1-111(e) or (f. 1) (&quot;Reportable Offense(s)&quot;). See Page 3 of this Form for a list of Reportable Offenses.
                    </Label>
                  </div>

                  <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-white bg-black p-1 ml-4 sm:ml-20">Details of Arrests or Convictions</h3>
                    <p className="text-sm sm:text-md text-black text-bold ml-4 sm:ml-24">
                      For each arrest for or conviction of any Reportable Offense, specify in the space below (or on additional attachments if necessary) the offense for which you have been arrested or convicted, the date and location of arrest and/or conviction, docket number, and the applicable court.
                    </p>
                    <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
                      <input
                        type="text"
                        id="arrestDetail1"
                        name="arrestDetail1"
                        value={formData.arrestDetail1}
                        onChange={handleChange}
                        className="w-full sm:w-[800px] border-0 border-b ml-4 sm:ml-20 border-black outline-none placeholder:text-gray-400 text-black bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter arrest details"
                      />
                      <input
                        type="text"
                        id="arrestDetail2"
                        name="arrestDetail2"
                        value={formData.arrestDetail2}
                        onChange={handleChange}
                        className="w-full sm:w-[800px] border-0 border-b ml-4 sm:ml-20 border-black outline-none placeholder:text-gray-400 text-black bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter arrest details"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                 <h2 className="text-lg sm:text-xl font-semibold text-white bg-black p-1 text-center">Section 3. Child Abuse</h2>
                 <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                   <div className="flex items-start">
                     <Checkbox
                       id="hasNotBeenPerpetratorChildAbuse"
                       checked={formData.hasNotBeenPerpetratorChildAbuse}
                       onCheckedChange={(checked) => handleCheckboxChange('hasNotBeenPerpetratorChildAbuse', checked)}
                       className="mt-1 mr-2 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 border-black rounded text-white focus:ring-gray-500 focus:ring-2"
                     />
                     <Label htmlFor="hasNotBeenPerpetratorChildAbuse" className="text-base sm:text-lg font-medium text-gray-900">
                       By checking this box, I state that I have NOT been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.
                     </Label>
                   </div>

                   <div className="flex items-start">
                     <Checkbox
                       id="hasBeenPerpetratorChildAbuse"
                       checked={formData.hasBeenPerpetratorChildAbuse}
                       onCheckedChange={(checked) => handleCheckboxChange('hasBeenPerpetratorChildAbuse', checked)}
                       className="mt-1 mr-2 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 border-black rounded bg-gray-300 text-white focus:ring-gray-500 focus:ring-2"
                     />
                     <Label htmlFor="hasBeenPerpetratorChildAbuse" className="text-base sm:text-lg font-medium text-gray-900">
                       By checking this box, I report that I have been named as a perpetrator of a founded report of child abuse within the past five (5) years as defined by the Child Protective Services Law.
                     </Label>
                   </div>
                 </div>
              </div>

              <div className="mb-6 sm:mb-8">
                 <h2 className="text-lg sm:text-xl font-semibold text-white bg-black p-2 sm:p-3 text-center">Section 4. Certification</h2>
                 <div className="mt-4 sm:mt-6 text-base sm:text-lg text-black leading-relaxed italic">
                   By signing this form, I certify under penalty of law that the statements made in this form are true, correct and complete. I understand that false statements herein, including, without limitation, any failure to accurately report any arrest or conviction for a Reportable Offense, shall subject me to criminal prosecution under 18 Pa.C.S. §4904, relating to unsworn falsification to authorities.
                 </div>
              </div>

              <div className="border-b border-black mt-1">
                <div className="flex flex-col sm:flex-row w-full justify-between">
                  <div className="flex-1">
                    <SignatureCanvas
                      ref={signaturePadRef}
                      canvasProps={{
                        className: 'signature-canvas',
                        width: 500,
                        height: 200
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => signaturePadRef.current?.clear()}
                      className="mt-2 px-3 sm:px-4 py-1 sm:py-2 text-sm text-red-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Clear Signature
                    </button>
                  </div>
                  <div className="flex-1 mt-4 sm:mt-0 sm:ml-8 mb-6 sm:mb-10">
                    <input
                      type="text"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full h-[20px] outline-none mt-38 placeholder:text-gray-400 text-black bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 p-0 text-center text-base sm:text-lg"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full text-black justify-between mt-2 mb-6 sm:mb-10">
                <span className="text-base sm:text-lg">Signature</span>
                <span className="text-base sm:text-lg sm:ml-8">Date</span>
              </div>

              {/* Instructions Section */}
              <div className="mb-6 sm:mb-8 mt-20 sm:mt-40">
                <h2 className="text-2xl sm:text-3xl font-semibold text-black bg-white p-2 sm:p-3 text-center">INSTRUCTIONS</h2>
                <div className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-700 space-y-3 sm:space-y-4">
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
                  <p className="font-semibold text-black text-xl sm:text-2xl mt-4 sm:mt-6 mb-48 sm:mb-96">
                    PROVIDE ALL INFORMATION REQUIRED BY THIS FORM LEGIBLY IN INK.
                  </p>
                  <div className="flex justify-end mt-8 sm:mt-14 text-sm sm:text-md text-black">
                PDE-6004 03/01/2016
              </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center mt-6 sm:mt-8 mb-8 sm:mb-16">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-black text-white text-base sm:text-lg font-semibold rounded hover:bg-gray-800 transition-colors"
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


