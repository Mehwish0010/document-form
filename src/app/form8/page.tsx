"use client"
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';

export default function EmploymentForm() {
  const employeeSignaturePadRef = useRef<SignaturePad>(null);

  // State for Section 1
  const [section1, setSection1] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    otherLastNames: '',
    address: '',
    aptNumber: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    telephone: '',
    citizenshipStatus: '',
    uscisNumber: '',
    i94Number: '',
    passportNumber: '',
    employeeSignature: '',
    employeeDate: ''
  });

  // State for Section 2
  const [section2, setSection2] = useState({
    document1: {
      title: '',
      authority: '',
      number: '',
      expiration: ''
    },
    document2: {
      title: '',
      authority: '',
      number: '',
      expiration: ''
    },
    document3: {
      title: '',
      authority: '',
      number: '',
      expiration: ''
    },
    certificationDate: '',
    employerName: '',
    employerSignature: '',
    employerBusiness: '',
    employerAddress: ''
  });

  // Job Application Info
  const [jobAppInfo, setJobAppInfo] = useState({
    jobAppFullName: '',
    jobRole: '',
    location: ''
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const saved = localStorage.getItem('jobApplicationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setJobAppInfo({
          jobAppFullName: parsed.fullName || '',
          jobRole: parsed.jobRole || '',
          location: parsed.location || ''
        });
      } catch {}
    }
  }, []);

  const handleSection1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSection1(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSection2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setSection2(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, string>),
        [field]: value
      }
    }));
  };

  const handleEmployeeSignatureChange = () => {
    if (employeeSignaturePadRef.current) {
      const signatureData = employeeSignaturePadRef.current.toDataURL();
      setSection1(prev => ({
        ...prev,
        employeeSignature: signatureData
      }));
    }
  };

  const clearEmployeeSignature = () => {
    if (employeeSignaturePadRef.current) {
      employeeSignaturePadRef.current.clear();
      setSection1(prev => ({
        ...prev,
        employeeSignature: ''
      }));
    }
  };

  const handleJobAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobAppInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Collect all form data
      const formData = {
        jobAppFullName: jobAppInfo.jobAppFullName,
        jobRole: jobAppInfo.jobRole,
        location: jobAppInfo.location,
        section1: {
          lastName: section1.lastName || '',
          firstName: section1.firstName || '',
          middleInitial: section1.middleInitial || '',
          otherLastNames: section1.otherLastNames || '',
          address: section1.address || '',
          aptNumber: section1.aptNumber || '',
          city: section1.city || '',
          state: section1.state || '',
          zipCode: section1.zipCode || '',
          dateOfBirth: section1.dateOfBirth || '',
          ssn: section1.ssn || '',
          email: section1.email || '',
          telephone: section1.telephone || '',
          citizenshipStatus: section1.citizenshipStatus || '',
          uscisNumber: section1.uscisNumber || '',
          i94Number: section1.i94Number || '',
          passportNumber: section1.passportNumber || '',
          employeeSignature: section1.employeeSignature || '',
          employeeDate: section1.employeeDate || ''
        },
        section2: {
          document1: {
            title: section2.document1?.title || '',
            authority: section2.document1?.authority || '',
            number: section2.document1?.number || '',
            expiration: section2.document1?.expiration || ''
          },
          document2: {
            title: section2.document2?.title || '',
            authority: section2.document2?.authority || '',
            number: section2.document2?.number || '',
            expiration: section2.document2?.expiration || ''
          },
          document3: {
            title: section2.document3?.title || '',
            authority: section2.document3?.authority || '',
            number: section2.document3?.number || '',
            expiration: section2.document3?.expiration || ''
          },
          certificationDate: section2.certificationDate || '',
          employerName: section2.employerName || '',
          employerSignature: section2.employerSignature || '',
          employerBusiness: section2.employerBusiness || '',
          employerAddress: section2.employerAddress || ''
        }
      };

      console.log('Submitting form data:', JSON.stringify(formData, null, 2));

      const response = await fetch('/api/form8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        setNotification({ message: '✅ Form submitted successfully! Check your email for the PDF.', type: 'success' });
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setNotification({ message: '❌ Failed to submit form. Please try again.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[1100px] mx-auto border border-black p-2 sm:p-4 text-[14px] sm:text-[16px] leading-tight font-serif">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-4 sm:gap-0">
        {/* Logo Section */}
        <div className="w-24 sm:w-30 h-24 sm:h-30">
          <Image 
            src="/logouss.png" 
            alt="USCIS Logo" 
            width={120}
            height={120}
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Heading Section */}
        <div className="text-center flex-1 px-2 sm:px-4">
          <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap">Employment Eligibility Verification</h1>
          <p className="text-lg sm:text-xl font-bold whitespace-nowrap">
            Department of Homeland Security<br />
            <span className="text-gray-600 text-sm sm:text-md font-medium">U.S. Citizenship and Immigration Services</span>
          </p>
        </div>

        {/* Form Number Section */}
        <div className="text-center sm:text-right text-[14px] sm:text-[16px] font-semibold">
          <span className="text-lg sm:text-xl font-semibold">USCIS<br />Form I-9</span><br />
          <span className="text-sm sm:text-md font-medium whitespace-nowrap">OMB No. 1615-0047</span><br />
          <span className="text-sm sm:text-md font-medium whitespace-nowrap">Expires 07/31/2026</span>
        </div>
      </div>

      <hr className='border-5' />
      <hr className='border mt-2' />

      <div className="mt-2 text-xs sm:text-sm text-black font-bold">
        <strong>START HERE:</strong> Employers must ensure the form instructions are available to employees when completing this form...
        <p className='font-medium'>
          ANTI-DISCRIMINATION NOTICE: All employees can choose which acceptable documentation...
        </p>
      </div>

      {/* Job Application Information */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-center bg-black text-white py-2 rounded">Job Application Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="jobAppFullName"
              value={jobAppInfo.jobAppFullName}
              onChange={handleJobAppChange}
              className="w-full border-b border-black px-2 py-1"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Job Role</label>
            <input
              type="text"
              name="jobRole"
              value={jobAppInfo.jobRole}
              onChange={handleJobAppChange}
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
              value={jobAppInfo.location}
              onChange={handleJobAppChange}
              className="w-full border-b border-black px-2 py-1"
              placeholder="Enter location"
              required
            />
          </div>
        </div>
      </section>

      <div className="border border-black mt-2">
        <h1 className="font-medium text-sm sm:text-md bg-gray-300 p-2">
          <span className='font-bold'>Section 1. Employee Information and Attestation: </span>
          <span>Employees must complete and sign Section 1 of Form I-9 no later than the <span className='font-semibold'>first day of employment</span>, but not before accepting a job offer.</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
          <div><label className="text-xs sm:text-sm font-medium ml-2">Last Name (Family Name)</label><input 
            name="lastName"
            value={section1.lastName}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-xs sm:text-sm font-medium">First Name (Given Name)</label><input 
            name="firstName"
            value={section1.firstName}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-xs sm:text-sm font-medium">Middle Initial</label><input 
            name="middleInitial"
            value={section1.middleInitial}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-xs sm:text-sm font-medium">Other Last Names Used (if any)</label><input 
            name="otherLastNames"
            value={section1.otherLastNames}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-2">
          {/* Address */}
          <div className="flex flex-col w-full sm:w-[250px]">
            <label className="text-xs sm:text-sm font-medium ml-2">Address (Street Number and Name)</label>
            <input 
              name="address"
              value={section1.address}
              onChange={handleSection1Change}
              className="border border-black p-1 w-full bg-blue-100" />
          </div>

          {/* Apt Number */}
          <div className="flex flex-col w-full sm:w-[150px]">
            <label className="text-xs sm:text-sm font-medium">Apt. Number (if any)</label>
            <input 
              name="aptNumber"
              value={section1.aptNumber}
              onChange={handleSection1Change}
              className="border border-black bg-blue-100 p-1 w-full" />
          </div>

          {/* City */}
          <div className="flex flex-col w-full sm:w-[200px]">
            <label className="text-xs sm:text-sm font-medium ml-2">City or Town</label>
            <input 
              name="city"
              value={section1.city}
              onChange={handleSection1Change}
              className="border border-black bg-blue-100 p-1 w-full" />
          </div>

          {/* State */}
          <div className="flex flex-col w-full sm:w-[150px]">
            <label className="text-xs sm:text-sm font-medium">State</label>
            <input 
              name="state"
              value={section1.state}
              onChange={handleSection1Change}
              className="border border-black bg-blue-100 p-1 w-full" />
          </div>

          {/* ZIP Code */}
          <div className="flex flex-col w-full sm:w-[150px]">
            <label className="text-xs sm:text-sm font-medium">ZIP Code</label>
            <input 
              name="zipCode"
              value={section1.zipCode}
              onChange={handleSection1Change}
              className="border border-black bg-blue-100 p-1 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2">
          <div><label className="text-xs sm:text-sm font-medium ml-2">Date of Birth (mm/dd/yyyy)</label><input 
            name="dateOfBirth"
            value={section1.dateOfBirth}
            onChange={handleSection1Change}
            className="border bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-xs sm:text-sm font-medium">U.S. Social Security Number</label><input 
            name="ssn"
            value={section1.ssn}
            onChange={handleSection1Change}
            className="border bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-xs sm:text-sm font-medium">Employee&apos;s Email Address</label><input 
            name="email"
            value={section1.email}
            onChange={handleSection1Change}
            className="border bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-xs sm:text-sm font-medium">Employee&apos;s Telephone Number</label><input 
            name="telephone"
            value={section1.telephone}
            onChange={handleSection1Change}
            className="border border-black p-1 bg-blue-100 w-full" placeholder="" /></div>
        </div>

        {/* Signature and Date Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[14px] sm:text-[16px] mt-4">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            <label className="block font-medium">Signature of Employee</label>
            <div className="border border-gray-300 rounded">
              <SignaturePad
                ref={employeeSignaturePadRef}
                canvasProps={{
                  className: 'signature-canvas w-full h-24 sm:h-32 bg-white',
                }}
                onEnd={handleEmployeeSignatureChange}
              />
            </div>
            <button
              type="button"
              onClick={clearEmployeeSignature}
              className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800"
            >
              Clear Signature
            </button>
          </div>
          <div className="w-full sm:w-[48%]">
            <label className="block font-medium">Today&apos;s Date (mm/dd/yyyy)</label>
            <input type="text" className="w-full p-2 bg-blue-100 text-xs" />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="border-t border-b border-black my-4 py-2">
        <div className="p-2 mt-4 text-xs flex flex-col gap-4">
          {/* Paragraph + Checkbox in Horizontal Layout */}
          <div className="flex flex-col sm:flex-row">
            {/* Paragraph block (left side) */}
            <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
              <p className='font-bold text-[12px] sm:text-[13px] p-3 sm:p-5 border'>
                I am aware that federal law provides for imprisonment and/or fines for false statements, or the use of false documents, in connection with the completion of this form. I attest, under penalty of perjury, that this information, including my selection of the box attesting to my citizenship or immigration status, is true and
              </p>
            </div>
            <div className="border text-xs flex flex-col gap-4 w-full sm:w-3/4">
              {/* Checkbox Section with Paragraph */}
              <div className="flex gap-4 w-full max-h-min">
                <div className="w-full p-2">
                  <p className='text-[14px] sm:text-[16px]'>
                    Check one of the following boxes to attest to your citizenship or immigration status 
                    <span className="block text-[14px] sm:text-[16px] italic">(See page 2 and 3 of the instructions.)</span>
                  </p>

                  <div className="flex items-start border-b border-black text-[14px] sm:text-[16px]">
                    <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
                    <span className="p-1">1. A citizen of the United States</span>
                  </div>
                  <div className="flex items-start border-b border-black text-[14px] sm:text-[16px]">
                    <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
                    <span className="p-1">
                      2. A noncitizen national of the United States
                      <span className="italic"> (See instructions.)</span>
                    </span>
                  </div>
                  <div className="flex items-start border-b border-black text-[14px] sm:text-[16px]">
                    <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
                    <span className="p-1">
                      3. A lawful permanent resident
                      <span className="italic"> (Enter USCIS or A-Number)</span>
                    </span>
                  </div>
                  <div className="flex items-start text-[14px] sm:text-[16px]">
                    <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
                    <span className="p-1">
                      4. An alien authorized to work (other than Numbers 2 and 3 above) until
                      <span className="ml-1 italic">(exp. date, if any)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Note Paragraph */}
              <p className="text-[14px] sm:text-[16px] ml-2 bg-blue-100">
                If you check Item Number 4., enter one of these:
              </p>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] sm:text-[12px]">
                <div className='border ml-2 p-1'>
                  <label className="block text-[12px] sm:text-[14px]">USCIS A-Number</label>
                  <input type="text" className="border-t border-black w-full h-[40px] sm:h-[52px] text-xs bg-blue-100" />
                </div>
                <div className='border ml-2 p-1'>
                  <label className="block font-medium text-[12px] sm:text-[14px]">Form I-94 Admission Number</label>
                  <input type="text" className="border-t border-black w-full p-1 text-xs h-[40px] sm:h-[52px] bg-blue-100" />
                </div>
                <div className='border ml-2 p-2'>
                  <label className="block font-medium text-[12px] sm:text-[14px]">Foreign Passport Number and Country of Issuance</label>
                  <input type="text" className="border-t border-black w-full p-1 h-[32px] text-xs bg-blue-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-4 min-w-[800px]">
          <thead>
            <tr>
              <th className="w-[25%] border border-gray-800 p-1"></th>
              <th className="w-[25%] border border-gray-800 p-1">LIST A</th>
              <th className="w-[25%] border border-gray-800 p-1">LIST B</th>
              <th className="w-[25%] border border-gray-800 p-1">LIST C</th>
            </tr>
          </thead>
          <tbody>
            {/* Document rows with responsive text */}
            <tr>
              <td className="border border-gray-800 p-1 font-bold bg-gray-200 text-[12px] sm:text-[14px]">Document Title 1</td>
              <td className="border border-gray-800 p-1 h-8">
                <input 
                  name="document1.title"
                  value={section2.document1.title}
                  onChange={handleSection2Change}
                  className="w-full bg-blue-100 p-1 text-[12px] sm:text-[14px]" 
                  type="text" 
                />
              </td>
              {/* ... other cells with similar responsive classes ... */}
            </tr>
            {/* ... other rows ... */}
          </tbody>
        </table>
      </div>

      {/* Lists Section */}
      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4 border-1 border-black">
        {/* List A */}
        <div className="border border-black w-full sm:w-1/3 p-2 sm:p-4">
          <h4 className="font-bold text-center mb-1 pb-1 border-black text-[14px] sm:text-[16px]">LIST A</h4>
          <p className='border-b text-xs sm:text-sm font-semibold mb-1'>Documents Establish Both Identity and Employment Authorization</p>
          <ol className="text-xs sm:text-sm list-decimal pl-5 divide-y divide-black">
            {/* ... list items with responsive text ... */}
          </ol>
        </div>

        {/* List B and C with similar responsive classes */}
      </div>

      {/* Acceptable Receipts Section */}
      <div className="max-w-6xl mx-auto p-2 sm:p-4 font-sans">
        <div className="text-center mb-4">
          <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider">
            Acceptable Receipts
          </h1>
          <p className="text-xs sm:text-sm mt-1 font-semibold">
            May be presented in lieu of a document listed above for a temporary period.
          </p>
        </div>

        {/* Receipts Table */}
        <div className="overflow-x-auto">
          <div className="border border-gray-800 min-w-[800px]">
            <div className="grid grid-cols-1 sm:grid-cols-4">
              {/* ... table content with responsive text ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button and Notification */}
      <div className="mt-8 text-center">
        {/* Notification ABOVE the button */}
        {notification && (
          <div className={`mb-4 p-4 rounded border flex items-center justify-between shadow-lg transition-all duration-300 ${notification.type === 'success' ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800'}`}>
            <span className="text-base sm:text-lg font-semibold">{notification.message}</span>
            <button type="button" className="ml-4 font-bold text-xl focus:outline-none" onClick={() => setNotification(null)} aria-label="Close">&times;</button>
          </div>
        )}
        <button 
          type="submit"
          className="bg-black text-white px-4 sm:px-26 py-2 sm:py-4 rounded transition-colors w-full sm:w-auto text-sm sm:text-base"
        >
          Submit Form
        </button>
      </div>
    </form>
  );
}
